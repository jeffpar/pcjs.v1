/**
 * @fileoverview Controls the PDP11 CPU component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.4 written by Paul Nankervis
 * (paulnank@hotmail.com) as of August 2016 from http://skn.noip.me/pdp11/pdp11.html.  This code
 * may be used freely provided the original author name is acknowledged in any modified source code.
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
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

if (NODE) {
    var str           = require("../../shared/lib/strlib");
    var usr           = require("../../shared/lib/usrlib");
    var Component     = require("../../shared/lib/component");
    var MessagesPDP11 = require("./messages");
}

/*
 * A word (or more) about PDP-11 speeds:
 *
 * After looking over the timings of PDP-11/70 instructions, nearly all of them appear
 * to be multiples of 150ns.  So that's what we'll consider a cycle.  How many 150ns are
 * in one second?  Approximately 6666667.  So by way of comparison to other PCjs machines,
 * that makes the PDP-11 (or at least the PDP-11/70) look like a 6.67Mhz machine.
 *
 * I've started with the PDP-11/70, since that's what Paul Nankervis started with.  When
 * I go back and add support for earlier PDP-11 models (primarily by neutering functions
 * that didn't exist), I will no doubt have to tweak some instruction cycle counts, too.
 *
 * Examples of operations that take 1 extra cycle (150ns): single and double operand byte
 * instructions with an odd address (except MOV/MTPI/MTPD/JMP/JRS), ADD/SUB/BIC/BIS/MOVB/CMP/BIT
 * instructions with src of R1-R7 and dst of R6-R7, RORB/ASRB with an odd address, and each
 * shift of ASH/ASHC.  As you can see, the rules are not simple.
 *
 * We're not simulating cache hardware, but our timings should be optimistic and assume 100%
 * cache hits; for cache hits, each read cycle is 300ns.  As for write cycles, they are always
 * 750ns.  My initial take on DEC's timings is that they are including the write time as part
 * of the total EF (execute/fetch) time.  So, for instructions that write to memory, it looks
 * like we'll normally need to add 5 cycles (750/150) to the instruction's base time, but
 * we'll need to keep an eye out for exceptions.
 */

/**
 * CPUPDP11(parmsCPU, nCyclesDefault)
 *
 * The CPUPDP11 class supports the following (parmsCPU) properties:
 *
 *      cycles: the machine's base cycles per second; the CPUStatePDP11 constructor
 *      will provide us with a default (based on the CPU model) to use as a fallback.
 *
 *      multiplier: base cycle multiplier; default is 1.
 *
 *      autoStart: true to automatically start, false to not, or null if "it depends";
 *      null is the default, which means do not autostart UNLESS there is no Debugger
 *      and no "Run" button (ie, no way to manually start the machine).
 *
 *      csStart: the number of cycles that runCPU() must wait before generating
 *      checksum records; -1 if disabled. checksum records are a diagnostic aid
 *      used to help compare one CPU run to another.
 *
 *      csInterval: the number of cycles that runCPU() must execute before generating
 *      a checksum record; -1 if disabled.
 *
 *      csStop: the number of cycles to stop generating checksum records.
 *
 * This component is primarily responsible for interfacing the CPU with the outside
 * world (eg, Panel and Debugger components), and managing overall CPU operation.
 *
 * It is extended by the CPUStatePDP11 component, where the simulation control logic resides.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsCPU
 * @param {number} nCyclesDefault
 */
function CPUPDP11(parmsCPU, nCyclesDefault)
{
    Component.call(this, "CPU", parmsCPU, CPUPDP11, MessagesPDP11.CPU);

    var nCycles = parmsCPU['cycles'] || nCyclesDefault;

    var nMultiplier = parmsCPU['multiplier'] || 1;

    this.nCyclesPerSecond = nCycles;

    /*
     * nCyclesMultiplier replaces the old "speed" variable (0, 1, 2) and eliminates the need for
     * the constants (SPEED_SLOW, SPEED_FAST and SPEED_MAX).  The UI simply doubles the multiplier
     * until we've exceeded the host's speed limit and then starts the multiplier over at 1.
     */
    this.nCyclesMultiplier = nMultiplier;
    this.mhzDefault = Math.round(this.nCyclesPerSecond / 10000) / 100;
    /*
     * TODO: Take care of this with an initial setSpeed() call instead?
     */
    this.mhzTarget = this.mhzDefault * this.nCyclesMultiplier;

    /*
     * We add a number of flags to the set initialized by Component
     */
    this.flags.running = false;
    this.flags.starting = false;
    this.flags.autoStart = parmsCPU['autoStart'];

    /*
     * Get checksum parameters, if any. runCPU() behavior is not affected until fChecksum
     * is true, which won't happen until resetChecksum() is called with nCyclesChecksumInterval
     * ("csInterval") set to a positive value.
     *
     * As above, any of these parameters can also be set with the Debugger's execution options
     * command ("x"); for example, "x cs int 5000" will set nCyclesChecksumInterval to 5000
     * and call resetChecksum().
     */
    this.flags.checksum = false;
    this.nChecksum = this.nCyclesChecksumNext = 0;
    this.nCyclesChecksumStart = parmsCPU["csStart"];
    this.nCyclesChecksumInterval = parmsCPU["csInterval"];
    this.nCyclesChecksumStop = parmsCPU["csStop"];

    /*
     * Array of countdown timers managed by addTimer() and setTimer().
     */
    this.aTimers = [];

    this.onRunTimeout = this.runCPU.bind(this); // function onRunTimeout() { cpu.runCPU(); };

    this.setReady();
}

