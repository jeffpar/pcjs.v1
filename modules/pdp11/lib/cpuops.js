/**
 * @fileoverview Implements PDP11 opcode handlers.
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
    var PDP11         = require("./defines");
}

/*
 * Decoding starts at the bottom of this file, in op1170().  The basic decoding approach is to
 * dispatch on the top 4 bits of the opcode, and if further decoding is required, the dispatched
 * function will dispatch on the next 4 bits, and so on (although some of the intermediate levels
 * dispatch only on 2 bits, which could also handled with a switch statement).
 *
 * Eventually, every opcode should end up either in an opXXX() function or opUndefined().  For
 * opcodes that perform a simple read and/or write operation, the entire operation is handled by
 * the opXXX() function.  For opcodes that perform a more extensive read/modify/write operation
 * (also known as an update operation), those opXXX() functions usually rely on a corresponding
 * fnXXX() helper function.
 *
 * For example, opADD() passes the helper function fnADD() to the appropriate update method.  This
 * allows the update method to perform the entire read/modify/write operation, because the modify
 * step is performed internally via the fnXXX() helper function.
 */

/**
 * fnADD(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (dst + src)
 */
PDP11.fnADD = function(src, dst)
{
    var result = dst + src;
    this.updateAddFlags(result, src, dst);
    return result & 0xffff;
};

/**
 * fnADDB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (dst + src)
 */
PDP11.fnADDB = function(src, dst)
{
    var result = dst + src;
    this.updateAddFlags(result << 8, src << 8, dst << 8);
    return result & 0xff;
};

/**
 * fnASL(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst << 1)
 */
PDP11.fnASL = function(src, dst)
{
    var result = dst << 1;
    this.updateShiftFlags(result);
    return result & 0xffff;
};

/**
 * fnASLB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst << 1)
 */
PDP11.fnASLB = function(src, dst)
{
    var result = dst << 1;
    this.updateShiftFlags(result << 8);
    return result & 0xff;
};

/**
 * fnASR(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst >> 1)
 */
PDP11.fnASR = function(src, dst)
{
    var result = (dst & 0x8000) | (dst >> 1) | (dst << 16);
    this.updateShiftFlags(result);
    return result & 0xffff;
};

/**
 * fnASRB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst >> 1)
 */
PDP11.fnASRB = function(src, dst)
{
    var result = (dst & 0x800) | (dst >> 1) | (dst << 8);
    this.updateShiftFlags(result << 8);
    return result & 0xff;
};

/**
 * fnBIC(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (~src & dst)
 */
PDP11.fnBIC = function(src, dst)
{
    var result = dst & ~src;
    this.updateNZVFlags(result);
    return result;
};

/**
 * fnBICB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (~src & dst)
 */
PDP11.fnBICB = function(src, dst)
{
    var result = dst & ~src;
    this.updateNZVFlags(result << 8);
    return result;
};

/**
 * fnBIS(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (dst | src)
 */
PDP11.fnBIS = function(src, dst)
{
    var result = dst | src;
    this.updateNZVFlags(result);
    return result;
};

/**
 * fnBISB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (dst | src)
 */
PDP11.fnBISB = function(src, dst)
{
    var result = dst | src;
    this.updateNZVFlags(result << 8);
    return result;
};

/**
 * fnCOM(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (~dst)
 */
PDP11.fnCOM = function(src, dst)
{
    var result = ~dst | 0x10000;
    this.updateAllFlags(result);
    return result & 0xffff;
};

/**
 * fnCOMB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (~dst)
 */
PDP11.fnCOMB = function(src, dst)
{
    var result = ~dst | 0x100;
    this.updateAllFlags(result << 8);
    return result & 0xff;
};

/**
 * fnDEC(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ie, 1)
 * @param {number} dst
 * @return {number} (dst - src)
 */
PDP11.fnDEC = function(src, dst)
{
    var result = dst - src;
    this.updateDecFlags(result, dst);
    return result & 0xffff;
};

/**
 * fnDECB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ie, 1)
 * @param {number} dst
 * @return {number} (dst - src)
 */
PDP11.fnDECB = function(src, dst)
{
    var result = dst - src;
    this.updateDecFlags(result << 8, dst << 8);
    return result & 0xff;
};

/**
 * fnINC(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ie, 1)
 * @param {number} dst
 * @return {number} (dst + src)
 */
PDP11.fnINC = function(src, dst)
{
    var result = dst + src;
    this.updateIncFlags(result, dst);
    return result & 0xffff;
};

/**
 * fnINCB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ie, 1)
 * @param {number} dst
 * @return {number} (dst + src)
 */
PDP11.fnINCB = function(src, dst)
{
    var result = dst + src;
    this.updateIncFlags(result << 8, dst << 8);
    return result & 0xff;
};

/**
 * fnNEG(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (-dst)
 */
PDP11.fnNEG = function(src, dst)
{
    var result = -dst;
    /*
     * If the sign bit of both dst and result are set, the original value must have been 0x8000, triggering overflow.
     */
    this.updateAllFlags(result, result & dst & 0x8000);
    return result & 0xffff;
};

/**
 * fnNEGB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (-dst)
 */
PDP11.fnNEGB = function(src, dst)
{
    var result = -dst;
    /*
     * If the sign bit of both dst and result are set, the original value must have been 0x80, which triggers overflow.
     */
    this.updateAllFlags(result << 8, (result & dst & 0x80) << 8);
    return result & 0xff;
};

/**
 * fnROL(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst >> 1)
 */
