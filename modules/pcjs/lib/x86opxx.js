/**
 * @fileoverview Implements PCjs 8086 opcode decoding.
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
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var X86         = require("./x86");
}

/**
 * op=0x00 (ADD byte,reg)
 *
 * @this {X86CPU}
 */
X86.opADDmb = function ADDmb()
{
    var b = this.getIPByte();
    /*
     * Opcode bytes 0x00 0x00 are sufficiently uncommon that it's more likely we've started
     * executing in the weeds, so we'll print a warning if Messages.CPU is enabled (at which
     * point you can also choose to halt if Messages.HALT is enabled).
     */
    if (DEBUG && !b) {
        this.printMessage("suspicious opcode: 0x00 0x00");
    }
    this.aOpModMemByte[b].call(this, X86.fnADDb);
};

/**
 * op=0x01 (ADD word,reg)
 *
 * @this {X86CPU}
 */
X86.opADDmw = function ADDmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnADDw);
};

/**
 * op=0x02 (ADD reg,byte)
 *
 * @this {X86CPU}
 */
X86.opADDrb = function ADDrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnADDb);
};

/**
 * op=0x03 (ADD reg,word)
 *
 * @this {X86CPU}
 */
X86.opADDrw = function ADDrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnADDw);
};

/**
 * op=0x04 (ADD AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opADDALb = function ADDALb()
{
    this.regEAX = (this.regEAX & ~0xff) | X86.fnADDb.call(this, this.regEAX & 0xff, this.getIPByte());
    /*
     * NOTE: Whenever the result is "blended" value (eg, of btiAL and btiMemLo), a new bti should be
     * allocated to reflect that fact; however, I'm leaving "perfect" BACKTRACK support for another day.
     */
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    /*
     * In the absence of any EA calculations, fnADDb() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x05 (ADD AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opADDAXw = function ADDAXw()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | X86.fnADDw.call(this, this.regEAX & this.dataMask, this.getIPWord());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnADDw() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x06 (PUSH ES)
 *
 * @this {X86CPU}
 */
X86.opPUSHES = function PUSHES()
{
    this.pushWord(this.segES.sel);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
};

/**
 * op=0x07 (POP ES)
 *
 * @this {X86CPU}
 */
X86.opPOPES = function POPES()
{
    this.setES(this.popWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x08 (OR byte,reg)
 *
 * @this {X86CPU}
 */
X86.opORmb = function ORmb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnORb);
};

/**
 * op=0x09 (OR word,reg)
 *
 * @this {X86CPU}
 */
X86.opORmw = function ORmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnORw);
};

/**
 * op=0x0A (OR reg,byte)
 *
 * @this {X86CPU}
 */
X86.opORrb = function ORrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnORb);
};

/**
 * op=0x0B (OR reg,word)
 *
 * @this {X86CPU}
 */
X86.opORrw = function ORrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnORw);
};

/**
 * op=0x0C (OR AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opORALb = function ORALb()
{
    this.regEAX = (this.regEAX & ~0xff) | X86.fnORb.call(this, this.regEAX & 0xff, this.getIPByte());
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    /*
     * In the absence of any EA calculations, fnORb() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x0D (OR AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opORAXw = function ORAXw()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | X86.fnORw.call(this, this.regEAX & this.dataMask, this.getIPWord());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnORw() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x0E (PUSH CS)
 *
 * @this {X86CPU}
 */
X86.opPUSHCS = function PUSHCS()
{
    this.pushWord(this.segCS.sel);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
};

/**
 * op=0x0F (POP CS) (undocumented on 8086/8088; replaced with opInvalid on 80186/80188, and op0F on 80286 and up)
 *
 * @this {X86CPU}
 */
X86.opPOPCS = function POPCS()
{
    this.setCS(this.popWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x0F (handler for two-byte opcodes; 80286 and up)
 *
 * @this {X86CPU}
 */
X86.op0F = function OP0F()
{
    this.aOps0F[this.getIPByte()].call(this);
};

/**
 * op=0x10 (ADC byte,reg)
 *
 * @this {X86CPU}
 */
X86.opADCmb = function ADCmb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnADCb);
};

/**
 * op=0x11 (ADC word,reg)
 *
 * @this {X86CPU}
 */
X86.opADCmw = function ADCmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnADCw);
};

/**
 * op=0x12 (ADC reg,byte)
 *
 * @this {X86CPU}
 */
X86.opADCrb = function ADCrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnADCb);
};

/**
 * op=0x13 (ADC reg,word)
 *
 * @this {X86CPU}
 */
X86.opADCrw = function ADCrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnADCw);
};

/**
 * op=0x14 (ADC AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opADCALb = function ADCALb()
{
    this.regEAX = (this.regEAX & ~0xff) | X86.fnADCb.call(this, this.regEAX & 0xff, this.getIPByte());
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    /*
     * In the absence of any EA calculations, fnADCb() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x15 (ADC AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opADCAXw = function ADCAXw()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | X86.fnADCw.call(this, this.regEAX & this.dataMask, this.getIPWord());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnADCw() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x16 (PUSH SS)
 *
 * @this {X86CPU}
 */
X86.opPUSHSS = function PUSHSS()
{
    this.pushWord(this.segSS.sel);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
};

/**
 * op=0x17 (POP SS)
 *
 * @this {X86CPU}
 */
X86.opPOPSS = function POPSS()
{
    this.setSS(this.popWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x18 (SBB byte,reg)
 *
 * @this {X86CPU}
 */
X86.opSBBmb = function SBBmb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnSBBb);
};

/**
 * op=0x19 (SBB word,reg)
 *
 * @this {X86CPU}
 */
X86.opSBBmw = function SBBmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnSBBw);
};

/**
 * op=0x1A (SBB reg,byte)
 *
 * @this {X86CPU}
 */
X86.opSBBrb = function SBBrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnSBBb);
};

/**
 * op=0x1B (SBB reg,word)
 *
 * @this {X86CPU}
 */
X86.opSBBrw = function SBBrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnSBBw);
};

/**
 * op=0x1C (SBB AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opSBBALb = function SBBALb()
{
    this.regEAX = (this.regEAX & ~0xff) | X86.fnSBBb.call(this, this.regEAX & 0xff, this.getIPByte());
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    /*
     * In the absence of any EA calculations, fnSBBb() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x1D (SBB AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opSBBAXw = function SBBAXw()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | X86.fnSBBw.call(this, this.regEAX & this.dataMask, this.getIPWord());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnSBBw() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x1E (PUSH DS)
 *
 * @this {X86CPU}
 */
X86.opPUSHDS = function PUSHDS()
{
    this.pushWord(this.segDS.sel);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
};

/**
 * op=0x1F (POP DS)
 *
 * @this {X86CPU}
 */
X86.opPOPDS = function POPDS()
{
    this.setDS(this.popWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x20 (AND byte,reg)
 *
 * @this {X86CPU}
 */
X86.opANDmb = function ANDmb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnANDb);
};

/**
 * op=0x21 (AND word,reg)
 *
 * @this {X86CPU}
 */
X86.opANDmw = function ANDmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnANDw);
};

/**
 * op=0x21 (AND dword,reg)
 *
 * @this {X86CPU}
 */
X86.opANDmd = function ANDmd()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnANDd);
};

/**
 * op=0x22 (AND reg,byte)
 *
 * @this {X86CPU}
 */
X86.opANDrb = function ANDrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnANDb);
};

/**
 * op=0x23 (AND reg,word)
 *
 * @this {X86CPU}
 */
X86.opANDrw = function ANDrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnANDw);
};

/**
 * op=0x23 (AND reg,dword)
 *
 * @this {X86CPU}
 */
X86.opANDrd = function ANDrd()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnANDd);
};

/**
 * op=0x24 (AND AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opANDAL = function ANDAL()
{
    this.regEAX = (this.regEAX & ~0xff) | X86.fnANDb.call(this, this.regEAX & 0xff, this.getIPByte());
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    /*
     * In the absence of any EA calculations, fnANDb() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x25 (AND AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opANDAX = function ANDAX()
{
    this.regEAX = (this.regEAX & ~0xffff) | X86.fnANDw.call(this, this.regEAX & 0xffff, this.getIPShort());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnANDw() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x25 (AND AX,imm32)
 *
 * @this {X86CPU}
 */
X86.opANDAXd = function ANDAXd()
{
    this.regEAX = X86.fnANDd.call(this, this.regEAX, this.getIPLong());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnANDd() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x26 (ES:)
 *
 * @this {X86CPU}
 */
X86.opES = function ES()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
    this.segData = this.segStack = this.segES;
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
};

/**
 * op=0x27 (DAA)
 *
 * @this {X86CPU}
 */
X86.opDAA = function DAA()
{
    var AL = this.regEAX & 0xff;
    var AF = this.getAF();
    var CF = this.getCF();
    if ((AL & 0xf) > 9 || AF) {
        AL += 0x6;
        AF = X86.PS.AF;
    }
    if (AL > 0x9f || CF) {
        AL += 0x60;
        CF = X86.PS.CF;
    }
    var b = (AL & 0xff);
    this.regEAX = (this.regEAX & ~0xff) | b;
    this.setLogicResult(b, X86.RESULT.BYTE);
    if (CF) this.setCF(); else this.clearCF();
    if (AF) this.setAF(); else this.clearAF();
    this.nStepCycles -= this.CYCLES.nOpCyclesAAA;          // AAA and DAA have the same cycle times
};

/**
 * op=0x28 (SUB byte,reg)
 *
 * @this {X86CPU}
 */
X86.opSUBmb = function SUBmb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnSUBb);
};

/**
 * op=0x29 (SUB word,reg)
 *
 * @this {X86CPU}
 */
X86.opSUBmw = function SUBmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnSUBw);
};

/**
 * op=0x2A (SUB reg,byte)
 *
 * @this {X86CPU}
 */
X86.opSUBrb = function SUBrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnSUBb);
};

/**
 * op=0x2B (SUB reg,word)
 *
 * @this {X86CPU}
 */
X86.opSUBrw = function SUBrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnSUBw);
};

/**
 * op=0x2C (SUB AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opSUBALb = function SUBALb()
{
    this.regEAX = (this.regEAX & ~0xff) | X86.fnSUBb.call(this, this.regEAX & 0xff, this.getIPByte());
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    /*
     * In the absence of any EA calculations, fnSUBb() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x2D (SUB AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opSUBAXw = function SUBAXw()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | X86.fnSUBw.call(this, this.regEAX & this.dataMask, this.getIPWord());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnSUBw() will deduct nOpCyclesArithRR, and for all CPUs
     * through the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x2E (CS:)
 *
 * @this {X86CPU}
 */
X86.opCS = function CS()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
    this.segData = this.segStack = this.segCS;
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
};

/**
 * op=0x2F (DAS)
 *
 * @this {X86CPU}
 */
X86.opDAS = function DAS()
{
    var AL = this.regEAX & 0xff;
    var AF = this.getAF();
    var CF = this.getCF();
    if ((AL & 0xf) > 9 || AF) {
        AL -= 0x6;
        AF = X86.PS.AF;
    }
    if (AL > 0x9f || CF) {
        AL -= 0x60;
        CF = X86.PS.CF;
    }
    var b = (AL & 0xff);
    this.regEAX = (this.regEAX & ~0xff) | b;
    this.setLogicResult(b, X86.RESULT.BYTE);
    if (CF) this.setCF(); else this.clearCF();
    if (AF) this.setAF(); else this.clearAF();
    this.nStepCycles -= this.CYCLES.nOpCyclesAAA;          // AAA and DAS have the same cycle times
};

/**
 * op=0x30 (XOR byte,reg)
 *
 * @this {X86CPU}
 */
X86.opXORmb = function XORmb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnXORb);
};

/**
 * op=0x31 (XOR word,reg)
 *
 * @this {X86CPU}
 */
X86.opXORmw = function XORmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnXORw);
};

/**
 * op=0x32 (XOR reg,byte)
 *
 * @this {X86CPU}
 */
X86.opXORrb = function XORrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnXORb);
};

/**
 * op=0x33 (XOR reg,word)
 *
 * @this {X86CPU}
 */
X86.opXORrw = function XORrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnXORw);
};

/**
 * op=0x33 (XOR reg,dword)
 *
 * @this {X86CPU}
 */
X86.opXORrd = function XORrd()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnXORd);
};

/**
 * op=0x34 (XOR AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opXORALb = function XORALb()
{
    this.regEAX = (this.regEAX & ~0xff) | X86.fnXORb.call(this, this.regEAX & 0xff, this.getIPByte());
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    /*
     * In the absence of any EA calculations, fnXORb() will deduct nOpCyclesArithRR, and for all CPUs
     * through the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x35 (XOR AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opXORAXw = function XORAXw()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | X86.fnXORw.call(this, this.regEAX & this.dataMask, this.getIPWord());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    /*
     * In the absence of any EA calculations, fnXORw() will deduct nOpCyclesArithRR, and for all CPUs
     * through the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x36 (SS:)
 *
 * @this {X86CPU}
 */
