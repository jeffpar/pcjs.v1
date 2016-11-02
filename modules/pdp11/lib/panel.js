/**
 * @fileoverview Implements the PDP11 Panel component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.4 written by Paul Nankervis
 * (paulnank@hotmail.com) as of September 2016 at <http://skn.noip.me/pdp11/pdp11.html>.  This code
 * may be used freely provided the original authors are acknowledged in any modified source code.
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
    var str          = require("../../shared/lib/strlib");
    var usr          = require("../../shared/lib/usrlib");
    var web          = require("../../shared/lib/weblib");
    var Component    = require("../../shared/lib/component");
    var PDP11        = require("./defines");
    var BusPDP11     = require("./bus");
    var MemoryPDP11  = require("./memory");
}

/**
 * PanelPDP11(parmsPanel)
 *
 * The PanelPDP11 component has no required (parmsPanel) properties.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsPanel
 */
function PanelPDP11(parmsPanel)
{
    Component.call(this, "Panel", parmsPanel, PanelPDP11);

    /*
     * If there are any live registers, LEDs, etc, to display, this will provide a count.
     *
     * TODO: Add some UI for fDisplayLiveRegs (either an XML property, or a UI checkbox, or both).
     */
    this.cLiveRegs = 0;
    this.fDisplayLiveRegs = true;
    this.fLampTest = false;
    this.fExamine = this.fDeposit = false;

    /*
     * regCNSW contains the Console (Front Panel) Switch Register, which is also available as a
     * read-only register at 177570 (but only the low 16 bits).
     *
     * regAddr is an internal register containing the contents of the Front Panel's ADDRESS display,
     * and regData corresponds to the DATA display.  They are updated by setAddr() and setData(),
     * which in turn take care of calling updateLEDArray().
     */
    this.regCNSW = 0;
    this.regAddr = this.regData = 0;
    this.regMisc = 0x14;

    /*
     * Every LED has a simple numeric value, assigned when setBinding() is called:
     *
     *      0 if off, 1 if on
     *
     * initBus() will call updateLEDs() to ensure that every LED is set to its initial value.
     */
    this.leds = {};

    /*
     * Every switch has an array associated with it:
     *
     *      [0]: initial/current value of switch (0 if down, 1 if up)
     *      [1]: true if the switch is momentary, false if not
     *      [2]: true if the switch is currently being pressed, false if not
     *      [3]: optional handler to call whenever the switch is pressed or released
     *      [4]: optional switch index (used with CNSW switches 'S0' through 'S21')
     *
     * initBus() will call updateSwitches() to ensure that every switch is the position represented below.
     *
     * NOTE: Not all switches have the same "process" criteria.  For example, 'TEST' will perform a lamp test
     * when it is momentarily pressed "up", whereas 'LOAD [ADRS]' will load the address register from the switch
     * register when it is momentarily pressed "down".
     *
     * This means that processLampTest(value) must act when value == 1, whereas processLoadAddr(value) must
     * act when value == 0.  You can infer all this from the table below, because the initial value of any
     * momentary switch is its "passive" value, so the opposite is its "active" value.
     */
    this.switches = {
        'START':    [1, true,  false, this.processStart],
        'STEP':     [1, false, false, this.processStep],
        'ENABLE':   [1, false, false, this.processEnable],
        'CONT':     [1, true,  false, this.processContinue],
        'DEP':      [0, true,  false, this.processDeposit],
        'EXAM':     [1, true,  false, this.processExamine],
        'LOAD':     [1, true,  false, this.processLoadAddr],
        'TEST':     [0, true,  false, this.processLampTest]
    };
    for (var i = 0; i < 22; i++) {
        this.switches['S'+i] = [0, false, false, this.processSwitchReg, i];
    }
}

Component.subclass(PanelPDP11);

/*
 * To get the current state of a switch; eg::
 *
 *      this.getSwitch(PanelPDP11.SWITCH.ENABLE)
 *
 * However, I haven't filled out this table, primarily because the only switches we need to query
 * are the non-momentary ones (eg, ENABLE and STEP), and EXAM and DEP (because they have special
 * "step" behavior when pressed more than once in a row).
 */
PanelPDP11.SWITCH = {
    DEP:    'DEP',
    ENABLE: 'ENABLE',
    EXAM:   'EXAM',
    STEP:   'STEP'
};

