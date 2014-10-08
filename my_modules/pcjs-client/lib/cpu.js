/**
 * @fileoverview Implements the PCjs CPU component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Sep-04
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

if (typeof module !== 'undefined') {
    var str = require("../../shared/lib/strlib");
    var usr = require("../../shared/lib/usrlib");
    var Component = require("../../shared/lib/component");
}

/**
 * CPU(parmsCPU, nCyclesDefault)
 *
 * The CPU class supports the following (parmsCPU) properties:
 *
 *      cycles: the machine's base cycles per second; the X86CPU constructor will
 *      provide us with a default (based on the CPU model) to use as a fallback
 *      
 *      multiplier: base cycle multiplier; default is 1
 *      
 *      autoStart: true to automatically start, false to not, or null (default)
 *      to make the autoStart decision based on whether or not a Debugger is
 *      installed (if there's no Debugger AND no "Run" button, then auto-start,
 *      otherwise don't)
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
 * It is extended by the X86CPU component, where all the x86-specific logic resides.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsCPU
 * @param {number} nCyclesDefault
 */
function CPU(parmsCPU, nCyclesDefault)
{
    Component.call(this, "CPU", parmsCPU, CPU);

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

    this.fPowered = false;
    this.fRunning = false;
    this.fAutoStart = parmsCPU['autoStart'];

    /*
     * Provide a power-saving URL-based way of overriding the 'autostart' setting;
     * if an "autostart" parameter is specified on the URL, anything other than "true"
     * or "false" is treated as the null setting (see above for details).
     */
    var sAutoStart = Component.parmsURL['autostart'];
    if (sAutoStart !== undefined) {
        this.fAutoStart = (sAutoStart == "true"? true : (sAutoStart  == "false"? false : null));
    }

    /*
     * Get checksum parameters, if any. runCPU() behavior is not affected until fChecksum
     * is true, which won't happen until resetChecksum() is called with nCyclesChecksumInterval
     * ("csInterval") set to a positive value.
     * 
     * As above, any of these parameters can also be set with the Debugger's execution options
     * command ("x"); for example, "x cs int 5000" will set nCyclesChecksumInterval to 5000
     * and call resetChecksum().
     */
    this.fChecksum = false;
    this.nChecksum = this.nCyclesChecksumNext = 0;
    this.nCyclesChecksumStart = parmsCPU["csStart"];
    this.nCyclesChecksumInterval = parmsCPU["csInterval"];
    this.nCyclesChecksumStop = parmsCPU["csStop"];

    var cpu = this;
    this.onRunTimeout = function() { cpu.runCPU(); };
    
    this.setReady();
}

Component.subclass(Component, CPU);

/*
 * Constants that control the frequency at which various updates should occur.
 *
 * These values do NOT control the simulation directly.  Instead, they are used by
 * calcCycles(), which uses the nCyclesPerSecond passed to the constructor as a starting
 * point and computes the following variables:
 *
 *      this.nCyclesPerYield         (this.nCyclesPerSecond / CPU.YIELDS_PER_SECOND)
 *      this.nCyclesPerVideoUpdate   (this.nCyclesPerSecond / CPU.VIDEO_UPDATES_PER_SECOND)
 *      this.nCyclesPerStatusUpdate  (this.nCyclesPerSecond / CPU.STATUS_UPDATES_PER_SECOND)
 *
 * The above variables are also multiplied by any cycle multiplier in effect, via setSpeed(),
 * and then they're used to initialize another set of variables for each runCPU() iteration:
 *
 *      this.nCyclesNextYield        <= this.nCyclesPerYield
 *      this.nCyclesNextVideoUpdate  <= this.nCyclesPerVideoUpdate
 *      this.nCyclesNextStatusUpdate <= this.nCyclesPerStatusUpdate
 */
CPU.YIELDS_PER_SECOND         = 30;
CPU.VIDEO_UPDATES_PER_SECOND  = 60;     // WARNING: if you change this, beware of side-effects in the Video component
CPU.STATUS_UPDATES_PER_SECOND = 2;

/**
 * initBus(cmp, bus, cpu, dbg)
 * 
 * @this {CPU}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPU} cpu
 * @param {Debugger} dbg
 */
