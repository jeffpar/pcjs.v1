/**
 * @fileoverview Implements the PC8080 SerialPort component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Aug-08
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var ChipSet     = require("./chipset");
    var State       = require("./state");
}

/**
 * SerialPort(parmsSerial)
 *
 * The SerialPort component has the following component-specific (parmsSerial) properties:
 *
 *      adapter: 0 if not defined
 *
 *      binding: name of a control (based on its "binding" attribute) to bind to this port's I/O
 *
 *      tabSize: set to a non-zero number to convert tabs to spaces (applies only to output to
 *      the above binding); default is 0 (no conversion)
 *
 * In the future, we may support 'port' and 'irq' properties that allow the machine to define a
 * non-standard serial port configuration, instead of only our pre-defined 'adapter' configurations.
 *
 * NOTE: Since the XSL file defines 'adapter' as a number, not a string, there's no need to use
 * parseInt(), and as an added benefit, we don't need to worry about whether a hex or decimal format
 * was used.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsSerial
 */
function SerialPort(parmsSerial) {

    this.iAdapter = +parmsSerial['adapter'];

    switch (this.iAdapter) {
    case 0:
        this.portBase = 0;
        this.nIRQ = 2;
        break;
    default:
        Component.warning("Unrecognized serial adapter #" + this.iAdapter);
        return;
    }
    /**
     * consoleOutput becomes a string that records serial port output if the 'binding' property is set to the
     * reserved name "console".  Nothing is written to the console, however, until a linefeed (0x0A) is output
     * or the string length reaches a threshold (currently, 1024 characters).
     *
     * @type {string|null}
     */
    this.consoleOutput = null;

    /**
     * controlIOBuffer is a DOM element, if any, bound to the port (currently used for output only; see echoByte()).
     *
     * @type {Object}
     */
    this.controlIOBuffer = null;

    /*
     * If controlIOBuffer is being used AND 'tabSize' is set, then we make an attempt to monitor the characters
     * being echoed via echoByte(), maintain a logical column position, and convert any tabs into the appropriate
     * number of spaces.
     *
     * charBOL, if nonzero, is a character to automatically output at the beginning of every line.  This probably
     * isn't generally useful; I use it internally to preformat serial output.
     */
    this.tabSize = parmsSerial['tabSize'];
    this.charBOL = parmsSerial['charBOL'];
    this.iLogicalCol = 0;

    Component.call(this, "SerialPort", parmsSerial, SerialPort, Messages.SERIAL);

    var sBinding = parmsSerial['binding'];
    if (sBinding == "console") {
        this.consoleOutput = "";
    } else {
        /*
         * NOTE: If sBinding is not the name of a valid Control Panel DOM element, this call does nothing.
         */
        Component.bindExternalControl(this, sBinding, SerialPort.sIOBuffer);
    }
}

/*
 * class SerialPort
 * property {number} iAdapter
 * property {number} portBase
 * property {number} nIRQ
 * property {Object} controlIOBuffer is a DOM element, if any, bound to the port (for rudimentary output; see echoByte())
 *
 * NOTE: This class declaration started as a way of informing the code inspector of the controlIOBuffer property,
 * which remained undefined until a setBinding() call set it later, but I've since decided that explicitly
 * initializing such properties in the constructor is a better way to go -- even though it's more code -- because
 * JavaScript compilers are supposed to be happier when the underlying object structures aren't constantly changing.
 *
 * Besides, I'm not sure I want to get into documenting every property this way, for this or any/every other class,
 * let alone getting into which ones should be considered private or protected, because PCjs isn't really a library
 * for third-party apps.
 */

Component.subclass(SerialPort);

/*
 * Internal name used for the I/O buffer control, if any, that we bind to the SerialPort.
 *
 * Alternatively, if SerialPort wants to use another component's control (eg, the Panel's
 * "print" control), it can specify the name of that control with the 'binding' property.
 *
 * For that binding to succeed, we also need to know the target component; for now, that's
 * been hard-coded to "Panel", in part because that's one of the few components we can rely
 * upon initializing before we do, but it would be a simple matter to include a component type
 * or ID as part of the 'binding' property as well, if we need more flexibility later.
 */
