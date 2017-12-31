/**
 * @fileoverview Implements the PCx86 ParallelPort component.
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
    var Str         = require("../../shared/lib/strlib");
    var Web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var State       = require("../../shared/lib/state");
    var PCX86       = require("./defines");
    var Messages    = require("./messages");
    var ChipSet     = require("./chipset");
}

/*
 * class ParallelPort
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

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class ParallelPort extends Component {
    /**
     * ParallelPort(parmsParallel)
     *
     * The ParallelPort component has the following component-specific (parmsParallel) properties:
     *
     *      adapter: 1 (port 0x3BC), 2 (port 0x378), or 3 (port 0x278); 0 if not defined
     *
     *      binding: name of a control (based on its "binding" attribute) to bind to this port's I/O
     *
     * In the future, we may support 'port' and 'irq' properties that allow the machine to define a
     * non-standard parallel port configuration, instead of only our pre-defined 'adapter' configurations.
     *
     * NOTE: Since the XSL file defines 'adapter' as a number, not a string, there's no need to use
     * parseInt(), and as an added benefit, we don't need to worry about whether a hex or decimal format
     * was used.
     *
     * DOS typically names the Primary adapter "LPT1" and the Secondary adapter "LPT2", but I prefer
     * to stick to adapter numbers, since not all operating systems follow those naming conventions.
     *
     * @this {ParallelPort}
     * @param {Object} parmsParallel
     */
    constructor(parmsParallel)
    {
        super("ParallelPort", parmsParallel, Messages.PARALLEL);

        this.iAdapter = parmsParallel['adapter'];

        switch (this.iAdapter) {
        case 1:
            this.portBase = 0x3BC;
            this.nIRQ = ChipSet.IRQ.LPT1;
            break;
        case 2:
            this.portBase = 0x378;
            this.nIRQ = ChipSet.IRQ.LPT1;
            break;
        case 3:
            this.portBase = 0x278;
            this.nIRQ = ChipSet.IRQ.LPT2;
            break;
        default:
            Component.warning("Unrecognized parallel adapter #" + this.iAdapter);
            return;
        }
        /**
         * consoleOutput becomes a string that records parallel port output if the 'binding' property is set to the
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

        var sBinding = parmsParallel['binding'];
        if (sBinding == "console") {
            this.consoleOutput = "";
        } else {
            /*
             * NOTE: If sBinding is not the name of a valid Control Panel DOM element, this call does nothing.
             */
            Component.bindExternalControl(this, sBinding, ParallelPort.sIOBuffer);
        }
    }

    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * @this {ParallelPort}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "buffer")
     * @param {HTMLElement} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sHTMLType, sBinding, control, sValue)
    {
        switch (sBinding) {
        case ParallelPort.sIOBuffer:
            this.bindings[sBinding] = this.controlIOBuffer = control;
            return true;

        default:
            break;
        }
        return false;
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {ParallelPort}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {X86CPU} cpu
     * @param {DebuggerX86} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;
        this.chipset = cmp.getMachineComponent("ChipSet");
        bus.addPortInputTable(this, ParallelPort.aPortInput, this.portBase);
        bus.addPortOutputTable(this, ParallelPort.aPortOutput, this.portBase);
        this.setReady();
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {ParallelPort}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {
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
     * @this {ParallelPort}
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
     * @this {ParallelPort}
     */
    reset()
    {
        this.initState();
    }

    /**
     * save()
     *
     * This implements save support for the ParallelPort component.
     *
     * @this {ParallelPort}
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
     * This implements restore support for the ParallelPort component.
     *
     * @this {ParallelPort}
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
     * @this {ParallelPort}
     * @param {Array} [data]
     * @return {boolean} true if successful, false if failure
     */
    initState(data)
    {
        var i = 0;
        if (data === undefined) {
            data = [0, ParallelPort.STATUS.NERR, 0];
        }
        this.bData = data[i++];
        this.bStatus = data[i++];
        this.bControl = data[i];
        return true;
    }

    /**
     * saveRegisters()
     *
     * @this {ParallelPort}
     * @return {Array}
     */
    saveRegisters()
    {
        var i = 0;
        var data = [];
        data[i++] = this.bData;
        data[i++] = this.bStatus;
        data[i]   = this.bControl;
        return data;
    }

    /**
     * inData(port, addrFrom)
     *
     * @this {ParallelPort}
     * @param {number} port (0x3BC, 0x378, or 0x278)
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
     * @return {number} simulated port value
     */
    inData(port, addrFrom)
    {
        var b = this.bData;
        this.printMessageIO(port, null, addrFrom, "DATA", b);
        return b;
    }

    /**
     * inStatus(port, addrFrom)
     *
     * @this {ParallelPort}
     * @param {number} port (0x3BD, 0x379, or 0x279)
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
     * @return {number} simulated port value
     */
    inStatus(port, addrFrom)
    {
        var b = this.bStatus;
        this.bStatus |= ParallelPort.STATUS.NACK;
        this.bStatus &= ~ParallelPort.STATUS.BUSY;
        this.printMessageIO(port, null, addrFrom, "STAT", b);
        this.updateIRR();
        return b;
    }

    /**
     * inControl(port, addrFrom)
     *
     * @this {ParallelPort}
     * @param {number} port (0x3BE, 0x37A, or 0x27A)
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
     * @return {number} simulated port value
     */
    inControl(port, addrFrom)
    {
        var b = this.bControl;
        this.printMessageIO(port, null, addrFrom, "CTRL", b);
        return b;
    }

    /**
     * outData(port, bOut, addrFrom)
     *
     * @this {ParallelPort}
     * @param {number} port (0x3BC, 0x378, or 0x278)
     * @param {number} bOut
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
     */
    outData(port, bOut, addrFrom)
    {
        var parallel = this;
        this.printMessageIO(port, bOut, addrFrom, "DATA");
        this.bData = bOut;
        this.cpu.nonCPU(function() {
            if (parallel.transmitByte(bOut)) {
                parallel.bStatus |= ParallelPort.STATUS.BUSY | ParallelPort.STATUS.NERR;
                parallel.bStatus &= ~ParallelPort.STATUS.NACK;
                return true;
            }
            return false;
        });
        this.updateIRR();
    }

    /**
     * outControl(port, bOut, addrFrom)
     *
     * @this {ParallelPort}
     * @param {number} port (0x3BE, 0x37A, or 0x27A)
     * @param {number} bOut
     * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
     */
    outControl(port, bOut, addrFrom)
    {
        this.printMessageIO(port, bOut, addrFrom, "CTRL");
        this.bControl = bOut;
        this.updateIRR();
    }

    /**
     * updateIRR()
     *
     * @this {ParallelPort}
     */
    updateIRR()
    {
        if (this.chipset && this.nIRQ) {
            if ((this.bControl & ParallelPort.CONTROL.IRQ_ENABLE) && !(this.bStatus & ParallelPort.STATUS.NACK)) {
                this.chipset.setIRR(this.nIRQ);
            } else {
                this.chipset.clearIRR(this.nIRQ);
            }
        }
    }

    /**
     * transmitByte(b)
     *
     * @this {ParallelPort}
     * @param {number} b
     * @return {boolean} true if transmitted, false if not
     */
    transmitByte(b)
    {
        var fTransmitted = false;

        this.printMessage("transmitByte(" + Str.toHexByte(b) + ")");

        if (this.controlIOBuffer) {
            if (b == 0x0D) {
                // this.iLogicalCol = 0;
            }
            else if (b == 0x08) {
                this.controlIOBuffer.value = this.controlIOBuffer.value.slice(0, -1);
            }
            else {
                /*
                 * If we assume that the printer being used was the original IBM 80 CPS Matrix Printer,
                 * characters 0x80-0x9F mirror control codes 0x00-0x1F, and characters 0xA0-0xDF are various
                 * block shapes, sort of in the spirit of the line-drawing characters 0xC0-0xDF defined by
                 * IBM Code Page 437, but, no, completely different.  And apparently, characters 0xE0-0xFF
                 * printed nothing at all (see Table 11 on page 2-78 of the original IBM PC 5150 TechRef).
                 *
                 * The only control character we care about is LINE-FEED; for all other control characters,
                 * we'll display the ASCII mnemonic, to make it clear what the software intended.  And as for
                 * any block characters, we'll print an asterisk and call it good, for now.  Beyond that,
                 * we'll just print spaces.
                 */
                if (b >= 0x80) {
                    if (b < 0xA0) {
                        b -= 0x80;
                    } else if (b < 0xE0) {
                        b = 0x2A;       // ASCII code for an asterisk
                    } else {
                        b = 0x20;       // ASCII code for a space
                    }
                }
                this.controlIOBuffer.value += Str.toASCIICode(b);
                this.controlIOBuffer.scrollTop = this.controlIOBuffer.scrollHeight;
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
    }

    /**
     * ParallelPort.init()
     *
     * This function operates on every HTML element of class "parallel", extracting the
     * JSON-encoded parameters for the ParallelPort constructor from the element's "data-value"
     * attribute, invoking the constructor to create a ParallelPort component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeParallel = Component.getElementsByClass(document, PCX86.APPCLASS, "parallel");
        for (var iParallel = 0; iParallel < aeParallel.length; iParallel++) {
            var eParallel = aeParallel[iParallel];
            var parmsParallel = Component.getComponentParms(eParallel);
            var parallel = new ParallelPort(parmsParallel);
            Component.bindComponentControls(parallel, eParallel, PCX86.APPCLASS);
        }
    }
}

/*
 * Internal name used for the I/O buffer control, if any, that we bind to the ParallelPort.
 *
 * Alternatively, if ParallelPort wants to use another component's control (eg, the Panel's
 * "print" control), it can specify the name of that control with the 'binding' property.
 *
 * For that binding to succeed, we also need to know the target component; for now, that's
 * been hard-coded to "Panel", in part because that's one of the few components we can rely
 * upon initializing before we do, but it would be a simple matter to include a component type
 * or ID as part of the 'binding' property as well, if we need more flexibility later.
 */
ParallelPort.sIOBuffer = "buffer";

/*
 * The "Data Register" is an input/output register at offset 0 from portBase.  The bit-to-pin mappings are:
 *
 *      Bit     Pin
 *      ---     ---
 *       0       2              // 0x01 (DATA 1)
 *       1       3              // 0x02 (DATA 2)
 *       2       4              // 0x04 (DATA 3)
 *       3       5              // 0x08 (DATA 4)
 *       4       6              // 0x10 (DATA 5)
 *       5       7              // 0x20 (DATA 6)
 *       6       8              // 0x40 (DATA 7)
 *       7       9              // 0x80 (DATA 8)
 */
ParallelPort.DATA = {           // (read/write)
    REG:        0
};

/*
 * The "Status Register" is an input register at offset 1 from portBase.  The bit-to-pin mappings are:
 *
 *      Bit     Pin
 *      ---     ---
 *       0       -              // 0x01
 *       1       -              // 0x02
 *       2       -              // 0x04
 *       3       !15            // 0x08 (Error)
 *       4       13             // 0x10 (Select)
 *       5       12             // 0x20 (Out of Paper)
 *       6       !10            // 0x40 (Acknowledged)
 *       7       11             // 0x80 (Busy; eg, printer off-line or operation in progress)
 */
ParallelPort.STATUS = {         // (read)
    REG:        1,
    NERR:       0x08,           // when this bit is cleared, I/O error
    SELECT:     0x10,           // when this bit is set, printer selected
    PAPER:      0x20,           // when this bit is set, out of paper
    NACK:       0x40,           // when this bit is cleared, data acknowledged (and optionally, interrupt requested)
    BUSY:       0x80            // when this bit is set, printer busy
};

/*
 * The "Control Register" is an input/output register at offset 2 from portBase.  The bit-to-pin mappings are:
 *
 *      Bit     Pin
 *      ---     ---
 *       0       !1             // 0x01 (read input data)
 *       1      !14             // 0x02 (automatically feed paper one line)
 *       2       16             // 0x04
 *       3      !17             // 0x08
 *
 * Additionally, bit 4 is the IRQ ENABLE bit, which allows interrupts when pin 10 transitions high to low.
 */
ParallelPort.CONTROL = {        // (read/write)
    REG:        2,
    IRQ_ENABLE: 0x10            // set to enable interrupts
};

/*
 * Port input notification table
 */
ParallelPort.aPortInput = {
    0x0: ParallelPort.prototype.inData,
    0x1: ParallelPort.prototype.inStatus,
    0x2: ParallelPort.prototype.inControl
};

/*
 * Port output notification table
 */
ParallelPort.aPortOutput = {
    0x0: ParallelPort.prototype.outData,
    0x2: ParallelPort.prototype.outControl
};

/*
 * Initialize every ParallelPort module on the page.
 */
Web.onInit(ParallelPort.init);

if (NODE) module.exports = ParallelPort;
