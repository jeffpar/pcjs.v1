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

if (NODE) {
    var str         = require("../../shared/lib/strlib");
    var Messages    = require("./messages");
    var X86         = require("./x86");
}

/**
 * fnADCb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnADCb = function(dst, src)
{
    var b = (dst + src + this.getCarry())|0;
    this.setArithResult(dst, src, b, X86.RESULT.BYTE | X86.RESULT.ALL);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return b & 0xff;
};

/**
 * fnADCw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnADCw = function(dst, src)
{
    var w = (dst + src + this.getCarry())|0;
    this.setArithResult(dst, src, w, this.typeData | X86.RESULT.ALL);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return w & this.maskData;
};

/**
 * fnADDb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnADDb = function(dst, src)
{
    var b = (dst + src)|0;
    this.setArithResult(dst, src, b, X86.RESULT.BYTE | X86.RESULT.ALL);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return b & 0xff;
};

/**
 * fnADDw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnADDw = function(dst, src)
{
    var w = (dst + src)|0;
    this.setArithResult(dst, src, w, this.typeData | X86.RESULT.ALL);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return w & this.maskData;
};

/**
 * fnANDb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnANDb = function(dst, src)
{
    var b = dst & src;
    this.setLogicResult(b, X86.RESULT.BYTE);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return b;
};

/**
 * fnANDw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnANDw = function(dst, src)
{
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return this.setLogicResult(dst & src, this.typeData) & this.maskData;
};

/**
 * fnARPL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnARPL = function(dst, src)
{
    this.nStepCycles -= (10 + (this.regEA === X86.ADDR_INVALID? 0 : 1));
    if ((dst & X86.SEL.RPL) < (src & X86.SEL.RPL)) {
        dst = (dst & ~X86.SEL.RPL) | (src & X86.SEL.RPL);
        this.setZF();
        return dst;
    }
    this.clearZF();
    return dst;
};

/**
 * fnBOUND(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBOUND = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        /*
         * Generate UD_FAULT (INT 0x06: Invalid Opcode) if src is not a memory operand.
         */
        X86.opInvalid.call(this);
        return dst;
    }
    /*
     * Note that BOUND performs signed comparisons, so we must transform all arguments into signed values.
     */
    var wIndex = dst;
    var wLower = this.getWord(this.regEA);
    var wUpper = this.getWord(this.regEA + this.sizeData);
    if (this.sizeData == 2) {
        wIndex = (dst << 16) >> 16;
        wLower = (wLower << 16) >> 16;
        wUpper = (wUpper << 16) >> 16;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesBound;
    if (wIndex < wLower || wIndex > wUpper) {
        /*
         * The INT 0x05 handler must be called with CS:IP pointing to the BOUND instruction.
         *
         * TODO: Determine the cycle cost when a BOUND exception is triggered, over and above nCyclesBound,
         * and then call X86.fnFault(X86.EXCEPTION.BR_FAULT, null, nCycles).
         */
        X86.fnFault.call(this, X86.EXCEPTION.BR_FAULT);
    }
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnBSF(dst, src)
 *
 * Scan src starting at bit 0.  If a set bit is found, the bit index is stored in dst and ZF is cleared;
 * otherwise, ZF is set and dst is unchanged.
 *
 * NOTES: Early versions of the 80386 manuals misstated how ZF was set/cleared.  Also, Intel insists that
 * dst is undefined whenever ZF is set, but in fact, the 80386 leaves dst unchanged when that happens;
 * unfortunately, some early 80486s would always modify dst, so it is unsafe to rely on dst when ZF is set.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBSF = function(dst, src)
{
    var n = 0;
    if (!src) {
        this.setZF();
    } else {
        this.clearZF();
        var bit = 0x1;
        while (bit & this.maskData) {
            if (src & bit) {
                dst = n;
                break;
            }
            bit <<= 1;
            n++;                // TODO: Determine if n should be incremented before the bailout for an accurate cycle count
        }
    }
    this.nStepCycles -= 11 + n * 3;
    return dst;
};

/**
 * fnBSR(dst, src)
 *
 * Scan src starting from the highest bit.  If a set bit is found, the bit index is stored in dst and ZF is
 * cleared; otherwise, ZF is set and dst is unchanged.
 *
 * NOTES: Early versions of the 80386 manuals misstated how ZF was set/cleared.  Also, Intel insists that
 * dst is undefined whenever ZF is set, but in fact, the 80386 leaves dst unchanged when that happens;
 * unfortunately, some early 80486s would always modify dst, so it is unsafe to rely on dst when ZF is set.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBSR = function(dst, src)
{
    var n = 0;
    if (!src) {
        this.setZF();
    } else {
        this.clearZF();
        var i = (this.sizeData == 2? 15 : 31), bit = 1 << i;
        while (bit) {
            if (src & bit) {
                dst = i;
                break;
            }
            bit >>>= 1;
            n++; i--;           // TODO: Determine if n should be incremented before the bailout for an accurate cycle count
        }

    }
    this.nStepCycles -= 11 + n * 3;
    return dst;
};

/**
 * fnBT(dst, src)
 *
 * In this form of BT, src is an immediate operand (OR dst is register operand); immediate operands
 * are supposed to be masked with either 0xf or 0x1f for 16-bit or 32-bit operands, respectively.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBT = function(dst, src)
{
    var bit = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & bit) this.setCF(); else this.clearCF();
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 3 : 6);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnBTC(dst, src)
 *
 * In this form of BTC, src is an immediate operand (OR dst is register operand); immediate operands
 * are supposed to be masked with either 0xf or 0x1f for 16-bit or 32-bit operands, respectively.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBTC = function(dst, src)
{
    var bit = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & bit) this.setCF(); else this.clearCF();
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 6 : 8);
    return dst ^ bit;
};

/**
 * fnBTR(dst, src)
 *
 * In this form of BTR, src is an immediate operand (OR dst is register operand); immediate operands
 * are supposed to be masked with either 0xf or 0x1f for 16-bit or 32-bit operands, respectively.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBTR = function(dst, src)
{
    var bit = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & bit) this.setCF(); else this.clearCF();
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 6 : 8);
    return dst & ~bit;
};

/**
 * fnBTS(dst, src)
 *
 * In this form of BTS, src is an immediate operand (OR dst is register operand); immediate operands
 * are supposed to be masked with either 0xf or 0x1f for 16-bit or 32-bit operands, respectively.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBTS = function(dst, src)
{
    var bit = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & bit) this.setCF(); else this.clearCF();
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 6 : 8);
    return dst | bit;
};

/**
 * fnBTMem(dst, src)
 *
 * In this form of BT, src is a register operand, which is NOT truncated if dst is a memory operand;
 * however, if dst is also a register operand, then we defer to the simpler function, fnBT().
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBTMem = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        return X86.fnBT.call(this, dst, src);
    }

    /*
     * TODO: Consider a worker function that performs the following block of code for: BT, BTC, BTR, and BTS.
     * It's somewhat inconvenient, because it needs to provide two results: an updated src AND an updated dst.
     *
     * src is usually positive BUT can also be negative (as the IA32 spec says: "The offset operand then selects
     * a bit position within the range −231 to 231 − 1 for a register offset and 0 to 31 for an immediate offset.")
     */
    var max = this.sizeData << 3;
    if (src >= max || src < -max) {
        /*
         * We just divided src by 8, but now we need to divide src by 16 or 32, according to the OPERAND size,
         * which means shifting it right by either 4 or 5 bits.  That gives us a short or long INDEX, which we then
         * multiply by the OPERAND size to obtain to the corresponding short or long OFFSET that we must add to
         * the original EA offset.
         */
        var i = src >> (this.sizeData == 2? 4 : 5);
        dst = this.getEAWord(this.segEA, this.offEA + i * this.sizeData);
    }
    /*
     * Now we convert src from a bit index to a bit mask.
     */
    src = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & src) this.setCF(); else this.clearCF();
    /*
     * End of common code block
     */

    this.nStepCycles -= 6;
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnBTCMem(dst, src)
 *
 * In this form of BTC, src is a register operand, which is NOT truncated if dst is a memory operand;
 * however, if dst is also a register operand, then we defer to the simpler function, fnBTC().
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBTCMem = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        return X86.fnBTC.call(this, dst, src);
    }

    /*
     * src is usually positive BUT can also be negative (as the IA32 spec says: "The offset operand then selects
     * a bit position within the range −231 to 231 − 1 for a register offset and 0 to 31 for an immediate offset.")
     */
    var max = this.sizeData << 3;
    if (src >= max || src < -max) {
        /*
         * We just divided src by 8, but now we need to divide src by 16 or 32, according to the OPERAND size,
         * which means shifting it right by either 4 or 5 bits.  That gives us a short or long INDEX, which we then
         * multiply by the OPERAND size to obtain to the corresponding short or long OFFSET that we must add to
         * the original EA offset.
         */
        var i = src >> (this.sizeData == 2? 4 : 5);
        dst = this.getEAWord(this.segEA, this.offEA + i * this.sizeData);
    }
    /*
     * Now we convert src from a bit index to a bit mask.
     */
    src = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & src) this.setCF(); else this.clearCF();

    this.nStepCycles -= 8;
    return dst ^ src;
};

/**
 * fnBTRMem(dst, src)
 *
 * In this form of BTR, src is a register operand, which is NOT truncated if dst is a memory operand;
 * however, if dst is also a register operand, then we defer to the simpler function, fnBTR().
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBTRMem = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        return X86.fnBTR.call(this, dst, src);
    }

    /*
     * src is usually positive BUT can also be negative (as the IA32 spec says: "The offset operand then selects
     * a bit position within the range −231 to 231 − 1 for a register offset and 0 to 31 for an immediate offset.")
     */
    var max = this.sizeData << 3;
    if (src >= max || src < -max) {
        /*
         * We just divided src by 8, but now we need to divide src by 16 or 32, according to the OPERAND size,
         * which means shifting it right by either 4 or 5 bits.  That gives us a short or long INDEX, which we then
         * multiply by the OPERAND size to obtain to the corresponding short or long OFFSET that we must add to
         * the original EA offset.
         */
        var i = src >> (this.sizeData == 2? 4 : 5);
        dst = this.getEAWord(this.segEA, this.offEA + i * this.sizeData);
    }
    /*
     * Now we convert src from a bit index to a bit mask.
     */
    src = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & src) this.setCF(); else this.clearCF();

    this.nStepCycles -= 8;
    return dst & ~src;
};

/**
 * fnBTSMem(dst, src)
 *
 * In this form of BTS, src is a register operand, which is NOT truncated if dst is a memory operand;
 * however, if dst is also a register operand, then we defer to the simpler function, fnBTS().
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnBTSMem = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        return X86.fnBTS.call(this, dst, src);
    }

    /*
     * src is usually positive BUT can also be negative (as the IA32 spec says: "The offset operand then selects
     * a bit position within the range −231 to 231 − 1 for a register offset and 0 to 31 for an immediate offset.")
     */
    var max = this.sizeData << 3;
    if (src >= max || src < -max) {
        /*
         * We just divided src by 8, but now we need to divide src by 16 or 32, according to the OPERAND size,
         * which means shifting it right by either 4 or 5 bits.  That gives us a short or long INDEX, which we then
         * multiply by the OPERAND size to obtain to the corresponding short or long OFFSET that we must add to
         * the original EA offset.
         */
        var i = src >> (this.sizeData == 2? 4 : 5);
        dst = this.getEAWord(this.segEA, this.offEA + i * this.sizeData);
    }
    /*
     * Now we convert src from a bit index to a bit mask.
     */
    src = 1 << (src & (this.sizeData == 2? 0xf : 0x1f));
    if (dst & src) this.setCF(); else this.clearCF();

    this.nStepCycles -= 8;
    return dst | src;
};