Component.subclass(CPUPDP11);

/*
 * Constants that control the frequency at which various updates should occur.
 *
 * These values do NOT control the simulation directly.  Instead, they are used by
 * calcCycles(), which uses the nCyclesPerSecond passed to the constructor as a starting
 * point and computes the following variables:
 *
 *      this.nCyclesPerYield:    (this.nCyclesPerSecond / CPUPDP11.YIELDS_PER_SECOND)
 *
 * The above variables are also multiplied by any cycle multiplier in effect, via setSpeed(),
 * and then they're used to initialize another set of variables for each runCPU() iteration:
 *
 *      this.nCyclesNextYield:   this.nCyclesPerYield
 */
CPUPDP11.YIELDS_PER_SECOND      = 30;           // just a gut feeling for the MINIMUM number of yields per second
CPUPDP11.YIELDS_PER_STATUS      = 15;           // every 15 yields (ie, twice per second), perform CPU status updates

CPUPDP11.BUTTONS = ["power", "reset"];

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {CPUPDP11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUPDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
CPUPDP11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.dbg = dbg;

    for (var i = 0; i < CPUPDP11.BUTTONS.length; i++) {
        var control = this.bindings[CPUPDP11.BUTTONS[i]];
        if (control) this.cmp.setBinding(null, CPUPDP11.BUTTONS[i], control);
    }

    /*
     * We've already saved the parmsCPU 'autoStart' setting, but there may be a machine (or URL) override.
     */
    var sAutoStart = cmp.getMachineParm('autoStart');
    if (sAutoStart != null) {
        this.flags.autoStart = (sAutoStart == "true"? true : (sAutoStart  == "false"? false : !!sAutoStart));
    }

    this.setReady();
};

/**
 * reset()
 *
 * Stub for reset notification (overridden by the CPUStatePDP11 component).
 *
 * @this {CPUPDP11}
 */
CPUPDP11.prototype.reset = function()
{
};

/**
 * save()
 *
 * Stub for save support (overridden by the CPUStatePDP11 component).
 *
 * @this {CPUPDP11}
 * @return {Object|null}
 */
CPUPDP11.prototype.save = function()
{
    return null;
};

/**
 * restore(data)
 *
 * Stub for restore support (overridden by the CPUStatePDP11 component).
 *
 * @this {CPUPDP11}
 * @param {Object} data
 * @return {boolean} true if restore successful, false if not
 */
CPUPDP11.prototype.restore = function(data)
{
    return false;
};