SerialPort.sIOBuffer = "buffer";

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {SerialPort}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "buffer")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
SerialPort.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var serial = this;

    switch (sBinding) {
    case SerialPort.sIOBuffer:
        this.bindings[sBinding] = this.controlIOBuffer = control;

        /*
         * By establishing an onkeypress handler here, we make it possible for DOS commands like
         * "CTTY COM1" to more or less work (use "CTTY CON" to restore control to the DOS console).
         */
        control.onkeydown = function onKeyDown(event) {
            /*
             * This is required in addition to onkeypress, because it's the only way to prevent
             * BACKSPACE (keyCode 8) from being interpreted by the browser as a "Back" operation;
             * moreover, not all browsers generate an onkeypress notification for BACKSPACE.
             *
             * A related problem exists for Ctrl-key combinations in most Windows-based browsers
             * (eg, IE, Edge, Chrome for Windows, etc), because keys like Ctrl-C and Ctrl-S have
             * special meanings (eg, Copy, Save).  To the extent the browser will allow it, we
             * attempt to disable that default behavior when this control receives an onkeydown
             * event for one of those keys (probably the only event the browser generates for them).
             */
            event = event || window.event;
            var keyCode = event.keyCode;
            if (keyCode === 0x08 || event.ctrlKey && keyCode >= 0x41 && keyCode <= 0x5A) {
                if (event.preventDefault) event.preventDefault();
                if (keyCode > 0x40) keyCode -= 0x40;
                // serial.sendRBR([keyCode]);
            }
            return true;
        };

        control.onkeypress = function onKeyPress(event) {
            /*
             * Browser-independent keyCode extraction; refer to onKeyPress() and the other key event
             * handlers in keyboard.js.
             */
            event = event || window.event;
            var keyCode = event.which || event.keyCode;
            // serial.sendRBR([keyCode]);
            /*
             * Since we're going to remove the "readonly" attribute from the <textarea> control
             * (so that the soft keyboard activates on iOS), instead of calling preventDefault() for
             * selected keys (eg, the SPACE key, whose default behavior is to scroll the page), we must
             * now call it for *all* keys, so that the keyCode isn't added to the control immediately,
             * on top of whatever the machine is echoing back, resulting in double characters.
             */
            if (event.preventDefault) event.preventDefault();
            return true;
        };

        /*
         * Now that we've added an onkeypress handler that calls preventDefault() for ALL keys, the control
         * itself no longer needs the "readonly" attribute; we primarily need to remove it for iOS browsers,
         * so that the soft keyboard will activate, but it shouldn't hurt to remove the attribute for all browsers.
         */
        control.removeAttribute("readonly");

        return true;

    default:
        break;
    }
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {SerialPort}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
SerialPort.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.chipset = cmp.getMachineComponent("ChipSet");
    bus.addPortInputTable(this, SerialPort.aPortInput, this.portBase);
    bus.addPortOutputTable(this, SerialPort.aPortOutput, this.portBase);
    this.setReady();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {SerialPort}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
SerialPort.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {SerialPort}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
SerialPort.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * reset()
 *
 * @this {SerialPort}
 */
SerialPort.prototype.reset = function()
{
    this.initState();
};

/**
 * save()
 *
 * This implements save support for the SerialPort component.
 *
 * @this {SerialPort}
 * @return {Object}
 */
