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
    var str           = require("../../shared/lib/strlib");
    var PDP11         = require("./defines");
    var MessagesPDP11 = require("./messages");
}

/**
 * fnBIC(dst, src)
 *
 * @param {number} src
 * @param {number} dst
 * @return {number} (~src & dst)
 */
PDP11.fnBIC = function(src, dst)
{
    return ~src & dst;
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
    this.updateAllFlags(result, src, dst);
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
 * opBIC(opCode)
 *
 * @this {CPUStatePDP11}
 * @param {number} opCode
 */
PDP11.opBIC = function(opCode)
{
    this.updateNZFlags(this.updateWordByMode(opCode, this.readWordByMode(opCode >> PDP11.SRCMODE.SHIFT), PDP11.fnBIC));
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

PDP11.aOpsF000_1170 = [
    PDP11.op0XXX_1170,
    PDP11.opMOV,                // MOV  01SSDD
    PDP11.opCMP,                // CMP  02SSDD
    PDP11.opBIT,                // BIT  03SSDD
    PDP11.opBIC,                // BIC  04SSDD
    PDP11.opNOP,                // 0x5XXX
    PDP11.opNOP,                // 0x6XXX
    PDP11.opNOP,                // 0x7XXX
    PDP11.opNOP,                // 0x8XXX
    PDP11.opNOP,                // 0x9XXX
    PDP11.opNOP,                // 0xAXXX
    PDP11.opNOP,                // 0xBXXX
    PDP11.opNOP,                // 0xCXXX
    PDP11.opNOP,                // 0xDXXX
    PDP11.opNOP,                // 0xEXXX
    PDP11.opNOP                 // 0xFXXX
];