X86.opSS = function SS()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
    this.segData = this.segStack = this.segSS;      // QUESTION: Is there a case where segStack would not already be segSS? (eg, multiple segment overrides?)
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
};

/**
 * op=0x37 (AAA)
 *
 * @this {X86CPU}
 */
X86.opAAA = function AAA()
{
    var CF, AF;
    var AL = this.regEAX & 0xff;
    var AH = (this.regEAX >> 8) & 0xff;
    if ((AL & 0xf) > 9 || this.getAF()) {
        AL = (AL + 0x6) & 0xf;
        AH = (AH + 1) & 0xff;
        CF = AF = 1;
    } else {
        CF = AF = 0;
    }
    this.regEAX = (this.regEAX & ~0xffff) | ((AH << 8) | AL);
    if (CF) this.setCF(); else this.clearCF();
    if (AF) this.setAF(); else this.clearAF();
    this.nStepCycles -= this.CYCLES.nOpCyclesAAA;
};

/**
 * op=0x38 (CMP byte,reg)
 *
 * @this {X86CPU}
 */
X86.opCMPmb = function CMPmb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnCMPb);
};

/**
 * op=0x39 (CMP word,reg)
 *
 * @this {X86CPU}
 */
X86.opCMPmw = function CMPmw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnCMPw);
};

/**
 * op=0x3A (CMP reg,byte)
 *
 * @this {X86CPU}
 */
X86.opCMPrb = function CMPrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnCMPb);
};

/**
 * op=0x3B (CMP reg,word)
 *
 * @this {X86CPU}
 */
X86.opCMPrw = function CMPrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnCMPw);
};

/**
 * op=0x3C (CMP AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opCMPALb = function CMPALb()
{
    X86.fnCMPb.call(this, this.regEAX & 0xff, this.getIPByte());
    /*
     * In the absence of any EA calculations, fnCMPb() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x3D (CMP AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opCMPAXw = function CMPAXw()
{
    X86.fnCMPw.call(this, this.regEAX & this.dataMask, this.getIPWord());
    /*
     * In the absence of any EA calculations, fnCMPw() will deduct nOpCyclesArithRR, and for all CPUs through
     * the 80286, we need deduct only one more cycle.
     */
    this.nStepCycles--;
};

/**
 * op=0x3E (DS:)
 *
 * @this {X86CPU}
 */
X86.opDS = function DS()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
    this.segData = this.segStack = this.segDS;      // QUESTION: Is there a case where segData would not already be segDS? (eg, multiple segment overrides?)
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
};

/**
 * op=0x3D (AAS)
 *
 * @this {X86CPU}
 */
X86.opAAS = function AAS()
{
    var CF, AF;
    var AL = this.regEAX & 0xff;
    var AH = (this.regEAX >> 8) & 0xff;
    if ((AL & 0xf) > 9 || this.getAF()) {
        AL = (AL - 0x6) & 0xf;
        AH = (AH - 1) & 0xff;
        CF = AF = 1;
    } else {
        CF = AF = 0;
    }
    this.regEAX = (this.regEAX & ~0xffff) | ((AH << 8) | AL);
    if (CF) this.setCF(); else this.clearCF();
    if (AF) this.setAF(); else this.clearAF();
    this.nStepCycles -= this.CYCLES.nOpCyclesAAA;   // AAA and AAS have the same cycle times
};

/**
 * op=0x40 (INC AX)
 *
 * @this {X86CPU}
 */
X86.opINCAX = function INCAX()
{
    this.regEAX = X86.fnINCr.call(this, this.regEAX);
};

/**
 * op=0x41 (INC CX)
 *
 * @this {X86CPU}
 */
X86.opINCCX = function INCCX()
{
    this.regECX = X86.fnINCr.call(this, this.regECX);
};

/**
 * op=0x42 (INC DX)
 *
 * @this {X86CPU}
 */
X86.opINCDX = function INCDX()
{
    this.regEDX = X86.fnINCr.call(this, this.regEDX);
};

/**
 * op=0x43 (INC BX)
 *
 * @this {X86CPU}
 */
X86.opINCBX = function INCBX()
{
    this.regEBX = X86.fnINCr.call(this, this.regEBX);
};

/**
 * op=0x44 (INC SP)
 *
 * @this {X86CPU}
 */
X86.opINCSP = function INCSP()
{
    this.setSP(X86.fnINCr.call(this, this.getSP()));
};

/**
 * op=0x45 (INC BP)
 *
 * @this {X86CPU}
 */
X86.opINCBP = function INCBP()
{
    this.regEBP = X86.fnINCr.call(this, this.regEBP);
};

/**
 * op=0x46 (INC SI)
 *
 * @this {X86CPU}
 */
X86.opINCSI = function INCSI()
{
    this.regESI = X86.fnINCr.call(this, this.regESI);
};

/**
 * op=0x47 (INC DI)
 *
 * @this {X86CPU}
 */
X86.opINCDI = function INCDI()
{
    this.regEDI = X86.fnINCr.call(this, this.regEDI);
};

/**
 * op=0x48 (DEC AX)
 *
 * @this {X86CPU}
 */
X86.opDECAX = function DECAX()
{
    this.regEAX = X86.fnDECr.call(this, this.regEAX);
};

/**
 * op=0x49 (DEC CX)
 *
 * @this {X86CPU}
 */
X86.opDECCX = function DECCX()
{
    this.regECX = X86.fnDECr.call(this, this.regECX);
};

/**
 * op=0x4A (DEC DX)
 *
 * @this {X86CPU}
 */
X86.opDECDX = function DECDX()
{
    this.regEDX = X86.fnDECr.call(this, this.regEDX);
};

/**
 * op=0x4B (DEC BX)
 *
 * @this {X86CPU}
 */
X86.opDECBX = function DECBX()
{
    this.regEBX = X86.fnDECr.call(this, this.regEBX);
};

/**
 * op=0x4C (DEC SP)
 *
 * @this {X86CPU}
 */
X86.opDECSP = function DECSP()
{
    this.setSP(X86.fnDECr.call(this, this.getSP()));
};

/**
 * op=0x4D (DEC BP)
 *
 * @this {X86CPU}
 */
X86.opDECBP = function DECBP()
{
    this.regEBP = X86.fnDECr.call(this, this.regEBP);
};

/**
 * op=0x4E (DEC SI)
 *
 * @this {X86CPU}
 */
X86.opDECSI = function DECSI()
{
    this.regESI = X86.fnDECr.call(this, this.regESI);
};

/**`
 * op=0x4F (DEC DI)
 *
 * @this {X86CPU}
 */
X86.opDECDI = function DECDI()
{
    this.regEDI = X86.fnDECr.call(this, this.regEDI);
};

/**
 * op=0x50 (PUSH AX)
 *
 * @this {X86CPU}
 */
