/**
 * @fileoverview Controls the PC6502 CPU component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
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

if (NODE) {
    var str         = require("../../shared/lib/strlib");
    var usr         = require("../../shared/lib/usrlib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
}

/**
 * CPU(parmsCPU, nCyclesDefault)
 *
 * The CPU class supports the following (parmsCPU) properties:
 *
 *      cycles: the machine's base cycles per second; the CPUState constructor will
 *      provide us with a default (based on the CPU model) to use as a fallback.
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
 *      csInterval: the number of cycles that runCPU() must execute before
 *      generating a checksum record; -1 if disabled.
 *
 *      csStop: the number of cycles to stop generating checksum records.
 *
 * This component is primarily responsible for interfacing the CPU with the outside
 * world (eg, Panel and Debugger components), and managing overall CPU operation.
 *
 * It is extended by the CPUState component, where the simulation control logic resides.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsCPU
 * @param {number} nCyclesDefault
 */
function CPU(parmsCPU, nCyclesDefault)
{
    Component.call(this, "CPU", parmsCPU, CPU, Messages.CPU);

    var nCycles = parmsCPU['cycles'] || nCyclesDefault;

    var nMultiplier = parmsCPU['multiplier'] || 1;

    this.counts = {};
    this.counts.nCyclesPerSecond = nCycles;
    this.counts.nVideoUpdates = 0;

    /*
     * nCyclesMultiplier replaces the old "speed" variable (0, 1, 2) and eliminates the need for
     * the constants (SPEED_SLOW, SPEED_FAST and SPEED_MAX).  The UI simply doubles the multiplier
     * until we've exceeded the host's speed limit and then starts the multiplier over at 1.
     */
    this.counts.nCyclesMultiplier = nMultiplier;
    this.counts.mhzDefault = Math.round(this.counts.nCyclesPerSecond / 10000) / 100;
    /*
     * TODO: Take care of this with an initial setSpeed() call instead?
     */
    this.counts.mhzTarget = this.counts.mhzDefault * this.counts.nCyclesMultiplier;

    /*
     * We add a number of flags to the set initialized by Component
     */
    this.flags.running = false;
    this.flags.starting = false;
    this.flags.autoStart = parmsCPU['autoStart'];

    /*
     * TODO: Add some UI for fDisplayLiveRegs (either an XML property, or a UI checkbox, or both)
     */
    this.flags.displayLiveRegs = false;

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
    this.counts.nChecksum = this.counts.nCyclesChecksumNext = 0;
    this.counts.nCyclesChecksumStart = parmsCPU["csStart"];
    this.counts.nCyclesChecksumInterval = parmsCPU["csInterval"];
    this.counts.nCyclesChecksumStop = parmsCPU["csStop"];

    this.onRunTimeout = this.runCPU.bind(this); // function onRunTimeout() { cpu.runCPU(); };

    this.setReady();
}

Component.subclass(CPU);

/*
 * Constants that control the frequency at which various updates should occur.
 *
 * These values do NOT control the simulation directly.  Instead, they are used by
 * calcCycles(), which uses the nCyclesPerSecond passed to the constructor as a starting
 * point and computes the following variables:
 *
 *      this.aCounts.nCyclesPerYield         (this.aCounts.nCyclesPerSecond / CPU.YIELDS_PER_SECOND)
 *      this.aCounts.nCyclesPerVideoUpdate   (this.aCounts.nCyclesPerSecond / CPU.VIDEO_UPDATES_PER_SECOND)
 *      this.aCounts.nCyclesPerStatusUpdate  (this.aCounts.nCyclesPerSecond / CPU.STATUS_UPDATES_PER_SECOND)
 *
 * The above variables are also multiplied by any cycle multiplier in effect, via setSpeed(),
 * and then they're used to initialize another set of variables for each runCPU() iteration:
 *
 *      this.aCounts.nCyclesNextYield        <= this.aCounts.nCyclesPerYield
 *      this.aCounts.nCyclesNextVideoUpdate  <= this.aCounts.nCyclesPerVideoUpdate
 *      this.aCounts.nCyclesNextStatusUpdate <= this.aCounts.nCyclesPerStatusUpdate
 */