/**
 * getSwitch(name)
 *
 * @this {PanelPDP11}
 * @param {string} name
 * @return {number|undefined} 0 if switch is off ("down"), 1 if on ("up"), or undefined if unrecognized
 */
PanelPDP11.prototype.getSwitch = function(name)
{
    return this.switches[name] && this.switches[name][0];
};

/**
 * reset()
 *
 * @this {PanelPDP11}
 */
PanelPDP11.prototype.reset = function()
{
    this.regMisc = (this.regMisc & ~0x77) | 0x14;   // kernel 16 bit
};

/**
 * setBinding(sType, sBinding, control, sValue)
 *
 * Some panel layouts don't have bindings of their own, and even when they do, there may still be some
 * components (eg, the CPU) that prefer to update their own bindings, so we pass along all binding requests
 * to the Computer, CPU, Keyboard and Debugger components first.  The order shouldn't matter, since any
 * component that doesn't recognize the specified binding should simply ignore it.
 *
 * @this {PanelPDP11}
 * @param {string|null} sType is the type of the HTML control (eg, "button", "textarea", "register", "flag", "rled", etc)
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
PanelPDP11.prototype.setBinding = function(sType, sBinding, control, sValue)
{
    if (this.cmp && this.cmp.setBinding(sType, sBinding, control, sValue)) {
        return true;
    }
    if (this.cpu && this.cpu.setBinding(sType, sBinding, control, sValue)) {
        return true;
    }
    if (DEBUGGER && this.dbg && this.dbg.setBinding(sType, sBinding, control, sValue)) {
        return true;
    }

    switch (sBinding) {
    case 'R0':
    case 'R1':
    case 'R2':
    case 'R3':
    case 'R4':
    case 'R5':
    case 'R6':
    case 'R7':
    case 'NF':
    case 'ZF':
    case 'VF':
    case 'CF':
    case 'PS':
        this.bindings[sBinding] = control;
        this.cLiveRegs++;
        return true;

    default:
        /*
         * Square (default) or round LEDs are defined in machine XML files like so:
         *
         *      <control type="rled" binding="A3" value="1" width="100%" container="center"/>
         *
         * Only *type* and *binding* attributes are required; if *value* is omitted, the default value is 0 (off).
         */
        if (sType == "led" || sType == "rled") {
            this.bindings[sBinding] = control;
            this.leds[sBinding] = sValue? 1 : 0;
            this.cLiveRegs++;
            return true;
        }
        /*
         * Switches are defined in machine XML files like so:
         *
         *      <control type="switch" binding="S3" value="1" width="100%" container="center"/>
         *
         * Only *type* and *binding* attributes are required; if *value* is omitted, the default value is 0 ("down").
         *
         * Currently, there is no XML attribute to indicate whether a switch is "momentary"; only recognized switches
         * in our internal table can have that attribute.
         */
        if (sType == "switch") {
            /*
             * Like LEDs, we allow unrecognized switches to be defined as well, but they won't do anything useful,
             * since only recognized switches will have handlers that perform the appropriate operations.
             */
            if (this.switches[sBinding] === undefined) {
                this.switches[sBinding] = [sValue? 1 : 0];
            }
            this.bindings[sBinding] = control;
            var parent = control.parentElement || control;
            parent = parent.parentElement || parent;
            parent.onmousedown = function(panel, sBinding) {
                return function onPressSwitch() {
                    panel.pressSwitch(sBinding);
                };
            }(this, sBinding);
            parent.onmouseup = parent.onmouseout = function(panel, sBinding) {
                return function onReleaseSwitch() {
                    panel.releaseSwitch(sBinding);
                };
            }(this, sBinding);
            return true;
        }
        return this.parent.setBinding.call(this, sType, sBinding, control, sValue);
    }
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {PanelPDP11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
PanelPDP11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;

    bus.addIOTable(this, PanelPDP11.UNIBUS_IOTABLE);
    bus.addResetHandler(this.reset.bind(this));

    this.updateLEDs();
    this.updateSwitches();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {PanelPDP11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
PanelPDP11.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        /*
         * As noted in init(), our powerUp() method gives us a second opportunity to notify any
         * components that that might care (eg, CPU, Keyboard, and Debugger) that we have some controls
         * they might want to use.
         */
        PanelPDP11.init();
        /*
         * TODO: Until we implement a restore() function, all we can do is reset(); however, that's
         * currently unnecessary, since we've added reset() to the addResetHandler() list.
         *
         *      this.reset();
         */
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {PanelPDP11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
PanelPDP11.prototype.powerDown = function(fSave, fShutdown)
{
    return true;
};

/**
 * updateValue(sLabel, nValue, cch)
 *
 * This is principally for displaying register values, but in reality, it can be used to display any
 * numeric value bound to the given label.
 *
 * @this {PanelPDP11}
 * @param {string} sLabel
 * @param {number} nValue
 * @param {number} [cch]
 */
PanelPDP11.prototype.updateValue = function(sLabel, nValue, cch)
{
    if (this.bindings[sLabel]) {
        if (nValue === undefined) {
            this.setError("Value for " + sLabel + " is invalid");
            this.cpu.stopCPU();
        }
        var sVal;
        var nBase = this.dbg && this.dbg.nBase || 8;
        if (!this.cpu.isRunning() || this.fDisplayLiveRegs) {
            sVal = nBase == 8? str.toOct(nValue, cch) : str.toHex(nValue, cch);
        } else {
            sVal = "--------".substr(0, cch || 4);
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
 * setLED(sBinding, value)
 *
 * @this {PanelPDP11}
 * @param {string} sBinding
 * @param {boolean|number} value (true if the LED should be on, false if off)
 */
PanelPDP11.prototype.setLED = function(sBinding, value)
{
    var control = this.bindings[sBinding];
    if (control) {
        /*
         * TODO: Add support for user-definable LED colors?
         */
        control.style.backgroundColor = (value? "#ff0000" : "#000000");
    }
};

/**
 * updateLEDs(override)
 *
 * @this {PanelPDP11}
 * @param {boolean|number|null} [override] (true turn on all LEDs, false to turn off all LEDs, null or undefined for normal LED activity)
 */
PanelPDP11.prototype.updateLEDs = function(override)
{
    for (var sBinding in this.leds) {
        this.setLED(sBinding, override != null? override : this.leds[sBinding]);
    }
};

/**
 * updateLEDArray(sPrefix, data, nLEDs)
 *
 * @this {PanelPDP11}
 * @param {string} sPrefix
 * @param {number} data
 * @param {number} nLEDs
 */
PanelPDP11.prototype.updateLEDArray = function(sPrefix, data, nLEDs)
{
    for (var i = 0; i < nLEDs; i++) {
        var sBinding = sPrefix + i;
        this.setLED(sBinding, data & (1 << i));
    }
};

/**
 * setSwitch(sBinding, value)
 *
 * @this {PanelPDP11}
 * @param {string} sBinding
 * @param {boolean|number} value (true if the switch should be "up" (on), false if "down" (off))
 */
PanelPDP11.prototype.setSwitch = function(sBinding, value)
{
    var control = this.bindings[sBinding];
    if (control) {
        control.style.marginTop = (value? "0px" : "20px");
        control.style.backgroundColor = (value? "#00ff00" : "#228B22");
    }
};

/**
 * pressSwitch(sBinding)
 *
 * @this {PanelPDP11}
 * @param {string} sBinding
 */
PanelPDP11.prototype.pressSwitch = function(sBinding)
{
    var sw = this.switches[sBinding];
    this.setSwitch(sBinding, sw[0] = 1 - sw[0]);
    sw[2] = true;
    if (sw[3]) sw[3].call(this, sw[0], sw[4]);
    this.fDeposit = (sBinding == PanelPDP11.SWITCH.DEP);
    this.fExamine = (sBinding == PanelPDP11.SWITCH.EXAM);
};

/**
 * releaseSwitch(sBinding)
 *
 * @this {PanelPDP11}
 * @param {string} sBinding
 */
PanelPDP11.prototype.releaseSwitch = function(sBinding)
{
    /*
     * pressSwitch() is simple: flip the switch's current value in sw[0] and marked it "pressed" in sw[2].
     *
     * releaseSwitch() is more complicated, because we must handle both mouseUp and mouseOut events.  The first time
     * we receive EITHER of those events AND the switch is marked momentary (sw[1]) AND the switch is pressed (sw[2]),
     * then we must flip the switch back to its original value.
     *
     * Otherwise, the only thing we have to do is mark the switch as no longer "pressed" (ie, set sw[2] to false).
     */
    var sw = this.switches[sBinding];
    if (sw[1] && sw[2]) {
        this.setSwitch(sBinding, sw[0] = 1 - sw[0]);
        if (sw[3]) sw[3].call(this, sw[0], sw[4]);
    }
    sw[2] = false;
};

/**
 * processStart(value, index)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processStart = function(value, index)
{
    if (!value && !this.cpu.isRunning()) {
        /*
         * TODO: Verify what the PDP-11/70 Handbook means when it says that when the 'START' switch
         * is depressed, "the computer system will be cleared."  I take it to mean that it performs
         * the equivalent of a RESET instruction.
         */
        this.bus.reset();
        this.cpu.resetRegs();
        /*
         * The PDP-11/70 Handbook goes on to say: "If the system needs to be initialized but execution
         * is not wanted, the START switch should be depressed while the HALT/ENABLE switch is in the HALT
         * position."
         */
        if (this.getSwitch(PanelPDP11.SWITCH.ENABLE)) {
            this.cpu.startCPU();
        }
    }
};

/**
 * processStep(value, index)
 *
 * If value == 1 (our initial value), then the 'STEP' switch is set to "S INST" (step one instruction);
 * otherwise, it's set to "S BUS CYCLE" (step one bus cycle).  Note that we don't actually support the
 * latter.
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processStep = function(value, index)
{
};

/**
 * processEnable(value, index)
 *
 * If value == 1 (our initial value), then the 'ENABLE'/'HALT' switch is set to 'ENABLE', otherwise 'HALT'.
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processEnable = function(value, index)
{
    /*
     * The "down" (0) position is 'HALT', which stops the CPU; however, the "up" (1) position ('ENABLE')
     * does NOT start the CPU.  You must press 'CONT' to continue execution, which will either continue for
     * one instruction if this switch to set to 'HALT' or indefinitely if it is set to 'ENABLE'.
     */
    if (!value) {
        this.cpu.stopCPU();
    }
};

/**
 * processContinue(value, index)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processContinue = function(value, index)
{
    if (!value && !this.cpu.isRunning()) {
        if (!this.getSwitch(PanelPDP11.SWITCH.ENABLE)) {
            /*
             * TODO: Technically, we're also supposed to check the 'STEP' switch to determine if we should
             * step one instruction or just one cycle, but we don't currently have the ability to do the latter.
             */
            var dbg = this.dbg;
            if (dbg && !dbg.isBusy(true)) {
                dbg.setBusy(true);
                dbg.stepCPU(0);
                dbg.setBusy(false);
            } else {
                this.cpu.stepCPU(1);
                this.updateStatus();
            }
        }
        else {
            this.cpu.startCPU();
        }
    }
};

