/**
 * @fileoverview Implements the PC8080 SerialPort component.
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
    var Str = require("../../shared/lib/strlib");
    var Web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
    var State = require("../../shared/lib/state");
    var PC8080 = require("./defines");
    var Messages8080 = require("./messages");
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class SerialPort8080 extends Component {
    /**
     * SerialPort8080(parmsSerial)
     *
     * The SerialPort8080 component has the following component-specific (parmsSerial) properties:
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
     * @this {SerialPort8080}
     * @param {Object} parmsSerial
     */
    constructor(parmsSerial)
    {
        super("SerialPort", parmsSerial, Messages8080.SERIAL);

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

        /*
         * fAutoXOFF enables some experimental auto-XOFF/XON processing.  It assumes if the VT100 firmware
         * issues an XOFF, receiveByte() should stop accepting more data until the firmware issues an XOFF.
         *
         * The downside is that this doesn't really do anything to stem the flow of incoming data; it just
         * prevents the VT100's internal buffer from overflowing.  TODO: Eliminate the need for this hack
         * and add some *real* flow-control interfaces between connected SerialPort components.
         */
        this.fAutoXOFF = true;
        this.fAutoStop = false;
        this.fNullModem = true;

        var sBinding = parmsSerial['binding'];
        if (sBinding == "console") {
            this.consoleOutput = "";
        } else {
            /*
             * NOTE: If sBinding is not the name of a valid Control Panel DOM element, this call does nothing.
             */
            Component.bindExternalControl(this, sBinding, SerialPort8080.sIOBuffer);
        }

        /*
         * No connection until initConnection() is called.
         */
        this.sDataReceived = "";
        this.connection = this.sendData = this.updateStatus = null;

        /*
         * Export all functions required by initConnection().
         */
        this['exports'] = {
            'connect': this.initConnection,
            'receiveData': this.receiveData,
            'receiveStatus': this.receiveStatus
        };
    }

    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * @this {SerialPort8080}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "buffer")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sHTMLType, sBinding, control, sValue)
    {
        var serial = this;

        switch (sBinding) {
        case SerialPort8080.sIOBuffer:
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
                 * Backslash sequences like \n, \r, and \\ have already been converted to LF, CR and backslash
                 * characters, by virtue of the eval() function that all our component parameter strings pass through;
                 * eval() treats strings like "source code", so any backslash sequence that JavaScript supports is
                 * automatically converted.
                 *
                 * The complete list of backslash sequences supported by JavaScript:
                 *
                 *      \0  \'  \"  \\  \n  \r  \v  \t  \b  \f  \uXXXX \xXX
                 *                      ^J  ^M  ^K  ^I  ^H  ^L
                 *
                 * To support any other non-printable 8-bit character, such as ESC, you should use \xXX, where XX
                 * is the ASCII code in hex.  For ESC, that would \x1B.
                 */
                control.onclick = function onClickTest(event) {
                    serial.receiveData(sValue);
                    /*
                     * Give focus back to the machine (since clicking the button takes focus away).
                     *
                     *      if (serial.cmp) serial.cmp.updateFocus();
                     *
                     * iOS Usability Improvement: NOT calling updateFocus() keeps the soft keyboard down
                     * (assuming it was already down).
                     */
                    return true;
                };
                return true;
            }
            break;
        }
        return false;
    }

    /**
     * echoByte(b)
     *
     * @this {SerialPort8080}
     * @param {number} b
     * @return {boolean} true if echo, false if not
     */
    echoByte(b)
    {
        var fEchoed = false;

        if (this.controlIOBuffer) {
            if (b == 0x08) {
                this.controlIOBuffer.value = this.controlIOBuffer.value.slice(0, -1);
                /*
                 * TODO: Back up the correct number of columns if the character erased was a tab.
                 */
                if (this.iLogicalCol > 0) this.iLogicalCol--;
            }
            else {
                var s = Str.toASCIICode(b);
                var nChars = s.length;
                if (b == 0x09) {
                    var tabSize = this.tabSize || 8;
                    nChars = tabSize - (this.iLogicalCol % tabSize);
                    if (this.tabSize) s = Str.pad("", nChars);
                }
                else if (b == 0x0D) {
                    this.iLogicalCol = nChars = 0;
                    s = "\n";
                }
                if (this.charBOL && !this.iLogicalCol && nChars) s = String.fromCharCode(this.charBOL) + s;
                this.controlIOBuffer.value += s;
                this.controlIOBuffer.scrollTop = this.controlIOBuffer.scrollHeight;
                this.iLogicalCol += nChars;
            }
            fEchoed = true;
        }
        else if (this.consoleOutput != null) {
            if (b == 0x0A || this.consoleOutput.length >= 1024) {
                this.println(this.consoleOutput);
                this.consoleOutput = "";
            }
            if (b != 0x0A) {
                this.consoleOutput += String.fromCharCode(b);
            }
            fEchoed = true;
        }

        return fEchoed;
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {SerialPort8080}
     * @param {Computer8080} cmp
     * @param {Bus8080} bus
     * @param {CPUState8080} cpu
     * @param {Debugger8080} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.cmp = cmp;
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;

        var serial = this;
        this.timerReceiveNext = this.cpu.addTimer(this.id + ".receive", function() {
            serial.receiveData();
        });
        this.timerTransmitNext = this.cpu.addTimer(this.id + ".transmit", function() {
            serial.transmitData();
        });

        this.chipset = /** @type {ChipSet8080} */ (cmp.getMachineComponent("ChipSet"));

        bus.addPortInputTable(this, SerialPort8080.aPortInput, this.portBase);
        bus.addPortOutputTable(this, SerialPort8080.aPortOutput, this.portBase);

        this.setReady();
    }

    /**
     * initConnection(fNullModem)
     *
     * If a machine 'connection' parameter exists of the form "{sourcePort}->{targetMachine}.{targetPort}",
     * and "{sourcePort}" matches our idComponent, then look for a component with id "{targetMachine}.{targetPort}".
     *
     * If the target component is found, then verify that it has exported functions with the following names:
     *
     *      receiveData(data): called when we have data to transmit; aliased internally to sendData(data)
     *      receiveStatus(pins): called when our control signals have changed; aliased internally to updateStatus(pins)
     *
     * For now, we're not going to worry about communication in the other direction, because when the target component
     * performs its own initConnection(), it will find our receiveData() and receiveStatus() functions, at which point
     * communication in both directions should be established, and the circle of life complete.
     *
     * For added robustness, if the target machine initializes much more slowly than we do, and our connection attempt
     * fails, that's OK, because when it finally initializes, its initConnection() will call our initConnection();
     * if we've already initialized, no harm done.
     *
     * @this {SerialPort8080}
     * @param {boolean} [fNullModem] (caller's null-modem setting, to ensure our settings are in agreement)
     */
    initConnection(fNullModem)
    {
        if (!this.connection) {
            var sConnection = this.cmp.getMachineParm("connection");
            if (sConnection) {
                var asParts = sConnection.split('->');
                if (asParts.length == 2) {
                    var sSourceID = Str.trim(asParts[0]);
                    if (sSourceID != this.idComponent) return;  // this connection string is intended for another instance
                    var sTargetID = Str.trim(asParts[1]);
                    this.connection = Component.getComponentByID(sTargetID);
                    if (this.connection) {
                        var exports = this.connection['exports'];
                        if (exports) {
                            var fnConnect = exports['connect'];
                            if (fnConnect) fnConnect.call(this.connection, this.fNullModem);
                            this.sendData = exports['receiveData'];
                            if (this.sendData) {
                                this.fNullModem = fNullModem;
                                this.updateStatus = exports['receiveStatus'];
                                this.status("Connected " + this.idMachine + '.' + sSourceID + " to " + sTargetID);
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
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {SerialPort8080}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {

            /*
             * This is as late as we can currently wait to make our first inter-machine connection attempt;
             * even so, the target machine's initialization process may still be ongoing, so any connection
             * may be not fully resolved until the target machine performs its own initConnection(), which will
             * in turn invoke our initConnection() again.
             */
            this.initConnection(this.fNullModem);

            if (!data || !this.restore) {
                this.reset();
            } else {
                if (!this.restore(data)) return false;
            }
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {SerialPort8080}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        return fSave? this.save() : true;
    }

    /**
     * reset()
     *
     * @this {SerialPort8080}
     */
    reset()
    {
        this.initState();
    }

    /**
     * save()
     *
     * This implements save support for the SerialPort8080 component.
     *
     * @this {SerialPort8080}
     * @return {Object}
     */
    save()
    {
        var state = new State(this);
        state.set(0, this.saveRegisters());
        return state.data();
    }

    /**
     * restore(data)
     *
     * This implements restore support for the SerialPort8080 component.
     *
     * @this {SerialPort8080}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        return this.initState(data[0]);
    }

    /**
     * initState(data)
     *
     * @this {SerialPort8080}
     * @param {Array} [data]
     * @return {boolean} true if successful, false if failure
     */
    initState(data)
    {
        var i = 0;
        if (data === undefined) {
            data = SerialPort8080.UART8251.INIT;
        }
        this.fReady     = data[i++];
        this.bDataIn    = data[i++];
        this.bDataOut   = data[i++];
        this.bStatus    = data[i++];
        this.bMode      = data[i++];
        this.bCommand   = data[i++];
        this.bBaudRates = data[i];
        return true;
    }

    /**
     * saveRegisters()
     *
     * @this {SerialPort8080}
     * @return {Array}
     */
    saveRegisters()
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
    }

    /**
     * getBaudTimeout(maskRate)
     *
     * @this {SerialPort8080}
     * @param {number} maskRate (either SerialPort8080.UART8251.BAUDRATES.RECV_RATE or SerialPort8080.UART8251.BAUDRATES.XMIT_RATE)
     * @return {number} (number of milliseconds per byte)
     */
    getBaudTimeout(maskRate)
    {
        var indexRate = (this.bBaudRates & maskRate);
        if (!(maskRate & 0xf)) indexRate >>= 4;
        var nBaud = SerialPort8080.UART8251.BAUDTABLE[indexRate];
        var nBits = ((this.bMode & SerialPort8080.UART8251.MODE.DATA_BITS) >> 2) + 6;   // includes an extra +1 for start bit
        if (this.bMode & SerialPort8080.UART8251.MODE.PARITY_ENABLE) nBits++;
        nBits += ((((this.bMode & SerialPort8080.UART8251.MODE.STOP_BITS) >> 6) + 1) >> 1);
        var nBytesPerSecond = nBaud / nBits;
        return (1000 / nBytesPerSecond)|0;
    }

    /**
     * receiveByte(b)
     *
     * @this {SerialPort8080}
     * @param {number} b
     * @return {boolean}
     */
    receiveByte(b)
    {
        if (MAXDEBUG) this.echoByte(b);
        this.printMessage("receiveByte(" + Str.toHexByte(b) + "), status=" + Str.toHexByte(this.bStatus));
        if (!this.fAutoStop && !(this.bStatus & SerialPort8080.UART8251.STATUS.RECV_FULL)) {
            this.bDataIn = b;
            this.bStatus |= SerialPort8080.UART8251.STATUS.RECV_FULL;
            this.cpu.requestINTR(this.nIRQ);
            return true;
        }
        return false;
    }

    /**
     * receiveData(data)
     *
     * Helper for clocking received data at the expected RECV_RATE.
     *
     * When we're cramming test data down the terminal's throat, that data will typically be in the form
     * of a string.  When we're called by another component, data will typically be a number (ie, byte).  If no
     * data is specified at all, then all we do is "clock" any remaining data into the receiver.
     *
     * @this {SerialPort8080}
     * @param {number|string|undefined} [data]
     * @return {boolean} true if received, false if not
     */
    receiveData(data)
    {
        if (data != null) {
            if (typeof data != "number") {
                this.sDataReceived = data;
            } else {
                this.sDataReceived += String.fromCharCode(data);
            }
        }
        if (this.sDataReceived) {
            if (this.receiveByte(this.sDataReceived.charCodeAt(0))) {
                this.sDataReceived = this.sDataReceived.substr(1);
            }
            if (this.sDataReceived && this.cpu) {
                this.cpu.setTimer(this.timerReceiveNext, this.getBaudTimeout(SerialPort8080.UART8251.BAUDRATES.RECV_RATE));
            }
        }
        return true;                // for now, return true regardless, since we're buffering everything anyway
    }

    /**
     * receiveStatus(pins)
     *
     * NOTE: Prior to the addition of this interface, the DSR bit was initialized set and remained set for the life
     * of the machine.  It is entirely appropriate that this is the only way the bit can be changed, because it represents
     * an external control signal.
     *
     * @this {SerialPort8080}
     * @param {number} pins
     */
    receiveStatus(pins)
    {
        this.bStatus &= ~SerialPort8080.UART8251.STATUS.DSR;
        if (pins & RS232.DSR.MASK) this.bStatus |= SerialPort8080.UART8251.STATUS.DSR;
    }

    /**
     * transmitByte(b)
     *
     * @this {SerialPort8080}
     * @param {number} b
     * @return {boolean} true if transmitted, false if not
     */
    transmitByte(b)
    {
        var fTransmitted = false;

        this.printMessage("transmitByte(" + Str.toHexByte(b) + ")");

        if (this.fAutoXOFF) {
            if (b == 0x13) {        // XOFF
                this.fAutoStop = true;
                return false;
            }
            if (b == 0x11) {        // XON
                this.fAutoStop = false;
                return false;
            }
        }

        if (this.sendData && this.sendData.call(this.connection, b)) {
            fTransmitted = true;
        }

        if (this.echoByte(b)) {
            fTransmitted = true;
        }

        return fTransmitted;
    }

    /**
     * transmitData(sData)
     *
     * Helper for clocking transmitted data at the expected XMIT_RATE.
     *
     * When timerTransmitNext fires, we have honored the programmed XMIT_RATE period, so we can
     * set XMIT_READY (and XMIT_EMPTY), which signals the firmware that another byte can be transmitted.
     *
     * The sData parameter is not used when we're called via the timer; it's an optional parameter used by
     * the Keyboard component to deliver data pasted via the clipboard, and is currently only useful when
     * the SerialPort is connected to another machine.  TODO: Define a separate interface for that feature.
     *
     * @this {SerialPort8080}
     * @param {string} [sData]
     * @return {boolean} true if successful, false if not
     */
    transmitData(sData)
    {
        this.bStatus |= (SerialPort8080.UART8251.STATUS.XMIT_READY | SerialPort8080.UART8251.STATUS.XMIT_EMPTY);
        if (sData) {
            return this.sendData? this.sendData.call(this.connection, sData) : false;
        }
        return true;
    }

    /**
     * isTransmitterReady()
     *
     * Called whenever a ChipSet circuit needs the SerialPort8080 UART's transmitter status.
     *
     * @this {SerialPort8080}
     * @return {boolean} (true if ready, false if not)
     */
    isTransmitterReady()
    {
        return !!(this.bStatus & SerialPort8080.UART8251.STATUS.XMIT_READY);
    }

    /**
     * inData(port, addrFrom)
     *
     * @this {SerialPort8080}
     * @param {number} port (0x0)
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
     * @return {number} simulated port value
     */
    inData(port, addrFrom)
    {
        var b = this.bDataIn;
        this.printMessageIO(port, null, addrFrom, "DATA", b);
        this.bStatus &= ~SerialPort8080.UART8251.STATUS.RECV_FULL;
        return b;
    }

    /**
     * inControl(port, addrFrom)
     *
     * @this {SerialPort8080}
     * @param {number} port (0x1)
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
     * @return {number} simulated port value
     */
    inControl(port, addrFrom)
    {
        var b = this.bStatus;
        this.printMessageIO(port, null, addrFrom, "STATUS", b);
        return b;
    }

    /**
     * outData(port, bOut, addrFrom)
     *
     * @this {SerialPort8080}
     * @param {number} port (0x0)
     * @param {number} bOut
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
     */
    outData(port, bOut, addrFrom)
    {
        this.printMessageIO(port, bOut, addrFrom, "DATA");
        this.bDataOut = bOut;
        this.bStatus &= ~(SerialPort8080.UART8251.STATUS.XMIT_READY | SerialPort8080.UART8251.STATUS.XMIT_EMPTY);
        /*
         * If we're transmitting to a virtual device that has no measurable delay, this code may clear XMIT_READY
         * too quickly:
         *
         *      if (this.transmitByte(bOut)) {
         *          this.bStatus |= (SerialPort8080.UART8251.STATUS.XMIT_READY | SerialPort8080.UART8251.STATUS.XMIT_EMPTY);
         *      }
         *
         * A better solution is to arm a timer based on the XMIT_RATE baud rate, and clear the above bits when that
         * timer fires.  Consequently, we no longer care what transmitByte() reports.
         */
        this.transmitByte(bOut);
        if (this.cpu) {
            this.cpu.setTimer(this.timerTransmitNext, this.getBaudTimeout(SerialPort8080.UART8251.BAUDRATES.XMIT_RATE));
        }
    }

    /**
     * outControl(port, bOut, addrFrom)
     *
     * Writes to the CONTROL port (0x1) are either MODE or COMMAND bytes.  If the device has just
     * been powered or reset, it is in a "not ready" state and is waiting for a MODE byte.  Once it
     * has received that initial byte, the device is marked "ready", and all further bytes are
     * interpreted as COMMAND bytes (until/unless a COMMAND byte with the INTERNAL_RESET bit is set).
     *
     * @this {SerialPort8080}
     * @param {number} port (0x1)
     * @param {number} bOut
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
     */
    outControl(port, bOut, addrFrom)
    {
        this.printMessageIO(port, bOut, addrFrom, "CONTROL");
        if (!this.fReady) {
            this.bMode = bOut;
            this.fReady = true;
        } else {
            /*
             * Whenever DTR or RTS changes, we also want to notify any connected machine, via updateStatus().
             */
            if (this.updateStatus) {
                var delta = (bOut ^ this.bCommand);
                if (delta & (SerialPort8080.UART8251.COMMAND.RTS | SerialPort8080.UART8251.COMMAND.DTR)) {
                    var pins = 0;
                    if (this.fNullModem) {
                        pins |= (bOut & SerialPort8080.UART8251.COMMAND.RTS)? RS232.CTS.MASK : 0;
                        pins |= (bOut & SerialPort8080.UART8251.COMMAND.DTR)? (RS232.DSR.MASK | RS232.CD.MASK): 0;
                    } else {
                        pins |= (bOut & SerialPort8080.UART8251.COMMAND.RTS)? RS232.RTS.MASK : 0;
                        pins |= (bOut & SerialPort8080.UART8251.COMMAND.DTR)? RS232.DTR.MASK : 0;
                    }
                    this.updateStatus.call(this.connection, pins);
                }
            }
            this.bCommand = bOut;
            if (this.bCommand & SerialPort8080.UART8251.COMMAND.INTERNAL_RESET) {
                this.fReady = false;
            }
        }
    }

    /**
     * outBaudRates(port, bOut, addrFrom)
     *
     * @this {SerialPort8080}
     * @param {number} port (0x2)
     * @param {number} bOut
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
     */
    outBaudRates(port, bOut, addrFrom)
    {
        this.printMessageIO(port, bOut, addrFrom, "BAUDRATES");
        this.bBaudRates = bOut;
    }

    /**
     * SerialPort8080.init()
     *
     * This function operates on every HTML element of class "serial", extracting the
     * JSON-encoded parameters for the SerialPort8080 constructor from the element's "data-value"
     * attribute, invoking the constructor to create a SerialPort8080 component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeSerial = Component.getElementsByClass(document, PC8080.APPCLASS, "serial");
        for (var iSerial = 0; iSerial < aeSerial.length; iSerial++) {
            var eSerial = aeSerial[iSerial];
            var parmsSerial = Component.getComponentParms(eSerial);
            var serial = new SerialPort8080(parmsSerial);
            Component.bindComponentControls(serial, eSerial, PC8080.APPCLASS);
        }
    }
}

/*
 * class SerialPort8080
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

SerialPort8080.UART8251 = {
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
     *
     * NOTE: This is a VT100-specific port and baud rate table.
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

SerialPort8080.UART8251.INIT = [
    false,
    0,
    0,
    SerialPort8080.UART8251.STATUS.INIT,
    SerialPort8080.UART8251.MODE.INIT,
    SerialPort8080.UART8251.COMMAND.INIT,
    SerialPort8080.UART8251.BAUDRATES.INIT
];

/*
 * Internal name used for the I/O buffer control, if any, that we bind to a SerialPort8080.
 *
 * Alternatively, if SerialPort8080 wants to use another component's control (eg, the Panel's
 * "print" control), it can specify the name of that control with the 'binding' property.
 *
 * For that binding to succeed, we also need to know the target component; for now, that's
 * been hard-coded to "Panel", in part because that's one of the few components we can rely
 * upon initializing before we do, but it would be a simple matter to include a component type
 * or ID as part of the 'binding' property as well, if we need more flexibility later.
 */
SerialPort8080.sIOBuffer = "buffer";

/*
 * Port input notification table
 */
SerialPort8080.aPortInput = {
    0x0: SerialPort8080.prototype.inData,
    0x1: SerialPort8080.prototype.inControl

};

/*
 * Port output notification table
 */
SerialPort8080.aPortOutput = {
    0x0: SerialPort8080.prototype.outData,
    0x1: SerialPort8080.prototype.outControl,
    0x2: SerialPort8080.prototype.outBaudRates
};

/*
 * Initialize every SerialPort8080 module on the page.
 */
Web.onInit(SerialPort8080.init);

if (NODE) module.exports = SerialPort8080;
