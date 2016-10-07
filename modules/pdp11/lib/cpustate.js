/**
 * @fileoverview Implements the PDP11 CPU component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.3 written by Paul Nankervis
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
    var BusPDP11      = require("./bus");
    var CPUPDP11      = require("./cpu");
    var MessagesPDP11 = require("./messages");
    var MemoryPDP11   = require("./memory");
}

/**
 * CPUStatePDP11(parmsCPU)
 *
 * The CPUStatePDP11 class uses the following (parmsCPU) properties:
 *
 *      model: a number (eg, 1170) that should match one of the PDP11.MODEL_* values
 *      resetAddr: reset address (default is 0)
 *
 * This extends the CPU class and passes any remaining parmsCPU properties to the CPU class
 * constructor, along with a default speed (cycles per second) based on the specified (or default)
 * CPU model number.
 *
 * @constructor
 * @extends CPUPDP11
 * @param {Object} parmsCPU
 */
function CPUStatePDP11(parmsCPU)
{
    this.model = +parmsCPU['model'] || PDP11.MODEL_1170;
    this.resetAddr = parmsCPU['resetAddr'] || 0;

    var nCyclesDefault = 0;
    switch(this.model) {
    case PDP11.MODEL_1170:
    default:
        nCyclesDefault = 6666667;
        break;
    }

    CPUPDP11.call(this, parmsCPU, nCyclesDefault);

    /*
     * If there are no live registers to display, then updateStatus() can skip a bit....
     */
    this.cLiveRegs = 0;

    /*
     * Initialize processor operation to match the requested model
     */
    this.initProcessor();
}

Component.subclass(CPUStatePDP11, CPUPDP11);

/**
 * @typedef {{
 *  delay: number,
 *  priority: number,
 *  vector: number,
 *  callback: (function()|null|undefined)
 * }} InterruptEvent
 */
var InterruptEvent;

/**
 * initProcessor()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.initProcessor = function()
{
    this.decode = PDP11.op1170.bind(this);
    this.initRegs();
    this.flags.complete = this.flags.debugCheck = false;
};

/**
 * reset()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.reset = function()
{
    if (this.flags.running) this.stopCPU();
    this.resetRegs();
    this.resetCycles();
    this.clearError();          // clear any fatal error/exception that setError() may have flagged
    this.parent.reset.call(this);
};

/**
 * initRegs()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.initRegs = function()
{
    /*
     * TODO: Verify the initial state of all PDP-11 flags and registers (are they well-documented?)
     */
    this.flagC = 0x10000;       // PSW C bit
    this.flagV  = 0x8000;       // PSW V bit
    this.flagZ  = 0xffff;       // ~ PSW Z bit      (TODO: Why do we clear instead of set Z, like other flags?)
    this.flagN  = 0x8000;       // PSW N bit
    this.regPSW = 0x000f;       // PSW other bits   (TODO: What's the point of setting the flag bits here, too?)
    this.regsGen = [            // General R0 - R7
        0, 0, 0, 0, 0, 0, 0, this.resetAddr
    ];
    this.regsAlt = [            // Alternate R0 - R5
        0, 0, 0, 0, 0, 0
    ];
    this.regsAltStack = [       // Alternate R6 stack pointers (kernel, super, illegal, user)
        0, 0, 0, 0
    ];
    this.mmuMode = 0;           // current memory management mode (see PDP11.MODE.KERNEL | SUPER | UNUSED | USER)
    this.mmuLastPage = 0;
    this.mmuLastVirtual = 0;
    this.mmuMap = [             // memory management register by mode - 16 PDR (8 I then 8 D descriptors) followed by 16 PAR (I/D addresses)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // kernel
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // super
        [0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // illegal mode 2 requires illegal PDRs
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]    // user
    ];
    this.unibusMap = [          // 32 unibus map registers
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.controlReg = [         // various control registers we don't really care about
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    /*
     * opFlags contains various triggers that stepCPU() needs to be aware of
     */
    this.opFlags = 0;

    /*
     * srcMode and srcReg are set by SRCMODE decodes, and dstMode and dstReg are set for DSTMODE decodes,
     * indicating to the opcode handlers the mode(s) and register(s) used as part of the current opcode, so
     * that they can calculate the correct number of cycles.  dstAddr is set for byte operations that also
     * need to know the effective address for their cycle calculation.
     */
    this.srcMode = this.srcReg = 0;
    this.dstMode = this.dstReg = this.dstAddr = 0;

    this.cpuType = 70;
    this.trapPSW = -1;
    this.loopRate = 9999;       // instructions we can execute in 12ms
    this.resetRegs();
};

/**
 * resetRegs()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.resetRegs = function()
{
    this.regSL = 0xff;          // 177774
    this.regErr = 0;            // 177766
    this.regPIR = 0;            // 177772
    this.regMMR0 = 0;           // 177572
    this.regMMR1 = 0;           // 177574
    this.regMMR2 = 0;           // 177576
    this.regMMR3 = 0;           // 172516
    this.mmuEnable = 0;         // MMU enabled for PDP11.ACCESS.READ or PDP11.ACCESS.WRITE
    this.mmuLastMode = 0;

	this.mapMMR3 = [4,2,0,1];   // map from mode to MMR3 I/D bit
    this.mmuMask = 0x3ffff;
    this.mmuMemorySize = BusPDP11.IOPAGE_18BIT;

    this.mmuPDR = [             // memory management PDR registers by mode
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // kernel 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // super 1
        [0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff], // mode 2 with illegal PDRs
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]    // user 3
    ];
    this.mmuPAR = [             // memory management PAR registers by mode
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // kernel 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // super 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // mode 2 (not used)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]    // user 3
    ];

    /** @type {Array.<InterruptEvent>} */
    this.interruptQueue = [];
    this.opFlags |= PDP11.OPFLAG.INTQ;
    this.initMemoryAccess();
};

/**
 * initMemoryAccess()
 *
 * Define handlers and DSPACE setting appropriate for the current MMU mode, in order to eliminate
 * unnecessary calls to mapVirtualToPhysical().
 *
 * TODO: We could further optimize readWordFromAddr(), splitting it into readWordFromDSpace() and
 * readWordFromISpace(), eliminating the need to OR the addrDSpace bit when we know that bit is zero,
 * but that seems like a pretty tiny optimization.
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.initMemoryAccess = function()
{
    if (this.mmuEnable) {
        this.addrDSpace = PDP11.ACCESS.DSPACE;
        this.getAddrByMode = this.getVirtualAddrByMode;
        this.readWordFromAddr = this.readWordFromVirtual;
        this.writeWordToAddr = this.writeWordToVirtual;
    } else {
        this.addrDSpace = 0;
        this.getAddrByMode = this.getPhysicalAddrByMode;
        this.readWordFromAddr = this.readWordFromPhysical;
        this.writeWordToAddr = this.writeWordToPhysical;
    }
};

/**
 * getMMR0()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getMMR0 = function()
{
    return (this.regMMR0 & 0xf381) | (this.mmuLastMode << 5) | (this.mmuLastPage << 1);
};

/**
 * setMMR0()
 *
 * @this {CPUStatePDP11}
 * @param {number} newMMR0
 * @return {number}
 */
