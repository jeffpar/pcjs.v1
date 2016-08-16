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
     * controlIOBuffer is a DOM element bound to the port (currently used for output only; see transmitByte()).
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

    /*
     * Define a setTimeout() function that receiveData() can use when there's more data to receive.
     */
    this.fnCheckDataReceived = function(serial) {
        return function() {
            serial.receiveData();
        }
    }(this);

    /*
     * No connection until initBus() invokes initConnection().
     */
    this.connection = this.sendByte = null;

    /*
     * Export all functions required by initConnection(); currently, this is the bare minimum, with no flow control.
     */
    this['exports'] = {
        'receiveByte': this.receiveByte
    };
}

/*
 * class SerialPort
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

Component.subclass(SerialPort);

SerialPort.UART8251 = {
    /*
     * Format of MODE byte written to CONTROL port 0x1
     */
    MODE: {
        BAUD_FACTOR:    0x03,       // 00=SYNC, 01=1x, 10=16x, 11=64x
        DATA_BITS:      0x0C,       // 00=5, 01=6, 10=7, 11=8
        PARITY_ENABLE:  0x10,
        EVEN_PARITY:    0x20,
        STOP_BITS:      0xC0,       // 00=invalid, 01=1, 10=1.5, 11=2
        INIT:           0x8E        // 16x baud rate, 8 data bits, no parity, 1.5 stop bits
    },
    /*
     * Format of COMMAND byte written to CONTROL port 0x1
     */
    COMMAND: {
        XMIT_ENABLE:    0x01,
        DTR:            0x02,       // Data Terminal Ready
        RECV_ENABLE:    0x04,
        SEND_BREAK:     0x08,
        ERROR_RESET:    0x10,
        RTS:            0x20,       // Request To Send
        INTERNAL_RESET: 0x40,
        HUNT_MODE:      0x80,
        INIT:           0x27        // XMIT_ENABLE | DTR | RECV_ENABLE | RTS
    },
    /*
     * Format of STATUS byte read from CONTROL port 0x1
     */
    STATUS: {
        XMIT_READY:     0x01,
        RECV_FULL:      0x02,
        XMIT_EMPTY:     0x04,
        PARITY_ERROR:   0x08,
        OVERRUN_ERROR:  0x10,
        FRAMING_ERROR:  0x20,
        BREAK_DETECT:   0x40,
        DSR:            0x80,       // Data Set Ready
        INIT:           0x85        // XMIT_READY | XMIT_EMPTY | DSR
    },
    /*
     * Format of BAUDRATES byte written to port 0x2
     *
     * Each nibble is an index (0x0-0xF) into a set of internal CPU clock divisors that yield the
     * following baud rates:
     *
     *      Index   Divisor     Baud Rate
     *      -----   -------     ---------
     *      0x0      3456       50
     *      0x1      2304       75
     *      0x2      1571       110
     *      0x3      1285       134.5
     *      0x4      1152       150
     *      0x5      864        200
     *      0x6      576        300
     *      0x7      288        600
     *      0x8      144        1200
     *      0x9      96         1800
     *      0xA      86         2000
     *      0xB      72         2400
     *      0xC      48         3600
     *      0xD      36         4800
     *      0xE      18         9600    (default)
     *      0xF      9          19200
     */
    BAUDRATES: {
        RECV_RATE:      0x0F,
        XMIT_RATE:      0xF0,
        INIT:           0xEE        // default to 9600 (0xE) for both XMIT and RECV
    },
    BAUDTABLE: [
        50, 75, 110, 134.5, 150, 200, 300, 600, 1200, 1800, 2000, 2400, 3600, 4800, 9600, 19200
    ]
};

