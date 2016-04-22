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
 * @this {CPUSim}
 */
CPUDef.opNOP = function()
{
    this.nStepCycles -= 4;
};

/**
 * op=0x01 (LXI B,d16)
 *
 * @this {CPUSim}
 */
CPUDef.opLXIB = function()
{
    this.setBC(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x02 (STAX B)
 *
 * @this {CPUSim}
 */
CPUDef.opSTAXB = function()
{
    this.setByte(this.getBC(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x03 (INX B)
 *
 * @this {CPUSim}
 */
CPUDef.opINXB = function()
{
    this.setBC(this.getBC() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x04 (INR B)
 *
 * @this {CPUSim}
 */
CPUDef.opINRB = function()
{
    this.regB = this.incByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x05 (DCR B)
 *
 * @this {CPUSim}
 */
CPUDef.opDCRB = function()
{
    this.regB = this.decByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x06 (MVI B,d8)
 *
 * @this {CPUSim}
 */
CPUDef.opMVIB = function()
{
    this.regB = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x07 (RLC)
 *
 * @this {CPUSim}
 */
CPUDef.opRLC = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | (carry >> 8);
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | (carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x09 (DAD B)
 *
 * @this {CPUSim}
 */
CPUDef.opDADB = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getBC());
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | ((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x0A (LDAX B)
 *
 * @this {CPUSim}
 */
CPUDef.opLDAXB = function()
{
    this.regA = this.getByte(this.getBC());
    this.nStepCycles -= 7;
};

/**
 * op=0x0B (DCX B)
 *
 * @this {CPUSim}
 */
CPUDef.opDCXB = function()
{
    this.setBC(this.getBC() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x0C (INR C)
 *
 * @this {CPUSim}
 */
CPUDef.opINRC = function()
{
    this.regC = this.incByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0D (DCR C)
 *
 * @this {CPUSim}
 */
CPUDef.opDCRC = function()
{
    this.regC = this.decByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0E (MVI C,d8)
 *
 * @this {CPUSim}
 */
CPUDef.opMVIC = function()
{
    this.regC = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x0F (RRC)
 *
 * @this {CPUSim}
 */
CPUDef.opRRC = function()
{
    var carry = (this.regA << 8) & 0x100;
    this.regA = (carry | this.regA) >> 1;
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | carry;
    this.nStepCycles -= 4;
};

/**
 * op=0x11 (LXI D,d16)
 *
 * @this {CPUSim}
 */
CPUDef.opLXID = function()
{
    this.setDE(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x12 (STAX D)
 *
 * @this {CPUSim}
 */
CPUDef.opSTAXD = function()
{
    this.setByte(this.getDE(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x13 (INX D)
 *
 * @this {CPUSim}
 */
CPUDef.opINXD = function()
{
    this.setDE(this.getDE() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x14 (INR D)
 *
 * @this {CPUSim}
 */
CPUDef.opINRD = function()
{
    this.regD = this.incByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x15 (DCR D)
 *
 * @this {CPUSim}
 */
CPUDef.opDCRD = function()
{
    this.regD = this.decByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x16 (MVI D,d8)
 *
 * @this {CPUSim}
 */
CPUDef.opMVID = function()
{
    this.regD = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x17 (RAL)
 *
 * @this {CPUSim}
 */
CPUDef.opRAL = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | (this.resultZeroCarry >> 8);
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | (carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x19 (DAD D)
 *
 * @this {CPUSim}
 */
CPUDef.opDADD = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getDE());
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | ((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x1A (LDAX D)
 *
 * @this {CPUSim}
 */
CPUDef.opLDAXD = function()
{
    this.regA = this.getByte(this.getDE());
    this.nStepCycles -= 7;
};

/**
 * op=0x1B (DCX D)
 *
 * @this {CPUSim}
 */
CPUDef.opDCXD = function()
{
    this.setDE(this.getDE() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x1C (INR E)
 *
 * @this {CPUSim}
 */
CPUDef.opINRE = function()
{
    this.regE = this.incByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1D (DCR E)
 *
 * @this {CPUSim}
 */
CPUDef.opDCRE = function()
{
    this.regE = this.decByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1E (MVI E,d8)
 *
 * @this {CPUSim}
 */
CPUDef.opMVIE = function()
{
    this.regE = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x1F (RAR)
 *
 * @this {CPUSim}
 */
CPUDef.opRAR = function()
{
    var carry = (this.regA << 8) & 0x100;
    this.regA = ((this.resultZeroCarry & 0x100) | this.regA) >> 1;
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | carry;
    this.nStepCycles -= 4;
};

/**
 * op=0x21 (LXI H,d16)
 *
 * @this {CPUSim}
 */
CPUDef.opLXIH = function()
{
    this.setHL(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x22 (SHLD a16)
 *
 * @this {CPUSim}
 */
CPUDef.opSHLD = function()
{
    this.setWord(this.getPCWord(), this.getHL());
    this.nStepCycles -= 16;
};

/**
 * op=0x23 (INX H)
 *
 * @this {CPUSim}
 */
CPUDef.opINXH = function()
{
    this.setHL(this.getHL() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x24 (INR H)
 *
 * @this {CPUSim}
 */
CPUDef.opINRH = function()
{
    this.regH = this.incByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x25 (DCR H)
 *
 * @this {CPUSim}
 */
CPUDef.opDCRH = function()
{
    this.regH = this.decByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x26 (MVI H,d8)
 *
 * @this {CPUSim}
 */
CPUDef.opMVIH = function()
{
    this.regH = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x27 (DAA)
 *
 * @this {CPUSim}
 */
CPUDef.opDAA = function()
{
    var acc = this.regA;
    var fCarry = !!this.getCF();
    var fAuxCarry = !!this.getAF();
    if ((acc & 0xf) > 9 || fAuxCarry) {
        acc += 0x6;
        fAuxCarry = true;
    } else {
        fAuxCarry = false;
    }
    if (acc >= 0xa0 || fCarry) {
        acc += 0x60;
        fCarry = true;
    } else {
        fCarry = false;
    }
    this.resultZeroCarry = this.resultParitySign = this.regA = (acc & 0xff);
    this.updateCF(fCarry);
    this.updateAF(fAuxCarry);
    this.nStepCycles -= 4;
};

/**
 * op=0x29 (DAD H)
 *
 * @this {CPUSim}
 */
CPUDef.opDADH = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getHL());
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | ((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x2A (LHLD a16)
 *
 * @this {CPUSim}
 */
CPUDef.opLHLD = function()
{
    this.setHL(this.getWord(this.getPCWord()));
    this.nStepCycles -= 16;
};

/**
 * op=0x2B (DCX H)
 *
 * @this {CPUSim}
 */
CPUDef.opDCXH = function()
{
    this.setHL(this.getHL() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x2C (INR L)
 *
 * @this {CPUSim}
 */
CPUDef.opINRL = function()
{
    this.regL = this.incByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2D (DCR L)
 *
 * @this {CPUSim}
 */
CPUDef.opDCRL = function()
{
    this.regL = this.decByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2E (MVI L,d8)
 *
 * @this {CPUSim}
 */
CPUDef.opMVIL = function()
{
    this.regL = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x2F (CMA)
 *
 * @this {CPUSim}
 */
CPUDef.opCMA = function()
{
    this.regA = ~this.regA & 0xff;
    this.nStepCycles -= 4;
};

/**
 * op=0x31 (LXI SP,d16)
 *
 * @this {CPUSim}
 */
CPUDef.opLXISP = function()
{
    this.setSP(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x32 (STA a16)
 *
 * @this {CPUSim}
 */
CPUDef.opSTA = function()
{
    this.setByte(this.getPCWord(), this.regA);
    this.nStepCycles -= 13;
};

/**
 * op=0x33 (INX SP)
 *
 * @this {CPUSim}
 */
CPUDef.opINXSP = function()
{
    this.setSP(this.getSP() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x34 (INR M)
 *
 * @this {CPUSim}
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
 * @this {CPUSim}
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
 * @this {CPUSim}
 */
CPUDef.opMVIM = function()
{
    this.setByte(this.getHL(), this.getPCByte());
    this.nStepCycles -= 10;
};

/**
 * op=0x37 (STC)
 *
 * @this {CPUSim}
 */
CPUDef.opSTC = function()
{
    this.setCF();
    this.nStepCycles -= 4;
};

/**
 * op=0x39 (DAD SP)
 *
 * @this {CPUSim}
 */
CPUDef.opDADSP = function()
{
    var w;
    this.setSP(w = this.getHL() + this.getSP());
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | ((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x3A (LDA a16)
 *
 * @this {CPUSim}
 */
CPUDef.opLDA = function()
{
    this.regA = this.getByte(this.getPCWord());
    this.nStepCycles -= 13;
};

/**
 * op=0x3B (DCX SP)
 *
 * @this {CPUSim}
 */
CPUDef.opDCXSP = function()
{
    this.setSP(this.getSP() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x3C (INR A)
 *
 * @this {CPUSim}
 */
CPUDef.opINRA = function()
{
    this.regA = this.incByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3D (DCR A)
 *
 * @this {CPUSim}
 */
CPUDef.opDCRA = function()
{
    this.regA = this.decByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3E (MVI A,d8)
 *
 * @this {CPUSim}
 */
CPUDef.opMVIA = function()
{
    this.regA = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x3F (CMC)
 *
 * @this {CPUSim}
 */
CPUDef.opCMC = function()
{
    this.updateCF(!this.getCF());
    this.nStepCycles -= 4;
};

/**
 * opTBD()
 *
 * @this {CPUSim}
 */
CPUDef.opTBD = function()
{
    this.setPC(this.getPC() - 1);
    this.printMessage("unimplemented opcode", true);
    this.stopCPU();
};

/*
 * This 256-entry array of opcode functions is at the heart of the CPU engine: stepCPU(n).
 *
 * It might be worth trying a switch() statement instead, to see how the performance compares,
 * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
 * money on array lookup.
 */
CPUDef.aOps = [
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
    /* 0x40-0x43 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x44-0x47 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x48-0x4B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x4C-0x4F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x50-0x53 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x54-0x57 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x58-0x5B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x5C-0x5F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x60-0x63 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x64-0x67 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x68-0x6B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x6C-0x6F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x70-0x73 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x74-0x77 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x78-0x7B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x7C-0x7F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x80-0x83 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x84-0x87 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x88-0x8B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x8C-0x8F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x90-0x93 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x94-0x97 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x98-0x9B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x9C-0x9F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xA0-0xA3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xA4-0xA7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xA8-0xAB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xAC-0xAF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xB0-0xB3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xB4-0xB7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xB8-0xBB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xBC-0xBF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xC0-0xC3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xC4-0xC7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xC8-0xCB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xCC-0xCF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xD0-0xD3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xD4-0xD7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xD8-0xDB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xDC-0xDF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xE0-0xE3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xE4-0xE7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xE8-0xEB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xEC-0xEF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xF0-0xF3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xF4-0xF7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xF8-0xFB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xFC-0xFF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD
];