/**
 * processDeposit(value, index)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processDeposit = function(value, index)
{
    if (value && !this.cpu.isRunning()) {
        if (this.fDeposit) {
            this.setAddr(this.regAddr + 2);
        }
        this.bus.setWordDirect(this.regAddr, this.setData(this.regCNSW));
    }
};

/**
 * processExamine(value, index)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processExamine = function(value, index)
{
    if (!value && !this.cpu.isRunning()) {
        if (this.fExamine) {
            this.setAddr(this.regAddr + 2);
        }
        this.setData(this.bus.getWordDirect(this.regAddr));
    }
};

/**
 * processLoadAddr(value, index)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processLoadAddr = function(value, index)
{
    if (!value && !this.cpu.isRunning()) {
        this.setAddr(this.regCNSW);
    }
};

/**
 * processLampTest(value, index)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @param {number} [index]
 */
PanelPDP11.prototype.processLampTest = function(value, index)
{
    this.updateLEDs(value || null);
};

/**
 * processSwitchReg(value, index)
 *
 * @this {PanelPDP11}
 * @param {number} value (normally 0 or 1, but we only depend on it being zero or non-zero)
 * @param {number} index
 */
PanelPDP11.prototype.processSwitchReg = function(value, index)
{
    if (value) {
        this.regCNSW |= 1 << index;
    } else {
        this.regCNSW &= ~(1 << index);
    }
};