/**
 * powerUp(data, fRepower)
 *
 * @this {CPUPDP11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
CPUPDP11.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
        } else {
            this.resetCycles();
            if (!this.restore(data)) return false;
            this.resetChecksum();
        }
        /*
         * Give the Debugger a chance to do/print something once we've powered up
         */
        if (DEBUGGER && this.dbg) {
            this.dbg.init();
        } else {
            /*
             * The Computer (this.cmp) knows if there's a Control Panel (this.cmp.panel), and the Control Panel
             * knows if there's a "print" control (this.cmp.panel.controlPrint), and if there IS a "print" control
             * but no debugger, the machine is probably misconfigured (most likely, the page simply neglected to
             * load the Debugger component).
             *
             * However, we don't actually need to check all that; it's always safe use println(), regardless whether
             * a Control Panel with a "print" control is present or not.
             */
            this.println("No debugger detected");
        }
    }
    /*
     * The Computer component (which is responsible for all powerDown and powerUp notifications)
     * is now responsible for managing a component's fPowered flag, not us.
     *
     *      this.flags.powered = true;
     */
    this.cmp.updateStatus();
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {CPUPDP11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
CPUPDP11.prototype.powerDown = function(fSave, fShutdown)
{
    /*
     * The Computer component (which is responsible for all powerDown and powerUp notifications)
     * is now responsible for managing a component's fPowered flag, not us.
     *
     *      this.flags.powered = false;
     */
    return fSave? this.save() : true;
};

/**
 * autoStart()
 *
 * @this {CPUPDP11}
 * @return {boolean} true if started, false if not
 */
CPUPDP11.prototype.autoStart = function()
{
    /*
     * Start running automatically on power-up, assuming there's no Debugger and no "Run" button
     */
    if (this.flags.autoStart || (!DEBUGGER || !this.dbg) && this.bindings["run"] === undefined) {
        /*
         * Now we ALSO set fUpdateFocus when calling startCPU(), on the assumption that in the "auto-starting"
         * context, a machine without focus is like a day without sunshine.
         */
        this.startCPU(true);
        return true;
    }
    return false;
};

/**
 * isPowered()
 *
 * @this {CPUPDP11}
 * @return {boolean}
 */
CPUPDP11.prototype.isPowered = function()
{
    if (!this.flags.powered) {
        this.println(this.toString() + " not powered");
        return false;
    }
    return true;
};

/**
 * isRunning()
 *
 * @this {CPUPDP11}
 * @return {boolean}
 */
CPUPDP11.prototype.isRunning = function()
{
    return this.flags.running;
};

/**
 * getChecksum()
 *
 * This will be implemented by the CPUStatePDP11 component.
 *
 * @this {CPUPDP11}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
CPUPDP11.prototype.getChecksum = function()
{
    return 0;
};

/**
 * resetChecksum()
 *
 * If checksum generation is enabled (fChecksum is true), this resets the running 32-bit checksum and the
 * cycle counter that will trigger the next displayChecksum(); called by resetCycles(), which is called whenever
 * the CPU is reset or restored.
 *
 * @this {CPUPDP11}
 * @return {boolean} true if checksum generation enabled, false if not
 */
CPUPDP11.prototype.resetChecksum = function()
{
    if (this.nCyclesChecksumStart === undefined) this.nCyclesChecksumStart = 0;
    if (this.nCyclesChecksumInterval === undefined) this.nCyclesChecksumInterval = -1;
    if (this.nCyclesChecksumStop === undefined) this.nCyclesChecksumStop = -1;
    this.flags.checksum = (this.nCyclesChecksumStart >= 0 && this.nCyclesChecksumInterval > 0);
    if (this.flags.checksum) {
        this.nChecksum = 0;
        this.nCyclesChecksumNext = this.nCyclesChecksumStart - this.nTotalCycles;
        /*
         *  this.nCyclesChecksumNext = this.nCyclesChecksumStart + this.nCyclesChecksumInterval -
         *      (this.nTotalCycles % this.nCyclesChecksumInterval);
         */
        return true;
    }
    return false;
};

/**
 * updateChecksum(nCycles)
 *
 * When checksum generation is enabled (fChecksum is true), runCPU() asks stepCPU() to execute a minimum
 * number of cycles (1), effectively limiting execution to a single instruction, and then we're called with
 * the exact number cycles that were actually executed.  This should give us instruction-granular checksums
 * at precise intervals that are 100% repeatable.
 *
 * @this {CPUPDP11}
 * @param {number} nCycles
 */
CPUPDP11.prototype.updateChecksum = function(nCycles)
{
    if (this.flags.checksum) {
        /*
         * Get a 32-bit summation of the current CPU state and add it to our running 32-bit checksum
         */
        var fDisplay = false;
        this.nChecksum = (this.nChecksum + this.getChecksum())|0;
        this.nCyclesChecksumNext -= nCycles;
        if (this.nCyclesChecksumNext <= 0) {
            this.nCyclesChecksumNext += this.nCyclesChecksumInterval;
            fDisplay = true;
        }
        if (this.nCyclesChecksumStop >= 0) {
            if (this.nCyclesChecksumStop <= this.getCycles()) {
                this.nCyclesChecksumInterval = this.nCyclesChecksumStop = -1;
                this.resetChecksum();
                this.stopCPU();
                fDisplay = true;
            }
        }
        if (fDisplay) this.displayChecksum();
    }
};

/**
 * displayChecksum()
 *
 * When checksum generation is enabled (fChecksum is true), this is called to provide a crude log of all
 * checksums generated at the specified cycle intervals, as specified by the "csStart" and "csInterval" parmsCPU
 * properties).
 *
 * @this {CPUPDP11}
 */
CPUPDP11.prototype.displayChecksum = function()
{
    this.println(this.getCycles() + " cycles: " + "checksum=" + str.toHex(this.nChecksum));
};

/**
 * setBinding(sType, sBinding, control, sValue)
 *
 * @this {CPUPDP11}
 * @param {string|null} sType is the type of the HTML control (eg, "button", "textarea", "register", "flag", "rled", etc)
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "run")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
CPUPDP11.prototype.setBinding = function(sType, sBinding, control, sValue)
{
    var cpu = this;

    switch (sBinding) {
    case "power":
    case "reset":
        /*
         * The "power" and "reset" buttons are functions of the entire computer, not just the CPU,
         * but it's not always convenient to stick a power button in the Computer component definition,
         * so we record those bindings here and pass them on to the Computer component in initBus().
         */
        this.bindings[sBinding] = control;
        return true;

    case "run":
        this.bindings[sBinding] = control;
        control.onclick = function onClickRun() {
            if (!cpu.cmp || !cpu.cmp.checkPower()) return;
            /*
             * We no longer pass true to these startCPU()/stopCPU() calls, on the theory that if the "run"
             * control is visible, then the computer is probably sufficiently visible as well; the problem
             * with setting fUpdateFocus to true is that it can jerk the web page around in annoying ways.
             */
            if (!cpu.flags.running)
                cpu.startCPU();
            else
                cpu.stopCPU();
        };
        return true;

    case "speed":
        this.bindings[sBinding] = control;
        return true;

    case "setSpeed":
        this.bindings[sBinding] = control;
        control.onclick = function onClickSetSpeed() {
            cpu.setSpeed(cpu.nCyclesMultiplier << 1, true);
        };
        control.textContent = this.getSpeedTarget();
        return true;

    default:
        break;
    }
    return false;
};

