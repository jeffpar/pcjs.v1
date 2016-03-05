/**
 * @fileoverview Implements PCjs opcode helpers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Mar-04
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see Computer.COPYRIGHT).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

if (NODE) {
    var str         = require("../../shared/lib/strlib");
    var Messages    = require("./messages");
    var X86         = require("./x86");
}

/**
 * fnAdd64(dst, src)
 *
 * Adds src to dst.
 *
 * @param {Array} dst is a 64-bit value
 * @param {Array} src is a 64-bit value
 */
X86.fnAdd64 = function(dst, src)
{
    dst[0] += src[0];
    dst[1] += src[1];
    if (dst[0] > 0xffffffff) {
        dst[0] >>>= 0;          // truncate dst[0] to 32 bits AND keep it unsigned
        dst[1]++;
    }
};

/**
 * fnCmp64(dst, src)
 *
 * Compares dst to src, by computing dst - src.
 *
 * @param {Array} dst is a 64-bit value
 * @param {Array} src is a 64-bit value
 * @return {number} > 0 if dst > src, == 0 if dst == src, < 0 if dst < src
 */
X86.fnCmp64 = function(dst, src)
{
    var result = dst[1] - src[1];
    if (!result) result = dst[0] - src[0];
    return result;
};

/**
 * fnSet64(lo, hi)
 *
 * @param {number} lo
 * @param {number} hi
 */
X86.fnSet64 = function(lo, hi)
{
    return [lo >>> 0, hi >>> 0];
};

/**
 * fnShr64(dst)
 *
 * Shifts dst right one bit.
 *
 * @param {Array} dst is a 64-bit value
 */
X86.fnShr64 = function(dst)
{
    dst[0] >>>= 1;
    if (dst[1] & 0x1) {
        dst[0] = (dst[0] | 0x80000000) >>> 0;
    }
    dst[1] >>>= 1;
};

/**
 * fnSub64(dst, src)
 *
 * Subtracts src from dst.
 *
 * @param {Array} dst is a 64-bit value
 * @param {Array} src is a 64-bit value
 */
X86.fnSub64 = function(dst, src)
{
    dst[0] -= src[0];
    dst[1] -= src[1];
    if (dst[0] < 0) {
        dst[0] >>>= 0;          // truncate dst[0] to 32 bits AND keep it unsigned
        dst[1]--;
    }
};

/**
 * fnDECr(w)
 *
 * @this {X86CPU}
 * @param {number} w
 * @return {number}
 */
X86.fnDECr = function(w)
{
    var result = (w - 1)|0;
    this.setArithResult(w, 1, result, this.typeData | X86.RESULT.NOTCF, true);
    this.nStepCycles -= 2;                          // the register form of DEC takes 2 cycles on all CPUs
    return (w & ~this.maskData) | (result & this.maskData);
};

/**
 * fnDIV32(dstLo, dstHi, src)
 *
 * This sets regMDLo to dstHi:dstLo / src, and regMDHi to dstHi:dstLo % src; all inputs are treated as unsigned.
 *
 * Refer to: http://lxr.linux.no/linux+v2.6.22/lib/div64.c
 *
 * @this {X86CPU}
 * @param {number} dstLo (low 32-bit portion of dividend)
 * @param {number} dstHi (high 32-bit portion of dividend)
 * @param {number} src (32-bit divisor)
 * @return {boolean} true if successful, false if overflow (ie, the divisor was either zero or too small)
 */
X86.fnDIV32 = function(dstLo, dstHi, src)
{
    src >>>= 0;
    if (!src || src <= (dstHi >>> 0)) {
        return false;
    }

    var result = 0, bit = 1;

    var div = X86.fnSet64(src, 0);
    var rem = X86.fnSet64(dstLo, dstHi);

    while (X86.fnCmp64(rem, div) > 0) {
        X86.fnAdd64(div, div);
        bit += bit;
    }
    do {
        if (X86.fnCmp64(rem, div) >= 0) {
            X86.fnSub64(rem, div);
            result += bit;
        }
        X86.fnShr64(div);
        bit /= 2;
    } while (bit >= 1);

    this.assert(result <= 0xffffffff && !rem[1]);

    this.regMDLo = result;              // result is the quotient, which callers expect in the low MD register
    this.regMDHi = rem[0];              // rem[0] is the remainder, which callers expect in the high MD register
    return true;
};

/**
 * fnIDIV32(dstLo, dstHi, src)
 *
 * This sets regMDLo to dstHi:dstLo / src, and regMDHi to dstHi:dstLo % src; all inputs are treated as signed.
 *
 * Refer to: http://lxr.linux.no/linux+v2.6.22/lib/div64.c
 *
 * @this {X86CPU}
 * @param {number} dstLo (low 32-bit portion of dividend)
 * @param {number} dstHi (high 32-bit portion of dividend)
 * @param {number} src (32-bit divisor)
 * @return {boolean} true if successful, false if overflow (ie, the divisor was either zero or too small)
 */
X86.fnIDIV32 = function(dstLo, dstHi, src)
{
    var bNegLo = 0, bNegHi = 0;
    /*
     *      dividend    divisor       quotient    remainder
     *        (dst)      (src)          (lo)         (hi)
     *      --------    -------       --------    ---------
     *         +           +     ->       +           +
     *         +           -     ->       -           +
     *         -           +     ->       -           -
     *         -           -     ->       +           -
     */
    if (src < 0) {
        src = -src|0;
        bNegLo = 1 - bNegLo;
    }
    if (dstHi < 0) {
        dstLo = -dstLo|0;
        dstHi = (~dstHi + (dstLo? 0 : 1))|0;
        bNegHi = 1;
        bNegLo = 1 - bNegLo;
    }
    if (!X86.fnDIV32.call(this, dstLo, dstHi, src) || this.regMDLo > 0x7fffffff+bNegLo || this.regMDHi > 0x7fffffff+bNegHi) {
        return false;
    }
    if (bNegLo) this.regMDLo = -this.regMDLo;
    if (bNegHi) this.regMDHi = -this.regMDHi;
    return true;
};

