/**
 * @fileoverview Implements the PDP11 CPU component.
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
 *      addrReset: reset address (default is 0)
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
    this.addrReset = parmsCPU['addrReset'] || 0;

    var nCyclesDefault = 0;
    switch(this.model) {
    case PDP11.MODEL_1170:
    default:
        nCyclesDefault = 6666667;
        break;
    }

    CPUPDP11.call(this, parmsCPU, nCyclesDefault);

    /*
     * Initialize processor operation to match the requested model
     */
    this.initProcessor();
}

Component.subclass(CPUStatePDP11, CPUPDP11);

/*
 * Overview of Device Interrupt Support
 *
 * Originally, the CPU maintained a queue of requested interrupts.  Entries in this queue recorded a device's
 * priority, vector, and delay (ie, a number of instructions to execute before dispatching the interrupt).  This
 * queue would constantly grow and shrink as requests were issued and dispatched, and as long as there was something
 * in the queue, the CPU was constantly examining it.
 *
 * Now we are trying something more efficient.  First, for devices that require delays (like a serial port's receiver
 * and transmitter buffer registers that are supposed to "clock" the data in and out at a specific baud rate), the
 * CPU offers timer services that will "fire" a callback after a specified delay, which are much more efficient than
 * requiring the CPU to dive into an interrupt queue and decrement delay counts on every instruction.
 *
 * Second, devices that generate interrupts will allocate a trigger object during initialization; we will no longer
 * be creating and destroying interrupt event objects and inserting/deleting them in a constantly changing queue.  Each
 * trigger contains properties that never change (eg, the vector and priority), along with a "next" pointer that's
 * only used when the trigger is active.
 *
 * When a device decides it's time to interrupt (either at the end of some I/O operation or when a timer has "fired"),
 * it will simply "pull the trigger", which basically means that its trigger will be linked onto a list of active
 * triggers, and in priority order, so that when the CPU is ready to acknowledge interrupts, it need only check the
 * top of the active trigger list.
 */

/**
 * @typedef {{
 *  vector: number,
 *  priority: number,
 *  next: (Trigger|null)
 * }} Trigger
 */
var Trigger;

/**
 * initProcessor()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.initProcessor = function()
{
    if (this.model == PDP11.MODEL_1120) {
        this.decode = PDP11.op1120.bind(this);
    } else {
        this.decode = PDP11.op1145.bind(this);
    }

    this.initRegs();

    this.nDisableTraps = 0;

    /** @type {Trigger|null} */
    this.triggerNext = null;            // the head of the active triggers list, in priority order

    if (DEBUG) {
        /** @type {Array.<Trigger>} */
        this.aTriggers = [];            // list of all triggers, active or not (just for debugging)
    }

    this.flags.complete = false;
};

/**
 * reset()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.reset = function()
{
    this.status("model " + this.model);
    if (this.flags.running) this.stopCPU();
    this.initRegs();
    this.resetCycles();
    this.clearError();                  // clear any fatal error/exception that setError() may have flagged
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
        0, 0, 0, 0, 0, 0, 0, this.addrReset
    ];
    this.regsAlt = [            // Alternate R0 - R5
        0, 0, 0, 0, 0, 0
    ];
    this.regsAltStack = [       // Alternate R6 stack pointers (KERNEL, SUPER, illegal, USER)
        0, 0, 0, 0
    ];
    this.mmuMode = 0;           // current memory management mode (see PDP11.MODE.KERNEL | SUPER | UNUSED | USER)
    this.mmuLastPage = 0;
    this.mmuLastVirtual = 0;
	this.mapMMR3 = [4,2,0,1];   // map from mode to MMR3 I/D bit
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
    this.unibusMap = [          // 32 unibus map registers
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.regsControl = [        // various control registers (177740-177756) we don't really care about
        0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.regMB = 0;

    /*
     * opFlags contains various conditions that stepCPU() needs to be aware of.
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

    this.trapPSW = -1;
    this.resetMMU();
};

/**
 * resetCPU()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.resetCPU = function()
{
    this.bus.reset();
    this.resetMMU();
};

/**
 * resetMMU()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.resetMMU = function()
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
    this.mmuMask = 0x3ffff;

    this.lastAI = 0;            // last auto-incs and/or auto-decs; this gets propagated to MMR1
    this.lastPC = 0;            // last PC at the time of getOpcode(); this get propagated to MMR2

    this.resetTriggers();

    if (this.bus) this.setMemoryAccess();
};

/**
 * setMemoryAccess()
 *
 * Define handlers and DSPACE setting appropriate for the current MMU mode, in order to eliminate
 * unnecessary calls to mapVirtualToPhysical().
 *
 * TODO: We could further optimize readWord(), splitting it into readWordFromDSpace() and readWordFromISpace(),
 * eliminating the need to OR the addrDSpace bit when we know that bit is zero, but that's a pretty tiny optimization.
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.setMemoryAccess = function()
{
    if (this.mmuEnable) {
        this.addrDSpace = PDP11.ACCESS.DSPACE;
        this.getAddr = this.getVirtualAddrByMode;
        this.readWord = this.readWordFromVirtual;
        this.writeWord = this.writeWordToVirtual;
        this.bus.setIOPageRange((this.regMMR3 & PDP11.MMR3.MMU_22BIT)? 22 : 18);
    } else {
        this.addrDSpace = 0;
        this.getAddr = this.getPhysicalAddrByMode;
        this.readWord = this.readWordFromPhysical;
        this.writeWord = this.writeWordToPhysical;
        this.bus.setIOPageRange(16);
    }
};

/**
 * getMMR0()
 *
 * 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 MMR0
 * nonr leng read trap unus unus ena mnt cmp  -mode- i/d  --page--   enable
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
 */
CPUStatePDP11.prototype.setMMR0 = function(newMMR0)
{
    newMMR0 &= 0xf381;
    if (this.regMMR0 != newMMR0) {
        this.regMMR0 = newMMR0;
        this.mmuLastMode = (newMMR0 >> 5) & 3;
        this.mmuLastPage = (newMMR0 >> 1) & 0xf;
        var mmuEnable = 0;
        if (newMMR0 & 0x101) {
            mmuEnable = PDP11.ACCESS.WRITE;
            if (newMMR0 & 0x1) {
                mmuEnable |= PDP11.ACCESS.READ;
            }
        }
        if (this.mmuEnable != mmuEnable) {
            this.mmuEnable = mmuEnable;
            this.setMemoryAccess();
        }
    }
};

/**
 * getMMR1()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getMMR1 = function()
{
    if (!(this.regMMR0 & PDP11.MMR0.ABORT)) {
        this.regMMR1 = this.lastAI & 0xffff;
    }
    var result = this.regMMR1;
    if (result & 0xff00) {
        result = ((result << 8) | (result >> 8)) & 0xffff;
    }
    return result;
};

/**
 * getMMR2()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getMMR2 = function()
{
    if (!(this.regMMR0 & PDP11.MMR0.ABORT)) {
        this.regMMR2 = this.lastPC;
    }
    return this.regMMR2;
};

/**
 * getMMR3()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getMMR3 = function()
{
    return this.regMMR3;
};

/**
 * setMMR3()
 *
 * @this {CPUStatePDP11}
 * @param {number} newMMR3
 */