X86.opPUSHAX = function PUSHAX()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
    }
    this.pushWord(this.regEAX & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x51 (PUSH CX)
 *
 * @this {X86CPU}
 */
X86.opPUSHCX = function PUSHCX()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
    }
    this.pushWord(this.regECX & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x52 (PUSH DX)
 *
 * @this {X86CPU}
 */
X86.opPUSHDX = function PUSHDX()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
    }
    this.pushWord(this.regEDX & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x53 (PUSH BX)
 *
 * @this {X86CPU}
 */
X86.opPUSHBX = function PUSHBX()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
    }
    this.pushWord(this.regEBX & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x54 (PUSH SP)
 *
 * @this {X86CPU}
 */
X86.opPUSHSP_8086 = function PUSHSP_8086()
{
    var w = (this.getSP() - this.dataSize) & this.dataMask;
    this.pushWord(w);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x54 (PUSH SP)
 *
 * @this {X86CPU}
 */
X86.opPUSHSP = function PUSHSP()
{
    this.pushWord(this.getSP() & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x55 (PUSH BP)
 *
 * @this {X86CPU}
 */
X86.opPUSHBP = function PUSHBP()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
    }
    this.pushWord(this.regEBP & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x56 (PUSH SI)
 *
 * @this {X86CPU}
 */
X86.opPUSHSI = function PUSHSI()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
    }
    this.pushWord(this.regESI & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x57 (PUSH DI)
 *
 * @this {X86CPU}
 */
X86.opPUSHDI = function PUSHDI()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
    }
    this.pushWord(this.regEDI & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x58 (POP AX)
 *
 * @this {X86CPU}
 */
X86.opPOPAX = function POPAX()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x59 (POP CX)
 *
 * @this {X86CPU}
 */
X86.opPOPCX = function POPCX()
{
    this.regECX = (this.regECX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x5A (POP DX)
 *
 * @this {X86CPU}
 */
X86.opPOPDX = function POPDX()
{
    this.regEDX = (this.regEDX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x5B (POP BX)
 *
 * @this {X86CPU}
 */
X86.opPOPBX = function POPBX()
{
    this.regEBX = (this.regEBX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x5C (POP SP)
 *
 * @this {X86CPU}
 */
X86.opPOPSP = function POPSP()
{
    this.setSP((this.getSP() & ~this.dataMask) | this.popWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x5D (POP BP)
 *
 * @this {X86CPU}
 */
X86.opPOPBP = function POPBP()
{
    this.regEBP = (this.regEBP & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x5E (POP SI)
 *
 * @this {X86CPU}
 */
X86.opPOPSI = function POPSI()
{
    this.regESI = (this.regESI & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x5F (POP DI)
 *
 * @this {X86CPU}
 */
X86.opPOPDI = function POPDI()
{
    this.regEDI = (this.regEDI & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x60 (PUSHA) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opPUSHA = function PUSHA()
{
    /*
     * TODO: regLSP needs to be pre-bounds-checked against regLSPLimitLow
     */
    var temp = this.getSP() & this.dataMask;
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
    }
    this.pushWord(this.regEAX & this.dataMask);
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
    }
    this.pushWord(this.regECX & this.dataMask);
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
    }
    this.pushWord(this.regEDX & this.dataMask);
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
    }
    this.pushWord(this.regEBX & this.dataMask);
    this.pushWord(temp);
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
    }
    this.pushWord(this.regEBP & this.dataMask);
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
    }
    this.pushWord(this.regESI & this.dataMask);
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
    }
    this.pushWord(this.regEDI & this.dataMask);
    this.nStepCycles -= this.CYCLES.nOpCyclesPushAll;
};

/**
 * op=0x61 (POPA) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opPOPA = function POPA()
{
    this.regEDI = (this.regEDI & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
    }
    this.regESI = (this.regESI & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
    }
    this.regEBP = (this.regEBP & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
    }
    /*
     * TODO: regLSP needs to be pre-bounds-checked against regLSPLimit at the start
     */
    this.setSP(this.getSP() + this.dataSize);
    // this.regLSP += (I386? this.dataSize : 2);
    this.regEBX = (this.regEBX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
    }
    this.regEDX = (this.regEDX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
    }
    this.regECX = (this.regECX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
    }
    this.regEAX = (this.regEAX & ~this.dataMask) | this.popWord();
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesPopAll;
};

/**
 * op=0x62 (BOUND reg,word) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opBOUND = function BOUND()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnBOUND);
};

/**
 * op=0x63 (ARPL word,reg) (80286 and up)
 *
 * @this {X86CPU}
 */
X86.opARPL = function ARPL()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnARPL);
};

/**
 * op=0x64 (FS:)
 *
 * @this {X86CPU}
 */
X86.opFS = function FS()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
    this.segData = this.segStack = this.segFS;
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    this.stopCPU();
};

/**
 * op=0x65 (GS:)
 *
 * @this {X86CPU}
 */
X86.opGS = function GS()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
    this.segData = this.segStack = this.segGS;
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    this.stopCPU();
};

/**
 * op=0x66 (OS:) (80386 and up)
 *
 * TODO: Review other effective operand-size criteria, cycle count, etc.
 *
 * @this {X86CPU}
 */
X86.opOS = function OS()
{
    if (I386) {
        this.opFlags |= X86.OPFLAG.DATASIZE;
        this.dataSize ^= 0x6;               // that which is 2 shall become 4, and vice versa
        this.dataMask ^= (0xffff0000|0);    // that which is 0x0000ffff shall become 0xffffffff, and vice versa
        this.setDataSize();
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    }
};

/**
 * op=0x67 (AS:) (80386 and up)
 *
 * TODO: Review other effective address-size criteria, cycle count, etc.
 *
 * @this {X86CPU}
 */
X86.opAS = function AS()
{
    if (I386) {
        this.opFlags |= X86.OPFLAG.ADDRSIZE;
        this.addrSize ^= 0x06;              // that which is 2 shall become 4, and vice versa
        this.addrMask ^= (0xffff0000|0);    // that which is 0x0000ffff shall become 0xffffffff, and vice versa
        this.setAddrSize();
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    }
};

/**
 * op=0x68 (PUSH imm16) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opPUSH16 = function PUSH16()
{
    this.pushWord(this.getIPWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x69 (IMUL reg,word,imm16) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opIMUL16 = function IMUL16()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnIMUL16);
};

/**
 * op=0x6A (PUSH imm8) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opPUSH8 = function PUSH8()
{
    if (BACKTRACK) this.backTrack.btiMemHi = 0;
    this.pushWord(this.getIPByte());
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x6B (IMUL reg,word,imm8) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opIMUL8 = function IMUL8()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnIMUL8);
};

/**
 * op=0x6C (INSB) (80186/80188 and up)
 *
 * NOTE: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
 *
 * @this {X86CPU}
 */
X86.opINSb = function INSb()
{
    var nReps = 1;
    var nDelta = 0;

    /*
     * NOTE: 5 + 4n is the cycle time for the 80286; the 80186/80188 has different values: 14 cycles for
     * an unrepeated INS, and 8 + 8n for a repeated INS.  However, accurate cycle times for the 80186/80188 is
     * low priority.
     */
    var nCycles = 5;

    /*
     * The (normal) REP prefix, if used, is REPNZ (0xf2), but either one works....
     */
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
    }

    if (nReps--) {
        var b = this.bus.checkPortInputNotify(this.regEDX, this.regLIP - nDelta - 1);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiIO;
        this.setSOByte(this.segES, this.regEDI & this.addrMask, b);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0x6D (INSW) (80186/80188 and up)
 *
 * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
 *
 * @this {X86CPU}
 */
X86.opINSw = function INSw()
{
    var nReps = 1;
    var nDelta = 0;

    /*
     * NOTE: 5 + 4n is the cycle time for the 80286; the 80186/80188 has different values: 14 cycles for
     * an unrepeated INS, and 8 + 8n for a repeated INS.  However, accurate cycle times for the 80186/80188 is
     * low priority.
     */
    var nCycles = 5;

    /*
     * The (normal) REP prefix, if used, is REPNZ (0xf2), but either one works....
     */
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
    }
    if (nReps--) {
        var addrFrom = this.regLIP - nDelta - 1;
        var w = 0, shift = 0;
        for (var n = 0; n < this.dataSize; n++) {
            w |= this.bus.checkPortInputNotify(this.regEDX, addrFrom) << shift;
            shift += 8;
            if (BACKTRACK) {
                if (!n) {
                    this.backTrack.btiMemLo = this.backTrack.btiIO;
                } else if (n == 1) {
                    this.backTrack.btiMemHi = this.backTrack.btiIO;
                }
            }
        }
        this.setSOWord(this.segES, this.regEDI & this.addrMask, w);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -this.dataSize : this.dataSize)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0x6E (OUTSB) (80186/80188 and up)
 *
 * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
 *
 * @this {X86CPU}
 */
X86.opOUTSb = function OUTSb()
{
    var nReps = 1;
    var nDelta = 0;

    /*
     * NOTE: 5 + 4n is the cycle time for the 80286; the 80186/80188 has different values: 14 cycles for
     * an unrepeated INS, and 8 + 8n for a repeated INS.  However, accurate cycle times for the 80186/80188 is
     * low priority. TODO: Fix this someday.
     */
    var nCycles = 5;

    /*
     * The (normal) REP prefix, if used, is REPNZ (0xf2), but either one works....
     */
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
    }
    if (nReps--) {
        var b = this.getSOByte(this.segDS, this.regESI & this.addrMask);
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + ((this.regPS & X86.PS.DF)? -1 : 1)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiMemLo;
        this.bus.checkPortOutputNotify(this.regEDX, b, this.regLIP - nDelta - 1);
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0x6F (OUTSW) (80186/80188 and up)
 *
 * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
 *
 * @this {X86CPU}
 */
X86.opOUTSw = function OUTSw()
{
    var nReps = 1;
    var nDelta = 0;

    /*
     * NOTE: 5 + 4n is the cycle time for the 80286; the 80186/80188 has different values: 14 cycles for
     * an unrepeated INS, and 8 + 8n for a repeated INS.  However, accurate cycle times for the 80186/80188 is
     * low priority. TODO: Fix this someday.
     */
    var nCycles = 5;

    /*
     * The (normal) REP prefix, if used, is REPNZ (0xf2), but either one works....
     */
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
    }
    if (nReps--) {
        var w = this.getSOWord(this.segDS, this.regESI & this.addrMask);
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + ((this.regPS & X86.PS.DF)? -this.dataSize : this.dataSize)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        var addrFrom = this.regLIP - nDelta - 1, shift = 0;
        for (var n = 0; n < this.dataSize; n++) {
            if (BACKTRACK) {
                if (!n) {
                    this.backTrack.btiIO = this.backTrack.btiMemLo;
                } else if (n == 1) {
                    this.backTrack.btiIO = this.backTrack.btiMemHi;
                }
            }
            this.bus.checkPortOutputNotify(this.regEDX, (w >> shift) & 0xff, addrFrom);
            shift += 8;
        }
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0x70 (JO disp)
 *
 * @this {X86CPU}
 */
X86.opJO = function JO()
{
    var disp = this.getIPDisp();
    if (this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x71 (JNO disp)
 *
 * @this {X86CPU}
 */
X86.opJNO = function JNO()
{
    var disp = this.getIPDisp();
    if (!this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x72 (JC disp, aka JB disp)
 *
 * @this {X86CPU}
 */
X86.opJC = function JC()
{
    var disp = this.getIPDisp();
    if (this.getCF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x73 (JNC disp, aka JAE disp)
 *
 * @this {X86CPU}
 */
X86.opJNC = function JNC()
{
    var disp = this.getIPDisp();
    if (!this.getCF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x74 (JZ disp)
 *
 * @this {X86CPU}
 */
X86.opJZ = function JZ()
{
    var disp = this.getIPDisp();
    if (this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x75 (JNZ disp)
 *
 * @this {X86CPU}
 */
X86.opJNZ = function JNZ()
{
    var disp = this.getIPDisp();
    if (!this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x76 (JBE disp)
 *
 * @this {X86CPU}
 */
X86.opJBE = function JBE()
{
    var disp = this.getIPDisp();
    if (this.getCF() || this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x77 (JNBE disp, JA disp)
 *
 * @this {X86CPU}
 */
X86.opJNBE = function JNBE()
{
    var disp = this.getIPDisp();
    if (!this.getCF() && !this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x78 (JS disp)
 *
 * @this {X86CPU}
 */
X86.opJS = function JS()
{
    var disp = this.getIPDisp();
    if (this.getSF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x79 (JNS disp)
 *
 * @this {X86CPU}
 */
X86.opJNS = function JNS()
{
    var disp = this.getIPDisp();
    if (!this.getSF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x7A (JP disp)
 *
 * @this {X86CPU}
 */
X86.opJP = function JP()
{
    var disp = this.getIPDisp();
    if (this.getPF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x7B (JNP disp)
 *
 * @this {X86CPU}
 */
X86.opJNP = function JNP()
{
    var disp = this.getIPDisp();
    if (!this.getPF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x7C (JL disp)
 *
 * @this {X86CPU}
 */
X86.opJL = function JL()
{
    var disp = this.getIPDisp();
    if (!this.getSF() != !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x7D (JNL disp, aka JGE disp)
 *
 * @this {X86CPU}
 */
X86.opJNL = function JNL()
{
    var disp = this.getIPDisp();
    if (!this.getSF() == !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x7E (JLE disp)
 *
 * @this {X86CPU}
 */
X86.opJLE = function JLE()
{
    var disp = this.getIPDisp();
    if (this.getZF() || !this.getSF() != !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x7F (JNLE disp, aka JG disp)
 *
 * @this {X86CPU}
 */
X86.opJNLE = function JNLE()
{
    var disp = this.getIPDisp();
    if (!this.getZF() && !this.getSF() == !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
};

/**
 * op=0x80/0x82 (GRP1 byte,imm8)
 *
 * @this {X86CPU}
 */
X86.opGRP1b = function GRP1b()
{
    this.aOpModGrpByte[this.getIPByte()].call(this, X86.aOpGrp1b, this.getIPByte);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? 1 : this.CYCLES.nOpCyclesArithMID);
};

/**
 * op=0x81 (GRP1 word,imm16)
 *
 * @this {X86CPU}
 */
X86.opGRP1w = function GRP1w()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp1w, this.getIPWord);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? 1 : this.CYCLES.nOpCyclesArithMID);
};

/**
 * op=0x83 (GRP1 word,disp)
 *
 * @this {X86CPU}
 */
X86.opGRP1sw = function GRP1sw()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp1w, this.getIPDisp);
    this.nStepCycles -= (this.regEAWrite === X86.ADDR_INVALID? 1 : this.CYCLES.nOpCyclesArithMID);
};

/**
 * op=0x84 (TEST reg,byte)
 *
 * @this {X86CPU}
 */
X86.opTESTrb = function TESTrb()
{
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnTESTb);
};

/**
 * op=0x85 (TEST reg,word)
 *
 * @this {X86CPU}
 */
X86.opTESTrw = function TESTrw()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnTESTw);
};

/**
 * op=0x86 (XCHG reg,byte)
 *
 * NOTE: The XCHG instruction is unique in that both src and dst are both read and written;
 * see fnXCHGrb() for how we deal with this special case.
 *
 * @this {X86CPU}
 */
X86.opXCHGrb = function XCHGrb()
{
    /*
     * If the second operand is a register, then the ModRegByte decoder must use separate "get" and
     * "set" assignments, otherwise instructions like "XCHG DH,DL" will end up using a stale DL instead of
     * the updated DL.
     *
     * To be clear, a single assignment like this will fail:
     *
     *      opModRegByteF2: function(fn)
{
     *          this.regEDX = (this.regEDX & 0xff) | (fn.call(this, this.regEDX >> 8, this.regEDX & 0xff) << 8);
     *      }
     *
     * which is why all affected decoders now use separate assignments; eg:
     *
     *      opModRegByteF2: function(fn)
{
     *          var b = fn.call(this, this.regEDX >> 8, this.regEDX & 0xff);
     *          this.regEDX = (this.regEDX & 0xff) | (b << 8);
     *      }
     */
    this.aOpModRegByte[this.bModRM = this.getIPByte()].call(this, X86.fnXCHGrb);
};

/**
 * op=0x87 (XCHG reg,word)
 *
 * NOTE: The XCHG instruction is unique in that both src and dst are both read and written;
 * see fnXCHGrw() for how we deal with this special case.
 *
 * @this {X86CPU}
 */
X86.opXCHGrw = function XCHGrw()
{
    this.aOpModRegWord[this.bModRM = this.getIPByte()].call(this, X86.fnXCHGrw);
};

/**
 * op=0x88 (MOV byte,reg)
 *
 * @this {X86CPU}
 */
X86.opMOVmb = function MOVmb()
{
    /*
     * Like other MOV operations, the destination does not need to be read, just written.
     */
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.aOpModMemByte[this.getIPByte()].call(this, X86.fnMOV);
};

/**
 * op=0x89 (MOV word,reg)
 *
 * @this {X86CPU}
 */
X86.opMOVmw = function MOVmw()
{
    /*
     * Like other MOV operations, the destination does not need to be read, just written.
     */
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnMOV);
};

/**
 * op=0x8A (MOV reg,byte)
 *
 * @this {X86CPU}
 */
X86.opMOVrb = function MOVrb()
{
    this.aOpModRegByte[this.getIPByte()].call(this, X86.fnMOV);
};

/**
 * op=0x8B (MOV reg,word)
 *
 * @this {X86CPU}
 */
X86.opMOVrw = function MOVrw()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnMOV);
};

/**
 * op=0x8C (MOV word,sr)
 *
 * NOTE: Since the ModRM decoders deal only with general-purpose registers, we must move
 * the appropriate segment register into a special variable (regMD16), which our helper function
 * (fnMOVMD16) will use to replace the decoder's src operand.
 *
 * @this {X86CPU}
 */
X86.opMOVwsr = function MOVwsr()
{
    var bModRM = this.getIPByte();
    var reg = (bModRM & 0x38) >> 3;
    switch (reg) {
    case 0x0:
        this.regMD16 = this.segES.sel;
        break;
    case 0x1:
        this.regMD16 = this.segCS.sel;
        break;
    case 0x2:
        this.regMD16 = this.segSS.sel;
        break;
    case 0x3:
        this.regMD16 = this.segDS.sel;
        break;
    default:
        X86.opUndefined.call(this);
        return;
    }
    /*
     * Like other MOV operations, the destination does not need to be read, just written.
     */
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.aOpModMemWord[bModRM].call(this, X86.fnMOVMD16);
};

/**
 * op=0x8D (LEA reg,word)
 *
 * @this {X86CPU}
 */
X86.opLEA = function LEA()
{
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.segData = this.segStack = this.segNULL;    // we can't have the EA calculation, if any, "polluted" by segment arithmetic
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLEA);
};

/**
 * op=0x8E (MOV sr,word)
 *
 * NOTE: Since the ModRM decoders deal only with general-purpose registers, we have to
 * make a note of which general-purpose register will be overwritten, so that we can restore it
 * after moving the modified value to the correct segment register.
 *
 * @this {X86CPU}
 */
X86.opMOVsrw = function MOVsrw()
{
    var temp;
    var bModRM = this.getIPByte();
    var reg = (bModRM & 0x38) >> 3;
    switch(reg) {
    case 0x0:
        temp = this.regEAX;
        break;
    case 0x2:
        temp = this.regEDX;
        break;
    case 0x3:
        temp = this.regEBX;
        break;
    default:
        if (this.model == X86.MODEL_80286 || this.model == X86.MODEL_80386 && reg != 0x4 && reg != 0x5) {
            X86.opInvalid.call(this);
            return;
        }
        switch(reg) {
        case 0x1:           // MOV to CS is undocumented on 8086/8088/80186/80188, and invalid on 80286 and up
            temp = this.regECX;
            break;
        case 0x4:           // this form of MOV to ES is undocumented on 8086/8088/80186/80188, invalid on 80286, and uses FS starting with 80386
            temp = this.getSP();
            break;
        case 0x5:           // this form of MOV to CS is undocumented on 8086/8088/80186/80188, invalid on 80286, and uses GS starting with 80386
            temp = this.regEBP;
            break;
        case 0x6:           // this form of MOV to SS is undocumented on 8086/8088/80186/80188, invalid on 80286 and up
            temp = this.regESI;
            break;
        case 0x7:           // this form of MOV to DS is undocumented on 8086/8088/80186/80188, invalid on 80286 and up
            temp = this.regEDI;
            break;
        default:
            break;
        }
        break;
    }
    this.aOpModRegWord[bModRM].call(this, X86.fnMOV);
    switch (reg) {
    case 0x0:
        this.setES(this.regEAX);
        this.regEAX = temp;
        break;
    case 0x1:
        this.setCS(this.regECX);
        this.regECX = temp;
        break;
    case 0x2:
        this.setSS(this.regEDX);
        this.regEDX = temp;
        break;
    case 0x3:
        this.setDS(this.regEBX);
        this.regEBX = temp;
        break;
    case 0x4:
        if (I386 && this.model >= X86.MODEL_80386) {
            this.setFS(this.getSP());
        } else {
            this.setES(this.getSP());
        }
        this.setSP(temp);
        break;
    case 0x5:
        if (I386 && this.model >= X86.MODEL_80386) {
            this.setGS(this.regEBP);
        } else {
            this.setCS(this.regEBP);
        }
        this.regEBP = temp;
        break;
    case 0x6:
        this.setSS(this.regESI);
        this.regESI = temp;
        break;
    case 0x7:
        this.setDS(this.regEDI);
        this.regEDI = temp;
        break;
    default:
        break;              // there IS no other case, but JavaScript inspections don't know that
    }
};

/**
 * op=0x8F (POP word)
 *
 * @this {X86CPU}
 */
X86.opPOPmw = function POPmw()
{
    /*
     * Like other MOV operations, the destination does not need to be read, just written.
     */
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrpPOPw, this.popWord);
};

/**
 * op=0x90 (NOP, aka XCHG AX,AX)
 *
 * @this {X86CPU}
 */
X86.opNOP = function NOP()
{
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x91 (XCHG AX,CX)
 *
 * @this {X86CPU}
 */
X86.opXCHGCX = function XCHGCX()
{
    var temp = this.regEAX;
    this.regEAX = (I386? (this.regEAX & ~this.dataMask) | (this.regECX & this.dataMask) : this.regECX);
    this.regECX = (I386? (this.regECX & ~this.dataMask) | (temp & this.dataMask) : temp);
    if (BACKTRACK) {
        temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiCL; this.backTrack.btiCL = temp;
        temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiCH; this.backTrack.btiCH = temp;
    }
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x92 (XCHG AX,DX)
 *
 * @this {X86CPU}
 */
X86.opXCHGDX = function XCHGDX()
{
    var temp = this.regEAX;
    this.regEAX = (I386? (this.regEAX & ~this.dataMask) | (this.regEDX & this.dataMask) : this.regEDX);
    this.regEDX = (I386? (this.regEDX & ~this.dataMask) | (temp & this.dataMask) : temp);
    if (BACKTRACK) {
        temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiDL; this.backTrack.btiDL = temp;
        temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiDH; this.backTrack.btiDH = temp;
    }
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x93 (XCHG AX,BX)
 *
 * @this {X86CPU}
 */
X86.opXCHGBX = function XCHGBX()
{
    var temp = this.regEAX;
    this.regEAX = (I386? (this.regEAX & ~this.dataMask) | (this.regEBX & this.dataMask) : this.regEBX);
    this.regEBX = (I386? (this.regEBX & ~this.dataMask) | (temp & this.dataMask) : temp);
    if (BACKTRACK) {
        temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiBL; this.backTrack.btiBL = temp;
        temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiBH; this.backTrack.btiBH = temp;
    }
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x94 (XCHG AX,SP)
 *
 * @this {X86CPU}
 */
X86.opXCHGSP = function XCHGSP()
{
    var temp = this.regEAX;
    var regESP = this.getSP();
    this.regEAX = (I386? (this.regEAX & ~this.dataMask) | (regESP & this.dataMask) : regESP);
    this.setSP((I386? (regESP & ~this.dataMask) | (temp & this.dataMask) : temp));
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiAH = 0;
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x95 (XCHG AX,BP)
 *
 * @this {X86CPU}
 */
X86.opXCHGBP = function XCHGBP()
{
    var temp = this.regEAX;
    this.regEAX = (I386? (this.regEAX & ~this.dataMask) | (this.regEBP & this.dataMask) : this.regEBP);
    this.regEBP = (I386? (this.regEBP & ~this.dataMask) | (temp & this.dataMask) : temp);
    if (BACKTRACK) {
        temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiBPLo; this.backTrack.btiBPLo = temp;
        temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiBPHi; this.backTrack.btiBPHi = temp;
    }
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x96 (XCHG AX,SI)
 *
 * @this {X86CPU}
 */
X86.opXCHGSI = function XCHGSI()
{
    var temp = this.regEAX;
    this.regEAX = (I386? (this.regEAX & ~this.dataMask) | (this.regESI & this.dataMask) : this.regESI);
    this.regESI = (I386? (this.regESI & ~this.dataMask) | (temp & this.dataMask) : temp);
    if (BACKTRACK) {
        temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiSILo; this.backTrack.btiSILo = temp;
        temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiSIHi; this.backTrack.btiSIHi = temp;
    }
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x97 (XCHG AX,DI)
 *
 * @this {X86CPU}
 */
X86.opXCHGDI = function XCHGDI()
{
    var temp = this.regEAX;
    this.regEAX = (I386? (this.regEAX & ~this.dataMask) | (this.regEDI & this.dataMask) : this.regEDI);
    this.regEDI = (I386? (this.regEDI & ~this.dataMask) | (temp & this.dataMask) : temp);
    if (BACKTRACK) {
        temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiDILo; this.backTrack.btiDILo = temp;
        temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiDIHi; this.backTrack.btiDIHi = temp;
    }
    this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
};

/**
 * op=0x98 (CBW/CWDE)
 *
 * NOTE: The 16-bit form (CBW) sign-extends AL into AX, whereas the 32-bit form (CWDE) sign-extends AX into EAX;
 * CWDE is similar to CWD, except that the destination is EAX rather than DX:AX.
 *
 * @this {X86CPU}
 */
X86.opCBW = function CBW()
{
    if (this.dataSize == 2) {
        /*
         * CBW
         */
        this.regEAX = (this.regEAX & ~0xffff) | (((this.regEAX << 24) >> 24) & 0xffff);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiAL;
    } else {
        /*
         * CWDE
         */
        this.regEAX = ((this.regEAX << 16) >> 16);
    }
    this.nStepCycles -= 2;                          // CBW takes 2 cycles on all CPUs through 80286
};

/**
 * op=0x99 (CWD/CDQ)
 *
 * NOTE: The 16-bit form (CWD) sign-extends AX, producing a 32-bit result in DX:AX, while the 32-bit form (CDQ)
 * sign-extends EAX, producing a 64-bit result in EDX:EAX.
 *
 * @this {X86CPU}
 */
X86.opCWD = function CWD()
{
    if (this.dataSize == 2) {
        /*
         * CWD
         */
        this.regEDX = (this.regEDX & ~0xffff) | ((this.regEAX & 0x8000)? 0xffff : 0);
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiDH = this.backTrack.btiAH;
    } else {
        /*
         * CDQ
         */
        this.regEDX = (this.regEAX & (0x80000000|0))? -1 : 0;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesCWD;
};

/**
 * op=0x9A (CALL seg:off)
 *
 * @this {X86CPU}
 */
X86.opCALLF = function CALLF()
{
    X86.fnCALLF.call(this, this.getIPWord(), this.getIPShort());
    this.nStepCycles -= this.CYCLES.nOpCyclesCallF;
};

/**
 * op=0x9B (WAIT)
 *
 * @this {X86CPU}
 */
X86.opWAIT = function WAIT()
{
    this.printMessage("WAIT not implemented");
    this.nStepCycles--;
};

/**
 * op=0x9C (PUSHF)
 *
 * @this {X86CPU}
 */
X86.opPUSHF = function PUSHF()
{
    this.pushWord(this.getPS());
    this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
};

/**
 * op=0x9D (POPF)
 *
 * @this {X86CPU}
 */
X86.opPOPF = function POPF()
{
    this.setPS(this.popWord());
    /*
     * NOTE: I'm assuming that neither POPF nor IRET are required to set NOINTR like STI does.
     */
    this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
};

/**
 * op=0x9E (SAHF)
 *
 * @this {X86CPU}
 */
X86.opSAHF = function SAHF()
{
    /*
     * NOTE: While it make seem more efficient to do this:
     *
     *      this.setPS((this.getPS() & ~X86.PS.SAHF) | ((this.regEAX >> 8) & X86.PS.SAHF));
     *
     * getPS() forces any "cached" flags to be resolved first, and setPS() must do extra work above
     * and beyond setting the arithmetic and logical flags, so on balance, the code below may be more
     * efficient, and may also avoid unexpected side-effects of updating the entire PS register.
     */
    var ah = (this.regEAX >> 8) & 0xff;
    if (ah & X86.PS.CF) this.setCF(); else this.clearCF();
    if (ah & X86.PS.PF) this.setPF(); else this.clearPF();
    if (ah & X86.PS.AF) this.setAF(); else this.clearAF();
    if (ah & X86.PS.ZF) this.setZF(); else this.clearZF();
    if (ah & X86.PS.SF) this.setSF(); else this.clearSF();
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    this.assert((this.getPS() & X86.PS.SAHF) == (ah & X86.PS.SAHF));
};

/**
 * op=0x9F (LAHF)
 *
 * @this {X86CPU}
 */
X86.opLAHF = function LAHF()
{
    this.regEAX = (this.regEAX & ~0xff00) | (this.getPS() & X86.PS.SAHF) << 8;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xA0 (MOV AL,mem)
 *
 * @this {X86CPU}
 */
X86.opMOVALm = function MOVALm()
{
    this.regEAX = (this.regEAX & ~0xff) | this.getSOByte(this.segData, this.getIPWord());
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesMovAM;
};

/**
 * op=0xA1 (MOV AX,mem)
 *
 * @this {X86CPU}
 */
X86.opMOVAXm = function MOVAXm()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | this.getSOWord(this.segData, this.getIPWord());
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesMovAM;
};

/**
 * op=0xA2 (MOV mem,AL)
 *
 * @this {X86CPU}
 */
X86.opMOVmAL = function MOVmAL()
{
    if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
    /*
     * setSOByte() truncates the value as appropriate
     */
    this.setSOByte(this.segData, this.getIPWord(), this.regEAX);
    this.nStepCycles -= this.CYCLES.nOpCyclesMovMA;
};

/**
 * op=0xA3 (MOV mem,AX)
 *
 * @this {X86CPU}
 */
X86.opMOVmAX = function MOVmAX()
{
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
    }
    /*
     * setSOWord() truncates the value as appropriate
     */
    this.setSOWord(this.segData, this.getIPWord(), this.regEAX);
    this.nStepCycles -= this.CYCLES.nOpCyclesMovMA;
};

/**
 * op=0xA4 (MOVSB)
 *
 * @this {X86CPU}
 */
X86.opMOVSb = function MOVSb()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesMovS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesMovSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesMovSr0;
    }
    if (nReps--) {
        var nInc = ((this.regPS & X86.PS.DF)? -1 : 1);
        this.setSOByte(this.segES, this.regEDI & this.addrMask, this.getSOByte(this.segData, this.regESI));
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + nInc) & this.addrMask);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + nInc) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xA5 (MOVSW)
 *
 * @this {X86CPU}
 */
X86.opMOVSw = function MOVSw()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesMovS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesMovSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesMovSr0;
    }
    if (nReps--) {
        var nInc = ((this.regPS & X86.PS.DF)? -this.dataSize : this.dataSize);
        this.setSOWord(this.segES, this.regEDI & this.addrMask, this.getSOWord(this.segData, this.regESI));
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + nInc) & this.addrMask);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + nInc) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xA6 (CMPSB)
 *
 * @this {X86CPU}
 */
X86.opCMPSb = function CMPSb()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesCmpS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesCmpSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesCmpSr0;
    }
    if (nReps--) {
        var nInc = ((this.regPS & X86.PS.DF)? -1 : 1);
        var bDst = this.getEAByte(this.segData, this.regESI & this.addrMask);
        var bSrc = this.modEAByte(this.segES, this.regEDI & this.addrMask);
        X86.fnCMPb.call(this, bDst, bSrc);
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + nInc) & this.addrMask);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + nInc) & this.addrMask);
        /*
         * NOTE: As long as we're calling fnCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
         */
        this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
        this.regECX -= nDelta;
        /*
         * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
         * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
         * two values are equal, we must continue.
         */
        if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
            if (BUGS_8086) {
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xA7 (CMPSW)
 *
 * @this {X86CPU}
 */
X86.opCMPSw = function CMPSw()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesCmpS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesCmpSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesCmpSr0;
    }
    if (nReps--) {
        var nInc = ((this.regPS & X86.PS.DF)? -this.dataSize : this.dataSize);
        var wDst = this.getEAWord(this.segData, this.regESI & this.addrMask);
        var wSrc = this.modEAWord(this.segES, this.regEDI & this.addrMask);
        X86.fnCMPw.call(this, wDst, wSrc);
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + nInc) & this.addrMask);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + nInc) & this.addrMask);
        /*
         * NOTE: As long as we're calling fnCMPw(), all our cycle times must be reduced by nOpCyclesArithRM
         */
        this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
        this.regECX -= nDelta;
        /*
         * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
         * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
         * two values are equal, we must continue.
         */
        if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
            if (BUGS_8086) {
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xA8 (TEST AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opTESTALb = function TESTALb()
{
    this.setLogicResult(this.regEAX & this.getIPByte(), X86.RESULT.BYTE);
    this.nStepCycles -= this.CYCLES.nOpCyclesAAA;
};

/**
 * op=0xA9 (TEST AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opTESTAXw = function TESTAXw()
{
    this.setLogicResult(this.regEAX & this.getIPWord(), X86.RESULT.WORD);
    this.nStepCycles -= this.CYCLES.nOpCyclesAAA;
};

/**
 * op=0xAA (STOSB)
 *
 * NOTES: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
 *
 * @this {X86CPU}
 */
X86.opSTOSb = function STOSb()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesStoS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesStoSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesStoSr0;
    }
    if (nReps--) {
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setSOByte(this.segES, this.regEDI & this.addrMask, this.regEAX);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xAB (STOSW)
 *
 * NOTES: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
 *
 * @this {X86CPU}
 */
X86.opSTOSw = function STOSw()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesStoS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesStoSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesStoSr0;
    }
    if (nReps--) {
        /*
         * NOTE: Storing a word imposes another 4-cycle penalty on the 8088, so consider that
         * if you think the cycle times here are too high.
         */
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setSOWord(this.segES, this.regEDI & this.addrMask, this.regEAX);
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -this.dataSize : this.dataSize)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xAC (LODSB)
 *
 * @this {X86CPU}
 */
X86.opLODSb = function LODSb()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesLodS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesLodSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesLodSr0;
    }
    if (nReps--) {
        this.regEAX = (this.regEAX & ~0xff) | this.getSOByte(this.segData, this.regESI & this.addrMask);
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + ((this.regPS & X86.PS.DF)? -1 : 1)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xAD (LODSW)
 *
 * @this {X86CPU}
 */
X86.opLODSw = function LODSw()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesLodS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesLodSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesLodSr0;
    }
    if (nReps--) {
        this.regEAX = (this.regEAX & ~this.dataMask) | this.getSOWord(this.segData, this.regESI & this.addrMask);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + ((this.regPS & X86.PS.DF)? -this.dataSize : this.dataSize)) & this.addrMask);
        this.nStepCycles -= nCycles;
        this.regECX -= nDelta;
        if (nReps) {
            if (BUGS_8086) {
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xAE (SCASB)
 *
 * @this {X86CPU}
 */
X86.opSCASb = function SCASb()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesScaS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesScaSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesScaSr0;
    }
    if (nReps--) {
        X86.fnCMPb.call(this, this.regEAX & 0xff, this.modEAByte(this.segES, this.regEDI & this.addrMask));
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & this.addrMask);
        /*
         * NOTE: As long as we're calling fnCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
         */
        this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
        this.regECX -= nDelta;
        /*
         * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
         * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
         * two values are equal, we must continue.
         */
        if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xAF (SCASW)
 *
 * @this {X86CPU}
 */
X86.opSCASw = function SCASw()
{
    var nReps = 1;
    var nDelta = 0;
    var nCycles = this.CYCLES.nOpCyclesScaS;
    if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
        nReps = this.regECX;
        nDelta = 1;
        nCycles = this.CYCLES.nOpCyclesScaSrn;
        if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.CYCLES.nOpCyclesScaSr0;
    }
    if (nReps--) {
        X86.fnCMPw.call(this, this.regEAX & this.dataMask, this.modEAWord(this.segES, this.regEDI & this.addrMask));
        this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -this.dataSize : this.dataSize)) & this.addrMask);
        /*
         * NOTE: As long as we're calling fnCMPw(), all our cycle times must be reduced by nOpCyclesArithRM
         */
        this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
        this.regECX -= nDelta;
        /*
         * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
         * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
         * two values are equal, we must continue.
         */
        if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
            if (BUGS_8086) {
                this.advanceIP(-2);                 // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
            } else {
                this.regLIP = this.opLIP;
            }
            this.opFlags |= X86.OPFLAG.REPEAT;
        }
    }
};

/**
 * op=0xB0 (MOV AL,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVALb = function MOVALb()
{
    this.regEAX = (this.regEAX & ~0xff) | this.getIPByte();
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB1 (MOV CL,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVCLb = function MOVCLb()
{
    this.regECX = (this.regECX & ~0xff) | this.getIPByte();
    if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB2 (MOV DL,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVDLb = function MOVDLb()
{
    this.regEDX = (this.regEDX & ~0xff) | this.getIPByte();
    if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB3 (MOV BL,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVBLb = function MOVBLb()
{
    this.regEBX = (this.regEBX & ~0xff) | this.getIPByte();
    if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB4 (MOV AH,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVAHb = function MOVAHb()
{
    this.regEAX = (this.regEAX & 0xff) | (this.getIPByte() << 8);
    if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB5 (MOV CH,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVCHb = function MOVCHb()
{
    this.regECX = (this.regECX & 0xff) | (this.getIPByte() << 8);
    if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB6 (MOV DH,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVDHb = function MOVDHb()
{
    this.regEDX = (this.regEDX & 0xff) | (this.getIPByte() << 8);
    if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB7 (MOV BH,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVBHb = function MOVBHb()
{
    this.regEBX = (this.regEBX & 0xff) | (this.getIPByte() << 8);
    if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB8 (MOV AX,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVAXw = function MOVAXw()
{
    this.regEAX = (this.regEAX & ~this.dataMask) | this.getIPWord();
    if (BACKTRACK) {
        this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xB9 (MOV CX,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVCXw = function MOVCXw()
{
    this.regECX = (this.regECX & ~this.dataMask) | this.getIPWord();
    if (BACKTRACK) {
        this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xBA (MOV DX,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVDXw = function MOVDXw()
{
    this.regEDX = (this.regEDX & ~this.dataMask) | this.getIPWord();
    if (BACKTRACK) {
        this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xBB (MOV BX,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVBXw = function MOVBXw()
{
    this.regEBX = (this.regEBX & ~this.dataMask) | this.getIPWord();
    if (BACKTRACK) {
        this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xBC (MOV SP,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVSPw = function MOVSPw()
{
    this.setSP((this.getSP() & ~this.dataMask) | this.getIPWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xBD (MOV BP,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVBPw = function MOVBPw()
{
    this.regEBP = (this.regEBP & ~this.dataMask) | this.getIPWord();
    if (BACKTRACK) {
        this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xBE (MOV SI,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVSIw = function MOVSIw()
{
    this.regESI = (this.regESI & ~this.dataMask) | this.getIPWord();
    if (BACKTRACK) {
        this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xBF (MOV DI,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVDIw = function MOVDIw()
{
    this.regEDI = (this.regEDI & ~this.dataMask) | this.getIPWord();
    if (BACKTRACK) {
        this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
};

/**
 * op=0xC0 (GRP2 byte,imm8) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opGRP2bn = function GRP2bn()
{
    this.aOpModGrpByte[this.getIPByte()].call(this, X86.aOpGrp2b, X86.fnSrcCountN);
};

/**
 * op=0xC1 (GRP2 word,imm16) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opGRP2wn = function GRP2wn()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp2w, X86.fnSrcCountN);
};

/**
 * op=0xC1 (GRP2 dword,imm16) (80186/80188 and up)
 *
 * @this {X86CPU}
 */
X86.opGRP2dn = function GRP2dn()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp2d, X86.fnSrcCountN);
};

/**
 * op=0xC2 (RET n)
 *
 * @this {X86CPU}
 */
X86.opRETn = function RETn()
{
    var n = this.getIPWord() << (this.dataSize >> 2);
    this.setIP(this.popWord());
    if (n) this.setSP(this.getSP() + n);            // TODO: optimize
    this.nStepCycles -= this.CYCLES.nOpCyclesRetn;
};

/**
 * op=0xC3 (RET)
 *
 * @this {X86CPU}
 */
X86.opRET = function RET()
{
    this.setIP(this.popWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesRet;
};

/**
 * op=0xC4 (LES reg,word)
 *
 * This is like a "MOV reg,rm" operation, but it also loads ES from the next word.
 *
 * @this {X86CPU}
 */
X86.opLES = function LES()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLES);
};

/**
 * op=0xC5 (LDS reg,word)
 *
 * This is like a "MOV reg,rm" operation, but it also loads DS from the next word.
 *
 * @this {X86CPU}
 */
X86.opLDS = function LDS()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLDS);
};

/**
 * op=0xC6 (MOV byte,imm8)
 *
 * @this {X86CPU}
 */
X86.opMOVb = function MOVb()
{
    /*
     * Like other MOV operations, the destination does not need to be read, just written.
     */
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.aOpModGrpByte[this.getIPByte()].call(this, X86.aOpGrpMOVn, this.getIPByte);
};

/**
 * op=0xC7 (MOV word,imm16)
 *
 * @this {X86CPU}
 */
X86.opMOVw = function MOVw()
{
    /*
     * Like other MOV operations, the destination does not need to be read, just written.
     */
    this.opFlags |= X86.OPFLAG.NOREAD;
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrpMOVn, this.getIPWord);
};

/**
 * op=0xC8 (ENTER imm16,imm8) (80186/80188 and up)
 *
 * Here's the pseudo-code from http://www.pcjs.org/pubs/pc/reference/intel/80286/progref, p.B-40 (p.250):
 *
 *      LEVEL := LEVEL MOD 32
 *      Push BP
 *      Set a temporary value FRAME_PTR := SP
 *      If LEVEL > 0 then
 *          Repeat (LEVEL-1) times:
 *              BP := BP - 2
 *              Push the word pointed to by BP
 *          End repeat
 *          Push FRAME_PTR
 *      End if
 *      BP := FRAME_PTR
 *      SP := SP - first operand
 *
 * TODO: Verify that this pseudo-code is identical on the 80186/80188 (eg, is LEVEL MOD 32 performed in both instances?)
 *
 * @this {X86CPU}
 */
X86.opENTER = function ENTER()
{
    var wLocal = this.getIPWord();
    var bLevel = this.getIPByte() & 0x1f;
    /*
     * NOTE: 11 is the minimum cycle time for the 80286; the 80186/80188 has different cycle times: 15, 25 and
     * 22 + 16 * (bLevel - 1) for bLevel 0, 1 and > 1, respectively.  However, accurate cycle times for the 80186/80188
     * is low priority. TODO: Fix this someday.
     */
    this.nStepCycles -= 11;
    this.pushWord(this.regEBP);
    var wFrame = this.getSP() & this.segSS.addrMask;
    if (bLevel > 0) {
        this.nStepCycles -= (bLevel << 2) + (bLevel > 1? 1 : 0);
        while (--bLevel) {
            this.regEBP = (this.regEBP & ~this.segSS.addrMask) | ((this.regEBP - this.dataSize) & this.segSS.addrMask);
            this.pushWord(this.getSOWord(this.segSS, this.regEBP & this.segSS.addrMask));
        }
        this.pushWord(wFrame);
    }
    this.regEBP = (this.regEBP & ~this.segSS.addrMask) | wFrame;
    this.setSP((this.getSP() & ~this.segSS.addrMask) | ((this.getSP() - wLocal) & this.segSS.addrMask));
};

/**
 * op=0xC9 (LEAVE) (80186/80188 and up)
 *
 * Set SP to BP, then pop BP.
 *
 * @this {X86CPU}
 */
X86.opLEAVE = function LEAVE()
{
    this.setSP((this.getSP() & ~this.segSS.addrMask) | (this.regEBP & this.segSS.addrMask));
    this.regEBP = (this.regEBP & ~this.dataMask) | (this.popWord() & this.dataMask);
    /*
     * NOTE: 5 is the cycle time for the 80286; the 80186/80188 has a cycle time of 8.  However, accurate cycle
     * counts for the 80186/80188 is low priority. TODO: Fix this someday.
     */
    this.nStepCycles -= 5;
};

/**
 * op=0xCA (RETF n)
 *
 * @this {X86CPU}
 */
X86.opRETFn = function RETFn()
{
    X86.fnRETF.call(this, this.getIPWord());
    this.nStepCycles -= this.CYCLES.nOpCyclesRetFn;
};

/**
 * op=0xCB (RETF)
 *
 * @this {X86CPU}
 */
X86.opRETF = function RETF()
{
    X86.fnRETF.call(this, 0);
    this.nStepCycles -= this.CYCLES.nOpCyclesRetF;
};

/**
 * op=0xCC (INT 3)
 *
 * @this {X86CPU}
 */
X86.opINT3 = function INT3()
{
    X86.fnINT.call(this, X86.EXCEPTION.BREAKPOINT, null, this.CYCLES.nOpCyclesInt3D);
};

/**
 * op=0xCD (INT n)
 *
 * @this {X86CPU}
 */
X86.opINTn = function INTn()
{
    var nInt = this.getIPByte();
    if (this.checkIntNotify(nInt)) {
        X86.fnINT.call(this, nInt, null, 0);
        return;
    }
    this.nStepCycles--;     // we don't need to assess the full cost of nOpCyclesInt, but we need to assess something...
};

/**
 * op=0xCE (INTO: INT 4 if OF set)
 *
 * @this {X86CPU}
 */
X86.opINTO = function INTO()
{
    if (this.getOF()) {
        X86.fnINT.call(this, X86.EXCEPTION.OVERFLOW, null, this.CYCLES.nOpCyclesIntOD);
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesIntOFall;
};

/**
 * op=0xCF (IRET)
 *
 * @this {X86CPU}
 */
X86.opIRET = function IRET()
{
    X86.fnIRET.call(this);
};

/**
 * op=0xD0 (GRP2 byte,1)
 *
 * @this {X86CPU}
 */
X86.opGRP2b1 = function GRP2b1()
{
    this.aOpModGrpByte[this.getIPByte()].call(this, X86.aOpGrp2b, X86.fnSrcCount1);
};

/**
 * op=0xD1 (GRP2 word,1)
 *
 * @this {X86CPU}
 */
X86.opGRP2w1 = function GRP2w1()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp2w, X86.fnSrcCount1);
};

/**
 * op=0xD1 (GRP2 dword,1)
 *
 * @this {X86CPU}
 */
X86.opGRP2d1 = function GRP2d1()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp2d, X86.fnSrcCount1);
};

/**
 * op=0xD2 (GRP2 byte,CL)
 *
 * @this {X86CPU}
 */
X86.opGRP2bCL = function GRP2bCL()
{
    this.aOpModGrpByte[this.getIPByte()].call(this, X86.aOpGrp2b, X86.fnSrcCountCL);
};

/**
 * op=0xD3 (GRP2 word,CL)
 *
 * @this {X86CPU}
 */
X86.opGRP2wCL = function GRP2wCL()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp2w, X86.fnSrcCountCL);
};

/**
 * op=0xD3 (GRP2 dword,CL)
 *
 * @this {X86CPU}
 */
X86.opGRP2dCL = function GRP2dCL()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp2d, X86.fnSrcCountCL);
};

/**
 * op=0xD4 0x0A (AAM)
 *
 * From "The 8086 Book":
 *
 *  1. Divide AL by 0x0A; store the quotient in AH and the remainder in AL
 *  2. Set PF, SF, and ZF based on the AL register (CF, OF, and AF are undefined)
 *
 * @this {X86CPU}
 */
X86.opAAM = function AAM()
{
    var bDivisor = this.getIPByte();
    if (!bDivisor) {
        /*
         * TODO: Generate a divide-by-zero exception, if appropriate for the current CPU
         */
        return;
    }
    var AL = this.regEAX & 0xff;
    this.regEAX = (this.regEAX & ~0xffff) | ((AL / bDivisor) << 8) | (AL % bDivisor);
    /*
     * setLogicResult() is slightly overkill, because technically, we don't need to clear CF and OF....
     */
    this.setLogicResult(this.regEAX, X86.RESULT.BYTE);
    this.nStepCycles -= this.CYCLES.nOpCyclesAAM;
};

/**
 * op=0xD5 (AAD)
 *
 * From "The 8086 Book":
 *
 *  1. Multiply AH by 0x0A, add AH to AL, and store 0x00 in AH
 *  2. Set PF, SF, and ZF based on the AL register (CF, OF, and AF are undefined)
 *
 * @this {X86CPU}
 */
X86.opAAD = function AAD()
{
    var bMultiplier = this.getIPByte();
    this.regEAX = (this.regEAX & ~0xffff) | (((((this.regEAX >> 8) & 0xff) * bMultiplier) + this.regEAX) & 0xff);
    /*
     * setLogicResult() is slightly overkill, because technically, we don't need to clear CF and OF....
     */
    this.setLogicResult(this.regEAX, X86.RESULT.BYTE);
    this.nStepCycles -= this.CYCLES.nOpCyclesAAD;
};

/**
 * op=0xD6 (SALC aka SETALC) (undocumented until Pentium Pro)
 *
 * Sets AL to 0xFF if CF=1, 0x00 otherwise; no flags are affected (similar to SBB AL,AL, but without side-effects)
 *
 * WARNING: I have no idea how many clocks this instruction originally consumed, so for now, I'm going with the minimum of 2.
 *
 * @this {X86CPU}
 */
X86.opSALC = function SALC()
{
    this.regEAX = (this.regEAX & ~0xff) | (this.getCF()? 0xFF : 0);
    this.nStepCycles -= 2;
};

/**
 * op=0xD7 (XLAT)
 *
 * @this {X86CPU}
 */
X86.opXLAT = function XLAT()
{
    /*
     * NOTE: I have no idea whether XLAT actually wraps the 16-bit address calculation;
     * I'm masking it as if it does, but I need to run a test on real hardware to be sure.
     */
    this.regEAX = (this.regEAX & ~0xff) | this.getEAByte(this.segData, ((this.regEBX + (this.regEAX & 0xff)) & 0xffff));
    this.nStepCycles -= this.CYCLES.nOpCyclesXLAT;
};

/**
 * op=0xD8-0xDF (ESC)
 *
 * @this {X86CPU}
 */
X86.opESC = function ESC()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnESC);
    this.nStepCycles -= 8;      // TODO: Fix
};