CPUStatePDP11.prototype.setMMR0 = function(newMMR0)
{
    this.regMMR0 = newMMR0 &= 0xf381;
    this.mmuLastMode = (newMMR0 >> 5) & 3;
    this.mmuLastPage = (newMMR0 >> 1) & 0xf;
    if (newMMR0 & 0x101) {
        if (newMMR0 & 0x1) {
            this.mmuEnable = PDP11.ACCESS.READ | PDP11.ACCESS.WRITE;
        } else {
            this.mmuEnable = PDP11.ACCESS.WRITE;
        }
    } else {
        this.mmuEnable = 0;
    }
    this.initMemoryAccess();
    return this.regMMR0;
};

/**
 * getChecksum()
 *
 * @this {CPUStatePDP11}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
CPUStatePDP11.prototype.getChecksum = function()
{
    return 0;           // TODO: Implement
};

/**
 * save()
 *
 * This implements save support for the CPUStatePDP11 component.
 *
 * @this {CPUStatePDP11}
 * @return {Object|null}
 */
CPUStatePDP11.prototype.save = function()
{
    var state = new State(this);
    state.set(0, []);
    state.set(1, [this.nTotalCycles, this.getSpeed()]);
    state.set(2, this.bus.saveMemory());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the CPUStatePDP11 component.
 *
 * @this {CPUStatePDP11}
 * @param {Object} data
 * @return {boolean} true if restore successful, false if not
 */
CPUStatePDP11.prototype.restore = function(data)
{
    var a = data[1];
    this.nTotalCycles = a[1];
    this.setSpeed(a[3]);
    return this.bus.restoreMemory(data[2]);
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {CPUStatePDP11}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "AX")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
CPUStatePDP11.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var fBound = false;
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
        fBound = true;
        break;
    default:
        fBound = this.parent.setBinding.call(this, sHTMLType, sBinding, control);
        break;
    }
    return fBound;
};

/**
 * updateStatus(fForce)
 *
 * This provides periodic Control Panel updates (a few times per second; see YIELDS_PER_STATUS).
 * this is where we take care of any DOM updates (eg, register values) while the CPU is running.
 *
 * @this {CPUStatePDP11}
 * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
 */
CPUStatePDP11.prototype.updateStatus = function(fForce)
{
    if (this.cLiveRegs) {
        if (fForce || !this.flags.running || this.flags.displayLiveRegs) {
            for (var i = 0; i < this.regsGen.length; i++) {
                this.displayValue('R'+i, this.regsGen[i]);
            }
            var regPSW = this.getPSW();
            this.displayValue("PS", regPSW);
            this.displayValue("NF", (regPSW & PDP11.PSW.NF)? 1 : 0, 1);
            this.displayValue("ZF", (regPSW & PDP11.PSW.ZF)? 1 : 0, 1);
            this.displayValue("VF", (regPSW & PDP11.PSW.VF)? 1 : 0, 1);
            this.displayValue("CF", (regPSW & PDP11.PSW.CF)? 1 : 0, 1);
        }
    }
    var controlSpeed = this.bindings["speed"];
    if (controlSpeed) controlSpeed.textContent = this.getSpeedCurrent();
};

/**
 * clearCF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.clearCF = function()
{
    this.flagC = 0;
};

/**
 * getCF()
 *
 * @this {CPUStatePDP11}
 * @return {number} 0 or PDP11.PSW.CF
 */
CPUStatePDP11.prototype.getCF = function()
{
    return (this.flagC & 0x10000)? PDP11.PSW.CF: 0;
};

/**
 * setCF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.setCF = function()
{
    this.flagC = 0x10000;
};

/**
 * clearVF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.clearVF = function()
{
    this.flagV = 0;
};

/**
 * getVF()
 *
 * @this {CPUStatePDP11}
 * @return {number} 0 or PDP11.PSW.VF
 */
CPUStatePDP11.prototype.getVF = function()
{
    return (this.flagV & 0x8000)? PDP11.PSW.VF: 0;
};

/**
 * setVF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.setVF = function()
{
    this.flagV = 0x8000;
};

/**
 * clearZF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.clearZF = function()
{
    this.flagZ = 1;
};

/**
 * getZF()
 *
 * @this {CPUStatePDP11}
 * @return {number} 0 or PDP11.PSW.ZF
 */
CPUStatePDP11.prototype.getZF = function()
{
    return (this.flagZ & 0xffff)? 0 : PDP11.PSW.ZF;
};

/**
 * setZF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.setZF = function()
{
    this.flagZ = 0;
};

/**
 * clearNF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.clearNF = function()
{
    this.flagN = 0;
};

/**
 * getNF()
 *
 * @this {CPUStatePDP11}
 * @return {number} 0 or PDP11.PSW.NF
 */
CPUStatePDP11.prototype.getNF = function()
{
    return (this.flagN & 0x8000)? PDP11.PSW.NF : 0;
};

/**
 * setNF()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.setNF = function()
{
    this.flagN = 0x8000;
};

/**
 * getPC()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getPC = function()
{
    return this.regsGen[PDP11.REG.PC];
};

/**
 * getPCWord()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getPCWord = function()
{
    var data = this.readWordFromAddr(this.regsGen[PDP11.REG.PC]);
    this.advancePC(2);
    return data;
};

/**
 * advancePC(off)
 *
 * @this {CPUStatePDP11}
 * @param {number} off
 */
CPUStatePDP11.prototype.advancePC = function(off)
{
    this.regsGen[PDP11.REG.PC] = (this.regsGen[PDP11.REG.PC] + off) & 0xffff;
};

/**
 * setPC()
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 */
CPUStatePDP11.prototype.setPC = function(addr)
{
    this.regsGen[PDP11.REG.PC] = addr & 0xffff;
};

/**
 * getSP()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getSP = function()
{
    return this.regsGen[PDP11.REG.SP];
};

/**
 * setSP()
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 */
CPUStatePDP11.prototype.setSP = function(addr)
{
    this.regsGen[PDP11.REG.SP] = addr & 0xffff;
};

/**
 * interrupt(delay, priority, vector, callback)
 *
 * Interrupts are stored in a queue in delay order with the delay expressed as
 * a difference. For example if the delays were 0, 1, 0 then the first entry
 * is active and both the second and third are waiting for one more instruction
 * execution to become active.
 *
 * @this {CPUStatePDP11}
 * @param {number} delay
 * @param {number} priority
 * @param {number} vector
 * @param {function()} [callback]
 */
CPUStatePDP11.prototype.interrupt = function(delay, priority, vector, callback)
{
    var i = this.interruptQueue.length;
    while (i-- > 0) {
        if (this.interruptQueue[i].vector === vector) {
            if (i > 0) {
                this.interruptQueue[i - 1].delay += this.interruptQueue[i].delay;
            }
            this.interruptQueue.splice(i, 1);
            break;
        }
    }
    if (delay >= 0) {
        i = this.interruptQueue.length;                 // queue in delay 'difference' order
        while (i-- > 0) {
            if (this.interruptQueue[i].delay > delay) {
                this.interruptQueue[i].delay -= delay;
                break;
            }
            delay -= this.interruptQueue[i].delay;
        }
        /*
         * NOTE regarding a Google Closure Compiler "bug": if an InterruptEvent is inserted into the
         * interruptQueue with the named properties below, they will never be seen by the rest of the
         * code, because the compiler renames all other property references EXCEPT these.
         *
         *      this.interruptQueue.splice(i + 1, 0, {
         *          "delay": delay,
         *          "priority": (priority << 5) & 0xe0,
         *          "vector": vector,
         *          "callback": callback
         *      });
         *
         * Perhaps if the inlined object had been explicitly @typed, that wouldn't have happened, but
         * I'm playing it safe now: I've taken the object out-of-line, removed the quoted property names,
         * and explicitly typed it.  The compiler re-inlines the object with correctly renamed properties.
         */
        /** @type {InterruptEvent} */
        var interruptEvent = {
            delay: delay,
            priority: (priority << 5) & 0xe0,
            vector: vector,
            callback: callback
        };
        this.interruptQueue.splice(i + 1, 0, interruptEvent);
    }
    this.opFlags |= PDP11.OPFLAG.INTQ;
};