/**
 * fnINCr(w)
 *
 * @this {X86CPU}
 * @param {number} w
 * @return {number}
 */
X86.fnINCr = function(w)
{
    var result = (w + 1)|0;
    this.setArithResult(w, 1, result, this.typeData | X86.RESULT.NOTCF);
    this.nStepCycles -= 2;                          // the register form of INC takes 2 cycles on all CPUs
    return (w & ~this.maskData) | (result & this.maskData);
};

/**
 * fnLCR0(l)
 *
 * This is called by an 80386 control instruction (ie, MOV CR0,reg).
 *
 * TODO: Determine which CR0 bits, if any, cannot be modified by MOV CR0,reg.
 *
 * @this {X86CPU}
 * @param {number} l
 */
X86.fnLCR0 = function(l)
{
    this.regCR0 = l;
    this.setProtMode();
    if (this.regCR0 & X86.CR0.PG) {
        /*
         * TODO: Determine if setting X86.CR0.PG when already set should really act as a flush;
         * I'm not currently worried about it, because I'm assuming CR0 is not rewritten that often.
         */
        this.enablePageBlocks();
    } else {
        this.disablePageBlocks();
    }
};

/**
 * fnLCR3(l)
 *
 * This is called by an 80386 control instruction (ie, MOV CR3,reg) or an 80386 task switch.
 *
 * @this {X86CPU}
 * @param {number} l
 */
X86.fnLCR3 = function(l)
{
    this.regCR3 = l;
    /*
     * Normal use of regCR3 involves adding a 0-4K (12-bit) offset to obtain a page directory entry,
     * so let's ensure that the low 12 bits of regCR3 are always zero.
     */
    this.assert(!(this.regCR3 & X86.LADDR.OFFSET));
    this.flushPageBlocks();
};

/**
 * fnSETcc()
 *
 * @this {X86CPU}
 * @param {function(number,number)} fnSet
 */
X86.fnSETcc = function(fnSet)
{
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.aOpModMemByte[this.getIPByte()].call(this, fnSet);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 4 : 5);
};

/**
 * fnSHLDw(dst, src, count)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @param {number} count (0-31)
 * @return {number}
 */
X86.fnSHLDw = function(dst, src, count)
{
    if (count) {
        if (count > 16) {
            dst = src;
            count -= 16;
        }
        var carry = dst << (count - 1);
        dst = ((carry << 1) | (src >>> (16 - count))) & 0xffff;
        this.setLogicResult(dst, X86.RESULT.WORD, carry & X86.RESULT.WORD);
    }
    return dst;
};

/**
 * fnSHLDd(dst, src, count)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @param {number} count
 * @return {number}
 */
X86.fnSHLDd = function(dst, src, count)
{
    if (count) {
        var carry = dst << (count - 1);
        dst = (carry << 1) | (src >>> (32 - count));
        this.setLogicResult(dst, X86.RESULT.DWORD, carry & X86.RESULT.DWORD);
    }
    return dst;
};

/**
 * fnSHRDw(dst, src, count)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @param {number} count (0-31)
 * @return {number}
 */
X86.fnSHRDw = function(dst, src, count)
{
    if (count) {
        if (count > 16) {
            dst = src;
            count -= 16;
        }
        var carry = dst >>> (count - 1);
        dst = ((carry >>> 1) | (src << (16 - count))) & 0xffff;
        this.setLogicResult(dst, X86.RESULT.WORD, carry & 0x1);
    }
    return dst;
};

/**
 * fnSHRDd(dst, src, count)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @param {number} count
 * @return {number}
 */
X86.fnSHRDd = function(dst, src, count)
{
    if (count) {
        var carry = dst >>> (count - 1);
        dst = (carry >>> 1) | (src << (32 - count));
        this.setLogicResult(dst, X86.RESULT.DWORD, carry & 0x1);
    }
    return dst;
};

/**
 * fnSRC1()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86.fnSRC1 = function()
{
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 2 : this.cycleCounts.nOpCyclesShift1M);
    return 1;
};

/**
 * fnSRCCL()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86.fnSRCCL = function()
{
    var count = this.regECX & 0xff;
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesShiftCR : this.cycleCounts.nOpCyclesShiftCM) + (count << this.cycleCounts.nOpCyclesShiftCS);
    return count;
};

/**
 * fnSRCByte()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86.fnSRCByte = function()
{
    var count = this.getIPByte();
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesShiftCR : this.cycleCounts.nOpCyclesShiftCM) + (count << this.cycleCounts.nOpCyclesShiftCS);
    return count;
};

/**
 * fnSRCNone()
 *
 * @this {X86CPU}
 * @return {number|null}
 */
X86.fnSRCNone = function()
{
    return null;
};

/**
 * fnSRCxx()
 *
 * This is used by opPOPmw(), because the actual pop must occur BEFORE the effective address (EA)
 * calculation.  So opPOPmw() does the pop, saves the popped value in regXX, and this passes src function
 * to the EA worker.
 *
 * @this {X86CPU}
 * @return {number} regXX
 */
X86.fnSRCxx = function()
{
    return this.regXX;
};
