/**
 * @fileoverview Implements PC8080 opcode handlers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-20
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
    var CPUDef      = require("./CPUDef");
}

/**
 * op=0x00 (NOP)
 *
 * @this {CPUState}
 */
CPUDef.opNOP = function()
{
    this.nStepCycles -= 4;
};

/**
 * op=0x01 (LXI B,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXIB = function()
{
    this.setBC(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x02 (STAX B)
 *
 * @this {CPUState}
 */
CPUDef.opSTAXB = function()
{
    this.setByte(this.getBC(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x03 (INX B)
 *
 * @this {CPUState}
 */
CPUDef.opINXB = function()
{
    this.setBC(this.getBC() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x04 (INR B)
 *
 * @this {CPUState}
 */
CPUDef.opINRB = function()
{
    this.regB = this.incByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x05 (DCR B)
 *
 * @this {CPUState}
 */
CPUDef.opDCRB = function()
{
    this.regB = this.decByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x06 (MVI B,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIB = function()
{
    this.regB = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x07 (RLC)
 *
 * @this {CPUState}
 */
CPUDef.opRLC = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | (carry >> 8);
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x09 (DAD B)
 *
 * @this {CPUState}
 */
CPUDef.opDADB = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getBC());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x0A (LDAX B)
 *
 * @this {CPUState}
 */
CPUDef.opLDAXB = function()
{
    this.regA = this.getByte(this.getBC());
    this.nStepCycles -= 7;
};

/**
 * op=0x0B (DCX B)
 *
 * @this {CPUState}
 */
CPUDef.opDCXB = function()
{
    this.setBC(this.getBC() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x0C (INR C)
 *
 * @this {CPUState}
 */
CPUDef.opINRC = function()
{
    this.regC = this.incByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0D (DCR C)
 *
 * @this {CPUState}
 */
CPUDef.opDCRC = function()
{
    this.regC = this.decByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0E (MVI C,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIC = function()
{
    this.regC = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x0F (RRC)
 *
 * @this {CPUState}
 */
CPUDef.opRRC = function()
{
    var carry = (this.regA << 8) & 0x100;
    this.regA = (carry | this.regA) >> 1;
    this.updateCF(carry);
    this.nStepCycles -= 4;
};

/**
 * op=0x11 (LXI D,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXID = function()
{
    this.setDE(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x12 (STAX D)
 *
 * @this {CPUState}
 */
CPUDef.opSTAXD = function()
{
    this.setByte(this.getDE(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x13 (INX D)
 *
 * @this {CPUState}
 */
CPUDef.opINXD = function()
{
    this.setDE(this.getDE() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x14 (INR D)
 *
 * @this {CPUState}
 */
CPUDef.opINRD = function()
{
    this.regD = this.incByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x15 (DCR D)
 *
 * @this {CPUState}
 */
CPUDef.opDCRD = function()
{
    this.regD = this.decByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x16 (MVI D,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVID = function()
{
    this.regD = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x17 (RAL)
 *
 * @this {CPUState}
 */
CPUDef.opRAL = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | this.getCF();
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x19 (DAD D)
 *
 * @this {CPUState}
 */
CPUDef.opDADD = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getDE());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x1A (LDAX D)
 *
 * @this {CPUState}
 */
CPUDef.opLDAXD = function()
{
    this.regA = this.getByte(this.getDE());
    this.nStepCycles -= 7;
};

/**
 * op=0x1B (DCX D)
 *
 * @this {CPUState}
 */
CPUDef.opDCXD = function()
{
    this.setDE(this.getDE() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x1C (INR E)
 *
 * @this {CPUState}
 */
CPUDef.opINRE = function()
{
    this.regE = this.incByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1D (DCR E)
 *
 * @this {CPUState}
 */
CPUDef.opDCRE = function()
{
    this.regE = this.decByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1E (MVI E,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIE = function()
{
    this.regE = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x1F (RAR)
 *
 * @this {CPUState}
 */
CPUDef.opRAR = function()
{
    var carry = (this.regA << 8);
    this.regA = ((this.getCF() << 8) | this.regA) >> 1;
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x21 (LXI H,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXIH = function()
{
    this.setHL(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x22 (SHLD a16)
 *
 * @this {CPUState}
 */
CPUDef.opSHLD = function()
{
    this.setWord(this.getPCWord(), this.getHL());
    this.nStepCycles -= 16;
};

/**
 * op=0x23 (INX H)
 *
 * @this {CPUState}
 */
CPUDef.opINXH = function()
{
    this.setHL(this.getHL() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x24 (INR H)
 *
 * @this {CPUState}
 */
CPUDef.opINRH = function()
{
    this.regH = this.incByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x25 (DCR H)
 *
 * @this {CPUState}
 */
CPUDef.opDCRH = function()
{
    this.regH = this.decByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x26 (MVI H,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIH = function()
{
    this.regH = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x27 (DAA)
 *
 * @this {CPUState}
 */
CPUDef.opDAA = function()
{
    var src = 0;
    var CF = this.getCF();
    var AF = this.getAF();
    if (AF || (this.regA & 0x0F) > 9) {
        src |= 0x06;
    }
    if (CF || this.regA >= 0x9A) {
        src |= 0x60;
        CF = CPUDef.PS.CF;
    }
    this.regA = this.addByte(src);
    this.updateCF(CF? 0x100 : 0);
    this.nStepCycles -= 4;
};

/**
 * op=0x29 (DAD H)
 *
 * @this {CPUState}
 */
CPUDef.opDADH = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getHL());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x2A (LHLD a16)
 *
 * @this {CPUState}
 */
CPUDef.opLHLD = function()
{
    this.setHL(this.getWord(this.getPCWord()));
    this.nStepCycles -= 16;
};

/**
 * op=0x2B (DCX H)
 *
 * @this {CPUState}
 */
CPUDef.opDCXH = function()
{
    this.setHL(this.getHL() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x2C (INR L)
 *
 * @this {CPUState}
 */
CPUDef.opINRL = function()
{
    this.regL = this.incByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2D (DCR L)
 *
 * @this {CPUState}
 */
CPUDef.opDCRL = function()
{
    this.regL = this.decByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2E (MVI L,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIL = function()
{
    this.regL = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x2F (CMA)
 *
 * @this {CPUState}
 */
CPUDef.opCMA = function()
{
    this.regA = ~this.regA & 0xff;
    this.nStepCycles -= 4;
};

/**
 * op=0x31 (LXI SP,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXISP = function()
{
    this.setSP(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x32 (STA a16)
 *
 * @this {CPUState}
 */
CPUDef.opSTA = function()
{
    this.setByte(this.getPCWord(), this.regA);
    this.nStepCycles -= 13;
};

/**
 * op=0x33 (INX SP)
 *
 * @this {CPUState}
 */
CPUDef.opINXSP = function()
{
    this.setSP(this.getSP() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x34 (INR M)
 *
 * @this {CPUState}
 */
CPUDef.opINRM = function()
{
    var addr = this.getHL();
    this.setByte(addr, this.incByte(this.getByte(addr)));
    this.nStepCycles -= 10;
};

/**
 * op=0x35 (DCR M)
 *
 * @this {CPUState}
 */
CPUDef.opDCRM = function()
{
    var addr = this.getHL();
    this.setByte(addr, this.decByte(this.getByte(addr)));
    this.nStepCycles -= 10;
};

/**
 * op=0x36 (MVI M,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIM = function()
{
    this.setByte(this.getHL(), this.getPCByte());
    this.nStepCycles -= 10;
};

/**
 * op=0x37 (STC)
 *
 * @this {CPUState}
 */
CPUDef.opSTC = function()
{
    this.setCF();
    this.nStepCycles -= 4;
};

/**
 * op=0x39 (DAD SP)
 *
 * @this {CPUState}
 */
CPUDef.opDADSP = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getSP());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x3A (LDA a16)
 *
 * @this {CPUState}
 */
CPUDef.opLDA = function()
{
    this.regA = this.getByte(this.getPCWord());
    this.nStepCycles -= 13;
};

/**
 * op=0x3B (DCX SP)
 *
 * @this {CPUState}
 */
CPUDef.opDCXSP = function()
{
    this.setSP(this.getSP() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x3C (INR A)
 *
 * @this {CPUState}
 */
CPUDef.opINRA = function()
{
    this.regA = this.incByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3D (DCR A)
 *
 * @this {CPUState}
 */
CPUDef.opDCRA = function()
{
    this.regA = this.decByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3E (MVI A,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIA = function()
{
    this.regA = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x3F (CMC)
 *
 * @this {CPUState}
 */
CPUDef.opCMC = function()
{
    this.updateCF(this.getCF()? 0 : 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x40 (MOV B,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBB = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x41 (MOV B,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBC = function()
{
    this.regB = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x42 (MOV B,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBD = function()
{
    this.regB = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x43 (MOV B,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBE = function()
{
    this.regB = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x44 (MOV B,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBH = function()
{
    this.regB = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x45 (MOV B,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBL = function()
{
    this.regB = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x46 (MOV B,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBM = function()
{
    this.regB = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x47 (MOV B,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBA = function()
{
    this.regB = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x48 (MOV C,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCB = function()
{
    this.regC = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x49 (MOV C,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCC = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x4A (MOV C,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCD = function()
{
    this.regC = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x4B (MOV C,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCE = function()
{
    this.regC = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x4C (MOV C,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCH = function()
{
    this.regC = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x4D (MOV C,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCL = function()
{
    this.regC = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x4E (MOV C,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCM = function()
{
    this.regC = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x4F (MOV C,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCA = function()
{
    this.regC = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x50 (MOV D,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDB = function()
{
    this.regD = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x51 (MOV D,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDC = function()
{
    this.regD = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x52 (MOV D,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDD = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x53 (MOV D,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDE = function()
{
    this.regD = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x54 (MOV D,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDH = function()
{
    this.regD = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x55 (MOV D,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDL = function()
{
    this.regD = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x56 (MOV D,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDM = function()
{
    this.regD = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x57 (MOV D,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDA = function()
{
    this.regD = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x58 (MOV E,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEB = function()
{
    this.regE = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x59 (MOV E,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEC = function()
{
    this.regE = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x5A (MOV E,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVED = function()
{
    this.regE = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x5B (MOV E,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEE = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x5C (MOV E,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEH = function()
{
    this.regE = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x5D (MOV E,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEL = function()
{
    this.regE = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x5E (MOV E,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEM = function()
{
    this.regE = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x5F (MOV E,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEA = function()
{
    this.regE = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x60 (MOV H,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHB = function()
{
    this.regH = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x61 (MOV H,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHC = function()
{
    this.regH = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x62 (MOV H,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHD = function()
{
    this.regH = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x63 (MOV H,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHE = function()
{
    this.regH = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x64 (MOV H,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHH = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x65 (MOV H,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHL = function()
{
    this.regH = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x66 (MOV H,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHM = function()
{
    this.regH = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x67 (MOV H,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHA = function()
{
    this.regH = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x68 (MOV L,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLB = function()
{
    this.regL = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x69 (MOV L,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLC = function()
{
    this.regL = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x6A (MOV L,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLD = function()
{
    this.regL = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x6B (MOV L,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLE = function()
{
    this.regL = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x6C (MOV L,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLH = function()
{
    this.regL = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x6D (MOV L,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLL = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x6E (MOV L,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLM = function()
{
    this.regL = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x6F (MOV L,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLA = function()
{
    this.regL = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x70 (MOV M,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMB = function()
{
    this.setByte(this.getHL(), this.regB);
    this.nStepCycles -= 7;
};

/**
 * op=0x71 (MOV M,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMC = function()
{
    this.setByte(this.getHL(), this.regC);
    this.nStepCycles -= 7;
};

/**
 * op=0x72 (MOV M,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMD = function()
{
    this.setByte(this.getHL(), this.regD);
    this.nStepCycles -= 7;
};

/**
 * op=0x73 (MOV M,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVME = function()
{
    this.setByte(this.getHL(), this.regE);
    this.nStepCycles -= 7;
};

/**
 * op=0x74 (MOV M,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMH = function()
{
    this.setByte(this.getHL(), this.regH);
    this.nStepCycles -= 7;
};

/**
 * op=0x75 (MOV M,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVML = function()
{
    this.setByte(this.getHL(), this.regL);
    this.nStepCycles -= 7;
};

/**
 * op=0x76 (HLT)
 *
 * @this {CPUState}
 */
CPUDef.opHLT = function()
{
    /*
     * The CPU is never REALLY halted by a HLT instruction; instead, by setting X86.INTFLAG.HALT,
     * we are signalling to stepCPU() that it's free to end the current burst AND that it should not
     * execute any more instructions until checkINTR() indicates a hardware interrupt is requested.
     */
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

    this.intFlags |= CPUDef.INTFLAG.HALT;
    this.nStepCycles -= 7;

    /*
     * If a Debugger is present and the HALT message category is enabled, then we REALLY halt the CPU,
     * on the theory that whoever's using the Debugger would like to see HLTs.
     */
    if (DEBUGGER && this.dbg && this.messageEnabled(Messages.HALT)) {
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
 * @this {CPUState}
 */
CPUDef.opMOVMA = function()
{
    this.setByte(this.getHL(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x78 (MOV A,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAB = function()
{
    this.regA = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x79 (MOV A,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAC = function()
{
    this.regA = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x7A (MOV A,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAD = function()
{
    this.regA = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x7B (MOV A,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAE = function()
{
    this.regA = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x7C (MOV A,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAH = function()
{
    this.regA = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x7D (MOV A,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAL = function()
{
    this.regA = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x7E (MOV A,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAM = function()
{
    this.regA = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x7F (MOV A,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAA = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x80 (ADD B)
 *
 * @this {CPUState}
 */
CPUDef.opADDB = function()
{
    this.regA = this.addByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x81 (ADD C)
 *
 * @this {CPUState}
 */
CPUDef.opADDC = function()
{
    this.regA = this.addByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x82 (ADD D)
 *
 * @this {CPUState}
 */
CPUDef.opADDD = function()
{
    this.regA = this.addByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x83 (ADD E)
 *
 * @this {CPUState}
 */
CPUDef.opADDE = function()
{
    this.regA = this.addByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x84 (ADD H)
 *
 * @this {CPUState}
 */
CPUDef.opADDH = function()
{
    this.regA = this.addByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x85 (ADD L)
 *
 * @this {CPUState}
 */
CPUDef.opADDL = function()
{
    this.regA = this.addByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x86 (ADD M)
 *
 * @this {CPUState}
 */
CPUDef.opADDM = function()
{
    this.regA = this.addByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x87 (ADD A)
 *
 * @this {CPUState}
 */
CPUDef.opADDA = function()
{
    this.regA = this.addByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x88 (ADC B)
 *
 * @this {CPUState}
 */
CPUDef.opADCB = function()
{
    this.regA = this.addByteCarry(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x89 (ADC C)
 *
 * @this {CPUState}
 */
CPUDef.opADCC = function()
{
    this.regA = this.addByteCarry(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x8A (ADC D)
 *
 * @this {CPUState}
 */
CPUDef.opADCD = function()
{
    this.regA = this.addByteCarry(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x8B (ADC E)
 *
 * @this {CPUState}
 */
CPUDef.opADCE = function()
{
    this.regA = this.addByteCarry(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x8C (ADC H)
 *
 * @this {CPUState}
 */
CPUDef.opADCH = function()
{
    this.regA = this.addByteCarry(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x8D (ADC L)
 *
 * @this {CPUState}
 */
CPUDef.opADCL = function()
{
    this.regA = this.addByteCarry(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x8E (ADC M)
 *
 * @this {CPUState}
 */
CPUDef.opADCM = function()
{
    this.regA = this.addByteCarry(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x8F (ADC A)
 *
 * @this {CPUState}
 */
CPUDef.opADCA = function()
{
    this.regA = this.addByteCarry(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x90 (SUB B)
 *
 * @this {CPUState}
 */
CPUDef.opSUBB = function()
{
    this.regA = this.subByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x91 (SUB C)
 *
 * @this {CPUState}
 */
CPUDef.opSUBC = function()
{
    this.regA = this.subByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x92 (SUB D)
 *
 * @this {CPUState}
 */
CPUDef.opSUBD = function()
{
    this.regA = this.subByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x93 (SUB E)
 *
 * @this {CPUState}
 */
CPUDef.opSUBE = function()
{
    this.regA = this.subByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x94 (SUB H)
 *
 * @this {CPUState}
 */
CPUDef.opSUBH = function()
{
    this.regA = this.subByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x95 (SUB L)
 *
 * @this {CPUState}
 */
CPUDef.opSUBL = function()
{
    this.regA = this.subByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x96 (SUB M)
 *
 * @this {CPUState}
 */
CPUDef.opSUBM = function()
{
    this.regA = this.subByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x97 (SUB A)
 *
 * @this {CPUState}
 */
CPUDef.opSUBA = function()
{
    this.regA = this.subByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x98 (SBB B)
 *
 * @this {CPUState}
 */
CPUDef.opSBBB = function()
{
    this.regA = this.subByteBorrow(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x99 (SBB C)
 *
 * @this {CPUState}
 */
CPUDef.opSBBC = function()
{
    this.regA = this.subByteBorrow(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x9A (SBB D)
 *
 * @this {CPUState}
 */
CPUDef.opSBBD = function()
{
    this.regA = this.subByteBorrow(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x9B (SBB E)
 *
 * @this {CPUState}
 */
CPUDef.opSBBE = function()
{
    this.regA = this.subByteBorrow(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x9C (SBB H)
 *
 * @this {CPUState}
 */
CPUDef.opSBBH = function()
{
    this.regA = this.subByteBorrow(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x9D (SBB L)
 *
 * @this {CPUState}
 */
CPUDef.opSBBL = function()
{
    this.regA = this.subByteBorrow(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x9E (SBB M)
 *
 * @this {CPUState}
 */
CPUDef.opSBBM = function()
{
    this.regA = this.subByteBorrow(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x9F (SBB A)
 *
 * @this {CPUState}
 */
CPUDef.opSBBA = function()
{
    this.regA = this.subByteBorrow(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xA0 (ANA B)
 *
 * @this {CPUState}
 */
CPUDef.opANAB = function()
{
    this.regA = this.andByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xA1 (ANA C)
 *
 * @this {CPUState}
 */
CPUDef.opANAC = function()
{
    this.regA = this.andByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xA2 (ANA D)
 *
 * @this {CPUState}
 */
CPUDef.opANAD = function()
{
    this.regA = this.andByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xA3 (ANA E)
 *
 * @this {CPUState}
 */
CPUDef.opANAE = function()
{
    this.regA = this.andByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xA4 (ANA H)
 *
 * @this {CPUState}
 */
CPUDef.opANAH = function()
{
    this.regA = this.andByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xA5 (ANA L)
 *
 * @this {CPUState}
 */
CPUDef.opANAL = function()
{
    this.regA = this.andByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xA6 (ANA M)
 *
 * @this {CPUState}
 */
CPUDef.opANAM = function()
{
    this.regA = this.andByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xA7 (ANA A)
 *
 * @this {CPUState}
 */
CPUDef.opANAA = function()
{
    this.regA = this.andByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xA8 (XRA B)
 *
 * @this {CPUState}
 */
CPUDef.opXRAB = function()
{
    this.regA = this.xorByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xA9 (XRA C)
 *
 * @this {CPUState}
 */
CPUDef.opXRAC = function()
{
    this.regA = this.xorByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xAA (XRA D)
 *
 * @this {CPUState}
 */
CPUDef.opXRAD = function()
{
    this.regA = this.xorByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xAB (XRA E)
 *
 * @this {CPUState}
 */
CPUDef.opXRAE = function()
{
    this.regA = this.xorByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xAC (XRA H)
 *
 * @this {CPUState}
 */
CPUDef.opXRAH = function()
{
    this.regA = this.xorByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xAD (XRA L)
 *
 * @this {CPUState}
 */
CPUDef.opXRAL = function()
{
    this.regA = this.xorByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xAE (XRA M)
 *
 * @this {CPUState}
 */
CPUDef.opXRAM = function()
{
    this.regA = this.xorByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xAF (XRA A)
 *
 * @this {CPUState}
 */
CPUDef.opXRAA = function()
{
    this.regA = this.xorByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xB0 (ORA B)
 *
 * @this {CPUState}
 */
CPUDef.opORAB = function()
{
    this.regA = this.orByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xB1 (ORA C)
 *
 * @this {CPUState}
 */
CPUDef.opORAC = function()
{
    this.regA = this.orByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xB2 (ORA D)
 *
 * @this {CPUState}
 */
CPUDef.opORAD = function()
{
    this.regA = this.orByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xB3 (ORA E)
 *
 * @this {CPUState}
 */
CPUDef.opORAE = function()
{
    this.regA = this.orByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xB4 (ORA H)
 *
 * @this {CPUState}
 */
CPUDef.opORAH = function()
{
    this.regA = this.orByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xB5 (ORA L)
 *
 * @this {CPUState}
 */
CPUDef.opORAL = function()
{
    this.regA = this.orByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xB6 (ORA M)
 *
 * @this {CPUState}
 */
CPUDef.opORAM = function()
{
    this.regA = this.orByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xB7 (ORA A)
 *
 * @this {CPUState}
 */
CPUDef.opORAA = function()
{
    this.regA = this.orByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xB8 (CMP B)
 *
 * @this {CPUState}
 */
CPUDef.opCMPB = function()
{
    this.subByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xB9 (CMP C)
 *
 * @this {CPUState}
 */
CPUDef.opCMPC = function()
{
    this.subByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xBA (CMP D)
 *
 * @this {CPUState}
 */
CPUDef.opCMPD = function()
{
    this.subByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xBB (CMP E)
 *
 * @this {CPUState}
 */
CPUDef.opCMPE = function()
{
    this.subByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xBC (CMP H)
 *
 * @this {CPUState}
 */
CPUDef.opCMPH = function()
{
    this.subByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xBD (CMP L)
 *
 * @this {CPUState}
 */
CPUDef.opCMPL = function()
{
    this.subByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xBE (CMP M)
 *
 * @this {CPUState}
 */
CPUDef.opCMPM = function()
{
    this.subByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xBF (CMP A)
 *
 * @this {CPUState}
 */
CPUDef.opCMPA = function()
{
    this.subByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xC0 (RNZ)
 *
 * @this {CPUState}
 */
CPUDef.opRNZ = function()
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
 * @this {CPUState}
 */
CPUDef.opPOPB = function()
{
    this.setBC(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xC2 (JNZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opJNZ = function()
{
    var w = this.getPCWord();
    if (!this.getZF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xC3 (JMP a16)
 *
 * @this {CPUState}
 */
CPUDef.opJMP = function()
{
    this.setPC(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xC4 (CNZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opCNZ = function()
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
 * @this {CPUState}
 */
CPUDef.opPUSHB = function()
{
    this.pushWord(this.getBC());
    this.nStepCycles -= 11;
};

/**
 * op=0xC6 (ADI d8)
 *
 * @this {CPUState}
 */
CPUDef.opADI = function()
{
    this.regA = this.addByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xC7 (RST 0)
 *
 * @this {CPUState}
 */
CPUDef.opRST0 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0);
    this.nStepCycles -= 11;
};

/**
 * op=0xC8 (RZ)
 *
 * @this {CPUState}
 */
CPUDef.opRZ = function()
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
 * @this {CPUState}
 */
CPUDef.opRET = function()
{
    this.setPC(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xCA (JZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opJZ = function()
{
    var w = this.getPCWord();
    if (this.getZF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xCC (CZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opCZ = function()
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
 * @this {CPUState}
 */
CPUDef.opCALL = function()
{
    var w = this.getPCWord();
    this.pushWord(this.getPC());
    this.setPC(w);
    this.nStepCycles -= 17;
};

/**
 * op=0xCE (ACI d8)
 *
 * @this {CPUState}
 */
CPUDef.opACI = function()
{
    this.regA = this.addByteCarry(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xCF (RST 1)
 *
 * @this {CPUState}
 */
CPUDef.opRST1 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x08);
    this.nStepCycles -= 11;
};

/**
 * op=0xD0 (RNC)
 *
 * @this {CPUState}
 */
CPUDef.opRNC = function()
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
 * @this {CPUState}
 */
CPUDef.opPOPD = function()
{
    this.setDE(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xD2 (JNC a16)
 *
 * @this {CPUState}
 */
CPUDef.opJNC = function()
{
    var w = this.getPCWord();
    if (!this.getCF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xD3 (OUT d8)
 *
 * @this {CPUState}
 */
CPUDef.opOUT = function()
{
    var port = this.getPCByte();
    this.bus.checkPortOutputNotify(port, 1, this.regA, this.offPC(-2));
    this.nStepCycles -= 10;
};

/**
 * op=0xD4 (CNC a16)
 *
 * @this {CPUState}
 */
CPUDef.opCNC = function()
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
 * @this {CPUState}
 */
CPUDef.opPUSHD = function()
{
    this.pushWord(this.getDE());
    this.nStepCycles -= 11;
};

/**
 * op=0xD6 (SUI d8)
 *
 * @this {CPUState}
 */
CPUDef.opSUI = function()
{
    this.regA = this.subByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xD7 (RST 2)
 *
 * @this {CPUState}
 */
CPUDef.opRST2 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x10);
    this.nStepCycles -= 11;
};

/**
 * op=0xD8 (RC)
 *
 * @this {CPUState}
 */
CPUDef.opRC = function()
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
 * @this {CPUState}
 */
CPUDef.opJC = function()
{
    var w = this.getPCWord();
    if (this.getCF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xDB (IN d8)
 *
 * @this {CPUState}
 */
CPUDef.opIN = function()
{
    var port = this.getPCByte();
    this.regA = this.bus.checkPortInputNotify(port, 1, this.offPC(-2)) & 0xff;
    this.nStepCycles -= 10;
};

/**
 * op=0xDC (CC a16)
 *
 * @this {CPUState}
 */
CPUDef.opCC = function()
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
 * @this {CPUState}
 */
CPUDef.opSBI = function()
{
    this.regA = this.subByteBorrow(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xDF (RST 3)
 *
 * @this {CPUState}
 */
CPUDef.opRST3 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x18);
    this.nStepCycles -= 11;
};

/**
 * op=0xE0 (RPO)
 *
 * @this {CPUState}
 */
CPUDef.opRPO = function()
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
 * @this {CPUState}
 */
CPUDef.opPOPH = function()
{
    this.setHL(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xE2 (JPO a16)
 *
 * @this {CPUState}
 */
CPUDef.opJPO = function()
{
    var w = this.getPCWord();
    if (!this.getPF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xE3 (XTHL)
 *
 * @this {CPUState}
 */
CPUDef.opXTHL = function()
{
    var w = this.popWord();
    this.pushWord(this.getHL());
    this.setHL(w);
    this.nStepCycles -= 18;
};

/**
 * op=0xE4 (CPO a16)
 *
 * @this {CPUState}
 */
CPUDef.opCPO = function()
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
 * @this {CPUState}
 */
CPUDef.opPUSHH = function()
{
    this.pushWord(this.getHL());
    this.nStepCycles -= 11;
};

/**
 * op=0xE6 (ANI d8)
 *
 * @this {CPUState}
 */
CPUDef.opANI = function()
{
    this.regA = this.andByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xE7 (RST 4)
 *
 * @this {CPUState}
 */
CPUDef.opRST4 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x20);
    this.nStepCycles -= 11;
};

/**
 * op=0xE8 (RPE)
 *
 * @this {CPUState}
 */
CPUDef.opRPE = function()
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
 * @this {CPUState}
 */
CPUDef.opPCHL = function()
{
    this.setPC(this.getHL());
    this.nStepCycles -= 5;
};

/**
 * op=0xEA (JPE a16)
 *
 * @this {CPUState}
 */
CPUDef.opJPE = function()
{
    var w = this.getPCWord();
    if (this.getPF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xEB (XCHG)
 *
 * @this {CPUState}
 */
CPUDef.opXCHG = function()
{
    var w = this.getHL();
    this.setHL(this.getDE());
    this.setDE(w);
    this.nStepCycles -= 5;
};

/**
 * op=0xEC (CPE a16)
 *
 * @this {CPUState}
 */
CPUDef.opCPE = function()
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
 * @this {CPUState}
 */
CPUDef.opXRI = function()
{
    this.regA = this.xorByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xEF (RST 5)
 *
 * @this {CPUState}
 */
CPUDef.opRST5 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x28);
    this.nStepCycles -= 11;
};

/**
 * op=0xF0 (RP)
 *
 * @this {CPUState}
 */
CPUDef.opRP = function()
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
 * @this {CPUState}
 */
CPUDef.opPOPSW = function()
{
    this.setPSW(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xF2 (JP a16)
 *
 * @this {CPUState}
 */
CPUDef.opJP = function()
{
    var w = this.getPCWord();
    if (!this.getSF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xF3 (DI)
 *
 * @this {CPUState}
 */
CPUDef.opDI = function()
{
    this.clearIF();
    this.nStepCycles -= 4;
};

/**
 * op=0xF4 (CP a16)
 *
 * @this {CPUState}
 */
CPUDef.opCP = function()
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
 * @this {CPUState}
 */
CPUDef.opPUPSW = function()
{
    this.pushWord(this.getPSW());
    this.nStepCycles -= 11;
};

/**
 * op=0xF6 (ORI d8)
 *
 * @this {CPUState}
 */
CPUDef.opORI = function()
{
    this.regA = this.orByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xF7 (RST 6)
 *
 * @this {CPUState}
 */
CPUDef.opRST6 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x30);
    this.nStepCycles -= 11;
};

/**
 * op=0xF8 (RM)
 *
 * @this {CPUState}
 */
CPUDef.opRM = function()
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
 * @this {CPUState}
 */
CPUDef.opSPHL = function()
{
    this.setSP(this.getHL());
    this.nStepCycles -= 5;
};

/**
 * op=0xFA (JM a16)
 *
 * @this {CPUState}
 */
CPUDef.opJM = function()
{
    var w = this.getPCWord();
    if (this.getSF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xFB (EI)
 *
 * @this {CPUState}
 */
CPUDef.opEI = function()
{
    this.setIF();var w = this.getHL();
    this.nStepCycles -= 4;
};

/**
 * op=0xFC (CM a16)
 *
 * @this {CPUState}
 */
CPUDef.opCM = function()
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
 * @this {CPUState}
 */
CPUDef.opCPI = function()
{
    this.subByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xFF (RST 7)
 *
 * @this {CPUState}
 */
CPUDef.opRST7 = function()
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
CPUDef.aOps8080 = [
    /* 0x00-0x03 */ CPUDef.opNOP,   CPUDef.opLXIB,  CPUDef.opSTAXB, CPUDef.opINXB,
    /* 0x04-0x07 */ CPUDef.opINRB,  CPUDef.opDCRB,  CPUDef.opMVIB,  CPUDef.opRLC,
    /* 0x08-0x0B */ CPUDef.opNOP,   CPUDef.opDADB,  CPUDef.opLDAXB, CPUDef.opDCXB,
    /* 0x0C-0x0F */ CPUDef.opINRC,  CPUDef.opDCRC,  CPUDef.opMVIC,  CPUDef.opRRC,
    /* 0x10-0x13 */ CPUDef.opNOP,   CPUDef.opLXID,  CPUDef.opSTAXD, CPUDef.opINXD,
    /* 0x14-0x17 */ CPUDef.opINRD,  CPUDef.opDCRD,  CPUDef.opMVID,  CPUDef.opRAL,
    /* 0x18-0x1B */ CPUDef.opNOP,   CPUDef.opDADD,  CPUDef.opLDAXD, CPUDef.opDCXD,
    /* 0x1C-0x1F */ CPUDef.opINRE,  CPUDef.opDCRE,  CPUDef.opMVIE,  CPUDef.opRAR,
    /* 0x20-0x23 */ CPUDef.opNOP,   CPUDef.opLXIH,  CPUDef.opSHLD,  CPUDef.opINXH,
    /* 0x24-0x27 */ CPUDef.opINRH,  CPUDef.opDCRH,  CPUDef.opMVIH,  CPUDef.opDAA,
    /* 0x28-0x2B */ CPUDef.opNOP,   CPUDef.opDADH,  CPUDef.opLHLD,  CPUDef.opDCXH,
    /* 0x2C-0x2F */ CPUDef.opINRL,  CPUDef.opDCRL,  CPUDef.opMVIL,  CPUDef.opCMA,
    /* 0x30-0x33 */ CPUDef.opNOP,   CPUDef.opLXISP, CPUDef.opSTA,   CPUDef.opINXSP,
    /* 0x34-0x37 */ CPUDef.opINRM,  CPUDef.opDCRM,  CPUDef.opMVIM,  CPUDef.opSTC,
    /* 0x38-0x3B */ CPUDef.opNOP,   CPUDef.opDADSP, CPUDef.opLDA,   CPUDef.opDCXSP,
    /* 0x3C-0x3F */ CPUDef.opINRA,  CPUDef.opDCRA,  CPUDef.opMVIA,  CPUDef.opCMC,
    /* 0x40-0x43 */ CPUDef.opMOVBB, CPUDef.opMOVBC, CPUDef.opMOVBD, CPUDef.opMOVBE,
    /* 0x44-0x47 */ CPUDef.opMOVBH, CPUDef.opMOVBL, CPUDef.opMOVBM, CPUDef.opMOVBA,
    /* 0x48-0x4B */ CPUDef.opMOVCB, CPUDef.opMOVCC, CPUDef.opMOVCD, CPUDef.opMOVCE,
    /* 0x4C-0x4F */ CPUDef.opMOVCH, CPUDef.opMOVCL, CPUDef.opMOVCM, CPUDef.opMOVCA,
    /* 0x50-0x53 */ CPUDef.opMOVDB, CPUDef.opMOVDC, CPUDef.opMOVDD, CPUDef.opMOVDE,
    /* 0x54-0x57 */ CPUDef.opMOVDH, CPUDef.opMOVDL, CPUDef.opMOVDM, CPUDef.opMOVDA,
    /* 0x58-0x5B */ CPUDef.opMOVEB, CPUDef.opMOVEC, CPUDef.opMOVED, CPUDef.opMOVEE,
    /* 0x5C-0x5F */ CPUDef.opMOVEH, CPUDef.opMOVEL, CPUDef.opMOVEM, CPUDef.opMOVEA,
    /* 0x60-0x63 */ CPUDef.opMOVHB, CPUDef.opMOVHC, CPUDef.opMOVHD, CPUDef.opMOVHE,
    /* 0x64-0x67 */ CPUDef.opMOVHH, CPUDef.opMOVHL, CPUDef.opMOVHM, CPUDef.opMOVHA,
    /* 0x68-0x6B */ CPUDef.opMOVLB, CPUDef.opMOVLC, CPUDef.opMOVLD, CPUDef.opMOVLE,
    /* 0x6C-0x6F */ CPUDef.opMOVLH, CPUDef.opMOVLL, CPUDef.opMOVLM, CPUDef.opMOVLA,
    /* 0x70-0x73 */ CPUDef.opMOVMB, CPUDef.opMOVMC, CPUDef.opMOVMD, CPUDef.opMOVME,
    /* 0x74-0x77 */ CPUDef.opMOVMH, CPUDef.opMOVML, CPUDef.opHLT,   CPUDef.opMOVMA,
    /* 0x78-0x7B */ CPUDef.opMOVAB, CPUDef.opMOVAC, CPUDef.opMOVAD, CPUDef.opMOVAE,
    /* 0x7C-0x7F */ CPUDef.opMOVAH, CPUDef.opMOVAL, CPUDef.opMOVAM, CPUDef.opMOVAA,
    /* 0x80-0x83 */ CPUDef.opADDB,  CPUDef.opADDC,  CPUDef.opADDD,  CPUDef.opADDE,
    /* 0x84-0x87 */ CPUDef.opADDH,  CPUDef.opADDL,  CPUDef.opADDM,  CPUDef.opADDA,
    /* 0x88-0x8B */ CPUDef.opADCB,  CPUDef.opADCC,  CPUDef.opADCD,  CPUDef.opADCE,
    /* 0x8C-0x8F */ CPUDef.opADCH,  CPUDef.opADCL,  CPUDef.opADCM,  CPUDef.opADCA,
    /* 0x90-0x93 */ CPUDef.opSUBB,  CPUDef.opSUBC,  CPUDef.opSUBD,  CPUDef.opSUBE,
    /* 0x94-0x97 */ CPUDef.opSUBH,  CPUDef.opSUBL,  CPUDef.opSUBM,  CPUDef.opSUBA,
    /* 0x98-0x9B */ CPUDef.opSBBB,  CPUDef.opSBBC,  CPUDef.opSBBD,  CPUDef.opSBBE,
    /* 0x9C-0x9F */ CPUDef.opSBBH,  CPUDef.opSBBL,  CPUDef.opSBBM,  CPUDef.opSBBA,
    /* 0xA0-0xA3 */ CPUDef.opANAB,  CPUDef.opANAC,  CPUDef.opANAD,  CPUDef.opANAE,
    /* 0xA4-0xA7 */ CPUDef.opANAH,  CPUDef.opANAL,  CPUDef.opANAM,  CPUDef.opANAA,
    /* 0xA8-0xAB */ CPUDef.opXRAB,  CPUDef.opXRAC,  CPUDef.opXRAD,  CPUDef.opXRAE,
    /* 0xAC-0xAF */ CPUDef.opXRAH,  CPUDef.opXRAL,  CPUDef.opXRAM,  CPUDef.opXRAA,
    /* 0xB0-0xB3 */ CPUDef.opORAB,  CPUDef.opORAC,  CPUDef.opORAD,  CPUDef.opORAE,
    /* 0xB4-0xB7 */ CPUDef.opORAH,  CPUDef.opORAL,  CPUDef.opORAM,  CPUDef.opORAA,
    /* 0xB8-0xBB */ CPUDef.opCMPB,  CPUDef.opCMPC,  CPUDef.opCMPD,  CPUDef.opCMPE,
    /* 0xBC-0xBF */ CPUDef.opCMPH,  CPUDef.opCMPL,  CPUDef.opCMPM,  CPUDef.opCMPA,
    /* 0xC0-0xC3 */ CPUDef.opRNZ,   CPUDef.opPOPB,  CPUDef.opJNZ,   CPUDef.opJMP,
    /* 0xC4-0xC7 */ CPUDef.opCNZ,   CPUDef.opPUSHB, CPUDef.opADI,   CPUDef.opRST0,
    /* 0xC8-0xCB */ CPUDef.opRZ,    CPUDef.opRET,   CPUDef.opJZ,    CPUDef.opJMP,
    /* 0xCC-0xCF */ CPUDef.opCZ,    CPUDef.opCALL,  CPUDef.opACI,   CPUDef.opRST1,
    /* 0xD0-0xD3 */ CPUDef.opRNC,   CPUDef.opPOPD,  CPUDef.opJNC,   CPUDef.opOUT,
    /* 0xD4-0xD7 */ CPUDef.opCNC,   CPUDef.opPUSHD, CPUDef.opSUI,   CPUDef.opRST2,
    /* 0xD8-0xDB */ CPUDef.opRC,    CPUDef.opRET,   CPUDef.opJC,    CPUDef.opIN,
    /* 0xDC-0xDF */ CPUDef.opCC,    CPUDef.opCALL,  CPUDef.opSBI,   CPUDef.opRST3,
    /* 0xE0-0xE3 */ CPUDef.opRPO,   CPUDef.opPOPH,  CPUDef.opJPO,   CPUDef.opXTHL,
    /* 0xE4-0xE7 */ CPUDef.opCPO,   CPUDef.opPUSHH, CPUDef.opANI,   CPUDef.opRST4,
    /* 0xE8-0xEB */ CPUDef.opRPE,   CPUDef.opPCHL,  CPUDef.opJPE,   CPUDef.opXCHG,
    /* 0xEC-0xEF */ CPUDef.opCPE,   CPUDef.opCALL,  CPUDef.opXRI,   CPUDef.opRST5,
    /* 0xF0-0xF3 */ CPUDef.opRP,    CPUDef.opPOPSW, CPUDef.opJP,    CPUDef.opDI,
    /* 0xF4-0xF7 */ CPUDef.opCP,    CPUDef.opPUPSW, CPUDef.opORI,   CPUDef.opRST6,
    /* 0xF8-0xFB */ CPUDef.opRM,    CPUDef.opSPHL,  CPUDef.opJM,    CPUDef.opEI,
    /* 0xFC-0xFF */ CPUDef.opCM,    CPUDef.opCALL,  CPUDef.opCPI,   CPUDef.opRST7
];