/**
 * checkInterruptQueue()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.checkInterruptQueue = function()
{
    if (this.opFlags & PDP11.OPFLAG.INTQ) {
        this.opFlags &= ~PDP11.OPFLAG.INTQ;
        var interruptEvent = null;
        var savePSW = this.regPIR & 0xe0;
        for (var i = this.interruptQueue.length; --i >= 0;) {
            if (this.interruptQueue[i].delay > 0) {
                this.interruptQueue[i].delay--;
                this.opFlags |= PDP11.OPFLAG.INTQ;
                break;          // Decrement only one delay 'difference' per cycle
            }
            if (this.interruptQueue[i].callback) {
                if (!this.interruptQueue[i].callback()) {
                    this.interruptQueue.splice(i, 1);
                    continue;
                }
                //delete
                this.interruptQueue[i].callback = null;
            }
            if (this.interruptQueue[i].priority > savePSW) {
                savePSW = this.interruptQueue[i].priority;
                interruptEvent = this.interruptQueue[i];
                this.interruptQueue.splice(i, 1);
            }
        }
        if (savePSW > (this.regPSW & 0xe0)) {
            if (this.opFlags & PDP11.OPFLAG.WAIT) {
                this.advancePC(2);
                this.opFlags &= ~PDP11.OPFLAG.WAIT;
            }
            if (!interruptEvent) {
                this.trap(PDP11.TRAP.PIRQ, PDP11.REASON.INTERRUPT);
            } else {
                this.trap(interruptEvent.vector, PDP11.REASON.INTERRUPT);
            }
        }
    }
    else if (this.opFlags & PDP11.OPFLAG.INTQ_SPL) {
        /*
         * We know that INTQ (bit 1) is clear, so since INTQ_SPL (bit 0) is set, incrementing opFlags
         * will transform INTQ_SPL into INTQ, without affecting any other (higher) bits.
         */
        this.opFlags++;
    }
};

/**
 * getPSW()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getPSW = function()
{
    /*
     * I'm not sure why this function can't simply be written as:
     *
     *      return (this.regPSW & ~PDP11.PSW.FLAGS) | (this.getNF() | this.getZF() | this.getVF() | this.getCF());
     *
     * but for now, I'm keeping the same masking logic as pdp11.js.
     */
    var mask = PDP11.PSW.CMODE | PDP11.PSW.PMODE | PDP11.PSW.REGSET | PDP11.PSW.PRI | PDP11.PSW.TF;
    return this.regPSW = (this.regPSW & mask) | this.getNF() | this.getZF() | this.getVF() | this.getCF();
};

/**
 * setPSW(newPSW)
 *
 * This updates the CPU Processor Status Word. The PSW should generally be written through
 * this routine so that changes can be tracked properly, for example the correct register set,
 * the current memory management mode, etc. An exception is SPL which writes the priority directly.
 * Note that that N, Z, V, and C flags are actually stored separately for performance reasons.
 *
 * PSW    15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
 *        CMODE PMODE RS -------- PRIORITY  T  N  Z  V  C
 *
 * @this {CPUStatePDP11}
 * @param {number} newPSW
 */
CPUStatePDP11.prototype.setPSW = function(newPSW)
{
    this.flagN = newPSW << 12;
    this.flagZ = (~newPSW) & 4;
    this.flagV = newPSW << 14;
    this.flagC = newPSW << 16;
    if ((newPSW ^ this.regPSW) & PDP11.PSW.REGSET) {
        /*
         * Swap register sets
         */
        for (var i = this.regsAlt.length; --i >= 0;) {
            var tmp = this.regsGen[i];
            this.regsGen[i] = this.regsAlt[i];
            this.regsAlt[i] = tmp;
        }
    }
    this.mmuMode = (newPSW >> PDP11.PSW.SHIFT.CMODE) & PDP11.MODE.MASK;
    var oldMode = (this.regPSW >> PDP11.PSW.SHIFT.CMODE) & PDP11.MODE.MASK;
    if (this.mmuMode != oldMode) {
        /*
         * Swap stack pointers
         */
        this.regsAltStack[oldMode] = this.regsGen[6];
        this.regsGen[6] = this.regsAltStack[this.mmuMode];
    }
    /*
     * Trigger a call to checkInterruptQueue()
     */
    this.opFlags |= PDP11.OPFLAG.INTQ;
    this.regPSW = newPSW;
};

/**
 * updateNZVFlags(result)
 *
 * NOTE: Only N and Z are updated based on the result; V is zeroed, C is unchanged.
 *
 * @this {CPUStatePDP11}
 * @param {number} result
 */
CPUStatePDP11.prototype.updateNZVFlags = function(result)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = result;
        this.flagV = 0;
    }
};

/**
 * updateNZVCFlags(result)
 *
 * NOTE: Only N and Z are updated based on the result; both V and C are simply zeroed.
 *
 * @this {CPUStatePDP11}
 * @param {number} result
 */
CPUStatePDP11.prototype.updateNZVCFlags = function(result)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = result;
        this.flagV = this.flagC = 0;
    }
};

/**
 * updateAllFlags(result, overflow)
 *
 * NOTE: The V flag is simply zeroed, unless a specific value is provided (eg, by NEG).
 *
 * @this {CPUStatePDP11}
 * @param {number} result
 * @param {number} [overflow]
 */
CPUStatePDP11.prototype.updateAllFlags = function(result, overflow)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = this.flagC = result;
        this.flagV = overflow || 0;
    }
};

/**
 * updateAddFlags(result, src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} result (dst + src)
 * @param {number} src
 * @param {number} dst
 */
CPUStatePDP11.prototype.updateAddFlags = function(result, src, dst)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = this.flagC = result;
        this.flagV = (src ^ result) & (dst ^ result);
    }
};

/**
 * updateDecFlags(result, dst)
 *
 * NOTE: We could have used updateSubFlags() if not for the fact that the C flag must be preserved.
 *
 * @this {CPUStatePDP11}
 * @param {number} result (dst - src, where src is an implied 1)
 * @param {number} dst
 */
CPUStatePDP11.prototype.updateDecFlags = function(result, dst)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = result;
        // Because src is always 1 (with a zero sign bit), it can be optimized out of this calculation
        this.flagV = (/* src ^ */ dst) & (dst ^ result);
    }
};

/**
 * updateIncFlags(result, dst)
 *
 * NOTE: We could have used updateAddFlags() if not for the fact that the C flag must be preserved.
 *
 * @this {CPUStatePDP11}
 * @param {number} result (dst + src, where src is an implied 1)
 * @param {number} dst
 */
CPUStatePDP11.prototype.updateIncFlags = function(result, dst)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = result;
        // Because src is always 1 (with a zero sign bit), it can be optimized out of this calculation
        this.flagV = (/* src ^ */ result) & (dst ^ result);
    }
};

/**
 * updateMulFlags(result)
 *
 * @this {CPUStatePDP11}
 * @param {number} result
 */