/**
 * op=0xE0 (LOOPNZ disp)
 *
 * @this {X86CPU}
 */
X86.opLOOPNZ = function LOOPNZ()
{
    var disp = this.getIPDisp();
    if ((this.regECX = (this.regECX - 1) & this.addrMask) && !this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesLoopNZ;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLoopFall;
};

/**
 * op=0xE1 (LOOPZ disp)
 *
 * @this {X86CPU}
 */
X86.opLOOPZ = function LOOPZ()
{
    var disp = this.getIPDisp();
    if ((this.regECX = (this.regECX - 1) & this.addrMask) && this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesLoopZ;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLoopZFall;
};

/**
 * op=0xE2 (LOOP disp)
 *
 * @this {X86CPU}
 */
X86.opLOOP = function LOOP()
{
    var disp = this.getIPDisp();
    if ((this.regECX = (this.regECX - 1) & this.addrMask)) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesLoop;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLoopFall;
};

/**
 * op=0xE3 (JCXZ disp)
 *
 * @this {X86CPU}
 */
X86.opJCXZ = function JCXZ()
{
    var disp = this.getIPDisp();
    if (!this.regECX) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesLoopZ;
        return;
    }
    this.nStepCycles -= this.CYCLES.nOpCyclesLoopZFall;
};

/**
 * op=0xE4 (IN AL,port)
 *
 * @this {X86CPU}
 */
X86.opINb = function INb()
{
    var port = this.getIPByte();
    this.regEAX = (this.regEAX & ~0xff) | this.bus.checkPortInputNotify(port, this.regLIP - 2);
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
    this.nStepCycles -= this.CYCLES.nOpCyclesInP;
};

/**
 * op=0xE5 (IN AX,port)
 *
 * @this {X86CPU}
 */
X86.opINw = function INw()
{
    var port = this.getIPByte();
    this.regEAX = this.bus.checkPortInputNotify(port, this.regLIP - 2);
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
    this.regEAX |= (this.bus.checkPortInputNotify((port + 1) & 0xffff, this.regLIP - 2) << 8);
    if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiIO;
    this.nStepCycles -= this.CYCLES.nOpCyclesInP;
};

/**
 * op=0xE6 (OUT port,AL)
 *
 * @this {X86CPU}
 */
X86.opOUTb = function OUTb()
{
    var port = this.getIPByte();
    this.bus.checkPortOutputNotify(port, this.regEAX & 0xff, this.regLIP - 2);
    this.nStepCycles -= this.CYCLES.nOpCyclesOutP;
};

/**
 * op=0xE7 (OUT port,AX)
 *
 * @this {X86CPU}
 */
X86.opOUTw = function OUTw()
{
    var port = this.getIPByte();
    this.bus.checkPortOutputNotify(port, this.regEAX & 0xff, this.regLIP - 2);
    this.bus.checkPortOutputNotify((port + 1) & 0xffff, this.regEAX >> 8, this.regLIP - 2);
    this.nStepCycles -= this.CYCLES.nOpCyclesOutP;
};

/**
 * op=0xE8 (CALL disp16)
 *
 * @this {X86CPU}
 */
X86.opCALL = function CALL()
{
    var disp = this.getIPWord();
    this.pushWord(this.getIP());
    this.setIP(this.getIP() + disp);
    this.nStepCycles -= this.CYCLES.nOpCyclesCall;
};

/**
 * op=0xE9 (JMP disp16)
 *
 * @this {X86CPU}
 */
X86.opJMP = function JMP()
{
    var disp = this.getIPWord();
    this.setIP(this.getIP() + disp);
    this.nStepCycles -= this.CYCLES.nOpCyclesJmp;
};

/**
 * op=0xEA (JMP seg:off)
 *
 * @this {X86CPU}
 */
X86.opJMPF = function JMPF()
{
    this.setCSIP(this.getIPWord(), this.getIPShort());
    this.nStepCycles -= this.CYCLES.nOpCyclesJmpF;
};

/**
 * op=0xEB (JMP short disp8)
 *
 * @this {X86CPU}
 */
X86.opJMPs = function JMPs()
{
    var disp = this.getIPDisp();
    this.setIP(this.getIP() + disp);
    this.nStepCycles -= this.CYCLES.nOpCyclesJmp;
};

/**
 * op=0xEC (IN AL,dx)
 *
 * @this {X86CPU}
 */
X86.opINDXb = function INDXb()
{
    this.regEAX = (this.regEAX & ~0xff) | this.bus.checkPortInputNotify(this.regEDX, this.regLIP - 1);
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
    this.nStepCycles -= this.CYCLES.nOpCyclesInDX;
};

/**
 * op=0xED (IN AX,dx)
 *
 * @this {X86CPU}
 */
X86.opINDXw = function INDXw()
{
    this.regEAX = this.bus.checkPortInputNotify(this.regEDX, this.regLIP - 1);
    if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
    this.regEAX |= (this.bus.checkPortInputNotify((this.regEDX + 1) & 0xffff, this.regLIP - 1) << 8);
    if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiIO;
    this.nStepCycles -= this.CYCLES.nOpCyclesInDX;
};

/**
 * op=0xEE (OUT dx,AL)
 *
 * @this {X86CPU}
 */
X86.opOUTDXb = function OUTDXb()
{
    if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiAL;
    this.bus.checkPortOutputNotify(this.regEDX, this.regEAX & 0xff, this.regLIP - 1);
    this.nStepCycles -= this.CYCLES.nOpCyclesOutDX;
};

/**
 * op=0xEF (OUT dx,AX)
 *
 * @this {X86CPU}
 */
X86.opOUTDXw = function OUTDXw()
{
    if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiAL;
    this.bus.checkPortOutputNotify(this.regEDX, this.regEAX & 0xff, this.regLIP - 1);
    if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiAH;
    this.bus.checkPortOutputNotify((this.regEDX + 1) & 0xffff, this.regEAX >> 8, this.regLIP - 1);
    this.nStepCycles -= this.CYCLES.nOpCyclesOutDX;
};

/**
 * op=0xF0 (LOCK:)
 *
 * @this {X86CPU}
 */
X86.opLOCK = function LOCK()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with LOCK is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.LOCK | X86.OPFLAG.NOINTR;
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
};

