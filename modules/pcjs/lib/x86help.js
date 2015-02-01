/**
 * @fileoverview Implements PCjs 8086 opcode helpers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-05
 *
 * Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
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
    var Messages    = require("./messages");
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
        this.opFlags |= X86.OPFLAG.NOWRITE;
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
        this.opFlags |= X86.OPFLAG.NOWRITE;
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
            /*
             * TODO: After reading http://www.os2museum.com/wp/undocumented-8086-opcodes/, it seems that this
             * form of LEA (eg, "LEA AX,DX") simply returns the last calculated EA.  Since we always reset regEA
             * at the start of a new instruction, we would need to preserve the previous EA if we want to mimic
             * that (undocumented) behavior.
             *
             * And for completeness, we would have to extend EA tracking beyond the usual ModRM instructions
             * (eg, XLAT, instructions that modify the stack pointer, and string instructions).  Anything else?
             */
            X86Help.opHelpUndefined.call(this);
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
            X86Help.opHelpUndefined.call(this);
            return dst;
        }
        this.setDS(this.getShort(this.regEA + 2));
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
            X86Help.opHelpUndefined.call(this);
            return dst;
        }
        this.setES(this.getShort(this.regEA + 2));
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
             * Generate UD_FAULT (INT 0x06: Invalid Opcode) if src is not a memory operand.
             */
            X86Help.opHelpInvalid.call(this);
            return dst;
        }
        /*
         * Note that BOUND performs signed comparisons, so we must transform all arguments into signed values.
         */
        var wIndex = (dst << 16) >> 16;
        var wLower = (this.getShort(this.regEA) << 16) >> 16;
        var wUpper = (this.getShort(this.regEA + 2) << 16) >> 16;
        this.nStepCycles -= this.CYCLES.nOpCyclesBound;
        if (wIndex < wLower || wIndex > wUpper) {
            /*
             * The INT 0x05 handler must be called with CS:IP pointing to the BOUND instruction.
             *
             * TODO: Determine the cycle cost when a BOUND exception is triggered, over and above nOpCyclesBound.
             */
            this.setIP(this.opLIP - this.segCS.base);
            X86Help.opHelpINT.call(this, X86.EXCEPTION.BOUND_ERR, null, 0);
        }
        this.opFlags |= X86.OPFLAG.NOWRITE;
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
        if (this.segVER.load(src, true) != X86.ADDR_INVALID) {
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
        if ((src & X86.SEL.MASK) && this.segVER.load(src, true) != X86.ADDR_INVALID) {
            var fConforming = ((this.segVER.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING) == X86.DESC.ACC.TYPE.CODE_CONFORMING);
            if ((fConforming || this.segVER.dpl >= this.segCS.cpl) && this.segVER.dpl >= (src & X86.SEL.RPL)) {
                this.setZF();
                return this.segVER.limit;
            }
        }
        this.clearZF();
        return dst;
    },
    /**
     * opHelpXCHGrb(dst, src)
     *
     * If an instruction like "XCHG AL,AH" was a traditional "op dst,src" instruction, dst would contain AL,
     * src would contain AH, and we would return src, which the caller would then store in AL, and we'd be done.
     *
     * However, that's only half of what XCHG does, so THIS function must perform the other half; in the previous
     * example, that entails storing AL (dst) into AH (src).
     *
     * BACKTRACK support is incomplete without also passing bti values as parameters, because the caller will
     * store btiAH in btiAL, but the original btiAL will be lost.  Similarly, if src is a memory operand, the
     * caller will store btiEALo in btiAL, but again, the original btiAL will be lost.
     *
     * BACKTRACK support for memory operands could be fixed by decoding the dst register in order to determine the
     * corresponding bti and then temporarily storing it in btiEALo around the setEAByte() call below.  Register-only
     * XCHGs would require a more extensive hack.  For now, I'm going to live with one-way BACKTRACK support here.
     *
     * TODO: Implement full BACKTRACK support for XCHG instructions.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpXCHGrb: function(dst, src) {
        if (this.regEA < 0) {
            /*
             * Decode which register was src
             */
            switch (this.bModRM & 0x7) {
            case 0x0:       // AL
                this.regEAX = (this.regEAX & ~0xff) | dst;
                break;
            case 0x1:       // CL
                this.regECX = (this.regECX & ~0xff) | dst;
                break;
            case 0x2:       // DL
                this.regEDX = (this.regEDX & ~0xff) | dst;
                break;
            case 0x3:       // BL
                this.regEBX = (this.regEBX & ~0xff) | dst;
                break;
            case 0x4:       // AH
                this.regEAX = (this.regEAX & 0xff) | (dst << 8);
                break;
            case 0x5:       // CH
                this.regECX = (this.regECX & 0xff) | (dst << 8);
                break;
            case 0x6:       // DH
                this.regEDX = (this.regEDX & 0xff) | (dst << 8);
                break;
            case 0x7:       // BH
                this.regEBX = (this.regEBX & 0xff) | (dst << 8);
                break;
            default:
                break;      // there IS no other case, but JavaScript inspections don't know that
            }
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRR;
        } else {
            /*
             * This is a case where the ModRM decoder that's calling us didn't know it should have called modEAByte()
             * instead of getEAByte(), so we compensate by updating regEAWrite.  However, setEAByte() has since been
             * changed to revalidate the write using segEA:offEA, so updating regEAWrite here isn't strictly necessary.
             */
            this.regEAWrite = this.regEA;
            this.setEAByte(dst);
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRM;
        }
        return src;
    },
    /**
     * opHelpXCHGrw(dst, src)
     *
     * If an instruction like "XCHG AX,DX" was a traditional "op dst,src" instruction, dst would contain AX,
     * src would contain DX, and we would return src, which the caller would then store in AX, and we'd be done.
     *
     * However, that's only half of what XCHG does, so THIS function must perform the other half; in the previous
     * example, that entails storing AX (dst) into DX (src).
     *
     * TODO: Implement full BACKTRACK support for XCHG instructions (see opHelpXCHGrb comments).
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opHelpXCHGrw: function(dst, src) {
        if (this.regEA < 0) {
            /*
             * Decode which register was src
             */
            switch (this.bModRM & 0x7) {
            case 0x0:       // AX
                this.regEAX = dst;
                break;
            case 0x1:       // CX
                this.regECX = dst;
                break;
            case 0x2:       // DX
                this.regEDX = dst;
                break;
            case 0x3:       // BX
                this.regEBX = dst;
                break;
            case 0x4:       // SP
                this.setSP(dst);
                break;
            case 0x5:       // BP
                this.regEBP = dst;
                break;
            case 0x6:       // SI
                this.regESI = dst;
                break;
            case 0x7:       // DI
                this.regEDI = dst;
                break;
            default:
                break;      // there IS no other case, but JavaScript inspections don't know that
            }
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRR;
        } else {
            /*
             * This is a case where the ModRM decoder that's calling us didn't know it should have called modEAWord()
             * instead of getEAWord(), so we compensate by updating regEAWrite.  However, setEAWord() has since been
             * changed to revalidate the write using segEA:offEA, so updating regEAWrite here isn't strictly necessary.
             */
            this.regEAWrite = this.regEA;
            this.setEAWord(dst);
            this.nStepCycles -= this.CYCLES.nOpCyclesXchgRM;
        }
        return src;
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
     * opHelpCALLF(off, sel)
     *
     * For protected-mode, this function must attempt to load the new code segment first, because if the new segment
     * requires a change in privilege level, the return address must be pushed on the NEW stack, not the current stack.
     *
     * @this {X86CPU}
     * @param {number} off
     * @param {number} sel
     */
    opHelpCALLF: function(off, sel) {
        var regCS = this.getCS();
        var regEIP = this.getIP();
        if (this.setCSIP(off, sel, true) != null) {
            this.pushWord(regCS);
            this.pushWord(regEIP);
        }
    },
    /**
     * opHelpRETF(n)
     *
     * For protected-mode, this function must be prepared to pop any arguments off the current stack AND
     * whatever stack we may have switched to (setCSIP() returns true only when a stack switch has occurred).
     *
     * @this {X86CPU}
     * @param {number} n
     */
    opHelpRETF: function(n) {
        var regEIP = this.popWord();
        var regCS = this.popWord();
        n <<= (this.dataSize >> 2);
        if (n) this.setSP(this.getSP() + n);            // TODO: optimize
        if (this.setCSIP(regEIP, regCS, false)) {
            if (n) this.setSP(this.getSP() + n);        // TODO: optimize
            /*
             * As per Intel documentation: "If any of [the DS or ES] registers refer to segments whose DPL is
             * less than the new CPL (excluding conforming code segments), the segment register is loaded with
             * the null selector."
             *
             * TODO: I'm not clear on whether a conforming code segment must also be marked readable, so I'm playing
             * it safe and using CODE_CONFORMING instead of CODE_CONFORMING_READABLE.  Also, for the record, I've not
             * seen this situation occur in OS/2 1.0 yet.
             */
            if ((this.segDS.sel & X86.SEL.MASK) && this.segDS.dpl < this.segCS.cpl && (this.segDS.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING) != X86.DESC.ACC.TYPE.CODE_CONFORMING) {
                this.assert(false);         // I'm not asserting this is bad, I just want to see it in action
                this.segDS.load(0);
            }
            if ((this.segES.sel & X86.SEL.MASK) && this.segES.dpl < this.segCS.cpl && (this.segES.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING) != X86.DESC.ACC.TYPE.CODE_CONFORMING) {
                this.assert(false);         // I'm not asserting this is bad, I just want to see it in action
                this.segES.load(0);
            }
        }
        if (n == 2 && this.cIntReturn) this.checkIntReturn(this.regLIP);
    },
    /**
     * opHelpINT(nIDT, nError, nCycles)
     *
     * NOTE: We no longer use setCSIP(), because it always loads the new CS using segCS.load(), which
     * only knows how to load GDT and LDT descriptors, whereas interrupts must use setCS.loadIDT(), which
     * deals exclusively with IDT descriptors.
     *
     * This means we must take care to replicate critical features of setCSIP(); eg, setting segCS.fCall before
     * calling loadIDT(), updating LIP, and flushing the prefetch queue.
     *
     * @this {X86CPU}
     * @param {number} nIDT
     * @param {number|null|undefined} nError
     * @param {number} nCycles (in addition to the default of nOpCyclesInt)
     */
    opHelpINT: function(nIDT, nError, nCycles) {
        /*
         * TODO: We assess the cycle cost up front, because otherwise, if loadIDT() fails, no cost may be assessed.
         */
        this.nStepCycles -= this.CYCLES.nOpCyclesInt + nCycles;
        this.segCS.fCall = true;
        var regPS = this.getPS();
        var regCS = this.getCS();
        var regEIP = this.getIP();
        var addr = this.segCS.loadIDT(nIDT);
        if (addr != X86.ADDR_INVALID) {
            this.regLIP = addr;
            if (PREFETCH) this.flushPrefetch(this.regLIP);
            this.pushWord(regPS);
            this.pushWord(regCS);
            this.pushWord(regEIP);
            if (nError != null) this.pushWord(nError);
            this.nFault = -1;
        }
    },
    /**
     * opHelpIRET()
     *
     * @this {X86CPU}
     */
    opHelpIRET: function() {
        /*
         * TODO: We assess a fixed cycle cost up front, because at the moment, switchTSS() doesn't assess anything.
         */
        this.nStepCycles -= this.CYCLES.nOpCyclesIRet;
        if (this.regMSW & X86.MSW.PE) {
            if (this.regPS & X86.PS.NT) {
                var addrNew = this.segTSS.base;
                var sel = this.getShort(addrNew + X86.TSS.PREV_TSS);
                X86Seg.switchTSS.call(this.segCS, sel, false);
                return;
            }
        }
        var cpl = this.segCS.cpl;
        var regEIP = this.popWord();
        var regCS  = this.popWord();
        var regPS  = this.popWord();
        if (this.setCSIP(regEIP, regCS, false) != null) {
            this.setPS(regPS, cpl);
            if (this.cIntReturn) this.checkIntReturn(this.regLIP);
        }
    },
    /**
     * opHelpDIVOverflow()
     *
     * @this {X86CPU}
     */
    opHelpDIVOverflow: function() {
        this.setIP(this.opLIP - this.segCS.base);
        /*
         * TODO: Determine the proper cycle cost.
         */
        X86Help.opHelpINT.call(this, X86.EXCEPTION.DIV_ERR, null, 2);
    },
    /**
     * opHelpFault(nFault, nError, fHalt)
     *
     * Helper to dispatch faults.
     *
     * @this {X86CPU}
     * @param {number} nFault
     * @param {number} [nError]
     * @param {boolean} [fHalt] will halt the CPU if true *and* a Debugger is loaded
     */
    opHelpFault: function(nFault, nError, fHalt)
    {
        if (!this.aFlags.fComplete) {
            this.printMessage("Fault " + str.toHexByte(nFault) + " blocked by Debugger", Messages.WARN);
            this.setIP(this.opLIP - this.segCS.base);
            return;
        }

        var fDispatch = false;
        if (this.model >= X86.MODEL_80186) {
            if (this.nFault < 0) {
                /*
                 * Single-fault (error code is passed through, and the responsible instruction is restartable)
                 */
                this.setIP(this.opLIP - this.segCS.base);
                fDispatch = true;
            } else if (this.nFault != X86.EXCEPTION.DF_FAULT) {
                /*
                 * Double-fault (error code is always zero, and the responsible instruction is not restartable)
                 */
                nError = 0;
                nFault = X86.EXCEPTION.DF_FAULT;
                fDispatch = true;
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

        if (X86Help.opHelpFaultMessage.call(this, nFault, nError, fHalt)) {
            fDispatch = false;
        }

        if (fDispatch) X86Help.opHelpINT.call(this, this.nFault = nFault, nError, 0);

        /*
         * Since this fault is likely being issued in the context of an instruction that hasn't finished
         * executing, and since we currently don't do anything to interrupt that execution (eg, throw a
         * JavaScript exception), we should shut off all further reads/writes for the current instruction.
         *
         * That's easy for any EA-based memory accesses: simply set both the NOREAD and NOWRITE flags.
         * However, there are also direct, non-EA-based memory accesses to consider.  A perfect example is
         * opPUSHA(): if a GP fault occurs on any PUSH other than the last, a subsequent PUSH is likely to
         * cause another fault, which we will misinterpret as a double-fault.
         *
         * TODO: Throw a special JavaScript exception that cpu.js must intercept and quietly ignore.
         */
        this.opFlags &= ~(X86.OPFLAG.NOREAD | X86.OPFLAG.NOWRITE);
    },
    /**
     * opHelpFaultMessage()
     *
     * Aside from giving the Debugger an opportunity to report every fault, this also gives us the ability to
     * halt exception processing in tracks: return true to prevent the fault handler from being dispatched.
     *
     * At the moment, the only Debugger control you have over fault interception is setting MESSAGE.FAULT, which
     * will display faults as they occur, and MESSAGE.HALT, which will halt after any Debugger message, including
     * MESSAGE.FAULT.  If you want execution to continue after halting, clear MESSAGE.FAULT and/or MESSAGE.HALT,
     * or single-step over the offending instruction, which will allow the fault to be dispatched.
     *
     * @this {X86CPU}
     * @param {number} nFault
     * @param {number} [nError]
     * @param {boolean} [fHalt] true if the CPU should always be halted, false if "it depends"
     * @return {boolean|undefined} true to block the fault (often desirable when fHalt is true), otherwise dispatch it
     */
    opHelpFaultMessage: function(nFault, nError, fHalt)
    {
        var bitsMessage = Messages.FAULT;
        var bOpcode = this.bus.getByteDirect(this.regLIP);

        /*
         * OS/2 1.0 uses an INT3 (0xCC) opcode in conjunction with an invalid IDT to trigger a triple-fault
         * reset and return to real-mode, and these resets happen quite frequently during boot; for example,
         * OS/2 startup messages are displayed using a series of INT 0x10 BIOS calls for each character, and
         * each series of BIOS calls requires a round-trip mode switch.
         *
         * Since we really only want to halt on "bad" faults, not "good" (ie, intentional) faults, we take
         * advantage of the fact that all 3 faults comprising the triple-fault point to an INT3 (0xCC) opcode,
         * and so whenever we see that opcode, we ignore the caller's fHalt flag, and suppress FAULT messages
         * unless CPU messages are also enabled.
         *
         * When a triple fault shows up, nFault is -1; it displays as "ff" because we display nFault as a byte.
         */
        if (bOpcode == X86.OPCODE.INT3) {
            fHalt = false;
            bitsMessage |= Messages.CPU;
        }

        /*
         * Similarly, the PC AT ROM BIOS deliberately generates a couple of GP faults as part of the POST
         * (Power-On Self Test); we don't want to ignore those, but we don't want to halt on them either.  We
         * detect those faults by virtue of the LIP being in the range %0F0000 to %0FFFFF.
         */
        if (this.regLIP >= 0x0F0000 && this.regLIP <= 0x0FFFFF) {
            fHalt = false;
        }

        /*
         * However, the foregoing notwithstanding, if MESSAGE.HALT is enabled along with all the other required
         * MESSAGE bits, then we want to halt regardless.
         */
        if (this.messageEnabled(bitsMessage | Messages.HALT)) {
            fHalt = true;
        }

        if (this.messageEnabled(bitsMessage) || fHalt) {
            var sMessage = (fHalt? '\n' : '') + "Fault " + str.toHexByte(nFault) + (nError != null? " (" + str.toHexWord(nError) + ")" : "") + " on opcode 0x" + str.toHexByte(bOpcode) + " at " + str.toHexAddr(this.getIP(), this.getCS()) + " (%" + str.toHex(this.regLIP, 6) + ")";
            var fRunning = this.aFlags.fRunning;
            if (this.printMessage(sMessage, bitsMessage)) {
                if (fHalt) {
                    /*
                     * By setting fHalt to fRunning (which is true while running but false while single-stepping),
                     * this allows a fault to be dispatched when you single-step over a faulting instruction; you can
                     * then continue single-stepping into the fault handler, or start running again.
                     *
                     * Note that we had to capture fRunning before calling printMessage(), because if MESSAGE.HALT
                     * is set, printMessage() will have already halted the CPU.
                     */
                    fHalt = fRunning;
                    this.dbg.stopCPU();
                }
            } else {
                /*
                 * If printMessage() returned false, then messageEnabled() must have returned false as well, which
                 * means that fHalt must be true.  Which means we should shut the machine down.
                 */
                this.assert(fHalt);
                this.notice(sMessage);
                this.stopCPU();
            }
        }
        return fHalt;
    },
    /**
     * @this {X86CPU}
     */
    opHelpInvalid: function() {
        X86Help.opHelpFault.call(this, X86.EXCEPTION.UD_FAULT);
        this.stopCPU();
    },
    /**
     * @this {X86CPU}
     */
    opHelpUndefined: function() {
        this.setIP(this.opLIP - this.segCS.base);
        this.setError("Undefined opcode 0x" + str.toHexByte(this.bus.getByteDirect(this.regLIP)) + " at " + str.toHexAddr(this.getIP(), this.getCS()));
        this.stopCPU();
    }
};

if (typeof module !== 'undefined') module.exports = X86Help;