CPUStatePDP11.prototype.updateMulFlags = function(result)
{
    /*
     * NOTE: Technically, the MUL instruction doesn't need to worry about NO_FLAGS, because that instruction
     * doesn't write to the bus, and therefore can't modify the PSW directly.  But it doesn't hurt to be consistent.
     */
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = result >> 16;
        this.flagZ = this.flagN | result;
        this.flagV = 0;
        this.flagC = (result < -32768 || result > 32767)? 0x10000 : 0;
    }
};

/**
 * updateShiftFlags(result)
 *
 * @this {CPUStatePDP11}
 * @param {number} result
 */
CPUStatePDP11.prototype.updateShiftFlags = function(result)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = this.flagC = result;
        this.flagV = this.flagN ^ (this.flagC >> 1);
    }
};

/**
 * updateSubFlags(result, src, dst)
 *
 * NOTE: CMP operations calculate (src - dst) rather than (dst - src), so when they call updateSubFlags(),
 * they must reverse the order of the src and dst parameters.
 *
 * @this {CPUStatePDP11}
 * @param {number} result (dst - src)
 * @param {number} src
 * @param {number} dst
 */
CPUStatePDP11.prototype.updateSubFlags = function(result, src, dst)
{
    if (!(this.opFlags & PDP11.OPFLAG.NO_FLAGS)) {
        this.flagN = this.flagZ = this.flagC = result;
        this.flagV = (src ^ dst) & (dst ^ result);
    }
};

/**
 * panic(reason)
 *
 * TODO: Something.
 *
 * @this {CPUStatePDP11}
 * @param {number} reason
 */
CPUStatePDP11.prototype.panic = function(reason)
{
    console.log("panic(" + reason + ")");
};

/**
 * trap(vector, reason)
 *
 * trap() handles all the trap/abort functions.  It reads the trap vector from kernel
 * D space, changes mode to reflect the new PSW and PC, and then pushes the old PSW and
 * PC onto the new mode stack.
 *
 * @this {CPUStatePDP11}
 * @param {number} vector
 * @param {number} [reason] (for diagnostic purposes only)
 */
CPUStatePDP11.prototype.trap = function(vector, reason)
{
    var doubleTrap = false;

    if (this.trapPSW < 0) {
        this.trapPSW = this.getPSW();
    } else if (!this.mmuMode) {
        vector = 4;
        doubleTrap = true;
    }

    if (!(this.regMMR0 & 0xe000)) {
        this.regMMR1 = 0xf6f6;
        this.regMMR2 = vector;
    }

    /*
     * Read from kernel D space
     */
    this.mmuMode = 0;
    var newPC = this.readWordFromAddr(vector | this.addrDSpace);
    var newPSW = this.readWordFromAddr(((vector + 2) & 0xffff) | this.addrDSpace);

    /*
     * Set new PSW with previous mode
     */
    this.setPSW((newPSW & ~PDP11.PSW.PMODE) | ((this.trapPSW >> 2) & PDP11.PSW.PMODE));

    if (doubleTrap) {
        this.regErr |= PDP11.CPUERR.RED;
        this.regsGen[6] = 4;
    }

    this.pushWord(this.trapPSW);
    this.pushWord(this.regsGen[7]);
    this.setPC(newPC);

    this.opFlags &= ~PDP11.OPFLAG.TRAP_MASK;    // lose interest in traps after an abort
    this.trapPSW = -1;                          // reset flag that we have a trap within a trap

    if (DEBUG && this.dbg) {
        if (this.messageEnabled(MessagesPDP11.TRAP)) {
            this.printMessage("trap to vector " + this.dbg.toStrBase(vector, 0, true) + (reason? " (reason " + reason + ")" : ""), MessagesPDP11.TRAP, true);
        }
    }

    throw vector;
};

/**
 * trapReturn()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.trapReturn = function()
{
    /*
     * This code used to defer updating regsGen[6] (SP) until after BOTH words had been popped, which seems
     * safer, but if we're going to do pushes in trap(), then I see no reason to avoid doing pops in trapReturn().
     */
    var addr = this.popWord();
    var newPSW = this.popWord() & ~PDP11.PSW.UNUSED;
    if (this.regPSW & PDP11.PSW.CMODE) {
        /*
         * Keep SPL and allow lower only for modes and register set.
         *
         * TODO: Review, because it seems a bit odd to only CLEAR the PRI bits in the new PSW, and then to OR in
         * CMODE, PMODE, and REGSET bits from the current PSW.
         */
        newPSW = (newPSW & ~PDP11.PSW.PRI) | (this.regPSW & (PDP11.PSW.PRI | PDP11.PSW.REGSET | PDP11.PSW.PMODE | PDP11.PSW.CMODE));
    }
    this.setPC(addr);
    this.setPSW(newPSW);
    this.opFlags &= ~PDP11.OPFLAG.TRAP_TF;
};

/**
 * mapUnibus(unibusAddress)
 *
 * @this {CPUStatePDP11}
 * @param {number} unibusAddress
 * @return {number}
 */
CPUStatePDP11.prototype.mapUnibus = function(unibusAddress)
{
    var idx = (unibusAddress >> 13) & 0x1f;
    if (idx < 31) {
        if (this.regMMR3 & PDP11.MMR3.UNIBUS_MAP) {
            unibusAddress = (this.unibusMap[idx] + (unibusAddress & 0x1ffe)) & 0x3ffffe;
            if (unibusAddress >= BusPDP11.IOPAGE_UNIBUS && unibusAddress < BusPDP11.IOPAGE_22BIT) this.panic(898);
        }
    } else {
        unibusAddress |= BusPDP11.IOPAGE_22BIT;
    }
    return unibusAddress;
};

