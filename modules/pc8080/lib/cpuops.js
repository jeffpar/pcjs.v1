/**
 * @fileoverview Implements PC8080 opcode handlers.
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
    var CPUDef8080 = require("./CPUDef");
    var Messages8080 = require("./messages");
}

/**
 * op=0x00 (NOP)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opNOP = function()
{
    this.nStepCycles -= 4;
};

/**
 * op=0x01 (LXI B,d16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLXIB = function()
{
    this.setBC(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x02 (STAX B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSTAXB = function()
{
    this.setByte(this.getBC(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x03 (INX B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINXB = function()
{
    this.setBC(this.getBC() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x04 (INR B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRB = function()
{
    this.regB = this.incByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x05 (DCR B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRB = function()
{
    this.regB = this.decByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x06 (MVI B,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVIB = function()
{
    this.regB = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x07 (RLC)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRLC = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | (carry >> 8);
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x09 (DAD B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDADB = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getBC());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x0A (LDAX B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLDAXB = function()
{
    this.regA = this.getByte(this.getBC());
    this.nStepCycles -= 7;
};

/**
 * op=0x0B (DCX B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCXB = function()
{
    this.setBC(this.getBC() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x0C (INR C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRC = function()
{
    this.regC = this.incByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0D (DCR C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRC = function()
{
    this.regC = this.decByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0E (MVI C,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVIC = function()
{
    this.regC = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x0F (RRC)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRRC = function()
{
    var carry = (this.regA << 8) & 0x100;
    this.regA = (carry | this.regA) >> 1;
    this.updateCF(carry);
    this.nStepCycles -= 4;
};

/**
 * op=0x11 (LXI D,d16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLXID = function()
{
    this.setDE(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x12 (STAX D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSTAXD = function()
{
    this.setByte(this.getDE(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x13 (INX D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINXD = function()
{
    this.setDE(this.getDE() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x14 (INR D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRD = function()
{
    this.regD = this.incByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x15 (DCR D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRD = function()
{
    this.regD = this.decByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x16 (MVI D,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVID = function()
{
    this.regD = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x17 (RAL)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRAL = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | this.getCF();
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x19 (DAD D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDADD = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getDE());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x1A (LDAX D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLDAXD = function()
{
    this.regA = this.getByte(this.getDE());
    this.nStepCycles -= 7;
};

/**
 * op=0x1B (DCX D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCXD = function()
{
    this.setDE(this.getDE() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x1C (INR E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRE = function()
{
    this.regE = this.incByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1D (DCR E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRE = function()
{
    this.regE = this.decByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1E (MVI E,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVIE = function()
{
    this.regE = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x1F (RAR)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRAR = function()
{
    var carry = (this.regA << 8);
    this.regA = ((this.getCF() << 8) | this.regA) >> 1;
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x21 (LXI H,d16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLXIH = function()
{
    this.setHL(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x22 (SHLD a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSHLD = function()
{
    this.setWord(this.getPCWord(), this.getHL());
    this.nStepCycles -= 16;
};

/**
 * op=0x23 (INX H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINXH = function()
{
    this.setHL(this.getHL() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x24 (INR H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRH = function()
{
    this.regH = this.incByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x25 (DCR H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRH = function()
{
    this.regH = this.decByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x26 (MVI H,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVIH = function()
{
    this.regH = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x27 (DAA)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDAA = function()
{
    var src = 0;
    var CF = this.getCF();
    var AF = this.getAF();
    if (AF || (this.regA & 0x0F) > 9) {
        src |= 0x06;
    }
    if (CF || this.regA >= 0x9A) {
        src |= 0x60;
        CF = CPUDef8080.PS.CF;
    }
    this.regA = this.addByte(src);
    this.updateCF(CF? 0x100 : 0);
    this.nStepCycles -= 4;
};

/**
 * op=0x29 (DAD H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDADH = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getHL());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x2A (LHLD a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLHLD = function()
{
    this.setHL(this.getWord(this.getPCWord()));
    this.nStepCycles -= 16;
};

/**
 * op=0x2B (DCX H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCXH = function()
{
    this.setHL(this.getHL() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x2C (INR L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRL = function()
{
    this.regL = this.incByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2D (DCR L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRL = function()
{
    this.regL = this.decByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2E (MVI L,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVIL = function()
{
    this.regL = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x2F (CMA)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMA = function()
{
    this.regA = ~this.regA & 0xff;
    this.nStepCycles -= 4;
};

/**
 * op=0x31 (LXI SP,d16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLXISP = function()
{
    this.setSP(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x32 (STA a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSTA = function()
{
    this.setByte(this.getPCWord(), this.regA);
    this.nStepCycles -= 13;
};

/**
 * op=0x33 (INX SP)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINXSP = function()
{
    this.setSP(this.getSP() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x34 (INR M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRM = function()
{
    var addr = this.getHL();
    this.setByte(addr, this.incByte(this.getByte(addr)));
    this.nStepCycles -= 10;
};

/**
 * op=0x35 (DCR M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRM = function()
{
    var addr = this.getHL();
    this.setByte(addr, this.decByte(this.getByte(addr)));
    this.nStepCycles -= 10;
};

/**
 * op=0x36 (MVI M,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVIM = function()
{
    this.setByte(this.getHL(), this.getPCByte());
    this.nStepCycles -= 10;
};

/**
 * op=0x37 (STC)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSTC = function()
{
    this.setCF();
    this.nStepCycles -= 4;
};

/**
 * op=0x39 (DAD SP)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDADSP = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getSP());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x3A (LDA a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opLDA = function()
{
    this.regA = this.getByte(this.getPCWord());
    this.nStepCycles -= 13;
};

/**
 * op=0x3B (DCX SP)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCXSP = function()
{
    this.setSP(this.getSP() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x3C (INR A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opINRA = function()
{
    this.regA = this.incByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3D (DCR A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDCRA = function()
{
    this.regA = this.decByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3E (MVI A,d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMVIA = function()
{
    this.regA = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x3F (CMC)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMC = function()
{
    this.updateCF(this.getCF()? 0 : 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x40 (MOV B,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBB = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x41 (MOV B,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBC = function()
{
    this.regB = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x42 (MOV B,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBD = function()
{
    this.regB = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x43 (MOV B,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBE = function()
{
    this.regB = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x44 (MOV B,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBH = function()
{
    this.regB = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x45 (MOV B,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBL = function()
{
    this.regB = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x46 (MOV B,M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBM = function()
{
    this.regB = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x47 (MOV B,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVBA = function()
{
    this.regB = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x48 (MOV C,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCB = function()
{
    this.regC = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x49 (MOV C,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCC = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x4A (MOV C,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCD = function()
{
    this.regC = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x4B (MOV C,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCE = function()
{
    this.regC = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x4C (MOV C,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCH = function()
{
    this.regC = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x4D (MOV C,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCL = function()
{
    this.regC = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x4E (MOV C,M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCM = function()
{
    this.regC = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x4F (MOV C,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVCA = function()
{
    this.regC = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x50 (MOV D,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDB = function()
{
    this.regD = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x51 (MOV D,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDC = function()
{
    this.regD = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x52 (MOV D,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDD = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x53 (MOV D,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDE = function()
{
    this.regD = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x54 (MOV D,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDH = function()
{
    this.regD = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x55 (MOV D,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDL = function()
{
    this.regD = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x56 (MOV D,M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDM = function()
{
    this.regD = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x57 (MOV D,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVDA = function()
{
    this.regD = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x58 (MOV E,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVEB = function()
{
    this.regE = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x59 (MOV E,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVEC = function()
{
    this.regE = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x5A (MOV E,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVED = function()
{
    this.regE = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x5B (MOV E,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVEE = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x5C (MOV E,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVEH = function()
{
    this.regE = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x5D (MOV E,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVEL = function()
{
    this.regE = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x5E (MOV E,M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVEM = function()
{
    this.regE = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x5F (MOV E,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVEA = function()
{
    this.regE = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x60 (MOV H,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHB = function()
{
    this.regH = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x61 (MOV H,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHC = function()
{
    this.regH = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x62 (MOV H,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHD = function()
{
    this.regH = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x63 (MOV H,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHE = function()
{
    this.regH = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x64 (MOV H,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHH = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x65 (MOV H,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHL = function()
{
    this.regH = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x66 (MOV H,M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHM = function()
{
    this.regH = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x67 (MOV H,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVHA = function()
{
    this.regH = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x68 (MOV L,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLB = function()
{
    this.regL = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x69 (MOV L,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLC = function()
{
    this.regL = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x6A (MOV L,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLD = function()
{
    this.regL = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x6B (MOV L,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLE = function()
{
    this.regL = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x6C (MOV L,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLH = function()
{
    this.regL = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x6D (MOV L,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLL = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x6E (MOV L,M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLM = function()
{
    this.regL = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x6F (MOV L,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVLA = function()
{
    this.regL = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x70 (MOV M,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVMB = function()
{
    this.setByte(this.getHL(), this.regB);
    this.nStepCycles -= 7;
};

/**
 * op=0x71 (MOV M,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVMC = function()
{
    this.setByte(this.getHL(), this.regC);
    this.nStepCycles -= 7;
};

/**
 * op=0x72 (MOV M,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVMD = function()
{
    this.setByte(this.getHL(), this.regD);
    this.nStepCycles -= 7;
};

/**
 * op=0x73 (MOV M,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVME = function()
{
    this.setByte(this.getHL(), this.regE);
    this.nStepCycles -= 7;
};

/**
 * op=0x74 (MOV M,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVMH = function()
{
    this.setByte(this.getHL(), this.regH);
    this.nStepCycles -= 7;
};

/**
 * op=0x75 (MOV M,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVML = function()
{
    this.setByte(this.getHL(), this.regL);
    this.nStepCycles -= 7;
};

/**
 * op=0x76 (HLT)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opHLT = function()
{
    var addr = this.getPC() - 1;

    /*
     * If any HLT check functions are installed, call them, and if any of them return true, then
     * immediately stop HLT processing.
     */
    if (this.afnHalt.length) {
        for (var i = 0; i < this.afnHalt.length; i++) {
            if (this.afnHalt[i](addr)) return;
        }
    }

    this.nStepCycles -= 7;

    /*
     * The CPU is never REALLY halted by a HLT instruction; instead, we call requestHALT(), which
     * signals to stepCPU() that it should end the current burst AND that it should not execute any
     * more instructions until checkINTR() indicates a hardware interrupt has been requested.
     */
    this.requestHALT();

    /*
     * If a Debugger is present and the HALT message category is enabled, then we REALLY halt the CPU,
     * on the theory that whoever's using the Debugger would like to see HLTs.
     */
    if (DEBUGGER && this.dbg && this.messageEnabled(Messages8080.HALT)) {
        this.setPC(addr);               // this is purely for the Debugger's benefit, to show the HLT
        this.dbg.stopCPU();
        return;
    }

    /*
     * We also REALLY halt the machine if interrupts have been disabled, since that means it's dead
     * in the water (we have no NMI generation mechanism at the moment).
     */
    if (!this.getIF()) {
        if (DEBUGGER && this.dbg) this.setPC(addr);
        this.stopCPU();
    }
};

