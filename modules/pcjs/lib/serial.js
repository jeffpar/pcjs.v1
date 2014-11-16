/**
 * @fileoverview Implements the PCjs SerialPort component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jul-01
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
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var ChipSet     = require("./chipset");
    var Debugger    = require("./debugger");
    var State       = require("./state");
}

/**
 * SerialPort(parmsSerial)
 *
 * The SerialPort component has the following component-specific (parmsSerial) properties:
 *
 *      adapter: 1 (for port 0x3F8) or 2 (for port 0x2F8); 0 if not defined
 *
 * WARNING: Since the XSL file defines 'adapter' as a number, not a string, there's no need to
 * use parseInt(), and as an added benefit, we don't need to worry about whether a hex or decimal
 * format was used.
 *
 * This hard-coded approach mimics the original IBM PC Asynchronous Adapter configuration, which
 * contained a pair of "shunt modules" that allowed the user to select a port address of either
 * 0x3F8 ("Primary") or 0x2F8 ("Secondary").
 *
 * DOS typically names the Primary adapter "COM1" and the Secondary adapter "COM2", but I prefer
 * to stick to adapter numbers, since not all operating systems follow those naming conventions.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsSerial
 */
function SerialPort(parmsSerial) {

    this.iAdapter = parmsSerial['adapter'];

    switch (this.iAdapter) {
        case 1:
            this.portBase = 0x3F8;
            this.nIRQ = ChipSet.IRQ.COM1;
            break;
        case 2:
            this.portBase = 0x2F8;
            this.nIRQ = ChipSet.IRQ.COM2;
            break;
        default:
            Component.warning("Unrecognized serial adapter #" + this.iAdapter);
            return;
    }

    /**
     * controlIOBuffer is a DOM element, if any, bound to the port (currently for output purposes only; see echoByte())
     *
     * @type {Object}
     */
    this.controlIOBuffer = null;

    Component.call(this, "SerialPort", parmsSerial, SerialPort);

    Component.bindExternalControl(this, parmsSerial['binding'], SerialPort.sIOBuffer);
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

Component.subclass(Component, SerialPort);

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

/*
 * 8250 I/O register offsets (add these to a I/O base address to obtain an I/O port address)
 *
 * NOTE: DLL.REG and DLM.REG form a 16-bit divisor into a clock input frequency of 1.8432Mhz.  The following
 * values should be used for the corresponding baud rates.  Rates above 9600 are discouraged by the IBM Tech Ref,
 * but rates as high as 128000 are listed on the NS8250A data sheet.
 *
 *      Divisor     Rate        Percent Error
 *      0x0900      50
 *      0x0600      75
 *      0x0417      110         0.026%
 *      0x0359      134.5       0.058%
 *      0x0300      150
 *      0x0180      300
 *      0x00C0      600
 *      0x0060      1200
 *      0x0040      1800
 *      0x003A      2000        0.69%
 *      0x0030      2400
 *      0x0020      3600
 *      0x0018      4800
 *      0x0010      7200
 *      0x000C      9600
 *      0x0006      19200
 *      0x0003      38400
 *      0x0002      56000       2.86%
 *      0x0001      128000
 */
SerialPort.DLL = {REG: 0};              // Divisor Latch LSB (only when SerialPort.LCR.DLAB is set)
SerialPort.THR = {REG: 0};              // Transmitter Holding Register (write)
SerialPort.DL_DEFAULT       = 0x180;    // we select an arbitrary default Divisor Latch equivalent to 300 baud

/*
 * Receiver Buffer Register (RBR.REG, offset 0; eg, 0x3F8 or 0x2F8)
 */
SerialPort.RBR = {REG: 0};              // (read)

/*
 * Interrupt Enable Register (IER.REG, offset 1; eg, 0x3F9 or 0x2F9)
 */
SerialPort.IER = {};
SerialPort.IER.REG          = 1;        // Interrupt Enable Register
SerialPort.IER.RBR_AVAIL    = 0x01;
SerialPort.IER.THR_EMPTY    = 0x02;
SerialPort.IER.LSR_DELTA    = 0x04;
SerialPort.IER.MSR_DELTA    = 0x08;
SerialPort.IER.UNUSED       = 0xF0;     // always zero

SerialPort.DLM = {REG: 1};              // Divisor Latch MSB (only when SerialPort.LCR.DLAB is set)

/*
 * Interrupt ID Register (IIR.REG, offset 2; eg, 0x3FA or 0x2FA)
 *
 * All interrupt conditions cleared by reading the corresponding register (or, in the case of IRR_INT_THR, writing a new value to THR.REG)
 */
SerialPort.IIR = {};
SerialPort.IIR.REG          = 2;        // Interrupt ID Register (read-only)
SerialPort.IIR.NO_INT       = 0x01;
SerialPort.IIR.INT_LSR      = 0x06;     // Line Status (highest priority: Overrun error, Parity error, Framing error, or Break Interrupt)
SerialPort.IIR.INT_RBR      = 0x04;     // Receiver Data Available
SerialPort.IIR.INT_THR      = 0x02;     // Transmitter Holding Register Empty
SerialPort.IIR.INT_MSR      = 0x00;     // Modem Status Register (lowest priority: Clear To Send, Data Set Ready, Ring Indicator, or Data Carrier Detect)
SerialPort.IIR.INT_BITS     = 0x06;
SerialPort.IIR.UNUSED       = 0xF8;     // always zero (the ROM BIOS relies on these bits "floating to 1" when no SerialPort is present)

/*
 * Line Control Register (LCR.REG, offset 3; eg, 0x3FB or 0x2FB)
 */
SerialPort.LCR = {};
SerialPort.LCR.REG          = 3;        // Line Control Register
SerialPort.LCR.DATA_5BITS   = 0x00;
SerialPort.LCR.DATA_6BITS   = 0x01;
SerialPort.LCR.DATA_7BITS   = 0x02;
SerialPort.LCR.DATA_8BITS   = 0x03;
SerialPort.LCR.STOP_BITS    = 0x04;     // clear: 1 stop bit; set: 1.5 stop bits for LCR_DATA_5BITS, 2 stop bits for all other data lengths
SerialPort.LCR.PARITY_BIT   = 0x08;     // if set, a parity bit is inserted/expected between the last data bit and the first stop bit; no parity bit if clear
SerialPort.LCR.PARITY_EVEN  = 0x10;     // if set, even parity is selected (ie, the parity bit insures an even number of set bits); if clear, odd parity
SerialPort.LCR.PARITY_STICK = 0x20;     // if set, parity bit is transmitted inverted; if clear, parity bit is transmitted normally
SerialPort.LCR.BREAK        = 0x40;     // if set, serial output (SOUT) signal is forced to logical 0 for the duration
SerialPort.LCR.DLAB         = 0x80;     // Divisor Latch Access Bit; if set, DLL.REG and DLM.REG can be read or written

/*
 * Modem Control Register (MCR.REG, offset 4; eg, 0x3FC or 0x2FC)
 */
SerialPort.MCR = {};
SerialPort.MCR.REG          = 4;        // Modem Control Register
SerialPort.MCR.DTR          = 0x01;     // when set, DTR goes high, indicating ready to establish link (looped back to DSR in loop-back mode)
SerialPort.MCR.RTS          = 0x02;     // when set, RTS goes high, indicating ready to exchange data (looped back to CTS in loop-back mode)
SerialPort.MCR.OUT1         = 0x04;     // when set, OUT1 goes high (looped back to RI in loop-back mode)
SerialPort.MCR.OUT2         = 0x08;     // when set, OUT2 goes high (looped back to RLSD in loop-back mode)
SerialPort.MCR.LOOPBACK     = 0x10;     // when set, enables loop-back mode
SerialPort.MCR.UNUSED       = 0xE0;     // always zero

/*
 * Line Status Register (LSR.REG, offset 5; eg, 0x3FD or 0x2FD)
 *
 * NOTE: I've seen different specs for the LSR_TSRE.  I'm following the IBM Tech Ref's lead here, but the data sheet I have calls it TEMT
 * instead of TSRE, and claims that it is set whenever BOTH the THR and TSR are empty, and clear whenever EITHER the THR or TSR contain data.
 */
SerialPort.LSR = {};
SerialPort.LSR.REG          = 5;        // Line Status Register
SerialPort.LSR.DR           = 0x01;     // Data Ready (set when new data in RBR.REG; cleared when RBR.REG read)
SerialPort.LSR.OE           = 0x02;     // Overrun Error (set when new data arrives in RBR.REG before previous data read; cleared when LSR.REG read)
SerialPort.LSR.PE           = 0x04;     // Parity Error (set when new data has incorrect parity; cleared when LSR.REG read)
SerialPort.LSR.FE           = 0x08;     // Framing Error (set when new data has invalid stop bit; cleared when LSR.REG read)
SerialPort.LSR.BI           = 0x10;     // Break Interrupt (set when new data exceeded normal transmission time; cleared LSR.REG when read)
SerialPort.LSR.THRE         = 0x20;     // Transmitter Holding Register Empty (set when UART ready to accept new data; cleared when THR.REG written)
SerialPort.LSR.TSRE         = 0x40;     // Transmitter Shift Register Empty (set when the TSR is empty; cleared when the THR is transferred to the TSR)
SerialPort.LSR.UNUSED       = 0x80;     // always zero

/*
 * Modem Status Register (MSR.REG, offset 6; eg, 0x3FE or 0x2FE)
 */
SerialPort.MSR = {};
SerialPort.MSR.REG          = 6;        // Modem Status Register
SerialPort.MSR.DCTS         = 0x01;     // when set, CTS (Clear To Send) has changed since last read
SerialPort.MSR.DDSR         = 0x02;     // when set, DSR (Data Set Ready) has changed since last read
SerialPort.MSR.TERI         = 0x04;     // when set, TERI (Trailing Edge Ring Indicator) indicates RI has changed from 1 to 0
SerialPort.MSR.DRLSD        = 0x08;     // when set, RLSD (Received Line Signal Detector) has changed
SerialPort.MSR.CTS          = 0x10;     // when set, the modem or data set is ready to exchange data (complement of the Clear To Send input signal)
SerialPort.MSR.DSR          = 0x20;     // when set, the modem or data set is ready to establish link (complement of the Data Set Ready input signal)
SerialPort.MSR.RI           = 0x40;     // complement of the RI (Ring Indicator) input
SerialPort.MSR.RLSD         = 0x80;     // complement of the RLSD (Received Line Signal Detect) input

/*
 * Scratch Register (SCR.REG, offset 7; eg, 0x3FF or 0x2FF)
 */
SerialPort.SCR = {REG: 7};

/**
 * attachMouse(id, mouse)
 *
 * @this {SerialPort}
 * @param {string} id
 * @param {Mouse} mouse component
 * @return {Component} this or null, based on whether or not the specified ID matches
 */
SerialPort.prototype.attachMouse = function(id, mouse) {
    if (id == this.idComponent) {
        this.mouse = mouse;
        return this;
    }
    return null;
};

/**
 * syncMouse()
 *
 * NOTE: This is probably obsolete, but the Mouse component still might discover a need for it.  See Mouse.powerUp().
 *
 * @this {SerialPort}
 *
SerialPort.prototype.syncMouse = function() {
    if (this.mouse) this.mouse.notifyMCR(this.bMCR);
};
 */

/**
 * setBinding(sHTMLType, sBinding, control)
 *
 * @this {SerialPort}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "buffer")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
SerialPort.prototype.setBinding = function(sHTMLType, sBinding, control) {
    var serial = this;
    switch (sBinding) {
    case SerialPort.sIOBuffer:
        this.bindings[sBinding] = this.controlIOBuffer = control;
        /*
         * By establishing an onkeypress handler here, we make it possible for DOS commands like
         * "CTTY COM1" to more or less work (use "CTTY CON" to restore control to the DOS console).
         *
         * WARNING: This isn't really a supported feature yet; very much a work-in-progress.
         */
        control.onkeydown = function onKeyDownSerial(event) {
            /*
             * This is required in addition to onkeypress, because it's the only way to prevent
             * BACKSPACE from being interpreted by the browser as a "Back" operation.
             */
            event = event || window.event;
            var keyCode = event.keyCode;
            if (keyCode === 8) {
                if (event.preventDefault) event.preventDefault();
                serial.sendRBR([keyCode]);
            }
        };
        control.onkeypress = function onKeyPressSerial(event) {
            /*
             * Browser-independent keyCode extraction (refer to keyPress() and the other key
             * event handlers in keyboard.js).
             */
            event = event || window.event;
            var keyCode = event.which || event.keyCode;
            serial.sendRBR([keyCode]);
        };
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
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
SerialPort.prototype.initBus = function(cmp, bus, cpu, dbg) {
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.chipset = cmp.getComponentByType("ChipSet");
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
SerialPort.prototype.powerUp = function(data, fRepower) {
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
 * powerDown(fSave)
 *
 * @this {SerialPort}
 * @param {boolean} fSave
 * @return {Object|boolean}
 */
SerialPort.prototype.powerDown = function(fSave) {
    return fSave && this.save ? this.save() : true;
};

/**
 * reset()
 *
 * @this {SerialPort}
 */
SerialPort.prototype.reset = function() {
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
SerialPort.prototype.save = function() {
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
SerialPort.prototype.restore = function(data) {
    return this.initState(data[0]);
};

/**
 * initState(data)
 *
 * @this {SerialPort}
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
SerialPort.prototype.initState = function(data) {
    /*
     * The NS8250A spec doesn't explicitly say what the RBR and THR are initialized to on a reset,
     * but I think we can safely assume zeros.  Similarly, we reset the baud rate Divisor Latch (wDL)
     * to an arbitrary but consistent default (DL_DEFAULT).
     */
    var i = 0;
    if (data === undefined) {
        data = [
            0,                                          // RBR
            0,                                          // THR
            SerialPort.DL_DEFAULT,                      // DL
            0,                                          // IER
            SerialPort.IIR.NO_INT,                      // IIR
            0,                                          // LCR
            0,                                          // MCR
            SerialPort.LSR.THRE | SerialPort.LSR.TSRE,  // LSR
            SerialPort.MSR.CTS | SerialPort.MSR.DSR,    // MSR (instead of the normal 0 default, we indicate a state of readiness -- to be revisited)
            []
        ];
    }
    this.bRBR = data[i++];
    this.bTHR = data[i++];
    this.wDL =  data[i++];
    this.bIER = data[i++];
    this.bIIR = data[i++];
    this.bLCR = data[i++];
    this.bMCR = data[i++];
    this.bLSR = data[i++];
    this.bMSR = data[i++];
    this.abReceive = data[i];
    return true;
};

/**
 * saveRegisters()
 *
 * @this {SerialPort}
 * @return {Array}
 */
SerialPort.prototype.saveRegisters = function() {
    var i = 0;
    var data = [];
    data[i++] = this.bRBR;
    data[i++] = this.bTHR;
    data[i++] = this.wDL;
    data[i++] = this.bIER;
    data[i++] = this.bIIR;
    data[i++] = this.bLCR;
    data[i++] = this.bMCR;
    data[i++] = this.bLSR;
    data[i++] = this.bMSR;
    data[i] = this.abReceive;
    return data;
};

/**
 * sendRBR(ab)
 *
 * @this {SerialPort}
 * @param {Array} ab is an array of bytes to propagate to the bRBR (Receiver Buffer Register)
 */
SerialPort.prototype.sendRBR = function(ab) {
    this.abReceive = this.abReceive.concat(ab);
    this.advanceRBR();
};

/**
 * advanceRBR()
 *
 * @this {SerialPort}
 */
SerialPort.prototype.advanceRBR = function() {
    if (this.abReceive.length > 0 && !(this.bLSR & SerialPort.LSR.DR)) {
        this.bRBR = this.abReceive.shift();
        this.bLSR |= SerialPort.LSR.DR;
    }
    this.updateIRR();
};

/**
 * inRBR(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3F8 or 0x2F8)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inRBR = function(port, addrFrom) {
    var b = ((this.bLCR & SerialPort.LCR.DLAB) ? (this.wDL & 0xff) : this.bRBR);
    this.messagePort(port, null, addrFrom, (this.bLCR & SerialPort.LCR.DLAB) ? "DLL" : "RBR", b);
    this.bLSR &= ~SerialPort.LSR.DR;
    this.advanceRBR();
    return b;
};

/**
 * inIER(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3F9 or 0x2F9)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inIER = function(port, addrFrom) {
    var b = ((this.bLCR & SerialPort.LCR.DLAB) ? (this.wDL >> 8) : this.bIER);
    this.messagePort(port, null, addrFrom, (this.bLCR & SerialPort.LCR.DLAB) ? "DLM" : "IER", b);
    return b;
};

/**
 * inIIR(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3FA or 0x2FA)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inIIR = function(port, addrFrom) {
    var b = this.bIIR;
    this.messagePort(port, null, addrFrom, "IIR", b);
    return b;
};

/**
 * inLCR(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3FB or 0x2FB)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inLCR = function(port, addrFrom) {
    var b = this.bLCR;
    this.messagePort(port, null, addrFrom, "LCR", b);
    return b;
};

/**
 * inMCR(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3FC or 0x2FC)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inMCR = function(port, addrFrom) {
    var b = this.bMCR;
    this.messagePort(port, null, addrFrom, "MCR", b);
    return b;
};

/**
 * inLSR(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3FD or 0x2FD)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inLSR = function(port, addrFrom) {
    var b = this.bLSR;
    this.messagePort(port, null, addrFrom, "LSR", b);
    return b;
};

/**
 * inMSR(port, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3FE or 0x2FE)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
SerialPort.prototype.inMSR = function(port, addrFrom) {
    var b = this.bMSR;
    this.messagePort(port, null, addrFrom, "MSR", b);
    return b;
};

/**
 * outTHR(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3F8 or 0x2F8)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outTHR = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, (this.bLCR & SerialPort.LCR.DLAB) ? "DLL" : "THR");
    if (this.bLCR & SerialPort.LCR.DLAB) {
        this.wDL = (this.wDL & ~0xff) | bOut;
    } else {
        this.bTHR = bOut;
        this.bLSR &= ~(SerialPort.LSR.THRE | SerialPort.LSR.TSRE);
        if (this.echoByte(bOut)) {
            this.bLSR |= (SerialPort.LSR.THRE | SerialPort.LSR.TSRE);
            /*
             * QUESTION: Does this mean we should also flush/zero bTHR?
             */
        }
    }
};

/**
 * outIER(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3F9 or 0x2F9)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outIER = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, (this.bLCR & SerialPort.LCR.DLAB) ? "DLM" : "IER");
    if (this.bLCR & SerialPort.LCR.DLAB) {
        this.wDL = (this.wDL & 0xff) | (bOut << 8);
    } else {
        this.bIER = bOut;
    }
};

/**
 * outLCR(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3FB or 0x2FB)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outLCR = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, "LCR");
    this.bLCR = bOut;
};

/**
 * outMCR(port, bOut, addrFrom)
 *
 * @this {SerialPort}
 * @param {number} port (0x3FC or 0x2FC)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
SerialPort.prototype.outMCR = function(port, bOut, addrFrom) {
    var bPrev = this.bMCR;
    this.messagePort(port, bOut, addrFrom, "MCR");
    this.bMCR = bOut;
    if (this.mouse && (bPrev ^ bOut) & (SerialPort.MCR.DTR | SerialPort.MCR.RTS)) {
        this.mouse.notifyMCR(this.bMCR);
    }
};

/**
 * updateIRR()
 *
 * @this {SerialPort}
 */
SerialPort.prototype.updateIRR = function() {
    var bIIR = -1;
    if ((this.bLSR & SerialPort.LSR.DR) && (this.bIER & SerialPort.IER.RBR_AVAIL)) {
        bIIR = SerialPort.IIR.INT_RBR;
    }
    if (bIIR >= 0) {
        this.bIIR &= ~(SerialPort.IIR.NO_INT | SerialPort.IIR.INT_BITS);
        this.bIIR |= bIIR;
        if (this.chipset && this.nIRQ) this.chipset.setIRR(this.nIRQ);
    } else {
        this.bIIR |= SerialPort.IIR.NO_INT;
        if (this.chipset && this.nIRQ) this.chipset.clearIRR(this.nIRQ);
    }
};

/**
 * echoByte(b)
 *
 * @this {SerialPort}
 * @param {number} b
 * @return {boolean} true if echoed, false if not
 */
SerialPort.prototype.echoByte = function(b) {
    if (this.controlIOBuffer) {
        if (b != 0x0D) {
            if (b == 0x08) {
                this.controlIOBuffer.value = this.controlIOBuffer.value.slice(0, -1);
            } else {
                this.controlIOBuffer.value += String.fromCharCode(b);
                this.controlIOBuffer.scrollTop = this.controlIOBuffer.scrollHeight;
            }
        }
        return true;
    }
    return false;
};

/**
 * messageDebugger(sMessage)
 *
 * This is a combination of the Debugger's messageEnabled(MESSAGE_SERIAL) and message() functions, for convenience.
 *
 * @this {SerialPort}
 * @param {string} sMessage is any caller-defined message string
 */
SerialPort.prototype.messageDebugger = function(sMessage) {
    if (DEBUGGER && this.dbg) {
        if (this.dbg.messageEnabled(Debugger.MESSAGE.SERIAL)) {
            this.dbg.message(sMessage);
        }
    }
};

/**
 * messagePort(port, bOut, addrFrom, name, bIn)
 *
 * This is an internal version of the Debugger's messagePort() function, for convenience.
 *
 * @this {SerialPort}
 * @param {number} port
 * @param {number|null} bOut if an output operation
 * @param {number|null} [addrFrom]
 * @param {string|null} [name] of the port, if any
 * @param {number} [bIn] is the input value, if known, on an input operation
 */
SerialPort.prototype.messagePort = function(port, bOut, addrFrom, name, bIn) {
    if (DEBUGGER && this.dbg) {
        this.dbg.messagePort(this, port, bOut, addrFrom, name, Debugger.MESSAGE.SERIAL, bIn);
    }
};

/*
 * Port input notification table
 */
SerialPort.aPortInput = {
    0x0: SerialPort.prototype.inRBR,    // or DLL if DLAB set
    0x1: SerialPort.prototype.inIER,    // or DLM if DLAB set
    0x2: SerialPort.prototype.inIIR,
    0x3: SerialPort.prototype.inLCR,
    0x4: SerialPort.prototype.inMCR,
    0x5: SerialPort.prototype.inLSR,
    0x6: SerialPort.prototype.inMSR
};

/*
 * Port output notification table
 */
SerialPort.aPortOutput = {
    0x0: SerialPort.prototype.outTHR,   // or DLL if DLAB set
    0x1: SerialPort.prototype.outIER,   // or DLM if DLAB set
    0x3: SerialPort.prototype.outLCR,
    0x4: SerialPort.prototype.outMCR
};

/**
 * SerialPort.init()
 *
 * This function operates on every element (e) of class "serial", and initializes
 * all the necessary HTML to construct the SerialPort module(s) as spec'ed.
 *
 * Note that each element (e) of class "serial" is expected to have a "data-value"
 * attribute containing the same JSON-encoded parameters that the SerialPort constructor
 * expects.
 */
SerialPort.init = function() {
    var aeSerial = Component.getElementsByClass(window.document, PCJSCLASS, "serial");
    for (var iSerial = 0; iSerial < aeSerial.length; iSerial++) {
        var eSerial = aeSerial[iSerial];
        var parmsSerial = Component.getComponentParms(eSerial);
        var serial = new SerialPort(parmsSerial);
        Component.bindComponentControls(serial, eSerial, PCJSCLASS);
    }
};

/*
 * Initialize every SerialPort module on the page.
 */
web.onInit(SerialPort.init);

if (typeof APP_PCJS !== 'undefined') APP_PCJS.SerialPort = SerialPort;

if (typeof module !== 'undefined') module.exports = SerialPort;