/**
 * mapVirtualToPhysical(virtualAddress, accessFlags)
 *
 * mapVirtualToPhysical() does memory management. It converts a 17 bit I/D
 * virtual address to a 22 bit physical address. A real PDP 11/70 memory management
 * unit can be enabled separately for read and write for diagnostic purposes.
 * This is handled here by having an enable mask (mmuEnable) which is tested against
 * the operation access mask (accessFlags). If there is no match then the virtual
 * address is simply mapped as a 16 bit physical address with the upper page going
 * to the IO address space.  Significant access mask values used are PDP11.ACCESS.READ
 * and PDP11.ACCESS.WRITE
 *
 * As an aside it turns out that it is the memory management unit that does odd address
 * and non-existent memory trapping: who knew? :-) I thought these would have been
 * handled at access time.
 *
 * When doing mapping, mmuMode is used to decide what address space is to be
 * used. 0 = kernel, 1 = supervisor, 2 = illegal, 3 = user. Normally, mmuMode is
 * set by the setPSW() function but there are exceptions for instructions which
 * move data between address spaces (MFPD, MFPI, MTPD, and MTPI) and trap(). These will
 * modify mmuMode outside of setPSW() and then restore it again if all worked. If
 * however something happens to cause a trap then no restore is done as setPSW()
 * will have been invoked as part of the trap, which will resynchronize mmuMode
 *
 * A PDP 11/70 is different to other PDP 11's in that the highest 18 bit space (017000000
 * & above) maps directly to UNIBUS space - including low memory. This doesn't appear to
 * be particularly useful as it restricts maximum system memory - although it does appear
 * to allow software testing of the unibus map. This feature also appears to confuse some
 * OSes which test consecutive memory locations to find maximum memory - and on a full
 * memory system find themselves accessing low memory again at high addresses.
 *
 * 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 MMR0
 * nonr leng read trap unus unus ena mnt cmp  -mode- i/d  --page--   enable
 *
 * @this {CPUStatePDP11}
 * @param {number} virtualAddress
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.mapVirtualToPhysical = function(virtualAddress, accessFlags)
{
    var page, pdr, physicalAddress, errorMask = 0;

    /*
     * Verify that 1) the incoming virtual address is within the 17-bit I/D range, 2) that
     * accessFlags is properly set, and 3) that the MMU is enabled (because non-MMU code paths
     * should no longer be going through this function; the Bus component is responsible for
     * mapping physical addresses appropriately).
     */
    this.assert(!(virtualAddress & ~0x1ffff) && accessFlags && (accessFlags & this.mmuEnable));

    this.mmuLastVirtual = virtualAddress;

    page = virtualAddress >> 13;
    if (!(this.regMMR3 & this.mapMMR3[this.mmuMode])) page &= 7;
    pdr = this.mmuPDR[this.mmuMode][page];
    physicalAddress = ((this.mmuPAR[this.mmuMode][page] << 6) + (virtualAddress & 0x1fff)) & this.mmuMask;

    if (physicalAddress < this.mmuMemorySize) {
        /*
         * I'm leaving this code here, per Paul's comments above, but it does surprisingly redundant
         * to have to perform this check here AND at the physical level (see readWordFromPhysical() and
         * writeWordToPhysical()).
         */
        if ((physicalAddress & 1) && !(accessFlags & PDP11.ACCESS.BYTE)) {
            this.regErr |= PDP11.CPUERR.ODDADDR;
            this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.ODDMEMADDR);
        }
    } else {
        if (!(this.regMMR3 & 0x10)) {
            if (physicalAddress >= BusPDP11.IOPAGE_18BIT) physicalAddress |= BusPDP11.IOPAGE_22BIT;
        }
        if (physicalAddress < BusPDP11.IOPAGE_22BIT) {
            if (physicalAddress >= BusPDP11.IOPAGE_UNIBUS) {
                physicalAddress = this.mapUnibus(physicalAddress & 0x3ffff);    // 18bit unibus space
            }
            if (physicalAddress >= this.mmuMemorySize && physicalAddress < BusPDP11.IOPAGE_22BIT) {
                this.regErr |= PDP11.CPUERR.NOMEMORY;
                this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.NOMEMORY);         // KB11-EM does this after ABORT handling - KB11-CM before
            }
        }
    }

    switch (pdr & 0x7) {
    case 1:                         // read-only with trap
        errorMask = 0x1000;         // MMU trap
        /* falls through */
    case 2:                         // read-only
        pdr |= 0x80;                // Set A bit
        if (accessFlags & PDP11.ACCESS.WRITE) {
            errorMask = 0x2000;     // read-only abort
        }
        break;
    case 4:                         // read-write with read-write trap
        errorMask = 0x1000;         // MMU trap
        /* falls through */
    case 5:                         // read-write with write trap
        if (accessFlags & PDP11.ACCESS.WRITE) {
            errorMask = 0x1000;     // MMU trap
        }
        /* falls through */
    case 6:                         // read-write: set A & W bits
        pdr |= ((accessFlags & PDP11.ACCESS.WRITE) ? 0xc0 : 0x80);
        break;
    default:
        errorMask = 0x8000;         // non-resident abort
        break;
    }

    if ((pdr & 0x7f08) !== 0x7f00) { // skip checking most common case (hopefully)
        if (pdr & 0x8) { // expand downwards
            if (pdr & 0x7f00) {
                if ((virtualAddress & 0x1fc0) < ((pdr >> 2) & 0x1fc0)) {
                    errorMask |= 0x4000; // page length error abort
                }
            }
        } else { // expand upwards
            if ((virtualAddress & 0x1fc0) > ((pdr >> 2) & 0x1fc0)) {
                errorMask |= 0x4000; // page length error abort
            }
        }
    }
    // aborts and traps: log FIRST trap and MOST RECENT abort

    this.mmuPDR[this.mmuMode][page] = pdr;
    if ((physicalAddress !== 0x3fff7a) || this.mmuMode) { // MMR0 is 017777572
        this.mmuLastMode = this.mmuMode;
        this.mmuLastPage = page;
    }
    if (errorMask) {
        if (errorMask & 0xe000) {
            if (this.trapPSW >= 0) errorMask |= 0x80; // Instruction complete
            if (!(this.regMMR0 & 0xe000)) {
                this.regMMR0 |= errorMask | (this.mmuLastMode << 5) | (this.mmuLastPage << 1);
            }
            this.trap(PDP11.TRAP.MMU_FAULT, PDP11.REASON.MAPERROR);
        }
        if (!(this.regMMR0 & 0xf000)) {
            //if (physicalAddress < 017772200 || physicalAddress > 017777677) {
            if (physicalAddress < 0x3ff480 || physicalAddress > 0x3fffbf) {
                this.regMMR0 |= 0x1000; // MMU trap flag
                if (this.regMMR0 & 0x0200) {
                    this.opFlags |= PDP11.OPFLAG.TRAP_MMU;
                }
            }
        }
    }
    return physicalAddress;
};

/**
 * readByteFromPhysical(physicalAddress)
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @return {number}
 */
CPUStatePDP11.prototype.readByteFromPhysical = function(physicalAddress)
{
    return this.bus.getByte(physicalAddress);
};

/**
 * writeByteToPhysical(physicalAddress, data)
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @param {number} data
 */
CPUStatePDP11.prototype.writeByteToPhysical = function(physicalAddress, data)
{
    if (physicalAddress & 1) this.nStepCycles--;
    this.bus.setByte(physicalAddress, data & 0xff);
};

/**
 * popWord()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.popWord = function()
{
    var result = this.readWordFromAddr(this.regsGen[6] | this.addrDSpace);
    this.regsGen[6] = (this.regsGen[6] + 2) & 0xffff;
    return result;
};

/**
 * pushWord(data)
 *
 * @this {CPUStatePDP11}
 * @param {number} data
 */
CPUStatePDP11.prototype.pushWord = function(data)
{
    var virtualAddress = (this.regsGen[6] - 2) & 0xffff;

    this.regsGen[6] = virtualAddress;           // BSD needs SP updated before any fault :-(

    if (!(this.regMMR0 & 0xe000)) {
        this.regMMR1 = (this.regMMR1 << 8) | 0xf6;
    }

    if ((!this.mmuMode) && virtualAddress <= this.regSL && virtualAddress > 4) {
        if (virtualAddress <= this.regSL - 32) {
            this.regErr |= PDP11.CPUERR.RED;
            this.regsGen[6] = 4;
            this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.PUSHERROR);
        } else {
            this.regErr |= PDP11.CPUERR.YELLOW;
            this.opFlags |= 4;
        }
    }
    this.writeWordToAddr(virtualAddress, data);
};