SerialPort.UART8251.INIT = [
    false,
    0,
    0,
    SerialPort.UART8251.STATUS.INIT,
    SerialPort.UART8251.MODE.INIT,
    SerialPort.UART8251.COMMAND.INIT,
    SerialPort.UART8251.BAUDRATES.INIT
];

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
                serial.receiveByte(keyCode);
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
            serial.receiveByte(keyCode);
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
        if (sValue) {
            /*
             * Instead of just having a dedicated "test" control, we now treat any unrecognized control with
             * a "value" attribute as a test control.  The only caveat is that such controls must have binding IDs
             * that do not conflict with predefined controls (which, of course, is the only way you can get here).
             */
            this.bindings[sBinding] = control;
            /*
             * Convert any "backslashed" sequences into the appropriate control characters.
             */
            sValue = sValue.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
            control.onclick = function onClickTest(event) {
                serial.sDataReceived = sValue;
                serial.receiveData();
                /*
                 * Give focus back to the machine (since clicking the button takes focus away).
                 */
                 if (serial.cmp) serial.cmp.updateFocus();
                return true;
            };
            return true;
        }
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
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.chipset = /** @type {ChipSet} */ (cmp.getMachineComponent("ChipSet"));
    bus.addPortInputTable(this, SerialPort.aPortInput, this.portBase);
    bus.addPortOutputTable(this, SerialPort.aPortOutput, this.portBase);
    this.initConnection();
    this.setReady();
};

/**
 * initConnection()
 *
 * If a machine 'connection' parameter exists of the form "<sourcePort>=<targetMachine>.<targetPort>",
 * and "<sourcePort>" matches our idComponent, then look for a component with id "<targetMachine>.<targetPort>".
 *
 * If the target component is found, then verify that it has exported functions with the following names:
 *
 *      receiveByte(b): called by us when we have a byte to transmit; aliased internally to sendByte(b)
 *
 * For now, we're not going to worry about communication in the other direction, because when the target component
 * performs its own initConnection(), it will find our receiveByte(b) function, at which point communication in both
 * directions should be established.
 *
 * @this {SerialPort}
 */
SerialPort.prototype.initConnection = function()
{
    var sConnection = this.cmp.getMachineParm("connection");
    if (sConnection) {
        var asParts = sConnection.split('=');
        if (asParts.length == 2) {
            var sSourceID = str.trim(asParts[0]);
            var sTargetID = str.trim(asParts[1]);
            if (sSourceID == this.idComponent) {
                this.connection = Component.getComponentByID(sTargetID);
                if (this.connection) {
                    var exports = this.connection['exports'];
                    if (exports) {
                        this.sendByte = exports['receiveByte'];
                    }
                }
            }
        }
    }
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
        data = SerialPort.UART8251.INIT;
    }
    this.fReady     = data[i++];
    this.bDataIn    = data[i++];
    this.bDataOut   = data[i++];
    this.bStatus    = data[i++];
    this.bMode      = data[i++];
    this.bCommand   = data[i++];
    this.bBaudRates = data[i];
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
    data[i++] = this.fReady;
    data[i++] = this.bDataIn;
    data[i++] = this.bDataOut;
    data[i++] = this.bStatus;
    data[i++] = this.bMode;
    data[i++] = this.bCommand;
    data[i]   = this.bBaudRates;
    return data;
};

/**
 * getBaudTimeout(maskRate)
 *
 * @this {SerialPort}
 * @param {number} maskRate (either SerialPort.UART8251.BAUDRATES.RECV_RATE or SerialPort.UART8251.BAUDRATES.XMIT_RATE)
 * @return {number} (number of milliseconds per byte)
 */
SerialPort.prototype.getBaudTimeout = function(maskRate)
{
    var indexRate = (this.bBaudRates & maskRate);
    if (!(maskRate & 0xf)) indexRate >>= 4;
    var nBaud = SerialPort.UART8251.BAUDTABLE[indexRate];
    var nBits = ((this.bMode & SerialPort.UART8251.MODE.DATA_BITS) >> 2) + 6;   // includes an extra +1 for start bit
    if (this.bMode & SerialPort.UART8251.MODE.PARITY_ENABLE) nBits++;
    nBits += ((((this.bMode & SerialPort.UART8251.MODE.STOP_BITS) >> 6) + 1) >> 1);
    var nBytesPerSecond = Math.round(nBaud / nBits);
    return 1000 / nBytesPerSecond;
};

/**
 * receiveByte(b)
 *
 * @this {SerialPort}
 * @param {number} b
 * @return {boolean}
 */
SerialPort.prototype.receiveByte = function(b)
{
    if (!(this.bStatus & SerialPort.UART8251.STATUS.RECV_FULL)) {
        this.bDataIn = b;
        this.bStatus |= SerialPort.UART8251.STATUS.RECV_FULL;
        this.cpu.requestINTR(this.nIRQ);
        return true;
    }
    return false;
};