/**
 * fnCALLw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnCALLw = function(dst, src)
{
    this.pushWord(this.getIP());
    this.setIP(dst);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesCallWR : this.cycleCounts.nOpCyclesCallWM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnCALLF(off, sel)
 *
 * For protected-mode, this function must attempt to load the new code segment first, because if the new segment
 * requires a change in privilege level, the return address must be pushed on the NEW stack, not the current stack.
 *
 * Also, we rely on a new function, pushData(), instead of pushWord(), to accommodate the outgoing segment size,
 * which may differ from the incoming segment.  For example, when a 32-bit code segment performs a 16:32 call to a
 * 16-bit code segment, we must push 32-bit segment and offset values.
 *
 * TODO: Since setCSIP() already informs the segCS load() function when it's making a call, the load() function
 * could automatically push the old CS and IP values *before* segCS is updated -- which would be a better time to do
 * those pushes AND eliminate the need for pushData().  Unfortunately, load() is also used by loadIDT(), and loadIDT()
 * has different requirements (eg, pushing flags first), so it's not a trivial change.
 *
 * @this {X86CPU}
 * @param {number} off
 * @param {number} sel
 */
X86.fnCALLF = function(off, sel)
{
    /*
     * Since we always push the return address AFTER calling setCSIP(), and since either push could trigger
     * fault (eg, segment fault, page fault, etc), we must not only snapshot regLSP into opLSP, but also the
     * current CS into opCS, so that fnFault() can always make CALLF restartable.
     */
    this.opCS = this.getCS();
    this.opLSP = this.regLSP;
    var oldIP = this.getIP();
    var oldSize = (I386? this.sizeData : 2);
    if (this.setCSIP(off, sel, true) != null) {
        this.pushData(this.opCS, oldSize);
        this.pushData(oldIP, oldSize);
    }
    this.opLSP = X86.ADDR_INVALID;
    this.opCS = -1;
};

/**
 * fnCALLFdw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnCALLFdw = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        return X86.fnGRPUndefined.call(this, dst, src);
    }
    /*
     * Originally, we would snapshot regLSP into opLSP because fnCALLF() could trigger a segment fault,
     * but additionally, the stack segment could trigger either a segment fault or a page fault; indeed,
     * any operation that performs multiple stack modifications must take this precaution and snapshot regLSP.
     */
    this.opLSP = this.regLSP;

    X86.fnCALLF.call(this, dst, this.getShort(this.regEA + this.sizeData));
    this.nStepCycles -= this.cycleCounts.nOpCyclesCallDM;
    this.opFlags |= X86.OPFLAG.NOWRITE;

    this.opLSP = X86.ADDR_INVALID;
    return dst;
};

/**
 * fnCMPb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number} dst unchanged
 */
X86.fnCMPb = function(dst, src)
{
    var b = (dst - src)|0;
    this.setArithResult(dst, src, b, X86.RESULT.BYTE | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesCompareRM) : this.cycleCounts.nOpCyclesArithRM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnCMPw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number} dst unchanged
 */
