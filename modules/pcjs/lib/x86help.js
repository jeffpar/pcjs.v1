/**
 * @fileoverview Implements PCjs 8086 opcode helpers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-05
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
    var X86         = require("./x86");
    var X86OpXX     = require("./x86opxx");
    var Debugger    = require("./debugger");
}

var X86Help = {
    /**
     * @this {X86CPU}
     * @param {number} dst (current value, ignored)
     * @param {number} src (new value)
     * @return {number} dst (updated value, from src)
     */
    opHelpMOV: function(dst, src) {
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesMovRR : this.CYCLES.nOpCyclesMovRM) : this.CYCLES.nOpCyclesMovMR);
        return src;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst (current value, ignored)
     * @param {number} src (new value)
     * @return {number} dst (src is overridden, replaced with regMD16, as specified by opMOVSegSrc)
     */
    opHelpMOVSegSrc: function(dst, src) {
        return X86Help.opHelpMOV.call(this, dst, this.regMD16);
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpTESTb: function(dst, src) {
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst & src;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesTestRR : this.CYCLES.nOpCyclesTestRM) : this.CYCLES.nOpCyclesTestRM);
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpTESTw: function(dst, src) {
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst & src;
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesTestRR : this.CYCLES.nOpCyclesTestRM) : this.CYCLES.nOpCyclesTestRM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     *
     * 80286_and_80287_Programmers_Reference_Manual_1987.pdf, p.B-44 (p.254) notes that:
     *
     *      "The low 16 bits of the product of a 16-bit signed multiply are the same as those of an
     *      unsigned multiply. The three operand IMUL instruction can be used for unsigned operands as well."
     *
     * However, we still sign-extend the operands before multiplying, making it easier to range-check the result.
     *
     * (80186/80188 and up)
     */
    opHelpIMUL8: function(dst, src) {
        var result = ((src << 16) >> 16) * ((this.getIPByte() << 24) >> 24);
        this.resultValue = this.resultAuxOverflow = this.resultParitySign = result;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        /*
         * TODO: Look into a more efficient way of setting/synchronizing CF and OF; this code works,
         * but it somewhat defeats the purpose of the indirect result variables that we've set above.
         */
        if (result > 32767 || result < -32768) {
            this.setCF(); this.setOF();
        } else {
            this.clearCF(); this.clearOF();
        }
        result &= 0xffff;
        if (DEBUG && DEBUGGER) this.traceLog('IMUL8', dst, src, null, this.getPS(), result);
        /*
         * NOTE: These are the cycle counts for the 80286; the 80186/80188 have slightly different values (ranges):
         * 22-25 and 29-32 instead of 21 and 24, respectively.  However, accurate cycle counts for the 80186/80188 is
         * not super-critical. TODO: Fix this someday.
         */
        this.nStepCycles -= (this.regEA < 0? 21 : 24);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     *
     * 80286_and_80287_Programmers_Reference_Manual_1987.pdf, p.B-44 (p.254) notes that:
     *
     *      "The low 16 bits of the product of a 16-bit signed multiply are the same as those of an
     *      unsigned multiply. The three operand IMUL instruction can be used for unsigned operands as well."
     *
     * However, we still sign-extend the operands before multiplying, making it easier to range-check the result.
     *
     * (80186/80188 and up)
     */
    opHelpIMUL16: function(dst, src) {
        var result = ((src << 16) >> 16) * ((this.getIPWord() << 16) >> 16);
        this.resultValue = this.resultAuxOverflow = this.resultParitySign = result;
        this.resultSize = X86.RESULT.SIZE_WORD;
        /*
         * TODO: Look into a more efficient way of setting/synchronizing CF and OF; this code works,
         * but it somewhat defeats the purpose of the indirect result variables that we've set above.
         */
        if (result > 32767 || result < -32768) {
            this.setCF(); this.setOF();
        } else {
            this.clearCF(); this.clearOF();
        }
        result &= 0xffff;
        if (DEBUG && DEBUGGER) this.traceLog('IMUL16', dst, src, null, this.getPS(), result);
        /*
         * NOTE: These are the cycle counts for the 80286; the 80186/80188 have slightly different values (ranges):
         * 22-25 and 29-32 instead of 21 and 24, respectively.  However, accurate cycle counts for the 80186/80188 is
         * not super-critical. TODO: Fix this someday.
         */
        this.nStepCycles -= (this.regEA < 0? 21 : 24);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number} dst unchanged
     */
    opHelpESC: function(dst, src) {
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpLEA: function(dst, src) {
        if (this.regEA < 0) {
            X86OpXX.opUndefined.call(this);
            return dst;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLEA;
        return this.regEA;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpLDS: function(dst, src) {
        if (this.regEA < 0) {
            X86OpXX.opUndefined.call(this);
            return dst;
        }
        this.setDS(this.getWord(this.regEA + 2));
        this.nStepCycles -= this.CYCLES.nOpCyclesLS;
        return src;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpLES: function(dst, src) {
        if (this.regEA < 0) {
            X86OpXX.opUndefined.call(this);
            return dst;
        }
        this.setES(this.getWord(this.regEA + 2));
        this.nStepCycles -= this.CYCLES.nOpCyclesLS;
        return src;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpBOUND: function(dst, src) {
        if (this.regEA < 0) {
            /*
             * Generate a #UD fault (INT 0x06: Undefined Opcode) if src is not a memory operand.
             */
            X86OpXX.opInvalid.call(this);
            return dst;
        }
        /*
         * Note that BOUND performs signed comparisons, so we must transform all arguments into signed values.
         */
        var wIndex = (dst << 16) >> 16;
        var wLower = (this.getWord(this.regEA) << 16) >> 16;
        var wUpper = (this.getWord(this.regEA + 2) << 16) >> 16;
        this.nStepCycles -= this.CYCLES.nOpCyclesBound;
        if (wIndex < wLower || wIndex > wUpper) {
            /*
             * The INT 0x05 handler must be called with CS:IP pointing to the BOUND instruction.
             *
             * TODO: Determine the cycle cost when a BOUND exception is triggered, over and above nOpCyclesBound.
             */
            this.setIP(this.opEA - this.segCS.base);
            X86Help.opHelpINT.call(this, X86.EXCEPTION.BOUND_ERR, null, 0);
        }
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpARPL: function(dst, src) {
        this.nStepCycles -= (10 + (this.regEA < 0? 0 : 1));
        if ((dst & X86.SEL.RPL) < (src & X86.SEL.RPL)) {
            dst = (dst & ~X86.SEL.RPL) | (src & X86.SEL.RPL);
            this.setZF();
            return dst;
        }
        this.clearZF();
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpLAR: function(dst, src) {
        this.nStepCycles -= (14 + (this.regEA < 0? 0 : 2));
        /*
         * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
         * descriptor table or the descriptor is not for a segment.
         *
         * TODO: This instruction's 80286 documentation does not discuss conforming code segments; determine
         * if we need a special check for them.
         */
        if (this.segVER.load(src, true) >= 0) {
            if (this.segVER.dpl >= this.segCS.cpl && this.segVER.dpl >= (src & X86.SEL.RPL)) {
                this.setZF();
                return this.segVER.acc & X86.DESC.ACC.MASK;
            }
        }
        this.clearZF();
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (the selector)
     * @return {number}
     */
    opHelpLSL: function(dst, src) {
        /*
         * TODO: Is this an invalid operation if regEAWrite is set?  dst is required to be a register.
         */
        this.nStepCycles -= (14 + (this.regEA < 0? 0 : 2));
        /*
         * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
         * descriptor table or the descriptor is not for a segment.
         *
         * TODO: LSL is explicitly documented as ALSO requiring a non-null selector, so we check X86.SEL.MASK;
         * are there any other instructions that were, um, less explicit but also require a non-null selector?
         */
        if ((src & X86.SEL.MASK) && this.segVER.load(src, true) >= 0) {
            var fConforming = ((this.segVER.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING_EXECONLY) == X86.DESC.ACC.TYPE.CODE_CONFORMING_EXECONLY);
            if ((fConforming || this.segVER.dpl >= this.segCS.cpl) && this.segVER.dpl >= (src & X86.SEL.RPL)) {
                this.setZF();
                return this.segVER.limit;
            }
        }
        this.clearZF();
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpXCHGrb: function(dst, src) {
        if (this.regEA < 0) {
            switch (this.bModRM & 0x7) {
            case 0x0:       // AL
                this.regAX = (this.regAX & ~0xff) | dst;
                break;
            case 0x1:       // CL
                this.regCX = (this.regCX & ~0xff) | dst;
                break;
            case 0x2:       // DL
                this.regDX = (this.regDX & ~0xff) | dst;
                break;
            case 0x3:       // BL
                this.regBX = (this.regBX & ~0xff) | dst;
                break;
            case 0x4:       // AH
                this.regAX = (this.regAX & 0xff) | (dst << 8);
                break;
            case 0x5:       // CH
                this.regCX = (this.regCX & 0xff) | (dst << 8);
                break;
            case 0x6:       // DH
                this.regDX = (this.regDX & 0xff) | (dst << 8);
                break;
            case 0x7:       // BH
                this.regBX = (this.regBX & 0xff) | (dst << 8);
                break;
            default:
                break;      // there IS no other case, but JavaScript inspections don't know that
            }
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRR;
        } else {
            /*
             * This is a case where the ModRM decoder that's calling us didn't know it should have called modEAByte()
             * instead of getEAByte(), so we compensate by updating regEAWrite.
             */
            this.regEAWrite = this.regEA;
            this.setEAByte(dst);
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRM;
        }
        return src;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpXCHGrw: function(dst, src) {
        if (this.regEA < 0) {
            switch (this.bModRM & 0x7) {
            case 0x0:       // AX
                this.regAX = dst;
                break;
            case 0x1:       // CX
                this.regCX = dst;
                break;
            case 0x2:       // DX
                this.regDX = dst;
                break;
            case 0x3:       // BX
                this.regBX = dst;
                break;
            case 0x4:       // SP
                this.regSP = dst;
                break;
            case 0x5:       // BP
                this.regBP = dst;
                break;
            case 0x6:       // SI
                this.regSI = dst;
                break;
            case 0x7:       // DI
                this.regDI = dst;
                break;
            default:
                break;      // there IS no other case, but JavaScript inspections don't know that
            }
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRR;
        } else {
            /*
             * This is a case where the ModRM decoder that's calling us didn't know it should have called modEAByte()
             * instead of getEAByte(), so we compensate by updating regEAWrite.
             */
            this.regEAWrite = this.regEA;
            this.setEAWord(dst);
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRM;
        }
        return src;
    },
    /**
     * @this {X86CPU}
     * @param {number} nIDT
     * @param {number|null|undefined} nError
     * @param {number} nCycles (in addition to the default of nOpCyclesInt)
     */
    opHelpINT: function(nIDT, nError, nCycles) {
        /*
         * TODO: We assess the cycle cost up front, because if loadIDTEntry() fails and we end up in opHelpFault(),
         * no cost may get assessed.  opHelpFault() needs to determine an appropriate cycle cost.
         */
        this.nStepCycles -= this.CYCLES.nOpCyclesInt + nCycles;
        if (this.loadIDTEntry(nIDT)) {
            this.pushWord(this.getPS());
            this.regPS &= this.descIDT.maskPS;
            this.pushWord(this.segCS.sel);
            this.pushWord(this.regIP);
            if (nError != null) this.pushWord(nError);
            this.setCSIP(this.descIDT.off, this.descIDT.sel);
            return;
        }
        X86Help.opHelpFault.call(this, X86.EXCEPTION.GP_FAULT, (nIDT << 3) | X86.ERRCODE.IDT | X86.ERRCODE.EXT, true);
    },
    /**
     * opHelpLMSW(w)
     *
     * Factored out of x86op0f.js, since both opLMSW and opLOADALL are capable of loading a new MSW.
     * The caller is responsible for assessing the appropriate cycle cost.
     *
     * @this {X86CPU}
     * @param {number} w
     */
    opHelpLMSW: function(w) {
        /*
         * This instruction is always allowed to set MSW.PE, but it cannot clear MSW.PE once set;
         * therefore, we always OR the previous value of MSW.PE into the new value before loading.
         */
        w |= (this.regMSW & X86.MSW.PE);
        this.regMSW = (this.regMSW & X86.MSW.SET) | (w & ~X86.MSW.SET);
        /*
         * Since the 80286 cannot return to real-mode via this instruction, the only transition we
         * must worry about is to protected-mode.  And don't worry, there's no harm calling setProtMode()
         * if the CPU is already in protected-mode (we could certainly optimize the call out in that
         * case, but this instruction isn't used frequently enough to warrant it).
         */
        if (this.regMSW & X86.MSW.PE) this.setProtMode(true);

    },
    /**
     * @this {X86CPU}
     */
    opHelpDIVOverflow: function() {
        this.setIP(this.opEA - this.segCS.base);
        /*
         * TODO: Determine the proper cycle cost.
         */
        X86Help.opHelpINT.call(this, X86.EXCEPTION.DIV_ERR, null, 2);
    },
    /**
     * @this {X86CPU}
     * @param {number} nFault
     * @param {number} [nError]
     * @param {boolean} [fHalt] will halt the CPU if true *and* a Debugger is loaded
     */
    opHelpFault: function(nFault, nError, fHalt) {
        var fFault = false;
        if (this.model >= X86.MODEL_80186) {
            if (this.nFault < 0) {
                /*
                 * Single-fault (error code is passed through, and the original instruction is restartable)
                 */
                this.setIP(this.opEA - this.segCS.base);
                fFault = true;
            } else if (this.nFault != X86.EXCEPTION.DF_FAULT) {
                /*
                 * Double-fault (error code is always zero, and the responsible instruction is not restartable)
                 */
                nError = 0;
                nFault = X86.EXCEPTION.DF_FAULT;
                fFault = true;
            } else {
                /*
                 * Triple-fault (usually referred to in Intel literature as a "shutdown", but at least on the 80286,
                 * it's actually a "reset")
                 */
                X86Help.opHelpFaultMessage.call(this, -1, 0, fHalt);
                this.resetRegs();
                return;
            }
        }
        X86Help.opHelpFaultMessage.call(this, nFault, nError, fHalt);
        if (fFault) X86Help.opHelpINT.call(this, this.nFault = nFault, nError, 0);
    },
    /**
     * @this {X86CPU}
     * @param {number} nFault
     * @param {number} [nError]
     * @param {boolean} [fHalt] will halt the CPU if true *and* a Debugger is loaded
     */
    opHelpFaultMessage: function(nFault, nError, fHalt) {
        if (DEBUGGER && this.dbg) {
            var bitsMessage = Debugger.MESSAGE.FAULT;
            var bOpcode = this.bus.getByteDirect(this.regEIP);
            /*
             * OS/2 1.0 uses an INT3 (0xCC) opcode in conjunction with an invalid IDT to trigger a triple-fault
             * reset and return to real-mode, and these resets happen quite frequently during boot; for example, OS/2
             * startup messages are displayed using INT 0x10 BIOS calls for each character, and each call requires a
             * round-trip mode switch.
             *
             * Since we really only want to halt on "bad" faults, not "good" (ie, intentional) faults, we take
             * advantage of the fact that all 3 faults comprising the triple-fault point to the INT3 (0xCC) opcode,
             * and so whenever we see that opcode, we ignore the caller's fHalt flag.
             */
            if (bOpcode == X86.OPCODE.INT3) {
                fHalt = false;
                bitsMessage |= Debugger.MESSAGE.CPU;
            }
            this.messageDebugger("Fault 0x" + str.toHexByte(nFault) + (nError != null? " (0x" + str.toHexWord(nError) + ")" : "") + " on opcode 0x" + str.toHexByte(bOpcode) + " at " + str.toHexAddr(this.regIP, this.segCS.sel) + " (%" + str.toHex(this.regEIP) + ")", bitsMessage);
            if (fHalt) this.dbg.stopCPU();
        }
    }
};

if (typeof module !== 'undefined') module.exports = X86Help;
