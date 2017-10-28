/**
 * @fileoverview Simulates time
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
 * <http://pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

class Time extends Control {
    /**
     * Time(idMachine, idControl, config)
     *
     * Sample config:
     *
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 1600000,       // number of cycles per second
     *        "bindings": {
     *          "run": "runTI57",
     *          "print": "printTI57"
     *        }
     *      }
     *
     * Example: The TI-57 has a standard cycle time of 0.625us.  Every set of four cycles
     * is designated a "state time".  Within a single state time (2.5us), the four cycles are
     * designated O1, P1, O2, and P2.  Moreover, one state time is required to transfer 2 bits
     * from a data word register.  Since a data word consists of 16 BCD digits, that's 64 bits,
     * or 32 state times, or 80us.  That being the longest operation an instruction may perform,
     * one instruction is typically 80us.  Exceptions include display instructions, which slow
     * the delivery of cycles, such that one state time is 10us instead of 2.5us, and therefore
     * the instruction takes 320us instead of 80us.
     *
     * All that being said, the smallest division of time we must be concerned with is the 0.625us
     * cycle time, which means there are 1,600,000 cycles per second.
     *
     * Other components that need to be aware of the passage of time can register a "refresh"
     * function via addRefresh() (called with frequency REFRESHES_PER_SECOND), as well as a "timer"
     * function via addTimer().  Timers can either be manually or automatically set to fire after
     * a predetermined number of microseconds; at the point a timer is armed, the requested number
     * of microseconds is converted to the number of cycles the machine is expected to process
     * during that number of microseconds, and when that cycle count is exhausted, the timer
     * function is called.
     *
     * @this {Time}
     * @param {string} idMachine
     * @param {string} [idControl]
     * @param {Object} [config]
     */
    constructor(idMachine, idControl, config)
    {
        super(idMachine, idControl, config);
        let time = this;
        this.nCyclesPerSecond = config['cyclesPerSecond'] || 1600000;
        this.msYield = Math.round(1000 / Time.YIELDS_PER_SECOND);
        this.aTimers = [];
        this.fRunning = this.fYield = false;
        this.idRunTimeout = 0;
        this.onRunTimeout = this.run.bind(this);
        this.timerYield = this.addTimer(function() {
            time.fYield = true;
        }, this.msYield);
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

        default:
            super.addBinding(binding, element);
            break;
        }
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
        this.nCyclesPerYield = Math.floor(this.nCycles / Time.YIELDS_PER_SECOND * nMultiplier);
        this.nCurrentMultiplier = nMultiplier;
    }

    /**
     * getCycles(fScaled)
     *
     * getCycles() returns the number of cycles executed so far.  Note that we can be called after
     * run() OR during run(), perhaps from a handler triggered during the current run's step(),
     * so nCyclesRun must always be adjusted by number of cycles step() was asked to run (nCyclesBurst),
     * less the number of cycles it has yet to run (nCyclesRemain).
     *
     * nCyclesRun is zeroed whenever Time is halted or the speed is changed, which is why we also
     * have nCyclesTotal, which accumulates all nCyclesRun before we zero it.  However, nCyclesRun and
     * nCyclesTotal eventually get reset by calcSpeed(), to avoid overflow, so components that rely on
     * getCycles() returning steadily increasing values should also be prepared for a reset at any time.
     *
     * @this {Time}
     * @param {boolean} [fScaled] is true if the caller wants a cycle count relative to a multiplier of 1
     * @return {number}
     */
    getCycles(fScaled)
    {
        let nCycles = this.nCyclesTotal + this.nCyclesRun + this.nCyclesBurst - this.nCyclesRemain;
        if (fScaled && this.nTargetMultiplier > 1 && this.mhzCurrent > this.mhzBase) {
            /*
             * We could scale the current cycle count by the current speed (this.mhzCurrent); eg:
             *
             *      nCycles = Math.round(nCycles / (this.mhzCurrent / this.mhzBase));
             *
             * but that speed will fluctuate somewhat: large fluctuations at first, but increasingly smaller
             * fluctuations after each burst of instructions that doBurst() executes.
             *
             * Alternatively, we can scale the cycle count by the multiplier, which is good in that the
             * multiplier doesn't vary once the user changes it, but a potential downside is that the
             * multiplier might be set too high, resulting in a target speed that's higher than the effective
             * speed is able to reach.
             *
             * Also, if multipliers were always limited to a power-of-two, then this could be calculated
             * with a simple shift.  However, only the "setSpeed" UI binding limits it that way; the Debugger
             * interface allows any value, as does the Time "multiplier" config property.
             */
            nCycles = Math.round(nCycles / this.nTargetMultiplier);
        }
        return nCycles;
    }

    /**
     * getCurrentCyclesPerSecond()
     *
     * This returns the current speed (ie, the actual cycles per second, according the current multiplier)
     *
     * @this {Time}
     * @return {number}
     */
    getCurrentCyclesPerSecond()
    {
        return (this.nCyclesPerSecond * this.nCurrentMultiplier)|0;
    }

    /**
     * resetCycles()
     *
     * Resets speed and cycle information as part of any reset() or restore(); this typically occurs during powerUp().
     * It's important that this be called BEFORE the actual restore() call, because restore() may want to call setSpeed(),
     * which in turn assumes that all the cycle counts have been initialized to sensible values.
     *
     * @this {Time}
     */
    resetCycles()
    {
        this.nCyclesTotal = this.nCyclesRun = this.nCyclesBurst = this.nCyclesRemain = 0;
        this.resetChecksum();
        this.setSpeed(this.nBaseMultiplier);
    }

    /**
     * getSpeed()
     *
     * @this {Time}
     * @return {number} the current speed multiplier
     */
    getSpeed()
    {
        return this.nTargetMultiplier;
    }

    /**
     * getSpeedCurrent()
     *
     * @this {Time}
     * @return {string} the current speed, in mhz, as a string formatted to two decimal places
     */
    getSpeedCurrent()
    {
        return ((this.fRunning && this.mhzCurrent)? (this.mhzCurrent.toFixed(2) + "Mhz") : "Stopped");
    }

    /**
     * getSpeedTarget()
     *
     * @this {Time}
     * @return {string} the target speed, in mhz, as a string formatted to two decimal places
     */
    getSpeedTarget()
    {
        let sSpeed = this.mhzTarget.toFixed(2) + "Mhz";
        this.println("target speed: " + sSpeed);
        return sSpeed;
    }

    /**
     * setSpeed(nMultiplier)
     *
     * @this {Time}
     * @param {number} [nMultiplier] is the new proposed multiplier (reverts to default if target was too high)
     * @return {boolean} true if successful, false if not
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
            this.mhzCurrent = 0;
            this.nTargetMultiplier = nMultiplier;
            let mhzTarget = this.mhzBase * this.nTargetMultiplier;
            if (this.mhzTarget != mhzTarget) {
                this.mhzTarget = mhzTarget;
                this.updateBindingText(Time.BINDING.SETSPEED, this.getSpeedTarget());
            }
        }
        this.nCyclesRun = 0;
        this.msStartRun = this.msEndThisRun = 0;
        this.calcCycles();      // calculate a new value for the current cycle multiplier
        this.resetTimers();     // and then update all the fixed-period timers using the new cycle multiplier
        return fSuccess;
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
            if (msElapsed >= 86400000) {
                this.nCyclesTotal = 0;
                this.setSpeed();        // reset all counters once per day so that we never have to worry about overflow
            }
        }
    }

    /**
     * calcStartTime()
     *
     * @this {Time}
     */
    calcStartTime()
    {
        this.calcCycles();

        this.nCyclesThisRun = 0;
        this.msOutsideThisRun = 0;
        this.msStartThisRun = Date.now();
        if (!this.msStartRun) {
            this.msStartRun = this.msStartThisRun;
        }

        /*
         * Try to detect situations where the browser may have throttled us, such as when the user switches
         * to a different tab; in those situations, Chrome and Safari may restrict setTimeout() callbacks
         * to roughly one per second.
         *
         * Another scenario: the user resizes the browser window.  setTimeout() callbacks are not throttled,
         * but there can still be enough of a lag between the callbacks that speed will be noticeably
         * erratic if we don't compensate for it here.
         *
         * We can detect throttling/lagging by verifying that msEndThisRun (which was set at the end of the
         * previous run and includes any requested sleep time) is comparable to the current msStartThisRun;
         * if the delta is significant, we compensate by bumping msStartRun forward by that delta.
         *
         * This shouldn't be triggered when the Debugger stops time, because setSpeed() -- which is called
         * whenever the time starts again -- zeroes msEndThisRun.
         */
        let msDelta = 0;
        if (this.msEndThisRun) {
            msDelta = this.msStartThisRun - this.msEndThisRun;
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
     * calcRemainingTime()
     *
     * @this {Time}
     * @return {number}
     */
    calcRemainingTime()
    {
        this.msEndThisRun = Date.now();

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

        let msElapsedThisRun = this.msEndThisRun - this.msStartThisRun;
        let msRemainsThisRun = msYield - msElapsedThisRun;

        /*
         * We could pass only "this run" results to calcSpeed():
         *
         *      nCycles = this.nCyclesThisRun;
         *      msElapsed = msElapsedThisRun;
         *
         * but it seems preferable to use longer time periods and hopefully get a more accurate speed.
         */
        let nCycles = this.nCyclesRun;
        let msElapsed = this.msEndThisRun - this.msStartRun;

        if (MAXDEBUG && msRemainsThisRun < 0 && this.nTargetMultiplier > 1) {
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
             * nBaseCyclesPerSecond), all we can do is yield for as little time as possible (ie, 0ms) and hope
             * that the simulation is at least usable.
             */
            msRemainsThisRun = 0;
        }
        else if (this.mhzCurrent < this.mhzTarget) {
            msRemainsThisRun = 0;
        }

        this.msEndThisRun += msRemainsThisRun;

        return msRemainsThisRun;
    }

    /**
     * addTimer(callBack, ms)
     *
     * Components that want to have timers that fire after some number of milliseconds call addTimer() to create
     * the timer, and then setTimer() when they want to arm it.  Alternatively, they can specify an automatic timeout
     * value (in milliseconds) to have the timer fire automatically at regular intervals.  There is currently
     * no removeTimer() because these are generally used for the entire lifetime of a component.
     *
     * Internally, each timer entry is a preallocated Array with the following entries:
     *
     *      [0]: callback function
     *      [1]: automatic setTimer value, if any, in milliseconds
     *      [2]: countdown value, in cycles
     *
     * A timer is initially dormant; dormant timers have a countdown value of -1 (although any negative number
     * will suffice) and active timers have a non-negative value.
     *
     * Why not use JavaScript's setTimeout() instead?  Good question.  For a good answer, see setTimer() below.
     *
     * @this {Time}
     * @param {function()} callBack
     * @param {number} [ms] (if set, enables automatic setTimer calls)
     * @return {number} timer index
     */
    addTimer(callBack, ms = -1)
    {
        let iTimer = this.aTimers.length;
        this.aTimers.push([callBack, ms, -1]);
        if (ms >= 0) this.setTimer(iTimer, ms);
        return iTimer;
    }

    /**
     * setTimer(iTimer, ms, fReset)
     *
     * Using the timer index from a previous addTimer() call, this sets that timer to fire after the
     * specified number of milliseconds.
     *
     * This is preferred over JavaScript's setTimeout(), because all our timers are effectively paused when
     * time is paused (eg, when the Debugger halts execution).  Moreover, setTimeout() handlers only run after
     * run() yields, which is far too granular for some components (eg, when the SerialPort tries to simulate
     * interrupts at 9600 baud).
     *
     * Ideally, the only function that would use setTimeout() is run(), while the rest of the components
     * use setTimer(); however, due to legacy code (ie, code that predates these functions) and/or laziness,
     * that may not be the case.
     *
     * @this {Time}
     * @param {number} iTimer
     * @param {number} ms (converted into a cycle countdown internally)
     * @param {boolean} [fReset] (true if the timer should be reset even if already armed)
     * @return {number} (number of cycles used to arm timer, or -1 if error)
     */
    setTimer(iTimer, ms, fReset)
    {
        let nCycles = -1;
        if (iTimer >= 0 && iTimer < this.aTimers.length) {
            let timer = this.aTimers[iTimer];
            if (fReset || timer[2] < 0) {
                nCycles = this.getMSCycles(ms);
                /*
                 * If we're currently executing a burst of cycles, the number of cycles it has executed in
                 * that burst so far must NOT be charged against the cycle timeout we're about to set.  The simplest
                 * way to resolve that is to immediately call endBurst() and bias the cycle timeout by the number
                 * of cycles that the burst executed.
                 */
                if (this.fRunning) {
                    nCycles += this.endBurst();
                }
                timer[2] = nCycles;
            }
        }
        return nCycles;
    }

    /**
     * setTimerCycles(iTimer, nCycles)
     *
     * A cycle-based version of setTimer(), used to help wean components off of functions like setBurstCycles().
     *
     * @this {Time}
     * @param {number} iTimer
     * @param {number} nCycles
     * @return {boolean}
     */
    setTimerCycles(iTimer, nCycles)
    {
        if (iTimer >= 0 && iTimer < this.aTimers.length) {
            let timer = this.aTimers[iTimer];
            /*
             * If we're currently executing a burst of cycles, the number of cycles it has executed in
             * that burst so far must NOT be charged against the cycle timeout we're about to set.  The simplest
             * way to resolve that is to immediately call endBurst() and bias the cycle timeout by the number
             * of cycles that the burst executed.
             */
            if (this.fRunning) {
                nCycles += this.endBurst();
            }
            timer[2] = nCycles;
            return true;
        }
        return false;
    }

    /**
     * getMSCycles(ms)
     *
     * @this {Time}
     * @param {number} ms
     * @return {number} number of corresponding cycles
     */
    getMSCycles(ms)
    {
        return ((this.nCycles * this.nCurrentMultiplier) / 1000 * ms)|0;
    }

    /**
     * getBurstCycles()
     *
     * This tells us how many cycles to execute as a burst.  The answer will always be less than
     * getCurrentCyclesPerSecond(), because at the very least, our own timer fires more than once per second.
     *
     * @this {Time}
     * @return {number} (the maximum number of cycles we should execute in the next burst)
     */
    getBurstCycles()
    {
        let nCycles = this.getCurrentCyclesPerSecond();
        for (let iTimer = this.aTimers.length - 1; iTimer >= 0; iTimer--) {
            let timer = this.aTimers[iTimer];
            this.assert(!isNaN(timer[2]));
            if (timer[2] < 0) continue;
            if (nCycles > timer[2]) {
                nCycles = timer[2];
            }
        }
        return nCycles;
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
        for (let iTimer = this.aTimers.length - 1; iTimer >= 0; iTimer--) {
            let timer = this.aTimers[iTimer];
            if (timer[1] >= 0) this.setTimer(iTimer, timer[1], true);
        }
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
        for (let iTimer = this.aTimers.length - 1; iTimer >= 0; iTimer--) {
            let timer = this.aTimers[iTimer];
            this.assert(!isNaN(timer[2]));
            if (timer[2] < 0) continue;
            timer[2] -= nCycles;
            if (timer[2] <= 0) {
                timer[2] = -1;      // zero is technically an "active" value, so ensure the timer is dormant now
                timer[0]();         // safe to invoke the callback function now
                if (timer[1] >= 0) {
                    this.setTimer(iTimer, timer[1]);
                }
            }
        }
    }

    /**
     * doBurst()
     *
     * @this {Time}
     * @param {number} nCycles
     * @return {number} (number of cycles actually executed)
     */
    doBurst(nCycles)
    {
        this.nCyclesBurst = this.nCyclesRemain = nCycles;

        /*
         * Work happens here...
         */
        this.nCyclyesRemain = 0;

        return this.nCyclesBurst - this.nCyclesRemain;
    }

    /**
     * endBurst()
     *
     * @this {Time}
     * @return {number} (number of cycles executed in burst)
     */
    endBurst()
    {
        let nCycles = this.nCyclesBurst - this.nCyclesRemain;
        this.nCyclesBurst = this.nCyclesRemain = 0;
        this.nCyclesThisRun += nCycles;
        this.nCyclesRun += nCycles;
        if (!this.fRunning) {
            this.nCyclesTotal += this.nCyclesRun;
            this.nCyclesRun = 0;
        }
        return nCycles;
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
        /*
         *  calcStartTime() initializes the cycle counter and timestamp for this run() invocation.
         */
        this.calcStartTime();

        try {
            this.fYield = false;
            do {
                /*
                 * Execute the burst and then update all timers.
                 */
                this.doBurst(this.getBurstCycles());
                this.updateTimers(this.endBurst());

            } while (this.fRunning && !this.fYield);
        }
        catch (e) {
            this.stop();
            // this.update();
            return;
        }
        if (this.fRunning) {
            this.assert(!this.idRunTimeout);
            this.idRunTimeout = setTimeout(this.onRunTimeout, this.calcRemainingTime());
        }
    }

    /**
     * start()
     *
     * @this {Time}
     * @return {boolean}
     */
    start()
    {
        if (this.fRunning) {
            // this.println(this.toString() + " busy");
            return false;
        }
        if (this.idRunTimeout) {
            clearTimeout(this.idRunTimeout);
            this.idRunTimeout = 0;
        }
        this.fRunning = true;
        this.updateBindingText(Time.BINDING.RUN, "Halt");
        this.assert(!this.idRunTimeout);
        this.idRunTimeout = setTimeout(this.onRunTimeout, 0);
        return true;
    }

    /**
     * stop()
     *
     * @this {Time}
     * @return {boolean} true if successful, false if already stopped
     */
    stop()
    {
        let fStopped = false;
        if (this.fRunning) {
            this.fRunning = false;
            this.endBurst();
            this.updateBindingText(Time.BINDING.RUN, "Run");
            fStopped = true;
        }
        return fStopped;
    }

    /**
     * outside(fn)
     *
     * Use this function to perform any work outside of normal time (eg, DOM updates),
     * to prevent that work from disrupting our speed calculations.
     *
     * @this {Time}
     * @param {function()} fn (should return true only if the function actually performed any work)
     * @return {boolean}
     */
    outside(fn)
    {
        let msStart = Date.now();
        if (fn()) {
            let msStop = Date.now();
            this.msOutsideThisRun += msStop - msStart;
            return true;
        }
        return false;
    }
}

Time.BINDING = {
    RUN:        "run",
    SETSPEED:   "setSpeed",
    SPEED:      "speed"
};

Time.YIELDS_PER_SECOND = 30;