X86.fnCMPw = function(dst, src)
{
    var w = (dst - src)|0;
    this.setArithResult(dst, src, w, this.typeData | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesCompareRM) : this.cycleCounts.nOpCyclesArithRM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnDECb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnDECb = function(dst, src)
{
    var b = (dst - 1)|0;
    this.setArithResult(dst, 1, b, X86.RESULT.BYTE | X86.RESULT.NOTCF, true);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIncR : this.cycleCounts.nOpCyclesIncM);
    return b & 0xff;
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
 * fnDECw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnDECw = function(dst, src)
{
    var w = (dst - 1)|0;
    this.setArithResult(dst, 1, w, this.typeData | X86.RESULT.NOTCF, true);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIncR : this.cycleCounts.nOpCyclesIncM);
    return w & this.maskData;
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
 * fnDIVb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (the divisor)
 * @param {number} src (null; AX is the implied src)
 * @return {number} (we return dst unchanged, since it's actually AX that's modified)
 */
X86.fnDIVb = function(dst, src)
{
    /*
     * Detect zero divisor
     */
    if (!dst) {
        X86.fnDIVOverflow.call(this);
        return dst;
    }

    /*
     * Detect too-small divisor (quotient overflow)
     */
    var result = ((src = this.regEAX & 0xffff) / dst);
    if (result > 0xff) {
        X86.fnDIVOverflow.call(this);
        return dst;
    }

    this.regMDLo = (result & 0xff) | (((src % dst) & 0xff) << 8);
    this.fMDSet = true;

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesDivBR : this.cycleCounts.nOpCyclesDivBM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnDIVw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (the divisor)
 * @param {number} src (null; DX:AX or EDX:EAX is the implied src)
 * @return {number} (we return dst unchanged, since it's actually DX:AX that's modified)
 */
X86.fnDIVw = function(dst, src)
{
    if (this.sizeData == 2) {
        /*
         * Detect zero divisor
         */
        if (!dst) {
            X86.fnDIVOverflow.call(this);
            return dst;
        }
        /*
         * Detect too-small divisor (quotient overflow)
         *
         * WARNING: We CANNOT simply do "src = (this.regEDX << 16) | this.regEAX", because if bit 15 of DX
         * is set, JavaScript will create a negative 32-bit number.  So we instead use non-bit-wise operators
         * to force JavaScript to create a floating-point value that won't suffer from 32-bit-math side-effects.
         */
        src = (this.regEDX & 0xffff) * 0x10000 + (this.regEAX & 0xffff);
        var result = (src / dst)|0;
        if (result >= 0x10000) {
            X86.fnDIVOverflow.call(this);
            return dst;
        }
        this.regMDLo = (result & 0xffff);
        this.regMDHi = (src % dst) & 0xffff;
        this.fMDSet = true;
    }
    else {
        if (!X86.fnDIV32.call(this, this.regEAX, this.regEDX, dst)) {
            X86.fnDIVOverflow.call(this);
            return dst;
        }
        this.regMDLo |= 0;
        this.regMDHi |= 0;
        this.fMDSet = true;
    }

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesDivWR : this.cycleCounts.nOpCyclesDivWM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnESC(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number} dst unchanged
 */
X86.fnESC = function(dst, src)
{
    return dst;
};

/**
 * fnIDIVb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (the divisor)
 * @param {number} src (null; AX is the implied src)
 * @return {number} (we return dst unchanged, since it's actually AX that's modified)
 */
X86.fnIDIVb = function(dst, src)
{
    /*
     * Detect zero divisor
     */
    if (!dst) {
        X86.fnDIVOverflow.call(this);
        return dst;
    }

    /*
     * Detect too-small divisor (quotient overflow)
     */
    var div = ((dst << 24) >> 24);
    var result = ((src = (this.regEAX << 16) >> 16) / div)|0;

    /*
     * Note the following difference, from "AP-186: Introduction to the 80186 Microprocessor, March 1983":
     *
     *      "The 8086 will cause a divide error whenever the absolute value of the quotient is greater then 7FFFH
     *      (for word operations) or if the absolute value of the quotient is greater than 7FH (for byte operations).
     *      The 80186 has expanded the range of negative numbers allowed as a quotient by 1 to include 8000H and 80H.
     *      These numbers represent the most negative numbers representable using 2's complement arithmetic (equaling
     *      -32768 and -128 in decimal, respectively)."
     */
    if (result != ((result << 24) >> 24) || this.model == X86.MODEL_8086 && result == -128) {
        X86.fnDIVOverflow.call(this);
        return dst;
    }

    this.regMDLo = (result & 0xff) | (((src % div) & 0xff) << 8);
    this.fMDSet = true;

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIDivBR : this.cycleCounts.nOpCyclesIDivBM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnIDIVw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (the divisor)
 * @param {number} src (null; DX:AX or EDX:EAX is the implied src)
 * @return {number} (we return dst unchanged, since it's actually DX:AX that's modified)
 */
X86.fnIDIVw = function(dst, src)
{
    if (this.sizeData == 2) {
        /*
         * Detect zero divisor
         */
        if (!dst) {
            X86.fnDIVOverflow.call(this);
            return dst;
        }

        /*
         * Detect too-small divisor (quotient overflow)
         */
        var div = ((dst << 16) >> 16);
        var result = ((src = (this.regEDX << 16) | (this.regEAX & 0xffff)) / div)|0;

        /*
         * Note the following difference, from "AP-186: Introduction to the 80186 Microprocessor, March 1983":
         *
         *      "The 8086 will cause a divide error whenever the absolute value of the quotient is greater then 7FFFH
         *      (for word operations) or if the absolute value of the quotient is greater than 7FH (for byte operations).
         *      The 80186 has expanded the range of negative numbers allowed as a quotient by 1 to include 8000H and 80H.
         *      These numbers represent the most negative numbers representable using 2's complement arithmetic (equaling
         *      -32768 and -128 in decimal, respectively)."
         */
        if (result != ((result << 16) >> 16) || this.model == X86.MODEL_8086 && result == -32768) {
            X86.fnDIVOverflow.call(this);
            return dst;
        }

        this.regMDLo = (result & 0xffff);
        this.regMDHi = (src % div) & 0xffff;
        this.fMDSet = true;
    }
    else {
        if (!X86.fnIDIV32.call(this, this.regEAX, this.regEDX, dst)) {
            X86.fnDIVOverflow.call(this);
            return dst;
        }
        this.regMDLo |= 0;
        this.regMDHi |= 0;
        this.fMDSet = true;
    }

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIDivWR : this.cycleCounts.nOpCyclesIDivWM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnIMUL8(dst, src)
 *
 * 80286_and_80287_Programmers_Reference_Manual_1987.pdf, p.B-44 (p.254) notes that:
 *
 *      "The low 16 bits of the product of a 16-bit signed multiply are the same as those of an
 *      unsigned multiply. The three operand IMUL instruction can be used for unsigned operands as well."
 *
 * However, we still sign-extend the operands before multiplying, making it easier to range-check the result.
 *
 * (80186/80188 and up)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnIMUL8 = function(dst, src)
{
    /*
     * NOTE: getIPDisp() already sign-extends the dst parameter, so fnIMULrw() needlessly sign-extends it again;
     * a small price to pay for a common function.
     */
    var result = X86.fnIMULrw.call(this, this.getIPDisp(), src);

    /*
     * NOTE: The above function already accounted for the 80386 cycle count, so we are simply accounting for the
     * increased time on an 80286; the 80186/80188 have even larger values, but we'll worry about that another day.
     */
    if (this.model < X86.MODEL_80386) this.nStepCycles -= 12;
    return result;
};

/**
 * fnIMULn(dst, src)
 *
 * 80286_and_80287_Programmers_Reference_Manual_1987.pdf, p.B-44 (p.254) notes that:
 *
 *      "The low 16 bits of the product of a 16-bit signed multiply are the same as those of an
 *      unsigned multiply. The three operand IMUL instruction can be used for unsigned operands as well."
 *
 * However, we still sign-extend the operands before multiplying, making it easier to range-check the result.
 *
 * (80186/80188 and up)
 *
 * @this {X86CPU}
 * @param {number} dst (not used)
 * @param {number} src
 * @return {number}
 */
X86.fnIMULn = function(dst, src)
{
    var result;
    dst = this.getIPWord();

    if (this.sizeData == 2) {
        result = X86.fnIMULrw.call(this, dst, src);
    } else {
        result = X86.fnIMULrd.call(this, dst, src);
    }

    /*
     * NOTE: The above functions already accounted for 80386 cycle counts, so we are simply accounting for the
     * increased time on an 80286; the 80186/80188 have even larger values, but we'll worry about that another day.
     */
    if (this.model < X86.MODEL_80386) this.nStepCycles -= 12;
    return result;
};

/**
 * fnIMUL32(dst, src)
 *
 * This sets regMDHi:regMDLo to the 64-bit result of dst * src, both of which are treated as signed.
 *
 * @this {X86CPU}
 * @param {number} dst (any 32-bit number, treated as signed)
 * @param {number} src (any 32-bit number, treated as signed)
 */
X86.fnIMUL32 = function(dst, src)
{
    var fNeg = false;
    if (src < 0) {
        src = -src|0;
        fNeg = !fNeg;
    }
    if (dst < 0) {
        dst = -dst|0;
        fNeg = !fNeg;
    }
    X86.fnMUL32.call(this, dst, src);
    if (fNeg) {
        this.regMDLo = (~this.regMDLo + 1)|0;
        this.regMDHi = (~this.regMDHi + (this.regMDLo? 0 : 1))|0;
    }
};

/**
 * fnIMULb(dst, src)
 *
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
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null; AL is the implied src)
 * @return {number} (we return dst unchanged, since it's actually AX that's modified)
 */
X86.fnIMULb = function(dst, src)
{
    var result = (((this.regEAX << 24) >> 24) * ((dst << 24) >> 24))|0;

    this.regMDLo = result & 0xffff;
    this.fMDSet = true;

    if (result > 127 || result < -128) {
        this.setCF(); this.setOF();
    } else {
        this.clearCF(); this.clearOF();
    }

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIMulBR : this.cycleCounts.nOpCyclesIMulBM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnIMULw(dst, src)
 *
 * regMDHi:regMDLo = dst * regEAX
 *
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
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null; AX or EAX is the implied src)
 * @return {number} (we return dst unchanged, since it's actually DX:AX or EDX:EAX that's modified)
 */
X86.fnIMULw = function(dst, src)
{
    var fOverflow;
    if (this.sizeData == 2) {
        src = this.regEAX & 0xffff;
        var result = (((src << 16) >> 16) * ((dst << 16) >> 16))|0;
        this.regMDLo = result & 0xffff;
        this.regMDHi = (result >> 16) & 0xffff;
        this.fMDSet = true;
        fOverflow = (result > 32767 || result < -32768);
    } else {
        X86.fnIMUL32.call(this, dst, this.regEAX);
        fOverflow = (this.regMDHi != (this.regMDLo >> 31));
    }

    if (fOverflow) {
        this.setCF(); this.setOF();
    } else {
        this.clearCF(); this.clearOF();
    }

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIMulWR : this.cycleCounts.nOpCyclesIMulWM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnIMULrw(dst, src)
 *
 * This function exists for 16-bit IMUL instructions that produce a 16-bit result instead of a 32-bit result
 * (and don't implicitly use the accumulator).
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnIMULrw = function(dst, src)
{
    /*
     * Unlike fnIMULrd() below, we can use normal JavaScript multiplication, because there's no danger of
     * overflowing the floating-point result and losing accuracy in the bottom 16 bits.
     */
    var result = (((dst << 16) >> 16) * ((src << 16) >> 16))|0;
    if (result > 32767 || result < -32768) {
        this.setCF(); this.setOF();
    } else {
        this.clearCF(); this.clearOF();
    }
    result &= 0xffff;
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 9 : 12);
    return result;
};

/**
 * fnIMULrd(dst, src)
 *
 * This function exists for 32-bit IMUL instructions that produce a 32-bit result instead of a 64-bit result
 * (and don't implicitly use the accumulator).
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnIMULrd = function(dst, src)
{
    /*
     * The following code works, but I've stopped using it because it produces different results from an actual CPU
     * when overflow occurs; the bottom 32 bits of the result are still supposed to be accurate.
     *
     * And unfortunately, we cannot achieve that level of compatibility using normal JavaScript multiplication,
     * because the result may be too large to fit in a JavaScript floating-point variable, which means we could lose
     * accuracy in the bottom 32 bits, which would defeat what we're trying to achieve here.  So we must use the
     * slower fnIMUL32() function.
     *
     *      var result = dst * src;
     *      if (result > 2147483647 || result < -2147483648) {
     *          this.setCF(); this.setOF();
     *      } else {
     *          this.clearCF(); this.clearOF();
     *      }
     *      result |= 0;
     */
    X86.fnIMUL32.call(this, dst, src);
    var fOverflow = (this.regMDHi != (this.regMDLo >> 31));
    if (fOverflow) {
        this.setCF(); this.setOF();
    } else {
        this.clearCF(); this.clearOF();
    }
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 9 : 12);
    return this.regMDLo;
};

/**
 * fnINCb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnINCb = function(dst, src)
{
    var b = (dst + 1)|0;
    this.setArithResult(dst, 1, b, X86.RESULT.BYTE | X86.RESULT.NOTCF);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIncR : this.cycleCounts.nOpCyclesIncM);
    return b & 0xff;
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
 * fnINCw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnINCw = function(dst, src)
{
    var w = (dst + 1)|0;
    this.setArithResult(dst, 1, w, this.typeData | X86.RESULT.NOTCF);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesIncR : this.cycleCounts.nOpCyclesIncM);
    return w & this.maskData;
};

/**
 * fnINT(nIDT, nError, nCycles)
 *
 * NOTE: We no longer use setCSIP(), because it always loads the new CS using segCS.load(), which only knows
 * how to load GDT and LDT descriptors, whereas interrupts must use setCS.loadIDT(), which deals exclusively
 * with IDT descriptors.
 *
 * @this {X86CPU}
 * @param {number} nIDT
 * @param {number|null} [nError]
 * @param {number} [nCycles] (in addition to the default of nOpCyclesInt)
 */
X86.fnINT = function(nIDT, nError, nCycles)
{
    /*
     * TODO: We assess the cycle cost up front, because otherwise, if loadIDT() fails, no cost may be assessed.
     */
    this.nStepCycles -= this.cycleCounts.nOpCyclesInt + (nCycles || 0);
    var oldPS = this.getPS();
    var oldCS = this.getCS();
    var oldIP = this.getIP();
    var addr = this.segCS.loadIDT(nIDT);
    if (addr !== X86.ADDR_INVALID) {
        this.pushWord(oldPS);
        this.pushWord(oldCS);
        this.pushWord(oldIP);
        if (nError != null) this.pushWord(nError);
        this.nFault = -1;
        this.setLIP(addr);
    }
};

/**
 * fnIRET()
 *
 * @this {X86CPU}
 */
X86.fnIRET = function()
{
    /*
     * Originally, we would snapshot regLSP into opLSP because newCS could trigger a segment fault,
     * but additionally, the stack segment could trigger either a segment fault or a page fault; indeed,
     * any operation that performs multiple stack modifications must take this precaution and snapshot regLSP.
     */
    this.opLSP = this.regLSP;

    this.nStepCycles -= this.cycleCounts.nOpCyclesIRet;

    if ((this.regCR0 & X86.CR0.MSW.PE) && (this.regPS & X86.PS.NT)) {
        var addrNew = this.segTSS.base;
        /*
         * Fortunately, X86.TSS286.PREV_TSS and X86.TSS386.PREV_TSS refer to the same TSS offset.
         * TODO: Update switchTS() to assess a cycle cost; currently, all we assess is what's shown above.
         */
        var sel = this.getShort(addrNew + X86.TSS286.PREV_TSS);
        this.segCS.switchTSS(sel, false);
    }
    else {
        var cpl = this.nCPL;
        var newIP = this.popWord();
        var newCS = this.popWord();
        var newPS = this.popWord();

        if (I386) {
            if (this.regPS & X86.PS.VM) {
                /*
                 * On the 80386, in V86-mode, RF is the only defined EFLAGS bit above bit 15 that may be changed by IRETD.
                 * This is less restrictive than POPFD, which cannot change ANY bits above bit 15; see opPOPF() for details.
                 */
                newPS = (newPS & (0xffff | X86.PS.RF)) | (this.regPS & ~(0xffff | X86.PS.RF));
            }
            else {
                if (newPS & X86.PS.VM) {
                    /*
                     * As noted in loadDesc8(), where the V86-mode frame we're about to pop was originally pushed,
                     * these frames ALWAYS contain 32-bit values, so make sure that sizeData reflects that.
                     */
                    this.assert(!!(this.regCR0 & X86.CR0.MSW.PE) && this.sizeData == 4);
                    /*
                     * We have to assume that a full V86-mode interrupt frame was on the protected-mode stack; namely:
                     *
                     *      low:    EIP
                     *              CS (padded to 32 bits)
                     *              EFLAGS
                     *              ESP
                     *              SS (padded to 32 bits)
                     *              ES (padded to 32 bits)
                     *              DS (padded to 32 bits)
                     *              FS (padded to 32 bits)
                     *      high:   GS (padded to 32 bits)
                     *
                     * We've already popped EIP, CS, and EFLAGS into newIP, newCS and newPS, respectively, so we must now
                     * pop the rest, while we're still in protected-mode, before the switch to V86-mode alters the current
                     * operand size (among other things).
                     */
                    var newSP = this.popWord();
                    var newSS = this.popWord();
                    var newES = this.popWord();
                    var newDS = this.popWord();
                    var newFS = this.popWord();
                    var newGS = this.popWord();
                    this.setProtMode(true, true);       // flip the switch to V86-mode now
                    this.setSS(newSS);
                    this.setSP(newSP);
                    this.setES(newES);
                    this.setDS(newDS);
                    this.setFS(newFS);
                    this.setGS(newGS);
                }
            }
        }

        if (this.setCSIP(newIP, newCS, false) != null) {
            this.setPS(newPS, cpl);
            if (this.cIntReturn) this.checkIntReturn(this.regLIP);
        }
    }

    this.opLSP = X86.ADDR_INVALID;
};

/**
 * fnJMPw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnJMPw = function(dst, src)
{
    this.setIP(dst);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesJmpWR : this.cycleCounts.nOpCyclesJmpWM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnJMPFdw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnJMPFdw = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        return X86.fnGRPUndefined.call(this, dst, src);
    }
    this.setCSIP(dst, this.getShort(this.regEA + this.sizeData));
    if (MAXDEBUG && this.cIntReturn) this.checkIntReturn(this.regLIP);
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpDM;
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnLAR(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnLAR = function(dst, src)
{
    this.nStepCycles -= (14 + (this.regEA === X86.ADDR_INVALID? 0 : 2));
    /*
     * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
     * descriptor table or the descriptor is not for a segment.
     *
     * TODO: This instruction's 80286 documentation does not discuss conforming code segments; determine
     * if we need a special check for them.
     */
    this.clearZF();
    if (this.segVER.load(src) !== X86.ADDR_INVALID) {
        if (this.segVER.dpl >= this.nCPL && this.segVER.dpl >= (src & X86.SEL.RPL)) {
            this.setZF();
            dst = this.segVER.acc & ~X86.DESC.ACC.BASE1623;
            if (this.sizeData > 2) {
                dst |= ((this.segVER.ext & ~X86.DESC.EXT.BASE2431) << 16);
            }
        }
    }
    return dst;
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
    if (this.regCR0 & X86.CR0.PG) this.enablePageBlocks();
};

/**
 * fnLDS(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnLDS = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        X86.opUndefined.call(this);
        return dst;
    }
    this.setDS(this.getShort(this.regEA + this.sizeData));
    this.nStepCycles -= this.cycleCounts.nOpCyclesLS;
    return src;
};

/**
 * fnLEA(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnLEA = function(dst, src)
{
    /*
     * TODO: Until I bite the bullet and choose a truly invalid value for X86.ADDR_INVALID (eg, null),
     * this code must be disabled, because otherwise an instruction like "LEA ECX,[EAX-1]" will fail when
     * EAX is zero.  And we can't have that.
     *
    if (this.regEA === X86.ADDR_INVALID) {
        //
        // TODO: After reading http://www.os2museum.com/wp/undocumented-8086-opcodes/, it seems that this
        // form of LEA (eg, "LEA AX,DX") simply returns the last calculated EA.  Since we always reset regEA
        // at the start of a new instruction, we would need to preserve the previous EA if we want to mimic
        // that (undocumented) behavior.
        //
        // And for completeness, we would have to extend EA tracking beyond the usual ModRM instructions
        // (eg, XLAT, instructions that modify the stack pointer, and string instructions).  Anything else?
        //
        X86.opUndefined.call(this);
        return dst;
    }
    */
    this.nStepCycles -= this.cycleCounts.nOpCyclesLEA;
    return this.regEA;
};

/**
 * fnLES(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnLES = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        X86.opUndefined.call(this);
        return dst;
    }
    this.setES(this.getShort(this.regEA + this.sizeData));
    this.nStepCycles -= this.cycleCounts.nOpCyclesLS;
    return src;
};

/**
 * fnLFS(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnLFS = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        X86.opUndefined.call(this);
        return dst;
    }
    this.setFS(this.getShort(this.regEA + this.sizeData));
    this.nStepCycles -= this.cycleCounts.nOpCyclesLS;
    return src;
};

/**
 * fnLGDT(dst, src)
 *
 * op=0x0F,0x01,reg=0x2 (GRP7:LGDT)
 *
 * The 80286 LGDT instruction assumes a 40-bit operand: a 16-bit limit followed by a 24-bit base address;
 * the ModRM decoder has already supplied the first word of the operand (in dst), which corresponds to
 * the limit, so we must fetch the remaining bits ourselves.
 *
 * The 80386 LGDT instruction assumes a 48-bit operand: a 16-bit limit followed by a 32-bit base address,
 * but it ignores the last 8 bits of the base address if the OPERAND size is 16 bits; we interpret that to
 * mean that the 24-bit base address should be zero-extended to 32 bits.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnLGDT = function(dst, src)
{
    /*
     * TODO: Consider swapping out this function whenever setProtMode() changes the mode to V86-mode.
     */
    if (this.regEA === X86.ADDR_INVALID || I386 && (this.regPS & X86.PS.VM)) {
        X86.opInvalid.call(this);
    } else {
        /*
         * Hopefully it won't hurt to always fetch a 32-bit base address (even on an 80286), which we then
         * mask apppropriately.
         */
        this.addrGDT = this.getLong(this.regEA + 2) & (this.maskData | (this.maskData << 8));
        /*
         * An idiosyncrasy of our ModRM decoders is that, if the OPERAND size is 32 bits, then it will have
         * fetched a 32-bit dst operand; we mask off those extra bits now.
         */
        dst &= 0xffff;
        this.addrGDTLimit = this.addrGDT + dst;
        this.opFlags |= X86.OPFLAG.NOWRITE;
        this.nStepCycles -= 11;
    }
    return dst;
};

/**
 * fnLGS(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnLGS = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        X86.opUndefined.call(this);
        return dst;
    }
    this.setGS(this.getShort(this.regEA + this.sizeData));
    this.nStepCycles -= this.cycleCounts.nOpCyclesLS;
    return src;
};

/**
 * fnLIDT(dst, src)
 *
 * op=0x0F,0x01,reg=0x3 (GRP7:LIDT)
 *
 * The 80286 LIDT instruction assumes a 40-bit operand: a 16-bit limit followed by a 24-bit base address;
 * the ModRM decoder has already supplied the first word of the operand (in dst), which corresponds to
 * the limit, so we must fetch the remaining bits ourselves.
 *
 * The 80386 LIDT instruction assumes a 48-bit operand: a 16-bit limit followed by a 32-bit base address,
 * but it ignores the last 8 bits of the base address if the OPERAND size is 16 bits; we interpret that to
 * mean that the 24-bit base address should be zero-extended to 32 bits.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnLIDT = function(dst, src)
{
    /*
     * TODO: Consider swapping out this function whenever setProtMode() changes the mode to V86-mode.
     */
    if (this.regEA === X86.ADDR_INVALID || I386 && (this.regPS & X86.PS.VM)) {
        X86.opInvalid.call(this);
    } else {
        /*
         * Hopefully it won't hurt to always fetch a 32-bit base address (even on an 80286), which we then
         * mask apppropriately.
         */
        this.addrIDT = this.getLong(this.regEA + 2) & (this.maskData | (this.maskData << 8));
        /*
         * An idiosyncrasy of our ModRM decoders is that, if the OPERAND size is 32 bits, then it will have
         * fetched a 32-bit dst operand; we mask off those extra bits now.
         */
        dst &= 0xffff;
        this.addrIDTLimit = this.addrIDT + dst;
        this.opFlags |= X86.OPFLAG.NOWRITE;
        this.nStepCycles -= 12;
    }
    return dst;
};