PDP11.fnROL = function(src, dst)
{
    var result = (dst << 1) | ((this.flagC >> 16) & 1);
    this.updateShiftFlags(result);
    return result & 0xffff;
};

/**
 * fnROLB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst >> 1)
 */
PDP11.fnROLB = function(src, dst)
{
    var result = (dst << 1) | ((this.flagC >> 16) & 1);
    this.updateShiftFlags(result << 8);
    return result & 0xff;
};

/**
 * fnROR(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst >> 1)
 */
PDP11.fnROR = function(src, dst)
{
    var result = (((this.flagC & 0x10000) | dst) >> 1) | (dst << 16);
    this.updateShiftFlags(result);
    return result & 0xffff;
};

/**
 * fnRORB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst >> 1)
 */
PDP11.fnRORB = function(src, dst)
{
    var result = ((((this.flagC & 0x10000) >> 8) | dst) >> 1) | (dst << 8);
    this.updateShiftFlags(result << 8);
    return result & 0xff;
};

/**
 * fnSUB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (dst - src)
 */
PDP11.fnSUB = function(src, dst)
{
    var result = dst - src;
    this.updateSubFlags(result, src, dst);
    return result & 0xffff;
};

/**
 * fnSUBB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (dst - src)
 */
PDP11.fnSUBB = function(src, dst)
{
    var result = dst - src;
    this.updateSubFlags(result << 8, src << 8, dst << 8);
    return result & 0xff;
};

/**
 * fnSWAB(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src (ignored)
 * @param {number} dst
 * @return {number} (dst with bytes swapped)
 */
PDP11.fnSWAB = function(src, dst)
{
    var result = (dst << 8) | (dst >> 8);
    /*
     * N and Z are based on the low byte of the result, which is the same as the high byte of dst.
     */
    this.updateNZVCFlags(dst & 0xff00);
    return result & 0xffff;
};

/**
 * fnXOR(src, dst)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (dst ^ src)
 */
PDP11.fnXOR = function(src, dst)
{
    var result = dst ^ src;
    this.updateNZVFlags(result);
    return result & 0xffff;
};

/**
 * opADC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opADC = function(opCode)
{
    this.updateDstWord(opCode, this.getCF()? 1 : 0, PDP11.fnADD);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opADCB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opADCB = function(opCode)
{
    this.updateDstByte(opCode, this.getCF()? 1 : 0, PDP11.fnADDB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opADD(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opADD = function(opCode)
{
    this.updateDstWord(opCode, this.readSrcWord(opCode), PDP11.fnADD);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 2) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opASH(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opASH = function(opCode)
{
    var src = this.readDstWord(opCode);
    var reg = (opCode >> 6) & 7;
    var result = this.regsGen[reg];
    if (result & 0x8000) result |= 0xffff0000;
    this.flagC = this.flagV = 0;
    src &= 0x3F;
    if (src & 0x20) {
        src = 64 - src;         // shift right
        if (src > 16) src = 16;
        this.flagC = result << (17 - src);
        result = result >> src;
    } else if (src) {
        if (src > 16) {         // shift left
            this.flagV = result;
            result = 0;
        } else {
            result = result << src;
            this.flagC = result;
            var dst = (result >> 15) & 0xffff;  // check successive sign bits
            if (dst && dst !== 0xffff) this.flagV = 0x8000;
        }
    }
    this.regsGen[reg] = result & 0xffff;
    this.flagN = this.flagZ = result;
    this.nStepCycles -= (this.dstMode? (5 + 1) : (6 + 1)) + src;
};

/**
 * opASHC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opASHC = function(opCode)
{
    var src = this.readDstWord(opCode);
    var reg = (opCode >> 6) & 7;
    var dst = (this.regsGen[reg] << 16) | this.regsGen[reg | 1];
    this.flagC = this.flagV = 0;
    src &= 0x3F;
    if (src & 0x20) {
        src = 64 - src;         // shift right
        if (src > 32) src = 32;
        var result = dst >> (src - 1);
        this.flagC = result << 16;
        result >>= 1;
        if (dst & 0x80000000) result |= 0xffffffff << (32 - src);
    } else {
        if (src) {              // shift left
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
    this.nStepCycles -= (this.dstMode? (5 + 1) : (6 + 1)) + src;
};

/**
 * opASL(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opASL = function(opCode)
{
    this.updateDstWord(opCode, 0, PDP11.fnASL);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opASLB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opASLB = function(opCode)
{
    this.updateDstByte(opCode, 0, PDP11.fnASLB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opASR(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opASR = function(opCode)
{
    this.updateDstWord(opCode, 0, PDP11.fnASR);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opASRB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opASRB = function(opCode)
{
    this.updateDstByte(opCode, 0, PDP11.fnASRB);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.dstAddr & 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opBCC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBCC = function(opCode)
{
    this.branch(opCode, !this.getCF());
};

/**
 * opBCS(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBCS = function(opCode)
{
    this.branch(opCode, this.getCF());
};

/**
 * opBIC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBIC = function(opCode)
{
    this.updateDstWord(opCode, this.readSrcWord(opCode), PDP11.fnBIC);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 2) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opBICB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBICB = function(opCode)
{
    this.updateDstByte(opCode, this.readSrcByte(opCode), PDP11.fnBICB);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 2) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opBIS(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBIS = function(opCode)
{
    this.updateDstWord(opCode, this.readSrcWord(opCode), PDP11.fnBIS);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 2) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opBISB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBISB = function(opCode)
{
    this.updateDstByte(opCode, this.readSrcByte(opCode), PDP11.fnBISB);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 2) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opBIT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBIT = function(opCode)
{
    this.updateNZVFlags(this.readSrcWord(opCode) & this.readDstWord(opCode));
    this.nStepCycles -= (this.dstMode? (3 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 1) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opBITB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBITB = function(opCode)
{
    this.updateNZVFlags((this.readSrcByte(opCode) & this.readDstByte(opCode)) << 8);
    this.nStepCycles -= (this.dstMode? (3 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 1) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opBEQ(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBEQ = function(opCode)
{
    this.branch(opCode, this.getZF());
};

/**
 * opBGE(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBGE = function(opCode)
{
    this.branch(opCode, !this.getNF() == !this.getVF());
};

/**
 * opBGT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBGT = function(opCode)
{
    this.branch(opCode, !this.getZF() && (!this.getNF() == !this.getVF()));
};

/**
 * opBHI(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBHI = function(opCode)
{
    this.branch(opCode, !this.getCF() && !this.getZF());
};

/**
 * opBLE(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBLE = function(opCode)
{
    this.branch(opCode, this.getZF() || (!this.getNF() != !this.getVF()));
};

/**
 * opBLOS(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBLOS = function(opCode)
{
    this.branch(opCode, this.getCF() || this.getZF());
};

/**
 * opBLT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBLT = function(opCode)
{
    this.branch(opCode, !this.getNF() != !this.getVF());
};

/**
 * opBMI(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBMI = function(opCode)
{
    this.branch(opCode, this.getNF());
};

/**
 * opBNE(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBNE = function(opCode)
{
    this.branch(opCode, !this.getZF());
};

/**
 * opBPL(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBPL = function(opCode)
{
    this.branch(opCode, !this.getNF());
};

/**
 * opBPT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBPT = function(opCode)
{
    this.trap(PDP11.TRAP.BREAKPOINT, PDP11.REASON.BPT);
    this.nStepCycles -= (4 + 1);
};

/**
 * opBR(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBR = function(opCode)
{
    this.branch(opCode, true);
};

/**
 * opBVC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBVC = function(opCode)
{
    this.branch(opCode, !this.getVF());
};

/**
 * opBVS(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBVS = function(opCode)
{
    this.branch(opCode, this.getVF());
};

/**
 * opCLR(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCLR = function(opCode)
{
    this.updateAllFlags(this.writeDstWord(opCode, 0));
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opCLRB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCLRB = function(opCode)
{
    this.updateAllFlags(this.writeDstByte(opCode, 0));
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opCLC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCLC = function(opCode)
{
    this.clearCF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opCLN(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCLN = function(opCode)
{
    this.clearNF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opCLV(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCLV = function(opCode)
{
    this.clearVF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opCLZ(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCLZ = function(opCode)
{
    this.clearZF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opCLx(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCLx = function(opCode)
{
    if (opCode & 0x1) this.clearCF();
    if (opCode & 0x2) this.clearVF();
    if (opCode & 0x4) this.clearZF();
    if (opCode & 0x8) this.clearNF();
    /*
     * TODO: Review whether this class of undocumented instructions really has a constant cycle time.
     */
    this.nStepCycles -= (4 + 1);
};