/**
 * op=0xF1 (INT1; undocumented; 80186/80188 and up; TODO: Verify)
 *
 * I still treat this as undefined, until I can verify the behavior on real hardware.
 *
 * @this {X86CPU}
 */
X86.opINT1 = function INT1()
{
    X86.opUndefined.call(this);
};

/**
 * op=0xF2 (REPNZ:) (repeat CMPS or SCAS until NZ; repeat MOVS, LODS, or STOS unconditionally)
 *
 * @this {X86CPU}
 */
X86.opREPNZ = function REPNZ()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with REPNZ is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.REPNZ | X86.OPFLAG.NOINTR;
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
};

/**
 * op=0xF3 (REPZ:) (repeat CMPS or SCAS until Z; repeat MOVS, LODS, or STOS unconditionally)
 *
 * @this {X86CPU}
 */
X86.opREPZ = function REPZ()
{
    /*
     * NOTE: The fact that we're setting NOINTR along with REPZ is really just for documentation purposes;
     * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
     */
    this.opFlags |= X86.OPFLAG.REPZ | X86.OPFLAG.NOINTR;
    this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
};

/**
 * op=0xF4 (HLT)
 *
 * @this {X86CPU}
 */
X86.opHLT = function HLT()
{
    /*
     * The CPU is never REALLY halted by a HLT instruction; instead, by setting X86.INTFLAG.HALT,
     * we are signalling to stepCPU() that it's free to end the current burst AND that it should not
     * execute any more instructions until checkINTR() indicates a hardware interrupt is requested.
     */
    this.intFlags |= X86.INTFLAG.HALT;
    this.nStepCycles -= 2;
    /*
     * If a Debugger is present AND Debugger checks are enabled (eg, one or more breakpoints are set,
     * or the global DEBUG flag is set, etc), then we REALLY halt the CPU, on the theory that whoever's
     * using the Debugger would like to see HLTs.
     */
    if (DEBUGGER && this.dbg && this.dbg.checksEnabled(true)) {
        this.advanceIP(-1);     // this is purely for the Debugger's benefit, to show the HLT
        this.stopCPU();
        return;
    }
    /*
     * We also REALLY halt the machine if interrupts have been disabled, since that means it's dead
     * in the water (we have no NMI generation mechanism at the moment).
     */
    if (!this.getIF()) {
        if (DEBUGGER && this.dbg) this.advanceIP(-1);
        this.stopCPU();
     // return;
    }
};