/**
 * fnLLDT(dst, src)
 *
 * op=0x0F,0x00,reg=0x2 (GRP6:LLDT)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnLLDT = function(dst, src)
{
    this.opFlags |= X86.OPFLAG.NOWRITE;
    this.segLDT.load(dst);
    this.nStepCycles -= (17 + (this.regEA === X86.ADDR_INVALID? 0 : 2));
    return dst;
};

/**
 * fnLMSW(dst, src)
 *
 * op=0x0F,0x01,reg=0x6 (GRP7:LMSW)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnLMSW = function(dst, src)
{
    /*
     * TODO: Consider swapping out this function whenever setProtMode() changes the mode to V86-mode.
     */
    if (I386 && (this.regPS & X86.PS.VM)) {
        X86.opInvalid.call(this);
    } else {
        this.setMSW(dst);
        this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 3 : 6);
        this.opFlags |= X86.OPFLAG.NOWRITE;
    }
    return dst;
};

/**
 * fnLSL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (the selector)
 * @return {number}
 */
X86.fnLSL = function(dst, src)
{
    /*
     * TODO: Is this an invalid operation if regEAWrite is set?  dst is required to be a register.
     */
    this.nStepCycles -= (14 + (this.regEA === X86.ADDR_INVALID? 0 : 2));
    /*
     * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
     * descriptor table or the descriptor is not for a segment.
     *
     * TODO: LSL is explicitly documented as ALSO requiring a non-null selector, so we check X86.SEL.MASK;
     * are there any other instructions that were, um, less explicit but also require a non-null selector?
     */
    if ((src & X86.SEL.MASK) && this.segVER.load(src) !== X86.ADDR_INVALID) {
        var fConforming = ((this.segVER.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING) == X86.DESC.ACC.TYPE.CODE_CONFORMING);
        if ((fConforming || this.segVER.dpl >= this.nCPL) && this.segVER.dpl >= (src & X86.SEL.RPL)) {
            this.setZF();
            return this.segVER.limit;
        }
    }
    this.clearZF();
    return dst;
};

/**
 * fnLSS(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnLSS = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        X86.opUndefined.call(this);
        return dst;
    }
    this.setSS(this.getShort(this.regEA + this.sizeData));
    this.nStepCycles -= this.cycleCounts.nOpCyclesLS;
    return src;
};

/**
 * fnLTR(dst, src)
 *
 * op=0x0F,0x00,reg=0x3 (GRP6:LTR)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnLTR = function(dst, src)
{
    this.opFlags |= X86.OPFLAG.NOWRITE;
    if (this.segTSS.load(dst) !== X86.ADDR_INVALID) {
        this.setShort(this.segTSS.addrDesc + X86.DESC.ACC.OFFSET, this.segTSS.acc |= X86.DESC.ACC.TSS_BUSY);
        this.segTSS.type |= X86.DESC.ACC.TSS_BUSY;
    }
    this.nStepCycles -= (17 + (this.regEA === X86.ADDR_INVALID? 0 : 2));
    return dst;
};

/**
 * fnMOV(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (current value, ignored)
 * @param {number} src (new value)
 * @return {number} dst (updated value, from src)
 */
X86.fnMOV = function(dst, src)
{
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMovRR : this.cycleCounts.nOpCyclesMovRM) : this.cycleCounts.nOpCyclesMovMR);
    return src;
};

/**
 * fnMOVX(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (current value, ignored)
 * @param {number} src (new value)
 * @return {number} dst (updated value, from src)
 */
X86.fnMOVX = function(dst, src)
{
    return src;
};

/**
 * fnMOVn(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (current value, ignored)
 * @param {number} src (new value)
 * @return {number} dst (updated value, from src)
 */
X86.fnMOVn = function(dst, src)
{
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMovRI : this.cycleCounts.nOpCyclesMovMI);
    return src;
};

/**
 * fnMOVxx(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (current value, ignored)
 * @param {number} src (new value)
 * @return {number} dst (src is overridden, replaced with regXX, as specified by opMOVwsr() or opMOVrc())
 */
X86.fnMOVxx = function(dst, src)
{
    if (this.regEAWrite !== X86.ADDR_INVALID) {
        /*
         * When a 32-bit OPERAND size is in effect, opMOVwsr() will write 32 bits (zero-extended) if the destination
         * is a register, but only 16 bits if the destination is memory.  The only other caller, opMOVrc(), is not
         * affected, because it writes only to register destinations.
         */
        this.setDataSize(2);
    }
    return X86.fnMOV.call(this, dst, this.regXX);
};

/**
 * fnMULb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number} (we return dst unchanged, since it's actually AX that's modified)
 */