/**
 * getAddress(mode, reg, accessFlags)
 *
 * getAddress() maps a six bit operand to a 17 bit I/D virtual address space.
 *
 * Instruction operands are six bits in length - three bits for the mode and three
 * for the register. The 17th I/D bit in the resulting virtual address represents
 * whether the reference is to Instruction space or Data space - which depends on
 * combination of the mode and whether the register is the Program Counter (register 7).
 *
 * The eight modes are:-
 * 	    0   R           no valid virtual address
 * 	    1   (R)         operand from I/D depending if R = 7
 * 	    2   (R)+        operand from I/D depending if R = 7
 * 	    3   @(R)+       address from I/D depending if R = 7 and operand from D space
 * 	    4   -(R)        operand from I/D depending if R = 7
 * 	    5   @-(R)       address from I/D depending if R = 7 and operand from D space
 * 	    6   x(R)        x from I space but operand from D space
 * 	    7   @x(R)       x from I space but address and operand from D space
 *
 * Also need to keep MMR1 updated as this stores which registers have been
 * incremented and decremented so that the OS can reset and restart an instruction
 * if a page fault occurs.
 *
 * @this {CPUStatePDP11}
 * @param {number} mode
 * @param {number} reg
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.getAddress = function(mode, reg, accessFlags)
{
    var virtualAddress, stepSize;
    var addrDSpace = (accessFlags & PDP11.ACCESS.VIRT)? 0 : this.addrDSpace;

    /*
     * Modes that need to auto-increment or auto-decrement will break, in order to perform the
     * update; others will return an address immediately.
     */
    switch (mode) {
    /*
     * Mode 0: Registers don't have a virtual address, so trap.
     *
     * NOTE: Most instruction code paths never call getAddress() when the mode is zero;
     * JMP and JSR instructions are exceptions, but that's OK, because those are documented to
     * "cause an 'illegal' instruction" condition", which presumably means a BUS_ERROR trap.
     */
    case 0:
        this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.NOREGADDR);
        return 0;

    /*
     * Mode 1: (R)
     */
    case 1:
        if (reg === 6 && (!this.mmuMode) && (accessFlags & PDP11.ACCESS.WRITE) &&
            (this.regsGen[6] <= this.regSL || this.regsGen[6] >= 0xfffe)) {
            if (this.regsGen[6] <= this.regSL - 32 || this.regsGen[6] >= 0xfffe) {
                this.regErr |= PDP11.CPUERR.RED;
                this.regsGen[6] = 4;
                this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.STACKMODE1);
            } else {
                this.regErr |= PDP11.CPUERR.YELLOW;
                this.opFlags |= PDP11.OPFLAG.TRAP_SP;
            }
        }
        this.nStepCycles -= (2 + 1);
        return (reg === 7? this.regsGen[reg] : (this.regsGen[reg] | addrDSpace));

    /*
     * Mode 2: (R)+
     */
    case 2:
        stepSize = 2;
        virtualAddress = this.regsGen[reg];
        if (reg !== 7) {
            virtualAddress |= addrDSpace;
            if (reg < 6 && (accessFlags & PDP11.ACCESS.BYTE)) {
                stepSize = 1;
            }
        }
        this.nStepCycles -= (2 + 1);
        break;

    /*
     * Mode 3: @(R)+
     */
    case 3:
        stepSize = 2;
        virtualAddress = this.regsGen[reg];
        if (reg !== 7) virtualAddress |= addrDSpace;
        virtualAddress = this.readWordFromAddr(virtualAddress);
        // if (reg === 7) LOG_ADDRESS(virtualAddress); // @#n not operational
        virtualAddress |= addrDSpace;
        this.nStepCycles -= (5 + 2);
        break;

    /*
     * Mode 4: -(R)
     */
    case 4:
        stepSize = -2;
        if (reg < 6 && (accessFlags & PDP11.ACCESS.BYTE)) stepSize = -1;
        virtualAddress = (this.regsGen[reg] + stepSize) & 0xffff;
        if (reg !== 7) virtualAddress |= addrDSpace;
        this.nStepCycles -= (3 + 1);
        break;

    /*
     * Mode 5: @-(R)
     */
    case 5:
        stepSize = -2;
        virtualAddress = (this.regsGen[reg] - 2) & 0xffff;
        if (reg !== 7) virtualAddress |= addrDSpace;
        virtualAddress = this.readWordFromAddr(virtualAddress) | addrDSpace;
        this.nStepCycles -= (6 + 2);
        break;

    /*
     * Mode 6: d(R)
     */
    case 6:
        virtualAddress = this.getPCWord();
        virtualAddress = ((virtualAddress + this.regsGen[reg]) & 0xffff) | addrDSpace;
        this.nStepCycles -= (4 + 2);
        return virtualAddress;

    /*
     * Mode 7: @d(R)
     */
    case 7:
        virtualAddress = this.getPCWord();
        virtualAddress = (virtualAddress + this.regsGen[reg]) & 0xffff;
        virtualAddress = this.readWordFromAddr(virtualAddress | this.addrDSpace) | addrDSpace;
        this.nStepCycles -= (7 + 3);
        return virtualAddress;
    }

    this.regsGen[reg] = (this.regsGen[reg] + stepSize) & 0xffff;

    if (addrDSpace && !(this.regMMR0 & 0xe000)) {
        this.regMMR1 = (this.regMMR1 << 8) | ((stepSize << 3) & 0xf8) | reg;
    }

    if (reg == 6 && (!this.mmuMode) && (accessFlags & PDP11.ACCESS.WRITE) && stepSize <= 0 && (this.regsGen[6] <= this.regSL || this.regsGen[6] >= 0xfffe)) {
        if (this.regsGen[6] <= this.regSL - 32) {
            this.regErr |= PDP11.CPUERR.RED;
            this.regsGen[6] = 4;
            this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.STACKERROR);
        } else {
            this.regErr |= PDP11.CPUERR.YELLOW;
            this.opFlags |= PDP11.OPFLAG.TRAP_SP;
        }
    }
    return virtualAddress;
};

/**
 * getPhysicalAddrByMode(mode, reg, accessFlags)
 *
 * This is a handler set up by initMemoryAccess().  All calls should go through getAddrByMode().
 *
 * @this {CPUStatePDP11}
 * @param {number} mode
 * @param {number} reg
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.getPhysicalAddrByMode = function(mode, reg, accessFlags)
{
    return this.getAddress(mode, reg, accessFlags);
};

/**
 * getVirtualAddrByMode(mode, reg, accessFlags)
 *
 * This is a handler set up by initMemoryAccess().  All calls should go through getAddrByMode().
 *
 * @this {CPUStatePDP11}
 * @param {number} mode
 * @param {number} reg
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.getVirtualAddrByMode = function(mode, reg, accessFlags)
{
    return this.mapVirtualToPhysical(this.getAddress(mode, reg, accessFlags), accessFlags);
};

/**
 * readWordFromPhysical(physicalAddress)
 *
 * This is a handler set up by initMemoryAccess().  All calls should go through readWordFromAddr().
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @return {number}
 */
CPUStatePDP11.prototype.readWordFromPhysical = function(physicalAddress)
{
    if (physicalAddress & 0x1) {
        this.regErr |= PDP11.CPUERR.ODDADDR;
        this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.ODDMEMADDR);
    }
    return this.bus.getWord(physicalAddress);
};

/**
 * readWordFromVirtual(virtualAddress)
 *
 * This is a handler set up by initMemoryAccess().  All calls should go through readWordFromAddr().
 *
 * @this {CPUStatePDP11}
 * @param {number} virtualAddress (input address is 17 bit (I&D))
 * @return {number}
 */
CPUStatePDP11.prototype.readWordFromVirtual = function(virtualAddress)
{
    return this.readWordFromPhysical(this.mapVirtualToPhysical(virtualAddress, PDP11.ACCESS.READ_WORD));
};