CPUStatePDP11.prototype.setMMR3 = function(newMMR3)
{
    /*
     * Don't allow the 11/45 to use 22-bit addressing or the UNIBUS map
     */
    if (this.model < PDP11.MODEL_1170) {
        newMMR3 &= ~(PDP11.MMR3.MMU_22BIT | PDP11.MMR3.UNIBUS_MAP);
    }
    if (this.regMMR3 != newMMR3) {
        this.regMMR3 = newMMR3;
        this.mmuMask = (newMMR3 & PDP11.MMR3.MMU_22BIT)? 0x3fffff : 0x3ffff;
        this.setMemoryAccess();
    }
};

/**
 * setReset(addr, fReset)
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 * @param {boolean} [fReset] (true if called in the context of a complete reset, obviating the need to notify the Debugger)
 */
CPUStatePDP11.prototype.setReset = function(addr, fReset)
{
    this.addrReset = addr;

    this.resetCPU();
    this.setPC(addr);
    this.setPSW(0);

    if (!fReset && this.dbg) {
        /*
         * TODO: Review the decision to always stop the CPU if the Debugger is loaded.  Note that
         * when stopCPU() stops a running CPU, the Debugger gets notified, so again, no need to notify it here.
         *
         * TODO: There are more serious problems to deal with if another component is slamming a new PC down
         * the CPU's throat (presumably while also dropping some new code into RAM) while the CPU was still running;
         * we should probably force a complete reset if the CPU is running, but for now, it's up to the user
         * to hit the reset button themselves.
         */
        if (!this.stopCPU()) this.dbg.updateStatus();
    }
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
 * getOpcode()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getOpcode = function()
{
    var pc = this.regsGen[PDP11.REG.PC];
    this.lastAI = 0;
    this.lastPC = pc;
    /*
     * If PC is unaligned, a BUS trap will be generated, and because it will generate an
     * exception, the next line (the equivalent of advancePC(2)) will not be executed, ensuring that
     * original unaligned PC will be pushed onto the stack by trap().
     */
    var op = this.readWord(pc);
    this.regsGen[PDP11.REG.PC] = (pc + 2) & 0xffff;
    return op;
};

/**
 * advancePC(off)
 *
 * NOTE: This function is nothing more than a convenience, and we fully expect it to be inlined at runtime.
 *
 * @this {CPUStatePDP11}
 * @param {number} off
 * @return {number} (original PC)
 */
CPUStatePDP11.prototype.advancePC = function(off)
{
    var pc = this.regsGen[PDP11.REG.PC];
    this.regsGen[PDP11.REG.PC] = (pc + off) & 0xffff;
    return pc;
};

/**
 * getPC()
 *
 * NOTE: This function is nothing more than a convenience, and we fully expect it to be inlined at runtime.
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getPC = function()
{
    return this.regsGen[PDP11.REG.PC];
};

/**
 * getLastPC()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getLastPC = function()
{
    return this.lastPC;
};

/**
 * setPC()
 *
 * NOTE: Unlike other PCjs emulators, such as PCx86, where all PC updates MUST go through the setPC()
 * function, this function is nothing more than a convenience, because in the PDP-11, the PC can be loaded
 * like any other general register.  We fully expect this function to be inlined at runtime.
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
 * NOTE: This function is nothing more than a convenience, and we fully expect it to be inlined at runtime.
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
 * NOTE: Unlike other PCjs emulators, such as PCx86, where all SP updates MUST go through the setSP()
 * function, this function is nothing more than a convenience, because in the PDP-11, the PC can be loaded
 * like any other general register.  We fully expect this function to be inlined at runtime.
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 */
CPUStatePDP11.prototype.setSP = function(addr)
{
    this.regsGen[PDP11.REG.SP] = addr & 0xffff;
};

/**
 * addTrigger(vector, priority)
 *
 * @this {CPUStatePDP11}
 * @param {number} vector
 * @param {number} priority
 * @return {Trigger}
 */
CPUStatePDP11.prototype.addTrigger = function(vector, priority)
{
    var trigger = {vector: vector, priority: priority, next: null};
    if (DEBUG) this.aTriggers.push(trigger);
    return trigger;
};

/**
 * insertTrigger(trigger)
 *
 * @this {CPUStatePDP11}
 * @param {Trigger} trigger
 */
CPUStatePDP11.prototype.insertTrigger = function(trigger)
{
    if (trigger != this.triggerNext) {
        var triggerPrev = this.triggerNext;
        if (!triggerPrev || triggerPrev.priority <= trigger.priority) {
            trigger.next = triggerPrev;
            this.triggerNext = trigger;
        } else {
            do {
                var triggerNext = triggerPrev.next;
                if (!triggerNext || triggerNext.priority <= trigger.priority) {
                    trigger.next = triggerNext;
                    triggerPrev.next = trigger;
                    break;
                }
                triggerPrev = triggerNext;
            } while (triggerPrev);
        }
    }
};

/**
 * removeTrigger(trigger)
 *
 * @this {CPUStatePDP11}
 * @param {Trigger} trigger
 */
CPUStatePDP11.prototype.removeTrigger = function(trigger)
{
    var triggerPrev = this.triggerNext;
    if (triggerPrev == trigger) {
        this.triggerNext = trigger.next;
    } else {
        while (triggerPrev) {
            var triggerNext = triggerPrev.next;
            if (triggerNext == trigger) {
                triggerPrev.next = triggerNext.next;
                break;
            }
            triggerPrev = triggerNext;
        }
    }
    // We could also set trigger.next to null now, but strictly speaking, that shouldn't be necessary.
};

/**
 * setTrigger(trigger)
 *
 * @this {CPUStatePDP11}
 * @param {Trigger} trigger
 * @return {boolean} (true if interrupt dispatched, false if not)
 */
CPUStatePDP11.prototype.setTrigger = function(trigger)
{
    this.insertTrigger(trigger);
    /*
     * See the writeXCSR() function for an explanation of why signalling an INTQ hardware interrupt condition
     * should be done using INTQ_DELAY rather than setting INTQ directly.
     */
    this.opFlags |= PDP11.OPFLAG.INTQ_DELAY;
    return false;
};

/**
 * checkTriggers(priority)
 *
 * @this {CPUStatePDP11}
 * @param {number} priority
 * @return {Trigger|null}
 */
CPUStatePDP11.prototype.checkTriggers = function(priority)
{
    return (this.triggerNext && this.triggerNext.priority > priority)? this.triggerNext : null;
};

/**
 * resetTriggers(priority)
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.resetTriggers = function()
{
    this.triggerNext = null;
};

/**
 * checkInterrupts()
 *
 * @this {CPUStatePDP11}
 * @return {boolean} true if an interrupt was dispatched, false if not
 */
CPUStatePDP11.prototype.checkInterrupts = function()
{
    var fInterrupt = false;

    if (this.opFlags & PDP11.OPFLAG.INTQ) {
        this.opFlags &= ~PDP11.OPFLAG.INTQ;

        var vector = PDP11.TRAP.PIRQ;
        var priority = (this.regPIR & PDP11.PSW.PRI) >> PDP11.PSW.SHIFT.PRI;

        var trigger = this.checkTriggers(priority);
        if (trigger) {
            vector = trigger.vector;
            priority = trigger.priority;
        }

        if (this.dispatchInterrupt(vector, priority)) {
            if (trigger) this.removeTrigger(trigger);
            fInterrupt = true;
        }
    }
    else if (this.opFlags & PDP11.OPFLAG.INTQ_DELAY) {
        /*
         * We know that INTQ (bit 1) is clear, so since INTQ_DELAY (bit 0) is set, incrementing opFlags
         * will transform INTQ_DELAY into INTQ, without affecting any other (higher) bits.
         */
        this.opFlags++;
    }
    return fInterrupt;
};

/**
 * dispatchInterrupt(vector, priority)
 *
 * TODO: The process of dispatching an interrupt MUST cost some cycles; either trap() needs to assess
 * that cost, or we do.
 *
 * @this {CPUStatePDP11}
 * @param {number} vector
 * @param {number} priority
 * @return {boolean} (true if dispatched, false if not)
 */
CPUStatePDP11.prototype.dispatchInterrupt = function(vector, priority)
{
    var priorityCPU = (this.regPSW & PDP11.PSW.PRI) >> PDP11.PSW.SHIFT.PRI;
    if (priority > priorityCPU) {
        if (this.opFlags & PDP11.OPFLAG.WAIT) {
            this.advancePC(2);
            this.opFlags &= ~PDP11.OPFLAG.WAIT;
        }
        this.trap(vector, 0, PDP11.REASON.INTERRUPT);
        return true;
    }
    return false;
};

/**
 * checkTraps()
 *
 * NOTE: The following code processes these "deferred" traps in priority order.  Unfortunately, that
 * order seems to have changed since the 11/20.  For reference, here's the priority list for the 11/20:
 *
 *      1. Bus Errors
 *      2. Instruction Traps
 *      3. Trace Trap
 *      4. Stack Overflow Trap
 *      5. Power Failure Trap
 *
 * and for the 11/70:
 *
 *      1. HALT (Instruction, Switch, or Command)
 *      2. MMU Faults
 *      3. Parity Errors
 *      4. Bus Errors (including stack overflow traps?)
 *      5. Floating Point Traps
 *      6. TRAP Instruction
 *      7. TRACE Trap
 *      8. OVFL Trap
 *      9. Power Fail Trap
 *     10. Console Bus Request (Front Panel Operation)
 *     11. PIR 7, BR 7, PIR 6, BR 6, PIR 5, BR 5, PIR 4, BR 4, PIR 3, BR 3, PIR 2, PIR 1
 *     12. WAIT Loop
 *
 * TODO: Determine 1) if the 11/20 Handbook was wrong, or 2) if the 11/70 really has different priorities.
 *
 * Also, as the PDP-11/20 Handbook (1971), p.100, notes:
 *
 *      If a bus error is caused by the trap process handling instruction traps, trace traps, stack overflow
 *      traps, or a previous bus error, the processor is halted.
 *
 *      If a stack overflow is caused by the trap process in handling bus errors, instruction traps, or trace traps,
 *      the process is completed and then the stack overflow trap is sprung.
 *
 * TODO: Based on the above notes, we should probably be halting the CPU when a bus error occurs during a trap.
 *
 * @this {CPUStatePDP11}
 * @return {boolean} (true if dispatched, false if not)
 */
CPUStatePDP11.prototype.checkTraps = function()
{
    if (this.opFlags & PDP11.OPFLAG.TRAP_MMU) {
        this.trap(PDP11.TRAP.MMU, PDP11.OPFLAG.TRAP_MMU, PDP11.REASON.FAULT);
        return true;
    }
    if (this.opFlags & PDP11.OPFLAG.TRAP_SP) {
        this.trap(PDP11.TRAP.BUS, PDP11.OPFLAG.TRAP_SP, PDP11.REASON.YELLOW);
        return true;
    }
    if (this.opFlags & PDP11.OPFLAG.TRAP_TF) {
        this.trap(PDP11.TRAP.BPT, PDP11.OPFLAG.TRAP_TF, PDP11.REASON.TRACE);
        return true;
    }
    return false;
};

/**
 * isWaiting()
 *
 * @this {CPUStatePDP11}
 * @return {boolean} (true if OPFLAG.WAIT is set, false otherwise)
 */
CPUStatePDP11.prototype.isWaiting = function()
{
    return !!(this.opFlags & PDP11.OPFLAG.WAIT);
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
     * TODO: I'm not sure why this function can't simply be written as:
     *
     *      return (this.regPSW & ~PDP11.PSW.FLAGS) | (this.getNF() | this.getZF() | this.getVF() | this.getCF());
     *
     * but for now, I'm keeping the same masking logic as the original pdp11.js.
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
    this.regPSW = newPSW;

    /*
     * Trigger (no pun intended) a call to checkInterrupts(), just in case.
     *
     * TODO: I think this is overdone; if you set a breakpoint on checkInterrupts(), you'll see that a significant
     * percentage of calls do nothing.  For example, you'll usually see a spurious checkInterrupts() immediately after
     * an interrupt has been dispatched, because it's dispatched via trap(), and trap() calls setPSW().
     *
     * I mean, sure, it's POSSIBLE that the new PSW loaded by trap() actually set a lower priority, allowing a lower
     * priority interrupt to immediately be acknowledged.  But perhaps we should be a bit more rigorous here.
     *
     * For example, we could avoid setting INTQ unless 1) there's actually an active interrupt trigger (ie, triggerNext
     * is not null) or 2) an optional fCheckInterrupts flag is passed to us, because the caller has some knowledge
     * that priority could be changing.  Just throwing out some ideas....
     */
    this.opFlags |= PDP11.OPFLAG.INTQ;
};

/**
 * getSL()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getSL = function()
{
    return this.regSL & 0xff00;
};

/**
 * setSL(newSL)
 *
 * @this {CPUStatePDP11}
 * @param {number} newSL
 */
CPUStatePDP11.prototype.setSL = function(newSL)
{
    this.regSL = newSL | 0xff;
};

/**
 * getPIR()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getPIR = function()
{
    return this.regPIR;
};

/**
 * setPIR(newPIR)
 *
 * @this {CPUStatePDP11}
 * @param {number} newPIR
 */
CPUStatePDP11.prototype.setPIR = function(newPIR)
{
    newPIR &= 0xfe00;
    if (newPIR) {
        var i = newPIR >> 9;
        do {
            newPIR += 0x22;
        } while (i >>= 1);
    }
    this.regPIR = newPIR;
    this.opFlags |= PDP11.OPFLAG.INTQ;
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
     *
     * TODO: Conduct a review of all opcode handlers, because one possible alternative to all this NO_FLAGS nonsense
     * would be to pass the appropriate flag update function to the writeDstByte()/writeDstWord() functions, and
     * have them update the flags BEFORE the write occurs, thus allowing any subsequent write to the PSW to be honored.
     *
     * That already happens automatically with the updateDstByte()/updateDstWord() functions, since generally the
     * specified modify function also updates the flags BEFORE the write occurs.
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
 * trap(vector, flag, reason)
 *
 * trap() handles all the trap/abort functions.  It reads the trap vector from kernel
 * D space, changes mode to reflect the new PSW and PC, and then pushes the old PSW and
 * PC onto the new mode stack.
 *
 * @this {CPUStatePDP11}
 * @param {number} vector
 * @param {number} flag
 * @param {number} [reason] (for diagnostic purposes only)
 */
CPUStatePDP11.prototype.trap = function(vector, flag, reason)
{
    if (DEBUG && this.dbg) {
        if (this.messageEnabled(MessagesPDP11.TRAP)) {
            var sReason = reason < 0? PDP11.REASONS[-reason] : this.dbg.toStrBase(reason);
            this.printMessage("trap to vector " + this.dbg.toStrBase(vector, 1) + " (" + sReason + ")", MessagesPDP11.TRAP, true);
        }
    }

    if (this.nDisableTraps) return;

    if (this.trapPSW < 0) {
        this.trapPSW = this.getPSW();
    } else if (!this.mmuMode) {
        /*
         * Double-fault (nested trap) condition detected.
         */
        vector = 4;
        /*
         * The next two lines used to be deferred until after the setPSW() below, but
         * I'm not seeing any dependencies on these registers, so I'm consolidating the code.
         */
        this.regErr |= PDP11.CPUERR.RED;
        this.regsGen[6] = 4;
        reason = PDP11.REASON.RED;
    }

    this.lastPC = vector;
    this.lastAI = 0;

    /*
     * Read from kernel D space
     */
    this.mmuMode = 0;
    var newPC = this.readWord(vector | this.addrDSpace);
    var newPSW = this.readWord(((vector + 2) & 0xffff) | this.addrDSpace);

    /*
     * Set new PSW with previous mode
     */
    this.setPSW((newPSW & ~PDP11.PSW.PMODE) | ((this.trapPSW >> 2) & PDP11.PSW.PMODE));

    this.pushWord(this.trapPSW);
    this.pushWord(this.regsGen[7]);
    this.setPC(newPC);

    /*
     * DEC's "TRAP TEST" triggers a RESERVED trap with an invalid opcode and the stack deliberately
     * set too low, and expects the stack overflow trap to be "sprung" immediately afterward, so we
     * only want to "lose interest" in the TRAP flag(s) that were set on entry, not ALL of them.
     *
     *      this.opFlags &= ~PDP11.OPFLAG.TRAP_MASK;    // lose interest in traps after an abort
     *
     * Well, OK, we're also supposed to "lose interest" in the TF flag, too; otherwise, DEC tests fail.
     *
     * Finally, setPSW() likes to always set INTQ, to force a check of hardware interrupts prior to
     * the next instruction, just in case the PSW priority was lowered.  However, there are "TRAP TEST"
     * tests like this one:
     *
     *      005640: 012706 007700          MOV   #7700,SP
     *      005644: 012767 000340 172124   MOV   #340,177776
     *      005652: 012767 000100 171704   MOV   #100,177564
     *      005660: 012767 005712 172146   MOV   #5712,000034   ; set TRAP vector (its PSW is already zero)
     *      005666: 012767 005714 172170   MOV   #5714,000064   ; set hardware interrupt vector (its PSW is already zero)
     *      005674: 012767 005716 172116   MOV   #5716,000020   ; set IOT vector
     *      005702: 012767 000340 172112   MOV   #340,000022    ; set IOT PSW
     *      005710: 104400                 TRAP  000
     *      005712: 000004                 IOT
     *      005714: 000000                 HALT
     *
     * where, after "TRAP 000" has executed, a hardware interrupt will be acknowledged, and instead of
     * executing the IOT, we'll execute the HALT and fail the test.  We avoid that by relying on the same
     * trick that the SPL instruction uses: setting INTQ_DELAY instead of INTQ, which effectively delays
     * INTQ detection for one instruction, which is just long enough to allow the diagnostic to pass.
     */
    this.opFlags &= ~(flag | PDP11.OPFLAG.TRAP_TF | PDP11.OPFLAG.INTQ);
    this.opFlags |= PDP11.OPFLAG.INTQ_DELAY | PDP11.OPFLAG.TRAP;

    this.trapPSW = -1;                                  // reset flag that we have a trap within a trap

    /*
     * These next properties (in conjunction with setting PDP11.OPFLAG.TRAP) are purely an aid for the Debugger;
     * see getTrapStatus().
     */
    this.trapVector = vector;
    this.trapReason = reason;

    if (reason >= PDP11.REASON.RED) throw vector;
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
 * getTrapStatus()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getTrapStatus = function()
{
    return (this.opFlags & PDP11.OPFLAG.TRAP)? (this.trapVector | this.trapReason << 8) : 0;
};

/**
 * mapUnibus(addr)
 *
 * If bits 18-21 of addr are all set (which is implied by addr >= BusPDP11.IOPAGE_UNIBUS aka 0x3C0000),
 * then we have a 22-bit address pointing to the top 256Kb range, so if the UNIBUS relocation map is enabled,
 * we must pass the lower 18 bits of that address through the map.
 *
 * Since mapUnibus() only looks at the low 18 bits of addr, there's no need to mask addr first.  Note that
 * if bits 13-17 are all set, then the 18-bit address points to the top 8Kb of its 256Kb range, and mapUnibus()
 * will return addr unchanged, since it should already be pointing to the top 8Kb of the 4Mb 22-bit range.
 *
 * From the PDP-11/70 Handbook:
 *
 *      On the 11/44 and 11/70, there are a total of 31 mapping registers for address relocation.  Each register is
 *      composed of a double 16-bit PDP-11 word (in consecutive locations) that holds the 22-bit base address.  These
 *      registers have UNIBUS addresses in the range 770200 to 770372.
 *
 *      If the UNIBUS map relocation is not enabled, an incoming 18-bit UNIBUS address has 4 leading zeroes added for
 *      referencing a 22-bit physical address. The lower 18 bits are the same. No relocation is performed.
 *
 *      If UNIBUS map relocation is enabled, the five high order bits of the UNIBUS address are used to select one of the
 *      31 mapping registers.  The low-order 13 bits of the incoming address are used as an offset from the base address
 *      contained in the 22-bit mapping register.  To form the physical address, the 13 low-order bits of the UNIBUS
 *      address are added to 22 bits of the selected mapping register to produce the 22-bit physical address.  The lowest
 *      order bit of all mapping registers is always a zero, since relocation is always on word boundaries.
 *
 * Sadly, because these mappings occur at a word-granular level, we can't implement the mappings by simply shuffling
 * the underlying block around in the Bus component; it would be much more efficient if we could.  That's EXACTLY how
 * we move the IOPAGE in response to addressing changes.  If it turns out that block-granular addresses are commonly
 * stored in the unibusMap registers, we could add code to detect that and perform block remapping in those cases.
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 * @return {number}
 */
CPUStatePDP11.prototype.mapUnibus = function(addr)
{
    var idx = (addr >> 13) & 0x1f;
    if (idx < 31) {
        if (this.regMMR3 & PDP11.MMR3.UNIBUS_MAP) {
            addr = (this.unibusMap[idx] + (addr & 0x1ffe)) & 0x3ffffe;
            if (addr >= BusPDP11.IOPAGE_UNIBUS && addr < BusPDP11.IOPAGE_22BIT) this.panic(898);
        }
    }
    return addr;
};

/**
 * mapVirtualToPhysical(virtualAddress, accessFlags)
 *
 * mapVirtualToPhysical() does memory management. It converts a 17-bit I/D virtual address to a
 * 22-bit physical address.  A real PDP 11/70 memory management unit can be enabled separately
 * for read and write for diagnostic purposes.  This is handled here by having an enable mask
 * (mmuEnable) which is tested against the operation access mask (accessFlags).  If there is no
 * match, then the virtual address is simply mapped as a 16 bit physical address with the upper
 * page going to the IO address space.  Significant access mask values used are PDP11.ACCESS.READ
 * and PDP11.ACCESS.WRITE.
 *
 * As an aside it turns out that it is the memory management unit that does odd address and
 * non-existent memory trapping: who knew? :-) I thought these would have been handled at
 * access time.
 *
 * When doing mapping, mmuMode is used to decide what address space is to be used (0 = kernel,
 * 1 = supervisor, 2 = illegal, 3 = user).  Normally, mmuMode is set by the setPSW() function,
 * but there are exceptions for instructions which move data between address spaces (MFPD, MFPI,
 * MTPD, and MTPI) and trap().  These will modify mmuMode outside of setPSW() and then restore
 * it again if all worked.  If however something happens to cause a trap then no restore is
 * done as setPSW() will have been invoked as part of the trap, which will resynchronize mmuMode.
 *
 * A PDP-11/70 is different from other PDP-11s in that the highest 18 bit space (017000000 & above)
 * maps directly to UNIBUS space - including low memory. This doesn't appear to be particularly
 * useful as it restricts maximum system memory - although it does appear to allow software
 * testing of the unibus map.  This feature also appears to confuse some OSes which test consecutive
 * memory locations to find maximum memory -- and on a full memory system find themselves accessing
 * low memory again at high addresses.
 *
 * Construction of a Physical Address
 * ----------------------------------
 *
 *      Virtual Addr (VA)                                  12 11 10  9  8  7  6  5  4  3  2  1  0
 *      Page Addr Field (PAF)   15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
 *                            + -----------------------------------------------------------------
 *      Physical Addr (PA)      21 20 19 18 17 16 15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
 *
 * The Page Address Field (PAF) comes from a Page Address Register (PAR) that is selected by Virtual Address (VA)
 * bits 15-13.  You can see from the above alignments that the VA contributes to the low 13 bits, providing an 8Kb
 * range.
 *
 * VA bits 0-5 pass directly through to the PA; those are also called the DIB (Displacement in Block) bits.
 * VA bits 6-12 are added to the low 7 bits of the PAF and are also called the BN (Block Number) bits.
 *
 * You can also think of the entire PAF as a block number, where each block is 64 bytes.  This is consistent with
 * the LSIZE register at 177760, which is supposed to contain the number of 64-byte blocks of memory installed.
 *
 * Note that if a PAR is initialized to zero, successively adding 0200 (0x80) to the PAR will advance the base
 * physical address to the next 8Kb page.
 *
 * @this {CPUStatePDP11}
 * @param {number} virtualAddress
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.mapVirtualToPhysical = function(virtualAddress, accessFlags)
{
    var page, pdr, physicalAddress;

    this.assert(!(virtualAddress & ~0x1ffff) && accessFlags);

    /*
     * This can happen when the DSTMODE (MAINT) bit of MMR0 is set but *not* the ENABLED bit.
     */
    if (!(accessFlags & this.mmuEnable)) {
        return virtualAddress;
    }

    this.mmuLastVirtual = virtualAddress;

    page = virtualAddress >> 13;
    if (!(this.regMMR3 & this.mapMMR3[this.mmuMode])) page &= 7;
    pdr = this.mmuPDR[this.mmuMode][page];
    physicalAddress = ((this.mmuPAR[this.mmuMode][page] << 6) + (virtualAddress & 0x1fff)) & this.mmuMask;

    var errorMask = 0;
    switch (pdr & 0x7) {
    case 1:                         // read-only with trap
        errorMask = PDP11.MMR0.TRAP_MMU;
        /* falls through */
    case 2:                         // read-only
        pdr |= 0x80;                // Set A bit
        if (accessFlags & PDP11.ACCESS.WRITE) {
            errorMask = PDP11.MMR0.ABORT_RO;
        }
        break;
    case 4:                         // read-write with read-write trap
        errorMask = PDP11.MMR0.TRAP_MMU;
        /* falls through */
    case 5:                         // read-write with write trap
        if (accessFlags & PDP11.ACCESS.WRITE) {
            errorMask = PDP11.MMR0.TRAP_MMU;
        }
        /* falls through */
    case 6:                         // read-write: set A & W bits
        pdr |= ((accessFlags & PDP11.ACCESS.WRITE) ? 0xc0 : 0x80);
        break;
    default:
        errorMask = PDP11.MMR0.ABORT_NR;
        break;
    }

    if ((pdr & 0x7f08) != 0x7f00) { // skip checking most common case (hopefully)
        if (pdr & 0x8) {            // expand downwards
            if (pdr & 0x7f00) {
                if ((virtualAddress & 0x1fc0) < ((pdr >> 2) & 0x1fc0)) {
                    errorMask |= PDP11.MMR0.ABORT_PL;
                }
            }
        } else {                    // expand upwards
            if ((virtualAddress & 0x1fc0) > ((pdr >> 2) & 0x1fc0)) {
                errorMask |= PDP11.MMR0.ABORT_PL;
            }
        }
    }

    /*
     * Aborts and traps: log FIRST trap and MOST RECENT abort
     */

    this.mmuPDR[this.mmuMode][page] = pdr;
    if (physicalAddress != ((BusPDP11.IOPAGE_22BIT | PDP11.UNIBUS.MMR0) & this.mmuMask) || this.mmuMode) {
        this.mmuLastMode = this.mmuMode;
        this.mmuLastPage = page;
    }

    var fAbort = false;
    if (errorMask) {
        if (errorMask & PDP11.MMR0.ABORT) {
            if (this.trapPSW >= 0) errorMask |= 0x80;   // Instruction complete
            if (!(this.regMMR0 & PDP11.MMR0.ABORT)) {
                this.regMMR0 |= errorMask | (this.mmuLastMode << 5) | (this.mmuLastPage << 1);
            }
            fAbort = true;
        }
        if (!(this.regMMR0 & (PDP11.MMR0.ABORT | PDP11.MMR0.TRAP_MMU))) {
            /*
             * TODO: Review the code below, because the address range seems over-inclusive.
             */
            if (physicalAddress < ((BusPDP11.IOPAGE_22BIT | PDP11.UNIBUS.SIPDR0) & this.mmuMask) ||
                physicalAddress > ((BusPDP11.IOPAGE_22BIT | PDP11.UNIBUS.UDPAR7 | 0x1) & this.mmuMask)) {
                this.regMMR0 |= PDP11.MMR0.TRAP_MMU;
                if (this.regMMR0 & PDP11.MMR0.MMU_TRAPS) {
                    this.opFlags |= PDP11.OPFLAG.TRAP_MMU;
                }
            }
        }
        if (fAbort) {                                   // don't abort until the end, because it throws an exception
            this.trap(PDP11.TRAP.MMU, 0, PDP11.REASON.ABORT);
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
    this.bus.setByte(physicalAddress, data);
};

/**
 * popWord()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.popWord = function()
{
    var result = this.readWord(this.regsGen[6] | this.addrDSpace);
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
    this.lastAI = (this.lastAI << 8) | 0xf6;
    this.checkStackLimit(0, virtualAddress);
    this.writeWord(virtualAddress, data);
};

/**
 * checkStackLimit(mode, addr)
 *
 * The special "mode 0" case used by pushWord() ignores addr <= 4, because pushWord() is used by trap(),
 * and if the trap() was generated by a RED error (below) or generated a RED error itself, then we need to
 * avoid triggering another (nested) RED error.
 *
 * TODO: pushWord() is not used exclusively by trap(); it's also used by a few instructions, like opJSR(),
 * so we might need to do some additional factoring of this function's logic.
 *
 * @this {CPUStatePDP11}
 * @param {number} mode (ie, the addressing mode, or 0 if pushWord() is checking)
 * @param {number} addr
 */
CPUStatePDP11.prototype.checkStackLimit = function(mode, addr)
{
    if (!this.mmuMode) {
        /*
         * NOTE: I've removed the tests below for addr >= 0xFFFE, which were ported from the original code,
         * because while it's definitely a bad physical stack address, I'm not sure it rises to the level of
         * a trap, and this code is already expensive enough as it is.
         */
        if (addr <= this.regSL && (mode || addr > 4) /* || mode && addr >= 0xFFFE */) {
            if (this.model >= PDP11.MODEL_1145 && (addr <= this.regSL - 32 /* || mode == 1 && addr >= 0xFFFE */)) {
                this.regErr |= PDP11.CPUERR.RED;
                this.regsGen[6] = 4;
                this.trap(PDP11.TRAP.BUS, 0, PDP11.REASON.RED);
            } else {
                /*
                 * On older machines (eg, the PDP-11/20), the instruction is always allowed to complete,
                 * so the trap must always be issued in this fashion.
                 */
                this.regErr |= PDP11.CPUERR.YELLOW;
                this.opFlags |= PDP11.OPFLAG.TRAP_SP;
            }
        }
    }
};

/**
 * getAddrByMode(mode, reg, accessFlags)
 *
 * getAddrByMode() maps a six bit operand to a 17 bit I/D virtual address space.
 *
 * Instruction operands are six bits in length - three bits for the mode and three
 * for the register. The 17th I/D bit in the resulting virtual address represents
 * whether the reference is to Instruction space or Data space - which depends on
 * combination of the mode and whether the register is the Program Counter (R7).
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
 * Stack Overflow Traps
 * --------------------
 * On the PDP-11/20, stack overflow traps occur when an address below 400 is referenced
 * by SP in either mode 4 (auto-decrement) or 5 (auto-decrement deferred).  The instruction
 * is allowed to complete before the trap is issued.
 *
 * On the PDP-11/70, the stack limit register (177774) allows a variable boundary for the
 * kernel stack.
 *
 * @this {CPUStatePDP11}
 * @param {number} mode
 * @param {number} reg
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.getAddrByMode = function(mode, reg, accessFlags)
{
    var virtualAddress, step;
    var addrDSpace = (accessFlags & PDP11.ACCESS.VIRT)? 0 : this.addrDSpace;

    /*
     * Modes that need to auto-increment or auto-decrement will break, in order to perform
     * the update; others will return an address immediately.
     */
    switch (mode) {
    /*
     * Mode 0: Registers don't have a virtual address, so trap.
     *
     * NOTE: Most instruction code paths never call getAddrByMode() when the mode is zero;
     * JMP and JSR instructions are exceptions, but that's OK, because those are documented as
     * ILLEGAL instructions which produce a BUS trap (as opposed to UNDEFINED instructions
     * that cause a RESERVED trap).
     */
    case 0:
        this.trap(PDP11.TRAP.BUS, 0, PDP11.REASON.ILLEGAL);
        return 0;

    /*
     * Mode 1: (R)
     */
    case 1:
        if (reg == 6 && (accessFlags & PDP11.ACCESS.WRITE)) {
            this.checkStackLimit(mode, this.regsGen[6]);
        }
        this.nStepCycles -= (2 + 1);
        return (reg == 7? this.regsGen[reg] : (this.regsGen[reg] | addrDSpace));

    /*
     * Mode 2: (R)+
     */
    case 2:
        step = 2;
        virtualAddress = this.regsGen[reg];
        if (reg != 7) {
            virtualAddress |= addrDSpace;
            if (reg < 6 && (accessFlags & PDP11.ACCESS.BYTE)) {
                step = 1;
            }
        }
        this.nStepCycles -= (2 + 1);
        break;

    /*
     * Mode 3: @(R)+
     */
    case 3:
        step = 2;
        virtualAddress = this.regsGen[reg];
        if (reg != 7) virtualAddress |= addrDSpace;
        virtualAddress = this.readWord(virtualAddress);
        virtualAddress |= addrDSpace;
        this.nStepCycles -= (5 + 2);
        break;

    /*
     * Mode 4: -(R)
     */
    case 4:
        step = -2;
        if (reg < 6 && (accessFlags & PDP11.ACCESS.BYTE)) step = -1;
        virtualAddress = (this.regsGen[reg] + step) & 0xffff;
        if (reg != 7) virtualAddress |= addrDSpace;
        this.nStepCycles -= (3 + 1);
        break;

    /*
     * Mode 5: @-(R)
     */
    case 5:
        step = -2;
        virtualAddress = (this.regsGen[reg] - 2) & 0xffff;
        if (reg != 7) virtualAddress |= addrDSpace;
        virtualAddress = this.readWord(virtualAddress) | addrDSpace;
        this.nStepCycles -= (6 + 2);
        break;

    /*
     * Mode 6: d(R)
     */
    case 6:
        virtualAddress = this.readWord(this.advancePC(2));
        virtualAddress = ((virtualAddress + this.regsGen[reg]) & 0xffff) | addrDSpace;
        this.nStepCycles -= (4 + 2);
        return virtualAddress;

    /*
     * Mode 7: @d(R)
     */
    case 7:
        virtualAddress = this.readWord(this.advancePC(2));
        virtualAddress = (virtualAddress + this.regsGen[reg]) & 0xffff;
        virtualAddress = this.readWord(virtualAddress | this.addrDSpace) | addrDSpace;
        this.nStepCycles -= (7 + 3);
        return virtualAddress;
    }

    this.regsGen[reg] = (this.regsGen[reg] + step) & 0xffff;
    this.lastAI = (this.lastAI << 8) | ((step << 3) & 0xf8) | reg;

    /*
     * NOTE: We had to eliminate the test for "(accessFlags & PDP11.ACCESS.WRITE)", because DEC's
     * "TRAP TEST" expects "TST -(SP)" to trap when SP is 150.
     */
    if (reg == 6 && step < 0) {
        this.checkStackLimit(mode, this.regsGen[6]);
    }
    return virtualAddress;
};

/**
 * getByteDirect(addr)
 *
 * This interface is expressly for the Debugger, to access virtual memory without faulting;
 * note that if the MMU is not enabled, this is effectively the same as using the Bus interface.
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 * @return {number}
 */
CPUStatePDP11.prototype.getByteDirect = function(addr)
{
    if (!this.mmuEnable) {
        return this.bus.getByteDirect(addr);
    }
    this.nDisableTraps++;
    var b = this.readByteFromPhysical(this.mapVirtualToPhysical(addr, PDP11.ACCESS.READ_BYTE));
    this.nDisableTraps--;
    return b;
};

/**
 * getWordDirect(addr)
 *
 * This interface is expressly for the Debugger, to access virtual memory without faulting;
 * note that if the MMU is not enabled, this is effectively the same as using the Bus interface.
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 * @return {number}
 */
CPUStatePDP11.prototype.getWordDirect = function(addr)
{
    if (!this.mmuEnable) {
        return this.bus.getWordDirect(addr);
    }
    this.nDisableTraps++;
    var w = this.readWordFromPhysical(this.mapVirtualToPhysical(addr, PDP11.ACCESS.READ_WORD));
    this.nDisableTraps--;
    return w;
};

/**
 * setByteDirect(addr, data)
 *
 * This interface is expressly for the Debugger, to access virtual memory without faulting;
 * note that if the MMU is not enabled, this is effectively the same as using the Bus interface.
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 * @param {number} data
 */
CPUStatePDP11.prototype.setByteDirect = function(addr, data)
{
    if (!this.mmuEnable) {
        this.bus.setByteDirect(addr, data);
        return;
    }
    this.nDisableTraps++;
    this.writeByteToPhysical(this.mapVirtualToPhysical(addr, PDP11.ACCESS.WRITE_BYTE), data);
    this.nDisableTraps--;
};

/**
 * setWordDirect(addr, data)
 *
 * This interface is expressly for the Debugger, to access virtual memory without faulting;
 * note that if the MMU is not enabled, this is effectively the same as using the Bus interface.
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 * @param {number} data
 */
CPUStatePDP11.prototype.setWordDirect = function(addr, data)
{
    if (!this.mmuEnable) {
        this.bus.setWordDirect(addr, data);
        return;
    }
    this.nDisableTraps++;
    this.writeWordToPhysical(this.mapVirtualToPhysical(addr, PDP11.ACCESS.WRITE_WORD), data);
    this.nDisableTraps--;
};

/**
 * getPhysicalAddrByMode(mode, reg, accessFlags)
 *
 * This is a handler set up by setMemoryAccess().  All calls should go through getAddr().
 *
 * @this {CPUStatePDP11}
 * @param {number} mode
 * @param {number} reg
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.getPhysicalAddrByMode = function(mode, reg, accessFlags)
{
    return this.getAddrByMode(mode, reg, accessFlags);
};

/**
 * getVirtualAddrByMode(mode, reg, accessFlags)
 *
 * This is a handler set up by setMemoryAccess().  All calls should go through getAddr().
 *
 * @this {CPUStatePDP11}
 * @param {number} mode
 * @param {number} reg
 * @param {number} accessFlags
 * @return {number}
 */
CPUStatePDP11.prototype.getVirtualAddrByMode = function(mode, reg, accessFlags)
{
    return this.mapVirtualToPhysical(this.getAddrByMode(mode, reg, accessFlags), accessFlags);
};

/**
 * readWordFromPhysical(physicalAddress)
 *
 * This is a handler set up by setMemoryAccess().  All calls should go through readWord().
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @return {number}
 */
CPUStatePDP11.prototype.readWordFromPhysical = function(physicalAddress)
{
    return this.bus.getWord(physicalAddress);
};

/**
 * readWordFromVirtual(virtualAddress)
 *
 * This is a handler set up by setMemoryAccess().  All calls should go through readWord().
 *
 * @this {CPUStatePDP11}
 * @param {number} virtualAddress (input address is 17 bit (I&D))
 * @return {number}
 */
CPUStatePDP11.prototype.readWordFromVirtual = function(virtualAddress)
{
    return this.bus.getWord(this.mapVirtualToPhysical(virtualAddress, PDP11.ACCESS.READ_WORD));
};

/**
 * writeWordToPhysical(physicalAddress, data)
 *
 * This is a handler set up by setMemoryAccess().  All calls should go through writeWord().
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @param {number} data
 */
CPUStatePDP11.prototype.writeWordToPhysical = function(physicalAddress, data)
{
    this.bus.setWord(physicalAddress, data & 0xffff);
};

/**
 * writeWordToVirtual(virtualAddress, data)
 *
 * This is a handler set up by setMemoryAccess().  All calls should go through writeWord().
 *
 * @this {CPUStatePDP11}
 * @param {number} virtualAddress (input address is 17 bit (I&D))
 * @param {number} data
 */
CPUStatePDP11.prototype.writeWordToVirtual = function(virtualAddress, data)
{
    this.bus.setWord(this.mapVirtualToPhysical(virtualAddress, PDP11.ACCESS.WRITE_WORD), data);
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
    var data;
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        if (reg != 6 || ((this.regPSW >> 2) & PDP11.PSW.PMODE) === (this.regPSW & PDP11.PSW.PMODE)) {
            data = this.regsGen[reg];
        } else {
            data = this.regsAltStack[(this.regPSW >> 12) & 3];
        }
    } else {
        var addr = this.getAddrByMode(mode, reg, PDP11.ACCESS.READ_WORD);
        if (!(accessFlags & PDP11.ACCESS.DSPACE)) {
            if ((this.regPSW & 0xf000) !== 0xf000) addr &= 0xffff;
        }
        this.mmuMode = (this.regPSW >> 12) & 3;
        data = this.readWord(addr | (accessFlags & this.addrDSpace));
        this.mmuMode = (this.regPSW >> 14) & 3;
    }
    return data;
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
    this.lastAI = 0x0016;
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        if (reg != 6 || ((this.regPSW >> 2) & PDP11.PSW.PMODE) === (this.regPSW & PDP11.PSW.PMODE)) {
            this.regsGen[reg] = data;
        } else {
            this.regsAltStack[(this.regPSW >> 12) & 3] = data;
        }
    } else {
        var addr = this.getAddrByMode(mode, reg, PDP11.ACCESS.WRITE_WORD);
        if (!(accessFlags & PDP11.ACCESS.DSPACE)) addr &= 0xffff;
        /*
         * TODO: Consider replacing the following code with writeWord(), by adding optional mmuMode
         * parameters for each of the discrete mapVirtualToPhysical() and bus.setWord() operations, because
         * as it stands, this is the only remaining call to mapVirtualToPhysical() outside of our
         * setMemoryAccess() handlers.
         */
        this.mmuMode = (this.regPSW >> 12) & 3;
        addr = this.mapVirtualToPhysical(addr | (accessFlags & PDP11.ACCESS.DSPACE), PDP11.ACCESS.WRITE);
        this.mmuMode = (this.regPSW >> 14) & 3;
        this.bus.setWord(addr, data);
    }
};

/**
 * readSrcByte(opCode)
 *
 * WARNING: If the SRC operand is a register, we return a negative register number rather than the
 * register value, because the final value of the register must be resolved AFTER the DST operand has
 * been decoded and any pre-decrement or post-increment operations affecting the SRC register have
 * been completed.  See readSrcWord() for more details.
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
        result = -reg-1;
    } else {
        result = this.readByteFromPhysical(this.getAddr(mode, reg, PDP11.ACCESS.READ_BYTE));
    }
    return result;
};

/**
 * readSrcWord(opCode)
 *
 * WARNING: If the SRC operand is a register, we return a negative register number rather than the
 * register value, because the final value of the register must be resolved AFTER the DST operand has
 * been decoded and any pre-decrement or post-increment operations affecting the SRC register have
 * been completed.
 *
 * Here's an example from DEC's "TRAP TEST":
 *
 *      007200: 012700 006340          MOV   #6340,R0
 *      007204: 010020                 MOV   R0,(R0)+
 *      007206: 026727 177126 006342   CMP   006340,#6342
 *      007214: 001401                 BEQ   007220
 *      007216: 000000                 HALT
 *
 * If this function returned the value of R0 for the SRC operand of "MOV R0,(R0)+", then the operation
 * would write 6340 to the destination, rather than 6342.
 *
 * Most callers don't need to worry about this, because if they pass the result from readSrcWord() directly
 * to writeDstWord() or updateDstWord(), those functions will take care of converting any negative register
 * number back into the current register value.  The exceptions are opcodes that don't modify the DST operand
 * (BIT, BITB, CMP, and CMPB); those opcode handlers must deal with negative register numbers themselves.
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
        result = -reg-1;
    } else {
        result = this.bus.getWord(this.getAddr(mode, reg, PDP11.ACCESS.READ_WORD));
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
    return this.getAddrByMode(mode, reg, PDP11.ACCESS.VIRT);
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
        result = this.readByteFromPhysical(this.getAddr(mode, reg, PDP11.ACCESS.READ_BYTE));
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
        result = this.bus.getWord(this.getAddr(mode, reg, PDP11.ACCESS.READ_WORD));
    }
    return result;
};

/**
 * updateDstByte(opCode, data, fnOp)
 *
 * Used whenever the DST operand (as described by opCode) needs to be read before writing.
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} data
 * @param {function(number,number)} fnOp
 */
CPUStatePDP11.prototype.updateDstByte = function(opCode, data, fnOp)
{
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        var dst = this.regsGen[reg];
        data = (data < 0? (this.regsGen[-data-1] & 0xff) : data);
        this.regsGen[reg] = (dst & 0xff00) | fnOp.call(this, data, dst & 0xff);
    } else {
        var addr = this.dstAddr = this.getAddr(mode, reg, PDP11.ACCESS.UPDATE_BYTE);
        data = (data < 0? (this.regsGen[-data-1] & 0xff) : data);
        this.writeByteToPhysical(addr, fnOp.call(this, data, this.readByteFromPhysical(addr)));
    }
};

