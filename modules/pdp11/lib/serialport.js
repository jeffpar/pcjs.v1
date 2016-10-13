/**
 * @fileoverview Implements the PDP11 SerialPort component.
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
    var web           = require("../../shared/lib/weblib");
    var Component     = require("../../shared/lib/component");
    var State         = require("../../shared/lib/state");
    var PDP11         = require("./defines");
    var MessagesPDP11 = require("./messages");
}

/**
 * SerialPortPDP11(parmsSerial)
 *
 * The SerialPort component has the following component-specific (parmsSerial) properties:
 *
 *      adapter: adapter number; 0 if not defined
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
function SerialPortPDP11(parmsSerial) {

    this.iAdapter = parmsSerial['adapter'];

    /**
     * consoleOutput becomes a string that records serial port output if the 'binding' property is set to the
     * reserved name "console".  Nothing is written to the console, however, until a linefeed (0x0A) is output
     * or the string length reaches a threshold (currently, 1024 characters).
     *
     * @type {string|null}
     */
    this.consoleOutput = null;

    /**
     * controlIOBuffer is a DOM element bound to the port (currently used for output only; see transmitByte()).
     *
     * Example: CTTY COM2
     *
     * The CTTY DOS command redirects all CON I/O to the specified serial port (eg, COM2), which it assumes is
     * connected to a serial terminal, and therefore anything it *transmits* via COM2 will be displayed by the
     * terminal.  It further assumes that anything typed on such a terminal is NOT displayed, so as DOS *receives*
     * serial input, DOS *transmits* the appropriate characters back to the terminal via COM2.
     *
     * As a result, controlIOBuffer only needs to be updated by the transmitByte() function.
     *
     * @type {Object}
     */
    this.controlIOBuffer = null;

    /*
     * If controlIOBuffer is being used AND 'tabSize' is set, then we make an attempt to monitor the characters
     * being echoed via transmitByte(), maintain a logical column position, and convert any tabs into the appropriate
     * number of spaces.
     *
     * charBOL, if nonzero, is a character to automatically output at the beginning of every line.  This probably
     * isn't generally useful; I use it internally to preformat serial output.
     */
    this.tabSize = parmsSerial['tabSize'];
    this.charBOL = parmsSerial['charBOL'];
    this.iLogicalCol = 0;

    Component.call(this, "SerialPort", parmsSerial, SerialPortPDP11, MessagesPDP11.SERIAL);

    var sBinding = parmsSerial['binding'];
    if (sBinding == "console") {
        this.consoleOutput = "";
    } else {
        /*
         * NOTE: If sBinding is not the name of a valid Control Panel DOM element, this call does nothing.
         */
        Component.bindExternalControl(this, sBinding, SerialPortPDP11.sIOBuffer);
    }

    /*
     * No connection until initConnection() is called.
     */
    this.sDataReceived = "";
    this.connection = this.sendData = null;

    /*
     * Export all functions required by initConnection(); currently, this is the bare minimum (no flow control yet).
     */
    this['exports'] = {
        'connect': this.initConnection,
        'receiveData': this.receiveData
    };
}

/*
 * class SerialPortPDP11
 * property {number} iAdapter
 * property {number} portBase
 * property {number} nIRQ
 * property {Object} controlIOBuffer is a DOM element bound to the port (for rudimentary output; see transmitByte())
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

Component.subclass(SerialPortPDP11);

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
SerialPortPDP11.sIOBuffer = "buffer";

/**
 * setBinding(sType, sBinding, control, sValue)
 *
 * @this {SerialPortPDP11}
 * @param {string|null} sType is the type of the HTML control (eg, "button", "textarea", "register", "flag", "rled", etc)
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "buffer")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
SerialPortPDP11.prototype.setBinding = function(sType, sBinding, control, sValue)
{
    var serial = this;

    switch (sBinding) {
    case SerialPortPDP11.sIOBuffer:
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
                serial.receiveData(keyCode);
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
            serial.receiveData(keyCode);
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
 * @this {SerialPortPDP11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
SerialPortPDP11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;

    var serial = this;

    this.triggerReceiveInterrupt = this.cpu.addTrigger(PDP11.DL11.RVEC, PDP11.DL11.PRI);

    this.timerReceiveInterrupt = this.cpu.addTimer(function readyReceiver() {
        if (!(serial.rcsr & PDP11.DL11.RCSR.RD)) {
            if (serial.abReceive.length) {
                serial.rbuf = serial.abReceive.shift();
                serial.rcsr |= PDP11.DL11.RCSR.RD;
                if (serial.rcsr & PDP11.DL11.RCSR.RIE) {
                    serial.cpu.setTrigger(serial.triggerReceiveInterrupt);
                }
            }
        }
    });

    this.triggerTransmitInterrupt = this.cpu.addTrigger(PDP11.DL11.XVEC, PDP11.DL11.PRI);

    this.timerTransmitInterrupt = this.cpu.addTimer(function readyTransmitter() {
        serial.xcsr |= PDP11.DL11.XCSR.READY;
        if (serial.xcsr & PDP11.DL11.XCSR.TIE) {
            serial.cpu.setTrigger(serial.triggerTransmitInterrupt);
        }
    });

    bus.addIOTable(this, SerialPortPDP11.UNIBUS_IOTABLE);
    this.setReady();
};

/**
 * initConnection()
 *
 * If a machine 'connection' parameter exists of the form "{sourcePort}->{targetMachine}.{targetPort}",
 * and "{sourcePort}" matches our idComponent, then look for a component with id "{targetMachine}.{targetPort}".
 *
 * If the target component is found, then verify that it has exported functions with the following names:
 *
 *      receiveData(data): called when we have data to transmit; aliased internally to sendData(data)
 *
 * For now, we're not going to worry about communication in the other direction, because when the target component
 * performs its own initConnection(), it will find our receiveData() function, at which point communication in both
 * directions should be established.
 *
 * For added robustness, if the target machine initializes much more slowly than we do, and our connection attempt
 * fails, that's OK, because when it finally initializes, its initConnection() will call our initConnection();
 * if we've already initialized, no harm done.
 *
 * @this {SerialPortPDP11}
 */