/**
 * op=0x77 (MOV M,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVMA = function()
{
    this.setByte(this.getHL(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x78 (MOV A,B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAB = function()
{
    this.regA = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x79 (MOV A,C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAC = function()
{
    this.regA = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x7A (MOV A,D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAD = function()
{
    this.regA = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x7B (MOV A,E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAE = function()
{
    this.regA = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x7C (MOV A,H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAH = function()
{
    this.regA = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x7D (MOV A,L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAL = function()
{
    this.regA = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x7E (MOV A,M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAM = function()
{
    this.regA = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x7F (MOV A,A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opMOVAA = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x80 (ADD B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDB = function()
{
    this.regA = this.addByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x81 (ADD C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDC = function()
{
    this.regA = this.addByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x82 (ADD D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDD = function()
{
    this.regA = this.addByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x83 (ADD E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDE = function()
{
    this.regA = this.addByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x84 (ADD H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDH = function()
{
    this.regA = this.addByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x85 (ADD L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDL = function()
{
    this.regA = this.addByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x86 (ADD M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDM = function()
{
    this.regA = this.addByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x87 (ADD A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADDA = function()
{
    this.regA = this.addByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x88 (ADC B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCB = function()
{
    this.regA = this.addByteCarry(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x89 (ADC C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCC = function()
{
    this.regA = this.addByteCarry(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x8A (ADC D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCD = function()
{
    this.regA = this.addByteCarry(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x8B (ADC E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCE = function()
{
    this.regA = this.addByteCarry(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x8C (ADC H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCH = function()
{
    this.regA = this.addByteCarry(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x8D (ADC L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCL = function()
{
    this.regA = this.addByteCarry(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x8E (ADC M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCM = function()
{
    this.regA = this.addByteCarry(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x8F (ADC A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADCA = function()
{
    this.regA = this.addByteCarry(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x90 (SUB B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBB = function()
{
    this.regA = this.subByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x91 (SUB C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBC = function()
{
    this.regA = this.subByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x92 (SUB D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBD = function()
{
    this.regA = this.subByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x93 (SUB E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBE = function()
{
    this.regA = this.subByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x94 (SUB H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBH = function()
{
    this.regA = this.subByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x95 (SUB L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBL = function()
{
    this.regA = this.subByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x96 (SUB M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBM = function()
{
    this.regA = this.subByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x97 (SUB A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUBA = function()
{
    this.regA = this.subByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x98 (SBB B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBB = function()
{
    this.regA = this.subByteBorrow(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x99 (SBB C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBC = function()
{
    this.regA = this.subByteBorrow(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x9A (SBB D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBD = function()
{
    this.regA = this.subByteBorrow(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x9B (SBB E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBE = function()
{
    this.regA = this.subByteBorrow(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x9C (SBB H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBH = function()
{
    this.regA = this.subByteBorrow(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x9D (SBB L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBL = function()
{
    this.regA = this.subByteBorrow(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x9E (SBB M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBM = function()
{
    this.regA = this.subByteBorrow(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x9F (SBB A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBBA = function()
{
    this.regA = this.subByteBorrow(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xA0 (ANA B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAB = function()
{
    this.regA = this.andByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xA1 (ANA C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAC = function()
{
    this.regA = this.andByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xA2 (ANA D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAD = function()
{
    this.regA = this.andByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xA3 (ANA E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAE = function()
{
    this.regA = this.andByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xA4 (ANA H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAH = function()
{
    this.regA = this.andByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xA5 (ANA L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAL = function()
{
    this.regA = this.andByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xA6 (ANA M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAM = function()
{
    this.regA = this.andByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xA7 (ANA A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANAA = function()
{
    this.regA = this.andByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xA8 (XRA B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAB = function()
{
    this.regA = this.xorByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xA9 (XRA C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAC = function()
{
    this.regA = this.xorByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xAA (XRA D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAD = function()
{
    this.regA = this.xorByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xAB (XRA E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAE = function()
{
    this.regA = this.xorByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xAC (XRA H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAH = function()
{
    this.regA = this.xorByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xAD (XRA L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAL = function()
{
    this.regA = this.xorByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xAE (XRA M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAM = function()
{
    this.regA = this.xorByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xAF (XRA A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRAA = function()
{
    this.regA = this.xorByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xB0 (ORA B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAB = function()
{
    this.regA = this.orByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xB1 (ORA C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAC = function()
{
    this.regA = this.orByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xB2 (ORA D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAD = function()
{
    this.regA = this.orByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xB3 (ORA E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAE = function()
{
    this.regA = this.orByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xB4 (ORA H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAH = function()
{
    this.regA = this.orByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xB5 (ORA L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAL = function()
{
    this.regA = this.orByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xB6 (ORA M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAM = function()
{
    this.regA = this.orByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xB7 (ORA A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORAA = function()
{
    this.regA = this.orByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xB8 (CMP B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPB = function()
{
    this.subByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xB9 (CMP C)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPC = function()
{
    this.subByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xBA (CMP D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPD = function()
{
    this.subByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xBB (CMP E)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPE = function()
{
    this.subByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xBC (CMP H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPH = function()
{
    this.subByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xBD (CMP L)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPL = function()
{
    this.subByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xBE (CMP M)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPM = function()
{
    this.subByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xBF (CMP A)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCMPA = function()
{
    this.subByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xC0 (RNZ)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRNZ = function()
{
    if (!this.getZF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xC1 (POP B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPOPB = function()
{
    this.setBC(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xC2 (JNZ a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJNZ = function()
{
    var w = this.getPCWord();
    if (!this.getZF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xC3 (JMP a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJMP = function()
{
    this.setPC(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xC4 (CNZ a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCNZ = function()
{
    var w = this.getPCWord();
    if (!this.getZF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xC5 (PUSH B)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPUSHB = function()
{
    this.pushWord(this.getBC());
    this.nStepCycles -= 11;
};

/**
 * op=0xC6 (ADI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opADI = function()
{
    this.regA = this.addByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xC7 (RST 0)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST0 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0);
    this.nStepCycles -= 11;
};

/**
 * op=0xC8 (RZ)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRZ = function()
{
    if (this.getZF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xC9 (RET)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRET = function()
{
    this.setPC(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xCA (JZ a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJZ = function()
{
    var w = this.getPCWord();
    if (this.getZF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xCC (CZ a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCZ = function()
{
    var w = this.getPCWord();
    if (this.getZF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xCD (CALL a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCALL = function()
{
    var w = this.getPCWord();
    this.pushWord(this.getPC());
    this.setPC(w);
    this.nStepCycles -= 17;
};

/**
 * op=0xCE (ACI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opACI = function()
{
    this.regA = this.addByteCarry(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xCF (RST 1)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST1 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x08);
    this.nStepCycles -= 11;
};

/**
 * op=0xD0 (RNC)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRNC = function()
{
    if (!this.getCF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xD1 (POP D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPOPD = function()
{
    this.setDE(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xD2 (JNC a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJNC = function()
{
    var w = this.getPCWord();
    if (!this.getCF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xD3 (OUT d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opOUT = function()
{
    var port = this.getPCByte();
    this.bus.checkPortOutputNotify(port, 1, this.regA, this.offPC(-2));
    this.nStepCycles -= 10;
};

/**
 * op=0xD4 (CNC a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCNC = function()
{
    var w = this.getPCWord();
    if (!this.getCF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xD5 (PUSH D)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPUSHD = function()
{
    this.pushWord(this.getDE());
    this.nStepCycles -= 11;
};

/**
 * op=0xD6 (SUI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSUI = function()
{
    this.regA = this.subByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xD7 (RST 2)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST2 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x10);
    this.nStepCycles -= 11;
};

/**
 * op=0xD8 (RC)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRC = function()
{
    if (this.getCF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xDA (JC a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJC = function()
{
    var w = this.getPCWord();
    if (this.getCF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xDB (IN d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opIN = function()
{
    var port = this.getPCByte();
    this.regA = this.bus.checkPortInputNotify(port, 1, this.offPC(-2)) & 0xff;
    this.nStepCycles -= 10;
};

/**
 * op=0xDC (CC a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCC = function()
{
    var w = this.getPCWord();
    if (this.getCF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xDE (SBI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSBI = function()
{
    this.regA = this.subByteBorrow(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xDF (RST 3)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST3 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x18);
    this.nStepCycles -= 11;
};

/**
 * op=0xE0 (RPO)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRPO = function()
{
    if (!this.getPF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xE1 (POP H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPOPH = function()
{
    this.setHL(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xE2 (JPO a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJPO = function()
{
    var w = this.getPCWord();
    if (!this.getPF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xE3 (XTHL)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXTHL = function()
{
    var w = this.popWord();
    this.pushWord(this.getHL());
    this.setHL(w);
    this.nStepCycles -= 18;
};

/**
 * op=0xE4 (CPO a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCPO = function()
{
    var w = this.getPCWord();
    if (!this.getPF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xE5 (PUSH H)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPUSHH = function()
{
    this.pushWord(this.getHL());
    this.nStepCycles -= 11;
};

/**
 * op=0xE6 (ANI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opANI = function()
{
    this.regA = this.andByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xE7 (RST 4)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST4 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x20);
    this.nStepCycles -= 11;
};

/**
 * op=0xE8 (RPE)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRPE = function()
{
    if (this.getPF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xE9 (PCHL)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPCHL = function()
{
    this.setPC(this.getHL());
    this.nStepCycles -= 5;
};

/**
 * op=0xEA (JPE a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJPE = function()
{
    var w = this.getPCWord();
    if (this.getPF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xEB (XCHG)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXCHG = function()
{
    var w = this.getHL();
    this.setHL(this.getDE());
    this.setDE(w);
    this.nStepCycles -= 5;
};

/**
 * op=0xEC (CPE a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCPE = function()
{
    var w = this.getPCWord();
    if (this.getPF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xEE (XRI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opXRI = function()
{
    this.regA = this.xorByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xEF (RST 5)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST5 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x28);
    this.nStepCycles -= 11;
};

/**
 * op=0xF0 (RP)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRP = function()
{
    if (!this.getSF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xF1 (POP PSW)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPOPSW = function()
{
    this.setPSW(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xF2 (JP a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJP = function()
{
    var w = this.getPCWord();
    if (!this.getSF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xF3 (DI)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opDI = function()
{
    this.clearIF();
    this.nStepCycles -= 4;
};

/**
 * op=0xF4 (CP a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCP = function()
{
    var w = this.getPCWord();
    if (!this.getSF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xF5 (PUSH PSW)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opPUPSW = function()
{
    this.pushWord(this.getPSW());
    this.nStepCycles -= 11;
};

/**
 * op=0xF6 (ORI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opORI = function()
{
    this.regA = this.orByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xF7 (RST 6)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST6 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x30);
    this.nStepCycles -= 11;
};

/**
 * op=0xF8 (RM)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRM = function()
{
    if (this.getSF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xF9 (SPHL)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opSPHL = function()
{
    this.setSP(this.getHL());
    this.nStepCycles -= 5;
};

/**
 * op=0xFA (JM a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opJM = function()
{
    var w = this.getPCWord();
    if (this.getSF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xFB (EI)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opEI = function()
{
    this.setIF();
    this.nStepCycles -= 4;
    this.checkINTR();
};

/**
 * op=0xFC (CM a16)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCM = function()
{
    var w = this.getPCWord();
    if (this.getSF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xFE (CPI d8)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opCPI = function()
{
    this.subByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xFF (RST 7)
 *
 * @this {CPUState8080}
 */