/**
 * updateDstWord(opCode, data, fnOp)
 *
 * Used whenever the DST operand (as described by opCode) needs to be read before writing.
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} data
 * @param {function(number,number)} fnOp
 */
CPUStatePDP11.prototype.updateDstWord = function(opCode, data, fnOp)
{
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;

    /*
     * TODO: If callers are careful about masking data, then we don't need to mask it here or in bus.setWord().
     * We've eliminated the 0xffff data mask here, but bus.setWord() is still masking.
     */
    this.assert(data < 0 && data >= -8 || !(data & ~0xffff));

    if (!mode) {
        this.regsGen[reg] = fnOp.call(this, data < 0? this.regsGen[-data-1] : data, this.regsGen[reg]);
    } else {
        var addr = this.getAddr(mode, reg, PDP11.ACCESS.UPDATE_WORD);
        this.bus.setWord(addr, fnOp.call(this, data < 0? this.regsGen[-data-1] : data, this.bus.getWord(addr)));
    }
};

/**
 * writeDstByte(opCode, data, writeFlags)
 *
 * Used whenever the DST operand (as described by opCode) does NOT need to be read before writing.
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 * @param {number} data
 * @param {number} writeFlags (WRITE.BYTE aka 0xff, or WRITE.SBYTE aka 0xffff)
 * @return {number}
 */