/**
 * opCMP(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCMP = function(opCode)
{
    var src = this.readSrcWord(opCode);
    var dst = this.readDstWord(opCode);
    var result = src - dst;
    /*
     * NOTE: CMP calculates (src - dst) rather than (dst - src), so src and dst updateSubFlags() parms must be reversed.
     */
    this.updateSubFlags(result, dst, src);
    this.nStepCycles -= (this.dstMode? (3 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 1) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opCMPB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCMPB = function(opCode)
{
    var src = this.readSrcByte(opCode) << 8;
    var dst = this.readDstByte(opCode) << 8;
    var result = src - dst;
    /*
     * NOTE: CMP calculates (src - dst) rather than (dst - src), so src and dst updateSubFlags() parms must be reversed.
     */
    this.updateSubFlags(result, dst, src);
    this.nStepCycles -= (this.dstMode? (3 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 1) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opCOM(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCOM = function(opCode)
{
    this.updateDstWord(opCode, 0, PDP11.fnCOM);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opCOMB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCOMB = function(opCode)
{
    this.updateDstByte(opCode, 0, PDP11.fnCOMB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opDEC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opDEC = function(opCode)
{
    this.updateDstWord(opCode, 1, PDP11.fnDEC);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opDECB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opDECB = function(opCode)
{
    this.updateDstByte(opCode, 1, PDP11.fnDECB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opDIV(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opDIV = function(opCode)
{
    /*
     * TODO: Review and determine if flag updates can be encapsulated in an updateDivFlags() function.
     */
    var src = this.readDstWord(opCode);
    if (!src) {
        this.flagN = 0;         // NZVC
        this.flagZ = 0;
        this.flagV = 0x8000;
        this.flagC = 0x10000;   // divide by zero
        this.nStepCycles -= (6 + 1);
    } else {
        var reg = (opCode >> 6) & 7;
        var dst = (this.regsGen[reg] << 16) | this.regsGen[reg | 1];
        this.flagC = this.flagV = 0;
        if (src & 0x8000) src |= ~0xffff;
        var result = ~~(dst / src);
        if (result >= -32768 && result <= 32767) {
            this.regsGen[reg] = result & 0xffff;
            this.regsGen[reg | 1] = (dst - (result * src)) & 0xffff;
            this.flagZ = (result >> 16) | result;
            this.flagN = result >> 16;
        } else {
            this.flagV = 0x8000;                                // overflow - following are indeterminate
            this.flagZ = (result >> 15) | result;               // dodgy
            this.flagN = dst >> 16;                             // just as dodgy
            if (src === -1 && this.regsGen[reg] === 0xfffe) {
                this.regsGen[reg] = this.regsGen[reg | 1] = 1;  // etc
            }
        }
        this.nStepCycles -= (52 + 1);                           // 52 is the mean of the shortest and longest times
    }
};

/**
 * opEMT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opEMT = function(opCode)
{
    this.trap(PDP11.TRAP.EMULATOR, PDP11.REASON.EMT);
    this.nStepCycles -= (22 + 3);
};

/**
 * opHALT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opHALT = function(opCode)
{
    if (this.regPSW & PDP11.PSW.CMODE) {
        this.regErr |= PDP11.CPUERR.BADHALT;
        this.trap(PDP11.TRAP.BUS_ERROR, PDP11.REASON.HALT);
    } else {
        this.stopCPU();
    }
    this.nStepCycles -= 7;
};

/**
 * opINC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opINC = function(opCode)
{
    this.updateDstWord(opCode, 1, PDP11.fnINC);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opINCB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opINCB = function(opCode)
{
    this.updateDstByte(opCode, 1, PDP11.fnINCB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opIOT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opIOT = function(opCode)
{
    this.trap(PDP11.TRAP.IOT, PDP11.REASON.IOT);
    this.nStepCycles -= (22 + 3);
};

PDP11.JMP_CYCLES = [
    0, 6 + 1, 6 + 1, 8 + 2, 6 + 1, 9 + 2, 7 + 2, 10 + 3
];

/**
 * opJMP(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opJMP = function(opCode)
{
    /*
     * Since JMP and JSR opcodes have their own unique timings for the various dst modes, we must snapshot
     * nStepCycles before decoding the mode, and then use that to update nStepCycles.
     */
    var nSnapCycles = this.nStepCycles;
    this.setPC(this.readDstAddr(opCode));
    this.nStepCycles = nSnapCycles - PDP11.JMP_CYCLES[this.dstMode];
};

PDP11.JSR_CYCLES = [
    0, 13 + 1, 13 + 1, 15 + 2, 13 + 1, 16 + 2, 14 + 2, 17 + 3
];

/**
 * opJSR(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opJSR = function(opCode)
{
    /*
     * Since JMP and JSR opcodes have their own unique timings for the various dst modes, we must snapshot
     * nStepCycles before decoding the mode, and then use that to update nStepCycles.
     */
    var nSnapCycles = this.nStepCycles;
    /*
     * TODO: Determine whether or not the SRCMODE operand (regsGen[reg]) should be snapped BEFORE or AFTER we
     * decode the DSTMODE operand.  Doing it AFTER seems a bit risky.
     */
    var addr = this.readDstAddr(opCode);
    var reg = (opCode >> PDP11.SRCMODE.SHIFT) & PDP11.OPREG.MASK;
    this.pushWord(this.regsGen[reg]);
    this.regsGen[reg] = this.getPC();
    this.setPC(addr);
    this.nStepCycles = nSnapCycles - PDP11.JSR_CYCLES[this.dstMode];
};

/**
 * opMARK(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMARK = function(opCode)
{
    var addr = (this.getPC() + ((opCode & 0x3F) << 1)) & 0xffff;
    var src = this.readWordFromVirtual(addr | 0x10000);
    this.setPC(this.regsGen[5]);
    this.setSP(addr + 2);
    this.regsGen[5] = src;
    this.nStepCycles -= (6 + 2);
};

/**
 * opMFPD(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMFPD = function(opCode)
{
    var data = this.readWordFromPrevSpace(opCode, PDP11.ACCESS.DSPACE);
    this.pushWord(data);
    this.updateNZVFlags(data);
    this.nStepCycles -= (10 + 1);
};

/**
 * opMFPI(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMFPI = function(opCode)
{
    var data = this.readWordFromPrevSpace(opCode, PDP11.ACCESS.ISPACE);
    this.pushWord(data);
    this.updateNZVFlags(data);
    this.nStepCycles -= (10 + 1);
};

PDP11.MOV_CYCLES = [
    2 + 1, 8 + 1, 8 + 1, 11 + 2, 9 + 1, 12 + 2, 10 + 2, 13 + 3,
    3 + 1, 8 + 1, 8 + 1, 11 + 2, 9 + 1, 12 + 2, 11 + 2, 14 + 3
];

/**
 * opMOV(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMOV = function(opCode)
{
    /*
     * Since MOV opcodes have their own unique timings for the various dst modes, we must snapshot
     * nStepCycles after decoding the src mode, and then use that to update nStepCycles.
     */
    var data = this.readSrcWord(opCode);
    var nSnapCycles = this.nStepCycles;
    this.updateNZVFlags(this.writeDstWord(opCode, data));
    this.nStepCycles = nSnapCycles - PDP11.MOV_CYCLES[(this.srcMode? 8 : 0) + this.dstMode] + (this.dstReg == 7 && !this.dstMode? 2 : 0);
};

/**
 * opMOVB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMOVB = function(opCode)
{
    var data = this.readSrcByte(opCode);
    this.updateNZVFlags(this.writeDstByte(opCode, data, PDP11.WRITE.SIGNEXT) << 8);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 2) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

PDP11.MTP_CYCLES = [
    6 + 1, 11 + 2, 11 + 2, 14 + 3, 12 + 2, 15 + 3, 14 + 3, 17 + 4
];

/**
 * opMTPD(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMTPD = function(opCode)
{
    /*
     * Since MTPD and MTPI opcodes have their own unique timings for the various dst modes, we must snapshot
     * nStepCycles before decoding the mode, and then use that to update nStepCycles.
     */
    var data = this.popWord();
    var nSnapCycles = this.nStepCycles;
    this.writeWordToPrevSpace(opCode, PDP11.ACCESS.DSPACE, data);
    this.updateNZVFlags(data);
    this.nStepCycles = nSnapCycles - PDP11.MTP_CYCLES[this.dstMode];
};

/**
 * opMTPI(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMTPI = function(opCode)
{
    /*
     * Since MTPD and MTPI opcodes have their own unique timings for the various dst modes, we must snapshot
     * nStepCycles before decoding the mode, and then use that to update nStepCycles.
     */
    var data = this.popWord();
    var nSnapCycles = this.nStepCycles;
    this.writeWordToPrevSpace(opCode, PDP11.ACCESS.ISPACE, data);
    this.updateNZVFlags(data);
    this.nStepCycles = nSnapCycles - PDP11.MTP_CYCLES[this.dstMode];
};

/**
 * opMUL(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMUL = function(opCode)
{
    var src = this.readDstWord(opCode);
    var reg = (opCode >> 6) & 7;
    if (src & 0x8000) src |= ~0xffff;
    var dst = this.regsGen[reg];
    if (dst & 0x8000) dst |= ~0xffff;
    var result = ~~(src * dst);
    this.regsGen[reg] = (result >> 16) & 0xffff;
    this.regsGen[reg | 1] = result & 0xffff;
    this.updateMulFlags(result);
    this.nStepCycles -= (22 + 1);
};

/**
 * opNEG(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opNEG = function(opCode)
{
    this.updateDstWord(opCode, 0, PDP11.fnNEG);
    this.nStepCycles -= (this.dstMode? (10 + 1) : (5 + 1));
};

/**
 * opNEGB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opNEGB = function(opCode)
{
    this.updateDstByte(opCode, 0, PDP11.fnNEGB);
    this.nStepCycles -= (this.dstMode? (10 + 1) : (5 + 1));
};

/**
 * opNOP(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opNOP = function(opCode)
{
    this.nStepCycles -= (4 + 1);        // TODO: Review (this is just a guess based on CLC)
};

/**
 * opRESET(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opRESET = function(opCode)
{
    if (!(this.regPSW & PDP11.PSW.CMODE)) {
        this.resetRegs();
        this.bus.reset();
        // display.data = this.regsGen[0];  // TODO: Review
    }
    this.nStepCycles -= 667;                // TODO: Review (but it's definitely a big number)
};

/**
 * opROL(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opROL = function(opCode)
{
    this.updateDstWord(opCode, 0, PDP11.fnROL);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opROLB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opROLB = function(opCode)
{
    this.updateDstByte(opCode, 0, PDP11.fnROLB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opROR(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opROR = function(opCode)
{
    this.updateDstWord(opCode, 0, PDP11.fnROR);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opRORB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opRORB = function(opCode)
{
    this.updateDstByte(opCode, 0, PDP11.fnRORB);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.dstAddr & 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opRTI(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opRTI = function(opCode)
{
    this.trapReturn();
    /*
     * Unlike RTT, RTI enables immediate trace
     */
    this.opFlags |= (this.regPSW & PDP11.PSW.TF);
    this.nStepCycles -= (10 + 3);
};

/**
 * opRTS(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opRTS = function(opCode)
{
    if (opCode & 0x08) {
        PDP11.opUndefined.call(this, opCode);
        return;
    }
    var src = this.popWord();
    var reg = opCode & PDP11.OPREG.MASK;
    this.setPC(this.regsGen[reg]);
    this.regsGen[reg] = src;
    this.nStepCycles -= (7 + 2);
};

/**
 * opRTT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opRTT = function(opCode)
{
    this.trapReturn();
    this.nStepCycles -= (10 + 3);
};

/**
 * opSBC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSBC = function(opCode)
{
    this.updateDstWord(opCode, this.getCF()? 1 : 0, PDP11.fnSUB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opSBCB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSBCB = function(opCode)
{
    this.updateDstByte(opCode, this.getCF()? 1 : 0, PDP11.fnSUBB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opSEC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSEC = function(opCode)
{
    this.setCF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opSEN(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSEN = function(opCode)
{
    this.setNF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opSEV(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSEV = function(opCode)
{
    this.setVF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opSEZ(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSEZ = function(opCode)
{
    this.setZF();
    this.nStepCycles -= (4 + 1);
};

/**
 * opSEx(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSEx = function(opCode)
{
    if (opCode & 0x1) this.setCF();
    if (opCode & 0x2) this.setVF();
    if (opCode & 0x4) this.setZF();
    if (opCode & 0x8) this.setNF();
    /*
     * TODO: Review whether this class of undocumented instructions really has a constant cycle time.
     */
    this.nStepCycles -= (4 + 1);
};

/**
 * opSOB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode (077Rnn)
 */
PDP11.opSOB = function(opCode)
{
    var reg = (opCode & PDP11.SRCMODE.REG) >> PDP11.SRCMODE.SHIFT;
    if ((this.regsGen[reg] = ((this.regsGen[reg] - 1) & 0xffff))) {
        this.setPC(this.getPC() - ((opCode & PDP11.DSTMODE.MASK) << 1));
        this.nStepCycles += 1;          // unlike normal branches, taking this branch is actually 1 cycle faster
    }
    this.nStepCycles -= (5 + 1);
};

/**
 * opSPL(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSPL = function(opCode)
{
    if (!(opCode & 0x08)) {
        PDP11.opUndefined.call(this, opCode);
        return;
    }
    if (!(this.regPSW & PDP11.PSW.CMODE)) {
        this.regPSW = (this.regPSW & ~(PDP11.PSW.UNUSED | PDP11.PSW.PRI)) | ((opCode & 0x7) << PDP11.PSW.SHIFT.PRI);
        this.opFlags |= PDP11.OPFLAG.INTQ_SPL;
    }
    this.nStepCycles -= (4 + 1);
};

/**
 * opSUB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSUB = function(opCode)
{
    this.updateDstWord(opCode, this.readSrcWord(opCode), PDP11.fnSUB);
    this.nStepCycles -= (this.dstMode? (8 + 1) + (this.srcReg && this.dstReg >= 6? 1 : 0) : (this.srcMode? (3 + 2) : (2 + 1)) + (this.dstReg == 7? 2 : 0));
};

/**
 * opSWAB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSWAB = function(opCode)
{
    this.updateDstWord(opCode, 0, PDP11.fnSWAB);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opSXT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSXT = function(opCode)
{
    this.updateNZVFlags(this.writeDstWord(opCode, this.getNF? 0xffff : 0));
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opTRAP(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opTRAP = function(opCode)
{
    this.trap(PDP11.TRAP.TRAP, PDP11.REASON.TRAP);
    this.nStepCycles -= (4 + 1);
};

/**
 * opTST(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opTST = function(opCode)
{
    var result = this.readDstWord(opCode);
    this.assert(!(result & ~0xffff));   // assert that C flag will be clear
    this.updateAllFlags(result);
    this.nStepCycles -= (this.dstMode? (3 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opTSTB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opTSTB = function(opCode)
{
    var result = this.readDstByte(opCode);
    this.assert(!(result & ~0xff));     // assert that C flag will be clear
    this.updateAllFlags(result << 8);
    this.nStepCycles -= (this.dstMode? (3 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opWAIT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opWAIT = function(opCode)
{
    /*
     * The original PDP-11 emulation code would actually stop emulating instructions now, relying on assorted
     * setTimeout() callbacks, setInterval() callbacks, device XHR (XMLHttpRequest) callbacks, etc, to eventually
     * call interrupt(), which would then transition the CPU's runState from 2 to 0 and kickstart emulate() again.
     *
     * That approach isn't compatible with PCjs emulators, which prefer to rely on the simulated CPU clock to
     * drive all simulated device updates.  This means components should call the CPU's setTimer() function, which
     * invokes the provided callback when the number of CPU cycles that correspond to the requested number of
     * milliseconds have elapsed.  This also gives us the ability to scale device response times as needed if the
     * user decides to crank up CPU speed, and to freeze them along with the CPU whenever the user halts the machine.
     *
     * However, the PCjs approach requires the CPU to continue running.  One simple solution to this dilemma:
     *
     *      1) opWAIT() sets a new opFlags bit (OPFLAG.WAIT)
     *      2) Rewind PC back to WAIT
     *      3) Whenever stepCPU() detects OPFLAG.WAIT, call checkInterruptQueue()
     *      4) If checkInterruptQueue() detects an interrupt, advance PC past WAIT before dispatching it
     *
     * Technically, the PC is already exactly where it's supposed to be, so why are we wasting time with steps
     * 2 and 4?  It's largely for the Debugger's sake, so that as long as execution is "blocked" by a WAIT, that's
     * what you'll see in the Debugger.  I could make those steps conditioned on the presence of the Debugger,
     * but I feel it's better to keep all code paths the same.
     *
     * NOTE: It's almost always a bad idea to add more checks to the inner stepCPU() loop, because every additional
     * check can have a measurable (negative) impact on performance.  Which is why it's important to use opFlags bits
     * whenever possible, since we can test for multiple (up to 32) exceptional conditions with a single check.
     */
    this.opFlags |= PDP11.OPFLAG.WAIT;
    this.advancePC(-2);
    this.nStepCycles -= 3;
};

/**
 * opXOR(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opXOR = function(opCode)
{
    this.updateDstWord(opCode, this.readSrcWord(opCode), PDP11.fnXOR);
    this.nStepCycles -= (this.dstMode? (8 + 1) : (2 + 1) + (this.dstReg == 7? 2 : 0));
};

/**
 * opUndefined(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opUndefined = function(opCode)
{
    this.trap(PDP11.TRAP.RESERVED, PDP11.REASON.RESERVED);
};

/**
 * op0Xnn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op0Xnn_1170 = function(opCode)
{
    PDP11.aOps0Xnn_1170[(opCode >> 8) & 0xf].call(this, opCode);
};

/**
 * op0AXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op0AXn_1170 = function(opCode)
{
    PDP11.aOps0AXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op0BXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op0BXn_1170 = function(opCode)
{
    PDP11.aOps0BXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op0CXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op0CXn_1170 = function(opCode)
{
    PDP11.aOps0CXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op0DXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op0DXn_1170 = function(opCode)
{
    PDP11.aOps0DXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op00Xn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op00Xn_1170 = function(opCode)
{
    PDP11.aOps00Xn_1170[(opCode >> 4) & 0xf].call(this, opCode);
};

/**
 * op008X_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op008X_1170 = function(opCode)
{
    PDP11.aOps00AX_1170[opCode & 0xf].call(this, opCode);
};

/**
 * op00AX_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op00AX_1170 = function(opCode)
{
    PDP11.aOps00AX_1170[opCode & 0xf].call(this, opCode);
};

/**
 * op00BX_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op00BX_1170 = function(opCode)
{
    PDP11.aOps00BX_1170[opCode & 0xf].call(this, opCode);
};

/**
 * op000X_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op000X_1170 = function(opCode)
{
    PDP11.aOps000X_1170[opCode & 0xf].call(this, opCode);
};

/**
 * op7Xnn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op7Xnn_1170 = function(opCode)
{
    PDP11.aOps7Xnn_1170[(opCode >> 8) & 0xf].call(this, opCode);
};

/**
 * op8Xnn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op8Xnn_1170 = function(opCode)
{
    PDP11.aOps8Xnn_1170[(opCode >> 8) & 0xf].call(this, opCode);
};

/**
 * op8AXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op8AXn_1170 = function(opCode)
{
    PDP11.aOps8AXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op8BXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op8BXn_1170 = function(opCode)
{
    PDP11.aOps8BXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op8CXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op8CXn_1170 = function(opCode)
{
    PDP11.aOps8CXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op8DXn_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op8DXn_1170 = function(opCode)
{
    PDP11.aOps8DXn_1170[(opCode >> 6) & 0x3].call(this, opCode);
};

/**
 * op1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op1170 = function(opCode)
{
    PDP11.aOpsXnnn_1170[opCode >> 12].call(this, opCode);
};

PDP11.aOpsXnnn_1170 = [
    PDP11.op0Xnn_1170,          // 0x0nnn
    PDP11.opMOV,                // 0x1nnn   01SSDD
    PDP11.opCMP,                // 0x2nnn   02SSDD
    PDP11.opBIT,                // 0x3nnn   03SSDD
    PDP11.opBIC,                // 0x4nnn   04SSDD
    PDP11.opBIS,                // 0x5nnn   05SSDD
    PDP11.opADD,                // 0x6nnn   06SSDD
    PDP11.op7Xnn_1170,          // 0x7nnn
    PDP11.op8Xnn_1170,          // 0x8nnn
    PDP11.opMOVB,               // 0x9nnn   11SSDD
    PDP11.opCMPB,               // 0xAnnn   12SSDD
    PDP11.opBITB,               // 0xBnnn   13SSDD
    PDP11.opBICB,               // 0xCnnn   14SSDD
    PDP11.opBISB,               // 0xDnnn   15SSDD
    PDP11.opSUB,                // 0xEnnn   16SSDD
    PDP11.opUndefined           // 0xFnnn
];

PDP11.aOps0Xnn_1170 = [
    PDP11.op00Xn_1170,          // 0x00nn
    PDP11.opBR,                 // 0x01nn
    PDP11.opBNE,                // 0x02nn
    PDP11.opBEQ,                // 0x03nn
    PDP11.opBGE,                // 0x04nn
    PDP11.opBLT,                // 0x05nn
    PDP11.opBGT,                // 0x06nn
    PDP11.opBLE,                // 0x07nn
    PDP11.opJSR,                // 0x08nn
    PDP11.opJSR,                // 0x09nn
    PDP11.op0AXn_1170,          // 0x0Ann
    PDP11.op0BXn_1170,          // 0x0Bnn
    PDP11.op0CXn_1170,          // 0x0Cnn
    PDP11.op0DXn_1170,          // 0x0Dnn
    PDP11.opUndefined,          // 0x0Enn
    PDP11.opUndefined           // 0x0Fnn
];

PDP11.aOps0AXn_1170 = [
    PDP11.opCLR,                // 0x0A0n
    PDP11.opCOM,                // 0x0A4n
    PDP11.opINC,                // 0x0A8n
    PDP11.opDEC                 // 0x0ACn
];

PDP11.aOps0BXn_1170 = [
    PDP11.opNEG,                // 0x0B0n
    PDP11.opADC,                // 0x0B4n
    PDP11.opSBC,                // 0x0B8n
    PDP11.opTST                 // 0x0BCn
];

PDP11.aOps0CXn_1170 = [
    PDP11.opROR,                // 0x0C0n
    PDP11.opROL,                // 0x0C4n
    PDP11.opASR,                // 0x0C8n
    PDP11.opASL                 // 0x0CCn
];

PDP11.aOps0DXn_1170 = [
    PDP11.opMARK,               // 0x0D0n
    PDP11.opMFPI,               // 0x0D4n
    PDP11.opMTPI,               // 0x0D8n
    PDP11.opSXT                 // 0x0DCn
];

PDP11.aOps00Xn_1170 = [
    PDP11.op000X_1170,          // 0x000n   000000-000017
    PDP11.opUndefined,          // 0x001n   000020-000037
    PDP11.opUndefined,          // 0x002n   000040-000057
    PDP11.opUndefined,          // 0x003n   000060-000077
    PDP11.opJMP,                // 0x004n   0001DD
    PDP11.opJMP,                // 0x005n   0001DD
    PDP11.opJMP,                // 0x006n   0001DD
    PDP11.opJMP,                // 0x007n   0001DD
    PDP11.opRTS,                // 0x008n   00020R (opRTS() will also confirm that bit 3 is clear)
    PDP11.opSPL,                // 0x009n   00023N (opSPL() will also confirm that bit 3 is set)
    PDP11.op00AX_1170,          // 0x00An   000240-000257
    PDP11.op00BX_1170,          // 0x00Bn   000260-000277
    PDP11.opSWAB,               // 0x00Cn   0003DD
    PDP11.opSWAB,               // 0x00Dn   0003DD
    PDP11.opSWAB,               // 0x00En   0003DD
    PDP11.opSWAB                // 0x00Fn   0003DD
];

PDP11.aOps000X_1170 = [
    PDP11.opHALT,               // 0x0000   000000
    PDP11.opWAIT,               // 0x0001   000001
    PDP11.opRTI,                // 0x0002   000002
    PDP11.opBPT,                // 0x0003   000003
    PDP11.opIOT,                // 0x0004   000004
    PDP11.opRESET,              // 0x0005   000005
    PDP11.opRTT,                // 0x0006   000006
    PDP11.opUndefined,          // 0x0007
    PDP11.opUndefined,          // 0x0008
    PDP11.opUndefined,          // 0x0009
    PDP11.opUndefined,          // 0x000A
    PDP11.opUndefined,          // 0x000B
    PDP11.opUndefined,          // 0x000C
    PDP11.opUndefined,          // 0x000D
    PDP11.opUndefined,          // 0x000E
    PDP11.opUndefined           // 0x000F
];

PDP11.aOps00AX_1170 = [
    PDP11.opNOP,                // 0x00A0   000240
    PDP11.opCLC,                // 0x00A1
    PDP11.opCLV,                // 0x00A2
    PDP11.opCLx,                // 0x00A3
    PDP11.opCLZ,                // 0x00A4
    PDP11.opCLx,                // 0x00A5
    PDP11.opCLx,                // 0x00A6
    PDP11.opCLx,                // 0x00A7
    PDP11.opCLN,                // 0x00A8
    PDP11.opCLx,                // 0x00A9
    PDP11.opCLx,                // 0x00AA
    PDP11.opCLx,                // 0x00AB
    PDP11.opCLx,                // 0x00AC
    PDP11.opCLx,                // 0x00AD
    PDP11.opCLx,                // 0x00AE
    PDP11.opCLx                 // 0x00AF   000257
];

PDP11.aOps00BX_1170 = [
    PDP11.opNOP,                // 0x00B0   000260
    PDP11.opSEC,                // 0x00B1
    PDP11.opSEV,                // 0x00B2
    PDP11.opSEx,                // 0x00B3
    PDP11.opSEZ,                // 0x00B4
    PDP11.opSEx,                // 0x00B5
    PDP11.opSEx,                // 0x00B6
    PDP11.opSEx,                // 0x00B7
    PDP11.opSEN,                // 0x00B8
    PDP11.opSEx,                // 0x00B9
    PDP11.opSEx,                // 0x00BA
    PDP11.opSEx,                // 0x00BB
    PDP11.opSEx,                // 0x00BC
    PDP11.opSEx,                // 0x00BD
    PDP11.opSEx,                // 0x00BE
    PDP11.opSEx                 // 0x00BF   000277
];

PDP11.aOps7Xnn_1170 = [
    PDP11.opMUL,                // 0x70nn
    PDP11.opMUL,                // 0x71nn
    PDP11.opDIV,                // 0x72nn
    PDP11.opDIV,                // 0x73nn
    PDP11.opASH,                // 0x74nn
    PDP11.opASH,                // 0x75nn
    PDP11.opASHC,               // 0x76nn
    PDP11.opASHC,               // 0x77nn
    PDP11.opXOR,                // 0x78nn
    PDP11.opXOR,                // 0x79nn
    PDP11.opUndefined,          // 0x7Ann
    PDP11.opUndefined,          // 0x7Bnn
    PDP11.opUndefined,          // 0x7Cnn
    PDP11.opUndefined,          // 0x7Dnn
    PDP11.opSOB,                // 0x7Enn
    PDP11.opSOB                 // 0x7Fnn
];

PDP11.aOps8Xnn_1170 = [
    PDP11.opBPL,                // 0x80nn
    PDP11.opBMI,                // 0x81nn
    PDP11.opBHI,                // 0x82nn
    PDP11.opBLOS,               // 0x83nn
    PDP11.opBVC,                // 0x84nn
    PDP11.opBVS,                // 0x85nn
    PDP11.opBCC,                // 0x86nn
    PDP11.opBCS,                // 0x87nn
    PDP11.opEMT,                // 0x88nn
    PDP11.opTRAP,               // 0x89nn
    PDP11.op8AXn_1170,          // 0x8Ann
    PDP11.op8BXn_1170,          // 0x8Bnn
    PDP11.op8CXn_1170,          // 0x8Cnn
    PDP11.op8DXn_1170,          // 0x8Dnn
    PDP11.opUndefined,          // 0x8Enn
    PDP11.opUndefined           // 0x8Fnn
];

PDP11.aOps8AXn_1170 = [
    PDP11.opCLRB,               // 0x8A0n
    PDP11.opCOMB,               // 0x8A4n
    PDP11.opINCB,               // 0x8A8n
    PDP11.opDECB                // 0x8ACn
];

PDP11.aOps8BXn_1170 = [
    PDP11.opNEGB,               // 0x8B0n
    PDP11.opADCB,               // 0x8B4n
    PDP11.opSBCB,               // 0x8B8n
    PDP11.opTSTB                // 0x8BCn
];

PDP11.aOps8CXn_1170 = [
    PDP11.opRORB,               // 0x8C0n
    PDP11.opROLB,               // 0x8C4n
    PDP11.opASRB,               // 0x8C8n
    PDP11.opASLB                // 0x8CCn
];

PDP11.aOps8DXn_1170 = [
    PDP11.opUndefined,          // 0x8D0n
    PDP11.opMFPD,               // 0x8D4n
    PDP11.opMTPD,               // 0x8D8n
    PDP11.opUndefined           // 0x8DCn
];
