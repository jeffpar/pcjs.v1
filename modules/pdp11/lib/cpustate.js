/**
 * @fileoverview Implements the PDP11 CPU component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Sep-03
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
        nCyclesDefault = 1000000;
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
     * TODO: Verify the initial state of all PDP-11 flags (are they documented?)
     */
    this.flagC = 0x10000;       // PSW C bit
    this.flagV = 0x8000;        // PSW V bit
    this.flagZ = 0xffff;        // ~ PSW Z bit      (TODO: Why is Z clear instead of set like all other flags?)
    this.flagN = 0x8000;        // PSW N bit
    this.regPSW = 0xf;          // PSW other bits   (TODO: What's the point of setting the flag bits here, too?)
    this.regOp = -1;            // current opcode
    this.regsGen = [            // General R0 - R7
        0, 0, 0, 0, 0, 0, 0, this.resetAddr
    ];
    this.regsAlt = [            // Alternate R0 - R5
        0, 0, 0, 0, 0, 0
    ];
    this.regsAltStack = [       // Alternate R6 stack pointers (kernel, super, illegal, user)
        0, 0, 0, 0
    ];
    this.memory = [];           // Main memory (words)
    this.interruptQueue = [];   // List of interrupts pending
    this.pir = 0;
    this.runState = 0;          // 0=run, 1=step, 2=wait, 3=run
    this.loopRate = 9999;       // instructions we can execute in 12ms
    this.priorityReview = 2;    // flag to mark if we need to check priority change
    this.stackLimit = 0xff;
    this.opFlags = 0;
    this.trapPSW = -1;
    this.CPU_Error = 0;
    this.cpuType = 70;
    this.MMR0 = 0;
    this.MMR1 = 0;
    this.MMR2 = 0;
    this.MMR3 = 0;
    this.mmuMode = 0;           // current memory management mode (0=kernel,1=super,2=undefined,3=user)
    this.mmuEnable = 0;         // MMU enabled for PDP11.READ_MODE or PDP11.WRITE_MODE
    this.mmuLastMode = 0;
    this.mmuLastPage = 0;
    this.mmuLastVirtual = 0;
    this.mmuMask = [            // mask to control I&D access for each mode
        0x7, 0x7, 0x7, 0x7
    ];
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
};

/**
 * resetRegs()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.resetRegs = function()
{
    this.stackLimit = 0xff;
    this.CPU_Error = 0;
    this.interruptQueue = [];
    this.pir = 0;
    this.MMR0 = this.MMR1 = this.MMR2 = this.MMR3 = this.mmuFrozen = this.mmuEnable = 0;
    this.mmuMask[0] = this.mmuMask[1] = this.mmuMask[3] = 0x7;
    this.mmuLastMode = 0;
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
    state.set(1, [this.intFlags, this.nTotalCycles, this.getSpeed()]);
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
    this.intFlags = a[0];
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
    return this.regsGen[7];
};

/**
 * setPC()
 *
 * @this {CPUStatePDP11}
 * @param {number} addr
 */
CPUStatePDP11.prototype.setPC = function(addr)
{
    this.regsGen[7] = addr;
};

/**
 * getSP()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.getSP = function()
{
    return this.regsGen[6];
};

/**
 * checkINTR()
 *
 * @this {CPUStatePDP11}
 * @return {boolean} true if execution may proceed, false if not
 */
CPUStatePDP11.prototype.checkINTR = function()
{
    if (this.intFlags & PDP11.INTFLAG.HALT) {
        /*
         * As discussed in opHLT(), the CPU is never REALLY halted by a HLT instruction; instead, opHLT()
         * calls requestHALT(), which sets INTFLAG.HALT and signals to stepCPU() that it's free to end the
         * current burst AND that it should not execute any more instructions until checkINTR() indicates
         * that a hardware interrupt has been requested.
         */
        this.endBurst();
        return false;
    }
    return true;
};

/**
 * clearINTR(nLevel)
 *
 * Clear the corresponding interrupt level.
 *
 * nLevel can either be a valid interrupt level (0-7), or -1 to clear all pending interrupts
 * (eg, in the event of a system-wide reset).
 *
 * @this {CPUStatePDP11}
 * @param {number} nLevel (0-7, or -1 for all)
 */
CPUStatePDP11.prototype.clearINTR = function(nLevel)
{
    var bitsClear = nLevel < 0? 0xff : (1 << nLevel);
    this.intFlags &= ~bitsClear;
};


/**
 * requestHALT()
 *
 * @this {CPUStatePDP11}
 */
CPUStatePDP11.prototype.requestHALT = function()
{
    this.intFlags |= PDP11.INTFLAG.HALT;
    this.endBurst();
};

/**
 * interrupt(delay, priority, vector, callback)
 *
 * Interrupts are stored in a queue in delay order with the delay expressed as
 * a difference. For example if the delays were 0, 1, 0 then the first entry
 * is active and both the second and third are waiting for one more instruction
 * execution to become active.
 *
 * If the current state is WAIT (runState === 2) then skip any delay and
 * go into RUN state.
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
        if (this.runState === 2) {                      // if currently wait
            delay = 0;
            this.runState = 0;
            setTimeout(this.onRunTimeout, 0);           // TODO: Review
        }
        i = this.interruptQueue.length;                 // queue in delay 'difference' order
        while (i-- > 0) {
            if (this.interruptQueue[i].delay > delay) {
                this.interruptQueue[i].delay -= delay;
                break;
            }
            delay -= this.interruptQueue[i].delay;
        }
        this.interruptQueue.splice(i + 1, 0, {
            "delay": delay,
            "priority": priority & 0xe0,
            "vector": vector,
            "callback": callback
        });
    }
    this.priorityReview = 2;
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
     *      return (this.PSW & ~PDP11.PSW.FLAGS) | (this.getNF() | this.getZF() | this.getVF() | this.getCF());
     *
     * but for now, I'm keeping the same masking logic as pdp11.js.
     */
    var mask = PDP11.PSW.CMODE | PDP11.PSW.PMODE | PDP11.PSW.REGSET | PDP11.PSW.PRI | PDP11.PSW.TF;
    return this.PSW = (this.PSW & mask) | this.getNF() | this.getZF() | this.getVF() | this.getCF();
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
    if ((newPSW ^ this.PSW) & PDP11.PSW.REGSET) {
        /*
         * Swap register sets
         */
        for (var i = this.regsAlt.length; --i >= 0;) {
            var tmp = this.regsGen[i];
            this.regsGen[i] = this.regsAlt[i];
            this.regsAlt[i] = tmp;
        }
    }
    this.mmuMode = (newPSW >> PDP11.PSW.CMODE_SHIFT) & PDP11.MODE.MASK;
    var oldMode = (this.PSW >> PDP11.PSW.CMODE_SHIFT) & PDP11.MODE.MASK;
    if (this.mmuMode != oldMode) {
        /*
         * Swap stack pointers
         */
        this.regsAltStack[oldMode] = this.regsGen[6];
        this.regsGen[6] = this.regsAltStack[this.mmuMode];
    }
    /*
     * Trigger check of priority levels
     */
    this.priorityReview = 2;
    this.PSW = newPSW;
};

/**
 * updateNZFlags(result)
 *
 * @this {CPUStatePDP11}
 * @param {number} result
 */
CPUStatePDP11.prototype.updateNZFlags = function(result)
{
    if (!this.opFlags & PDP11.OPFLAG.SKIP_FLAGS) {
        this.flagN = this.flagZ = result;
        this.flagV = 0;
    }
};

/**
 * updateAllFlags(result, src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} result
 * @param {number} src
 * @param {number} dst
 */