/**
 * setAddr(value)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @return {number}
 */
PanelPDP11.prototype.setAddr = function(value)
{
    this.regAddr = value & this.bus.nBusMask;
    this.updateLEDArray("A", this.regAddr, 22);
    return this.regAddr;
};

/**
 * setData(value)
 *
 * @this {PanelPDP11}
 * @param {number} value
 * @return {number}
 */
PanelPDP11.prototype.setData = function(value)
{
    this.regData = value & 0xffff;
    this.updateLEDArray("D", this.regData, 16);
    return this.regData;
};

/**
 * updateStatus(fForce)
 *
 * @this {PanelPDP11}
 * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
 */
PanelPDP11.prototype.updateStatus = function(fForce)
{
    if (this.cLiveRegs) {
        if (fForce || !this.cpu.isRunning() || this.fDisplayLiveRegs) {
            for (var i = 0; i < this.cpu.regsGen.length; i++) {
                this.updateValue('R'+i, this.cpu.regsGen[i]);
            }
            var regPSW = this.cpu.getPSW();
            this.updateValue("PS", regPSW);
            this.updateValue("NF", (regPSW & PDP11.PSW.NF)? 1 : 0, 1);
            this.updateValue("ZF", (regPSW & PDP11.PSW.ZF)? 1 : 0, 1);
            this.updateValue("VF", (regPSW & PDP11.PSW.VF)? 1 : 0, 1);
            this.updateValue("CF", (regPSW & PDP11.PSW.CF)? 1 : 0, 1);
            if (!this.fLampTest) {
                this.setData(this.cpu.regsGen[0]);
                this.setAddr(this.cpu.regsGen[7]);
                /*
                 * Set bit to 1 (22-bit), 2 (18-bit), or 4 (16-bit)
                 */
                var bit = this.cpu.mmuEnable? ((this.cpu.regMMR3 & PDP11.MMR3.MMU_22BIT)? 1 : 2) : 4;
                // this.misc = (this.misc & ~7) | bit;
            }
        }
    }
};