X86.fnMULb = function(dst, src)
{
    this.regMDLo = ((this.regEAX & 0xff) * dst) & 0xffff;
    this.fMDSet = true;

    if (this.regMDLo & 0xff00) {
        this.setCF(); this.setOF();
    } else {
        this.clearCF(); this.clearOF();
    }

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMulBR : this.cycleCounts.nOpCyclesMulBM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnMUL32(dst, src)
 *
 * This sets regMDHi:regMDLo to the 64-bit result of dst * src, both of which are treated as unsigned.
 *
 * @this {X86CPU}
 * @param {number} dst (any 32-bit number, treated as unsigned)
 * @param {number} src (any 32-bit number, treated as unsigned)
 */
X86.fnMUL32 = function(dst, src)
{
    if (!(dst & ~0xffff) && !(src & ~0xffff)) {
        this.regMDLo = (dst * src)|0;
        this.regMDHi = 0;
        this.fMDSet = true;
        return;
    }

    var srcLo = src & 0xffff;
    var srcHi = src >>> 16;
    var dstLo = dst & 0xffff;
    var dstHi = dst >>> 16;

    var mul00 = srcLo * dstLo;
    var mul16 = ((mul00 >>> 16) + (srcHi * dstLo));
    var mul32 = mul16 >>> 16;
    mul16 = ((mul16 & 0xffff) + (srcLo * dstHi));
    mul32 += ((mul16 >>> 16) + (srcHi * dstHi));

    this.regMDLo = (mul16 << 16) | (mul00 & 0xffff);
    this.regMDHi = mul32|0;
    this.fMDSet = true;
};

/**
 * fnMULw(dst, src)
 *
 * regMDHi:regMDLo = dst * regEAX
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null; AX or EAX is the implied src)
 * @return {number} (we return dst unchanged, since it's actually DX:AX that's modified)
 */
X86.fnMULw = function(dst, src)
{
    if (this.sizeData == 2) {
        src = this.regEAX & 0xffff;
        var result = (src * dst)|0;
        this.regMDLo = result & 0xffff;
        this.regMDHi = (result >> 16) & 0xffff;
        this.fMDSet = true;
    } else {
        X86.fnMUL32.call(this, dst, this.regEAX);
        if (this.stepping == X86.STEPPING_80386_B1) {
            if (this.regEAX == 0x0417A000 && dst == 0x00000081) {
                /*
                 * Normally, the result should be 0x20FE7A000 (ie, regMDHi should be 0x2).
                 * I'm not sure what a typical failure looked like, so I'll just set regMDHi to 0.
                 *
                 * If you want a B1 stepping without this 32-bit multiplication flaw, select the B2 stepping.
                 */
                this.assert(this.regMDLo == 0x0FE7A000 && this.regMDHi == 0x00000002);
                this.regMDHi = 0;
            }
        }
    }

    if (this.regMDHi) {
        this.setCF(); this.setOF();
    } else {
        this.clearCF(); this.clearOF();
    }

    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMulWR : this.cycleCounts.nOpCyclesMulWM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnNEGb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnNEGb = function(dst, src)
{
    var b = (-dst)|0;
    this.setArithResult(0, dst, b, X86.RESULT.BYTE | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesNegR : this.cycleCounts.nOpCyclesNegM);
    return b & 0xff;
};

/**
 * fnNEGw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnNEGw = function(dst, src)
{
    var w = (-dst)|0;
    this.setArithResult(0, dst, w, this.typeData | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesNegR : this.cycleCounts.nOpCyclesNegM);
    return w & this.maskData;
};

/**
 * fnNOTb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnNOTb = function(dst, src)
{
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesNegR : this.cycleCounts.nOpCyclesNegM);
    return dst ^ 0xff;
};

/**
 * fnNOTw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnNOTw = function(dst, src)
{
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesNegR : this.cycleCounts.nOpCyclesNegM);
    return dst ^ this.maskData;
};

/**
 * fnORb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnORb = function(dst, src)
{
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return this.setLogicResult(dst | src, X86.RESULT.BYTE);
};

/**
 * fnORw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnORw = function(dst, src)
{
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return this.setLogicResult(dst | src, this.typeData) & this.maskData;
};

/**
 * fnPOPw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (current value, ignored)
 * @param {number} src (new value)
 * @return {number} dst (updated value, from src)
 */
X86.fnPOPw = function(dst, src)
{
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesPopReg : this.cycleCounts.nOpCyclesPopMem);
    return src;
};

/**
 * fnPUSHw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnPUSHw = function(dst, src)
{
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
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesPushReg : this.cycleCounts.nOpCyclesPushMem);
    /*
     * The PUSH is the only write that needs to occur; dst was the source operand and does not need to be rewritten.
     */
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnRCLb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRCLb = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = this.getCarry();
        count %= 9;
        if (!count) {
            carry <<= 7;
        } else {
            result = ((dst << count) | (carry << (count - 1)) | (dst >> (9 - count))) & 0xff;
            carry = dst << (count - 1);
        }
        this.setRotateResult(result, carry, X86.RESULT.BYTE);
    }
    return result;
};

/**
 * fnRCLw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRCLw = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = this.getCarry();
        count %= 17;
        if (!count) {
            carry <<= 15;
        } else {
            result = ((dst << count) | (carry << (count - 1)) | (dst >> (17 - count))) & 0xffff;
            carry = dst << (count - 1);
        }
        this.setRotateResult(result, carry, X86.RESULT.WORD);
    }
    return result;
};

/**
 * fnRCLd(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRCLd = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;     // this 32-bit-only function could mask with 0x1f directly
    if (count) {
        var carry = this.getCarry();
        /*
         * JavaScript Alert: much like a post-8086 Intel CPU, JavaScript shift counts are mod 32,
         * so "dst >>> 32" is equivalent to "dst >>> 0", which doesn't shift any bits at all.  To
         * compensate, we shift one bit less than the maximum, and then shift one bit farther.
         */
        result = (dst << count) | (carry << (count - 1)) | ((dst >>> (32 - count)) >>> 1);
        carry = dst << (count - 1);
        this.setRotateResult(result, carry, X86.RESULT.DWORD);
    }
    return result;
};

/**
 * fnRCRb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRCRb = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = this.getCarry();
        count %= 9;
        if (!count) {
            carry <<= 7;
        } else {
            result = ((dst >> count) | (carry << (8 - count)) | (dst << (9 - count))) & 0xff;
            carry = dst << (8 - count);
        }
        this.setRotateResult(result, carry, X86.RESULT.BYTE);
    }
    return result;
};

/**
 * fnRCRw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRCRw = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = this.getCarry();
        count %= 17;
        if (!count) {
            carry <<= 15;
        } else {
            result = ((dst >> count) | (carry << (16 - count)) | (dst << (17 - count))) & 0xffff;
            carry = dst << (16 - count);
        }
        this.setRotateResult(result, carry, X86.RESULT.WORD);
    }
    return result;
};

/**
 * fnRCRd(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRCRd = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;     // this 32-bit-only function could mask with 0x1f directly
    if (count) {
        var carry = this.getCarry();
        /*
         * JavaScript Alert: much like a post-8086 Intel CPU, JavaScript shift counts are mod 32,
         * so "dst << 32" is equivalent to "dst << 0", which doesn't shift any bits at all.  To
         * compensate, we shift one bit less than the maximum, and then shift one bit farther.
         */
        result = (dst >>> count) | (carry << (32 - count)) | ((dst << (32 - count)) << 1);
        carry = dst << (32 - count);
        this.setRotateResult(result, carry, X86.RESULT.DWORD);
    }
    return result;
};

/**
 * fnRETF(n)
 *
 * For protected-mode, this function must pop any arguments off the current stack AND whatever stack
 * we may have switched to; setCSIP() returns true if a stack switch occurred, false if not, and null
 * if an error occurred.
 *
 * @this {X86CPU}
 * @param {number} n
 */
X86.fnRETF = function(n)
{
    /*
     * Originally, we would snapshot regLSP into opLSP because newCS could trigger a segment fault,
     * but additionally, the stack segment could trigger either a segment fault or a page fault; indeed,
     * any operation that performs multiple stack modifications must take this precaution and snapshot regLSP.
     */
    this.opLSP = this.regLSP;

    var newIP = this.popWord();
    var newCS = this.popWord();

    if (n) this.setSP(this.getSP() + n);            // TODO: optimize

    if (this.setCSIP(newIP, newCS, false)) {        // returns true if a stack switch occurred
        /*
         * Fool me once, shame on... whatever.  If setCSIP() indicates a stack switch occurred,
         * make sure we're in protected mode, because automatic stack switches can't occur in real mode.
         */
        this.assert(!!(this.regCR0 & X86.CR0.MSW.PE));

        if (n) this.setSP(this.getSP() + n);        // TODO: optimize

        /*
         * As per Intel documentation: "If any of [the DS or ES] registers refer to segments whose DPL is
         * less than the new CPL (excluding conforming code segments), the segment register is loaded with
         * the null selector."
         *
         * TODO: I'm not clear on whether a conforming code segment must also be marked readable, so I'm playing
         * it safe and using CODE_CONFORMING instead of CODE_CONFORMING_READABLE.  Also, for the record, I've not
         * seen this situation occur yet (eg, in OS/2 1.0).
         */
        this.zeroSeg(this.segDS);
        this.zeroSeg(this.segES);
        if (I386 && this.model >= X86.MODEL_80386) {
            this.zeroSeg(this.segFS);
            this.zeroSeg(this.segGS);
        }
    }
    if (n == 2 && this.cIntReturn) this.checkIntReturn(this.regLIP);

    this.opLSP = X86.ADDR_INVALID;
};

/**
 * fnROLb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnROLb = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry;
        count &= 0x7;
        if (!count) {
            carry = dst << 7;
        } else {
            carry = dst << (count - 1);
            result = ((dst << count) | (dst >> (8 - count))) & 0xff;
        }
        this.setRotateResult(result, carry, X86.RESULT.BYTE);
    }
    return result;
};

/**
 * fnROLw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnROLw = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry;
        count &= 0xf;
        if (!count) {
            carry = dst << 15;
        } else {
            carry = dst << (count - 1);
            result = ((dst << count) | (dst >> (16 - count))) & 0xffff;
        }
        this.setRotateResult(result, carry, X86.RESULT.WORD);
    }
    return result;
};

/**
 * fnROLd(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnROLd = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = dst << (count - 1);
        result = (dst << count) | (dst >>> (32 - count));
        this.setRotateResult(result, carry, X86.RESULT.DWORD);
    }
    return result;
};

/**
 * fnRORb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRORb = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry;
        count &= 0x7;
        if (!count) {
            carry = dst;
        } else {
            carry = dst << (8 - count);
            result = ((dst >>> count) | carry) & 0xff;
        }
        this.setRotateResult(result, carry, X86.RESULT.BYTE);
    }
    return result;
};

/**
 * fnRORw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRORw = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry;
        count &= 0xf;
        if (!count) {
            carry = dst;
        } else {
            carry = dst << (16 - count);
            result = ((dst >>> count) | carry) & 0xffff;
        }
        this.setRotateResult(result, carry, X86.RESULT.WORD);
    }
    return result;
};

/**
 * fnRORd(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL)
 * @return {number}
 */
X86.fnRORd = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = dst << (32 - count);
        result = (dst >>> count) | carry;
        this.setRotateResult(result, carry, X86.RESULT.DWORD);
    }
    return result;
};