SerialPort.prototype.save = function()
{
    var state = new State(this);
    state.set(0, this.saveRegisters());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the SerialPort component.
 *
 * @this {SerialPort}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
SerialPort.prototype.restore = function(data)
{
    return this.initState(data[0]);
};

/**
 * initState(data)
 *
 * @this {SerialPort}
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
SerialPort.prototype.initState = function(data)
{
    var i = 0;
    if (data === undefined) {
        data = [0, 0, 0];
    }
    this.bData = data[i++];
    this.bCommand = data[i++];
    this.bBaudRate = data[i++];
    return true;
};

/**
 * saveRegisters()
 *
 * @this {SerialPort}
 * @return {Array}
 */
SerialPort.prototype.saveRegisters = function()
{
    var i = 0;
    var data = [];
    data[i++] = this.bData;
    data[i++] = this.bCommand;
    data[i++] = this.bBaudRate;
    return data;
};

/**
 * inData(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x0)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inData = function(port, addrFrom)
{
    var b = this.bData;
    this.printMessageIO(port, null, addrFrom, "DATA", b);
    return b;
};

/**
 * inCommand(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x1)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inCommand = function(port, addrFrom)
{
    var b = this.bCommand;
    this.printMessageIO(port, null, addrFrom, "COMMAND", b);
    return b;
};

/**
 * outData(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x0)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outData = function(port, bOut, addrFrom)
{
    this.printMessageIO(port, bOut, addrFrom, "DATA");
    this.bData = bOut;
};

/**
 * outCommand(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x1)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outCommand = function(port, bOut, addrFrom)
{
    this.printMessageIO(port, bOut, addrFrom, "COMMAND");
    this.bCommand = bOut;
};

/**
 * outBaudRate(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x2)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outBaudRate = function(port, bOut, addrFrom)
{
    this.printMessageIO(port, bOut, addrFrom, "BAUDRATE");
    this.bBaudRate = bOut;
};

/**
 * echoByte(b)
 *
 * @this {SerialPort}
 * @param {number} b
 * @return {boolean} true if echoed, false if not
 */
SerialPort.prototype.echoByte = function(b)
{
    if (this.controlIOBuffer) {
        if (b == 0x0D) {
            this.iLogicalCol = 0;
        }
        else if (b == 0x08) {
            this.controlIOBuffer.value = this.controlIOBuffer.value.slice(0, -1);
            /*
             * TODO: Back up the correct number of columns if the character erased was a tab.
             */
            if (this.iLogicalCol > 0) this.iLogicalCol--;
        }
        else {
            var s = String.fromCharCode(b);
            var nChars = (b >= 0x20? 1 : 0);
            if (b == 0x09) {
                var tabSize = this.tabSize || 8;
                nChars = tabSize - (this.iLogicalCol % tabSize);
                if (this.tabSize) s = str.pad("", nChars);
            }
            if (this.charBOL && !this.iLogicalCol && nChars) s = String.fromCharCode(this.charBOL) + s;
            this.controlIOBuffer.value += s;
            this.controlIOBuffer.scrollTop = this.controlIOBuffer.scrollHeight;
            this.iLogicalCol += nChars;
        }
        return true;
    }
    if (this.consoleOutput != null) {
        if (b == 0x0A || this.consoleOutput.length >= 1024) {
            this.println(this.consoleOutput);
            this.consoleOutput = "";
        }
        if (b != 0x0A) {
            this.consoleOutput += String.fromCharCode(b);
        }
        return true;
    }
    return false;
};

/*
 * Port input notification table
 */
SerialPort.aPortInput = {
    0x0: SerialPort.prototype.inData,
    0x1: SerialPort.prototype.inCommand

};

/*
 * Port output notification table
 */
SerialPort.aPortOutput = {
    0x0: SerialPort.prototype.outData,
    0x1: SerialPort.prototype.outCommand,
    0x2: SerialPort.prototype.outBaudRate
};

/**
 * SerialPort.init()
 *
 * This function operates on every HTML element of class "serial", extracting the
 * JSON-encoded parameters for the SerialPort constructor from the element's "data-value"
 * attribute, invoking the constructor to create a SerialPort component, and then binding
 * any associated HTML controls to the new component.
 */
SerialPort.init = function()
{
    var aeSerial = Component.getElementsByClass(document, PC8080.APPCLASS, "serial");
    for (var iSerial = 0; iSerial < aeSerial.length; iSerial++) {
        var eSerial = aeSerial[iSerial];
        var parmsSerial = Component.getComponentParms(eSerial);
        var serial = new SerialPort(parmsSerial);
        Component.bindComponentControls(serial, eSerial, PC8080.APPCLASS);
    }
};

/*
 * Initialize every SerialPort module on the page.
 */
web.onInit(SerialPort.init);

if (NODE) module.exports = SerialPort;