CPUStatePDP11.prototype.updateAllFlags = function(result, src, dst)
{
    if (!this.opFlags & PDP11.OPFLAG.SKIP_FLAGS) {
        this.flagN = this.flagZ = this.flagC = result;
        this.flagV = (src ^ dst) & (src ^ result);
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
 * @param {number} reason
 */
CPUStatePDP11.prototype.trap = function(vector, reason)
{
    var newPC, newPSW, doubleTrap = 0;
    if (this.trapPSW < 0) {
        this.trapPSW = this.getPSW();
    } else {
        if (!this.mmuMode) {
            vector = 4;
            doubleTrap = 1;
        }
    }
    //LOG_INSTRUCTION(vector, 11, "-trap-");
    if (!(this.MMR0 & 0xe000)) {
        this.MMR1 = 0xf6f6;
        this.MMR2 = vector;
    }
    this.mmuMode = 0;   // read from kernel D space
    if ((newPC = this.readWordByVirtual(vector | 0x10000)) >= 0) {
        if ((newPSW = this.readWordByVirtual(((vector + 2) & 0xffff) | 0x10000)) >= 0) {
            this.setPSW((newPSW & 0xcfff) | ((this.trapPSW >> 2) & 0x3000)); // set new this.PSW with previous mode
            if (doubleTrap) {
                this.CPU_Error |= 4;
                this.regsGen[6] = 4;
            }
            if (this.pushWord(this.trapPSW) >= 0 && this.pushWord(this.regsGen[7]) >= 0) {
                this.regsGen[7] = newPC;
            }
        }
    }
    this.opFlags &= ~PDP11.OPFLAG.TRAP_MASK;    // lose interest in traps after an abort
    this.trapPSW = -1;                          // reset flag that we have a trap within a trap
    throw vector | (reason << 8);
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
        if (this.MMR3 & 0x20) {
            unibusAddress = (this.unibusMap[idx] + (unibusAddress & 0x1ffe)) & 0x3ffffe;
            if (unibusAddress >= BusPDP11.IOPAGE_UNIBUS && unibusAddress < BusPDP11.IOPAGE_22BIT) this.panic(898);
        }
    } else {
        unibusAddress |= BusPDP11.IOPAGE_22BIT;
    }
    return unibusAddress;
};

/**
 * mapVirtualToPhysical(virtualAddress, accessMask)
 *
 * mapVirtualToPhysical() does memory management. It converts a 17 bit I/D
 * virtual address to a 22 bit physical address (Note: the eight pseudo addresses
 * for handling registers are NOT known at this level - those exist only for higher
 * level functions). A real PDP 11/70 memory management unit can be enabled separately
 * for read and write for diagnostic purposes. This is handled here by having by having
 * an enable mask (mmuEnable) which is tested against the operation access mask
 * (accessMask). If there is no match then the virtual address is simply mapped
 * as a 16 bit physical address with the upper page going to the IO address space.
 * Significant access mask values used are PDP11.READ_MODE and PDP11.WRITE_MODE
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
 * mmuMask[mmuMode] is used to control whether I/D space is active or not for
 * each address space. If separate I/D mapping is enabled then this mask will contain
 * 0xF to retain the I/D bit - or if not it will contain 0x7 to mask out the I/D bit.
 *
 * mmuMap[mmuMode] contains the memory map. Each entry has 32 values; 16 PDRs
 * (8 I space pages and 8 D space pages) followed by 16 PARs
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
 * @param {number} accessMask
 * @return {number}
 */
CPUStatePDP11.prototype.mapVirtualToPhysical = function(virtualAddress, accessMask)
{
    var page, pdr, physicalAddress, errorMask = 0;
    //if (virtualAddress & ~0x1ffff) this.panic(89);    // check VA range
    //if (!accessMask) this.panic(93);                  // Must have PDP11.READ_MODE or PDP11.WRITE_MODE
    if (!(accessMask & this.mmuEnable)) {
        physicalAddress = virtualAddress & 0xffff;      // virtual address without MMU is 16 bit (no I&D)
        this.mmuLastVirtual = physicalAddress;
        if (physicalAddress >= BusPDP11.IOPAGE_VIRT) {
            physicalAddress |= BusPDP11.IOPAGE_22BIT;
        } else { // no max_memory check in 16 bit mode
            if ((physicalAddress & 1) && !(accessMask & PDP11.BYTE_MODE)) {
                this.CPU_Error |= 0x40;
                this.trap(PDP11.TRAP.BUS_ERROR, 22);
            }
        }
        return physicalAddress;
    } else {
        this.mmuLastVirtual = virtualAddress;
        page = (virtualAddress >> 13) & this.mmuMask[this.mmuMode];
        pdr = this.mmuMap[this.mmuMode][page];
        physicalAddress = ((this.mmuMap[this.mmuMode][page + 16] << 6) + (virtualAddress & 0x1fff)) & 0x3fffff;
        if (this.MMR3 & 0x10) {                         // if 22 bit MM mode
            if (physicalAddress >= BusPDP11.IOPAGE_UNIBUS && physicalAddress < BusPDP11.IOPAGE_22BIT) {
                physicalAddress = this.mapUnibus(physicalAddress & 0x3ffff); // 18bit unibus space
            }
        } else {
            physicalAddress &= 0x3ffff;                 // truncate if only 18 bit mapping
            if (physicalAddress >= BusPDP11.IOPAGE_18BIT) physicalAddress |= BusPDP11.IOPAGE_22BIT;
        }
        if (physicalAddress < BusPDP11.IOPAGE_UNIBUS) {
            if (physicalAddress >= BusPDP11.MAX_MEMORY) {
                this.CPU_Error |= 0x20;
                this.trap(PDP11.TRAP.BUS_ERROR, 24);    // KB11-EM does this after ABORT handling - KB11-CM before
            }
            if ((physicalAddress & 1) && !(accessMask & PDP11.BYTE_MODE)) {
                this.CPU_Error |= 0x40;
                this.trap(PDP11.TRAP.BUS_ERROR, 26);
            }
        }
        switch (pdr & 0x7) {
        case 1:                         // read-only with trap
            errorMask = 0x1000;         // MMU trap
            /* falls through */
        case 2:                         // read-only
            pdr |= 0x80;                // Set A bit
            if (accessMask & PDP11.WRITE_MODE) {
                errorMask = 0x2000;     // read-only abort
            }
            break;
        case 4:                         // read-write with read-write trap
            errorMask = 0x1000;         // MMU trap
            /* falls through */
        case 5:                         // read-write with write trap
            if (accessMask & PDP11.WRITE_MODE) {
                errorMask = 0x1000;     // MMU trap
            }
            /* falls through */
        case 6:                         // read-write: set A & W bits
            pdr |= ((accessMask & PDP11.WRITE_MODE) ? 0xc0 : 0x80);
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

        this.mmuMap[this.mmuMode][page] = pdr;
        if ((physicalAddress !== 0x3fff7a) || this.mmuMode) { // MMR0 is 017777572
            this.mmuLastMode = this.mmuMode;
            this.mmuLastPage = page;
        }
        if (errorMask) {
            if (errorMask & 0xe000) {
                if (this.trapPSW >= 0) errorMask |= 0x80; // Instruction complete
                if (!(this.MMR0 & 0xe000)) {
                    this.MMR0 |= errorMask | (this.mmuLastMode << 5) | (this.mmuLastPage << 1);
                }
                this.trap(PDP11.TRAP.MMU_FAULT, 28);
            }
            if (!(this.MMR0 & 0xf000)) {
                //if (physicalAddress < 017772200 || physicalAddress > 017777677) {
                if (physicalAddress < 0x3ff480 || physicalAddress > 0x3fffbf) {
                    this.MMR0 |= 0x1000; // MMU trap flag
                    if (this.MMR0 & 0x0200) {
                        this.opFlags |= PDP11.OPFLAG.TRAP_MMU;
                    }
                }
            }
        }
        return physicalAddress;
    }
};

/**
 * readWordByAddr(physicalAddress)
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @return {number}
 */
CPUStatePDP11.prototype.readWordByAddr = function(physicalAddress)
{
    if (physicalAddress >= BusPDP11.MAX_ADDRESS) {
        return this.regsGen[physicalAddress - BusPDP11.MAX_ADDRESS];
	} else {
        // if (physicalAddress >= BusPDP11.IOPAGE_UNIBUS) {
        //    return this.bus.access_iopage(physicalAddress, -1, 0);
		// } else {
			if (physicalAddress >= 0) {
                return this.bus.getShort(physicalAddress);
			}
		// }
	}
    return physicalAddress;
};

/**
 * writeWordByAddr(physicalAddress, data)
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @param {number} data
 * @return {number}
 */
CPUStatePDP11.prototype.writeWordByAddr = function(physicalAddress, data)
{
    data &= 0xffff;
    if (physicalAddress >= BusPDP11.MAX_ADDRESS) {
        return (this.regsGen[physicalAddress - BusPDP11.MAX_ADDRESS] = data);
	} else {
        // if (physicalAddress >= BusPDP11.IOPAGE_UNIBUS) {
        //     return this.bus.access_iopage(physicalAddress, data, 0);
		// } else {
			if (physicalAddress >= 0) {
                this.bus.setShort(physicalAddress, data);
                return data;
			}
		// }
	}
	return physicalAddress;
};

/**
 * readByteByAddr(physicalAddress)
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @return {number}
 */
CPUStatePDP11.prototype.readByteByAddr = function(physicalAddress)
{
    var result;
    if (physicalAddress >= BusPDP11.MAX_ADDRESS) {
        return (this.regsGen[physicalAddress - BusPDP11.MAX_ADDRESS] & 0xff);
	} else {
        // if (physicalAddress >= BusPDP11.IOPAGE_UNIBUS) {
        //     return this.bus.access_iopage(physicalAddress, -1, 1);
		// } else {
			if (physicalAddress >= 0) {
				return this.bus.getByte(physicalAddress);
			}
		// }
	}
    return physicalAddress;
};

/**
 * writeByteByAddr(physicalAddress, data)
 *
 * @this {CPUStatePDP11}
 * @param {number} physicalAddress
 * @param {number} data
 * @return {number}
 */
CPUStatePDP11.prototype.writeByteByAddr = function(physicalAddress, data)
{
    data &= 0xff;
    if (physicalAddress >= BusPDP11.MAX_ADDRESS) {
        return (this.regsGen[physicalAddress - BusPDP11.MAX_ADDRESS] = (this.regsGen[physicalAddress - BusPDP11.MAX_ADDRESS] & 0xff00) | data);
	} else {
        // if (physicalAddress >= BusPDP11.IOPAGE_UNIBUS) {
        //     return this.bus.access_iopage(physicalAddress, data, 1);
		// } else {
			if (physicalAddress >= 0) {
			    this.bus.setByte(physicalAddress, data);
                return data;
			}
		// }
	}
    return physicalAddress;
};

/**
 * readWordByVirtual(virtualAddress)
 *
 * @this {CPUStatePDP11}
 * @param {number} virtualAddress (input address is 17 bit (I&D))
 */
CPUStatePDP11.prototype.readWordByVirtual = function(virtualAddress)
{
    return this.readWordByAddr(this.mapVirtualToPhysical(virtualAddress, PDP11.READ_MODE));
};

/**
 * popWord()
 *
 * @this {CPUStatePDP11}
 * @return {number}
 */
CPUStatePDP11.prototype.popWord = function()
{
    var result = this.readWordByVirtual(this.regsGen[6] | 0x10000);
    if (result >= 0) {
        this.regsGen[6] = (this.regsGen[6] + 2) & 0xffff;
    }
    return result;
};

/**
 * pushWord(data)
 *
 * @this {CPUStatePDP11}
 * @param {number} data
 * @return {number}
 */
CPUStatePDP11.prototype.pushWord = function(data)
{
    var physicalAddress, virtualAddress;
    this.regsGen[6] = virtualAddress = (this.regsGen[6] - 2) & 0xffff; // BSD needs SP updated before any fault :-(
    if (!(this.MMR0 & 0xe000)) {
        this.MMR1 = (this.MMR1 << 8) | 0xf6;
    }
    if ((!this.mmuMode) && virtualAddress <= this.stackLimit && virtualAddress > 4) {
        if (virtualAddress <= this.stackLimit - 32) {
            this.CPU_Error |= 4; // Red stack
            this.regsGen[6] = 4;
            this.trap(PDP11.TRAP.BUS_ERROR, 32);
        } else {
            this.CPU_Error |= 8; // Yellow
            this.opFlags |= 4;
        }
    }
    if ((physicalAddress = this.mapVirtualToPhysical(virtualAddress | 0x10000, PDP11.WRITE_MODE)) >= 0) {
        return this.writeWordByAddr(physicalAddress, data);
    }
    return physicalAddress;
};


/**
 * getVirtualByMode(addressMode, accessMode)
 *
 * getVirtualByMode() maps a six bit operand to a 17 bit I/D virtual address space.
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
 * @param {number} addressMode
 * @param {number} accessMode
 * @return {number}
 */
CPUStatePDP11.prototype.getVirtualByMode = function(addressMode, accessMode)
{
    var virtualAddress, stepSize, reg = addressMode & 7;

    switch ((addressMode >> 3) & 7) {
    case 0:                     // Mode 0: Registers don't have a virtual address so trap!
        this.trap(PDP11.TRAP.BUS_ERROR, 34);       // trap for invalid virtual address
        break;

    case 1:                     // Mode 1: (R)
        if (reg === 6 && (!this.mmuMode) && (accessMode & PDP11.WRITE_MODE) &&
            (this.regsGen[6] <= this.stackLimit || this.regsGen[6] >= 0xfffe)) {
            if (this.regsGen[6] <= this.stackLimit - 32 || this.regsGen[6] >= 0xfffe) {
                this.CPU_Error |= 4; // Red stack
                this.regsGen[6] = 4;
                this.trap(PDP11.TRAP.BUS_ERROR, 36);
            } else {
                this.CPU_Error |= 8; // Yellow
                this.opFlags |= PDP11.OPFLAG.TRAP_SP;
            }
        }
        return (reg === 7 ? this.regsGen[reg] : (this.regsGen[reg] | 0x10000));

    case 2:                     // Mode 2: (R)+
        stepSize = 2;
        virtualAddress = this.regsGen[reg];
        if (reg !== 7) {
            virtualAddress |= 0x10000;
            if (reg < 6 && (accessMode & PDP11.BYTE_MODE)) {
                stepSize = 1;
            }
        }
        break;
    case 3: // Mode 3: @(R)+
        stepSize = 2;
        virtualAddress = this.regsGen[reg];
        if (reg !== 7) virtualAddress |= 0x10000;
        if ((virtualAddress = this.readWordByVirtual(virtualAddress)) < 0) {
            return virtualAddress;
        }
        // if (reg === 7) LOG_ADDRESS(virtualAddress); // @#n not operational
        virtualAddress |= 0x10000;
        break;
    case 4: // Mode 4: -(R)
        stepSize = -2;
        if (reg < 6 && (accessMode & PDP11.BYTE_MODE)) stepSize = -1;
        virtualAddress = (this.regsGen[reg] + stepSize) & 0xffff;
        if (reg !== 7) {
            virtualAddress |= 0x10000;
        }
        break;
    case 5: // Mode 5: @-(R)
        stepSize = -2;
        virtualAddress = (this.regsGen[reg] - 2) & 0xffff;
        if (reg !== 7) virtualAddress |= 0x10000;
        if ((virtualAddress = this.readWordByVirtual(virtualAddress)) < 0) {
            return virtualAddress;
        }
        virtualAddress |= 0x10000;
        break;
    case 6: // Mode 6: d(R)
        if ((virtualAddress = this.readWordByVirtual(this.regsGen[7])) < 0) {
            return virtualAddress;
        }
        this.regsGen[7] = (this.regsGen[7] + 2) & 0xffff;
        if (reg < 7) {
            //LOG_ADDRESS(virtualAddress);
            virtualAddress = (virtualAddress + this.regsGen[reg]) & 0xffff;
        } else {
            virtualAddress = (virtualAddress + this.regsGen[reg]) & 0xffff;
            //LOG_ADDRESS(virtualAddress);
        }
        return virtualAddress | 0x10000;
    case 7: // Mode 7: @d(R)
        if ((virtualAddress = this.readWordByVirtual(this.regsGen[7])) < 0) {
            return virtualAddress;
        }
        this.regsGen[7] = (this.regsGen[7] + 2) & 0xffff;
        if (reg < 7) {
            //LOG_ADDRESS(virtualAddress);
            virtualAddress = (virtualAddress + this.regsGen[reg]) & 0xffff;
        } else {
            virtualAddress = (virtualAddress + this.regsGen[reg]) & 0xffff;
            //LOG_ADDRESS(virtualAddress);
        }
        if ((virtualAddress = this.readWordByVirtual(virtualAddress | 0x10000)) < 0) {
            return virtualAddress;
        }
        return virtualAddress | 0x10000; // @x
    }
    this.regsGen[reg] = (this.regsGen[reg] + stepSize) & 0xffff;
    if (!(this.MMR0 & 0xe000)) {
        this.MMR1 = (this.MMR1 << 8) | ((stepSize << 3) & 0xf8) | reg;
    }
    if (reg === 6 && (!this.mmuMode) && (accessMode & PDP11.WRITE_MODE) && stepSize <= 0 &&
        (this.regsGen[6] <= this.stackLimit || this.regsGen[6] >= 0xfffe)) {
        if (this.regsGen[6] <= this.stackLimit - 32) {
            this.CPU_Error |= 4; // Red stack
            this.regsGen[6] = 4;
            this.trap(PDP11.TRAP.BUS_ERROR, 38);
        } else {
            this.CPU_Error |= 8; // Yellow
            this.opFlags |= PDP11.OPFLAG.TRAP_SP;
        }
    }
    return virtualAddress;
};

/**
 * getAddrByMode(addressMode, accessMode)
 *
 * @this {CPUStatePDP11}
 * @param {number} addressMode
 * @param {number} accessMode
 * @return {number}
 */
CPUStatePDP11.prototype.getAddrByMode = function(addressMode, accessMode)
{
    var result;
    if (!(addressMode & 0x38)) {
        return BusPDP11.MAX_ADDRESS + (addressMode & 7); // Registers have special addresses above maximum address
    } else {
        if ((result = this.getVirtualByMode(addressMode, accessMode)) >= 0) {
            result = this.mapVirtualToPhysical(result, accessMode);
        }
        return result;
    }
};

/**
 * readWordByMode(addressMode)
 *
 * @this {CPUStatePDP11}
 * @param {number} addressMode
 * @return {number}
 */
CPUStatePDP11.prototype.readWordByMode = function(addressMode)
{
    var result;
    if (!(addressMode & PDP11.OPMODE.MASK)) {
        result = this.regsGen[addressMode & PDP11.OPREG.MASK];
    } else {
        var addr = this.getAddrByMode(addressMode, PDP11.READ_MODE);
        result = this.readWordByAddr(addr);
    }
    return result;
};

/**
 * readByteByMode(addressMode)
 *
 * @this {CPUStatePDP11}
 * @param {number} addressMode
 * @return {number}
 */
CPUStatePDP11.prototype.readByteByMode = function(addressMode)
{
    var result;
    if (!(addressMode & 0x38)) {
        result = this.regsGen[addressMode & 7] & 0xff;
        //LOG_SOURCE(result);
    } else {
        if ((result = this.getAddrByMode(addressMode, PDP11.READ_MODE | PDP11.BYTE_MODE)) >= 0) {
            if ((result = this.readByteByAddr(result)) >= 0) {
                //LOG_SOURCE(result);
            }
        }
    }
    return result;
};

/**
 * writeWordByMode(addressMode, data)
 *
 * @this {CPUStatePDP11}
 * @param {number} addressMode
 * @param {number} data
 * @return {number}
 */
CPUStatePDP11.prototype.writeWordByMode = function(addressMode, data)
{
    if (!(addressMode & PDP11.OPMODE.MASK)) {
        this.regsGen[addressMode & PDP11.OPREG.MASK] = data;
    } else {
        this.writeWordByAddr(this.getAddrByMode(addressMode, PDP11.WRITE_MODE), data);
    }
    return data;
};

/**
 * updateWordByMode(addressMode, src, fnOp)
 *
 * @this {CPUStatePDP11}
 * @param {number} addressMode
 * @param {number} src
 * @param {function(number,number)} fnOp
 * @return {number}
 */
CPUStatePDP11.prototype.updateWordByMode = function(addressMode, src, fnOp)
{
    var data;
    if (!(addressMode & PDP11.OPMODE.MASK)) {
        var reg = addressMode & PDP11.OPREG.MASK;
        this.regsGen[reg] = data = fnOp(src, this.regsGen[reg]);
    } else {
        var addr = this.getAddrByMode(addressMode, PDP11.WRITE_MODE);
        this.writeWordByAddr(addr, data = fnOp(src, this.readWordByAddr(addr)));
    }
    return data;
};

/**
 * branch(PC, instruction)
 *
 * @this {CPUStatePDP11}
 * @param {number} PC
 * @param {number} instruction
 * @return {number}
 */
CPUStatePDP11.prototype.branch = function(PC, instruction)
{
    if (instruction & 0x80) { /*0200*/
        instruction |= 0xff00;
    } else {
        instruction &= 0xff;
    }
    return ((instruction << 1) + PC) & 0xffff;
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

    /*
     * NOTE: If checkINTR() returns false, INTFLAG.HALT must be set, so no instructions should be executed.
     */
    if (this.checkINTR()) {
        do {
            if (DEBUGGER && fDebugCheck) {
                if (this.dbg.checkInstruction(this.getPC(), nDebugState)) {
                    this.stopCPU();
                    break;
                }
                nDebugState = 1;
            }

            var instruction,
                src,
                dst,
                dstAddr,
                result,
                virtualAddress, savePSW, reg, i, j;

            /*
             * Check for any pending traps.
             *
             * I've moved this TRAP_MASK check BEFORE we decode the next instruction instead
             * of immediately AFTER, because the last instruction may have thrown an exception,
             * kicking us out before we reach the bottom of this loop.
             */
            if (this.opFlags & PDP11.OPFLAG.TRAP_MASK) {
                if (this.opFlags & PDP11.OPFLAG.TRAP_MMU) {
                    this.trap(PDP11.TRAP.MMU_FAULT, 52);                // MMU trap has priority
                } else {
                    if (this.opFlags & PDP11.OPFLAG.TRAP_SP) {
                        this.trap(PDP11.TRAP.BUS_ERROR, 54);            // then SP trap
                    } else {
                        if (this.opFlags & PDP11.OPFLAG.TRAP_TF) {
                            this.trap(PDP11.TRAP.BREAKPOINT, 56);       // and finally a TF trap
                        }
                    }
                }
                this.opFlags &= ~PDP11.OPFLAG.TRAP_MASK;
            }

            if (this.priorityReview) {          // if nothing has changed don't check priority
                if (this.priorityReview === 1) {
                    this.priorityReview = 2;    // SPL delay
                } else {
                    this.priorityReview = 0;
                    j = -1;
                    savePSW = this.pir & 0xe0;
                    if ((i = this.interruptQueue.length) > 0) {
                        while (i-- > 0) {
                            if (this.interruptQueue[i].delay > 0) {
                                this.interruptQueue[i].delay--;
                                this.priorityReview = 2;
                                break;          // Decrement only one delay 'difference' per cycle
                            }
                            //if (typeof this.interruptQueue[i].callback !== "undefined") {
                            if (this.interruptQueue[i].callback) {
                                if (!this.interruptQueue[i].callback()) {
                                    this.interruptQueue.splice(i, 1);
                                    j--;
                                    continue;
                                }
                                //delete
                                this.interruptQueue[i].callback = null;
                            }
                            if (this.interruptQueue[i].priority > savePSW) {
                                savePSW = this.interruptQueue[i].priority;
                                j = i;
                            }
                        }
                    }
                    if (savePSW > (this.PSW & 0xe0)) {
                        if (j < 0) {
                            this.trap(PDP11.TRAP.PIRQ, 42);
                        } else {
                            this.trap(this.interruptQueue[j].vector, 44);
                            this.interruptQueue.splice(j, 1);
                        }
                    }
                }
            }

            if (!(this.MMR0 & 0xe000)) {
                this.MMR1 = 0;
                this.MMR2 = this.regsGen[7];
            }

            /*
             * Snapshot the TF bit in opFlags, while simultaneously clearing all other opFlags;
             * we'll check the TRAP_TF bit in opFlags when we come back around for another opcode.
             */
            this.opFlags = this.PSW & PDP11.PSW.TF;

            this.regOp = this.readWordByVirtual(this.regsGen[7]);
            this.regsGen[7] = (this.regsGen[7] + 2) & 0xffff;
            this.decode(this.regOp);

            if (this.regOp >= 0) {
                instruction = this.regOp;
                this.regsGen[7] = (this.regsGen[7] + 2) & 0xffff;

                switch (instruction & 0xF000) /*0170000*/ { // Double operand instructions xxSSDD
                // case 0x1000: /*0010000*/ // MOV  01SSDD
                //     //LOG_INSTRUCTION(instruction, 2, "MOV");
                //     if ((src = this.readWordByMode(instruction >> 6)) >= 0) {
                //         if (!(instruction & 0x38)) {
                //             this.regsGen[instruction & 7] = src;
                //             this.flagN = this.flagZ = src;
                //             this.flagV = 0;
                //         } else {
                //             if ((dstAddr = this.getAddrByMode(instruction, PDP11.WRITE_MODE)) >= 0) {
                //                 if (this.writeWordByAddr(dstAddr, src) >= 0) {
                //                     this.flagN = this.flagZ = src;
                //                     this.flagV = 0;
                //                 }
                //             }
                //         }
                //     }
                //     break;
                // case 0x2000: /*0020000*/ // CMP 02SSDD
                //     //LOG_INSTRUCTION(instruction, 2, "CMP");
                //     if ((src = this.readWordByMode(instruction >> 6)) >= 0) {
                //         if ((dst = this.readWordByMode(instruction)) >= 0) {
                //             result = src - dst;
                //             this.flagN = this.flagZ = this.flagC = result;
                //             this.flagV = (src ^ dst) & (src ^ result);
                //         }
                //     }
                //     break;
                // case 0x3000: /*0030000*/ // BIT 03SSDD
                //     //LOG_INSTRUCTION(instruction, 2, "BIT");
                //     if ((src = this.readWordByMode(instruction >> 6)) >= 0) {
                //         if ((dst = this.readWordByMode(instruction)) >= 0) {
                //             this.flagN = this.flagZ = src & dst;
                //             this.flagV = 0;
                //         }
                //     }
                //     break;
                // case 0x4000: /*0040000*/ // BIC 04SSDD
                //     //LOG_INSTRUCTION(instruction, 2, "BIC");
                //     if ((src = this.readWordByMode(instruction >> 6)) >= 0) {
                //         if (!(instruction & 0x38)) {
                //             result = this.regsGen[instruction & 7] &= ~src;
                //             this.flagN = this.flagZ = result;
                //             this.flagV = 0;
                //         } else {
                //             if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >= 0) {
                //                 result = dst & ~src;
                //                 if (this.writeWordByAddr(dstAddr, result) >= 0) {
                //                     this.flagN = this.flagZ = result;
                //                     this.flagV = 0;
                //                 }
                //             }
                //         }
                //     }
                //     break;
                case 0x5000: /*0050000*/ // BIS 05SSDD
                    //LOG_INSTRUCTION(instruction, 2, "BIS");
                    if ((src = this.readWordByMode(instruction >> 6)) >= 0) {
                        if (!(instruction & 0x38)) {
                            result = this.regsGen[instruction & 7] |= src;
                            this.flagN = this.flagZ = result;
                            this.flagV = 0;
                        } else {
                            if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >= 0) {
                                result = dst | src;
                                if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                    this.flagN = this.flagZ = result;
                                    this.flagV = 0;
                                }
                            }
                        }
                    }
                    break;
                case 0x6000: /*0060000*/ // ADD 06SSDD
                    //LOG_INSTRUCTION(instruction, 2, "ADD");
                    if ((src = this.readWordByMode(instruction >> 6)) >= 0) {
                        if (!(instruction & 0x38)) {
                            reg = instruction & 7;
                            dst = this.regsGen[reg];
                            this.regsGen[reg] = (result = src + dst) & 0xffff;
                            this.flagN = this.flagZ = this.flagC = result;
                            this.flagV = (src ^ result) & (dst ^ result);
                        } else {
                            if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >= 0) {
                                result = src + dst;
                                if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                    this.flagN = this.flagZ = this.flagC = result;
                                    this.flagV = (src ^ result) & (dst ^ result);
                                }
                            }
                        }
                    }
                    break;
                case 0x9000: /*0110000*/ // MOVB 11SSDD
                    //LOG_INSTRUCTION(instruction, 2, "MOVB");
                    if ((src = this.readByteByMode(instruction >> 6)) >= 0) {
                        if (!(instruction & 0x38)) {
                            if (src & 0x80) /*0200*/ src |= 0xff00; // movb sign extends register to word size
                            this.regsGen[instruction & 7] = src;
                            this.flagN = this.flagZ = src;
                            this.flagV = 0;
                        } else {
                            if ((dstAddr = this.getAddrByMode(instruction, PDP11.WRITE_MODE | PDP11.BYTE_MODE)) >= 0) { // write byte
                                if (this.writeByteByAddr(dstAddr, src) >= 0) {
                                    this.flagN = this.flagZ = src << 8;
                                    this.flagV = 0;
                                }
                            }
                        }
                    }
                    break;
                case 0xA000: /*0120000*/ // CMPB 12SSDD
                    //LOG_INSTRUCTION(instruction, 2, "CMPB");
                    if ((src = this.readByteByMode(instruction >> 6)) >= 0) {
                        if ((dst = this.readByteByMode(instruction)) >= 0) {
                            result = src - dst;
                            this.flagN = this.flagZ = this.flagC = result << 8;
                            this.flagV = ((src ^ dst) & (src ^ result)) << 8;
                        }
                    }
                    break;
                case 0xB000: /*0130000*/ // BITB 13SSDD
                    //LOG_INSTRUCTION(instruction, 2, "BITB");
                    if ((src = this.readByteByMode(instruction >> 6)) >= 0) {
                        if ((dst = this.readByteByMode(instruction)) >= 0) {
                            this.flagN = this.flagZ = (src & dst) << 8;
                            this.flagV = 0;
                        }
                    }
                    break;
                case 0xC000: /*0140000*/ // BICB 14SSDD
                    //LOG_INSTRUCTION(instruction, 2, "BICB");
                    if ((src = this.readByteByMode(instruction >> 6)) >= 0) {
                        if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >= 0) {
                            result = dst & ~src;
                            if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                this.flagN = this.flagZ = result << 8;
                                this.flagV = 0;
                            }
                        }
                    }
                    break;
                case 0xD000: /*0150000*/ // BISB 15SSDD
                    //LOG_INSTRUCTION(instruction, 2, "BISB");
                    if ((src = this.readByteByMode(instruction >> 6)) >= 0) {
                        if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >= 0) {
                            result = dst | src;
                            if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                this.flagN = this.flagZ = result << 8;
                                this.flagV = 0;
                            }
                        }
                    }
                    break;
                case 0xE000: /*0160000*/ // SUB 16SSDD
                    //LOG_INSTRUCTION(instruction, 2, "SUB");
                    if ((src = this.readWordByMode(instruction >> 6)) >= 0) {
                        if (!(instruction & 0x38)) {
                            reg = instruction & 7;
                            dst = this.regsGen[reg];
                            this.regsGen[reg] = (result = dst - src) & 0xffff;
                            this.flagN = this.flagZ = this.flagC = result;
                            this.flagV = (src ^ dst) & (dst ^ result);
                        } else {
                            if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >= 0) {
                                result = dst - src;
                                if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                    this.flagN = this.flagZ = this.flagC = result;
                                    this.flagV = (src ^ dst) & (dst ^ result);
                                }
                            }
                        }
                    }
                    break;
                default:
                    switch (instruction & 0xFE00) /*0177000*/ { // Misc instructions xxRDD
                    case 0x800: /*04000*/ // JSR 004RDD
                        //LOG_INSTRUCTION(instruction, 3, "JSR");
                        if ((virtualAddress = this.getVirtualByMode(instruction, 0)) >= 0) {
                            reg = (instruction >> 6) & 7;
                            if (this.pushWord(this.regsGen[reg]) >= 0) {
                                this.regsGen[reg] = this.regsGen[7];
                                this.regsGen[7] = virtualAddress & 0xffff;
                            }
                        }
                        break;
                    case 0x7000: /*0070000*/ // MUL 070RSS
                        //LOG_INSTRUCTION(instruction, 3, "MUL");
                        if ((src = this.readWordByMode(instruction)) >= 0) {
                            reg = (instruction >> 6) & 7;
                            if (src & 0x8000) src |= ~0xffff;
                            dst = this.regsGen[reg];
                            if (dst & 0x8000) dst |= ~0xffff;
                            result = ~~(src * dst);
                            this.regsGen[reg] = (result >> 16) & 0xffff;
                            this.regsGen[reg | 1] = result & 0xffff;
                            this.flagN = result >> 16;
                            this.flagZ = this.flagN | result;
                            this.flagC = this.flagV = 0;
                            if (result < -32768 || result > 32767) this.flagC = 0x10000;
                        }
                        break;
                    case 0x7200: /*0071000*/ // DIV 071RSS
                        //LOG_INSTRUCTION(instruction, 3, "DIV");
                        if ((src = this.readWordByMode(instruction)) >= 0) {
                            if (!src) {
                                this.flagN = 0; // NZVC
                                this.flagZ = 0;
                                this.flagV = 0x8000;
                                this.flagC = 0x10000; // divide by zero
                            } else {
                                reg = (instruction >> 6) & 7;
                                dst = (this.regsGen[reg] << 16) | this.regsGen[reg | 1];
                                this.flagC = this.flagV = 0;
                                if (src & 0x8000) src |= ~0xffff;
                                result = ~~(dst / src);
                                if (result >= -32768 && result <= 32767) {
                                    this.regsGen[reg] = result & 0xffff;
                                    this.regsGen[reg | 1] = (dst - (result * src)) & 0xffff;
                                    this.flagZ = (result >> 16) | result;
                                    this.flagN = result >> 16;
                                } else {
                                    this.flagV = 0x8000; // overflow - following are indeterminate
                                    this.flagZ = (result >> 15) | result; // dodgy
                                    this.flagN = dst >> 16; // just as dodgy
                                    if (src === -1 && this.regsGen[reg] ===
                                        0xfffe) this.regsGen[reg] = this.regsGen[reg | 1] = 1; // etc
                                }
                            }
                        }
                        break;
                    case 0x7400: /*072000*/ // ASH 072RSS
                        //LOG_INSTRUCTION(instruction, 3, "ASH");
                        if ((src = this.readWordByMode(instruction)) >= 0) {
                            reg = (instruction >> 6) & 7;
                            result = this.regsGen[reg];
                            if (result & 0x8000) result |= 0xffff0000;
                            this.flagC = this.flagV = 0;
                            src &= 0x3F; /*077*/
                            if (src & 0x20) /*040*/ { // shift right
                                src = 64 - src;
                                if (src > 16) src = 16;
                                this.flagC = result << (17 - src);
                                result = result >> src;
                            } else {
                                if (src) {
                                    if (src > 16) {
                                        this.flagV = result;
                                        result = 0;
                                    } else {
                                        result = result << src;
                                        this.flagC = result;
                                        dst = (result >> 15) & 0xffff; // check successive sign bits
                                        if (dst && dst !== 0xffff) this.flagV = 0x8000;
                                    }
                                }
                            }
                            this.regsGen[reg] = result & 0xffff;
                            this.flagN = this.flagZ = result;
                        }
                        break;
                    case 0x7600: /*073000*/ // ASHC 073RSS
                        //LOG_INSTRUCTION(instruction, 3, "ASHC");
                        if ((src = this.readWordByMode(instruction)) >= 0) {
                            reg = (instruction >> 6) & 7;
                            dst = (this.regsGen[reg] << 16) | this.regsGen[reg | 1];
                            this.flagC = this.flagV = 0;
                            src &= 0x3F; /*077*/
                            if (src & 0x20) /*040*/ {
                                src = 64 - src;
                                if (src > 32) src = 32;
                                result = dst >> (src - 1);
                                this.flagC = result << 16;
                                result >>= 1;
                                if (dst & 0x80000000) result |= 0xffffffff << (32 - src);
                            } else {
                                if (src) { // shift left
                                    result = dst << (src - 1);
                                    this.flagC = result >> 15;
                                    result <<= 1;
                                    if (src > 32) src = 32;
                                    dst = dst >> (32 - src);
                                    if (dst) {
                                        dst |= (0xffffffff << src) & 0xffffffff;
                                        if (dst !== 0xffffffff) this.flagV = 0x8000;
                                    }
                                } else {
                                    result = dst;
                                }
                            }
                            this.regsGen[reg] = (result >> 16) & 0xffff;
                            this.regsGen[reg | 1] = result & 0xffff;
                            this.flagN = result >> 16;
                            this.flagZ = result >> 16 | result;
                        }
                        break;
                    case 0x7800: /*0074000*/ // XOR 074RSS
                        //LOG_INSTRUCTION(instruction, 3, "XOR");
                        if (!(instruction & 0x38)) {
                            dst = this.regsGen[instruction & 7] ^= this.regsGen[(instruction >> 6) & 7];
                            this.flagN = this.flagZ = dst;
                            this.flagV = 0;
                        } else {
                            if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >= 0) {
                                dst ^= this.regsGen[(instruction >> 6) & 7];
                                if (this.writeWordByAddr(dstAddr, dst) >= 0) {
                                    this.flagN = this.flagZ = dst;
                                    this.flagV = 0;
                                }
                            }
                        }
                        break;
                    case 0x7E00: /*0077000*/ // SOB 077Rnn
                        //LOG_INSTRUCTION(instruction, 5, "SOB");
                        reg = (instruction >> 6) & 7;
                        if ((this.regsGen[reg] = ((this.regsGen[reg] - 1) & 0xffff))) {
                            this.regsGen[7] = (this.regsGen[7] - ((instruction & 0x3F) /*077*/ << 1)) & 0xffff;
                        }
                        break;
                    default:
                        switch (instruction & 0xFF00) /*0177400*/ { // Program control instructions & traps
                        case 0x100: /*0000400*/ // BR
                            //LOG_INSTRUCTION(instruction, 4, "BR");
                            this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x200: /*0001000*/ // BNE
                            //LOG_INSTRUCTION(instruction, 4, "BNE");
                            if (this.flagZ & 0xffff) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x300: /*0001400*/ // BEQ
                            //LOG_INSTRUCTION(instruction, 4, "BEQ");
                            if (!(this.flagZ & 0xffff)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x400: /*0002000*/ // BGE
                            //LOG_INSTRUCTION(instruction, 4, "BGE");
                            if ((this.flagN & 0x8000) ===
                                (this.flagV & 0x8000)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x500: /*0002400*/ // BLT
                            //LOG_INSTRUCTION(instruction, 4, "BLT");
                            if ((this.flagN & 0x8000) !==
                                (this.flagV & 0x8000)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x600: /*0003000*/ // BGT
                            //LOG_INSTRUCTION(instruction, 4, "BGT");
                            if ((this.flagZ & 0xffff) && ((this.flagN & 0x8000) ===
                                (this.flagV & 0x8000))) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x700: /*0003400*/ // BLE
                            //LOG_INSTRUCTION(instruction, 4, "BLE");
                            if (!(this.flagZ & 0xffff) || ((this.flagN & 0x8000) !==
                                (this.flagV & 0x8000))) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8000: /*0100000*/ // BPL
                            //LOG_INSTRUCTION(instruction, 4, "BPL");
                            if (!(this.flagN & 0x8000)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8200: /*0101000*/ // BHI
                            //LOG_INSTRUCTION(instruction, 4, "BHI");
                            if (!(this.flagC & 0x10000) &&
                                (this.flagZ & 0xffff)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8100: /*0100400*/ // BMI
                            //LOG_INSTRUCTION(instruction, 4, "BMI");
                            if ((this.flagN & 0x8000)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8300: /*0101400*/ // BLOS
                            //LOG_INSTRUCTION(instruction, 4, "BLOS");
                            if ((this.flagC & 0x10000) ||
                                !(this.flagZ & 0xffff)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8400: /*0102000*/ // BVC
                            //LOG_INSTRUCTION(instruction, 4, "BVC");
                            if (!(this.flagV & 0x8000)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8500: /*0102400*/ // BVS
                            //LOG_INSTRUCTION(instruction, 4, "BVS");
                            if ((this.flagV & 0x8000)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8600: /*0103000*/ // BCC
                            //LOG_INSTRUCTION(instruction, 4, "BCC");
                            if (!(this.flagC &
                                0x10000)) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8700: /*0103400*/ // BCS
                            //LOG_INSTRUCTION(instruction, 4, "BCS");
                            if (this.flagC & 0x10000) this.regsGen[7] = this.branch(this.regsGen[7], instruction);
                            break;
                        case 0x8800: /*0104000*/ // EMT 104000 -> 104377
                            //LOG_INSTRUCTION(instruction, 7, "EMT");
                            this.trap(PDP11.TRAP.EMULATOR, /*030*/ 2);
                            break;
                        case 0x8900: /*0104400*/ // TRAP 104400 -> 104777
                            //LOG_INSTRUCTION(instruction, 7, "TRAP");
                            this.trap(PDP11.TRAP.TRAP, /*034*/ 4);
                            break;
                        default:
                            switch (instruction & 0xFFC0) /*0177700*/ { // Single operand instructions xxxxDD
                            case 0x40: /*0000100*/ // JMP 0001DD
                                //LOG_INSTRUCTION(instruction, 1, "JMP");
                                if ((virtualAddress = this.getVirtualByMode(instruction, 0)) >= 0) {
                                    this.regsGen[7] = virtualAddress & 0xffff;
                                }
                                break;
                            case 0xC0: /*0000300*/ // SWAB 0003DD
                                //LOG_INSTRUCTION(instruction, 1, "SWAB");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    dst = this.regsGen[reg];
                                    this.regsGen[reg] = ((dst << 8) | (dst >> 8)) & 0xffff;
                                    this.flagN = this.flagZ = dst & 0xff00;
                                    this.flagV = this.flagC = 0;
                                } else {
                                    if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                        0) {
                                        result = (dst << 8) | (dst >> 8);
                                        if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                            this.flagN = this.flagZ = dst & 0xff00;
                                            this.flagV = this.flagC = 0;
                                        }
                                    }
                                }
                                break;
                            case 0xA00: /*0005000*/ // CLR 0050DD
                                //LOG_INSTRUCTION(instruction, 1, "CLR");
                                if (!(instruction & 0x38)) {
                                    this.regsGen[instruction & 7] = 0;
                                    this.flagN = this.flagC = this.flagV = this.flagZ = 0;
                                } else {
                                    if ((dstAddr = this.getAddrByMode(instruction, PDP11.WRITE_MODE)) >= 0) { // write word
                                        if (this.writeWordByAddr(dstAddr, 0) >= 0) {
                                            this.flagN = this.flagC = this.flagV = this.flagZ = 0;
                                        }
                                    }
                                }
                                break;
                            case 0xA40: /*0005100*/ // COM 0051DD
                                //LOG_INSTRUCTION(instruction, 1, "COM");
                                if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                    0) {
                                    result = ~dst;
                                    if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                        this.flagN = this.flagZ = result;
                                        this.flagC = 0x10000;
                                        this.flagV = 0;
                                    }
                                }
                                break;
                            case 0xA80: /*0005200*/ // INC 0052DD
                                //LOG_INSTRUCTION(instruction, 1, "INC");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    dst = this.regsGen[reg];
                                    result = dst + 1;
                                    this.regsGen[reg] = result & 0xffff;
                                    this.flagN = this.flagZ = result;
                                    this.flagV = result & (result ^ dst);
                                } else {
                                    if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                        0) {
                                        result = dst + 1;
                                        if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                            this.flagN = this.flagZ = result;
                                            this.flagV = result & (result ^ dst);
                                        }
                                    }
                                }
                                break;
                            case 0xAC0: /*0005300*/ // DEC 0053DD
                                //LOG_INSTRUCTION(instruction, 1, "DEC");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    dst = this.regsGen[reg];
                                    result = dst - 1;
                                    this.regsGen[reg] = result & 0xffff;
                                    this.flagN = this.flagZ = result;
                                    this.flagV = (result ^ dst) & dst;
                                } else {
                                    if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                        0) {
                                        result = dst - 1;
                                        if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                            this.flagN = this.flagZ = result;
                                            this.flagV = (result ^ dst) & dst;
                                        }
                                    }
                                }
                                break;
                            case 0xB00: /*0005400*/ // NEG 0054DD
                                //LOG_INSTRUCTION(instruction, 1, "NEG");
                                if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                    0) {
                                    result = -dst;
                                    if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                        this.flagC = this.flagN = this.flagZ = result;
                                        this.flagV = result & dst;
                                    }
                                }
                                break;
                            case 0xB40: /*0005500*/ // ADC 0055DD
                                //LOG_INSTRUCTION(instruction, 1, "ADC");
                                if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                    0) {
                                    result = dst + ((this.flagC >> 16) & 1);
                                    if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                        this.flagC = this.flagN = this.flagZ = result;
                                        this.flagV = result & (result ^ dst);
                                    }
                                }
                                break;
                            case 0xB80: /*0005600*/ // SBC 0056DD
                                //LOG_INSTRUCTION(instruction, 1, "SBC");
                                if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                    0) {
                                    result = dst - ((this.flagC >> 16) & 1);
                                    if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                        this.flagC = this.flagN = this.flagZ = result;
                                        this.flagV = (result ^ dst) & dst;
                                    }
                                }
                                break;
                            case 0xBC0: /*0005700*/ // TST 0057DD
                                //LOG_INSTRUCTION(instruction, 1, "TST");
                                if ((dst = this.readWordByMode(instruction)) >= 0) {
                                    this.flagN = this.flagZ = dst;
                                    this.flagC = this.flagV = 0;
                                }
                                break;
                            case 0xC00: /*0006000*/ // ROR 0060DD
                                //LOG_INSTRUCTION(instruction, 1, "ROR");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    dst = this.regsGen[reg];
                                    result = ((this.flagC & 0x10000) | dst) >> 1;
                                    this.regsGen[reg] = result & 0xffff;
                                    this.flagC = (dst << 16);
                                    this.flagN = this.flagZ = result;
                                    this.flagV = result ^ (this.flagC >> 1);
                                } else {
                                    if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                        0) {
                                        result = ((this.flagC & 0x10000) | dst) >> 1;
                                        if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                            this.flagC = (dst << 16);
                                            this.flagN = this.flagZ = result;
                                            this.flagV = result ^ (this.flagC >> 1);
                                        }
                                    }
                                }
                                break;
                            case 0xC40: /*0006100*/ // ROL 0061DD
                                //LOG_INSTRUCTION(instruction, 1, "ROL");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    dst = this.regsGen[reg];
                                    result = (dst << 1) | ((this.flagC >> 16) & 1);
                                    this.regsGen[reg] = result & 0xffff;
                                    this.flagC = this.flagN = this.flagZ = result;
                                    this.flagV = result ^ dst;
                                } else {
                                    if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                        0) {
                                        result = (dst << 1) | ((this.flagC >> 16) & 1);
                                        if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                            this.flagC = this.flagN = this.flagZ = result;
                                            this.flagV = result ^ dst;
                                        }
                                    }
                                }
                                break;
                            case 0xC80: /*0006200*/ // ASR 0062DD
                                //LOG_INSTRUCTION(instruction, 1, "ASR");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    dst = this.regsGen[reg];
                                    result = (dst & 0x8000) | (dst >> 1);
                                    this.regsGen[reg] = result & 0xffff;
                                    this.flagC = dst << 16;
                                    this.flagN = this.flagZ = result;
                                    this.flagV = this.flagN ^ (this.flagC >> 1);
                                } else {
                                    if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                        0) {
                                        result = (dst & 0x8000) | (dst >> 1);
                                        if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                            this.flagC = dst << 16;
                                            this.flagN = this.flagZ = result;
                                            this.flagV = this.flagN ^ (this.flagC >> 1);
                                        }
                                    }
                                }
                                break;
                            case 0xCC0: /*0006300*/ // ASL 0063DD
                                //LOG_INSTRUCTION(instruction, 1, "ASL");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    dst = this.regsGen[reg];
                                    result = dst << 1;
                                    this.regsGen[reg] = result & 0xffff;
                                    this.flagC = this.flagN = this.flagZ = result;
                                    this.flagV = result ^ dst;
                                } else {
                                    if ((dst = this.readWordByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_WORD))) >=
                                        0) {
                                        result = dst << 1;
                                        if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                            this.flagC = this.flagN = this.flagZ = result;
                                            this.flagV = result ^ dst;
                                        }
                                    }
                                }
                                break;
                            case 0xD00: /*0006400*/ // MARK 0064nn
                                //LOG_INSTRUCTION(instruction, 8, "MARK");
                                virtualAddress = (this.regsGen[7] + ((instruction & 0x3F) /*077*/ << 1)) & 0xffff;
                                if ((src = this.readWordByVirtual(virtualAddress | 0x10000)) >= 0) {
                                    this.regsGen[7] = this.regsGen[5];
                                    this.regsGen[5] = src;
                                    this.regsGen[6] = (virtualAddress + 2) & 0xffff;
                                }
                                break;
                            case 0xD40: /*0006500*/ // MFPI 0065SS
                                //LOG_INSTRUCTION(instruction, 1, "MFPI");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    if (6 !== reg || ((this.PSW >> 2) & 0x3000) === (this.PSW & 0x3000)) {
                                        src = this.regsGen[reg];
                                    } else {
                                        src = this.regsAltStack[(this.PSW >> 12) & 3];
                                    }
                                    if (this.pushWord(src) >= 0) {
                                        this.flagN = this.flagZ = src;
                                        this.flagV = 0;
                                    }
                                } else {
                                    if ((virtualAddress = this.getVirtualByMode(instruction, 0)) >= 0) {
                                        if ((this.PSW & 0xf000) !== 0xf000) virtualAddress &= 0xffff;
                                        this.mmuMode = (this.PSW >> 12) & 3;
                                        if ((src = this.readWordByVirtual(virtualAddress)) >= 0) {
                                            this.mmuMode = (this.PSW >> 14) & 3;
                                            if (this.pushWord(src) >= 0) {
                                                this.flagN = this.flagZ = src;
                                                this.flagV = 0;
                                            }
                                        }
                                    }
                                }
                                break;
                            case 0xD80: /*0006600*/ // MTPI 0066DD
                                //LOG_INSTRUCTION(instruction, 1, "MTPI");
                                if ((dst = this.popWord()) >= 0) {
                                    if (!(this.MMR0 & 0xe000)) this.MMR1 = 0x16; /*026*/
                                    if (!(instruction & 0x38)) {
                                        reg = instruction & 7;
                                        if (6 !== reg || ((this.PSW >> 2) & 0x3000) === (this.PSW & 0x3000)) {
                                            this.regsGen[reg] = dst;
                                        } else {
                                            this.regsAltStack[(this.PSW >> 12) & 3] = dst;
                                        }
                                        this.flagN = this.flagZ = dst;
                                        this.flagV = 0;
                                    } else {
                                        if ((virtualAddress = this.getVirtualByMode(instruction, 0)) >= 0) {
                                            virtualAddress &= 0xffff;
                                            this.mmuMode = (this.PSW >> 12) & 3;
                                            if ((dstAddr = this.mapVirtualToPhysical(virtualAddress, PDP11.WRITE_MODE)) >= 0) {
                                                this.mmuMode = (this.PSW >> 14) & 3;
                                                if (this.writeWordByAddr(dstAddr, dst) >= 0) {
                                                    this.flagN = this.flagZ = dst;
                                                    this.flagV = 0;
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                            case 0xDC0: /*0006700*/ // SXT 0067DD
                                //LOG_INSTRUCTION(instruction, 1, "SXT");
                                if ((dstAddr = this.getAddrByMode(instruction, PDP11.WRITE_MODE)) >= 0) { // write word
                                    result = -((this.flagN >> 15) & 1);
                                    if (this.writeWordByAddr(dstAddr, result) >= 0) {
                                        this.flagZ = result;
                                        this.flagV = 0;
                                    }
                                }
                                break;
                            case 0x8A00: /*0105000*/ // CLRB 1050DD
                                //LOG_INSTRUCTION(instruction, 1, "CLRB");
                                if (!(instruction & 0x38)) {
                                    this.regsGen[instruction & 7] &= 0xff00;
                                    this.flagN = this.flagC = this.flagV = this.flagZ = 0;
                                } else {
                                    if ((dstAddr = this.getAddrByMode(instruction, PDP11.WRITE_MODE | PDP11.BYTE_MODE)) >= 0) { // write byte
                                        if (this.writeByteByAddr(dstAddr, 0) >= 0) {
                                            this.flagN = this.flagC = this.flagV = this.flagZ = 0;
                                        }
                                    }
                                }
                                break;
                            case 0x8A40: /*0105100*/ // COMB 1051DD
                                //LOG_INSTRUCTION(instruction, 1, "COMB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = ~dst;
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagN = this.flagZ = result << 8;
                                        this.flagC = 0x10000;
                                        this.flagV = 0;
                                    }
                                }
                                break;
                            case 0x8A80: /*0105200*/ // INCB 1052DD
                                //LOG_INSTRUCTION(instruction, 1, "INCB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = dst + 1;
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagN = this.flagZ = result << 8;
                                        this.flagV = (result & (result ^ dst)) << 8;
                                    }
                                }
                                break;
                            case 0x8AC0: /*0105300*/ // DECB 1053DD
                                //LOG_INSTRUCTION(instruction, 1, "DECB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = dst - 1;
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagN = this.flagZ = result << 8;
                                        this.flagV = ((result ^ dst) & dst) << 8;
                                    }
                                }
                                break;
                            case 0x8B00: /*0105400*/ // NEGB 1054DD
                                //LOG_INSTRUCTION(instruction, 1, "NEGB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = -dst;
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagC = this.flagN = this.flagZ = result << 8;
                                        this.flagV = (result & dst) << 8;
                                    }
                                }
                                break;
                            case 0x8B40: /*0105500*/ // ADCB 01055DD
                                //LOG_INSTRUCTION(instruction, 1, "ADCB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = dst + ((this.flagC >> 16) & 1);
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagN = this.flagZ = this.flagC = result << 8;
                                        this.flagV = (result & (result ^ dst)) << 8;
                                    }
                                }
                                break;
                            case 0x8B80: /*0105600*/ // SBCB 01056DD
                                //LOG_INSTRUCTION(instruction, 1, "SBCB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = dst - ((this.flagC >> 16) & 1);
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagN = this.flagZ = this.flagC = result << 8;
                                        this.flagV = ((result ^ dst) & dst) << 8;
                                    }
                                }
                                break;
                            case 0x8BC0: /*0105700*/ // TSTB 1057DD
                                //LOG_INSTRUCTION(instruction, 1, "TSTB");
                                if ((dst = this.readByteByMode(instruction)) >= 0) {
                                    this.flagN = this.flagZ = dst << 8;
                                    this.flagC = this.flagV = 0;
                                }
                                break;
                            case 0x8C00: /*0106000*/ // RORB 1060DD
                                //LOG_INSTRUCTION(instruction, 1, "RORB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = (((this.flagC & 0x10000) >> 8) | dst) >> 1;
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagC = (dst << 16);
                                        this.flagN = this.flagZ = (result << 8);
                                        this.flagV = this.flagN ^ (this.flagC >> 1);
                                    }
                                }
                                break;
                            case 0x8C40: /*0106100*/ // ROLB 1061DD
                                //LOG_INSTRUCTION(instruction, 1, "ROLB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = (dst << 1) | ((this.flagC >> 16) & 1);
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagC = this.flagN = this.flagZ = result << 8;
                                        this.flagV = (result ^ dst) << 8;
                                    }
                                }
                                break;
                            case 0x8C80: /*0106200*/ // ASRB 1062DD
                                //LOG_INSTRUCTION(instruction, 1, "ASRB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = (dst & 0x80) | (dst >> 1);
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagC = dst << 16;
                                        this.flagN = this.flagZ = result << 8;
                                        this.flagV = this.flagN ^ (this.flagC >> 1);
                                    }
                                }
                                break;
                            case 0x8CC0: /*0106300*/ // ASLB 1063DD
                                //LOG_INSTRUCTION(instruction, 1, "ASLB");
                                if ((dst = this.readByteByAddr(dstAddr = this.getAddrByMode(instruction, PDP11.MODIFY_BYTE))) >=
                                    0) {
                                    result = dst << 1;
                                    if (this.writeByteByAddr(dstAddr, result) >= 0) {
                                        this.flagC = this.flagN = this.flagZ = result << 8;
                                        this.flagV = (result ^ dst) << 8;
                                    }
                                }
                                break;
                                //case 0106400: // MTPS 1064SS
                                //    //LOG_INSTRUCTION(instruction, 1, "MTPS");
                                //    if ((src = this.readByteByMode(instruction)) >= 0) {
                                //        this.setPSW((this.PSW & 0xff00) | (src & 0xef));
                                //    } // Temporary PDP 11/34A
                                //    break;
                            case 0x8D40: /*0106500*/ // MFPD 1065DD
                                //LOG_INSTRUCTION(instruction, 1, "MFPD");
                                if (!(instruction & 0x38)) {
                                    reg = instruction & 7;
                                    if (6 !== reg || ((this.PSW >> 2) & 0x3000) === (this.PSW & 0x3000)) {
                                        src = this.regsGen[reg];
                                    } else {
                                        src = this.regsAltStack[(this.PSW >> 12) & 3];
                                    }
                                    if (this.pushWord(src) >= 0) {
                                        this.flagN = this.flagZ = src;
                                        this.flagV = 0;
                                    }
                                } else {
                                    if ((virtualAddress = this.getVirtualByMode(instruction, 0)) >= 0) {
                                        this.mmuMode = (this.PSW >> 12) & 3;
                                        if ((src = this.readWordByVirtual(virtualAddress | 0x10000)) >= 0) {
                                            this.mmuMode = (this.PSW >> 14) & 3;
                                            if (this.pushWord(src) >= 0) {
                                                this.flagN = this.flagZ = src;
                                                this.flagV = 0;
                                            }
                                        }
                                    }
                                }
                                break;
                            case 0x8D80: /*0106600*/ // MTPD 1066DD
                                //LOG_INSTRUCTION(instruction, 1, "MTPD");
                                if ((dst = this.popWord()) >= 0) {
                                    if (!(this.MMR0 & 0xe000)) this.MMR1 = 0x16; /*026*/
                                    if (!(instruction & 0x38)) {
                                        reg = instruction & 7;
                                        if (6 !== reg || ((this.PSW >> 2) & 0x3000) === (this.PSW & 0x3000)) {
                                            this.regsGen[reg] = dst;
                                        } else {
                                            this.regsAltStack[(this.PSW >> 12) & 3] = dst;
                                        }
                                        this.flagN = this.flagZ = dst;
                                        this.flagV = 0;
                                    } else {
                                        if ((virtualAddress = this.getVirtualByMode(instruction, 0)) >= 0) {
                                            this.mmuMode = (this.PSW >> 12) & 3;
                                            if ((dstAddr = this.mapVirtualToPhysical(virtualAddress |
                                                    0x10000, PDP11.WRITE_MODE)) >= 0) {
                                                this.mmuMode = (this.PSW >> 14) & 3;
                                                if (this.writeWordByAddr(dstAddr, dst) >= 0) {
                                                    this.flagN = this.flagZ = dst;
                                                    this.flagV = 0;
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                                //case 0106700: // MTFS 1064SS
                                //    //LOG_INSTRUCTION(instruction, 1, "MFPS");
                                //    src = this.getPSW() & 0xff;
                                //    if (instruction & 0x38) {
                                //        if ((dstAddr = this.getAddrByMode(instruction, PDP11.WRITE_MODE | PDP11.BYTE_MODE)) >= 0) { // write byte
                                //            if (this.writeByteByAddr(dstAddr, src) >= 0) {
                                //                this.flagN = this.flagZ = src << 8;
                                //                this.flagV = 0;
                                //            }
                                //        }
                                //    } else {
                                //        if (src & 0200) src |= 0xff00;
                                //        this.regsGen[instruction & 7] = src;
                                //        this.flagN = this.flagZ = src << 8;
                                //        this.flagV = 0;
                                //    } // Temporary PDP 11/34A
                                //    break;
                            default:
                                switch (instruction & 0xFFF8) /*0177770*/ { // Single register instructions xxxxxR (and CC)
                                case 0x80: /*0000200*/ // RTS 00020R
                                    //LOG_INSTRUCTION(instruction, 6, "RTS");
                                    if ((src = this.popWord()) >= 0) {
                                        reg = instruction & 7;
                                        this.regsGen[7] = this.regsGen[reg];
                                        this.regsGen[reg] = src;
                                    }
                                    break;
                                case 0x98: /*0000230*/ // SPL 00023N
                                    //LOG_INSTRUCTION(instruction, 9, "SPL");
                                    if (!(this.PSW & 0xc000)) {
                                        this.PSW = (this.PSW & 0xf81f) | ((instruction & 7) << 5);
                                        this.priorityReview = 1;
                                    }
                                    break;
                                case 0xA0: /*0000240*/ // CLR CC 00024M Part 1 without N
                                case 0xA8: /*0000250*/ // CLR CC 00025M Part 2 with N
                                    if (instruction & 1) this.clearCF();        // CLC
                                    if (instruction & 2) this.clearVF();        // CLV
                                    if (instruction & 4) this.clearZF();        // CLZ
                                    if (instruction & 8) this.clearNF();        // CLN
                                    break;
                                case 0xB0: /*0000260*/ // SET CC 00026M Part 1 without N
                                case 0xB8: /*0000270*/ // SET CC 00026M Part 2 with N
                                    if (instruction & 1) this.setCF();          // SEC
                                    if (instruction & 2) this.setVF();          // SEV
                                    if (instruction & 4) this.setZF();          // SEZ
                                    if (instruction & 8) this.setNF();          // SEN
                                    break;
                                default: // Misc instructions (decode ALL remaining bits) xxxxxx
                                    switch (instruction) {
                                    case 0x0: /*0000000*/ // HALT 000000
                                        //LOG_INSTRUCTION(instruction, 0, "HALT");
                                        if (0xc000 & this.PSW) {
                                            this.CPU_Error |= 0x80; /*0200*/
                                            this.trap(PDP11.TRAP.BUS_ERROR, 46);
                                        } else {
                                            this.runState = 3; // halt
                                            this.endBurst();
                                            //LOG_PRINT();
                                            console.log("HALT at " + this.regsGen[7].toString(8));
                                        }
                                        break;
                                    case 0x1: /*0000001*/ // WAIT 000001
                                        //LOG_INSTRUCTION(instruction, 0, "WAIT");
                                        j = 0;
                                        if ((i = this.interruptQueue.length) > 0) {
                                            while (i-- > 0) {
                                                j += this.interruptQueue[i].delay;
                                                this.interruptQueue[i].delay = 0;
                                            }
                                        }
                                        if (j === 0 && this.runState === 0) {
                                            this.runState = 2; // wait
                                            this.endBurst();
                                        }
                                        break;
                                    case 0x3: /*0000003*/ // BPT  000003
                                        //LOG_INSTRUCTION(instruction, 0, "BPT");
                                        this.trap(PDP11.TRAP.BREAKPOINT, /*014*/ 6);
                                        break;
                                    case 0x4: /*0000004*/ // IOT  000004
                                        //LOG_INSTRUCTION(instruction, 0, "IOT");
                                        this.trap(PDP11.TRAP.IOT, /*020*/ 8);
                                        break;
                                    case 0x5: /*0000005*/ // RESET 000005
                                        //LOG_INSTRUCTION(instruction, 0, "RESET");
                                        if (!(this.PSW & 0xc000)) {
                                            this.resetRegs();
                                            this.bus.reset();
                                            // display.data = this.regsGen[0];  // TODO: Review
                                        }
                                        break;
                                    case 0x2: /*0000002*/ // RTI 000002
                                    case 0x6: /*0000006*/ // RTT 000006
                                        //LOG_INSTRUCTION(instruction, 0, "RTT");
                                        dstAddr = this.regsGen[6];
                                        if ((virtualAddress = this.readWordByVirtual(dstAddr | 0x10000)) >= 0) {
                                            dstAddr = (dstAddr + 2) & 0xffff;
                                            if ((savePSW = this.readWordByVirtual(dstAddr | 0x10000)) >= 0) {
                                                this.regsGen[6] = (dstAddr + 2) & 0xffff;
                                                savePSW &= 0xf8ff;
                                                if (this.PSW & 0xc000) {            // user / super restrictions
                                                    // keep SPL and allow lower only for modes and register set
                                                    savePSW = (savePSW & 0xf81f) | (this.PSW & 0xf8e0);
                                                }
                                                this.regsGen[7] = virtualAddress;
                                                this.setPSW(savePSW);
                                                this.opFlags &= ~PDP11.OPFLAG.TRAP_TF;
                                                if (instruction === 2) {            // RTI enables immediate trace
                                                    this.opFlags |= (this.PSW & PDP11.PSW.TF);
                                                }
                                            }
                                        }
                                        break;
                                        //case 0000007: // MFPT 000007
                                        //    //LOG_INSTRUCTION(instruction, 0, "MFPT");
                                        //    this.regsGen[0] = 1;
                                        //    break; // Exists on pdp 11/44 & KB11-EM
                                    default: // We don't know this instruction
                                        //LOG_INSTRUCTION(instruction, 11, "-unknown-");
                                        this.trap(PDP11.TRAP.RESERVED, /*010*/ 48); // reserved instruction
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } while (this.nStepCycles > 0);
    }

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