/**
 * fnSARb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSARb = function(dst, src)
{
    var count = src & this.nShiftCountMask;
    if (count) {
        if (count > 9) count = 9;
        var carry = ((dst << 24) >> 24) >> (count - 1);
        dst = (carry >> 1) & 0xff;
        this.setLogicResult(dst, X86.RESULT.BYTE, carry & 0x1);
    }
    return dst;
};

/**
 * fnSARw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSARw = function(dst, src)
{
    var count = src & this.nShiftCountMask;
    if (count) {
        if (count > 17) count = 17;
        var carry = ((dst << 16) >> 16) >> (count - 1);
        dst = (carry >> 1) & 0xffff;
        this.setLogicResult(dst, X86.RESULT.WORD, carry & 0x1);
    }
    return dst;
};

/**
 * fnSARd(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSARd = function(dst, src)
{
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = dst >> (count - 1);
        dst = (carry >> 1);
        this.setLogicResult(dst, X86.RESULT.DWORD, carry & 0x1);
    }
    return dst;
};

/**
 * fnSBBb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSBBb = function(dst, src)
{
    var b = (dst - src - this.getCarry())|0;
    this.setArithResult(dst, src, b, X86.RESULT.BYTE | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return b & 0xff;
};

/**
 * fnSBBw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSBBw = function(dst, src)
{
    var w = (dst - src - this.getCarry())|0;
    this.setArithResult(dst, src, w, this.typeData | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return w & this.maskData;
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
 * fnSETO(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETO = function(dst, src)
{
    return (this.getOF()? 1 : 0);
};

/**
 * fnSETNO(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNO = function(dst, src)
{
    return (this.getOF()? 0 : 1);
};

/**
 * fnSETC(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETC = function(dst, src)
{
    return (this.getCF()? 1 : 0);
};

/**
 * fnSETNC(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNC = function(dst, src)
{
    return (this.getCF()? 0 : 1);
};

/**
 * fnSETZ(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETZ = function(dst, src)
{
    return (this.getZF()? 1 : 0);
};

/**
 * fnSETNZ(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNZ = function(dst, src)
{
    return (this.getZF()? 0 : 1);
};

/**
 * fnSETBE(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETBE = function(dst, src)
{
    return (this.getCF() || this.getZF()? 1 : 0);
};

/**
 * fnSETNBE(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNBE = function(dst, src)
{
    return (this.getCF() || this.getZF()? 0 : 1);
};

/**
 * fnSETS(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETS = function(dst, src)
{
    return (this.getSF()? 1 : 0);
};

/**
 * fnSETNS(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNS = function(dst, src)
{
    return (this.getSF()? 0 : 1);
};

/**
 * fnSETP(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETP = function(dst, src)
{
    return (this.getPF()? 1 : 0);
};

/**
 * fnSETNP(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNP = function(dst, src)
{
    return (this.getPF()? 0 : 1);
};

/**
 * fnSETL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETL = function(dst, src)
{
    return (!this.getSF() != !this.getOF()? 1 : 0);
};

/**
 * fnSETNL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNL = function(dst, src)
{
    return (!this.getSF() != !this.getOF()? 0 : 1);
};

/**
 * fnSETLE(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETLE = function(dst, src)
{
    return (this.getZF() || !this.getSF() != !this.getOF()? 1 : 0);
};

/**
 * fnSETNLE(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst (ignored)
 * @param {number} src (ignored)
 * @return {number}
 */
X86.fnSETNLE = function(dst, src)
{
    return (this.getZF() || !this.getSF() != !this.getOF()? 0 : 1);
};

/**
 * fnSGDT(dst, src)
 *
 * op=0x0F,0x01,reg=0x0 (GRP7:SGDT)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnSGDT = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        X86.opInvalid.call(this);
    } else {
        /*
         * We don't need to setShort() the first word of the operand, because the ModRM group decoder that
         * calls us does that automatically with the value we return (dst).
         */
        dst = this.addrGDTLimit - this.addrGDT;
        this.assert(!(dst & ~0xffff));
        /*
         * We previously left the 6th byte of the target operand "undefined".  But it turns out we have to set
         * it to *something*, because there's processor detection in PC-DOS 7.0 (at least in the SETUP portion)
         * that looks like this:
         *
         *      145E:4B84 9C            PUSHF
         *      145E:4B85 55            PUSH     BP
         *      145E:4B86 8BEC          MOV      BP,SP
         *      145E:4B88 B80000        MOV      AX,0000
         *      145E:4B8B 50            PUSH     AX
         *      145E:4B8C 9D            POPF
         *      145E:4B8D 9C            PUSHF
         *      145E:4B8E 58            POP      AX
         *      145E:4B8F 2500F0        AND      AX,F000
         *      145E:4B92 3D00F0        CMP      AX,F000
         *      145E:4B95 7511          JNZ      4BA8
         *      145E:4BA8 C8060000      ENTER    0006,00
         *      145E:4BAC 0F0146FA      SGDT     [BP-06]
         *      145E:4BB0 807EFFFF      CMP      [BP-01],FF
         *      145E:4BB4 C9            LEAVE
         *      145E:4BB5 BA8603        MOV      DX,0386
         *      145E:4BB8 7503          JNZ      4BBD
         *      145E:4BBA BA8602        MOV      DX,0286
         *      145E:4BBD 89163004      MOV      [0430],DX
         *      145E:4BC1 5D            POP      BP
         *      145E:4BC2 9D            POPF
         *      145E:4BC3 CB            RETF
         *
         * This code is expecting SGDT on an 80286 to set the 6th "undefined" byte to 0xFF.
         *
         * The 80386 adds an additional wrinkle: the 6th byte must be 0x00 if the OPERAND size is 2, whereas
         * it must passed through if the OPERAND size is 4.
         *
         * In addition, when the OPERAND size is 4, the ModRM group decoder will call setLong(dst) rather than
         * setShort(dst); we could fix that by forcing the dataSize to 2, but it seems simpler to set the high
         * bits (16-31) of dst to match the low bits (0-15) of addr, so that the caller will harmlessly rewrite
         * what we already wrote with the setLong() below.
         */
        var addr = this.addrGDT;
        if (this.model == X86.MODEL_80286) {
            addr |= (0xff000000|0);
        }
        else if (this.model >= X86.MODEL_80386) {
            if (this.sizeData == 2) {
                addr &= 0x00ffffff;
            } else {
                dst |= (addr << 16);
            }
        }
        this.setLong(this.regEA + 2, addr);
        this.nStepCycles -= 11;
    }
    return dst;
};

/**
 * fnSHLb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSHLb = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = 0;
        if (count > 8) {
            result = 0;
        } else {
            carry = dst << (count - 1);
            result = (carry << 1) & 0xff;
        }
        this.setLogicResult(result, X86.RESULT.BYTE, carry & X86.RESULT.BYTE, (result ^ carry) & X86.RESULT.BYTE);
    }
    return result;
};

/**
 * fnSHLw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSHLw = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = 0;
        if (count > 16) {
            result = 0;
        } else {
            carry = dst << (count - 1);
            result = (carry << 1) & 0xffff;
        }
        this.setLogicResult(result, X86.RESULT.WORD, carry & X86.RESULT.WORD, (result ^ carry) & X86.RESULT.WORD);
    }
    return result;
};

/**
 * fnSHLd(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSHLd = function(dst, src)
{
    var result = dst;
    var flagsIn = (DEBUG? this.getPS() : 0);
    var count = src & this.nShiftCountMask;     // this 32-bit-only function could mask with 0x1f directly
    if (count) {
        var carry = dst << (count - 1);
        result = (carry << 1);
        this.setLogicResult(result, X86.RESULT.DWORD, carry & X86.RESULT.DWORD, (result ^ carry) & X86.RESULT.DWORD);
    }
    return result;
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
 * fnSHLDwi(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHLDwi = function(dst, src)
{
    return X86.fnSHLDw.call(this, dst, src, this.getIPByte());
};

/**
 * fnSHLDdi(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHLDdi = function(dst, src)
{
    return X86.fnSHLDd.call(this, dst, src, this.getIPByte());
};

/**
 * fnSHLDwCL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHLDwCL = function(dst, src)
{
    return X86.fnSHLDw.call(this, dst, src, this.regECX & 0x1f);
};

/**
 * fnSHLDdCL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHLDdCL = function(dst, src)
{
    return X86.fnSHLDd.call(this, dst, src, this.regECX & 0x1f);
};

/**
 * fnSHRb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSHRb = function(dst, src)
{
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = (count > 8? 0 : (dst >>> (count - 1)));
        dst = (carry >>> 1) & 0xff;
        this.setLogicResult(dst, X86.RESULT.BYTE, carry & 0x1, dst & X86.RESULT.BYTE);
    }
    return dst;
};

/**
 * fnSHRw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSHRw = function(dst, src)
{
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = (count > 16? 0 : (dst >>> (count - 1)));
        dst = (carry >>> 1) & 0xffff;
        this.setLogicResult(dst, X86.RESULT.WORD, carry & 0x1, dst & X86.RESULT.WORD);
    }
    return dst;
};

/**
 * fnSHRd(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (1 or CL, or an immediate byte for 80186/80188 and up)
 * @return {number}
 */
X86.fnSHRd = function(dst, src)
{
    var count = src & this.nShiftCountMask;
    if (count) {
        var carry = (dst >>> (count - 1));
        dst = (carry >>> 1);
        this.setLogicResult(dst, X86.RESULT.DWORD, carry & 0x1, dst & X86.RESULT.DWORD);
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
 * fnSHRDwi(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHRDwi = function(dst, src)
{
    return X86.fnSHRDw.call(this, dst, src, this.getIPByte());
};

/**
 * fnSHRDdi(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHRDdi = function(dst, src)
{
    return X86.fnSHRDd.call(this, dst, src, this.getIPByte());
};

/**
 * fnSHRDwCL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHRDwCL = function(dst, src)
{
    return X86.fnSHRDw.call(this, dst, src, this.regECX & 0x1f);
};

/**
 * fnSHRDdCL(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSHRDdCL = function(dst, src)
{
    return X86.fnSHRDd.call(this, dst, src, this.regECX & 0x1f);
};

/**
 * fnSIDT(dst, src)
 *
 * op=0x0F,0x01,reg=0x1 (GRP7:SIDT)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnSIDT = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        X86.opInvalid.call(this);
    } else {
        /*
         * We don't need to setShort() the first word of the operand, because the ModRM group decoder that calls
         * us does that automatically with the value we return (dst).
         */
        dst = this.addrIDTLimit - this.addrIDT;
        this.assert(!(dst & ~0xffff));
        /*
         * As with SGDT, the 6th byte is technically "undefined" on an 80286, but we now set it to 0xFF, for the
         * same reasons discussed in SGDT (above).
         */
        var addr = this.addrIDT;
        if (this.model == X86.MODEL_80286) {
            addr |= (0xff000000|0);
        }
        else if (this.model >= X86.MODEL_80386) {
            if (this.sizeData == 2) {
                addr &= 0x00ffffff;
            } else {
                dst |= (addr << 16);
            }
        }
        this.setLong(this.regEA + 2, addr);
        this.nStepCycles -= 12;
    }
    return dst;
};

/**
 * fnSLDT(dst, src)
 *
 * op=0x0F,0x00,reg=0x0 (GRP6:SLDT)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnSLDT = function(dst, src)
{
    this.nStepCycles -= (2 + (this.regEA === X86.ADDR_INVALID? 0 : 1));
    return this.segLDT.sel;
};

/**
 * fnSMSW(dst, src)
 *
 * TODO: I've seen a claim that SMSW can be used with an operand size override to obtain the entire CR0.
 * I don't dispute that, and since I don't mask the return value, that should be possible here; however, it
 * should still be confirmed on real hardware at some point.  Note that this differs from LMSW, which is
 * REQUIRED to mask the source operand.
 *
 * op=0x0F,0x01,reg=0x4 (GRP7:SMSW)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnSMSW = function(dst, src)
{
    this.nStepCycles -= (2 + (this.regEA === X86.ADDR_INVALID? 0 : 1));
    return this.regCR0;
};

/**
 * fnSTR(dst, src)
 *
 * op=0x0F,0x00,reg=0x1 (GRP6:STR)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnSTR = function(dst, src)
{
    this.nStepCycles -= (2 + (this.regEA === X86.ADDR_INVALID? 0 : 1));
    return this.segTSS.sel;
};

/**
 * fnSUBb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSUBb = function(dst, src)
{
    var b = (dst - src)|0;
    this.setArithResult(dst, src, b, X86.RESULT.BYTE | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return b & 0xff;
};

/**
 * fnSUBw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnSUBw = function(dst, src)
{
    var w = (dst - src)|0;
    this.setArithResult(dst, src, w, this.typeData | X86.RESULT.ALL, true);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return w & this.maskData;
};

/**
 * fnTESTib(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null; we have to supply the source ourselves)
 * @return {number}
 */
X86.fnTESTib = function(dst, src)
{
    src = this.getIPByte();
    this.setLogicResult(dst & src, X86.RESULT.BYTE);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesTestRI : this.cycleCounts.nOpCyclesTestMI);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnTESTiw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null; we have to supply the source ourselves)
 * @return {number}
 */