/**
 * updateStatus(fForce)
 *
 * Some of the CPU bindings provide feedback and therefore need to be updated periodically.  This is called
 * via the Computer's updateStatus() handler several times per second; see YIELDS_PER_STATUS.
 *
 * @this {CPUPDP11}
 * @param {boolean} [fForce]
 */
CPUPDP11.prototype.updateStatus = function(fForce)
{
    var controlSpeed = this.bindings["speed"];
    if (controlSpeed) controlSpeed.textContent = this.getSpeedCurrent();
};

/**
 * addCycles(nCycles, fEndStep)
 *
 * @this {CPUPDP11}
 * @param {number} nCycles
 * @param {boolean} [fEndStep]
 */
CPUPDP11.prototype.addCycles = function(nCycles, fEndStep)
{
    this.nTotalCycles += nCycles;
    if (fEndStep) {
        this.nBurstCycles = this.nStepCycles = 0;
    }
};

/**
 * calcCycles(fRecalc)
 *
 * Calculate the number of cycles to process for each "burst" of CPU activity.  The size of a burst
 * is driven by YIELDS_PER_SECOND (eg, 30).
 *
 * At the end of each burst, we subtract burst cycles from the yield cycle "threshold" counter.
 * Whenever the "next yield" cycle counter goes to (or below) zero, we compare elapsed time to the time
 * we expected the virtual hardware to take (eg, 1000ms/50 or 20ms), and if we still have time remaining,
 * we sleep the remaining time (or 0ms if there's no remaining time), and then restart runCPU().
 *
 * @this {CPUPDP11}
 * @param {boolean} [fRecalc] is true if the caller wants to recalculate thresholds based on the most recent
 * speed calculation (see calcSpeed).
 */
CPUPDP11.prototype.calcCycles = function(fRecalc)
{
    /*
     * Calculate "per" yield values.
     */
    var vMultiplier = 1;
    if (fRecalc) {
        if (this.nCyclesMultiplier > 1 && this.mhz) {
            vMultiplier = (this.mhz / this.mhzDefault);
        }
    }

    this.msPerYield = Math.round(1000 / CPUPDP11.YIELDS_PER_SECOND);
    this.nCyclesPerYield = Math.floor(this.nCyclesPerSecond / CPUPDP11.YIELDS_PER_SECOND * vMultiplier);

    /*
     * And initialize "next" yield values to the "per" values.
     */
    if (!fRecalc) {
        this.nCyclesNextYield = this.nCyclesPerYield;
    }
    this.nCyclesRecalc = 0;
};

/**
 * getCycles(fScaled)
 *
 * getCycles() returns the number of cycles executed so far.  Note that we can be called after
 * runCPU() OR during runCPU(), perhaps from a handler triggered during the current run's stepCPU(),
 * so nRunCycles must always be adjusted by number of cycles stepCPU() was asked to run (nBurstCycles),
 * less the number of cycles it has yet to run (nStepCycles).
 *
 * nRunCycles is zeroed whenever the CPU is halted or the CPU speed is changed, which is why we also
 * have nTotalCycles, which accumulates all nRunCycles before we zero it.  However, nRunCycles and
 * nTotalCycles eventually get reset by calcSpeed(), to avoid overflow, so components that rely on
 * getCycles() returning steadily increasing values should also be prepared for a reset at any time.
 *
 * @this {CPUPDP11}
 * @param {boolean} [fScaled] is true if the caller wants a cycle count relative to a multiplier of 1
 * @return {number}
 */
CPUPDP11.prototype.getCycles = function(fScaled)
{
    var nCycles = this.nTotalCycles + this.nRunCycles + this.nBurstCycles - this.nStepCycles;
    if (fScaled && this.nCyclesMultiplier > 1 && this.mhz > this.mhzDefault) {
        /*
         * We could scale the current cycle count by the current effective speed (this.mhz); eg:
         *
         *      nCycles = Math.round(nCycles / (this.mhz / this.mhzDefault));
         *
         * but that speed will fluctuate somewhat: large fluctuations at first, but increasingly smaller
         * fluctuations after each burst of instructions that runCPU() executes.
         *
         * Alternatively, we can scale the cycle count by the multiplier, which is good in that the
         * multiplier doesn't vary once the user changes it, but a potential downside is that the
         * multiplier might be set too high, resulting in a target speed that's higher than the effective
         * speed is able to reach.
         *
         * Also, if multipliers were always limited to a power-of-two, then this could be calculated
         * with a simple shift.  However, only the "setSpeed" UI binding limits it that way; the Debugger
         * interface allows any value, as does the CPU "multiplier" parmsCPU property (from the machine's
         * XML file).
         */
        nCycles = Math.round(nCycles / this.nCyclesMultiplier);
    }
    return nCycles;
};

