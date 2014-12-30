/**
 * @fileoverview Implements PCjs 8086 group opcode helpers.
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
    var X86Help     = require("./x86help");
}

var X86Grps = {
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpADDb: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = dst + src) & 0xff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpORb: function(dst, src) {
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst | src) & 0xff;
    },
    /**
     * NOTE: Notice that some of the simpler math functions could get away with updating resultSize before
     * the calculation, but here the calculation depends on the incoming carry value.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpADCb: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultValue = this.resultParitySign = dst + src + ((this.resultValue & this.resultSize)? 1 : 0);
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return this.resultValue & 0xff;
    },
    /**
     * NOTE: Notice that some of the simpler math functions could get away with updating resultSize before
     * the calculation, but here the calculation depends on the incoming carry value.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpSBBb: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultValue = this.resultParitySign = dst - src - ((this.resultValue & this.resultSize)? 1 : 0);
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return this.resultValue & 0xff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpANDb: function(dst, src) {
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst & src) & 0xff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpSUBb: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = dst - src) & 0xff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpXORb: function(dst, src) {
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst ^ src) & 0xff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number} dst unchanged
     */
    opGrpCMPb: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.resultValue = this.resultParitySign = dst - src;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesCompareRM) : this.CYCLES.nOpCyclesArithRM);
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpADDw: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = dst + src) & 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpORw: function(dst, src) {
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst | src) & 0xffff;
    },
    /**
     * NOTE: Notice that some of the simpler math functions could get away with updating resultSize before
     * the calculation, but here the calculation depends on the incoming carry value.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpADCw: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultValue = this.resultParitySign = dst + src + ((this.resultValue & this.resultSize)? 1 : 0);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return this.resultValue & 0xffff;
    },
    /**
     * NOTE: Notice that some of the simpler math functions could get away with updating resultSize before
     * the calculation, but here the calculation depends on the incoming carry value.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpSBBw: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultValue = this.resultParitySign = dst - src - ((this.resultValue & this.resultSize)? 1 : 0);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return this.resultValue & 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpANDw: function(dst, src) {
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst & src) & 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpSUBw: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = dst - src) & 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpXORw: function(dst, src) {
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesArithRM) : this.CYCLES.nOpCyclesArithMR);
        return (this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst ^ src) & 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number} dst unchanged
     */
    opGrpCMPw: function(dst, src) {
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.resultValue = this.resultParitySign = dst - src;
        this.nStepCycles -= (this.regEAWrite < 0? (this.regEA < 0? this.CYCLES.nOpCyclesArithRR : this.CYCLES.nOpCyclesCompareRM) : this.CYCLES.nOpCyclesArithRM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst (current value, ignored)
     * @param {number} src (new value)
     * @return {number} dst (updated value, from src)
     */
    opGrpPOPw: function(dst, src) {
        this.nStepCycles -= (this.regEAWrite < 0? this.CYCLES.nOpCyclesPopReg : this.CYCLES.nOpCyclesPopMem);
        return src;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst (current value, ignored)
     * @param {number} src (new value)
     * @return {number} dst (updated value, from src)
     */
    opGrpMOVImm: function(dst, src) {
        this.nStepCycles -= (this.regEAWrite < 0? this.CYCLES.nOpCyclesMovRI : this.CYCLES.nOpCyclesMovMI);
        return src;
    },
    /**
     * All the rotate instructions (RCL, RCR, ROL, ROR) affect only CARRY and OVERFLOW.  This means that in the process
     * of updating CARRY and OVERFLOW (and possibly changing resultSize from SIZE_BYTE to SIZE_WORD, or vice versa),
     * we must take care to preserve SIGN, ZERO, and the other arithmetic flags.
     *
     * This code originally left resultParitySign alone, but if resultSize changes, then resultParitySign needs to
     * change along with it.  PARITY is always based on the low 8 bits of resultParitySign, so let's focus on SIGN:
     * if resultSize is changing from SIZE_BYTE to SIZE_WORD, propagating bit 7 to bit 15 of resultParitySign preserves
     * SIGN; similarly, if resultSize is changing from SIZE_WORD to SIZE_BYTE, propagating bit 15 to bit 7 preserves
     * SIGN--but could also alter PARITY.  So we must compensate: if bit 15 differs from bit 7, then XOR resultParitySign
     * with 0xC0, which will flip not only bit 7 but also bit 6, thereby preserving PARITY.
     *
     * resultValue merits similar consideration because of the ZERO flag: if resultSize increases, nothing needs to be
     * done, because the larger size will still pick up any non-zero bits in the lower 8 bits of resultValue, but if it
     * decreases, we need to OR the upper 8 bits from resultValue into the lower 8 bits.
     *
     * Finally, this function must set the CARRY and OVERFLOW flags according to the given result.  OVERFLOW is a particular
     * pain, because it has a dependency on resultParitySign; the simplest solution is to call setOF() or clearOF().
     *
     * NOTE: Although I've yet to find confirmation of this for the 8086/8088, OVERFLOW is "undefined" on modern x86
     * CPUs for shift counts > 1 (in fact, on modern CPUs, OVERFLOW tends to be clear in those situations).  Since I set
     * OVERFLOW the same way for all shift counts, my "well-defined" behavior may or may not match the 8086/8088, but
     * until I see a defined behavior (or more importantly, some dependency on a different behavior), this seems good enough.
     *
     * UPDATE: While the desire to set resultSize to match the operand size is strong, it occurred to me later that
     * it would be easier to leave resultSize as-is and simply set CARRY and OVERFLOW based on the previous resultSize,
     * since there isn't actually any requirement or dependency (that I can think of) that resultSize always reflect the
     * operand size of the last operation.  And since only 2 of the 6 arithmetic flags need to change, that tips the scales
     * in favor of leaving resultSize alone.  However, the previous code that worked so hard to update resultSize is still
     * here, commented out; it works, but it's less efficient.
     *
     * @this {X86CPU}
     * @param {number} result (untruncated, so that we can inspect it for CARRY and OVERFLOW)
     * @param {number} size
     */
    opGrpRotateFlags: function(result, size) {
        /*
        var deltaSize = size - this.resultSize;
        if (deltaSize) {
            var bitsXOR = 0;
            var bitsSign = this.resultParitySign & 0x8080;
            if (deltaSize > 0) {
                if (bitsSign == 0x0080 || bitsSign == 0x8000) bitsXOR = 0x8000;
            } else {
                if (bitsSign == 0x0080 || bitsSign == 0x8000) bitsXOR = 0x00C0;
                this.resultValue |= (this.resultValue >> 8);
            }
            this.resultParitySign ^= bitsXOR;
            this.resultSize = size;
        }
        this.resultValue = (this.resultValue & (size - 1)) | (result & size);
        if ((result ^ (result >> 1)) & (size >> 1)) this.setOF(); else this.clearOF();
         */
        this.resultValue = (this.resultValue & (this.resultSize - 1)) | ((result & size)? this.resultSize : 0);
        if ((result ^ (result >> 1)) & (size >> 1)) this.setOF(); else this.clearOF();
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpROLb: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var temp;
            var shift = src & 0x7;      // this smaller mask obviates the need to mask with this.nShiftCountMask
            if (!shift) {
                temp = dst << 8;
            } else {
                result = (temp = (dst << shift) | (dst >> (8 - shift))) & 0xff;
            }
            X86Grps.opGrpRotateFlags.call(this, temp, X86.RESULT.SIZE_BYTE);
        }
        if (DEBUG && DEBUGGER) this.traceLog('ROLB', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpROLw: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var temp;
            var shift = src & 0xf;      // this smaller mask obviates the need to mask with this.nShiftCountMask
            if (!shift) {
                temp = dst << 16;
            } else {
                result = (temp = (dst << shift) | (dst >> (16 - shift))) & 0xffff;
            }
            X86Grps.opGrpRotateFlags.call(this, temp, X86.RESULT.SIZE_WORD);
        }
        if (DEBUG && DEBUGGER) this.traceLog('ROLW', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpRORb: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var temp;
            var shift = src & 0x7;      // this smaller mask obviates the need to mask with this.nShiftCountMask
            result = temp = ((dst >> shift) | (dst << (8 - shift))) & 0xff;
            if (temp & 0x80) temp |= X86.RESULT.SIZE_BYTE;
            X86Grps.opGrpRotateFlags.call(this, temp, X86.RESULT.SIZE_BYTE);
        }
        if (DEBUG && DEBUGGER) this.traceLog('RORB', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpRORw: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var temp;
            var shift = src & 0xf;      // this smaller mask obviates the need to mask with this.nShiftCountMask
            result = temp = ((dst >> shift) | (dst << (16 - shift))) & 0xffff;
            if (temp & 0x8000) temp |= X86.RESULT.SIZE_WORD;
            X86Grps.opGrpRotateFlags.call(this, temp, X86.RESULT.SIZE_WORD);
        }
        if (DEBUG && DEBUGGER) this.traceLog('RORW', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpRCLb: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var temp;
            var shift = (src & this.nShiftCountMask) % 0x9;
            if (!shift) {
                temp = dst | (((this.resultValue & this.resultSize)? 1 : 0) << 8);
            } else {
                temp = (dst << shift) | (((this.resultValue & this.resultSize)? 1 : 0) << (shift - 1)) | (dst >> (9 - shift));
                result = temp & 0xff;
            }
            X86Grps.opGrpRotateFlags.call(this, temp, X86.RESULT.SIZE_BYTE);
        }
        if (DEBUG && DEBUGGER) this.traceLog('RCLB', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpRCLw: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var temp;
            var shift = (src & this.nShiftCountMask) % 0x11;
            if (!shift) {
                temp = dst | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
            } else {
                temp = (dst << shift) | (((this.resultValue & this.resultSize)? 1 : 0) << (shift - 1)) | (dst >> (17 - shift));
                result = temp & 0xffff;
            }
            X86Grps.opGrpRotateFlags.call(this, temp, X86.RESULT.SIZE_WORD);
        }
        if (DEBUG && DEBUGGER) this.traceLog('RCLW', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpRCRb: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var shift = (src & this.nShiftCountMask) % 0x9;
            result = (dst >> shift) | (((this.resultValue & this.resultSize)? 1 : 0) << (8 - shift)) | (dst << (9 - shift));
            X86Grps.opGrpRotateFlags.call(this, result, X86.RESULT.SIZE_BYTE);
            result &= 0xff;
        }
        if (DEBUG && DEBUGGER) this.traceLog('RCRB', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL)
     * @return {number}
     */
    opGrpRCRw: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            var shift = (src & this.nShiftCountMask) % 0x11;
            result = (dst >> shift) | (((this.resultValue & this.resultSize)? 1 : 0) << (16 - shift)) | (dst << (17 - shift));
            X86Grps.opGrpRotateFlags.call(this, result, X86.RESULT.SIZE_WORD);
            result &= 0xffff;
        }
        if (DEBUG && DEBUGGER) this.traceLog('RCRW', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * WARNING: Although we set all the arithmetic flags for shift instructions, including
     * AUXCARRY (PS_AF), AUXCARRY isn't properly set on a real 8086/8088; its value is
     * documented as "undefined."  Similarly, OVERFLOW (PS_OF) is documented as "undefined"
     * for shifts > 1.
     *
     * For example, when AL=09, SHL AL,1 may clear PS_AF on a real CPU, but in our case,
     * it will be set.  However, until I see documented 8086/8088 behaviors for PS_AF and PS_OF
     * and/or code that depends on them, I'll continue setting PS_AF and PS_OF "normally".
     *
     * See also: AND, OR, TEST, and XOR (those instructions leave AUXCARRY "undefined" as well).
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
     * @return {number}
     */
    opGrpSHLb: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            if (src > 8)                // this comparison obviates the need to mask with this.nShiftCountMask
                result = this.resultValue = this.resultParitySign = 0;
            else
                result = (this.resultValue = this.resultParitySign = (dst << src)) & 0xff;
            this.resultAuxOverflow = 0;
            this.resultSize = X86.RESULT.SIZE_BYTE;
        }
        if (DEBUG && DEBUGGER) this.traceLog('SHLB', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * WARNING: Although we set all the arithmetic flags for shift instructions, including
     * AUXCARRY (PS_AF), AUXCARRY isn't properly set on a real 8086/8088; its value is
     * documented as "undefined."  Similarly, OVERFLOW (PS_OF) is documented as "undefined"
     * for shifts > 1.  See opGrpSHLb() for more details.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
     * @return {number}
     */
    opGrpSHLw: function(dst, src) {
        var result = dst;
        var flagsIn = (DEBUG? this.getPS() : 0);
        if (src) {
            if (src > 16)               // this comparison obviates the need to mask with this.nShiftCountMask
                result = this.resultValue = this.resultParitySign = 0;
            else
                result = (this.resultValue = this.resultParitySign = (dst << src)) & 0xffff;
            this.resultAuxOverflow = 0;
            this.resultSize = X86.RESULT.SIZE_WORD;
        }
        if (DEBUG && DEBUGGER) this.traceLog('SHLW', dst, src, flagsIn, this.getPS(), result);
        return result;
    },
    /**
     * WARNING: Although we set all the arithmetic flags for shift instructions, including
     * AUXCARRY (PS_AF), AUXCARRY isn't properly set on a real 8086/8088; its value is
     * documented as "undefined."  Similarly, OVERFLOW (PS_OF) is documented as "undefined"
     * for shifts > 1.  See opGrpSHLb() for more details.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
     * @return {number}
     */
    opGrpSHRb: function(dst, src) {
        if (src) {                      // the following comparison obviates the need to mask with this.nShiftCountMask
            var temp = (src > 8? 0 : (dst >> (src - 1)));
            this.resultValue = this.resultParitySign = temp >> 1;
            if (temp & 0x01)
                this.resultValue |= X86.RESULT.SIZE_BYTE;
            else
                this.resultValue &= ~X86.RESULT.SIZE_BYTE;
            this.resultAuxOverflow = dst ^ this.resultValue;
            this.resultSize = X86.RESULT.SIZE_BYTE;
            dst = this.resultValue;
        }
        return dst & 0xff;
    },
    /**
     * WARNING: Although we set all the arithmetic flags for shift instructions, including
     * AUXCARRY (PS_AF), AUXCARRY isn't properly set on a real 8086/8088; its value is
     * documented as "undefined."  Similarly, OVERFLOW (PS_OF) is documented as "undefined"
     * for shifts > 1.  See opGrpSHLb() for more details.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
     * @return {number}
     */
    opGrpSHRw: function(dst, src) {
        if (src) {                      // the following comparison obviates the need to mask with this.nShiftCountMask
            var temp = (src > 16? 0 : (dst >> (src - 1)));
            this.resultValue = this.resultParitySign = temp >> 1;
            if (temp & 0x01)
                this.resultValue |= X86.RESULT.SIZE_WORD;
            else
                this.resultValue &= ~X86.RESULT.SIZE_WORD;
            this.resultAuxOverflow = dst ^ this.resultValue;
            this.resultSize = X86.RESULT.SIZE_WORD;
            dst = this.resultValue;
        }
        return dst & 0xffff;
    },
    /**
     * WARNING: Although we set all the arithmetic flags for shift instructions, including
     * AUXCARRY (PS_AF), AUXCARRY isn't properly set on a real 8086/8088; its value is
     * documented as "undefined."  Similarly, OVERFLOW (PS_OF) is documented as "undefined"
     * for shifts > 1.  See opGrpSHLb() for more details.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
     * @return {number}
     */
    opGrpSARb: function(dst, src) {
        if (src) {
            if (src > 8) src = 9;       // this comparison obviates the need to mask with this.nShiftCountMask
            var temp = ((dst << 24) >> 24) >> (src - 1);
            this.resultValue = this.resultParitySign = temp >> 1;
            if (temp & 0x01)
                this.resultValue |= X86.RESULT.SIZE_BYTE;
            else
                this.resultValue &= ~X86.RESULT.SIZE_BYTE;
            this.resultAuxOverflow = dst ^ this.resultValue;
            this.resultSize = X86.RESULT.SIZE_BYTE;
            dst = this.resultValue;
        }
        return dst & 0xff;
    },
    /**
     * WARNING: Although we set all the arithmetic flags for shift instructions, including
     * AUXCARRY (PS_AF), AUXCARRY isn't properly set on a real 8086/8088; its value is
     * documented as "undefined."  Similarly, OVERFLOW (PS_OF) is documented as "undefined"
     * for shifts > 1.  See opGrpSHLb() for more details.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
     * @return {number}
     */
    opGrpSARw: function(dst, src) {
        if (src) {
            if (src > 16) src = 17;     // this comparison obviates the need to mask with this.nShiftCountMask
            var temp = ((dst << 16) >> 16) >> (src - 1);
            this.resultValue = this.resultParitySign = temp >> 1;
            if (temp & 0x01)
                this.resultValue |= X86.RESULT.SIZE_WORD;
            else
                this.resultValue &= ~X86.RESULT.SIZE_WORD;
            this.resultAuxOverflow = dst ^ this.resultValue;
            this.resultSize = X86.RESULT.SIZE_WORD;
            dst = this.resultValue;
        }
        return dst & 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null; we have to supply the source ourselves)
     * @return {number}
     */
    opGrpTEST8: function(dst, src) {
        src = this.getIPByte();
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst & src;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesTestRI : this.CYCLES.nOpCyclesTestMI);
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null; we have to supply the source ourselves)
     * @return {number}
     */
    opGrpTEST16: function(dst, src) {
        src = this.getIPWord();
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = dst & src;
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesTestRI : this.CYCLES.nOpCyclesTestMI);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpNOTb: function(dst, src) {
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesNegR : this.CYCLES.nOpCyclesNegM);
        return dst ^ 0xff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpNOTw: function(dst, src) {
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesNegR : this.CYCLES.nOpCyclesNegM);
        return dst ^ 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpNEGb: function(dst, src) {
        src = 0;
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesNegR : this.CYCLES.nOpCyclesNegM);
        return (this.resultValue = this.resultParitySign = src - dst) & 0xff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpNEGw: function(dst, src) {
        src = 0;
        this.resultAuxOverflow = dst ^ src;
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesNegR : this.CYCLES.nOpCyclesNegM);
        return (this.resultValue = this.resultParitySign = src - dst) & 0xffff;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually AX that's modified)
     */
    opGrpMULb: function(dst, src) {
        this.regAX = this.regMD16 = (this.resultValue = (src = this.regAX & 0xff) * dst) & 0xffff;
        this.resultAuxOverflow = this.resultParitySign = this.resultValue;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        /*
         * TODO: Look into a more efficient way of setting/synchronizing CF and OF; this code works,
         * but it somewhat defeats the purpose of the indirect result variables that we've set above.
         */
        if (this.regAX & 0xff00) {
            this.setCF(); this.setOF();
        } else {
            this.clearCF(); this.clearOF();
        }
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('MULB', src, dst, null, this.getPS(), this.regMD16);
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesMulBR : this.CYCLES.nOpCyclesMulBM);
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * This 16-bit multiplication must indicate when the upper 8 bits are simply a sign-extension of the
     * lower 8 bits (carry clear) and when the upper 8 bits contain significant bits (carry set).  The latter
     * will occur whenever a positive result is > 127 (0x007f) and whenever a negative result is < -128
     * (0xff80).
     *
     * Example 1: 16 * 4 = 64 (0x0040): carry is clear
     * Example 2: 16 * 8 = 128 (0x0080): carry is set (the sign bit no longer fits in the lower 8 bits)
     * Example 3: 16 * -8 (0xf8) = -128 (0xff80): carry is clear (the sign bit *still* fits in the lower 8 bits)
     * Example 4: 16 * -16 (0xf0) = -256 (0xff00): carry is set (the sign bit no longer fits in the lower 8 bits)
     *
     * An earlier version of this function assumed it simply needed to check bit 7 of the result to determine carry,
     * which was completely broken.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually AX that's modified)
     */
    opGrpIMULb: function(dst, src) {
        var result = (((src = this.regAX) << 24) >> 24) * ((dst << 24) >> 24);
        this.regAX = this.regMD16 = result & 0xffff;
        this.resultValue = this.resultAuxOverflow = this.resultParitySign = result;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        /*
         * TODO: Look into a more efficient way of setting/synchronizing CF and OF; this code works,
         * but it somewhat defeats the purpose of the indirect result variables that we've set above.
         */
        if (result > 127 || result < -128) {
            this.setCF(); this.setOF();
        } else {
            this.clearCF(); this.clearOF();
        }
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('IMULB', src, dst, null, this.getPS(), this.regMD16);
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIMulBR : this.CYCLES.nOpCyclesIMulBM);
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually AX that's modified)
     */
    opGrpDIVb: function(dst, src) {
        /*
         * Detect zero divisor
         */
        if (!dst) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        /*
         * Detect small divisor (quotient overflow)
         */
        var uQuotient = ((src = this.regAX) / dst);
        if (uQuotient > 0xff) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        this.regMD16 = this.regAX = (uQuotient & 0xff) | (((this.regAX % dst) & 0xff) << 8);
        /*
         * TODO: Verify that all of the arithmetic flags are "undefined" after DIV, and that this code unnecessary
         */
        this.resultParitySign = this.resultAuxOverflow = (this.resultValue = uQuotient | X86.RESULT.SIZE_BYTE);
        this.resultSize = X86.RESULT.SIZE_BYTE;
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('DIVB', src, dst, null, this.getPS(), this.regMD16);
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesDivBR : this.CYCLES.nOpCyclesDivBM);
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually AX that's modified)
     *
     * TODO: Implement the following difference, from "AP-186: Introduction to the 80186 Microprocessor, March 1983":
     *
     *      "The 8086 will cause a divide error whenever the absolute value of the quotient is greater then 7FFFH
     *      (for word operations) or if the absolute value of the quotient is greater than 7FH (for byte operations).
     *      The 80186 has expanded the range of negative numbers allowed as a quotient by 1 to include 8000H and 80H.
     *      These numbers represent the most negative numbers representable using 2's complement arithmetic (equaling
     *      -32768 and -128 in decimal, respectively)."
     */
    opGrpIDIVb: function(dst, src) {
        /*
         * Detect zero divisor
         */
        if (!dst) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        /*
         * Detect small divisor (quotient overflow)
         */
        var lQuotient = ((((src = this.regAX) << 16) >> 16) / ((dst << 24) >> 24));
        if (lQuotient > ((lQuotient << 24) >> 24) & 0xffff) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        this.regMD16 = this.regAX = (lQuotient & 0xff) | (((((this.regAX << 16) >> 16) % ((dst << 24) >> 24)) & 0xff) << 8);
        /*
         * TODO: Verify that all of the arithmetic flags are "undefined" after IDIV, and that this code unnecessary
         */
        this.resultParitySign = this.resultAuxOverflow = (this.resultValue = lQuotient | X86.RESULT.SIZE_BYTE);
        this.resultSize = X86.RESULT.SIZE_BYTE;
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('IDIVB', src, dst, null, this.getPS(), this.regMD16);
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIDivBR : this.CYCLES.nOpCyclesIDivBM);
        if (EAFUNCS) this.setEAByte = this.setEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually DX:AX that's modified)
     */
    opGrpMULw: function(dst, src) {
        this.regMD16 = this.regAX = (this.resultValue = (src = this.regAX) * dst) & 0xffff;
        this.regMD32 = this.regDX = (this.resultValue >> 16) & 0xffff;
        this.resultAuxOverflow = this.resultParitySign = this.resultValue;
        this.resultSize = X86.RESULT.SIZE_WORD;
        /*
         * TODO: Look into a more efficient way of setting/synchronizing CF and OF; this code works,
         * but it somewhat defeats the purpose of the indirect result variables that we've set above.
         */
        if (this.regDX) {
            this.setCF(); this.setOF();
        } else {
            this.clearCF(); this.clearOF();
        }
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('MULW', src, dst, null, this.getPS(), this.regMD16 | (this.regMD32 << 16));
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesMulWR : this.CYCLES.nOpCyclesMulWM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * This 32-bit multiplication must indicate when the upper 16 bits are simply a sign-extension of the
     * lower 16 bits (carry clear) and when the upper 16 bits contain significant bits (carry set).  The latter
     * will occur whenever a positive result is > 32767 (0x00007fff) and whenever a negative result is < -32768
     * (0xffff8000).
     *
     * Example 1: 256 * 64 = 16384 (0x00004000): carry is clear
     * Example 2: 256 * 128 = 32768 (0x00008000): carry is set (the sign bit no longer fits in the lower 16 bits)
     * Example 3: 256 * -128 (0xff80) = -32768 (0xffff8000): carry is clear (the sign bit *still* fits in the lower 16 bits)
     * Example 4: 256 * -256 (0xff00) = -65536 (0xffff0000): carry is set (the sign bit no longer fits in the lower 16 bits)
     *
     * An earlier version of this function assumed it simply needed to check bit 15 of the result to determine carry,
     * which was completely broken.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually DX:AX that's modified)
     */
    opGrpIMULw: function(dst, src) {
        var result = (((src = this.regAX) << 16) >> 16) * ((dst << 16) >> 16);
        this.regAX = this.regMD16 = result & 0xffff;
        this.regDX = this.regMD32 = (result >> 16) & 0xffff;
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
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('IMULW', src, dst, null, this.getPS(), this.regMD16 | (this.regMD32 << 16));
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIMulWR : this.CYCLES.nOpCyclesIMulWM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually DX:AX that's modified)
     */
    opGrpDIVw: function(dst, src) {
        /*
         * Detect zero divisor
         */
        if (!dst) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        /*
         * Detect small divisor (quotient overflow)
         *
         * WARNING: We CANNOT simply do "src = (this.regDX << 16) | this.regAX", because if bit 15 of DX
         * is set, JavaScript will create a negative 32-bit number.  So we instead use non-bit-wise operators
         * to force JavaScript to create a floating-point value that won't suffer from 32-bit-math side-effects.
         */
        src = this.regAX + this.regDX * X86.RESULT.SIZE_WORD;
        var uQuotient = Math.floor(src / dst);
        if (uQuotient >= X86.RESULT.SIZE_WORD) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        this.regMD16 = this.regAX = (uQuotient & 0xffff);
        this.regMD32 = this.regDX = (src % dst) & 0xffff;
        /*
         * TODO: Verify that all of the arithmetic flags are "undefined" after DIV, and that this code unnecessary
         */
        this.resultParitySign = this.resultAuxOverflow = (this.resultValue = uQuotient | X86.RESULT.SIZE_WORD);
        this.resultSize = X86.RESULT.SIZE_WORD;
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('DIVW', src, dst, null, this.getPS(), this.regMD16 | (this.regMD32 << 16));
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesDivWR : this.CYCLES.nOpCyclesDivWM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number} (we return dst unchanged, since it's actually DX:AX that's modified)
     *
     * TODO: Implement the following difference, from "AP-186: Introduction to the 80186 Microprocessor, March 1983":
     *
     *      "The 8086 will cause a divide error whenever the absolute value of the quotient is greater then 7FFFH
     *      (for word operations) or if the absolute value of the quotient is greater than 7FH (for byte operations).
     *      The 80186 has expanded the range of negative numbers allowed as a quotient by 1 to include 8000H and 80H.
     *      These numbers represent the most negative numbers representable using 2's complement arithmetic (equaling
     *      -32768 and -128 in decimal, respectively)."
     */
    opGrpIDIVw: function(dst, src) {
        /*
         * Detect zero divisor
         */
        if (!dst) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        /*
         * Detect small divisor (quotient overflow)
         */
        var lDivisor = ((dst << 16) >> 16);
        src = (this.regDX << 16) | this.regAX;
        var lQuotient = Math.floor(src / lDivisor);
        if (lQuotient != ((lQuotient & 0xffff) << 16) >> 16) {
            X86Help.opHelpDIVOverflow.call(this);
            return dst;
        }
        this.regMD16 = this.regAX = (lQuotient & 0xffff);
        this.regMD32 = this.regDX = (src % lDivisor) & 0xffff;
        /*
         * TODO: Verify that all of the arithmetic flags are "undefined" after IDIV, and that this code unnecessary
         */
        this.resultParitySign = this.resultAuxOverflow = (this.resultValue = lQuotient | X86.RESULT.SIZE_WORD);
        this.resultSize = X86.RESULT.SIZE_WORD;
        /*
         * Multiply/divide instructions specify only a single operand, which the decoders pass to us
         * via the dst parameter, so we set src to the other implied operand (either AX or DX:AX).
         * However, src is technically an output, and dst is merely an input (which is why we must return
         * dst unchanged). So, to make traceLog() more consistent, we reverse the order of dst and src.
         */
        if (DEBUG && DEBUGGER) this.traceLog('IDIVW', src, dst, null, this.getPS(), this.regMD16 | (this.regMD32 << 16));
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIDivWR : this.CYCLES.nOpCyclesIDivWM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpINCb: function(dst, src) {
        this.resultAuxOverflow = dst;
        dst = (this.resultParitySign = dst + 1) & 0xff;
        this.resultValue = dst | (((this.resultValue & this.resultSize)? 1 : 0) << 8);
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIncR : this.CYCLES.nOpCyclesIncM);
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpDECb: function(dst, src) {
        this.resultAuxOverflow = dst;
        dst = (this.resultParitySign = dst - 1) & 0xff;
        this.resultValue = dst | (((this.resultValue & this.resultSize)? 1 : 0) << 8);
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIncR : this.CYCLES.nOpCyclesIncM);
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpINCw: function(dst, src) {
        this.resultAuxOverflow = dst;
        dst = (this.resultParitySign = dst + 1) & 0xffff;
        this.resultValue = dst | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIncR : this.CYCLES.nOpCyclesIncM);
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpDECw: function(dst, src) {
        this.resultAuxOverflow = dst;
        dst = (this.resultParitySign = dst - 1) & 0xffff;
        this.resultValue = dst | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesIncR : this.CYCLES.nOpCyclesIncM);
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpCALLw: function(dst, src) {
        this.pushWord(this.regIP);
        this.setIP(dst);
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesCallWR : this.CYCLES.nOpCyclesCallWM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpCALLFdw: function(dst, src) {
        if (this.regEA < 0) {
            return X86Grps.opGrpUndefined.call(this, dst, src);
        }
        X86Help.opHelpCALLF.call(this, dst, this.getWord(this.regEA + 2));
        this.nStepCycles -= this.CYCLES.nOpCyclesCallDM;
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpJMPw: function(dst, src) {
        this.setIP(dst);
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesJmpWR : this.CYCLES.nOpCyclesJmpWM);
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpJMPFdw: function(dst, src) {
        if (this.regEA < 0) {
            return X86Grps.opGrpUndefined.call(this, dst, src);
        }
        this.setCSIP(dst, this.getWord(this.regEA + 2));
        if (this.cIntReturn) this.checkIntReturn(this.regEIP);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpDM;
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opGrpPUSHw: function(dst, src) {
        var w = dst;
        if (this.opFlags & X86.OPFLAG.PUSHSP) {
            /*
             * This is the one case where must actually modify dst, so that the ModRM function will
             * not put a stale value back into the SP register.
             */
            dst = (dst - 2) & 0xffff;
            /*
             * And on the 8086/8088, the value we just calculated also happens to be the value that must
             * be pushed.
             */
            if (this.model < X86.MODEL_80286) w = dst;
        }
        this.pushWord(w);
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesPushReg : this.CYCLES.nOpCyclesPushMem);
        /*
         * The PUSH is the only write that needs to occur; dst was the source operand and does not need to be rewritten.
         */
        if (EAFUNCS) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    },
    /**
     * @this {X86CPU}
     * @return {number}
     */
    opGrp2Count1: function() {
        this.nStepCycles -= (this.regEA < 0? 2 : this.CYCLES.nOpCyclesShift1M);
        return 1;
    },
    /**
     * @this {X86CPU}
     * @return {number}
     */
    opGrp2CountCL: function() {
        var count = this.regCX & this.nShiftCountMask;
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesShiftCR : this.CYCLES.nOpCyclesShiftCM) + (count << this.CYCLES.nOpCyclesShiftCS);
        return count;
    },
    /**
     * @this {X86CPU}
     * @return {number}
     */
    opGrp2CountImm: function() {
        var count = this.getIPByte();
        this.nStepCycles -= (this.regEA < 0? this.CYCLES.nOpCyclesShiftCR : this.CYCLES.nOpCyclesShiftCM) + (count << this.CYCLES.nOpCyclesShiftCS);
        return count;
    },
    /**
     * @this {X86CPU}
     * @return {number|null}
     */
    opGrpNoSrc: function() {
        return null;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpFault: function(dst, src) {
        X86Help.opHelpFault.call(this, X86.EXCEPTION.GP_FAULT, 0);
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpInvalid: function(dst, src) {
        X86Help.opHelpInvalid.call(this);
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src
     * @return {number}
     */
    opGrpUndefined: function(dst, src) {
        X86Help.opHelpUndefined.call(this);
        return dst;
    }
};

/*
 * A word (or two) on instruction groups (eg, Grp1, Grp2), which are groups of instructions that
 * use a mod/reg/rm byte, where the reg field of that byte selects a function rather than a register.
 *
 * I start with the groupings used by Intel's "Pentium Processor User's Manual (Volume 3: Architecture
 * and Programming Manual)", but I deviate slightly, mostly by subdividing their groups with the use
 * of suffixes:
 *
 *      Opcodes     Intel       PCjs                                                PC Mag TechRef
 *      -------     -----       ----                                                --------------
 *      0x80-0x83   Grp1        Grp1b, Grp1w, Grp1b, and Grp1sw                     Group A
 *      0xC0-0xC1   Grp2a       Grp2ab and Grp2aw                                   Group B
 *      0xD0-0xD3   Grp2        Grp2b and Grp2w                                     Group B
 *      0xF6-0xF7   Grp3        Grp3b and Grp3w                                     Group C
 *      0xFE        Grp4        Grp4b                                               Group D
 *      0xFF        Grp5        Grp4w                                               Group E
 *      0x0F,0x00   Grp6        Grp6 (SLDT, STR, LLDT, LTR, VERR, VERW)             Group F
 *      0x0F,0x01   Grp7        Grp7 (SGDT, SIDT, LGDT, LIDT, SMSW, LMSW, INVLPG)   Group G
 *      0x0F,0xBA   Grp8        Grp8 (BT, BTS, BTR, BTC)                            Group H
 *      0x0F,0xC7   Grp9        Grp9 (CMPXCH)                                       (N/A, 80386 and up)
 *
 * My only serious deviation is Grp5, which I refer to as Grp4w, because it contains word forms of
 * the INC and DEC instructions found in Grp4b.  Granted, Grp4w also contains versions of the CALL,
 * JMP and PUSH instructions, which are not in Grp4b, but there's nothing in Grp4b that conflicts with
 * Grp4w, so I think my nomenclature makes more sense.  To compensate, I don't use Grp5, so that the
 * remaining group numbers remain in sync with Intel's.
 */
X86Grps.aOpGrp1b = [
    X86Grps.opGrpADDb,      X86Grps.opGrpORb,       X86Grps.opGrpADCb,      X86Grps.opGrpSBBb,      // 0x80/0x82(reg=0x0-0x3)
    X86Grps.opGrpANDb,      X86Grps.opGrpSUBb,      X86Grps.opGrpXORb,      X86Grps.opGrpCMPb       // 0x80/0x82(reg=0x4-0x7)
];

X86Grps.aOpGrp1w = [
    X86Grps.opGrpADDw,      X86Grps.opGrpORw,       X86Grps.opGrpADCw,      X86Grps.opGrpSBBw,      // 0x81/0x83(reg=0x0-0x3)
    X86Grps.opGrpANDw,      X86Grps.opGrpSUBw,      X86Grps.opGrpXORw,      X86Grps.opGrpCMPw       // 0x81/0x83(reg=0x4-0x7)
];

X86Grps.aOpGrpPOPw = [
    X86Grps.opGrpPOPw,      X86Grps.opGrpFault,     X86Grps.opGrpFault,     X86Grps.opGrpFault,     // 0x8F(reg=0x0-0x3)
    X86Grps.opGrpFault,     X86Grps.opGrpFault,     X86Grps.opGrpFault,     X86Grps.opGrpFault      // 0x8F(reg=0x4-0x7)
];

X86Grps.aOpGrpMOVImm = [
    X86Grps.opGrpMOVImm,    X86Grps.opGrpUndefined, X86Grps.opGrpUndefined, X86Grps.opGrpUndefined, // 0xC6/0xC7(reg=0x0-0x3)
    X86Grps.opGrpUndefined, X86Grps.opGrpUndefined, X86Grps.opGrpUndefined, X86Grps.opGrpUndefined  // 0xC6/0xC7(reg=0x4-0x7)
];

X86Grps.aOpGrp2b = [
    X86Grps.opGrpROLb,      X86Grps.opGrpRORb,      X86Grps.opGrpRCLb,      X86Grps.opGrpRCRb,      // 0xD0/0xD2(reg=0x0-0x3)
    X86Grps.opGrpSHLb,      X86Grps.opGrpSHRb,      X86Grps.opGrpUndefined, X86Grps.opGrpSARb       // 0xD0/0xD2(reg=0x4-0x7)
];

X86Grps.aOpGrp2w = [
    X86Grps.opGrpROLw,      X86Grps.opGrpRORw,      X86Grps.opGrpRCLw,      X86Grps.opGrpRCRw,      // 0xD1/0xD3(reg=0x0-0x3)
    X86Grps.opGrpSHLw,      X86Grps.opGrpSHRw,      X86Grps.opGrpUndefined, X86Grps.opGrpSARw       // 0xD1/0xD3(reg=0x4-0x7)
];

X86Grps.aOpGrp3b = [
    X86Grps.opGrpTEST8,     X86Grps.opGrpUndefined, X86Grps.opGrpNOTb,      X86Grps.opGrpNEGb,      // 0xF6(reg=0x0-0x3)
    X86Grps.opGrpMULb,      X86Grps.opGrpIMULb,     X86Grps.opGrpDIVb,      X86Grps.opGrpIDIVb      // 0xF6(reg=0x4-0x7)
];

X86Grps.aOpGrp3w = [
    X86Grps.opGrpTEST16,    X86Grps.opGrpUndefined, X86Grps.opGrpNOTw,      X86Grps.opGrpNEGw,      // 0xF7(reg=0x0-0x3)
    X86Grps.opGrpMULw,      X86Grps.opGrpIMULw,     X86Grps.opGrpDIVw,      X86Grps.opGrpIDIVw      // 0xF7(reg=0x4-0x7)
];

X86Grps.aOpGrp4b = [
    X86Grps.opGrpINCb,      X86Grps.opGrpDECb,      X86Grps.opGrpUndefined, X86Grps.opGrpUndefined, // 0xFE(reg=0x0-0x3)
    X86Grps.opGrpUndefined, X86Grps.opGrpUndefined, X86Grps.opGrpUndefined, X86Grps.opGrpUndefined  // 0xFE(reg=0x4-0x7)
];

X86Grps.aOpGrp4w = [
    X86Grps.opGrpINCw,      X86Grps.opGrpDECw,      X86Grps.opGrpCALLw,     X86Grps.opGrpCALLFdw,   // 0xFF(reg=0x0-0x3)
    X86Grps.opGrpJMPw,      X86Grps.opGrpJMPFdw,    X86Grps.opGrpPUSHw,     X86Grps.opGrpFault      // 0xFF(reg=0x4-0x7)
];

/*
 * The following are for 80186/80188 and up...
 */
X86Grps.aOpGrp2ab = [
    X86Grps.opGrpROLb,      X86Grps.opGrpRORb,      X86Grps.opGrpRCLb,      X86Grps.opGrpRCRb,      // 0xC0(reg=0x0-0x3)
    X86Grps.opGrpSHLb,      X86Grps.opGrpSHRb,      X86Grps.opGrpUndefined, X86Grps.opGrpSARb       // 0xC0(reg=0x4-0x7)
];

X86Grps.aOpGrp2aw = [
    X86Grps.opGrpROLw,      X86Grps.opGrpRORw,      X86Grps.opGrpRCLw,      X86Grps.opGrpRCRw,      // 0xC1(reg=0x0-0x3)
    X86Grps.opGrpSHLw,      X86Grps.opGrpSHRw,      X86Grps.opGrpUndefined, X86Grps.opGrpSARw       // 0xC1(reg=0x4-0x7)
];

if (typeof module !== 'undefined') module.exports = X86Grps;