X86.fnTESTiw = function(dst, src)
{
    src = this.getIPWord();
    this.setLogicResult(dst & src, this.typeData);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesTestRI : this.cycleCounts.nOpCyclesTestMI);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnTESTb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnTESTb = function(dst, src)
{
    this.setLogicResult(dst & src, X86.RESULT.BYTE);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesTestRR : this.cycleCounts.nOpCyclesTestRM) : this.cycleCounts.nOpCyclesTestRM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnTESTw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnTESTw = function(dst, src)
{
    this.setLogicResult(dst & src, this.typeData);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesTestRR : this.cycleCounts.nOpCyclesTestRM) : this.cycleCounts.nOpCyclesTestRM);
    this.opFlags |= X86.OPFLAG.NOWRITE;
    return dst;
};

/**
 * fnVERR(dst, src)
 *
 * op=0x0F,0x00,reg=0x4 (GRP6:VERR)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnVERR = function(dst, src)
{
    this.opFlags |= X86.OPFLAG.NOWRITE;
    /*
     * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
     * descriptor table or the descriptor is not for a segment.
     */
    this.nStepCycles -= (14 + (this.regEA === X86.ADDR_INVALID? 0 : 2));
    if (this.segVER.load(dst) !== X86.ADDR_INVALID) {
        /*
         * Verify that this is a readable segment; that is, of these four combinations (code+readable,
         * code+nonreadable, data+writable, date+nonwritable), make sure we're not the second combination.
         */
        if ((this.segVER.acc & (X86.DESC.ACC.TYPE.READABLE | X86.DESC.ACC.TYPE.CODE)) != X86.DESC.ACC.TYPE.CODE) {
            /*
             * For VERR, if the code segment is readable and conforming, the descriptor privilege level
             * (DPL) can be any value.
             *
             * Otherwise, DPL must be greater than or equal to (have less or the same privilege as) both the
             * current privilege level and the selector's RPL.
             */
            if (this.segVER.dpl >= this.nCPL && this.segVER.dpl >= (dst & X86.SEL.RPL) ||
                (this.segVER.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING) == X86.DESC.ACC.TYPE.CODE_CONFORMING) {
                this.setZF();
                return dst;
            }
        }
    }
    this.clearZF();
    if (DEBUG && (this.sizeData > 2 || this.sizeAddr > 2)) this.stopCPU();
    return dst;
};

/**
 * fnVERW(dst, src)
 *
 * op=0x0F,0x00,reg=0x5 (GRP6:VERW)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src (null)
 * @return {number}
 */
X86.fnVERW = function(dst, src)
{
    this.opFlags |= X86.OPFLAG.NOWRITE;
    /*
     * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
     * descriptor table or the descriptor is not for a segment.
     */
    this.nStepCycles -= (14 + (this.regEA === X86.ADDR_INVALID? 0 : 2));
    if (this.segVER.load(dst) !== X86.ADDR_INVALID) {
        /*
         * Verify that this is a writable data segment
         */
        if ((this.segVER.acc & (X86.DESC.ACC.TYPE.WRITABLE | X86.DESC.ACC.TYPE.CODE)) == X86.DESC.ACC.TYPE.WRITABLE) {
            /*
             * DPL must be greater than or equal to (have less or the same privilege as) both the current
             * privilege level and the selector's RPL.
             */
            if (this.segVER.dpl >= this.nCPL && this.segVER.dpl >= (dst & X86.SEL.RPL)) {
                this.setZF();
                return dst;
            }
        }
    }
    this.clearZF();
    if (DEBUG && (this.sizeData > 2 || this.sizeAddr > 2)) this.stopCPU();
    return dst;
};

/**
 * fnIBTS(dst, src)
 *
 * As best I can determine, this function copies the specified bits from src (starting at bit 0 for CL
 * bits) to dst (starting at bit offset in AX).  For register operands, that's simple enough.
 *
 * TODO: If dst refers to a memory location, then the bit index may refer to higher memory locations, just
 * like the BT/BTC/BTR/BTS instructions.  For an instruction that no one was really able to use, except
 * as a CPU stepping discriminator, that doesn't seem worth the effort.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnIBTS = function(dst, src)
{
    var shift = (this.regEAX & this.maskData);
    var mask = ((1 << (this.regECX & 0x1f)) - 1);
    return (dst & ~(mask << shift)) | ((src & mask) << shift);
};

/**
 * fnXBTS(dst, src)
 *
 * As best I can determine, this function copies the specified bits from src (starting at the bit offset
 * in AX, for the bit length in CL) to dst (starting at bit 0).  For register operands, that's simple enough.
 *
 * TODO: If src refers to a memory location, then the bit index may refer to higher memory locations, just
 * like the BT/BTC/BTR/BTS instructions.  For an instruction that no one was really able to use, except
 * as a CPU stepping discriminator, that doesn't seem worth the effort.
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnXBTS = function(dst, src)
{
    /*
     * Shift src right by the bit offset in [E]AX, then apply a mask equal to the number of bits in CL,
     * then mask the resulting bit string with the current OPERAND size.
     */
    return ((src >> (this.regEAX & this.maskData)) & ((1 << (this.regECX & 0x1f)) - 1)) & this.maskData;
};

/**
 * fnXCHGrb(dst, src)
 *
 * If an instruction like "XCHG AL,AH" was a traditional "op dst,src" instruction, dst would contain AL,
 * src would contain AH, and we would return src, which the caller would then store in AL, and we'd be done.
 *
 * However, that's only half of what XCHG does, so THIS function must perform the other half; in the previous
 * example, that means storing the original AL (dst) into AH (src).
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
X86.fnXCHGrb = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        /*
         * Decode which register was src
         */
        this.assert(!(dst & ~0xff));            // confirm that dst contains only 8 bits
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
            this.regEAX = (this.regEAX & ~0xff00) | (dst << 8);
            break;
        case 0x5:       // CH
            this.regECX = (this.regECX & ~0xff00) | (dst << 8);
            break;
        case 0x6:       // DH
            this.regEDX = (this.regEDX & ~0xff00) | (dst << 8);
            break;
        case 0x7:       // BH
            this.regEBX = (this.regEBX & ~0xff00) | (dst << 8);
            break;
        default:
            break;      // there IS no other case, but JavaScript inspections don't know that
        }
        this.nStepCycles -= this.cycleCounts.nOpCyclesXchgRR;
    } else {
        /*
         * This is a case where the ModRM decoder that's calling us didn't know it should have called modEAByte()
         * instead of getEAByte(), so we compensate by updating regEAWrite.  However, setEAByte() has since been
         * changed to revalidate the write using segEA:offEA, so updating regEAWrite here isn't strictly necessary.
         */
        this.regEAWrite = this.regEA;
        this.setEAByte(dst);
        this.nStepCycles -= this.cycleCounts.nOpCyclesXchgRM;
    }
    return src;
};

/**
 * fnXCHGrw(dst, src)
 *
 * If an instruction like "XCHG AX,DX" was a traditional "op dst,src" instruction, dst would contain AX,
 * src would contain DX, and we would return src, which the caller would then store in AX, and we'd be done.
 *
 * However, that's only half of what XCHG does, so THIS function must perform the other half; in the previous
 * example, that means storing the original AX (dst) into DX (src).
 *
 * TODO: Implement full BACKTRACK support for XCHG instructions (see fnXCHGrb comments).
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnXCHGrw = function(dst, src)
{
    if (this.regEA === X86.ADDR_INVALID) {
        /*
         * Decode which register was src
         */
        this.assert(!(dst & ~this.maskData));   // confirm that dst contains only 16 or 32 bits
        switch (this.bModRM & 0x7) {
        case 0x0:       // [E]AX
            this.regEAX = (this.regEAX & ~this.maskData) | dst;
            break;
        case 0x1:       // [E]CX
            this.regECX = (this.regECX & ~this.maskData) | dst;
            break;
        case 0x2:       // [E]DX
            this.regEDX = (this.regEDX & ~this.maskData) | dst;
            break;
        case 0x3:       // [E]BX
            this.regEBX = (this.regEBX & ~this.maskData) | dst;
            break;
        case 0x4:       // [E]SP
            this.setSP((this.getSP() & ~this.maskData) | dst);
            break;
        case 0x5:       // [E]BP
            this.regEBP = (this.regEBX & ~this.maskData) | dst;
            break;
        case 0x6:       // [E]SI
            this.regESI = (this.regESI & ~this.maskData) | dst;
            break;
        case 0x7:       // [E]DI
            this.regEDI = (this.regEDI & ~this.maskData) | dst;
            break;
        default:
            break;      // there IS no other case, but JavaScript inspections don't know that
        }
        this.nStepCycles -= this.cycleCounts.nOpCyclesXchgRR;
    } else {
        /*
         * This is a case where the ModRM decoder that's calling us didn't know it should have called modEAWord()
         * instead of getEAWord(), so we compensate by updating regEAWrite.  However, setEAWord() has since been
         * changed to revalidate the write using segEA:offEA, so updating regEAWrite here isn't strictly necessary.
         */
        this.regEAWrite = this.regEA;
        this.setEAWord(dst);
        this.nStepCycles -= this.cycleCounts.nOpCyclesXchgRM;
    }
    return src;
};

