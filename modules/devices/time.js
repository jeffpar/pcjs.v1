/**
 * @fileoverview Provides support for both time-based and cycle-based callbacks
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2017
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * PCjs is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * PCjs is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with PCjs.  If not,
 * see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every modified copy of this work
 * and to display that copyright notice when the software starts running; see COPYRIGHT in
 * <http://pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * Timer objects
 *
 * addTimer() and setTimer() create and manage Timer objects that are used for operations that must
 * occur after a certain amount of "real time" has elapsed (eg, key/button events that need to be timed-out
 * after a predefined period, display refreshes that need to occur every 60hz, periodic yields to ensure
 * that the browser remains responsive, etc).
 *
 * These functions are preferred over JavaScript's setTimeout(), because our timers convert "real time"
 * into cycle countdowns, which are effectively paused whenever cycle generation is paused (eg, when the
 * Debugger halts execution).  Moreover, setTimeout() handlers only run after run() yields, which is far too
 * granular for some devices (eg, when a serial port tries to simulate interrupts at 9600 baud).
 *
 * addClocker() should be used for devices that are cycle-driven (ie, that need to be "clocked") rather than
 * time-driven; they must define a clocker() function and install it with addClocker().
 *
 * @typedef {Object} Timer
 * @property {string} id
 * @property {function()} callBack
 * @property {number} msAuto
 * @property {number} nCyclesLeft
 */

/**
 * @class {Time}
 * @unrestricted
 * @property {number} nCyclesPerSecond
 */
class Time extends Device {
    /**
     * Time(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 1600000,
     *        "bindings": {
     *          "run": "runTI57",
     *          "speed": "speedTI57",
     *          "step": "stepTI57"
     *        }
     *      }
     *
     * @this {Time}
     * @param {string} idMachine
     * @param {string} [idDevice]
     * @param {Object} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.nCyclesPerSecond = config['cyclesPerSecond'] || 1600000;
        this.nBaseMultiplier = this.nCurrentMultiplier = this.nTargetMultiplier = 1;
        this.mhzBase = Math.round(this.nCyclesPerSecond / 10000) / 100;
        this.mhzCurrent = this.mhzTarget = this.mhzBase * this.nTargetMultiplier;
        this.nYields = 0;
        this.msYield = Math.round(1000 / Time.YIELDS_PER_SECOND);
        this.aTimers = [];
        this.aClockers = [];
        this.fRunning = this.fYield = false;
        this.idRunTimeout = 0;
        this.onRunTimeout = this.run.bind(this);
        let time = this;
        this.timerYield = this.addTimer("timerYield", function() {
            time.fYield = true;
            if (++time.nYields == Time.YIELDS_PER_SECOND) {
                time.nYields = 0;
                time.updateStatus();
            }
        }, this.msYield);
        this.resetSpeed();
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Time}
     * @param {string} binding
     * @param {HTMLElement} element
     */
    addBinding(binding, element)
    {
        let time = this;

        switch(binding) {

        case Time.BINDING.RUN:
            this.bindings[binding] = element;
            element.onclick = function onClickRun() {
                if (!time.fRunning) {
                    time.start();
                } else {
                    time.stop();
                }
            };
            break;

        case Time.BINDING.SPEED:
            this.bindings[binding] = element;
            break;

        case Time.BINDING.SETSPEED:
            this.bindings[binding] = element;
            element.onclick = function onClickSetSpeed() {
                time.setSpeed(time.nTargetMultiplier << 1);
            };
            this.updateBindingText(binding, this.getSpeedTarget());
            break;

        case Time.BINDING.STEP:
            this.bindings[binding] = element;
            element.onclick = function onClickStep() {
                if (!time.step()) {
                    time.println("already running");
                }
            };
            break;

        default:
            super.addBinding(binding, element);
            break;
        }
    }

    /**
     * addClocker(clocker)
     *
     * @this {Time}
     * @param {function(boolean)} clocker
     */
    addClocker(clocker)
    {
        this.aClockers.push(clocker);
    }