CPU.YIELDS_PER_SECOND         = 30;
CPU.VIDEO_UPDATES_PER_SECOND  = 60;
CPU.STATUS_UPDATES_PER_SECOND = 2;

CPU.BUTTONS = ["power", "reset"];

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {CPU}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPU} cpu
 * @param {Debugger6502} dbg
 */
CPU.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.dbg = dbg;

    for (var i = 0; i < CPU.BUTTONS.length; i++) {
        var control = this.bindings[CPU.BUTTONS[i]];
        if (control) this.cmp.setBinding(null, CPU.BUTTONS[i], control);
    }

    /*
     * We need to know the refresh rate (and corresponding interrupt rate, if any) of the Video component.
     */
    var video = cmp.getMachineComponent("Video");
    this.refreshRate = video && video.getRefreshRate() || CPU.VIDEO_UPDATES_PER_SECOND;

    /*
     * Attach the ChipSet component to the CPU so that it can be notified whenever the CPU stops and starts.
     */
    this.chipset = cmp.getMachineComponent("ChipSet");

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
 * @this {CPU}
 */
CPU.prototype.reset = function()
{
     this.counts.nVideoUpdates = 0;
};

/**
 * save()
 *
 * This is a placeholder for save support (overridden by the CPUState component).
 *
 * @this {CPU}
 * @return {Object|null}
 */
CPU.prototype.save = function()
{
    return null;
};

/**
 * restore(data)
 *
 * This is a placeholder for restore support (overridden by the CPUState component).
 *
 * @this {CPU}
 * @param {Object} data
 * @return {boolean} true if restore successful, false if not
 */
CPU.prototype.restore = function(data)
{
    return false;
};

/**
 * powerUp(data, fRepower)
 *
 * @this {CPU}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
CPU.prototype.powerUp = function(data, fRepower)
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
    this.updateCPU();
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {CPU}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
CPU.prototype.powerDown = function(fSave, fShutdown)
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
 * @this {CPU}
 * @return {boolean} true if started, false if not
 */
CPU.prototype.autoStart = function()
{
    /*
     * Start running automatically on power-up, assuming there's no Debugger and no "Run" button
     */
    if (this.flags.autoStart || (!DEBUGGER || !this.dbg) && this.bindings["run"] === undefined) {
        /*
         * Now we ALSO set fUpdateFocus when calling runCPU(), on the assumption that in the "auto-starting" context,
         * a machine without focus is like a day without sunshine.
         */
        this.runCPU(true);
        return true;
    }
    return false;
};

/**
 * isPowered()
 *
 * @this {CPU}
 * @return {boolean}
 */
CPU.prototype.isPowered = function()
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
 * @this {CPU}
 * @return {boolean}
 */
CPU.prototype.isRunning = function()
{
    return this.flags.running;
};

/**
 * getChecksum()
 *
 * This will be implemented by the CPUState component.
 *
 * @this {CPU}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
CPU.prototype.getChecksum = function()
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
 * @this {CPU}
 * @return {boolean} true if checksum generation enabled, false if not
 */