SerialPortPDP11.prototype.initConnection = function()
{
    if (!this.connection) {
        var sConnection = this.cmp.getMachineParm("connection");
        if (sConnection) {
            var asParts = sConnection.split('->');
            if (asParts.length == 2) {
                var sSourceID = str.trim(asParts[0]);
                if (sSourceID != this.idComponent) return;  // this connection string is intended for another instance
                var sTargetID = str.trim(asParts[1]);
                this.connection = Component.getComponentByID(sTargetID);
                if (this.connection) {
                    var exports = this.connection['exports'];
                    if (exports) {
                        var fnConnect = exports['connect'];
                        if (fnConnect) fnConnect.call(this.connection);
                        this.sendData = exports['receiveData'];
                        if (this.sendData) {
                            this.status(this.idMachine + '.' + sSourceID + " connected to " + sTargetID);
                            return;
                        }
                    }
                }
            }
            /*
             * Changed from notice() to status() because sometimes a connection fails simply because one of us is a laggard.
             */
            this.status("Unable to establish connection: " + sConnection);
        }
    }
};

/**
 * powerUp(data, fRepower)
 *
 * @this {SerialPortPDP11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
SerialPortPDP11.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {

        /*
         * This is as late as we can currently wait to make our first inter-machine connection attempt;
         * even so, the target machine's initialization process may still be ongoing, so any connection
         * may be not fully resolved until the target machine performs its own initConnection(), which will
         * in turn invoke our initConnection() again.
         */
        this.initConnection();

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
 * @this {SerialPortPDP11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
SerialPortPDP11.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * reset()
 *
 * @this {SerialPortPDP11}
 */
SerialPortPDP11.prototype.reset = function()
{
    this.initState();
};

/**
 * save()
 *
 * This implements save support for the SerialPort component.
 *
 * @this {SerialPortPDP11}
 * @return {Object}
 */
SerialPortPDP11.prototype.save = function()
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
 * @this {SerialPortPDP11}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
SerialPortPDP11.prototype.restore = function(data)
{
    return this.initState(data[0]);
};

/**
 * initState(data)
 *
 * @this {SerialPortPDP11}
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
SerialPortPDP11.prototype.initState = function(data)
{
    this.rbuf = 0;
    this.rcsr = 0;
    this.xcsr = PDP11.DL11.XCSR.READY;
    this.abReceive = [];
    return true;
};

/**
 * saveRegisters()
 *
 * @this {SerialPortPDP11}
 * @return {Array}
 */
SerialPortPDP11.prototype.saveRegisters = function()
{
    return [];
};

/**
 * receiveData(data)
 *
 * This replaces the old sendRBR() function, which expected an Array of bytes.  We still support that,
 * but in order to support connections with other SerialPort components (ie, the PC8080 SerialPort), we
 * have added support for numbers and strings as well.
 *
 * @this {SerialPortPDP11}
 * @param {number|string|Array} data
 * @return {boolean} true if received, false if not
 */
SerialPortPDP11.prototype.receiveData = function(data)
{
    if (typeof data == "number") {
        this.abReceive.push(data);
    }
    else if (typeof data == "string") {
        for (var i = 0; i < data.length; i++) {
            this.abReceive.push(data.charCodeAt(i));
        }
    }
    else {
        this.abReceive = this.abReceive.concat(data);
    }
    this.cpu.setTimer(this.timerReceiveInterrupt, PDP11.DL11.RBUF.DELAY);
    return true;                // for now, return true regardless, since we're buffering everything anyway
};

SerialPortPDP11.prototype.advanceRBUF = function()
{
};

/**
 * transmitByte(b)
 *
 * @this {SerialPortPDP11}
 * @param {number} b
 * @return {boolean} true if transmitted, false if not
 */
SerialPortPDP11.prototype.transmitByte = function(b)
{
    var fTransmitted = false;

    this.printMessage("transmitByte(" + str.toHexByte(b) + ")");

    if (this.sendData) {
        if (this.sendData.call(this.connection, b)) {
            fTransmitted = true;
        }
    }

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
            var s = str.toASCIICode(b); // formerly: String.fromCharCode(b);
            var nChars = s.length;      // formerly: (b >= 0x20? 1 : 0);
            if (b < 0x20 && nChars == 1) nChars = 0;
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
        fTransmitted = true;
    }
    else if (this.consoleOutput != null) {
        if (b == 0x0A || this.consoleOutput.length >= 1024) {
            this.println(this.consoleOutput);
            this.consoleOutput = "";
        }
        if (b != 0x0A) {
            this.consoleOutput += String.fromCharCode(b);
        }
        fTransmitted = true;
    }

    return fTransmitted;
};