    /**
     * addTimer(id, callBack, msAuto)
     *
     * Devices that want to have timers that fire after some number of milliseconds call addTimer() to create
     * the timer, and then setTimer() when they want to arm it.  Alternatively, they can specify an automatic
     * timeout value (in milliseconds) to have the timer fire automatically at regular intervals.  There is
     * currently no removeTimer() because these are generally used for the entire lifetime of a device.
     *
     * A timer is initially dormant; dormant timers have a cycle count of -1 (although any negative number will
     * suffice) and active timers have a non-negative cycle count.
     *
     * @this {Time}
     * @param {string} id
     * @param {function()} callBack
     * @param {number} [msAuto] (if set, enables automatic setTimer calls)
     * @returns {number} timer index (1-based)
     */
    addTimer(id, callBack, msAuto = -1)
    {
        let nCyclesLeft = -1;
        let iTimer = this.aTimers.length + 1;
        this.aTimers.push({id, callBack, msAuto, nCyclesLeft});
        if (msAuto >= 0) this.setTimer(iTimer, msAuto);
        return iTimer;
    }

    /**
     * calcCycles()
     *
     * Calculate the maximum number of cycles we should attempt to process before the next yield.
     *
     * @this {Time}
     */
    calcCycles()
    {
        let nMultiplier = this.mhzCurrent / this.mhzBase;
        if (!nMultiplier || nMultiplier > this.nTargetMultiplier) {
            nMultiplier = this.nTargetMultiplier;
        }
        this.nCyclesPerYield = Math.floor(this.nCyclesPerSecond / Time.YIELDS_PER_SECOND * nMultiplier);
        this.nCurrentMultiplier = nMultiplier;
    }

    /**
     * calcSpeed(nCycles, msElapsed)
     *
     * @this {Time}
     * @param {number} nCycles
     * @param {number} msElapsed
     */
    calcSpeed(nCycles, msElapsed)
    {
        if (msElapsed) {
            this.mhzCurrent = Math.round(nCycles / (msElapsed * 10)) / 100;
        }
    }

    /**
     * doBurst(nCycles, fStep)
     *
     * @this {Time}
     * @param {number} nCycles
     * @param {boolean} [fStep]
     * @returns {number} (number of cycles actually executed)
     */
    doBurst(nCycles, fStep)
    {
        this.nCyclesBurst = this.nCyclesRemain = nCycles;
        if (!this.aClockers.length) {
            this.nCyclesRemain = 0;
            return this.nCyclesBurst;
        }
        let iClocker = 0;
        while (this.nCyclesRemain > 0) {
            let nCycles = 0;
            if (iClocker < this.aClockers.length) {
                nCycles = this.aClockers[iClocker++](fStep) || 1;
            } else {
                iClocker = 0;
            }
            this.nCyclesRemain -= nCycles;
        }
        return this.nCyclesBurst - this.nCyclesRemain;
    }

    /**
     * doOutside(fn)
     *
     * Use this function to perform any work outside of normal time (eg, DOM updates),
     * to prevent that work from disrupting our speed calculations.
     *
     * @this {Time}
     * @param {function()} fn (should return true only if the function actually performed any work)
     * @returns {boolean}
     */
    doOutside(fn)
    {
        let msStart = Date.now();
        if (fn()) {
            let msStop = Date.now();
            this.msOutsideThisRun += msStop - msStart;
            return true;
        }
        return false;
    }

    /**
     * endBurst(nCycles)
     *
     * @this {Time}
     * @param {number} [nCycles]
     * @returns {number} (number of cycles executed in burst)
     */
    endBurst(nCycles = this.nCyclesBurst - this.nCyclesRemain)
    {
        this.nCyclesBurst = this.nCyclesRemain = 0;
        this.nCyclesThisRun += nCycles;
        this.nCyclesRun += nCycles;
        if (!this.fRunning) this.nCyclesRun = 0;
        return nCycles;
    }

    /**
     * getCycles(ms)
     *
     * @this {Time}
     * @param {number} ms
     * @returns {number} number of corresponding cycles
     */
    getCycles(ms)
    {
        return ((this.nCyclesPerSecond * this.nCurrentMultiplier) / 1000 * ms)|0;
    }