CPUStatePDP11.prototype.writeDstByte = function(opCode, data, writeFlags)
{
    this.assert(writeFlags);
    var reg = this.dstReg = opCode & PDP11.OPREG.MASK;
    var mode = this.dstMode = (opCode & PDP11.OPMODE.MASK) >> PDP11.OPMODE.SHIFT;
    if (!mode) {
        if (!data) {
            /*
             * Potentially worthless optimization (but it looks good on "paper").
             */
            this.regsGen[reg] &= ~writeFlags;
        } else {
            /*
             * Potentially worthwhile optimization: skipping the sign-extending data shifts
             * if writeFlags is WRITE.BYTE (but that requires an extra test and separate code paths).
             */
            data = (data < 0? (this.regsGen[-data-1] & 0xff): data);
            this.regsGen[reg] = (this.regsGen[reg] & ~writeFlags) | (((data << 24) >> 24) & writeFlags);
        }
    } else {
        var addr = this.getAddr(mode, reg, PDP11.ACCESS.WRITE_BYTE);
        this.writeByteToPhysical(addr, (data = data < 0? (this.regsGen[-data-1] & 0xff): data));
    }
    return data;
};

/**
 * writeDstWord(opCode, data)
 *
 * Used whenever the DST operand (as described by opCode) does NOT need to be read before writing.
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

    /*
     * TODO: If callers are careful about masking data, then we don't need to mask it here or in bus.setWord().
     * We've eliminated the 0xffff data mask here, but bus.setWord() is still masking.
     */
    this.assert(data < 0 && data >= -8 || !(data & ~0xffff));

    if (!mode) {
        this.regsGen[reg] = (data = (data < 0? this.regsGen[-data-1] : data));
    } else {
        var addr = this.getAddr(mode, reg, PDP11.ACCESS.WRITE_WORD);
        this.bus.setWord(addr, (data = (data < 0? this.regsGen[-data-1] : data)));
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
        var off = ((opCode << 24) >> 23);
        if (DEBUG && DEBUGGER && this.dbg && off == -2) {
            this.dbg.stopInstruction("branch to self");
        }
        this.setPC(this.getPC() + off);
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
     * nDebugCheck is 1 if we want the Debugger's checkInstruction() to check every instruction,
     * -1 if we want it to check just the first instruction, and 0 if there's no need for any checks.
     */
    var nDebugCheck = (DEBUGGER && this.dbg)? (this.dbg.checksEnabled()? 1 : (this.flags.starting? -1 : 0)) : 0;

    /*
     * nDebugState is needed only when nDebugCheck is non-zero; it is -1 if this is a single-step, 0 if
     * this is the start of a new run, and 1 if this is a continuation of a previous run.  It is used by
     * checkInstruction() to determine if it should skip breakpoint checks and/or HALT instructions (ie,
     * if nDebugState is <= zero).
     */
    var nDebugState = (!nMinCycles)? -1 : (this.flags.starting? 0 : 1);

    /*
     * We've moved beyond "starting" now and have officially "started".
     */
    this.flags.starting = false;

    /*
     * We move the minimum cycle count to nStepCycles (the number of cycles left to step), so that other
     * functions have the ability to force that number to zero (eg, stopCPU()), and thus we don't have to check
     * any other criteria to determine whether we should continue stepping or not.
     */
    this.nBurstCycles = this.nStepCycles = nMinCycles;

    do {
        if (DEBUGGER && nDebugCheck) {
            if (this.dbg.checkInstruction(this.getPC(), nDebugState)) {
                this.stopCPU();
                break;
            }
            if (!nDebugState) nDebugState++;
            nDebugCheck++;
        }

        if (this.opFlags) {

            /*
             * If we're in the INTQ or WAIT state, check for any pending interrupts.
             *
             * NOTE: It's no coincidence that we're checking this BEFORE any pending traps, because in rare
             * cases (including some presented by those pesky "TRAP TEST" diagnostics), the process of dispatching
             * an interrupt can trigger a TRAP_SP stack overflow condition, which must be dealt with BEFORE we
             * execute the first instruction of the interrupt handler.
             */
            if ((this.opFlags & (PDP11.OPFLAG.INTQ_MASK | PDP11.OPFLAG.WAIT)) /* && nDebugState >= 0 */) {
                if (this.checkInterrupts()) {
                    if (DEBUGGER && nDebugCheck && this.dbg.checkInstruction(this.getPC(), nDebugState)) {
                        this.stopCPU();
                        break;
                    }
                    /*
                     * Since an interrupt was just dispatched, altering the normal flow of time and changing
                     * the future as we knew it, let's break out immediately if we're single-stepping, so that
                     * the Debugger gets to see the first instruction of the interrupt handler.  NOTE: This
                     * assumes that we've still commented out the nDebugState check above that used to bypass
                     * checkInterrupts() when single-stepping.
                     */
                    if (nDebugState < 0) break;
                }
            }

            /*
             * Next, check for any pending traps (which, as noted above, must be done after checkInterrupts()).
             *
             * I've moved this TRAP_MASK check BEFORE we decode the next instruction instead of immediately AFTER,
             * just in case the last instruction threw an exception that kicked us out before we reached the bottom
             * of the stepCPU() loop.
             */
            if (this.opFlags & PDP11.OPFLAG.TRAP_MASK) {
                if (this.checkTraps()) {
                    if (DEBUGGER && nDebugCheck && this.dbg.checkInstruction(this.getPC(), nDebugState)) {
                        this.stopCPU();
                        break;
                    }
                    if (nDebugState < 0) break;
                }
            }
        }

        /*
         * Snapshot the TF bit in opFlags, while clearing all other opFlags (except those in PRESERVE);
         * we'll check the TRAP_TF bit in opFlags when we come back around for another opcode.
         */
        this.opFlags = (this.opFlags & PDP11.OPFLAG.PRESERVE) | (this.regPSW & PDP11.PSW.TF);

        this.decode(this.getOpcode());

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