/**
 * updateSwitches()
 *
 * @this {PanelPDP11}
 */
PanelPDP11.prototype.updateSwitches = function()
{
    for (var sBinding in this.switches) {
        this.setSwitch(sBinding, this.switches[sBinding][0]);
    }
};

/**
 * readCNSW(addr)
 *
 * If addr is set, then this a normal read, so we should return normal results (ie, switches);
 * if addr is NOT set, then this is a read-before-write, so we must return the value being updated (ie, data).
 *
 * @this {PanelPDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.CNSW or 177570)
 * @return {number}
 */
PanelPDP11.prototype.readCNSW = function(addr)
{
    return (addr? this.regCNSW : this.regData) & 0xffff;
};

/**
 * writeCNSW(data, addr)
 *
 * @this {PanelPDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.CNSW or 177570)
 */
PanelPDP11.prototype.writeCNSW = function(data, addr)
{
    this.regData = data;
};

PanelPDP11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.CNSW]:    /* 177570 */    [null, null, PanelPDP11.prototype.readCNSW, PanelPDP11.prototype.writeCNSW, "CNSW"]
};

/**
 * PanelPDP11.init()
 *
 * This function operates on every HTML element of class "panel", extracting the
 * JSON-encoded parameters for the PanelPDP11 constructor from the element's "data-value"
 * attribute, invoking the constructor to create a PanelPDP11 component, and then binding
 * any associated HTML controls to the new component.
 *
 * NOTE: Unlike most other component init() functions, this one is designed to be
 * called multiple times: once at load time, so that we can bind our print()
 * function to the panel's output control ASAP, and again when the Computer component
 * is verifying that all components are ready and invoking their powerUp() functions.
 *
 * Our powerUp() method gives us a second opportunity to notify any components that
 * that might care (eg, CPU, Keyboard, and Debugger) that we have some controls they
 * might want to use.
 */
PanelPDP11.init = function()
{
    var fReady = false;
    var aePanels = Component.getElementsByClass(document, PDP11.APPCLASS, "panel");
    for (var iPanel=0; iPanel < aePanels.length; iPanel++) {
        var ePanel = aePanels[iPanel];
        var parmsPanel = Component.getComponentParms(ePanel);
        var panel = Component.getComponentByID(parmsPanel['id']);
        if (!panel) {
            fReady = true;
            panel = new PanelPDP11(parmsPanel);
        }
        Component.bindComponentControls(panel, ePanel, PDP11.APPCLASS);
        if (fReady) panel.setReady();
    }
};

/*
 * Initialize every Panel module on the page.
 */
web.onInit(PanelPDP11.init);

if (NODE) module.exports = PanelPDP11;