    /**
     * getCyclesPerBurst()
     *
     * This tells us how many cycles to execute as a burst.
     *
     * @this {Time}
     * @returns {number} (the maximum number of cycles we should execute in the next burst)
     */
    getCyclesPerBurst()
    {
        let nCycles = this.getCycles(this.msYield);
        for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
            let timer = this.aTimers[iTimer-1];
            this.assert(!isNaN(timer.nCyclesLeft));
            if (timer.nCyclesLeft < 0) continue;
            if (nCycles > timer.nCyclesLeft) {
                nCycles = timer.nCyclesLeft;
            }
        }
        return nCycles;
    }

    /**
     * getSpeed()
     *
     * @this {Time}
     * @returns {number} the current speed multiplier
     */
    getSpeed()
    {
        return this.nTargetMultiplier;
    }

    /**
     * getSpeedCurrent()
     *
     * @this {Time}
     * @returns {string} the current speed, in mhz, as a string formatted to two decimal places
     */
    getSpeedCurrent()
    {
        return ((this.fRunning && this.mhzCurrent)? (this.mhzCurrent.toFixed(2) + "Mhz") : "Stopped");
    }

    /**
     * getSpeedTarget()
     *
     * @this {Time}
     * @returns {string} the target speed, in mhz, as a string formatted to two decimal places
     */
    getSpeedTarget()
    {
        return this.mhzTarget.toFixed(2) + "Mhz";
    }

    /**
     * resetSpeed()
     *
     * Resets speed and cycle information as part of any reset() or restore(); this typically occurs during powerUp().
     * It's important that this be called BEFORE the actual restore() call, because restore() may want to call setSpeed(),
     * which in turn assumes that all the cycle counts have been initialized to sensible values.
     *
     * @this {Time}
     */
    resetSpeed()
    {
        this.nCyclesRun = this.nCyclesBurst = this.nCyclesRemain = 0;
        this.setSpeed(this.nBaseMultiplier);
    }

    /**
     * resetTimers()
     *
     * When the target speed multiplier is altered, it's a good idea to run through all the timers that
     * have a fixed millisecond period and re-arm them, because the timers are using cycle counts that were based
     * on a previous multiplier.
     *
     * @this {Time}
     */
    resetTimers()
    {
        for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
            let timer = this.aTimers[iTimer-1];
            if (timer.msAuto >= 0) this.setTimer(iTimer, timer.msAuto, true);
        }
    }

    /**
     * run()
     *
     * @this {Time}
     */
    run()
    {
        this.idRunTimeout = 0;
        if (!this.fRunning) return;
        this.snapStart();
        try {
            this.fYield = false;
            do {
                /*
                 * Execute the burst and then update all timers.
                 */
                this.updateTimers(this.endBurst(this.doBurst(this.getCyclesPerBurst())));

            } while (this.fRunning && !this.fYield);
        }
        catch(err) {
            this.println(err.message);
            this.stop();
            return;
        }
        if (this.fRunning) {
            this.assert(!this.idRunTimeout);
            this.idRunTimeout = setTimeout(this.onRunTimeout, this.snapStop());
        }
    }

    /**
     * setSpeed(nMultiplier)
     *
     * @this {Time}
     * @param {number} [nMultiplier] is the new proposed multiplier (reverts to default if target was too high)
     * @returns {boolean} true if successful, false if not
     *
     * @desc Whenever the speed is changed, the running cycle count and corresponding start time must be reset,
     * so that the next effective speed calculation obtains sensible results.  In fact, when run() initially calls
     * setSpeed() with no parameters, that's all this function does (it doesn't change the current speed setting).
     */
    setSpeed(nMultiplier)
    {
        let fSuccess = true;
        if (nMultiplier !== undefined) {
            /*
             * If we haven't reached 90% (0.9) of the current target speed, revert to the default multiplier.
             */
            if (this.mhzCurrent > 0 && this.mhzCurrent < this.mhzTarget * 0.9) {
                nMultiplier = this.nBaseMultiplier;
                fSuccess = false;
            }
            // this.mhzCurrent = 0;
            this.nTargetMultiplier = nMultiplier;
            let mhzTarget = this.mhzBase * this.nTargetMultiplier;
            if (this.mhzTarget != mhzTarget) {
                this.mhzTarget = mhzTarget;
                this.updateBindingText(Time.BINDING.SETSPEED, this.getSpeedTarget());
            }
        }
        this.nCyclesRun = 0;
        this.msStartRun = this.msEndRun = 0;
        this.calcCycles();      // calculate a new value for the current cycle multiplier
        this.resetTimers();     // and then update all the fixed-period timers using the new cycle multiplier
        return fSuccess;
    }

    /**
     * setTimer(iTimer, ms, fReset)
     *
     * Using the timer index from a previous addTimer() call, this sets that timer to fire after the
     * specified number of milliseconds.
     *
     * @this {Time}
     * @param {number} iTimer
     * @param {number} ms (converted into a cycle countdown internally)
     * @param {boolean} [fReset] (true if the timer should be reset even if already armed)
     * @returns {number} (number of cycles used to arm timer, or -1 if error)
     */
    setTimer(iTimer, ms, fReset)
    {
        let nCycles = -1;
        if (iTimer > 0 && iTimer <= this.aTimers.length) {
            let timer = this.aTimers[iTimer-1];
            if (fReset || timer.nCyclesLeft < 0) {
                nCycles = this.getCycles(ms);
                /*
                 * If we're currently executing a burst of cycles, the number of cycles it has executed in
                 * that burst so far must NOT be charged against the cycle timeout we're about to set.  The simplest
                 * way to resolve that is to immediately call endBurst() and bias the cycle timeout by the number
                 * of cycles that the burst executed.
                 */
                if (this.fRunning) {
                    nCycles += this.endBurst();
                }
                timer.nCyclesLeft = nCycles;
            }
        }
        return nCycles;
    }

    /**
     * snapStart()
     *
     * @this {Time}
     */
    snapStart()
    {
        this.calcCycles();

        this.nCyclesThisRun = 0;
        this.msOutsideThisRun = 0;
        this.msStartThisRun = Date.now();
        if (!this.msStartRun) this.msStartRun = this.msStartThisRun;

        /*
         * Try to detect situations where the browser may have throttled us, such as when the user switches
         * to a different tab; in those situations, Chrome and Safari may restrict setTimeout() callbacks
         * to roughly one per second.
         *
         * Another scenario: the user resizes the browser window.  setTimeout() callbacks are not throttled,
         * but there can still be enough of a lag between the callbacks that speed will be noticeably
         * erratic if we don't compensate for it here.
         *
         * We can detect throttling/lagging by verifying that msEndRun (which was set at the end of the
         * previous run and includes any requested sleep time) is comparable to the current msStartThisRun;
         * if the delta is significant, we compensate by bumping msStartRun forward by that delta.
         *
         * This shouldn't be triggered when the Debugger stops time, because setSpeed() -- which is called
         * whenever the time starts again -- zeroes msEndRun.
         */
        let msDelta = 0;
        if (this.msEndRun) {
            msDelta = this.msStartThisRun - this.msEndRun;
            if (msDelta > this.msYield) {
                this.msStartRun += msDelta;
                /*
                 * Bumping msStartRun forward should NEVER cause it to exceed msStartThisRun; however, just
                 * in case, I make absolutely sure it cannot happen, since doing so could result in negative
                 * speed calculations.
                 */
                this.assert(this.msStartRun <= this.msStartThisRun);
                if (this.msStartRun > this.msStartThisRun) {
                    this.msStartRun = this.msStartThisRun;
                }
            }
        }
    }

    /**
     * snapStop()
     *
     * @this {Time}
     * @returns {number}
     */
    snapStop()
    {
        this.msEndRun = Date.now();

        if (this.msOutsideThisRun) {
            this.msStartRun += this.msOutsideThisRun;
            this.msStartThisRun += this.msOutsideThisRun;
        }

        let msYield = this.msYield;
        if (this.nCyclesThisRun) {
            /*
             * Normally, we assume we executed a full quota of work over msYield.  If nCyclesThisRun is correct,
             * then the ratio of nCyclesThisRun/nCyclesPerYield should represent the percentage of work we performed,
             * and so applying that percentage to msYield should give us a better estimate of work vs. time.
             */
            msYield = Math.round(msYield * this.nCyclesThisRun / this.nCyclesPerYield);
        }

        let msElapsedThisRun = this.msEndRun - this.msStartThisRun;
        let msRemainsThisRun = msYield - msElapsedThisRun;

        let nCycles = this.nCyclesRun;
        let msElapsed = this.msEndRun - this.msStartRun;

        if (DEBUG && msRemainsThisRun < 0 && this.nTargetMultiplier > 1) {
            this.println("warning: updates @" + msElapsedThisRun + "ms (prefer " + Math.round(msYield) + "ms)");
        }

        this.calcSpeed(nCycles, msElapsed);

        if (msRemainsThisRun < 0) {
            /*
             * Try "throwing out" the effects of large anomalies, by moving the overall run start time up;
             * ordinarily, this should only happen when the someone is using an external Debugger or some other
             * tool or feature that is interfering with our overall execution.
             */
            if (msRemainsThisRun < -1000) {
                this.msStartRun -= msRemainsThisRun;
            }
            /*
             * If the last burst took MORE time than we allotted (ie, it's taking more than 1 second to simulate
             * nCyclesPerSecond), all we can do is yield for as little time as possible (ie, 0ms) and hope that the
             * simulation is at least usable.
             */
            msRemainsThisRun = 0;
        }
        else if (this.mhzCurrent < this.mhzTarget) {
            msRemainsThisRun = 0;
        }

        this.msEndRun += msRemainsThisRun;

        return msRemainsThisRun;
    }

    /**
     * start()
     *
     * @this {Time}
     * @returns {boolean}
     */
    start()
    {
        if (this.fRunning) {
            return false;
        }
        if (this.idRunTimeout) {
            clearTimeout(this.idRunTimeout);
            this.idRunTimeout = 0;
        }
        this.fRunning = true;
        this.msStartRun = this.msEndRun = 0;
        this.updateStatus(true);
        this.assert(!this.idRunTimeout);
        this.idRunTimeout = setTimeout(this.onRunTimeout, 0);
        return true;
    }

    /**
     * step()
     *
     * @this {Time}
     * @returns {boolean} true if successful, false if already running
     */
    step()
    {
        if (!this.fRunning) {
            /*
             * Execute a minimum-cycle burst and then update all timers.
             */
            this.updateTimers(this.endBurst(this.doBurst(1, true)));
            this.updateStatus();
            return true;
        }
        return false;
    }

    /**
     * stop()
     *
     * @this {Time}
     * @returns {boolean} true if successful, false if already stopped
     */
    stop()
    {
        if (this.fRunning) {
            this.fRunning = false;
            this.endBurst();
            this.updateStatus(true);
            return true;
        }
        return false;
    }

    /**
     * updateStatus(fForced)
     *
     * Used for both periodic status updates and forced updates (eg, on start() and stop() calls)
     *
     * @this {Time}
     * @param {boolean} [fForced]
     */
    updateStatus(fForced)
    {
        if (fForced) this.println(this.fRunning? ("starting (target speed: " + this.getSpeedTarget() + ")") : "stopping");
        this.updateBindingText(Time.BINDING.RUN, this.fRunning? "Halt" : "Run");
        this.updateBindingText(Time.BINDING.SPEED, this.getSpeedCurrent());
    }

    /**
     * updateTimers(nCycles)
     *
     * Used by run() to reduce all active timer countdown values by the number of cycles just executed;
     * this is the function that actually "fires" any timer(s) whose countdown has reached (or dropped below)
     * zero, invoking their callback function.
     *
     * @this {Time}
     * @param {number} nCycles (number of cycles actually executed)
     */
    updateTimers(nCycles)
    {
        for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
            let timer = this.aTimers[iTimer-1];
            this.assert(!isNaN(timer.nCyclesLeft));
            if (timer.nCyclesLeft < 0) continue;
            timer.nCyclesLeft -= nCycles;
            if (timer.nCyclesLeft <= 0) {
                timer.nCyclesLeft = -1; // zero is technically an "active" value, so ensure the timer is dormant now
                timer.callBack();       // safe to invoke the callback function now
                if (timer.msAuto >= 0) {
                    this.setTimer(iTimer, timer.msAuto);
                }
            }
        }
    }
}

Time.BINDING = {
    RUN:        "run",
    SETSPEED:   "setSpeed",
    SPEED:      "speed",
    STEP:       "step"
};

Time.YIELDS_PER_SECOND = 30;