/**
 * fnXORb(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnXORb = function(dst, src)
{
    var b = dst ^ src;
    this.setLogicResult(b, X86.RESULT.BYTE);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return b;
};

/**
 * fnXORw(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnXORw = function(dst, src)
{
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesArithRR : this.cycleCounts.nOpCyclesArithRM) : this.cycleCounts.nOpCyclesArithMR);
    return this.setLogicResult(dst ^ src, this.typeData) & this.maskData;
};

/**
 * fnGRPFault(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnGRPFault = function(dst, src)
{
    X86.fnFault.call(this, X86.EXCEPTION.GP_FAULT, 0);
    return dst;
};

/**
 * fnGRPInvalid(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnGRPInvalid = function(dst, src)
{
    X86.opInvalid.call(this);
    return dst;
};

/**
 * fnGRPUndefined(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnGRPUndefined = function(dst, src)
{
    X86.opUndefined.call(this);
    return dst;
};

/**
 * fnDIVOverflow()
 *
 * @this {X86CPU}
 */
X86.fnDIVOverflow = function()
{
    /*
     * Divide error exceptions are traps on the 8086 and faults on later processors.  I question the value of that
     * change, because it implies that someone might actually want to restart a failing divide.  The only reasonable
     * explanation I can see for the change is to enable the exception handler to accurately record the address of
     * the failing divide, which seems like a very minor benefit.  It doesn't change the fact that, on any processor,
     * the exception handler's only reasonable recourse is to unwind execution to a safe point (or terminate the app).
     *
     * TODO: Determine the proper cycle cost.
     */
    if (this.model == X86.MODEL_8086) {
        X86.fnTrap.call(this, X86.EXCEPTION.DE_EXC, 2);
    } else {
        X86.fnFault.call(this, X86.EXCEPTION.DE_EXC, null, 2);
    }
};

/**
 * fnSRCCount1()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86.fnSRCCount1 = function()
{
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? 2 : this.cycleCounts.nOpCyclesShift1M);
    return 1;
};

/**
 * fnSRCCountCL()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86.fnSRCCountCL = function()
{
    var count = this.regECX & 0xff;
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesShiftCR : this.cycleCounts.nOpCyclesShiftCM) + (count << this.cycleCounts.nOpCyclesShiftCS);
    return count;
};

/**
 * fnSRCCountN()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86.fnSRCCountN = function()
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

/**
 * fnTrap(nIDT, nCycles)
 *
 * Helper to dispatch traps (ie, exceptions that occur AFTER the instruction, with NO error code)
 *
 * @this {X86CPU}
 * @param {number} nIDT
 * @param {number} [nCycles] (number of cycles in addition to the default of nOpCyclesInt)
 */
X86.fnTrap = function(nIDT, nCycles)
{
    this.nFault = -1;
    X86.fnINT.call(this, nIDT, null, nCycles);
};

/**
 * fnFault(nFault, nError, nCycles, fHalt)
 *
 * Helper to dispatch faults (ie, exceptions that occur DURING an instruction and MAY generate an error code)
 *
 * @this {X86CPU}
 * @param {number} nFault
 * @param {number|null} [nError] (if omitted, no error code will be pushed)
 * @param {number} [nCycles] cycle count to pass through to fnINT(), if any
 * @param {boolean} [fHalt] (true to halt the CPU, false to not, undefined if "it depends")
 */
X86.fnFault = function(nFault, nError, nCycles, fHalt)
{
    var fDispatch = null;

    if (!this.aFlags.fComplete) {
        /*
         * Prior to each new burst of instructions, stepCPU() sets fComplete to true, and the only (normal) way
         * for fComplete to become false is through stopCPU(), which isn't ordinarily called, except by the Debugger.
         */
        this.resetSizes();
        this.setIP(this.opLIP - this.segCS.base);
    }
    else if (this.model >= X86.MODEL_80186) {
        if (this.nFault < 0) {
            /*
             * Single-fault (error code is passed through, and the responsible instruction is restartable;
             * the call to resetSizes() is critical, otherwise setIP() may update IP with the wrong size if
             * the current instruction contains an OPERAND size override).
             */
            this.resetSizes();
            if (this.opCS != -1) {
                this.setCS(this.opCS);
                this.opCS = -1;
            }
            this.setIP(this.opLIP - this.segCS.base);
            if (this.opLSP !== X86.ADDR_INVALID) {
                this.setSP((this.regESP & ~this.segSS.maskAddr) | (this.opLSP - this.segSS.base));
                this.opLSP = X86.ADDR_INVALID;
            }
            fDispatch = true;
        }
        else if (this.nFault != X86.EXCEPTION.DF_FAULT) {
            /*
             * Double-fault (error code is always zero, and the responsible instruction is not restartable)
             */
            nError = 0; nFault = X86.EXCEPTION.DF_FAULT;
            fDispatch = true;
        }
        else {
            /*
             * Triple-fault (usually referred to in Intel literature as a "shutdown", but at least on the 80286,
             * it's actually a "reset")
             */
            nFault = -1; nError = 0;
            this.resetRegs();
            fHalt = false;
        }
    }

    if (X86.fnFaultMessage.call(this, nFault, nError, fHalt)) {
        fDispatch = false;
    }

    if (fDispatch) {

        this.nFault = nFault;
        X86.fnINT.call(this, nFault, nError, nCycles);

        /*
         * REP'eated instructions that rewind regLIP to opLIP used to screw up this dispatch,
         * so now we slip the new regLIP into opLIP, effectively turning their action into a no-op.
         */
        this.opLIP = this.regLIP;

        /*
         * X86.OPFLAG.FAULT flag is used by selected opcodes to provide an early exit, restore register(s),
         * or whatever is needed to help ensure instruction restartability; there is currently no general
         * mechanism for snapping and restoring all registers for any instruction that might fault.
         *
         * X86.EXCEPTION.DB_EXC exceptions set their own special flag, X86.OPFLAG.DBEXC, to prevent redundant
         * DEBUG exceptions, so we don't need to set OPFLAG.FAULT in that case, because a DEBUG exception
         * doesn't actually prevent an instruction from executing (and therefore doesn't need to be restarted).
         */
        if (nFault == X86.EXCEPTION.DB_EXC) {
            this.opFlags |= X86.OPFLAG.DBEXC;
        } else {
            this.assert(nFault >= 0);
            this.opFlags |= X86.OPFLAG.FAULT;
        }

        /*
         * Since this fault is likely being issued in the context of an instruction that hasn't finished
         * executing, if we don't do anything to interrupt that execution (eg, throw a JavaScript exception),
         * then we would need to shut off all further reads/writes for the current instruction.
         *
         * That's easy for any EA-based memory accesses: simply set both the NOREAD and NOWRITE flags.
         * However, there are also direct, non-EA-based memory accesses to consider.  A perfect example is
         * opPUSHA(): if a GP fault occurs on any PUSH other than the last, a subsequent PUSH is likely to
         * cause another fault, which we will misinterpret as a double-fault -- unless the handler for
         * such an opcode checks this.opFlags for X86.OPFLAG.FAULT after each step of the operation.
         *
         *      this.opFlags |= (X86.OPFLAG.NOREAD | X86.OPFLAG.NOWRITE);
         *
         * Fortunately, we now throw an exception that terminates the current instruction, so the above hack
         * should no longer be necessary.
         */
        throw nFault;
    }
};

/**
 * fnPageFault(addr, fPresent, fWrite)
 *
 * Helper to dispatch page faults.
 *
 * @this {X86CPU}
 * @param {number} addr
 * @param {boolean} fPresent
 * @param {boolean} fWrite
 */
X86.fnPageFault = function(addr, fPresent, fWrite)
{
    this.regCR2 = addr;
    var nError = 0;
    if (fPresent) nError |= X86.PTE.PRESENT;
    if (fWrite) nError |= X86.PTE.READWRITE;
    if (this.nCPL == 3) nError |= X86.PTE.USER;
    X86.fnFault.call(this, X86.EXCEPTION.PF_FAULT, nError);
};

/**
 * fnFaultMessage(nFault, nError, fHalt)
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
 * @param {number|null} [nError] (if omitted, no error code will be reported)
 * @param {boolean} [fHalt] (true to halt the CPU, false to not, undefined if "it depends")
 * @return {boolean|undefined} true to block the fault (often desirable when fHalt is true), otherwise dispatch it
 */
X86.fnFaultMessage = function(nFault, nError, fHalt)
{
    var bitsMessage = Messages.FAULT;

    var bOpcode = this.probeAddr(this.regLIP);

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
     * When a triple fault shows up, nFault is -1; it displays as 0xff only because we use toHexByte().
     */
    if (bOpcode == X86.OPCODE.INT3 && !this.addrIDTLimit) {
        fHalt = false;
    }

    /*
     * There are a number of V86-mode exceptions we don't need to know about.  For starters, Windows 3.00
     * (and other versions of enhanced-mode Windows) use an ARPL to switch out of V86-mode, so we can ignore
     * those UD_FAULTs.
     *
     * Ditto for software interrupts, which will generate a GP_FAULT when the interrupt number (eg, 0x6D)
     * exceeds the protected-mode IDT's limit (eg, a limit of 0x2FF corresponds to a maximum interrupt number
     * of 0x5F).  Windows doesn't really care if its IDT is too small, because it has to simulate all software
     * interrupts in V86-mode regardless (they generate a GP_FAULT if IOPL < 3, and even when IOPL == 3, only
     * the protected-mode IDT handler gets to run).
     */
    if ((this.regPS & X86.PS.VM)) {
        if (nFault == X86.EXCEPTION.UD_FAULT && bOpcode == X86.OPCODE.ARPL ||
            nFault == X86.EXCEPTION.GP_FAULT && bOpcode == X86.OPCODE.INTN) {
            fHalt = false;
        }
    }
    if (nFault == X86.EXCEPTION.PF_FAULT && bOpcode == X86.OPCODE.IRET) {
        fHalt = true;
    }

    /*
     * If fHalt has been explicitly set to false, we also take that as a cue to disable fault messages
     * (which you can override by turning on CPU messages).
     */
    if (fHalt === false) {
        bitsMessage |= Messages.CPU;
    }

    /*
     * Similarly, the PC AT ROM BIOS deliberately generates a couple of GP faults as part of the POST
     * (Power-On Self Test); we don't want to ignore those, but we don't want to halt on them either.  We
     * detect those faults by virtue of the LIP being in the range 0x0F0000 to 0x0FFFFF.
     *
     * TODO: Be aware that this test can trigger false positives, such as when a V86-mode ARPL is hit; eg:
     *
     *      &FD82:22F7 6338            ARPL     [BX+SI],DI
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

        var fRunning = this.aFlags.fRunning;
        var sMessage = "Fault " + str.toHexByte(nFault) + (nError != null? " (" + str.toHexWord(nError) + ")" : "") + " on opcode " + str.toHexByte(bOpcode);
        if (fHalt && fRunning) sMessage += " (blocked by PCjs Debugger)";

        if (this.printMessage(sMessage, fHalt || bitsMessage, true)) {
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
             * If printMessage() returned false, then there's no Debugger, which means that messageEnabled() must have
             * returned false as well, which means that fHalt must be true.  Which means we should shut the machine down.
             */
            this.assert(fHalt);
            this.notice(sMessage);
            this.stopCPU();
        }
    }
    return fHalt;
};