/**
 * writeWordToPhysical(physicalAddress, data)
 *
 * This is a handler set up by initMemoryAccess().  All calls should go through writeWordToAddr().
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @param {number} data
 */
CPUStatePDP11.prototype.writeWordToPhysical = function(physicalAddress, data)
{
    if (physicalAddress & 0x1) {
        this.regErr |= PDP11.CPUERR.ODDADDR;
        this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.ODDMEMADDR);
    }
    this.bus.setWord(physicalAddress, data & 0xffff);
};

/**
 * writeWordToVirtual(virtualAddress, data)
 *
 * This is a handler set up by initMemoryAccess().  All calls should go through writeWordToAddr().
 *
 * @this {CPUStatePDP11}
 * @param {number} virtualAddress (input address is 17 bit (I&D))
 * @param {number} data
 */
CPUStatePDP11.prototype.writeWordToVirtual = function(virtualAddress, data)
{
    this.writeWordToPhysical(this.mapVirtualToPhysical(virtualAddress | PDP11.ACCESS.DSPACE, PDP11.ACCESS.WRITE_WORD), data);
};

/**
 * readWordFromPrevSpace(opCode, accessFlags)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} accessFlags (really just PDP11.ACCESS.DSPACE or PDP11.ACCESS.ISPACE)
 * @return {number}
 */
CPUStatePDP11.prototype.readWordFromPrevSpace = function(opCode, accessFlags)
{
    var src;
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        if (reg != 6 || ((this.regPSW >> 2) & PDP11.PSW.PMODE) === (this.regPSW & PDP11.PSW.PMODE)) {
            src = this.regsGen[reg];
        } else {
            src = this.regsAltStack[(this.regPSW >> 12) & 3];
        }
    } else {
        var addr = this.getAddress(mode, reg, PDP11.ACCESS.READ_WORD);
        if (!(accessFlags & PDP11.ACCESS.DSPACE)) {
            if ((this.regPSW & 0xf000) !== 0xf000) addr &= 0xffff;
        }
        this.mmuMode = (this.regPSW >> 12) & 3;
        src = this.readWordFromAddr(addr | (accessFlags & this.addrDSpace));
        this.mmuMode = (this.regPSW >> 14) & 3;
    }
    return src;
};

/**
 * writeWordToPrevSpace(opCode, accessFlags, data)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} accessFlags (really just PDP11.ACCESS.DSPACE or PDP11.ACCESS.ISPACE)
 * @param {number} data
 */
CPUStatePDP11.prototype.writeWordToPrevSpace = function(opCode, accessFlags, data)
{
    if (!(this.regMMR0 & 0xe000)) {
        this.regMMR1 = 0x16;
    }
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        if (reg != 6 || ((this.regPSW >> 2) & PDP11.PSW.PMODE) === (this.regPSW & PDP11.PSW.PMODE)) {
            this.regsGen[reg] = data;
        } else {
            this.regsAltStack[(this.regPSW >> 12) & 3] = data;
        }
    } else {
        var addr = this.getAddress(mode, reg, PDP11.ACCESS.WRITE_WORD);
        if (!(accessFlags & PDP11.ACCESS.DSPACE)) addr &= 0xffff;
        /*
         * TODO: Consider replacing the following code with writeWordToAddr(), by adding optional mmuMode
         * parameters for each of the discrete mapVirtualToPhysical() and writeWordToPhysical() operations,
         * because as it stands, this is the only remaining call to mapVirtualToPhysical() outside of our
         * initMemoryAccess() handlers.
         */
        this.mmuMode = (this.regPSW >> 12) & 3;
        addr = this.mapVirtualToPhysical(addr | (accessFlags & PDP11.ACCESS.DSPACE), PDP11.ACCESS.WRITE);
        this.mmuMode = (this.regPSW >> 14) & 3;
        this.writeWordToPhysical(addr, data);
    }
};

/**
 * readSrcByte(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @return {number}
 */
CPUStatePDP11.prototype.readSrcByte = function(opCode)
{
    var result;
    opCode >>= PDP11.SRCMODE.SHIFT;
    var reg = this.srcReg = opCode & PDP11.OPREG.MASK;
    var mode = this.srcMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        result = this.regsGen[reg] & 0xff;
    } else {
        result = this.readByteFromPhysical(this.getAddrByMode(mode, reg, PDP11.ACCESS.READ_BYTE));
    }
    return result;
};

/**
 * readSrcWord(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @return {number}
 */
CPUStatePDP11.prototype.readSrcWord = function(opCode)
{
    var result;
    opCode >>= PDP11.SRCMODE.SHIFT;
    var reg = this.srcReg = opCode & PDP11.OPREG.MASK;
    var mode = this.srcMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        result = this.regsGen[reg];
    } else {
        result = this.readWordFromPhysical(this.getAddrByMode(mode, reg, PDP11.ACCESS.READ_WORD));
    }
    return result;
};

/**
 * readDstAddr(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @return {number}
 */
CPUStatePDP11.prototype.readDstAddr = function(opCode)
{
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    return this.getAddress(mode, reg, PDP11.ACCESS.VIRT);
};

/**
 * readDstByte(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @return {number}
 */
CPUStatePDP11.prototype.readDstByte = function(opCode)
{
    var result;
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        result = this.regsGen[reg] & 0xff;
    } else {
        result = this.readByteFromPhysical(this.getAddrByMode(mode, reg, PDP11.ACCESS.READ_BYTE));
    }
    return result;
};

/**
 * readDstWord(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @return {number}
 */
CPUStatePDP11.prototype.readDstWord = function(opCode)
{
    var result;
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        result = this.regsGen[reg];
    } else {
        result = this.readWordFromPhysical(this.getAddrByMode(mode, reg, PDP11.ACCESS.READ_WORD));
    }
    return result;
};

/**
 * updateDstByte(opCode, src, fnOp)
 *
 * Used whenever the dst operand (as described by opCode) needs to be read before writing.
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} src
 * @param {function(number,number)} fnOp
 */
CPUStatePDP11.prototype.updateDstByte = function(opCode, src, fnOp)
{
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        this.regsGen[reg] = (this.regsGen[reg] & 0xff00) | fnOp.call(this, src, this.regsGen[reg]);
    } else {
        var addr = this.dstAddr = this.getAddrByMode(mode, reg, PDP11.ACCESS.UPDATE_BYTE);
        this.writeByteToPhysical(addr, fnOp.call(this, src, this.readByteFromPhysical(addr)));
    }
};

/**
 * updateDstWord(opCode, src, fnOp)
 *
 * Used whenever the dst operand (as described by opCode) needs to be read before writing.
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} src
 * @param {function(number,number)} fnOp
 */
CPUStatePDP11.prototype.updateDstWord = function(opCode, src, fnOp)
{
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        this.regsGen[reg] = fnOp.call(this, src, this.regsGen[reg]);
    } else {
        var addr = this.getAddrByMode(mode, reg, PDP11.ACCESS.UPDATE_WORD);
        this.writeWordToPhysical(addr, fnOp.call(this, src, this.readWordFromPhysical(addr)));
    }
};

/**
 * writeDstByte(opCode, data, writeFlags)
 *
 * Used whenever the dst operand (as described by opCode) does NOT need to be read before writing.
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} data
 * @param {number} [writeFlags]
 * @return {number}
 */