/**
 * readRCSR(addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.RCSR or 177560)
 * @return {number}
 */
SerialPortPDP11.prototype.readRCSR = function(addr)
{
    return this.rcsr & PDP11.DL11.RCSR.RMASK;
};

/**
 * writeRCSR(data, addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.RCSR or 177560)
 */
SerialPortPDP11.prototype.writeRCSR = function(data, addr)
{
    this.rcsr = (this.rcsr & ~PDP11.DL11.RCSR.WMASK) | (data & PDP11.DL11.RCSR.WMASK);
};

/**
 * readRBUF(addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.RBUF or 177562)
 * @return {number}
 */
SerialPortPDP11.prototype.readRBUF = function(addr)
{
    this.rcsr &= ~PDP11.DL11.RCSR.RD;
    if (this.abReceive.length > 0) {
        this.cpu.setTimer(this.timerReceiveInterrupt, PDP11.DL11.RBUF.DELAY);
    }
    return this.rbuf;
};

/**
 * writeRBUF(data, addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.RBUF or 177562)
 */
SerialPortPDP11.prototype.writeRBUF = function(data, addr)
{
};

/**
 * readXCSR(addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.XCSR or 177564)
 * @return {number}
 */
SerialPortPDP11.prototype.readXCSR = function(addr)
{
    return this.xcsr;
};

/**
 * writeXCSR(data, addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.XCSR or 177564)
 */
SerialPortPDP11.prototype.writeXCSR = function(data, addr)
{
    /*
     * If the device is READY, and IE is transitioning on, then request an interrupt.
     */
    if ((this.xcsr & (PDP11.DL11.XCSR.READY | PDP11.DL11.XCSR.TIE)) == PDP11.DL11.XCSR.READY && (data & PDP11.DL11.XCSR.TIE)) {
        this.cpu.setTimer(this.timerTransmitInterrupt, PDP11.DL11.XCSR.DELAY);
    }
    this.xcsr = (this.xcsr & ~PDP11.DL11.XCSR.WMASK) | (data & PDP11.DL11.XCSR.WMASK);
};

/**
 * readXBUF(addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.XBUF or 177566)
 * @return {number}
 */
SerialPortPDP11.prototype.readXBUF = function(addr)
{
    return 0;
};

/**
 * writeXBUF(data, addr)
 *
 * @this {SerialPortPDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.XBUF or 177566)
 */
SerialPortPDP11.prototype.writeXBUF = function(data, addr)
{
    data &= PDP11.DL11.XBUF.DATA;
    if (data) {
        this.transmitByte(data);
        this.xcsr &= ~PDP11.DL11.XCSR.READY;
        this.cpu.setTimer(this.timerTransmitInterrupt, PDP11.DL11.XBUF.DELAY);
    }
};

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
SerialPortPDP11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.RCSR]:    /* 177560 */    [null, null, SerialPortPDP11.prototype.readRCSR,    SerialPortPDP11.prototype.writeRCSR,    "RCSR"],
    [PDP11.UNIBUS.RBUF]:    /* 177562 */    [null, null, SerialPortPDP11.prototype.readRBUF,    SerialPortPDP11.prototype.writeRBUF,    "RBUF"],
    [PDP11.UNIBUS.XCSR]:    /* 177564 */    [null, null, SerialPortPDP11.prototype.readXCSR,    SerialPortPDP11.prototype.writeXCSR,    "XCSR"],
    [PDP11.UNIBUS.XBUF]:    /* 177566 */    [null, null, SerialPortPDP11.prototype.readXBUF,    SerialPortPDP11.prototype.writeXBUF,    "XBUF"]
};

/**
 * SerialPortPDP11.init()
 *
 * This function operates on every HTML element of class "serial", extracting the
 * JSON-encoded parameters for the SerialPort constructor from the element's "data-value"
 * attribute, invoking the constructor to create a SerialPort component, and then binding
 * any associated HTML controls to the new component.
 */
SerialPortPDP11.init = function()
{
    var aeSerial = Component.getElementsByClass(document, PDP11.APPCLASS, "serial");
    for (var iSerial = 0; iSerial < aeSerial.length; iSerial++) {
        var eSerial = aeSerial[iSerial];
        var parmsSerial = Component.getComponentParms(eSerial);
        var serial = new SerialPortPDP11(parmsSerial);
        Component.bindComponentControls(serial, eSerial, PDP11.APPCLASS);
    }
};

/*
 * Initialize every SerialPort module on the page.
 */
web.onInit(SerialPortPDP11.init);

if (NODE) module.exports = SerialPortPDP11;