CPU.prototype.resetChecksum = function()
{
    if (this.counts.nCyclesChecksumStart === undefined) this.counts.nCyclesChecksumStart = 0;
    if (this.counts.nCyclesChecksumInterval === undefined) this.counts.nCyclesChecksumInterval = -1;
    if (this.counts.nCyclesChecksumStop === undefined) this.counts.nCyclesChecksumStop = -1;
    this.flags.checksum = (this.counts.nCyclesChecksumStart >= 0 && this.counts.nCyclesChecksumInterval > 0);
    if (this.flags.checksum) {
        this.counts.nChecksum = 0;
        this.counts.nCyclesChecksumNext = this.counts.nCyclesChecksumStart - this.nTotalCycles;
        /*
         *  this.aCounts.nCyclesChecksumNext = this.aCounts.nCyclesChecksumStart + this.aCounts.nCyclesChecksumInterval -
         *      (this.nTotalCycles % this.aCounts.nCyclesChecksumInterval);
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
 * @this {CPU}
 * @param {number} nCycles
 */
CPU.prototype.updateChecksum = function(nCycles)
{
    if (this.flags.checksum) {
        /*
         * Get a 32-bit summation of the current CPU state and add it to our running 32-bit checksum
         */
        var fDisplay = false;
        this.counts.nChecksum = (this.counts.nChecksum + this.getChecksum())|0;
        this.counts.nCyclesChecksumNext -= nCycles;
        if (this.counts.nCyclesChecksumNext <= 0) {
            this.counts.nCyclesChecksumNext += this.counts.nCyclesChecksumInterval;
            fDisplay = true;
        }
        if (this.counts.nCyclesChecksumStop >= 0) {
            if (this.counts.nCyclesChecksumStop <= this.getCycles()) {
                this.counts.nCyclesChecksumInterval = this.counts.nCyclesChecksumStop = -1;
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
 * @this {CPU}
 */
CPU.prototype.displayChecksum = function()
{
    this.println(this.getCycles() + " cycles: " + "checksum=" + str.toHex(this.counts.nChecksum));
};

/**
 * displayValue(sLabel, nValue, cch)
 *
 * This is principally for displaying register values, but in reality, it can be used to display any
 * numeric (hex) value bound to the given label.
 *
 * @this {CPU}
 * @param {string} sLabel
 * @param {number} nValue
 * @param {number} cch
 */
CPU.prototype.displayValue = function(sLabel, nValue, cch)
{
    if (this.bindings[sLabel]) {
        if (nValue === undefined) {
            this.setError("Value for " + sLabel + " is invalid");
            this.stopCPU();
        }
        var sVal;
        if (!this.flags.running || this.flags.displayLiveRegs) {
            sVal = str.toHex(nValue, cch);
        } else {
            sVal = "--------".substr(0, cch);
        }
        /*
         * TODO: Determine if this test actually avoids any redrawing when a register hasn't changed, and/or if
         * we should maintain our own (numeric) cache of displayed register values (to avoid creating these temporary
         * string values that will have to garbage-collected), and/or if this is actually slower, and/or if I'm being
         * too obsessive.
         */
        if (this.bindings[sLabel].textContent != sVal) this.bindings[sLabel].textContent = sVal;
    }
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {CPU}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "run")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
CPU.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var cpu = this;
    var fBound = false;

    switch (sBinding) {
    case "power":
    case "reset":
        /*
         * The "power" and "reset" buttons are functions of the entire computer, not just the CPU,
         * but it's not always convenient to stick a power button in the Computer component definition,
         * so we record those bindings here and pass them on to the Computer component in initBus().
         */
        this.bindings[sBinding] = control;
        fBound = true;
        break;

    case "run":
        this.bindings[sBinding] = control;
        control.onclick = function onClickRun() {
            if (!cpu.cmp || !cpu.cmp.checkPower()) return;
            if (!cpu.flags.running)
                cpu.runCPU(true);
            else
                cpu.stopCPU(true);
        };
        fBound = true;
        break;

    case "speed":
        this.bindings[sBinding] = control;
        fBound = true;
        break;

    case "setSpeed":
        this.bindings[sBinding] = control;
        control.onclick = function onClickSetSpeed() {
            cpu.setSpeed(cpu.counts.nCyclesMultiplier << 1, true);
        };
        control.textContent = this.getSpeedTarget();
        fBound = true;
        break;

    default:
        break;
    }
    return fBound;
};

/**
 * setBurstCycles(nCycles)
 *
 * This function is used by the ChipSet component whenever a very low timer count is set,
 * in anticipation of the timer requiring an update sooner than the normal nCyclesPerYield
 * period in runCPU() would normally provide.
 *
 * @this {CPU}
 * @param {number} nCycles is the target number of cycles to drop the current burst to
 * @return {boolean}
 */
CPU.prototype.setBurstCycles = function(nCycles)
{
    if (this.flags.running) {
        var nDelta = this.nStepCycles - nCycles;
        /*
         * NOTE: If nDelta is negative, we will actually be increasing nStepCycles and nBurstCycles.
         * Which is OK, but if we're also taking snapshots of the cycle counts, to make sure that instruction
         * costs are being properly assessed, then we need to update nSnapCycles as well.
         *
         * TODO: If the delta is negative, we could simply ignore the request, but we must first carefully
         * consider the impact on the ChipSet timers, if any.
         */
        // if (DEBUG) this.nSnapCycles -= nDelta;
        this.nStepCycles -= nDelta;
        this.nBurstCycles -= nDelta;
        return true;
    }
    return false;
};

/**
 * addCycles(nCycles, fEndStep)
 *
 * @this {CPU}
 * @param {number} nCycles
 * @param {boolean} [fEndStep]
 */
CPU.prototype.addCycles = function(nCycles, fEndStep)
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
 * is driven by the following values:
 *
 *      CPU.YIELDS_PER_SECOND (eg, 30)
 *      CPU.VIDEO_UPDATES_PER_SECOND (eg, 60)
 *      CPU.STATUS_UPDATES_PER_SECOND (eg, 5)
 *
 * The largest of the above values forces the size of the burst to its smallest value.  Let's say that
 * largest value is 30.  Assuming nCyclesPerSecond is 1,000,000, that results in bursts of 33,333 cycles.
 *
 * At the end of each burst, we subtract burst cycles from yield, video, and status cycle "threshold"
 * counters. Whenever the "next yield" cycle counter goes to (or below) zero, we compare elapsed time
 * to the time we expected the virtual hardware to take (eg, 1000ms/50 or 20ms), and if we still have time
 * remaining, we sleep the remaining time (or 0ms if there's no remaining time), and then restart runCPU().
 *
 * Similarly, whenever the "next video update" cycle counter goes to (or below) zero, we call updateVideo(),
 * and whenever the "next status update" cycle counter goes to (or below) zero, we call updateStatus().
 *
 * @this {CPU}
 * @param {boolean} [fRecalc] is true if the caller wants to recalculate thresholds based on the most recent
 * speed calculation (see calcSpeed).
 */
CPU.prototype.calcCycles = function(fRecalc)
{
    /*
     * Calculate the most cycles we're allowed to execute in a single "burst"
     */
    var nMostUpdatesPerSecond = CPU.YIELDS_PER_SECOND;
    if (nMostUpdatesPerSecond < this.refreshRate) nMostUpdatesPerSecond = this.refreshRate;
    if (nMostUpdatesPerSecond < CPU.STATUS_UPDATES_PER_SECOND) nMostUpdatesPerSecond = CPU.STATUS_UPDATES_PER_SECOND;

    /*
     * Calculate cycle "per" values for the yield, video update, and status update cycle counters
     */
    var vMultiplier = 1;
    if (fRecalc) {
        if (this.counts.nCyclesMultiplier > 1 && this.counts.mhz) {
            vMultiplier = (this.counts.mhz / this.counts.mhzDefault);
        }
    }

    this.counts.msPerYield = Math.round(1000 / CPU.YIELDS_PER_SECOND);
    this.counts.nCyclesPerBurst = Math.floor(this.counts.nCyclesPerSecond / nMostUpdatesPerSecond * vMultiplier);
    this.counts.nCyclesPerYield = Math.floor(this.counts.nCyclesPerSecond / CPU.YIELDS_PER_SECOND * vMultiplier);
    this.counts.nCyclesPerVideoUpdate = Math.floor(this.counts.nCyclesPerSecond / this.refreshRate * vMultiplier);
    this.counts.nCyclesPerStatusUpdate = Math.floor(this.counts.nCyclesPerSecond / CPU.STATUS_UPDATES_PER_SECOND * vMultiplier);

    /*
     * And initialize "next" yield, video update, and status update cycle "threshold" counters to those "per" values
     */
    if (!fRecalc) {
        this.counts.nCyclesNextYield = this.counts.nCyclesPerYield;
        this.counts.nCyclesNextVideoUpdate = this.counts.nCyclesPerVideoUpdate;
        this.counts.nCyclesNextStatusUpdate = this.counts.nCyclesPerStatusUpdate;
    }
    this.counts.nCyclesRecalc = 0;
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
 * @this {CPU}
 * @param {boolean} [fScaled] is true if the caller wants a cycle count relative to a multiplier of 1
 * @return {number}
 */
CPU.prototype.getCycles = function(fScaled)
{
    var nCycles = this.nTotalCycles + this.nRunCycles + this.nBurstCycles - this.nStepCycles;
    if (fScaled && this.counts.nCyclesMultiplier > 1 && this.counts.mhz > this.counts.mhzDefault) {
        /*
         * We could scale the current cycle count by the current effective speed (this.aCounts.mhz); eg:
         *
         *      nCycles = Math.round(nCycles / (this.aCounts.mhz / this.aCounts.mhzDefault));
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
        nCycles = Math.round(nCycles / this.counts.nCyclesMultiplier);
    }
    return nCycles;
};

/**
 * getCyclesPerSecond()
 *
 * This returns the CPU's "base" speed (ie, the original cycles per second defined for the machine)
 *
 * @this {CPU}
 * @return {number}
 */
CPU.prototype.getCyclesPerSecond = function()
{
    return this.counts.nCyclesPerSecond;
};

/**
 * resetCycles()
 *
 * Resets speed and cycle information as part of any reset() or restore(); this typically occurs during powerUp().
 * It's important that this be called BEFORE the actual restore() call, because restore() may want to call setSpeed(),
 * which in turn assumes that all the cycle counts have been initialized to sensible values.
 *
 * @this {CPU}
 */
CPU.prototype.resetCycles = function()
{
    this.counts.mhz = 0;
    this.nTotalCycles = this.nRunCycles = this.nBurstCycles = this.nStepCycles = 0;
    this.resetChecksum();
    this.setSpeed(1);
};

/**
 * getSpeed()
 *
 * @this {CPU}
 * @return {number} the current speed multiplier
 */
CPU.prototype.getSpeed = function()
{
    return this.counts.nCyclesMultiplier;
};

/**
 * getSpeedCurrent()
 *
 * @this {CPU}
 * @return {string} the current speed, in mhz, as a string formatted to two decimal places
 */
CPU.prototype.getSpeedCurrent = function()
{
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now?
     */
    return ((this.flags.running && this.counts.mhz)? (this.counts.mhz.toFixed(2) + "Mhz") : "Stopped");
};

/**
 * getSpeedTarget()
 *
 * @this {CPU}
 * @return {string} the target speed, in mhz, as a string formatted to two decimal places
 */
CPU.prototype.getSpeedTarget = function()
{
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now?
     */
    return this.counts.mhzTarget.toFixed(2) + "Mhz";
};

/**
 * setSpeed(nMultiplier, fUpdateFocus)
 *
 * NOTE: This used to return the target speed, in mhz, but no callers appear to care at this point.
 *
 * @this {CPU}
 * @param {number} [nMultiplier] is the new proposed multiplier (reverts to 1 if the target was too high)
 * @param {boolean} [fUpdateFocus] is true to update Computer focus
 * @return {boolean} true if successful, false if not
 *
 * @desc Whenever the speed is changed, the running cycle count and corresponding start time must be reset,
 * so that the next effective speed calculation obtains sensible results.  In fact, when runCPU() initially calls
 * setSpeed() with no parameters, that's all this function does (it doesn't change the current speed setting).
 */
CPU.prototype.setSpeed = function(nMultiplier, fUpdateFocus)
{
    var fSuccess = false;
    if (nMultiplier !== undefined) {
        /*
         * If we haven't reached 80% (0.8) of the current target speed, revert to a multiplier of one (1).
         */
        if (this.counts.mhz / this.counts.mhzTarget < 0.8) {
            nMultiplier = 1;
        } else {
            fSuccess = true;
        }
        this.counts.nCyclesMultiplier = nMultiplier;
        var mhz = this.counts.mhzDefault * this.counts.nCyclesMultiplier;
        if (this.counts.mhzTarget != mhz) {
            this.counts.mhzTarget = mhz;
            var sSpeed = this.getSpeedTarget();
            var controlSpeed = this.bindings["setSpeed"];
            if (controlSpeed) controlSpeed.textContent = sSpeed;
            this.println("target speed: " + sSpeed);
        }
        if (fUpdateFocus && this.cmp) this.cmp.updateFocus();
    }
    this.addCycles(this.nRunCycles);
    this.nRunCycles = 0;
    this.counts.msStartRun = usr.getTime();
    this.counts.msEndThisRun = 0;
    this.calcCycles();
    return fSuccess;
};

/**
 * calcSpeed(nCycles, msElapsed)
 *
 * @this {CPU}
 * @param {number} nCycles
 * @param {number} msElapsed
 */
CPU.prototype.calcSpeed = function(nCycles, msElapsed)
{
    if (msElapsed) {
        this.counts.mhz = Math.round(nCycles / (msElapsed * 10)) / 100;
        if (msElapsed >= 86400000) {
            this.nTotalCycles = 0;
            this.setSpeed();        // reset all counters once per day so that we never have to worry about overflow
        }
    }
};

/**
 * calcStartTime()
 *
 * @this {CPU}
 */
CPU.prototype.calcStartTime = function()
{
    if (this.counts.nCyclesRecalc >= this.counts.nCyclesPerSecond) {
        this.calcCycles(true);
    }
    this.counts.nCyclesThisRun = 0;
    this.counts.msStartThisRun = usr.getTime();

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
    if (this.counts.msEndThisRun) {
        var msDelta = this.counts.msStartThisRun - this.counts.msEndThisRun;
        if (msDelta > this.counts.msPerYield) {
            if (MAXDEBUG) this.println("large time delay: " + msDelta + "ms");
            this.counts.msStartRun += msDelta;
            /*
             * Bumping msStartRun forward should NEVER cause it to exceed msStartThisRun; however, just
             * in case, I make absolutely sure it cannot happen, since doing so could result in negative
             * speed calculations.
             */
            this.assert(this.counts.msStartRun <= this.counts.msStartThisRun);
            if (this.counts.msStartRun > this.counts.msStartThisRun) {
                this.counts.msStartRun = this.counts.msStartThisRun;
            }
        }
    }
};

/**
 * calcRemainingTime()
 *
 * @this {CPU}
 * @return {number}
 */
CPU.prototype.calcRemainingTime = function()
{
    this.counts.msEndThisRun = usr.getTime();

    var msYield = this.counts.msPerYield;
    if (this.counts.nCyclesThisRun) {
        /*
         * Normally, we would assume we executed a full quota of work over msPerYield, but since the CPU
         * now has the option of calling yieldCPU(), that might not be true.  If nCyclesThisRun is correct, then
         * the ratio of nCyclesThisRun/nCyclesPerYield should represent the percentage of work we performed,
         * and so applying that percentage to msPerYield should give us a better estimate of work vs. time.
         */
        msYield = Math.round(msYield * this.counts.nCyclesThisRun / this.counts.nCyclesPerYield);
    }

    var msElapsedThisRun = this.counts.msEndThisRun - this.counts.msStartThisRun;
    var msRemainsThisRun = msYield - msElapsedThisRun;

    /*
     * We could pass only "this run" results to calcSpeed():
     *
     *      nCycles = this.aCounts.nCyclesThisRun;
     *      msElapsed = msElapsedThisRun;
     *
     * but it seems preferable to use longer time periods and hopefully get a more accurate speed.
     *
     * Also, if msRemainsThisRun >= 0 && this.aCounts.nCyclesMultiplier == 1, we could pass these results instead:
     *
     *      nCycles = this.aCounts.nCyclesThisRun;
     *      msElapsed = this.aCounts.msPerYield;
     *
     * to insure that we display a smooth, constant N Mhz.  But for now, I prefer seeing any fluctuations.
     */
    var nCycles = this.nRunCycles;
    var msElapsed = this.counts.msEndThisRun - this.counts.msStartRun;

    if (MAXDEBUG && msRemainsThisRun < 0 && this.counts.nCyclesMultiplier > 1) {
        this.println("warning: updates @" + msElapsedThisRun + "ms (prefer " + Math.round(msYield) + "ms)");
    }

    this.calcSpeed(nCycles, msElapsed);

    if (msRemainsThisRun < 0 || this.counts.mhz < this.counts.mhzTarget) {
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
    this.counts.nCyclesRecalc += this.counts.nCyclesThisRun;

    if (DEBUG && this.messageEnabled(Messages.LOG) && msRemainsThisRun) {
        this.log("calcRemainingTime: " + msRemainsThisRun + "ms to sleep after " + this.counts.msEndThisRun + "ms");
    }

    this.counts.msEndThisRun += msRemainsThisRun;
    return msRemainsThisRun;
};

/**
 * runCPU(fUpdateFocus)
 *
 * @this {CPU}
 * @param {boolean} [fUpdateFocus] is true to update Computer focus
 */
CPU.prototype.runCPU = function(fUpdateFocus)
{
    if (!this.setBusy(true)) {
        this.updateCPU();
        if (this.cmp) this.cmp.stop(usr.getTime(), this.getCycles());
        return;
    }

    this.startCPU(fUpdateFocus);

    /*
     *  calcStartTime() initializes the cycle counter and timestamp for this runCPU() invocation, and optionally
     *  recalculates the the maximum number of cycles for each burst if the nCyclesRecalc threshold has been reached.
     */
    this.calcStartTime();
    try {
        do {
            var nCyclesPerBurst = (this.flags.checksum? 1 : this.counts.nCyclesPerBurst);

            /*
             * nCyclesPerBurst is how many cycles we WANT to run on each iteration of stepCPU(), but it may run
             * significantly less (or slightly more, since we can't execute partial instructions).
             */
            this.stepCPU(nCyclesPerBurst);

            /*
             * nBurstCycles, less any remaining nStepCycles, is how many cycles stepCPU() ACTUALLY ran (nCycles).
             * We add that to nCyclesThisRun, as well as nRunCycles, which is the cycle count since the CPU first
             * started running.
             */
            var nCycles = this.nBurstCycles - this.nStepCycles;
            this.nRunCycles += nCycles;
            this.counts.nCyclesThisRun += nCycles;
            this.addCycles(0, true);
            this.updateChecksum(nCycles);

            this.counts.nCyclesNextVideoUpdate -= nCycles;
            if (this.counts.nCyclesNextVideoUpdate <= 0) {
                this.counts.nCyclesNextVideoUpdate += this.counts.nCyclesPerVideoUpdate;
                if (this.cmp) this.cmp.updateVideo(this.counts.nVideoUpdates++);
                if (this.counts.nVideoUpdates > this.refreshRate) this.counts.nVideoUpdates = 0;
            }

            this.counts.nCyclesNextStatusUpdate -= nCycles;
            if (this.counts.nCyclesNextStatusUpdate <= 0) {
                this.counts.nCyclesNextStatusUpdate += this.counts.nCyclesPerStatusUpdate;
                if (this.cmp) this.cmp.updateStatus();
            }

            this.counts.nCyclesNextYield -= nCycles;
            if (this.counts.nCyclesNextYield <= 0) {
                this.counts.nCyclesNextYield += this.counts.nCyclesPerYield;
                break;
            }
        } while (this.flags.running);
    }
    catch (e) {
        this.stopCPU();
        this.updateCPU();
        if (this.cmp) this.cmp.stop(usr.getTime(), this.getCycles());
        this.setBusy(false);
        this.setError(e.stack || e.message);
        return;
    }
    setTimeout(this.onRunTimeout, this.calcRemainingTime());
};

/**
 * startCPU(fUpdateFocus)
 *
 * WARNING: Other components must use runCPU() to get the CPU running; this is a runCPU() helper function only.
 *
 * @param {boolean} [fUpdateFocus]
 */
CPU.prototype.startCPU = function(fUpdateFocus)
{
    if (!this.flags.running) {
        /*
         *  setSpeed() without a speed parameter leaves the selected speed in place, but also resets the
         *  cycle counter and timestamp for the current series of runCPU() calls, calculates the maximum number
         *  of cycles for each burst based on the last known effective CPU speed, and resets the nCyclesRecalc
         *  threshold counter.
         */
        this.setSpeed();
        if (this.cmp) this.cmp.start(this.counts.msStartRun, this.getCycles());
        this.flags.running = true;
        this.flags.starting = true;
        if (this.chipset) this.chipset.start();
        var controlRun = this.bindings["run"];
        if (controlRun) controlRun.textContent = "Halt";
        if (this.cmp) {
            this.cmp.updateStatus(true);
            if (fUpdateFocus) this.cmp.updateFocus(true);
        }
    }
};

/**
 * stepCPU(nMinCycles)
 *
 * This will be implemented by the CPUState component.
 *
 * @this {CPU}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates that the last instruction was not executed
 */
CPU.prototype.stepCPU = function(nMinCycles)
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
 * @this {CPU}
 * @param {boolean} [fComplete]
 */
CPU.prototype.stopCPU = function(fComplete)
{
    this.isBusy(true);
    this.nBurstCycles -= this.nStepCycles;
    this.nStepCycles = 0;
    this.addCycles(this.nRunCycles);
    this.nRunCycles = 0;
    if (this.flags.running) {
        this.flags.running = false;
        if (this.chipset) this.chipset.stop();
        var controlRun = this.bindings["run"];
        if (controlRun) controlRun.textContent = "Run";
    }
    this.flags.complete = fComplete;
};

/**
 * updateCPU(fForce)
 *
 * This used to be performed at the end of every stepCPU(), but runCPU() -- which relies upon
 * stepCPU() -- needed to have more control over when these updates are performed.  However, for
 * other callers of stepCPU(), such as the Debugger, the combination of stepCPU() + updateCPU()
 * provides the old behavior.
 *
 * @this {CPU}
 * @param {boolean} [fForce] (true to force a video update; used by the Debugger)
 */
CPU.prototype.updateCPU = function(fForce)
{
    if (this.cmp) {
        this.cmp.updateVideo(-1);
        this.cmp.updateStatus(fForce);
    }
};

/**
 * yieldCPU()
 *
 * Similar to stopCPU() with regard to how it resets various cycle countdown values, but the CPU
 * remains in a "running" state.
 *
 * @this {CPU}
 */
CPU.prototype.yieldCPU = function()
{
    this.counts.nCyclesNextYield = 0;  // this will break us out of runCPU(), once we break out of stepCPU()
    this.nBurstCycles -= this.nStepCycles;
    this.nStepCycles = 0;               // this will break us out of stepCPU()
    // if (DEBUG) this.nSnapCycles = this.nBurstCycles;
    /*
     * The Debugger calls yieldCPU() after every message() to ensure browser responsiveness, but it looks
     * odd for those messages to show CPU state changes but for the CPU's own status display to not (ditto
     * for the Video display), so I've added this call to try to keep things looking synchronized.
     */
    this.updateCPU();
};

if (NODE) module.exports = CPU;
