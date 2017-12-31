/**
 * @fileoverview Implements PC6502 opcode handlers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
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
    var str         = require("../../shared/lib/strlib");
    var Messages    = require("./messages");
    var CPUDef      = require("./CPUDef");
}

/**
 * @this {CPUState}
 */
CPUDef.opBRK = function()
{   // opcode 0x00
    // PC++;
    this.regPC++;
    // STACK(S--) = PCH;
    this.abMem[this.regS--] = (this.regPC >> 8);
    this.regS |= 0x100;
    // STACK(S--) = PCL;
    this.abMem[this.regS--] = (this.regPC & 0xff);
    this.regS |= 0x100;
    // B = 1;
    this.regP |= 0x10;
    // C = LAZY_C; Z = LAZY_Z; V = LAZY_V; N = LAZY_N;
    this.regP = this.getRegP();
    // STACK(S--) = P;
    this.abMem[this.regS--] = this.regP;
    this.regS |= 0x100;
    // B = 0;
    this.regP &= 0xef;
    // EA = 0xFFFE;
    this.regEA = 0xFFFE;
    // PC = M;
    this.regPC = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
};

/**
 * @this {CPUState}
 */
CPUDef.opORAindx = function()
{   // opcode 0x01
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA |= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opORAzp = function()
{   // opcode 0x05
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA |= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opASLzp = function()
{   // opcode 0x06
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // RC = ML << 1;
    this.regRC = this.abMem[this.regEAWrite] << 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opPHP = function()
{   // opcode 0x08
    this.regP = this.getRegP();
    // STACK(S--) = P;
    this.abMem[this.regS--] = this.regP;
    this.regS |= 0x100;
};

/**
 * @this {CPUState}
 */
CPUDef.opORAimm = function()
{   // opcode 0x09
    // EA = PC++;
    this.regEA = this.regPC++;
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA |= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opASLacc = function()
{   // opcode 0x0a
    // RC = A << 1;
    this.regRC = this.regA << 1;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opORAabs = function()
{   // opcode 0x0d
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA |= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opASLabs = function()
{   // opcode 0x0e
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RC = ML << 1;
    this.regRC = this.abMem[this.regEAWrite] << 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opBPL = function()
{   // opcode 0x10
    // PC = PC + (LAZY_N == 0? SBYTE(PC) : 0) + 1;
    this.regPC += (!(this.regRN & 0x80)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opORAindy = function()
{   // opcode 0x11
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA |= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opORAzpx = function()
{   // opcode 0x15
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA |= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opASLzpx = function()
{   // opcode 0x16
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // RC = ML << 1;
    this.regRC = this.abMem[this.regEAWrite] << 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opCLC = function()
{   // opcode 0x18
    // SET_LAZY_C(0);
    this.regRC = 0x00;
};

/**
 * @this {CPUState}
 */
CPUDef.opORAabsy = function()
{   // opcode 0x19
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA |= this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opORAabsx = function()
{   // opcode 0x1d
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // A = A | ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA |= this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opASLabsx = function()
{   // opcode 0x1e
    // EA = WORD(PC)+X; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // RC = ML << 1;
    this.regRC = this.abMem[this.regEAWrite] << 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opJSRabs = function()
{   // opcode 0x20
    // EA = PC; PC += 1;
    this.regEA = this.regPC++;
    // STACK(S--) = PCH;
    this.abMem[this.regS--] = (this.regPC >> 8);
    this.regS |= 0x100;
    // STACK(S--) = PCL;
    this.abMem[this.regS--] = (this.regPC & 0xff);
    this.regS |= 0x100;
    // PC = M;
    this.regPC = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
};

/**
 * @this {CPUState}
 */
CPUDef.opANDindx = function()
{   // opcode 0x21
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opBITzp = function()
{   // opcode 0x24
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // SET_LAZY_Z((A & ML) == 0);
    this.regRZ = (this.regA & this.abMem[this.regEA]);
    // SET_LAZY_N(ML7);
    this.regRN = ((this.regRN & 0x7f) | (this.abMem[this.regEA] & 0x80));
    // SET_LAZY_V(ML6);
    this.regRV = 0; this.regRU = ((this.abMem[this.regEA] & 0x40)? 0x80 : 0x00);
};

/**
 * @this {CPUState}
 */
CPUDef.opANDzp = function()
{   // opcode 0x25
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opROLzp = function()
{   // opcode 0x26
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RC = RC << 1;
    this.regRC <<= 1;
    // RCL0 = RCH1;
    this.regRC = ((this.regRC & 0xfffe) | (((this.regRC & 0x0200))? 0x0001 : 0));
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opPLP = function()
{   // opcode 0x28
    // P = STACK(++S);
    this.regS = ((this.regS+1) & 0xff) | 0x100;
    this.regP = this.abMem[this.regS];
    // SET_LAZY_C(C);
    this.regRC = ((this.regP & 0x01)? 0x0100 : 0);
    // SET_LAZY_Z(Z);
    this.regRZ = (!(this.regP & 0x02)? 0x01 : 0);
    // SET_LAZY_N(N);
    this.regRN = (this.regP & 0x80);
    // SET_LAZY_V(V);
    this.regRV = 0; this.regRU = ((this.regP & 0x40)? 0x80 : 0x00);
};

/**
 * @this {CPUState}
 */
CPUDef.opANDimm = function()
{   // opcode 0x29
    // EA = PC++;
    this.regEA = this.regPC++;
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opROLacc = function()
{   // opcode 0x2a
    // RCL =  A;
    this.regRC = ((this.regRC & 0xff00) | this.regA);
    // RC = RC << 1;
    this.regRC <<= 1;
    // RCL0 = RCH1;
    this.regRC = ((this.regRC & 0xfffe) | ((this.regRC & 0x0200)? 0x0001 : 0));
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opBITabs = function()
{   // opcode 0x2c
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // SET_LAZY_Z((A & ML) == 0);
    this.regRZ = (this.regA & this.abMem[this.regEA]);
    // SET_LAZY_N(ML7);
    this.regRN = ((this.regRN & 0x7f) | (this.abMem[this.regEA] & 0x80));
    // SET_LAZY_V(ML6);
    this.regRV = 0; this.regRU = ((this.abMem[this.regEA] & 0x40)? 0x80 : 0x00);
};

/**
 * @this {CPUState}
 */
CPUDef.opANDabs = function()
{   // opcode 0x2d
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opROLabs = function()
{   // opcode 0x2e
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RC = RC << 1;
    this.regRC <<= 1;
    // RCL0 = RCH1;
    this.regRC = ((this.regRC & 0xfffe) | (((this.regRC & 0x0200))? 0x0001 : 0));
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opBMI = function()
{   // opcode 0x30
    // PC = PC + (LAZY_N != 0? SBYTE(PC) : 0) + 1;
    this.regPC += ((this.regRN & 0x80)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opANDindy = function()
{   // opcode 0x31
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opANDzpx = function()
{   // opcode 0x35
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opROLzpx = function()
{   // opcode 0x36
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RC = RC << 1;
    this.regRC <<= 1;
    // RCL0 = RCH1;
    this.regRC = ((this.regRC & 0xfffe) | (((this.regRC & 0x0200))? 0x0001 : 0));
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opSEC = function()
{   // opcode 0x38
    // SET_LAZY_C(1);
    this.regRC = 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opANDabsy = function()
{   // opcode 0x39
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opANDabsx = function()
{   // opcode 0x3d
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // A = A & ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA &= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opROLabsx = function()
{   // opcode 0x3e
    // EA = WORD(PC)+X; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RC = RC << 1;
    this.regRC <<= 1;
    // RCL0 = RCH1;
    this.regRC = ((this.regRC & 0xfffe) | (((this.regRC & 0x0200))? 0x0001 : 0));
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opRTI = function()
{   // opcode 0x40
    // P = STACK(++S);
    this.regS = ((this.regS+1) & 0xff) | 0x100;
    this.regP = this.abMem[this.regS];
    // SET_LAZY_C(C);
    this.regRC = ((this.regP & 0x01)? 0x0100 : 0);
    // SET_LAZY_Z(Z);
    this.regRZ = (!(this.regP & 0x02)? 0x01 : 0);
    // SET_LAZY_N(N);
    this.regRN = (this.regP & 0x80);
    // SET_LAZY_V(V);
    this.regRV = 0; this.regRU = ((this.regP & 0x40)? 0x80 : 0x00);
    // PCL = STACK(++S);
    // PCH = STACK(++S);
    this.regS = ((this.regS+2) & 0xff) | 0x100;
    this.regPC = (this.abMem[(this.regS-1) | 0x100]) | (this.abMem[this.regS] << 8);
};

/**
 * @this {CPUState}
 */
CPUDef.opEORindx = function()
{   // opcode 0x41
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // A = A ^ ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opEORzp = function()
{   // opcode 0x45
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // A = A ^ ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opLSRzp = function()
{   // opcode 0x46
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // SET_LAZY_C(ML0);
    this.regRC = ((this.regRC & 0xfeff) | ((this.abMem[this.regEAWrite] & 0x01)? 0x0100 : 0));
    // ML = RCL = ML >> 1;
    this.abMem[this.regEAWrite] = ((this.regRC = ((this.regRC & 0xff00) | (this.abMem[this.regEAWrite] >> 1))) & 0xff);
    // SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = (this.regRC & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opPHA = function()
{   // opcode 0x48
    // STACK(S--) = A;
    this.abMem[this.regS--] = this.regA;
    this.regS |= 0x100;
};

/**
 * @this {CPUState}
 */
CPUDef.opEORimm = function()
{   // opcode 0x49
    // EA = PC++;
    this.regEA = this.regPC++;
    // A = A ^ ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opLSRacc = function()
{   // opcode 0x4a
    // SET_LAZY_C( A0);
    this.regRC = ((this.regRC & 0xfeff) | ((this.regA & 0x01)? 0x0100 : 0));
    // A = RCL =  A >> 1;
    this.regA = ((this.regRC = ((this.regRC & 0xff00) | (this.regA >> 1))) & 0xff);
    // SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opJMPimm16 = function()
{   // opcode 0x4c
    // EA = PC;
    this.regEA = this.regPC;
    // PC += 2;
    // this.regPC += 2;
    // PC = M;
    this.regPC = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
};

/**
 * @this {CPUState}
 */
CPUDef.opEORabs = function()
{   // opcode 0x4d
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // A = A ^ ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opLSRabs = function()
{   // opcode 0x4e
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // SET_LAZY_C(ML0);
    this.regRC = ((this.regRC & 0xfeff) | ((this.abMem[this.regEAWrite] & 0x01)? 0x0100 : 0));
    // ML = RCL = ML >> 1;
    this.abMem[this.regEAWrite] = ((this.regRC = ((this.regRC & 0xff00) | (this.abMem[this.regEAWrite] >> 1))) & 0xff);
    // SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opBVC = function()
{   // opcode 0x50
    // PC = PC + (LAZY_V == 0? SBYTE(PC) : 0) + 1;
    this.regPC += (!((((this.regRV & 0xff) ^ this.regRU) ^ (this.regRV >> 1)) & 0x80)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opEORindy = function()
{   // opcode 0x51
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = this.abMem[this.regPC++];
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // A = A ^ ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opEORzpx = function()
{   // opcode 0x55
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // A = A ^ ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opLSRzpx = function()
{   // opcode 0x56
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // SET_LAZY_C(ML0);
    this.regRC = ((this.regRC & 0xfeff) | ((this.abMem[this.regEAWrite] & 0x01)? 0x0100 : 0));
    // ML = RCL = ML >> 1;
    this.abMem[this.regEAWrite] = ((this.regRC = ((this.regRC & 0xff00) | (this.abMem[this.regEAWrite] >> 1))) & 0xff);
    // SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = (this.regRC & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opCLI = function()
{   // opcode 0x58
    // I = 0;
    this.regP &= 0xfb;
};

/**
 * @this {CPUState}
 */
CPUDef.opEORabsy = function()
{   // opcode 0x59
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // A = A ^ ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opEORabsx = function()
{   // opcode 0x5d
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // A = A ^ ML; SET_LAZY_NZ(A)
    this.regRN = this.regRZ = (this.regA ^= this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opLSRabsx = function()
{   // opcode 0x5e
    // EA = WORD(PC)+X; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // SET_LAZY_C(ML0);
    this.regRC = ((this.regRC & 0xfeff) | ((this.abMem[this.regEAWrite] & 0x01)? 0x0100 : 0));
    // ML = RCL = ML >> 1;
    this.abMem[this.regEAWrite] = ((this.regRC = ((this.regRC & 0xff00) | (this.abMem[this.regEAWrite] >> 1))) & 0xff);
    // SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opRTS = function()
{   // opcode 0x60
    // PCL = STACK(++S);
    // PCH = STACK(++S);
    // PC++;
    this.regS = ((this.regS+2) & 0xff) | 0x100;
    this.regPC = (((this.abMem[(this.regS-1) | 0x100])) | ((this.abMem[this.regS]) << 8)) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opADCindx = function()
{   // opcode 0x61
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // RC = (A + ML + LAZY_C);
    this.regRC = (this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCindxBCD = function()
{   // opcode 0x61
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCzp = function()
{   // opcode 0x65
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // RC = (A + ML + LAZY_C);
    this.regRC = (this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCzpBCD = function()
{   // opcode 0x65
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opRORzp = function()
{   // opcode 0x66
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RCH1 = RCL0;
    this.regRC = ((this.regRC & 0xfdff) | ((this.regRC & 0x0001)? 0x0200 : 0));
    // RC = RC >> 1;
    this.regRC >>= 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opPLA = function()
{   // opcode 0x68
    // A = STACK(++S); SET_LAZY_NZ(A);
    this.regS = ((this.regS+1) & 0xff) | 0x100;
    this.regRN = this.regRZ = this.regA = this.abMem[this.regS];
};

/**
 * @this {CPUState}
 */
CPUDef.opADCimm = function()
{   // opcode 0x69
    // EA = PC++;
    this.regEA = this.regPC++;
    // RC = (A + ML + LAZY_C);
    this.regRC = (this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCimmBCD = function()
{   // opcode 0x69
    // EA = PC++;
    this.regEA = this.regPC++;
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opRORacc = function()
{   // opcode 0x6a
    // RCL =  A;
    this.regRC = ((this.regRC & 0xff00) | this.regA);
    // RCH1 = RCL0;
    this.regRC = ((this.regRC & 0xfdff) | ((this.regRC & 0x0001)? 0x0200 : 0));
    // RC = RC >> 1;
    this.regRC >>= 1;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 *
 * NOTE from Wikipedia: "The 6502's memory indirect jump instruction, JMP (<address>), is partially broken.
 * If <address> is hex xxFF (i.e., any word ending in FF), the processor will not jump to the address stored in xxFF and xxFF+1 as expected,
 * but rather the one defined by xxFF and xx00. This defect continued through the entire NMOS line, but was corrected in the CMOS derivatives."
 */
CPUDef.opJMPabs16 = function()
{   // opcode 0x6c
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // PC = M;
    this.regPC = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
};

/**
 * @this {CPUState}
 */
CPUDef.opADCabs = function()
{   // opcode 0x6d
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RC = (A + ML + LAZY_C);
    this.regRC =(this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCabsBCD = function()
{   // opcode 0x6d
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opRORabs = function()
{   // opcode 0x6e
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RCH1 = RCL0;
    this.regRC = ((this.regRC & 0xfdff) | ((this.regRC & 0x0001)? 0x0200 : 0));
    // RC = RC >> 1;
    this.regRC >>= 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opBVS = function()
{   // opcode 0x70
    // PC = PC + (LAZY_V != 0? SBYTE(PC) : 0) + 1;
    this.regPC += (((((this.regRV & 0xff) ^ this.regRU) ^ (this.regRV >> 1)) & 0x80)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opADCindy = function()
{   // opcode 0x71
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // RC = (A + ML + LAZY_C);
    this.regRC = (this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCindyBCD = function()
{   // opcode 0x71
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCzpx = function()
{   // opcode 0x75
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // RC = (A + ML + LAZY_C);
    this.regRC = (this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCzpxBCD = function()
{   // opcode 0x75
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opRORzpx = function()
{   // opcode 0x76
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RCH1 = RCL0;
    this.regRC = ((this.regRC & 0xfdff) | ((this.regRC & 0x0001)? 0x0200 : 0));
    // RC = RC >> 1;
    this.regRC >>= 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opSEI = function()
{   // opcode 0x78
    // I = 1;
    this.regP |= 0x04;
};

/**
 * @this {CPUState}
 */
CPUDef.opADCabsy = function()
{   // opcode 0x79
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // RC = (A + ML + LAZY_C);
    this.regRC = (this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCabsyBCD = function()
{   // opcode 0x79
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCabsx = function()
{   // opcode 0x7d
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // RC = (A + ML + LAZY_C);
    this.regRC = (this.regA + this.abMem[this.regEA] + ((this.regRC & 0x0100)? 1 : 0));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opADCabsxBCD = function()
{   // opcode 0x7d
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // A = this.addBCD(A,ML);
    this.regA = this.addBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opRORabsx = function()
{   // opcode 0x7e
    // EA = WORD(PC)+X; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // RCL = ML;
    this.regRC = ((this.regRC & 0xff00) | this.abMem[this.regEAWrite]);
    // RCH1 = RCL0;
    this.regRC = ((this.regRC & 0xfdff) | ((this.regRC & 0x0001)? 0x0200 : 0));
    // RC = RC >> 1;
    this.regRC >>= 1;
    // ML = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = (this.regRC & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTAindx = function()
{   // opcode 0x81
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEAWrite = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEAWrite = (this.abMem[this.regEAWrite] | (this.abMem[this.regEAWrite+1] << 8));
    // ML = A;
    this.abMem[this.regEAWrite] = this.regA;
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTYzp = function()
{   // opcode 0x84
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // ML = Y;
    this.abMem[this.regEAWrite] = this.regY;
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opSTAzp = function()
{   // opcode 0x85
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // ML = A;
    this.abMem[this.regEAWrite] = this.regA;
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opSTXzp = function()
{   // opcode 0x86
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // ML = X;
    this.abMem[this.regEAWrite] = this.regX;
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opDEY = function()
{   // opcode 0x88
    // Y = ((Y - 1) & 0xff);
    this.regY = ((this.regY - 1) & 0xff);
    // SET_LAZY_NZ(Y);
    this.regRN = this.regRZ = (this.regY);
};

/**
 * @this {CPUState}
 */
CPUDef.opTXA = function()
{   // opcode 0x8a
    // A = X; SET_LAZY_NZ(X);
    this.regRN = this.regRZ = this.regA = this.regX;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTYabs = function()
{   // opcode 0x8c
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // ML = Y;
    this.abMem[this.regEAWrite] = this.regY;
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTAabs = function()
{   // opcode 0x8d
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // ML = A;
    this.abMem[this.regEAWrite] = this.regA;
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTXabs = function()
{   // opcode 0x8e
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // ML = X;
    this.abMem[this.regEAWrite] = this.regX;
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opBCC = function()
{   // opcode 0x90
    // PC = PC + (LAZY_C == 0? SBYTE(PC) : 0) + 1;
    this.regPC += (!(this.regRC & 0x0100)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTAindy = function()
{   // opcode 0x91
    // EA = WORD(BYTE(PC++))+Y;
    this.regEAWrite = (this.abMem[this.regPC++]);
    this.regEAWrite = (this.abMem[this.regEAWrite] | (this.abMem[this.regEAWrite+1] << 8)) + this.regY;
    // ML = A;
    this.abMem[this.regEAWrite] = this.regA;
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTYzpx = function()
{   // opcode 0x94
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // ML = Y;
    this.abMem[this.regEAWrite] = this.regY;
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opSTAzpx = function()
{   // opcode 0x95
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // ML = A;
    this.abMem[this.regEAWrite] = this.regA;
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opSTXzpy = function()
{   // opcode 0x96
    // EA = (BYTE(PC++)+Y) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regY) & 0xff;
    // ML = X;
    this.abMem[this.regEAWrite] = this.regX;
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opTYA = function()
{   // opcode 0x98
    // A = Y; SET_LAZY_NZ(Y);
    this.regRN = this.regRZ = this.regA = this.regY;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTAabsy = function()
{   // opcode 0x99
    // EA = WORD(PC)+Y; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // ML = A;
    this.abMem[this.regEAWrite] = this.regA;
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opTXS = function()
{   // opcode 0x9a
    // S = X;
    this.regS = this.regX | 0x100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSTAabsx = function()
{   // opcode 0x9d
    // EA = WORD(PC)+X; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // ML = A;
    this.abMem[this.regEAWrite] = this.regA;
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opLDYimm = function()
{   // opcode 0xa0
    // EA = PC++;
    this.regEA = this.regPC++;
    // Y = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regY = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAindx = function()
{   // opcode 0xa1
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // A = ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDXimm = function()
{   // opcode 0xa2
    // EA = PC++;
    this.regEA = this.regPC++;
    // X = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regX = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDYzp = function()
{   // opcode 0xa4
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // Y = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regY = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAzp = function()
{   // opcode 0xa5
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // A = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDXzp = function()
{   // opcode 0xa6
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // X = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regX = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opTAY = function()
{   // opcode 0xa8
    // Y = A; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regY = this.regA;
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAimm = function()
{   // opcode 0xa9
    // EA = PC++;
    this.regEA = this.regPC++;
    // A = ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opTAX = function()
{   // opcode 0xaa
    // X = A; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regX = this.regA;
};

/**
 * @this {CPUState}
 */
CPUDef.opLDYabs = function()
{   // opcode 0xac
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // Y = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regY = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAabs = function()
{   // opcode 0xad
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // A = ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDXabs = function()
{   // opcode 0xae
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // X = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regX = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opBCS = function()
{   // opcode 0xb0
    // PC = PC + (LAZY_C != 0? SBYTE(PC) : 0) + 1;
    this.regPC += ((this.regRC & 0x0100)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAindy = function()
{   // opcode 0xb1
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // A = ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDYzpx = function()
{   // opcode 0xb4
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // Y = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regY = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAzpx = function()
{   // opcode 0xb5
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // A = ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDXzpy = function()
{   // opcode 0xb6
    // EA = (BYTE(PC++)+Y) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regY) & 0xff;
    // X = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regX = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opCLV = function()
{   // opcode 0xb8
    // SET_LAZY_V(0);
    this.regRV = 0; this.regRU = 0;
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAabsy = function()
{   // opcode 0xb9
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // A = ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opTSX = function()
{   // opcode 0xba
    // X = S; SET_LAZY_NZ(S);
    this.regRN = this.regRZ = this.regX = this.regS & 0xff;
};

/**
 * @this {CPUState}
 */
CPUDef.opLDYabsx = function()
{   // opcode 0xbc
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // Y = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regY = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDAabsx = function()
{   // opcode 0xbd
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // A = ML; SET_LAZY_NZ(A);
    this.regRN = this.regRZ = this.regA = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opLDXabsy = function()
{   // opcode 0xbe
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // X = ML; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.regX = this.abMem[this.regEA];
};

/**
 * @this {CPUState}
 */
CPUDef.opCPYimm = function()
{   // opcode 0xc0
    // EA = PC++;
    this.regEA = this.regPC++;
    // RC = Y - ML;
    this.regRC = this.regY - this.abMem[this.regEA];
    // SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = (this.regRC);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPindx = function()
{   // opcode 0xc1
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opCPYzp = function()
{   // opcode 0xc4
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // RC = Y - ML;
    this.regRC = this.regY - this.abMem[this.regEA];
    // SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = (this.regRC);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPzp = function()
{   // opcode 0xc5
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opDECzp = function()
{   // opcode 0xc6
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // ML = ML - 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] - 1) & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opINY = function()
{   // opcode 0xc8
    // Y = ((Y + 1) & 0xff);
    this.regY = ((this.regY + 1) & 0xff);
    // SET_LAZY_NZ(Y);
    this.regRN = this.regRZ = (this.regY);
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPimm = function()
{   // opcode 0xc9
    // EA = PC++;
    this.regEA = this.regPC++;
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opDEX = function()
{   // opcode 0xca
    // X = ((X - 1) & 0xff); SET_LAZY_NZ(X);
    this.regRN = this.regRZ = this.regX = ((this.regX - 1) & 0xff);
};

/**
 * @this {CPUState}
 */
CPUDef.opCPYabs = function()
{   // opcode 0xcc
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RC = Y - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = this.regY - this.abMem[this.regEA];
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPabs = function()
{   // opcode 0xcd
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opDECabs = function()
{   // opcode 0xce
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // ML = ML - 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] - 1) & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opBNE = function()
{   // opcode 0xd0
    // PC = PC + (LAZY_Z == 0? SBYTE(PC) : 0) + 1;
    this.regPC += ((this.regRZ & 0xff)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPindy = function()
{   // opcode 0xd1
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPzpx = function()
{   // opcode 0xd5
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opDECzpx = function()
{   // opcode 0xd6
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // ML = ML - 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] - 1) & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opCLD = function()
{   // opcode 0xd8
    // D = 0;
    this.clearBCD();
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPabsy = function()
{   // opcode 0xd9
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opCMPabsx = function()
{   // opcode 0xdd
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // RC = A - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = (this.regA - this.abMem[this.regEA]);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opDECabsx = function()
{   // opcode 0xde
    // EA = WORD(PC)+X; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // ML = ML - 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] - 1) & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opCPXimm = function()
{   // opcode 0xe0
    // EA = PC++;
    this.regEA = this.regPC++;
    // RC = X - ML;
    this.regRC = this.regX - this.abMem[this.regEA];
    // SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = (this.regRC);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCindx = function()
{   // opcode 0xe1
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCindxBCD = function()
{   // opcode 0xe1
    // EA = WORD((BYTE(PC++)+X) & 0xff);
    this.regEA = ((this.abMem[this.regPC++]) + this.regX) & 0xff;
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8));
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opCPXzp = function()
{   // opcode 0xe4
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // RC = X - ML;
    this.regRC = this.regX - this.abMem[this.regEA];
    // SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = (this.regRC);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCzp = function()
{   // opcode 0xe5
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCzpBCD = function()
{   // opcode 0xe5
    // EA = BYTE(PC++);
    this.regEA = this.abMem[this.regPC++];
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opINCzp = function()
{   // opcode 0xe6
    // EA = BYTE(PC++);
    this.regEAWrite = this.abMem[this.regPC++];
    // ML = ML + 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] + 1) & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opINX = function()
{   // opcode 0xe8
    // X = ((X + 1) & 0xff);
    this.regX = ((this.regX + 1) & 0xff);
    // SET_LAZY_NZ(X);
    this.regRN = this.regRZ = (this.regX);
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCimm = function()
{   // opcode 0xe9
    // EA = PC++;
    this.regEA = this.regPC++;
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCimmBCD = function()
{   // opcode 0xe9
    // EA = PC++;
    this.regEA = this.regPC++;
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opNOP = function()
{   // opcode 0xea
    //
};

/**
 * @this {CPUState}
 */
CPUDef.opCPXabs = function()
{   // opcode 0xec
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RC = X - ML; SET_LAZY_NZ(RC);
    this.regRN = this.regRZ = this.regRC = this.regX - this.abMem[this.regEA];
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCabs = function()
{   // opcode 0xed
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCabsBCD = function()
{   // opcode 0xed
    // EA = WORD(PC); PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opINCabs = function()
{   // opcode 0xee
    // EA = WORD(PC); PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
    // ML = ML + 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] + 1) & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opBEQ = function()
{   // opcode 0xf0
    // PC = PC + (LAZY_Z == 1? SBYTE(PC) : 0) + 1;
    this.regPC += (!(this.regRZ & 0xff)? (this.nStepCycles--,((this.abMem[this.regPC] << 24) >> 24)) : 0) + 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCindy = function()
{   // opcode 0xf1
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCindyBCD = function()
{   // opcode 0xf1
    // EA = WORD(BYTE(PC++))+Y;
    this.regEA = (this.abMem[this.regPC++]);
    this.regEA = (this.abMem[this.regEA] | (this.abMem[this.regEA+1] << 8)) + this.regY;
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCzpx = function()
{   // opcode 0xf5
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCzpxBCD = function()
{   // opcode 0xf5
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEA = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opINCzpx = function()
{   // opcode 0xf6
    // EA = (BYTE(PC++)+X) & 0xff;
    this.regEAWrite = (this.abMem[this.regPC++]+this.regX) & 0xff;
    // ML = ML + 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] + 1) & 0xff);
    // W = 1;
    // NOTE: Consider alternatives for tracking zero-page writes (eg, regEAWriteZP)
};

/**
 * @this {CPUState}
 */
CPUDef.opSED = function()
{   // opcode 0xf8
    // D = 1;
    this.setBCD();
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCabsy = function()
{   // opcode 0xf9
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCabsyBCD = function()
{   // opcode 0xf9
    // EA = WORD(PC)+Y; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regY;
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCabsx = function()
{   // opcode 0xfd
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // RC = (A - ML - !LAZY_C);
    this.regRC = (this.regA - this.abMem[this.regEA] - ((this.regRC & 0x0100)? 0 : 1));
    // SET_LAZY_OV(A,ML,RC);
    this.regRU = this.regA ^ this.abMem[this.regEA]; this.regRV = this.regRC;
    // A = RCL; SET_LAZY_NZ(RCL);
    this.regRN = this.regRZ = this.regA = (this.regRC & 0xff);
    // SET_LAZY_C(!LAZY_C);
    this.regRC ^= 0x0100;
};

/**
 * @this {CPUState}
 */
CPUDef.opSBCabsxBCD = function()
{   // opcode 0xfd
    // EA = WORD(PC)+X; PC += 2;
    this.regEA = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // A = this.subBCD(A,ML);
    this.regA = this.subBCD(this.regA, this.abMem[this.regEA]);
};

/**
 * @this {CPUState}
 */
CPUDef.opINCabsx = function()
{   // opcode 0xfe
    // EA = WORD(PC)+X; PC += 2;
    this.regEAWrite = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8)) + this.regX;
    // ML = ML + 1; SET_LAZY_NZ(ML);
    this.regRN = this.regRZ = this.abMem[this.regEAWrite] = ((this.abMem[this.regEAWrite] + 1) & 0xff);
    // W = 1;
};

/**
 * @this {CPUState}
 */
CPUDef.opSim = function()
{
    var addr;
    var bSimOp = this.abMem[this.regPC++];
    switch(bSimOp) {

        case this.SIMOP_HLT:
            this.println("HALT");
            this.halt();
            break;

        case this.SIMOP_MSG:
            addr = this.regPC;                  // currently we're using "inline" strings
            // addr = (this.abMem[this.regPC++] | (this.abMem[this.regPC++] << 8));
            var s = "";
            while (addr < this.abMem.length) {
                var b = this.abMem[addr++];
                if (!b) break;
                s += String.fromCharCode(b);
            }
            this.regPC = addr;                  // update regPC as long as we're doing "inline" strings
            /*
             * Before simply printing the string, what kinds of handy substitutions should we provide?
             *
             *      eg: %A for this.regA, %X for this.regX, etc
             */
            s = s.replace(/%A/g, str.toHex(this.regA, 2)).replace(/%X/g, str.toHex(this.regX, 2)).replace(/%Y/g, str.toHex(this.regY, 2));
            this.println(s);
            /*
             * To make printing "smoother", let's force a yield
             */
            this.yieldCPU();
            break;

        default:
            this.regPC -= 2;
            this.println("undefined opSim: " + str.toHexByte(bSimOp) + " at " + str.toHexWord(this.regPC));
            this.halt();
    }
};

/**
 * @this {CPUState}
 */
CPUDef.opUndefined = function()
{
    var b = this.abMem[--this.regPC];
    this.println("undefined opcode: " + str.toHexByte(b) + " at " + str.toHexWord(this.regPC));
    this.halt();
};