CPU.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.dbg = dbg;
    this.cmp = cmp;
    /*
     * Attach the Video component to the CPU, so that the CPU can periodically update
     * the video display via displayVideo(), as cycles permit. 
     */
    var video = cmp.getComponentByType("Video");
    if (video) {
        this.displayVideo = function onDisplayVideo() {
            video.updateScreen();
        };
        this.setFocus = function onSetFocus() {
            video.setFocus();
        };
    }
    /*
     * Attach the ChipSet component to the CPU, so that it can obtain the IDT vector number of
     * pending hardware interrupts, in response to ChipSet's updateINTR() notifications.
     * 
     * We must also call chipset.updateAllTimers() periodically; stepCPU() takes care of that.
     */
    this.chipset = cmp.getComponentByType("ChipSet");
    this.setReady();
};

/**
 * reset()
 *
 * This is a placeholder for reset (overridden by the X86CPU component).
 * 
 * @this {CPU}
 */
CPU.prototype.reset = function()
{
};

/**
 * save()
 *
 * This is a placeholder for save support (overridden by the X86CPU component).
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
 * This is a placeholder for restore support (overridden by the X86CPU component).
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
         * Give the Debugger a chance to do/print something once we've powered up (TODO: Review the necessity of this)
         */
        if (DEBUGGER && this.dbg) {
            this.dbg.init();
        } else {
            /*
             * TODO: Once we get rid of those nasty Component method overrides, this test will have to be revised as well
             */
            if (Component.controlPrint) {
                this.warning("No debugger detected");
            }
        }
    }
    this.fPowered = true;
    if (!this.autoStart() && this.dbg) this.dbg.updateStatus();
    this.updateCPU();
    return true;
};

/**
 * powerDown(fSave)
 * 
 * @this {CPU}
 * @param {boolean} fSave
 * @return {Object|boolean}
 */
CPU.prototype.powerDown = function(fSave)
{
    this.fPowered = false;
    return fSave && this.save ? this.save() : true;
};

/**
 * autoStart()
 * 
 * @this {CPU}
 * @return {boolean} true if started, false if not
 */
CPU.prototype.autoStart = function()
{
    if (this.fAutoStart === true || this.fAutoStart === null && (!DEBUGGER || !this.dbg) && this.bindings["run"] === undefined) {
        this.runCPU();      // start running automatically on power-up, assuming there's no Debugger
        return true;
    }
    return false;
};

/**
 * setFocus()
 *
 * @this {CPU}
 */
CPU.prototype.setFocus = function()
{
    /*
     * Nothing to do until powerUp() installs a replacement function
     */
};

/**
 * isPowered()
 *
 * @this {CPU}
 * @return {boolean}
 */
CPU.prototype.isPowered = function()
{
    return this.fPowered;
};

/**
 * isRunning()
 *
 * @this {CPU}
 * @return {boolean}
 */
CPU.prototype.isRunning = function()
{
    return this.fRunning;
};