CPUDef8080.opRST7 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x38);
    this.nStepCycles -= 11;
};

/*
 * This 256-entry array of opcode functions is at the heart of the CPU engine: stepCPU(n).
 *
 * It might be worth trying a switch() statement instead, to see how the performance compares,
 * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
 * money on array lookup.
 */
CPUDef8080.aOps8080 = [
    /* 0x00-0x03 */ CPUDef8080.opNOP,   CPUDef8080.opLXIB,  CPUDef8080.opSTAXB, CPUDef8080.opINXB,
    /* 0x04-0x07 */ CPUDef8080.opINRB,  CPUDef8080.opDCRB,  CPUDef8080.opMVIB,  CPUDef8080.opRLC,
    /* 0x08-0x0B */ CPUDef8080.opNOP,   CPUDef8080.opDADB,  CPUDef8080.opLDAXB, CPUDef8080.opDCXB,
    /* 0x0C-0x0F */ CPUDef8080.opINRC,  CPUDef8080.opDCRC,  CPUDef8080.opMVIC,  CPUDef8080.opRRC,
    /* 0x10-0x13 */ CPUDef8080.opNOP,   CPUDef8080.opLXID,  CPUDef8080.opSTAXD, CPUDef8080.opINXD,
    /* 0x14-0x17 */ CPUDef8080.opINRD,  CPUDef8080.opDCRD,  CPUDef8080.opMVID,  CPUDef8080.opRAL,
    /* 0x18-0x1B */ CPUDef8080.opNOP,   CPUDef8080.opDADD,  CPUDef8080.opLDAXD, CPUDef8080.opDCXD,
    /* 0x1C-0x1F */ CPUDef8080.opINRE,  CPUDef8080.opDCRE,  CPUDef8080.opMVIE,  CPUDef8080.opRAR,
    /* 0x20-0x23 */ CPUDef8080.opNOP,   CPUDef8080.opLXIH,  CPUDef8080.opSHLD,  CPUDef8080.opINXH,
    /* 0x24-0x27 */ CPUDef8080.opINRH,  CPUDef8080.opDCRH,  CPUDef8080.opMVIH,  CPUDef8080.opDAA,
    /* 0x28-0x2B */ CPUDef8080.opNOP,   CPUDef8080.opDADH,  CPUDef8080.opLHLD,  CPUDef8080.opDCXH,
    /* 0x2C-0x2F */ CPUDef8080.opINRL,  CPUDef8080.opDCRL,  CPUDef8080.opMVIL,  CPUDef8080.opCMA,
    /* 0x30-0x33 */ CPUDef8080.opNOP,   CPUDef8080.opLXISP, CPUDef8080.opSTA,   CPUDef8080.opINXSP,
    /* 0x34-0x37 */ CPUDef8080.opINRM,  CPUDef8080.opDCRM,  CPUDef8080.opMVIM,  CPUDef8080.opSTC,
    /* 0x38-0x3B */ CPUDef8080.opNOP,   CPUDef8080.opDADSP, CPUDef8080.opLDA,   CPUDef8080.opDCXSP,
    /* 0x3C-0x3F */ CPUDef8080.opINRA,  CPUDef8080.opDCRA,  CPUDef8080.opMVIA,  CPUDef8080.opCMC,
    /* 0x40-0x43 */ CPUDef8080.opMOVBB, CPUDef8080.opMOVBC, CPUDef8080.opMOVBD, CPUDef8080.opMOVBE,
    /* 0x44-0x47 */ CPUDef8080.opMOVBH, CPUDef8080.opMOVBL, CPUDef8080.opMOVBM, CPUDef8080.opMOVBA,
    /* 0x48-0x4B */ CPUDef8080.opMOVCB, CPUDef8080.opMOVCC, CPUDef8080.opMOVCD, CPUDef8080.opMOVCE,
    /* 0x4C-0x4F */ CPUDef8080.opMOVCH, CPUDef8080.opMOVCL, CPUDef8080.opMOVCM, CPUDef8080.opMOVCA,
    /* 0x50-0x53 */ CPUDef8080.opMOVDB, CPUDef8080.opMOVDC, CPUDef8080.opMOVDD, CPUDef8080.opMOVDE,
    /* 0x54-0x57 */ CPUDef8080.opMOVDH, CPUDef8080.opMOVDL, CPUDef8080.opMOVDM, CPUDef8080.opMOVDA,
    /* 0x58-0x5B */ CPUDef8080.opMOVEB, CPUDef8080.opMOVEC, CPUDef8080.opMOVED, CPUDef8080.opMOVEE,
    /* 0x5C-0x5F */ CPUDef8080.opMOVEH, CPUDef8080.opMOVEL, CPUDef8080.opMOVEM, CPUDef8080.opMOVEA,
    /* 0x60-0x63 */ CPUDef8080.opMOVHB, CPUDef8080.opMOVHC, CPUDef8080.opMOVHD, CPUDef8080.opMOVHE,
    /* 0x64-0x67 */ CPUDef8080.opMOVHH, CPUDef8080.opMOVHL, CPUDef8080.opMOVHM, CPUDef8080.opMOVHA,
    /* 0x68-0x6B */ CPUDef8080.opMOVLB, CPUDef8080.opMOVLC, CPUDef8080.opMOVLD, CPUDef8080.opMOVLE,
    /* 0x6C-0x6F */ CPUDef8080.opMOVLH, CPUDef8080.opMOVLL, CPUDef8080.opMOVLM, CPUDef8080.opMOVLA,
    /* 0x70-0x73 */ CPUDef8080.opMOVMB, CPUDef8080.opMOVMC, CPUDef8080.opMOVMD, CPUDef8080.opMOVME,
    /* 0x74-0x77 */ CPUDef8080.opMOVMH, CPUDef8080.opMOVML, CPUDef8080.opHLT,   CPUDef8080.opMOVMA,
    /* 0x78-0x7B */ CPUDef8080.opMOVAB, CPUDef8080.opMOVAC, CPUDef8080.opMOVAD, CPUDef8080.opMOVAE,
    /* 0x7C-0x7F */ CPUDef8080.opMOVAH, CPUDef8080.opMOVAL, CPUDef8080.opMOVAM, CPUDef8080.opMOVAA,
    /* 0x80-0x83 */ CPUDef8080.opADDB,  CPUDef8080.opADDC,  CPUDef8080.opADDD,  CPUDef8080.opADDE,
    /* 0x84-0x87 */ CPUDef8080.opADDH,  CPUDef8080.opADDL,  CPUDef8080.opADDM,  CPUDef8080.opADDA,
    /* 0x88-0x8B */ CPUDef8080.opADCB,  CPUDef8080.opADCC,  CPUDef8080.opADCD,  CPUDef8080.opADCE,
    /* 0x8C-0x8F */ CPUDef8080.opADCH,  CPUDef8080.opADCL,  CPUDef8080.opADCM,  CPUDef8080.opADCA,
    /* 0x90-0x93 */ CPUDef8080.opSUBB,  CPUDef8080.opSUBC,  CPUDef8080.opSUBD,  CPUDef8080.opSUBE,
    /* 0x94-0x97 */ CPUDef8080.opSUBH,  CPUDef8080.opSUBL,  CPUDef8080.opSUBM,  CPUDef8080.opSUBA,
    /* 0x98-0x9B */ CPUDef8080.opSBBB,  CPUDef8080.opSBBC,  CPUDef8080.opSBBD,  CPUDef8080.opSBBE,
    /* 0x9C-0x9F */ CPUDef8080.opSBBH,  CPUDef8080.opSBBL,  CPUDef8080.opSBBM,  CPUDef8080.opSBBA,
    /* 0xA0-0xA3 */ CPUDef8080.opANAB,  CPUDef8080.opANAC,  CPUDef8080.opANAD,  CPUDef8080.opANAE,
    /* 0xA4-0xA7 */ CPUDef8080.opANAH,  CPUDef8080.opANAL,  CPUDef8080.opANAM,  CPUDef8080.opANAA,
    /* 0xA8-0xAB */ CPUDef8080.opXRAB,  CPUDef8080.opXRAC,  CPUDef8080.opXRAD,  CPUDef8080.opXRAE,
    /* 0xAC-0xAF */ CPUDef8080.opXRAH,  CPUDef8080.opXRAL,  CPUDef8080.opXRAM,  CPUDef8080.opXRAA,
    /* 0xB0-0xB3 */ CPUDef8080.opORAB,  CPUDef8080.opORAC,  CPUDef8080.opORAD,  CPUDef8080.opORAE,
    /* 0xB4-0xB7 */ CPUDef8080.opORAH,  CPUDef8080.opORAL,  CPUDef8080.opORAM,  CPUDef8080.opORAA,
    /* 0xB8-0xBB */ CPUDef8080.opCMPB,  CPUDef8080.opCMPC,  CPUDef8080.opCMPD,  CPUDef8080.opCMPE,
    /* 0xBC-0xBF */ CPUDef8080.opCMPH,  CPUDef8080.opCMPL,  CPUDef8080.opCMPM,  CPUDef8080.opCMPA,
    /* 0xC0-0xC3 */ CPUDef8080.opRNZ,   CPUDef8080.opPOPB,  CPUDef8080.opJNZ,   CPUDef8080.opJMP,
    /* 0xC4-0xC7 */ CPUDef8080.opCNZ,   CPUDef8080.opPUSHB, CPUDef8080.opADI,   CPUDef8080.opRST0,
    /* 0xC8-0xCB */ CPUDef8080.opRZ,    CPUDef8080.opRET,   CPUDef8080.opJZ,    CPUDef8080.opJMP,
    /* 0xCC-0xCF */ CPUDef8080.opCZ,    CPUDef8080.opCALL,  CPUDef8080.opACI,   CPUDef8080.opRST1,
    /* 0xD0-0xD3 */ CPUDef8080.opRNC,   CPUDef8080.opPOPD,  CPUDef8080.opJNC,   CPUDef8080.opOUT,
    /* 0xD4-0xD7 */ CPUDef8080.opCNC,   CPUDef8080.opPUSHD, CPUDef8080.opSUI,   CPUDef8080.opRST2,
    /* 0xD8-0xDB */ CPUDef8080.opRC,    CPUDef8080.opRET,   CPUDef8080.opJC,    CPUDef8080.opIN,
    /* 0xDC-0xDF */ CPUDef8080.opCC,    CPUDef8080.opCALL,  CPUDef8080.opSBI,   CPUDef8080.opRST3,
    /* 0xE0-0xE3 */ CPUDef8080.opRPO,   CPUDef8080.opPOPH,  CPUDef8080.opJPO,   CPUDef8080.opXTHL,
    /* 0xE4-0xE7 */ CPUDef8080.opCPO,   CPUDef8080.opPUSHH, CPUDef8080.opANI,   CPUDef8080.opRST4,
    /* 0xE8-0xEB */ CPUDef8080.opRPE,   CPUDef8080.opPCHL,  CPUDef8080.opJPE,   CPUDef8080.opXCHG,
    /* 0xEC-0xEF */ CPUDef8080.opCPE,   CPUDef8080.opCALL,  CPUDef8080.opXRI,   CPUDef8080.opRST5,
    /* 0xF0-0xF3 */ CPUDef8080.opRP,    CPUDef8080.opPOPSW, CPUDef8080.opJP,    CPUDef8080.opDI,
    /* 0xF4-0xF7 */ CPUDef8080.opCP,    CPUDef8080.opPUPSW, CPUDef8080.opORI,   CPUDef8080.opRST6,
    /* 0xF8-0xFB */ CPUDef8080.opRM,    CPUDef8080.opSPHL,  CPUDef8080.opJM,    CPUDef8080.opEI,
    /* 0xFC-0xFF */ CPUDef8080.opCM,    CPUDef8080.opCALL,  CPUDef8080.opCPI,   CPUDef8080.opRST7
];