/**
 * getCyclesPerSecond()
 *
 * This returns the CPU's "base" speed (ie, the original cycles per second defined for the machine)
 *
 * @this {CPUPDP11}
 * @return {number}
 */
CPUPDP11.prototype.getCyclesPerSecond = function()
{
    return this.nCyclesPerSecond;
};

/**
 * resetCycles()
 *
 * Resets speed and cycle information as part of any reset() or restore(); this typically occurs during powerUp().
 * It's important that this be called BEFORE the actual restore() call, because restore() may want to call setSpeed(),
 * which in turn assumes that all the cycle counts have been initialized to sensible values.
 *
 * @this {CPUPDP11}
 */
CPUPDP11.prototype.resetCycles = function()
{
    this.mhz = 0;
    this.nYieldsSinceStatusUpdate = 0;
    this.nTotalCycles = this.nRunCycles = this.nBurstCycles = this.nStepCycles = 0;
    this.resetChecksum();
    this.setSpeed(1);
};

/**
 * getSpeed()
 *
 * @this {CPUPDP11}
 * @return {number} the current speed multiplier
 */
CPUPDP11.prototype.getSpeed = function()
{
    return this.nCyclesMultiplier;
};

/**
 * getSpeedCurrent()
 *
 * @this {CPUPDP11}
 * @return {string} the current speed, in mhz, as a string formatted to two decimal places
 */
CPUPDP11.prototype.getSpeedCurrent = function()
{
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now?
     */
    return ((this.flags.running && this.mhz)? (this.mhz.toFixed(2) + "Mhz") : "Stopped");
};

/**
 * getSpeedTarget()
 *
 * @this {CPUPDP11}
 * @return {string} the target speed, in mhz, as a string formatted to two decimal places
 */
CPUPDP11.prototype.getSpeedTarget = function()
{
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now?
     */
    return this.mhzTarget.toFixed(2) + "Mhz";
};

/**
 * setSpeed(nMultiplier, fUpdateFocus)
 *
 * NOTE: This used to return the target speed, in mhz, but no callers appear to care at this point.
 *
 * @desc Whenever the speed is changed, the running cycle count and corresponding start time must be reset,
 * so that the next effective speed calculation obtains sensible results.  In fact, when runCPU() initially calls
 * setSpeed() with no parameters, that's all this function does (it doesn't change the current speed setting).
 *
 * @this {CPUPDP11}
 * @param {number} [nMultiplier] is the new proposed multiplier (reverts to 1 if the target was too high)
 * @param {boolean} [fUpdateFocus] is true to update Computer focus
 * @return {boolean} true if successful, false if not
 */
CPUPDP11.prototype.setSpeed = function(nMultiplier, fUpdateFocus)
{
    var fSuccess = false;
    if (nMultiplier !== undefined) {
        /*
         * If we haven't reached 80% (0.8) of the current target speed, revert to a multiplier of one (1).
         */
        if (this.mhz / this.mhzTarget < 0.8) {
            nMultiplier = 1;
        } else {
            fSuccess = true;
        }
        this.nCyclesMultiplier = nMultiplier;
        var mhz = this.mhzDefault * this.nCyclesMultiplier;
        if (this.mhzTarget != mhz) {
            this.mhzTarget = mhz;
            var sSpeed = this.getSpeedTarget();
            var controlSpeed = this.bindings["setSpeed"];
            if (controlSpeed) controlSpeed.textContent = sSpeed;
            this.println("target speed: " + sSpeed);
        }
        if (fUpdateFocus && this.cmp) this.cmp.updateFocus();
    }
    this.addCycles(this.nRunCycles);
    this.nRunCycles = 0;
    this.msStartRun = usr.getTime();
    this.msEndThisRun = 0;
    this.calcCycles();
    return fSuccess;
};

/**
 * calcSpeed(nCycles, msElapsed)
 *
 * @this {CPUPDP11}
 * @param {number} nCycles
 * @param {number} msElapsed
 */
CPUPDP11.prototype.calcSpeed = function(nCycles, msElapsed)
{
    if (msElapsed) {
        this.mhz = Math.round(nCycles / (msElapsed * 10)) / 100;
        if (msElapsed >= 86400000) {
            this.nTotalCycles = 0;
            this.setSpeed();        // reset all counters once per day so that we never have to worry about overflow
        }
    }
};

/**
 * calcStartTime()
 *
 * @this {CPUPDP11}
 */