/**
 * getChecksum()
 * 
 * This will be implemented by the X86CPU component.
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
    if (this.nCyclesChecksumStart === undefined) this.nCyclesChecksumStart = 0;
    if (this.nCyclesChecksumInterval === undefined) this.nCyclesChecksumInterval = -1;
    if (this.nCyclesChecksumStop === undefined) this.nCyclesChecksumStop = -1;
    this.fChecksum = (this.nCyclesChecksumStart >= 0 && this.nCyclesChecksumInterval > 0);
    if (this.fChecksum) {
        this.nChecksum = 0;
        this.nCyclesChecksumNext = this.nCyclesChecksumStart - this.nTotalCycles;
        // this.nCyclesChecksumNext = this.nCyclesChecksumStart + this.nCyclesChecksumInterval - (this.nTotalCycles % this.nCyclesChecksumInterval);
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
    if (this.fChecksum) {
        /*
         * Get a 32-bit summation of the current CPU state and add it to our running 32-bit checksum
         */
        var fDisplay = false;
        this.nChecksum = (this.nChecksum + this.getChecksum()) | 0;
        this.nCyclesChecksumNext -= nCycles;
        if (this.nCyclesChecksumNext <= 0) {
            this.nCyclesChecksumNext += this.nCyclesChecksumInterval;
            fDisplay = true;
        }
        if (this.nCyclesChecksumStop >= 0) {
            if (this.nCyclesChecksumStop <= this.getCycles()) {
                this.nCyclesChecksumInterval = this.nCyclesChecksumStop = -1;
                this.resetChecksum();
                this.haltCPU();
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
    this.println(this.getCycles() + " cycles: " + "checksum=" + str.toHex(this.nChecksum));
};

/**
 * displayReg(sReg, nVal, cch)
 *
 * @this {CPU}
 * @param {string} sReg
 * @param {number} nVal
 * @param {number} [cch] default is 4
 */
CPU.prototype.displayReg = function(sReg, nVal, cch)
{
    if (this.bindings[sReg] !== undefined) {
        if (cch === undefined) cch = 4;
        if (nVal === undefined) {
            this.setError("Register " + sReg + " is invalid");
            this.haltCPU();
        }
        var sVal = str.toHex(nVal, cch);
        /*
         * TODO: Determine if this test actually avoids any redrawing when a register hasn't changed, and/or if
         * we should maintain our own (numeric) cache of displayed register values (to avoid creating these temporary
         * string values that will have to garbage-collected), and/or if this is actually slower, and/or if I'm being
         * too obsessive.
         */
        if (this.bindings[sReg].innerHTML != sVal) this.bindings[sReg].innerHTML = sVal;
    }
};

/**
 * displayStatus()
 *
 * This will be implemented by the X86CPU component.
 *
 * @this {CPU}
 */
CPU.prototype.displayStatus = function()
{
};

/**
 * displayVideo()
 *
 * @this {CPU}
 */
CPU.prototype.displayVideo = function()
{
    /*
     * Nothing to do until powerUp() installs a replacement function
     */
};

/**
 * setBinding(sHTMLClass, sHTMLType, sBinding, control)
 * 
 * @this {CPU}
 * @param {string|null} sHTMLClass is the class of the HTML control (eg, "input", "output")
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "run")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
CPU.prototype.setBinding = function(sHTMLClass, sHTMLType, sBinding, control)
{
    var cpu = this;
    var fBound = false;
    switch (sBinding) {
    case "run":
        this.bindings[sBinding] = control;
        control.onclick = function onClickRun() {
            if (!cpu.fRunning)
                cpu.runCPU(true);
            else
                cpu.haltCPU(true);
        };
        fBound = true;
        break;

    case "reset":
        /*
         * A "reset" button is really a function of the entire computer, not just the CPU, but
         * it's not always convenient to stick a reset button in the computer component definition,
         * so we support a "reset" binding both here AND in the Computer component.
         */
        this.bindings[sBinding] = control;
        control.onclick = function onClickReset() {
            if (cpu.cmp) cpu.cmp.onReset();
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
            cpu.setSpeed(cpu.nCyclesMultiplier << 1, true);
        };
        control.innerHTML = this.getSpeedTarget();
        fBound = true;
        break;

    default:
        break;
    }
    return fBound;
};

/**
 * setBurstDivisor(nDivisor)
 *
 * This is called by the ChipSet component, on behalf of TIMER0, whenever the initial timer count has been
 * reprogrammed to a lower-than-default value, requiring the CPU to perform more frequent timer updates.
 *
 * A divisor greater than 1 (the default) does NOT require us to yield more frequently or update the screen
 * more frequently; it only means that stepCPU() must be called more frequently, with correspondingly smaller burst
 * cycles, because stepCPU() is responsible for updating all the timers ONCE, each time it's called.
 * 
 * @this {CPU}
 * @param {number} nDivisor
 */