CPUStatePDP11.prototype.writeDstByte = function(opCode, data, writeFlags)
{
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        if (!data) {
            this.regsGen[reg] &= ~0xff; // TODO: Profile to determine if this is a win
        } else if (writeFlags & PDP11.WRITE.SIGNEXT) {
            this.regsGen[reg] = ((data << 24) >> 24) & 0xffff;
        } else {
            this.regsGen[reg] = (this.regsGen[reg] & ~0xff) | (data & 0xff);
        }
    } else {
        this.writeByteToPhysical(this.getAddrByMode(mode, reg, PDP11.ACCESS.WRITE_BYTE), data);
    }
    return data;
};

/**
 * writeDstWord(opCode, data)
 *
 * Used whenever the dst operand (as described by opCode) does NOT need to be read before writing.
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} data
 * @return {number}
 */
CPUStatePDP11.prototype.writeDstWord = function(opCode, data)
{
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        this.regsGen[reg] = data & 0xffff;
    } else {
        this.writeWordToPhysical(this.getAddrByMode(mode, reg, PDP11.ACCESS.WRITE_WORD), data);
    }
    return data;
};

/**
 * branch(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {boolean|number} condition
 */
CPUStatePDP11.prototype.branch = function(opCode, condition)
{
    if (condition) {
        this.setPC(this.getPC() + ((opCode << 24) >> 23));
        this.nStepCycles -= 2;
    }
    this.nStepCycles -= (2 + 1);
};

/**
 * stepCPU(nMinCycles)
 *
 * NOTE: Single-stepping should not be confused with the Trap flag; single-stepping is a Debugger
 * operation that's completely independent of Trap status.  The CPU can go in and out of Trap mode,
 * in and out of h/w interrupt service routines (ISRs), etc, but from the Debugger's perspective,
 * they're all one continuous stream of instructions that can be stepped or run at will.  Moreover,
 * stepping vs. running should never change the behavior of the simulation.
 *
 * @this {CPUStatePDP11}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates a pre-execution condition (ie, an execution breakpoint
 * was hit), -1 indicates a post-execution condition (eg, a read or write breakpoint was hit), and a positive
 * number indicates successful completion of that many cycles (which should always be >= nMinCycles).
 */
CPUStatePDP11.prototype.stepCPU = function(nMinCycles)
{
    /*
     * The Debugger uses fComplete to determine if the instruction completed (true) or was interrupted
     * by a breakpoint or some other exceptional condition (false).  NOTE: this does NOT include JavaScript
     * exceptions, which stepCPU() expects the caller to catch using its own exception handler.
     *
     * The CPU relies on the use of stopCPU() rather than fComplete, because the CPU never single-steps
     * (ie, nMinCycles is always some large number), whereas the Debugger does.  And conversely, when the
     * Debugger is single-stepping (even when performing multiple single-steps), fRunning is never set,
     * so stopCPU() would have no effect as far as the Debugger is concerned.
     */
    this.flags.complete = true;

    /*
     * fDebugCheck is true if we need to "check" every instruction with the Debugger.
     */
    var fDebugCheck = this.flags.debugCheck = (DEBUGGER && this.dbg && this.dbg.checksEnabled());

    /*
     * nDebugState is checked only when fDebugCheck is true, and its sole purpose is to tell the first call
     * to checkInstruction() that it can skip breakpoint checks, and that will be true ONLY when fStarting is
     * true OR nMinCycles is zero (the latter means the Debugger is single-stepping).
     *
     * Once we snap fStarting, we clear it, because technically, we've moved beyond "starting" and have
     * officially "started" now.
     */
    var nDebugState = (!nMinCycles)? -1 : (this.flags.starting? 0 : 1);
    this.flags.starting = false;

    /*
     * We move the minimum cycle count to nStepCycles (the number of cycles left to step), so that other
     * functions have the ability to force that number to zero (eg, stopCPU()), and thus we don't have to check
     * any other criteria to determine whether we should continue stepping or not.
     */
    this.nBurstCycles = this.nStepCycles = nMinCycles;

    do {
        if (DEBUGGER && fDebugCheck) {
            if (this.dbg.checkInstruction(this.getPC(), nDebugState)) {
                this.stopCPU();
                break;
            }
            nDebugState = 1;
        }

        if (this.opFlags) {
            /*
             * Check for any pending traps.
             *
             * I've moved this TRAP_MASK check BEFORE we decode the next instruction instead
             * of immediately AFTER, because the last instruction may have thrown an exception,
             * kicking us out before we reach the bottom of this loop.
             */
            if (this.opFlags & PDP11.OPFLAG.TRAP_MASK) {
                if (this.opFlags & PDP11.OPFLAG.TRAP_MMU) {
                    this.trap(PDP11.TRAP.MMU_FAULT, PDP11.REASON.TRAPMMU);          // MMU trap has priority
                } else {
                    if (this.opFlags & PDP11.OPFLAG.TRAP_SP) {
                        this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.TRAPSP);       // then SP trap
                    } else {
                        if (this.opFlags & PDP11.OPFLAG.TRAP_TF) {
                            this.trap(PDP11.TRAP.BREAKPOINT, PDP11.REASON.TRAPTF);  // and finally a TF trap
                        }
                    }
                }
                this.opFlags &= ~PDP11.OPFLAG.TRAP_MASK;
            }
            /*
             * If we're in the INTQ or WAIT state, see if any interrupts can kick us out of that state.
             *
             * By also requiring nMinCycles to be non-zero before checking the interrupt queue, we avoid
             * interrupting the natural flow of instructions whenever the Debugger is stepping through code.
             */
            if ((this.opFlags & (PDP11.OPFLAG.INTQ_SPL | PDP11.OPFLAG.INTQ | PDP11.OPFLAG.WAIT)) /*&& nMinCycles*/) {
                this.checkInterruptQueue();
            }
        }

        if (!(this.regMMR0 & PDP11.MMR0.ABORT)) {
            this.regMMR1 = 0;
            this.regMMR2 = this.regsGen[7];
        }

        /*
         * Snapshot the TF bit in opFlags, while clearing all other opFlags (except those in PRESERVE);
         * we'll check the TRAP_TF bit in opFlags when we come back around for another opcode.
         */
        this.opFlags = (this.opFlags & PDP11.OPFLAG.PRESERVE) | (this.regPSW & PDP11.PSW.TF);

        this.decode(this.getPCWord());

    } while (this.nStepCycles > 0);

    return (this.flags.complete? this.nBurstCycles - this.nStepCycles : (this.flags.complete === undefined? 0 : -1));
};

/**
 * CPUStatePDP11.init()
 *
 * This function operates on every HTML element of class "cpu", extracting the
 * JSON-encoded parameters for the CPUStatePDP11 constructor from the element's "data-value"
 * attribute, invoking the constructor (which in turn invokes the CPU constructor)
 * to create a CPUStatePDP11 component, and then binding any associated HTML controls to the
 * new component.
 */
CPUStatePDP11.init = function()
{
    var aeCPUs = Component.getElementsByClass(document, PDP11.APPCLASS, "cpu");
    for (var iCPU = 0; iCPU < aeCPUs.length; iCPU++) {
        var eCPU = aeCPUs[iCPU];
        var parmsCPU = Component.getComponentParms(eCPU);
        var cpu = new CPUStatePDP11(parmsCPU);
        Component.bindComponentControls(cpu, eCPU, PDP11.APPCLASS);
    }
};

/*
 * Initialize every CPU module on the page
 */
web.onInit(CPUStatePDP11.init);

if (NODE) module.exports = CPUStatePDP11;
