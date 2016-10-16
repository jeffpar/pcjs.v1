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
     */
    this.cLiveRegs = 0;
    /*
     * TODO: Add some UI for displayLiveRegs (either an XML property, or a UI checkbox, or both)
     */
    this.flags.displayLiveRegs = true;

}

Component.subclass(PanelPDP11);

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
    case "R0":
    case "R1":
    case "R2":
    case "R3":
    case "R4":
    case "R5":
    case "R6":
    case "R7":
    case "NF":
    case "ZF":
    case "VF":
    case "CF":
    case "PS":
        this.bindings[sBinding] = control;
        this.cLiveRegs++;
        return true;
    default:
        if (sType == "rled") {
            this.bindings[sBinding] = control;
            this.cLiveRegs++;
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
    if (!fRepower) PanelPDP11.init();
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
        if (!this.cpu.isRunning() || this.flags.displayLiveRegs) {
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
 * setLED(control, f)
 *
 * @this {PanelPDP11}
 * @param {Object} control is an HTML control DOM object
 * @param {boolean|number} f is true if the LED represented by control should be "on", false if "off"
 */
PanelPDP11.prototype.setLED = function(control, f)
{
    /*
     * TODO: Add support for user-definable LED colors
     */
    control.style.backgroundColor = (f? "#ff0000" : "#000000");
};

/**
 * updateLEDs(sPrefix, data, nLEDs)
 *
 * @this {PanelPDP11}
 * @param {string} sPrefix
 * @param {number} data
 * @param {number} nLEDs
 */
PanelPDP11.prototype.updateLEDs = function(sPrefix, data, nLEDs)
{
    for (var i = 0; i < nLEDs; i++) {
        var id = sPrefix + i;
        var control = this.bindings[id];
        if (control) {
            this.setLED(control, data & (1 << i));
        }
    }
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
        if (fForce || !this.cpu.isRunning() || this.flags.displayLiveRegs) {
            for (var i = 0; i < this.cpu.regsGen.length; i++) {
                this.updateValue('R'+i, this.cpu.regsGen[i]);
            }
            var regPSW = this.cpu.getPSW();
            this.updateValue("PS", regPSW);
            this.updateValue("NF", (regPSW & PDP11.PSW.NF)? 1 : 0, 1);
            this.updateValue("ZF", (regPSW & PDP11.PSW.ZF)? 1 : 0, 1);
            this.updateValue("VF", (regPSW & PDP11.PSW.VF)? 1 : 0, 1);
            this.updateValue("CF", (regPSW & PDP11.PSW.CF)? 1 : 0, 1);
            this.updateLEDs("D", this.cpu.regsGen[0], 16);
            this.updateLEDs("A", this.cpu.regsGen[7], 22);
        }
    }
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