/**
 * op=0xF5 (CMC)
 *
 * @this {X86CPU}
 */
X86.opCMC = function CMC()
{
    if (this.getCF()) this.clearCF(); else this.setCF();
    this.nStepCycles -= 2;                          // CMC takes 2 cycles on all CPUs
};

/**
 * op=0xF6 (GRP3 byte)
 *
 * The MUL byte instruction is problematic in two cases:
 *
 *      0xF6 0xE0:  MUL AL
 *      0xF6 0xE4:  MUL AH
 *
 * because the OpModGrpByte decoder function will attempt to put the fnMULb() function's
 * return value back into AL or AH, undoing fnMULb's update of AX.  And since fnMULb doesn't
 * know what the target is (only the target's value), it cannot easily work around the problem.
 *
 * A simple, albeit kludgy, solution is for fnMULb to always save its result in a special
 * "register" (eg, regMD16), which we will then put back into regEAX if it's been updated.
 * This also relieves us from having to decode any part of the ModRM byte, so maybe it's not
 * such a bad work-around after all.
 *
 * Similar issues with IMUL (and DIV and IDIV) are resolved using the same special variable(s).
 *
 * @this {X86CPU}
 */
X86.opGRP3b = function GRP3b()
{
    this.regMD16 = -1;
    this.aOpModGrpByte[this.getIPByte()].call(this, X86.aOpGrp3b, X86.fnSrcNone);
    if (this.regMD16 >= 0) this.regEAX = this.regMD16;
};