CPUPDP11.prototype.calcStartTime = function()
{
    if (this.nCyclesRecalc >= this.nCyclesPerSecond) {
        this.calcCycles(true);
    }
    this.nCyclesThisRun = 0;
    this.msStartThisRun = usr.getTime();

    /*
     * Try to detect situations where the browser may have throttled us, such as when the user switches
     * to a different tab; in those situations, Chrome and Safari may restrict setTimeout() callbacks
     * to roughly one per second.
     *
     * Another scenario: the user resizes the browser window.  setTimeout() callbacks are not throttled,
     * but there can still be enough of a lag between the callbacks that CPU speed will be noticeably
     * erratic if we don't compensate for it here.
     *
     * We can detect throttling/lagging by verifying that msEndThisRun (which was set at the end of the
     * previous run and includes any requested sleep time) is comparable to the current msStartThisRun;
     * if the delta is significant, we compensate by bumping msStartRun forward by that delta.
     *
     * This shouldn't be triggered when the Debugger halts the CPU, because setSpeed() -- which is called
     * whenever the CPU starts running again -- zeroes msEndThisRun.
     *
     * This also won't do anything about other internal delays; for example, Debugger message() calls.
     * By the time the message() function has called yieldCPU(), the cost of the message has already been
     * incurred, so it will be end up being charged against the instruction(s) that triggered it.
     *
     * TODO: Consider calling yieldCPU() sooner from message(), so that it can arrange for the msEndThisRun
     * "snapshot" to occur sooner; it's unclear, however, whether that will really improve the CPU's ability
     * to hit its target speed, since you would expect any instruction that displays a message to be an
     * EXTREMELY slow instruction.
     */
    if (this.msEndThisRun) {
        var msDelta = this.msStartThisRun - this.msEndThisRun;
        if (msDelta > this.msPerYield) {
            if (MAXDEBUG) this.println("large time delay: " + msDelta + "ms");
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
};

/**
 * calcRemainingTime()
 *
 * @this {CPUPDP11}
 * @return {number}
 */
CPUPDP11.prototype.calcRemainingTime = function()
{
    this.msEndThisRun = usr.getTime();

    var msYield = this.msPerYield;
    if (this.nCyclesThisRun) {
        /*
         * Normally, we would assume we executed a full quota of work over msPerYield, but since the CPU
         * now has the option of calling yieldCPU(), that might not be true.  If nCyclesThisRun is correct, then
         * the ratio of nCyclesThisRun/nCyclesPerYield should represent the percentage of work we performed,
         * and so applying that percentage to msPerYield should give us a better estimate of work vs. time.
         */
        msYield = Math.round(msYield * this.nCyclesThisRun / this.nCyclesPerYield);
    }

    var msElapsedThisRun = this.msEndThisRun - this.msStartThisRun;
    var msRemainsThisRun = msYield - msElapsedThisRun;

    /*
     * We could pass only "this run" results to calcSpeed():
     *
     *      nCycles = this.nCyclesThisRun;
     *      msElapsed = msElapsedThisRun;
     *
     * but it seems preferable to use longer time periods and hopefully get a more accurate speed.
     *
     * Also, if msRemainsThisRun >= 0 && this.nCyclesMultiplier == 1, we could pass these results instead:
     *
     *      nCycles = this.nCyclesThisRun;
     *      msElapsed = this.msPerYield;
     *
     * to insure that we display a smooth, constant N Mhz.  But for now, I prefer seeing any fluctuations.
     */
    var nCycles = this.nRunCycles;
    var msElapsed = this.msEndThisRun - this.msStartRun;

    if (MAXDEBUG && msRemainsThisRun < 0 && this.nCyclesMultiplier > 1) {
        this.println("warning: updates @" + msElapsedThisRun + "ms (prefer " + Math.round(msYield) + "ms)");
    }

    this.calcSpeed(nCycles, msElapsed);

    if (msRemainsThisRun < 0 || this.mhz < this.mhzTarget) {
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

    /*
     * Last but not least, update nCyclesRecalc, so that when runCPU() starts up again and calls calcStartTime(),
     * it'll be ready to decide if calcCycles() should be called again.
     */
    this.nCyclesRecalc += this.nCyclesThisRun;

    if (DEBUG && this.messageEnabled(MessagesPDP11.LOG) && msRemainsThisRun) {
        this.log("calcRemainingTime: " + msRemainsThisRun + "ms to sleep after " + this.msEndThisRun + "ms");
    }

    this.msEndThisRun += msRemainsThisRun;
    return msRemainsThisRun;
};

/**
 * addTimer(callBack)
 *
 * Components that want to have timers that periodically fire after some number of milliseconds call
 * addTimer() to create the timer, and then setTimer() every time they want to arm it.  There is currently
 * no removeTimer() because these are generally used for the entire lifetime of a component.
 *
 * Internally, each timer entry is a preallocated Array with two entries: a cycle countdown in element [0]
 * and a callback function in element [1].  A timer is initially dormant; dormant timers have a countdown
 * value of -1 (although any negative number will suffice) and active timers have a non-negative value.
 *
 * Why not use JavaScript's setTimeout() instead?  Good question.  For a good answer, see setTimer() below.
 *
 * @this {CPUPDP11}
 * @param {function()} callBack
 * @return {number} timer index
 */
CPUPDP11.prototype.addTimer = function(callBack)
{
    var iTimer = this.aTimers.length;
    this.aTimers.push([-1, callBack]);
    return iTimer;
};

/**
 * setTimer(iTimer, ms, fReset)
 *
 * Using the timer index from a previous addTimer() call, this sets that timer to fire after the
 * specified number of milliseconds.
 *
 * This is preferred over JavaScript's setTimeout(), because all our timers are effectively paused when
 * the CPU is paused (eg, when the Debugger halts execution).  Moreover, setTimeout() handlers only run after
 * runCPU() yields, which is far too granular for some components (eg, when the SerialPort tries to simulate
 * interrupts at 9600 baud).
 *
 * Ideally, the only function that would use setTimeout() is runCPU(), while the rest of the components
 * use setTimer(); however, due to legacy code (ie, code that predates these functions) and/or laziness,
 * that may not be the case.
 *
 * @this {CPUPDP11}
 * @param {number} iTimer
 * @param {number} ms (converted into a cycle countdown internally)
 * @param {boolean} [fReset] (true if the timer should be reset even if already armed)
 * @return {number} (number of cycles used to arm timer, or -1 if error)
 */
CPUPDP11.prototype.setTimer = function(iTimer, ms, fReset)
{
    var nCycles = -1;
    if (iTimer >= 0 && iTimer < this.aTimers.length) {
        if (fReset || this.aTimers[iTimer][0] < 0) {
            nCycles = this.getMSCycles(ms);
            this.aTimers[iTimer][0] = nCycles;
        }
    }
    return nCycles;
};

/**
 * getMSCycles(ms)
 *
 * @this {CPUPDP11}
 * @param {number} ms
 * @return {number} number of corresponding cycles
 */
CPUPDP11.prototype.getMSCycles = function(ms)
{
    return (this.nCyclesPerSecond * this.nCyclesMultiplier) / 1000 * ms;
};

/**
 * getBurstCycles(nCycles)
 *
 * Used by runCPU() to get min(nCycles,[timer cycle counts])
 *
 * @this {CPUPDP11}
 * @param {number} nCycles (number of cycles about to execute)
 * @return {number} (either nCycles or less if a timer needs to fire)
 */
CPUPDP11.prototype.getBurstCycles = function(nCycles)
{
    for (var i = this.aTimers.length - 1; i >= 0; i--) {
        var timer = this.aTimers[i];
        if (timer[0] < 0) continue;
        if (nCycles > timer[0]) {
            nCycles = timer[0];
        }
    }
    return nCycles;
};

/**
 * updateTimers(nCycles)
 *
 * Used by runCPU() to reduce all active timer countdown values by the number of cycles just executed;
 * this is the function that actually "fires" any timer(s) whose countdown has reached (or dropped below)
 * zero, invoking their callback function.
 *
 * @this {CPUPDP11}
 * @param {number} nCycles (number of cycles actually executed)
 */
CPUPDP11.prototype.updateTimers = function(nCycles)
{
    for (var i = this.aTimers.length - 1; i >= 0; i--) {
        var timer = this.aTimers[i];
        if (timer[0] < 0) continue;
        timer[0] -= nCycles;
        if (timer[0] <= 0) {
            timer[0] = -1;      // zero is technically an "active" value, so ensure the timer is dormant now
            timer[1]();         // safe to invoke the callback function now
        }
    }
};

/**
 * endBurst()
 *
 * @this {CPUPDP11}
 */
CPUPDP11.prototype.endBurst = function()
{
    this.nBurstCycles -= this.nStepCycles;
    this.nStepCycles = 0;
};

/**
 * runCPU()
 *
 * @this {CPUPDP11}
 */
CPUPDP11.prototype.runCPU = function()
{
    if (!this.flags.running) return;

    /*
     *  calcStartTime() initializes the cycle counter and timestamp for this runCPU() invocation, and optionally
     *  recalculates the the maximum number of cycles for each burst if the nCyclesRecalc threshold has been reached.
     */
    this.calcStartTime();

    try {
        do {
            /*
             * nCyclesPerBurst is how many cycles we WANT to run on each iteration of stepCPU(), and may
             * be as HIGH as nCyclesPerYield, but it may be significantly less.  getBurstCycles() will adjust
             * nCyclesPerBurst downward if any CPU timers need to fire during the next burst.
             */
            var nCyclesPerBurst = this.getBurstCycles(this.flags.checksum? 1 : this.nCyclesPerYield);

            /*
             * Execute the burst.
             */
            try {
                this.stepCPU(nCyclesPerBurst);
            }
            catch(exception) {
                /*
                 * We assume that any numeric exception was explicitly thrown by the CPU to interrupt the
                 * current instruction (and by extension, the current burst, but not the current run).  All
                 * other exceptions are re-thrown to the catch below, which will attempt a stack dump.
                 */
                if (typeof exception != "number") throw exception;
            }

            /*
             * nCycles is how many cycles stepCPU() actually ran (nBurstCycles less any remaining nStepCycles);
             * that calculation matches the return value from stepCPU(), but since it may have thrown an exception,
             * we can't rely on it.
             */
            var nCycles = this.nBurstCycles - this.nStepCycles;

            /*
             * Update any/all timers, firing those whose cycle countdowns have reached (or dropped below) zero.
             */
            this.updateTimers(nCycles);

            /*
             * Add nCycles to nCyclesThisRun, as well as nRunCycles (the cycle count since the CPU first started).
             */
            this.nCyclesThisRun += nCycles;
            this.nRunCycles += nCycles;
            this.addCycles(0, true);
            this.updateChecksum(nCycles);

            this.nCyclesNextYield -= nCycles;
            if (this.nCyclesNextYield <= 0) {
                this.nCyclesNextYield += this.nCyclesPerYield;
                if (++this.nYieldsSinceStatusUpdate >= CPUPDP11.YIELDS_PER_STATUS) {
                    if (this.cmp) this.cmp.updateStatus();
                    this.nYieldsSinceStatusUpdate = 0;
                }
                break;
            }
        } while (this.flags.running);
    }
    catch (e) {
        this.stopCPU();
        if (this.cmp) this.cmp.stop(usr.getTime(), this.getCycles());
        this.setError(e.stack || e.message);
        return;
    }

    if (this.flags.running) setTimeout(this.onRunTimeout, this.calcRemainingTime());
};

/**
 * startCPU(fUpdateFocus)
 *
 * For use by any component that wants to start the CPU.
 *
 * @param {boolean} [fUpdateFocus]
 * @return {boolean}
 */
CPUPDP11.prototype.startCPU = function(fUpdateFocus)
{
    if (this.isError()) {
        return false;
    }
    if (this.flags.running) {
        this.println(this.toString() + " busy");
        return false;
    }
    /*
     * setSpeed() without a speed parameter leaves the selected speed in place, but also resets the
     * cycle counter and timestamp for the current series of runCPU() calls, calculates the maximum number
     * of cycles for each burst based on the last known effective CPU speed, and resets the nCyclesRecalc
     * threshold counter.
     */
    this.setSpeed();
    this.flags.running = true;
    this.flags.starting = true;
    var controlRun = this.bindings["run"];
    if (controlRun) controlRun.textContent = "Halt";
    if (this.cmp) {
        if (fUpdateFocus) this.cmp.updateFocus(true);
        this.cmp.start(this.msStartRun, this.getCycles());
    }
    setTimeout(this.onRunTimeout, 0);
    return true;
};

/**
 * stepCPU(nMinCycles)
 *
 * This will be implemented by the CPUStatePDP11 component.
 *
 * @this {CPUPDP11}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates that the last instruction was not executed
 */
CPUPDP11.prototype.stepCPU = function(nMinCycles)
{
    return 0;
};

/**
 * stopCPU(fComplete)
 *
 * For use by any component that wants to stop the CPU.
 *
 * This similar to yieldCPU(), but it doesn't need to zero nCyclesNextYield to break out of runCPU();
 * it simply needs to clear fRunning (well, "simply" may be oversimplifying a bit....)
 *
 * @this {CPUPDP11}
 * @param {boolean} [fComplete]
 */
CPUPDP11.prototype.stopCPU = function(fComplete)
{
    if (this.flags.running) {
        this.endBurst();
        this.addCycles(this.nRunCycles);
        this.nRunCycles = 0;
        this.flags.running = false;
        var controlRun = this.bindings["run"];
        if (controlRun) controlRun.textContent = "Run";
        if (this.cmp) {
            this.cmp.stop(usr.getTime(), this.getCycles());
        }
    }
    this.flags.complete = fComplete;
};

/**
 * yieldCPU()
 *
 * Similar to stopCPU() with regard to how it resets various cycle countdown values, but the CPU
 * remains in a "running" state.
 *
 * @this {CPUPDP11}
 */
CPUPDP11.prototype.yieldCPU = function()
{
    this.endBurst();                    // this will break us out of stepCPU()
    this.nCyclesNextYield = 0;          // this will break us out of runCPU(), once we break out of stepCPU()
    // if (DEBUG) this.nSnapCycles = this.nBurstCycles;
    /*
     * The Debugger calls yieldCPU() after every message() to ensure browser responsiveness, but it looks
     * odd for those messages to show CPU state changes if the Control Panel, Video display, etc, does not,
     * so I've added this call to try to keep things looking synchronized.
     */
    this.cmp.updateStatus();
};

if (NODE) module.exports = CPUPDP11;