/**
 * receiveData()
 *
 * @this {SerialPort}
 */
SerialPort.prototype.receiveData = function()
{
    if (this.sDataReceived) {
        if (this.receiveByte(this.sDataReceived.charCodeAt(0))) {
            this.sDataReceived = this.sDataReceived.substr(1);
        }
        /*
         * TODO: If data has become undeliverable for some reason (eg, the Debugger has paused execution),
         * we should stop setting timeouts, and add one or more notification mechanisms to kickstart it again.
         */
        if (this.sDataReceived) {
            /*
             * TODO: setTimeout() is a less-than-ideal solution, because it's too slow; timeouts won't fire until
             * the end of a CPU burst.  So instead of calculating a number of milliseconds, we should calculate a
             * number of CPU cycles, and create a CPU notification mechanism that calls us back after that many cycles
             * have elapsed (and which will automatically shorten the current CPU burst as needed).
             *
             * This will also solve the other issue noted above, because if the CPU has been halted, it won't be
             * generating any notifications either.
             */
            setTimeout(this.fnCheckDataReceived, this.getBaudTimeout(SerialPort.UART8251.BAUDRATES.RECV_RATE));
        }
    }
};

/**
 * transmitByte(b)
 *
 * @this {SerialPort}
 * @param {number} b
 * @return {boolean} true if transmitted, false if not
 */
SerialPort.prototype.transmitByte = function(b)
{
    var fTransmitted = false;

    if (this.sendByte) {
        if (this.sendByte.call(this.connection, b)) {
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
 * isTransmitterReady()
 *
 * Called whenever a ChipSet circuit needs the SerialPort UART's transmitter status.
 *
 * @this {SerialPort}
 * @return {boolean} (true if ready, false if not)
 */
SerialPort.prototype.isTransmitterReady = function()
{
    return !!(this.bStatus & SerialPort.UART8251.STATUS.XMIT_READY);
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
    var b = this.bDataIn;
    this.printMessageIO(port, null, addrFrom, "DATA", b);
    this.bStatus &= ~SerialPort.UART8251.STATUS.RECV_FULL;
    return b;
};

/**
 * inControl(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x1)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inControl = function(port, addrFrom)
{
    var b = this.bStatus;
    this.printMessageIO(port, null, addrFrom, "STATUS", b);
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
    this.bDataOut = bOut;
    this.bStatus &= ~(SerialPort.UART8251.STATUS.XMIT_READY | SerialPort.UART8251.STATUS.XMIT_EMPTY);
    if (this.transmitByte(bOut)) {
        this.bStatus |= (SerialPort.UART8251.STATUS.XMIT_READY | SerialPort.UART8251.STATUS.XMIT_EMPTY);
    }
};

/**
 * outControl(port, bOut, addrFrom)
 *
 * Writes to the CONTROL port (0x1) are either MODE or COMMAND bytes.  If the device has just
 * been powered or reset, it is in a "not ready" state and is waiting for a MODE byte.  Once it
 * has received that initial byte, the device is marked "ready", and all further bytes are
 * interpreted as COMMAND bytes (until/unless a COMMAND byte with the INTERNAL_RESET bit is set).
 *
 * @this {SerialPort}
 * @param {number} port (0x1)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outControl = function(port, bOut, addrFrom)
{
    this.printMessageIO(port, bOut, addrFrom, "CONTROL");
    if (!this.fReady) {
        this.bMode = bOut;
        this.fReady = true;
    } else {
        this.bCommand = bOut;
        if (this.bCommand & SerialPort.UART8251.COMMAND.INTERNAL_RESET) {
            this.fReady = false;
        }
    }
};

/**
 * outBaudRates(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x2)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outBaudRates = function(port, bOut, addrFrom)
{
    this.printMessageIO(port, bOut, addrFrom, "BAUDRATES");
    this.bBaudRates = bOut;
};

/*
 * Port input notification table
 */
SerialPort.aPortInput = {
    0x0: SerialPort.prototype.inData,
    0x1: SerialPort.prototype.inControl

};

/*
 * Port output notification table
 */
SerialPort.aPortOutput = {
    0x0: SerialPort.prototype.outData,
    0x1: SerialPort.prototype.outControl,
    0x2: SerialPort.prototype.outBaudRates
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