/**
 * op=0xF7 (GRP3 word)
 *
 * The MUL word instruction is problematic in two cases:
 *
 *      0xF7 0xE0:  MUL AX
 *      0xF7 0xE2:  MUL DX
 *
 * because the OpModGrpWord decoder function will attempt to put the fnMULw() function's
 * return value back into AX or DX, undoing fnMULw's update of DX:AX.  And since fnMULw doesn't
 * know what the target is (only the target's value), it cannot easily work around the problem.
 *
 * A simple, albeit kludgey, solution is for fnMULw to always save its result in a special
 * "register" (eg, regMD16/regMD32), which we will then put back into regEAX/regEDX if it's been
 * updated.  This also relieves us from having to decode any part of the ModRM byte, so maybe
 * it's not such a bad work-around after all.
 *
 * @this {X86CPU}
 */
X86.opGRP3w = function GRP3w()
{
    this.regMD16 = -1;
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp3w, X86.fnSrcNone);
    if (this.regMD16 >= 0) {
        this.regEAX = this.regMD16;
        this.regEDX = this.regMD32;
    }
};

/**
 * op=0xF8 (CLC)
 *
 * @this {X86CPU}
 */
X86.opCLC = function CLC()
{
    this.clearCF();
    this.nStepCycles -= 2;                          // CLC takes 2 cycles on all CPUs
};

/**
 * op=0xF9 (STC)
 *
 * @this {X86CPU}
 */
X86.opSTC = function STC()
{
    this.setCF();
    this.nStepCycles -= 2;                          // STC takes 2 cycles on all CPUs
};

/**
 * op=0xFA (CLI)
 *
 * @this {X86CPU}
 */
X86.opCLI = function CLI()
{
    this.clearIF();
    this.nStepCycles -= this.CYCLES.nOpCyclesCLI;   // CLI takes LONGER on an 80286
};

/**
 * op=0xFB (STI)
 *
 * @this {X86CPU}
 */
X86.opSTI = function STI()
{
    this.setIF();
    this.opFlags |= X86.OPFLAG.NOINTR;
    this.nStepCycles -= 2;                          // STI takes 2 cycles on all CPUs
};

/**
 * op=0xFC (CLD)
 *
 * @this {X86CPU}
 */
X86.opCLD = function CLD()
{
    this.clearDF();
    this.nStepCycles -= 2;                          // CLD takes 2 cycles on all CPUs
};

/**
 * op=0xFD (STD)
 *
 * @this {X86CPU}
 */
X86.opSTD = function STD()
{
    this.setDF();
    this.nStepCycles -= 2;                          // STD takes 2 cycles on all CPUs
};

/**
 * op=0xFE (GRP4 byte)
 *
 * @this {X86CPU}
 */
X86.opGRP4b = function GRP4b()
{
    this.aOpModGrpByte[this.getIPByte()].call(this, X86.aOpGrp4b, X86.fnSrcNone);
};

/**
 * op=0xFF (GRP4 word)
 *
 * @this {X86CPU}
 */
X86.opGRP4w = function GRP4w()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp4w, X86.fnSrcNone);
};

/**
 * opInvalid()
 *
 * @this {X86CPU}
 */
X86.opInvalid = function()
{
    X86.fnFault.call(this, X86.EXCEPTION.UD_FAULT);
    this.stopCPU();
};

/**
 * opUndefined()
 *
 * @this {X86CPU}
 */
X86.opUndefined = function()
{
    this.setIP(this.opLIP - this.segCS.base);
    this.setError("Undefined opcode " + str.toHexByte(this.bus.getByteDirect(this.regLIP)) + " at " + str.toHexLong(this.regLIP));
    this.stopCPU();
};

/**
 * opTBD()
 *
 * @this {X86CPU}
 */
X86.opTBD = function()
{
    this.printMessage("unimplemented 80386 opcode", true);
    this.stopCPU();
};

/*
 * This 256-entry array of opcode functions is at the heart of the CPU engine: stepCPU(n).
 *
 * It might be worth trying a switch() statement instead, to see how the performance compares,
 * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
 * money on array lookup.
 */
