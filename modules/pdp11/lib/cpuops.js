/**
 * @fileoverview Implements PDP11 opcode handlers.
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
    var PDP11         = require("./defines");
}

/**
 * fnADD(dst, src)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (src + dst)
 */
PDP11.fnADD = function(src, dst)
{
    var result = src + dst;
    this.updateAddFlags(result, src, dst);
    return result & 0xffff;
};

/**
 * fnBIC(dst, src)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (~src & dst)
 */
PDP11.fnBIC = function(src, dst)
{
    var result = ~src & dst;
    this.updateNZFlags(result);
    return result;
};

/**
 * fnBICB(dst, src)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (~src & dst)
 */
PDP11.fnBICB = function(src, dst)
{
    var result = ~src & dst;
    this.updateNZFlags(result << 8);
    return result;
};

/**
 * fnBIS(dst, src)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (src | dst)
 */
PDP11.fnBIS = function(src, dst)
{
    var result = src | dst;
    this.updateNZFlags(result);
    return result;
};

/**
 * fnBISB(dst, src)
 *
 * @this {CPUStatePDP11}
 * @param {number} src
 * @param {number} dst
 * @return {number} (src | dst)
 */
PDP11.fnBISB = function(src, dst)
{
    var result = src | dst;
    this.updateNZFlags(result << 8);
    return result;
};

/**
 * fnSUB(dst, src)
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
 * opADD(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opADD = function(opCode)
{
    this.updateWordByMode(opCode, this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT), PDP11.fnADD);
    this.nStepCycles -= 1;
};

/**
 * opBIC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBIC = function(opCode)
{
    this.updateWordByMode(opCode, this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT), PDP11.fnBIC);
    this.nStepCycles -= 1;
};

/**
 * opBICB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBICB = function(opCode)
{
    this.updateByteByMode(opCode, this.readByteByMode(opCode >> PDP11.SRCMODE.SHIFT), PDP11.fnBICB);
    this.nStepCycles -= 1;
};

/**
 * opBIS(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBIS = function(opCode)
{
    this.updateWordByMode(opCode, this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT), PDP11.fnBIS);
    this.nStepCycles -= 1;
};

/**
 * opBISB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBISB = function(opCode)
{
    this.updateByteByMode(opCode, this.readByteByMode(opCode >> PDP11.SRCMODE.SHIFT), PDP11.fnBISB);
    this.nStepCycles -= 1;
};

/**
 * opBIT(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBIT = function(opCode)
{
    this.updateNZFlags(this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT) & this.readWordByMode(opCode));
    this.nStepCycles -= 1;
};

/**
 * opBITB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBITB = function(opCode)
{
    this.updateNZFlags((this.readByteByMode(opCode >> PDP11.SRCMODE.SHIFT) & this.readByteByMode(opCode)) << 8);
    this.nStepCycles -= 1;
};

/**
 * opCMP(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCMP = function(opCode)
{
    var src = this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT);
    var dst = this.readWordByMode(opCode);
    var result = src - dst;
    /*
     * NOTE: CMP calculates (src - dst) rather than (dst - src), so when we call updateSubFlags(),
     * we must reverse the order of the src and dst parameters.
     */
    this.updateSubFlags(result, dst, src);
    this.nStepCycles -= 1;
};

/**
 * opCMPB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opCMPB = function(opCode)
{
    var src = this.readByteByMode(opCode >> PDP11.SRCMODE.SHIFT) << 8;
    var dst = this.readByteByMode(opCode) << 8;
    var result = src - dst;
    /*
     * NOTE: CMP calculates (src - dst) rather than (dst - src), so when we call updateSubFlags(),
     * we must reverse the order of the src and dst parameters.
     */
    this.updateSubFlags(result, dst, src);
    this.nStepCycles -= 1;
};

/**
 * opMOV(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMOV = function(opCode)
{
    this.updateNZFlags(this.writeWordByMode(opCode, this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT)));
    this.nStepCycles -= 1;
};

/**
 * opMOVB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opMOVB = function(opCode)
{
    var data = this.readByteByMode(opCode >> PDP11.SRCMODE.SHIFT);
    /*
     * When dst is a register, data must be sign-extended; otherwise, sign-extension is unnecessary (but harmless).
     */
    this.updateNZFlags(this.writeByteByMode(opCode, (data & 0x80)? data | 0xff00 : data) << 8);
    this.nStepCycles -= 1;
};

/**
 * opNOP(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opNOP = function(opCode)
{
    this.nStepCycles -= 1;
};

/**
 * opSUB(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opSUB = function(opCode)
{
    this.updateWordByMode(opCode, this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT), PDP11.fnSUB);
    this.nStepCycles -= 1;
};

/**
 * op1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op1170 = function(opCode)
{
    PDP11.aOpsF000_1170[opCode >> 12].call(this, opCode);
};

/**
 * op0XXX_1170(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.op0XXX_1170 = function(opCode)
{
    // PDP11.aOpsF000_1170[opCode >> 12].call(this, opCode);
};

PDP11.aOpsF000_1170 = [
    PDP11.op0XXX_1170,
    PDP11.opMOV,                // MOV  01SSDD
    PDP11.opCMP,                // CMP  02SSDD
    PDP11.opBIT,                // BIT  03SSDD
    PDP11.opBIC,                // BIC  04SSDD
    PDP11.opBIS,                // BIS  05SSDD
    PDP11.opADD,                // ADD  06SSDD
    PDP11.opNOP,                // 0x7XXX
    PDP11.opNOP,                // 0x8XXX
    PDP11.opMOVB,               // MOVB 11SSDD
    PDP11.opCMPB,               // CMPB 12SSDD
    PDP11.opBITB,               // BITB 13SSDD
    PDP11.opBICB,               // BICB 14SSDD
    PDP11.opBISB,               // BISB 15SSDD
    PDP11.opSUB,                // SUB  16SSDD
    PDP11.opNOP                 // 0xFXXX
];