CPU.prototype.setBurstDivisor = function(nDivisor)
{
    this.nBurstDivisor = nDivisor;
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
 * Similarly, whenever the "next video update" cycle counter goes to (or below) zero, we call displayVideo(),
 * and whenever the "next status update" cycle counter goes to (or below) zero, we call displayStatus().
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
    if (nMostUpdatesPerSecond < CPU.VIDEO_UPDATES_PER_SECOND) nMostUpdatesPerSecond = CPU.VIDEO_UPDATES_PER_SECOND;
    if (nMostUpdatesPerSecond < CPU.STATUS_UPDATES_PER_SECOND) nMostUpdatesPerSecond = CPU.STATUS_UPDATES_PER_SECOND;

    /*
     * Calculate cycle "per" values for the yield, video update, and status update cycle counters
     */
    var vMultiplier = 1;
    if (fRecalc) {
        if (this.nCyclesMultiplier > 1 && this.mhz) {
            vMultiplier = (this.mhz / this.mhzDefault);
        }
    }

    this.msPerYield = Math.round(1000 / CPU.YIELDS_PER_SECOND);
    this.nCyclesPerBurst = Math.floor(this.nCyclesPerSecond / nMostUpdatesPerSecond * vMultiplier);
    this.nCyclesPerYield = Math.floor(this.nCyclesPerSecond / CPU.YIELDS_PER_SECOND * vMultiplier);
    this.nCyclesPerVideoUpdate = Math.floor(this.nCyclesPerSecond / CPU.VIDEO_UPDATES_PER_SECOND * vMultiplier);
    this.nCyclesPerStatusUpdate = Math.floor(this.nCyclesPerSecond / CPU.STATUS_UPDATES_PER_SECOND * vMultiplier);

    /*
     * And initialize "next" yield, video update, and status update cycle "threshold" counters to those "per" values
     */
    if (!fRecalc) {
        this.nCyclesNextYield = this.nCyclesPerYield;
        this.nCyclesNextVideoUpdate = this.nCyclesPerVideoUpdate;
        this.nCyclesNextStatusUpdate = this.nCyclesPerStatusUpdate;
    }
    this.nRecalcCycles = 0;
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
 * @this {CPU}
 * @return {number}
 */
CPU.prototype.getCyclesPerSecond = function()
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
 * @this {CPU}
 */
CPU.prototype.resetCycles = function()
{
    this.mhz = 0;
    this.setBurstDivisor(1);
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
CPU.prototype.getSpeed = function() {
    return this.nCyclesMultiplier;
};

/**
 * getSpeedCurrent()
 *
 * @this {CPU}
 * @return {string} the current speed, in mhz, as a string formatted to two decimal places
 */
CPU.prototype.getSpeedCurrent = function() {
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now? 
     */
    return ((this.fRunning && this.mhz)? (this.mhz.toFixed(2) + "Mhz") : "Stopped"); 
};

/**
 * getSpeedTarget()
 *
 * @this {CPU}
 * @return {string} the target speed, in mhz, as a string formatted to two decimal places
 */
CPU.prototype.getSpeedTarget = function() {
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now? 
     */
    return this.mhzTarget.toFixed(2) + "Mhz";
};

/**
 * setSpeed(nMultiplier, fOnClick)
 * 
 * @this {CPU}
 * @param {number} [nMultiplier] is the new proposed multiplier (reverts to 1 if the target was too high)
 * @param {boolean} [fOnClick] is true if called from a click handler that might have stolen focus
 * @return {number} the target speed, in mhz
 * @desc Whenever the speed is changed, the running cycle count and corresponding start time must be reset,
 * so that the next effective speed calculation obtains sensible results.  In fact, when runCPU() initially calls
 * setSpeed() with no parameters, that's all this function does (it doesn't change the current speed setting).
 */
CPU.prototype.setSpeed = function(nMultiplier, fOnClick)
{
    if (nMultiplier !== undefined) {
        /*
         * If we couldn't reach at least 80% (0.8) of the current target speed,
         * then revert the multiplier back to one.
         */
        if (this.mhz/this.mhzTarget < 0.8) nMultiplier = 1;
        this.nCyclesMultiplier = nMultiplier;
        this.mhzTarget = this.mhzDefault * this.nCyclesMultiplier;
        var sSpeed = this.getSpeedTarget();
        if (this.bindings["setSpeed"]) this.bindings["setSpeed"].innerHTML = sSpeed;
        this.println("target speed: " + sSpeed);
        if (fOnClick) this.setFocus();
    }
    this.addCycles(this.nRunCycles);
    this.nRunCycles = 0;
    this.msRunStart = usr.getTime();
    this.msEndThisRun = 0;
    this.calcCycles();
    return this.mhzTarget;
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
        this.mhz = Math.round(nCycles / (msElapsed * 10)) / 100;
        if (msElapsed >= 86400000) {
            this.nTotalCycles = 0;
            if (this.chipset) this.chipset.updateAllTimers(true);
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
    if (this.nRecalcCycles >= this.nCyclesPerSecond) {
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
     * if the delta is significant, we compensate by bumping msRunStart forward by that delta.
     * 
     * This shouldn't be triggered when the Debugger halts the CPU, because setSpeed() -- which is called
     * whenever the CPU starts running again -- zeroes msEndThisRun.
     * 
     * This also won't do anything about other internal delays; for example, Debugger message() calls.
     * By the time the message() function has called yieldCPU(), the cost of the message has already been
     * incurred, so it will be end up being charged against the instruction(s) that triggered them.
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
            this.msRunStart += msDelta;
            /*
             * Bumping msRunStart forward should NEVER cause it to exceed msStartThisRun; however, just
             * in case, I make absolutely sure it cannot happen, since doing so could result in negative
             * speed calculations.
             */
            Component.assert(this.msRunStart <= this.msStartThisRun);
            if (this.msRunStart > this.msStartThisRun) {
                this.msRunStart = this.msStartThisRun;
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
    var msElapsed = this.msEndThisRun - this.msRunStart;

    if (MAXDEBUG && msRemainsThisRun < 0 && this.nCyclesMultiplier > 1) {
        this.println("warning: updates @" + msElapsedThisRun + "ms (prefer " + Math.round(msYield) + "ms)");
    }

    this.calcSpeed(nCycles, msElapsed);

    if (msRemainsThisRun < 0 || this.mhz < this.mhzTarget) {
        /*
         * If the last burst took MORE time than we allotted (ie, it's taking more than 1 second to simulate
         * nCyclesPerSecond), all we can do is yield for as little time as possible (ie, 0ms) and hope that the
         * simulation is at least usable.
         */
        msRemainsThisRun = 0;
    }

    /*
     * Last but not least, update nRecalcCycles, so that when runCPU() starts up again and calls calcStartTime(),
     * it'll be ready to decide if calcCycles() should be called again.  
     */
    this.nRecalcCycles += this.nCyclesThisRun;

    if (DEBUG && this.dbg && this.dbg.messageEnabled(this.dbg.MESSAGE_LOG) && msRemainsThisRun) {
        this.dbg.message("at " + this.msEndThisRun + "ms, calcRemainingTime returned " + msRemainsThisRun + "ms to sleep");
    }

    this.msEndThisRun += msRemainsThisRun;
    return msRemainsThisRun;
};

/**
 * runCPU(fOnClick)
 * 
 * @this {CPU}
 * @param {boolean} [fOnClick] is true if called from a click handler that might have stolen focus
 */
CPU.prototype.runCPU = function(fOnClick)
{
    if (!this.setBusy(true)) {
        this.updateCPU();
        if (this.cmp) this.cmp.stop(usr.getTime(), this.getCycles());
        return;
    }
    if (!this.fRunning) {
        /*
         *  setSpeed() without a speed parameter leaves the selected speed in place, but also resets the
         *  cycle counter and timestamp for the current series of runCPU() calls, calculates the maximum number
         *  of cycles for each burst based on the last known effective CPU speed, and resets the nRecalcCycles
         *  threshold counter.
         */
        this.setSpeed();
        if (this.cmp) this.cmp.start(this.msRunStart, this.getCycles());
        this.fRunning = true;
        if (this.chipset) this.chipset.setSpeaker();
        if (this.bindings["run"]) this.bindings["run"].innerHTML = "Halt";
        if (fOnClick) this.setFocus();
    }
    /*
     *  calcStartTime() initializes the cycle counter and timestamp for this runCPU() invocation, and optionally
     *  recalculates the the maximum number of cycles for each burst if the nRecalcCycles threshold has been reached.
     */
    this.calcStartTime();
    try {
        do {
            var nCyclesPerBurst = this.fChecksum? 1 : Math.round(this.nCyclesPerBurst / this.nBurstDivisor);
            
            /*
             * This is an alternative to ChipSet calling setBurstDivisor().  Unfortunately, this doesn't seem
             * to work as well as setBurstDivisor(); for some reason, the smaller bursts that the burst divisor
             * produces results in smoother video updates (see "BASICA DONKEY.BAS").  TODO: Research required;
             * be sure to disable the setBurstDivisor() code in chipset.js if you enable this code.
             *
             *  var nCyclesTimer0 = (this.chipset? (this.chipset.getTimerCycleLimit(0)): 0);
             *  if (nCyclesTimer0 && nCyclesPerBurst > nCyclesTimer0) {
             *      nCyclesPerBurst = nCyclesTimer0;
             *  }
             */
            
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
            this.nCyclesThisRun += nCycles;
            this.addCycles(0, true);
            this.updateChecksum(nCycles);

            this.nCyclesNextVideoUpdate -= nCycles;
            if (this.nCyclesNextVideoUpdate <= 0) {
                this.nCyclesNextVideoUpdate += this.nCyclesPerVideoUpdate;
                this.displayVideo();
            }

            this.nCyclesNextStatusUpdate -= nCycles;
            if (this.nCyclesNextStatusUpdate <= 0) {
                this.nCyclesNextStatusUpdate += this.nCyclesPerStatusUpdate;
                this.displayStatus();
            }

            this.nCyclesNextYield -= nCycles;
            if (this.nCyclesNextYield <= 0) {
                this.nCyclesNextYield += this.nCyclesPerYield;
                break;
            }
        } while (this.fRunning);
    }
    catch (e) {
        this.haltCPU();
        this.updateCPU();
        if (this.cmp) this.cmp.stop(usr.getTime(), this.getCycles());
        this.setBusy(false);
        this.setError(e.message);
        return;
    }
    setTimeout(this.onRunTimeout, this.calcRemainingTime());
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
    if (this.fRunning) {
        var nDelta = this.nStepCycles - nCycles;
        /*
         * NOTE: If nDelta is negative, we will actually be increasing nStepCycles and nBurstCycles.
         * Which is OK, but if we're also taking snapshots of the cycle counts, to make sure that instruction
         * costs are being properly assessed, then we need to update nSnapCycles as well.
         */
        if (DEBUG) this.nSnapCycles -= nDelta;
        this.nStepCycles -= nDelta;
        this.nBurstCycles -= nDelta;
        return true;
    }
    return false;
};

/**
 * haltCPU(fComplete)
 *
 * This similar to yieldCPU(), but it doesn't need to zero nCyclesNextYield to break out of runCPU();
 * it simply needs to clear fRunning (well, "simply" may be oversimplifying a bit....)
 * 
 * @this {CPU}
 * @param {boolean} [fComplete]
 */
CPU.prototype.haltCPU = function(fComplete)
{
    this.isBusy(true);
    this.nBurstCycles -= this.nStepCycles;
    this.nStepCycles = 0;
    this.addCycles(this.nRunCycles);
    this.nRunCycles = 0;
    if (this.fRunning) {
        this.fRunning = false;
        if (this.chipset) this.chipset.setSpeaker();
        if (this.bindings["run"]) this.bindings["run"].innerHTML = "Run";
    }
    this.fComplete = fComplete;
};

/**
 * stepCPU(nMinCycles)
 * 
 * This will be implemented by the X86CPU component.
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
 * updateCPU()
 *
 * This used to be performed at the end of every stepCPU(), but runCPU() -- which relies upon
 * stepCPU() -- needed to have more control over when these updates are performed.  However, for
 * other callers of stepCPU(), such as the Debugger, the combination of stepCPU() + updateCPU()
 * provides the old behavior.
 * 
 * @this {CPU}
 */
CPU.prototype.updateCPU = function()
{
    this.displayVideo();
    this.displayStatus();
};

/**
 * yieldCPU()
 * 
 * Similar to haltCPU() with regard to how it resets various cycle countdown values, but the CPU
 * remains in a "running" state.
 *
 * @this {CPU}
 */
CPU.prototype.yieldCPU = function()
{
    this.nCyclesNextYield = 0;          // this will break us out of runCPU(), once we break out of stepCPU()
    this.nBurstCycles -= this.nStepCycles;
    this.nStepCycles = 0;               // this will break us out of stepCPU()
    /*
     * The Debugger calls yieldCPU() after every message() to ensure browser responsiveness, but it looks
     * odd for those messages to show CPU state changes but for the CPU's own status display to not, so I've
     * added this call to try to keep things looking synchronized.
     */
    this.displayStatus();
};

if (typeof APP_PCJS !== 'undefined') APP_PCJS.CPU = CPU;

if (typeof module !== 'undefined') module.exports = CPU;