X86.aOps = [
    X86.opADDmb,            X86.opADDmw,            X86.opADDrb,            X86.opADDrw,        // 0x00-0x03
    X86.opADDALb,           X86.opADDAXw,           X86.opPUSHES,           X86.opPOPES,        // 0x04-0x07
    X86.opORmb,             X86.opORmw,             X86.opORrb,             X86.opORrw,         // 0x08-0x0B
    X86.opORALb,            X86.opORAXw,            X86.opPUSHCS,           X86.opPOPCS,        // 0x0C-0x0F
    X86.opADCmb,            X86.opADCmw,            X86.opADCrb,            X86.opADCrw,        // 0x10-0x13
    X86.opADCALb,           X86.opADCAXw,           X86.opPUSHSS,           X86.opPOPSS,        // 0x14-0x17
    X86.opSBBmb,            X86.opSBBmw,            X86.opSBBrb,            X86.opSBBrw,        // 0x18-0x1B
    X86.opSBBALb,           X86.opSBBAXw,           X86.opPUSHDS,           X86.opPOPDS,        // 0x1C-0x1F
    X86.opANDmb,            X86.opANDmw,            X86.opANDrb,            X86.opANDrw,        // 0x20-0x23
    X86.opANDAL,            X86.opANDAX,            X86.opES,               X86.opDAA,          // 0x24-0x27
    X86.opSUBmb,            X86.opSUBmw,            X86.opSUBrb,            X86.opSUBrw,        // 0x28-0x2B
    X86.opSUBALb,           X86.opSUBAXw,           X86.opCS,               X86.opDAS,          // 0x2C-0x2F
    X86.opXORmb,            X86.opXORmw,            X86.opXORrb,            X86.opXORrw,        // 0x30-0x33
    X86.opXORALb,           X86.opXORAXw,           X86.opSS,               X86.opAAA,          // 0x34-0x37
    X86.opCMPmb,            X86.opCMPmw,            X86.opCMPrb,            X86.opCMPrw,        // 0x38-0x3B
    X86.opCMPALb,           X86.opCMPAXw,           X86.opDS,               X86.opAAS,          // 0x3C-0x3F
    X86.opINCAX,            X86.opINCCX,            X86.opINCDX,            X86.opINCBX,        // 0x40-0x43
    X86.opINCSP,            X86.opINCBP,            X86.opINCSI,            X86.opINCDI,        // 0x44-0x47
    X86.opDECAX,            X86.opDECCX,            X86.opDECDX,            X86.opDECBX,        // 0x48-0x4B
    X86.opDECSP,            X86.opDECBP,            X86.opDECSI,            X86.opDECDI,        // 0x4C-0x4F
    X86.opPUSHAX,           X86.opPUSHCX,           X86.opPUSHDX,           X86.opPUSHBX,       // 0x50-0x53
    X86.opPUSHSP_8086,      X86.opPUSHBP,           X86.opPUSHSI,           X86.opPUSHDI,       // 0x54-0x57
    X86.opPOPAX,            X86.opPOPCX,            X86.opPOPDX,            X86.opPOPBX,        // 0x58-0x5B
    X86.opPOPSP,            X86.opPOPBP,            X86.opPOPSI,            X86.opPOPDI,        // 0x5C-0x5F
    /*
     * On an 8086/8088, opcodes 0x60-0x6F are aliases for the conditional jumps 0x70-0x7F.  Sometimes you'll see
     * references to these opcodes (like 0x60) being a "two-byte NOP" and using them differentiate an 8088 from newer
     * CPUs, but they're only a "two-byte NOP" if the second byte is zero, resulting in zero displacement.
     */
    X86.opJO,               X86.opJNO,              X86.opJC,               X86.opJNC,          // 0x60-0x63
    X86.opJZ,               X86.opJNZ,              X86.opJBE,              X86.opJNBE,         // 0x64-0x67
    X86.opJS,               X86.opJNS,              X86.opJP,               X86.opJNP,          // 0x68-0x6B
    X86.opJL,               X86.opJNL,              X86.opJLE,              X86.opJNLE,         // 0x6C-0x6F
    X86.opJO,               X86.opJNO,              X86.opJC,               X86.opJNC,          // 0x70-0x73
    X86.opJZ,               X86.opJNZ,              X86.opJBE,              X86.opJNBE,         // 0x74-0x77
    X86.opJS,               X86.opJNS,              X86.opJP,               X86.opJNP,          // 0x78-0x7B
    X86.opJL,               X86.opJNL,              X86.opJLE,              X86.opJNLE,         // 0x7C-0x7F
    /*
     * On all processors, opcode groups 0x80 and 0x82 perform identically (0x82 opcodes sign-extend their
     * immediate data, but since both 0x80 and 0x82 are byte operations, the sign extension has no effect).
     *
     * WARNING: Intel's "Pentium Processor User's Manual (Volume 3: Architecture and Programming Manual)" refers
     * to opcode 0x82 as a "reserved" instruction, but also cryptically refers to it as "MOVB AL,imm".  This is
     * assumed to be an error in the manual, because as far as I know, 0x82 has always mirrored 0x80.
     */
    X86.opGRP1b,            X86.opGRP1w,            X86.opGRP1b,            X86.opGRP1sw,       // 0x80-0x83
    X86.opTESTrb,           X86.opTESTrw,           X86.opXCHGrb,           X86.opXCHGrw,       // 0x84-0x87
    X86.opMOVmb,            X86.opMOVmw,            X86.opMOVrb,            X86.opMOVrw,        // 0x88-0x8B
    X86.opMOVwsr,           X86.opLEA,              X86.opMOVsrw,           X86.opPOPmw,        // 0x8C-0x8F
    X86.opNOP,              X86.opXCHGCX,           X86.opXCHGDX,           X86.opXCHGBX,       // 0x90-0x93
    X86.opXCHGSP,           X86.opXCHGBP,           X86.opXCHGSI,           X86.opXCHGDI,       // 0x94-0x97
    X86.opCBW,              X86.opCWD,              X86.opCALLF,            X86.opWAIT,         // 0x98-0x9B
    X86.opPUSHF,            X86.opPOPF,             X86.opSAHF,             X86.opLAHF,         // 0x9C-0x9F
    X86.opMOVALm,           X86.opMOVAXm,           X86.opMOVmAL,           X86.opMOVmAX,       // 0xA0-0xA3
    X86.opMOVSb,            X86.opMOVSw,            X86.opCMPSb,            X86.opCMPSw,        // 0xA4-0xA7
    X86.opTESTALb,          X86.opTESTAXw,          X86.opSTOSb,            X86.opSTOSw,        // 0xA8-0xAB
    X86.opLODSb,            X86.opLODSw,            X86.opSCASb,            X86.opSCASw,        // 0xAC-0xAF
    X86.opMOVALb,           X86.opMOVCLb,           X86.opMOVDLb,           X86.opMOVBLb,       // 0xB0-0xB3
    X86.opMOVAHb,           X86.opMOVCHb,           X86.opMOVDHb,           X86.opMOVBHb,       // 0xB4-0xB7
    X86.opMOVAXw,           X86.opMOVCXw,           X86.opMOVDXw,           X86.opMOVBXw,       // 0xB8-0xBB
    X86.opMOVSPw,           X86.opMOVBPw,           X86.opMOVSIw,           X86.opMOVDIw,       // 0xBC-0xBF
    /*
     * On an 8086/8088, opcodes 0xC0 -> 0xC2, 0xC1 -> 0xC3, 0xC8 -> 0xCA and 0xC9 -> 0xCB.
     */
    X86.opRETn,             X86.opRET,              X86.opRETn,             X86.opRET,          // 0xC0-0xC3
    X86.opLES,              X86.opLDS,              X86.opMOVb,             X86.opMOVw,         // 0xC4-0xC7
    X86.opRETFn,            X86.opRETF,             X86.opRETFn,            X86.opRETF,         // 0xC8-0xCB
    X86.opINT3,             X86.opINTn,             X86.opINTO,             X86.opIRET,         // 0xCC-0xCF
    X86.opGRP2b1,           X86.opGRP2w1,           X86.opGRP2bCL,          X86.opGRP2wCL,      // 0xD0-0xD3
    /*
     * Even as of the Pentium, opcode 0xD6 is still marked as "reserved", but it's always been SALC (aka SETALC).
     */
    X86.opAAM,              X86.opAAD,              X86.opSALC,             X86.opXLAT,         // 0xD4-0xD7
    X86.opESC,              X86.opESC,              X86.opESC,              X86.opESC,          // 0xD8-0xDB
    X86.opESC,              X86.opESC,              X86.opESC,              X86.opESC,          // 0xDC-0xDF
    X86.opLOOPNZ,           X86.opLOOPZ,            X86.opLOOP,             X86.opJCXZ,         // 0xE0-0xE3
    X86.opINb,              X86.opINw,              X86.opOUTb,             X86.opOUTw,         // 0xE4-0xE7
    X86.opCALL,             X86.opJMP,              X86.opJMPF,             X86.opJMPs,         // 0xE8-0xEB
    X86.opINDXb,            X86.opINDXw,            X86.opOUTDXb,           X86.opOUTDXw,       // 0xEC-0xEF
    /*
     * On an 8086/8088, opcode 0xF1 is believed to be an alias for 0xF0; in any case, it definitely behaves like
     * a prefix on those processors, so we treat it as such.  On the 80186 and up, we treat as opINT1().
     *
     * As of the Pentium, opcode 0xF1 is still marked "reserved".
     */
    X86.opLOCK,             X86.opLOCK,             X86.opREPNZ,            X86.opREPZ,         // 0xF0-0xF3
    X86.opHLT,              X86.opCMC,              X86.opGRP3b,            X86.opGRP3w,        // 0xF4-0xF7
    X86.opCLC,              X86.opSTC,              X86.opCLI,              X86.opSTI,          // 0xF8-0xFB
    X86.opCLD,              X86.opSTD,              X86.opGRP4b,            X86.opGRP4w         // 0xFC-0xFF
];

/*
 * A word (or two) on instruction groups (eg, Grp1, Grp2), which are groups of instructions that
 * use a mod/reg/rm byte, where the reg field of that byte selects a function rather than a register.
 *
 * I start with the groupings used by Intel's "Pentium Processor User's Manual (Volume 3: Architecture
 * and Programming Manual)", but I deviate slightly, mostly by subdividing their groups with letter suffixes:
 *
 *      Opcodes     Intel       PCjs                                                PC Mag TechRef
 *      -------     -----       ----                                                --------------
 *      0x80-0x83   Grp1        Grp1b and Grp1w                                     Group A
 *      0xC0-0xC1   Grp2        Grp2b and Grp2w (opGRP2bn/wn)                       Group B
 *      0xD0-0xD3   Grp2        Grp2b and Grp2w (opGRP2b1/w1 and opGRP2bCL/wCL)     Group B
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
 *
 * To the above list, I also add these "groups of 1": opcode 0x8F uses GrpPOPw, and opcodes 0xC6/0xC7 use
 * GrpMOVn.  In both of these groups, the only valid (documented) instruction is where reg=0x0.
 *
 * TODO: Test what happens on real hardware when the reg field is non-zero for opcodes 0x8F and 0xC6/0xC7.
 */
X86.aOpGrp1b = [
    X86.fnADDb,             X86.fnORb,              X86.fnADCb,             X86.fnSBBb,             // 0x80/0x82(reg=0x0-0x3)
    X86.fnANDb,             X86.fnSUBb,             X86.fnXORb,             X86.fnCMPb              // 0x80/0x82(reg=0x4-0x7)
];

X86.aOpGrp1w = [
    X86.fnADDw,             X86.fnORw,              X86.fnADCw,             X86.fnSBBw,             // 0x81/0x83(reg=0x0-0x3)
    X86.fnANDw,             X86.fnSUBw,             X86.fnXORw,             X86.fnCMPw              // 0x81/0x83(reg=0x4-0x7)
];

X86.aOpGrpPOPw = [
    X86.fnPOPw,             X86.fnGRPFault,         X86.fnGRPFault,         X86.fnGRPFault,         // 0x8F(reg=0x0-0x3)
    X86.fnGRPFault,         X86.fnGRPFault,         X86.fnGRPFault,         X86.fnGRPFault          // 0x8F(reg=0x4-0x7)
];

X86.aOpGrpMOVn = [
    X86.fnMOVn,             X86.fnGRPUndefined,     X86.fnGRPUndefined,     X86.fnGRPUndefined,     // 0xC6/0xC7(reg=0x0-0x3)
    X86.fnGRPUndefined,     X86.fnGRPUndefined,     X86.fnGRPUndefined,     X86.fnGRPUndefined      // 0xC6/0xC7(reg=0x4-0x7)
];

X86.aOpGrp2b = [
    X86.fnROLb,             X86.fnRORb,             X86.fnRCLb,             X86.fnRCRb,             // 0xD0/0xD2(reg=0x0-0x3)
    X86.fnSHLb,             X86.fnSHRb,             X86.fnGRPUndefined,     X86.fnSARb              // 0xD0/0xD2(reg=0x4-0x7)
];

X86.aOpGrp2w = [
    X86.fnROLw,             X86.fnRORw,             X86.fnRCLw,             X86.fnRCRw,             // 0xD1/0xD3(reg=0x0-0x3)
    X86.fnSHLw,             X86.fnSHRw,             X86.fnGRPUndefined,     X86.fnSARw              // 0xD1/0xD3(reg=0x4-0x7)
];

X86.aOpGrp2d = [
    X86.fnTBD,              X86.fnTBD,              X86.fnRCLd,             X86.fnRCRd,             // 0xD1/0xD3(reg=0x0-0x3)
    X86.fnTBD,              X86.fnTBD,              X86.fnGRPUndefined,     X86.fnTBD               // 0xD1/0xD3(reg=0x4-0x7)
];

X86.aOpGrp3b = [
    X86.fnTEST8,            X86.fnGRPUndefined,     X86.fnNOTb,             X86.fnNEGb,             // 0xF6(reg=0x0-0x3)
    X86.fnMULb,             X86.fnIMULb,            X86.fnDIVb,             X86.fnIDIVb             // 0xF6(reg=0x4-0x7)
];

X86.aOpGrp3w = [
    X86.fnTEST16,           X86.fnGRPUndefined,     X86.fnNOTw,             X86.fnNEGw,             // 0xF7(reg=0x0-0x3)
    X86.fnMULw,             X86.fnIMULw,            X86.fnDIVw,             X86.fnIDIVw             // 0xF7(reg=0x4-0x7)
];

X86.aOpGrp4b = [
    X86.fnINCb,             X86.fnDECb,             X86.fnGRPUndefined,     X86.fnGRPUndefined,     // 0xFE(reg=0x0-0x3)
    X86.fnGRPUndefined,     X86.fnGRPUndefined,     X86.fnGRPUndefined,     X86.fnGRPUndefined      // 0xFE(reg=0x4-0x7)
];

X86.aOpGrp4w = [
    X86.fnINCw,             X86.fnDECw,             X86.fnCALLw,            X86.fnCALLFdw,          // 0xFF(reg=0x0-0x3)
    X86.fnJMPw,             X86.fnJMPFdw,           X86.fnPUSHw,            X86.fnGRPFault          // 0xFF(reg=0x4-0x7)
];

if (I386) {
    /*
     * Until we have *d() forms of all *w() opcode handlers, we need to put in placeholders (ie, opTBD())
     */
    X86.aOpsD = {
        0x01:   X86.opTBD,      // opADDmd()
        0x03:   X86.opTBD,      // opADDrd()
        0x05:   X86.opTBD,      // opADDAXd()
        0x09:   X86.opTBD,      // opORmd()
        0x0B:   X86.opTBD,      // opORrd()
        0x0D:   X86.opTBD,      // opORAXd()
        0x11:   X86.opTBD,      // opADCmd()
        0x13:   X86.opTBD,      // opADCrd()
        0x15:   X86.opTBD,      // opADCAXd()
        0x19:   X86.opTBD,      // opSBBmd()
        0x1B:   X86.opTBD,      // opSBBrd()
        0x1D:   X86.opTBD,      // opSBBAXd()
        0x21:   X86.opANDmd,
        0x23:   X86.opANDrd,
        0x25:   X86.opANDAXd,
        0x29:   X86.opTBD,      // opSUBmd()
        0x2B:   X86.opTBD,      // opSUBrd()
        0x2D:   X86.opTBD,      // opSUBAXd()
        0x31:   X86.opTBD,      // opXORmd()
        0x33:   X86.opXORrd,
        0x35:   X86.opTBD,      // opXORAXd()
        0x39:   X86.opTBD,      // opCMPmd()
        0x3B:   X86.opTBD,      // opCMPrd()
        0x3D:   X86.opTBD,      // opCMPAXd()
        0xC1:   X86.opGRP2dn,
        0xD1:   X86.opGRP2d1,
        0xD3:   X86.opGRP2dCL
    };
}
