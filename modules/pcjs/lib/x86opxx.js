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
    var X86Grps     = require("./x86grps");
    var X86Help     = require("./x86help");
    var X86Op0F     = require("./x86op0f");
}

var X86OpXX = {
    /**
     * op=0x00 (ADD byte,reg)
     *
     * @this {X86CPU}
     */
    opADDmb: function() {
        var b = this.getIPByte();
        /*
         * Opcode bytes 0x00 0x00 are sufficiently uncommon that it's more likely we've started executing
         * in the weeds, so we'll stop the CPU if we're in DEBUG mode.
         */
        if (DEBUG && !b) this.stopCPU();
        this.opMod.aOpModMemByte[b].call(this, X86Grps.opGrpADDb);
    },
    /**
     * op=0x01 (ADD word,reg)
     *
     * @this {X86CPU}
     */
    opADDmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpADDw);
    },
    /**
     * op=0x02 (ADD reg,byte)
     *
     * @this {X86CPU}
     */
    opADDrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpADDb);
    },
    /**
     * op=0x03 (ADD reg,word)
     *
     * @this {X86CPU}
     */
    opADDrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpADDw);
    },
    /**
     * op=0x04 (ADD AL,imm8)
     *
     * @this {X86CPU}
     */
    opADDALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | X86Grps.opGrpADDb.call(this, this.regEAX & 0xff, this.getIPByte());
        /*
         * BACKTRACK note: I'm going to say this just once, even though it applies to MANY instructions.  The
         * result is a blending of btiAL and btiMemLo, so technically, a new bti should be allocated to reflect
         * that fact; however, I'm leaving perfect BACKTRACKing for another day.
         */
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        /*
         * In the absence of any EA calculations, opGrpADDb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x05 (ADD AX,imm16)
     *
     * @this {X86CPU}
     */
    opADDAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | X86Grps.opGrpADDw.call(this, this.regEAX & this.opMask, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        /*
         * In the absence of any EA calculations, opGrpADDw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x06 (PUSH ES)
     *
     * @this {X86CPU}
     */
    opPUSHES: function() {
        this.pushWord(this.segES.sel);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
    },
    /**
     * op=0x07 (POP ES)
     *
     * @this {X86CPU}
     */
    opPOPES: function() {
        this.setES(this.popWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x08 (OR byte,reg)
     *
     * @this {X86CPU}
     */
    opORmb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Grps.opGrpORb);
    },
    /**
     * op=0x09 (OR word,reg)
     *
     * @this {X86CPU}
     */
    opORmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpORw);
    },
    /**
     * op=0x0A (OR reg,byte)
     *
     * @this {X86CPU}
     */
    opORrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpORb);
    },
    /**
     * op=0x0B (OR reg,word)
     *
     * @this {X86CPU}
     */
    opORrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpORw);
    },
    /**
     * op=0x0C (OR AL,imm8)
     *
     * @this {X86CPU}
     */
    opORALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | X86Grps.opGrpORb.call(this, this.regEAX & 0xff, this.getIPByte());
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        /*
         * In the absence of any EA calculations, opGrpORb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x0D (OR AX,imm16)
     *
     * @this {X86CPU}
     */
    opORAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | X86Grps.opGrpORw.call(this, this.regEAX & this.opMask, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        /*
         * In the absence of any EA calculations, opGrpORw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x0E (PUSH CS)
     *
     * @this {X86CPU}
     */
    opPUSHCS: function() {
        this.pushWord(this.segCS.sel);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
    },
    /**
     * op=0x0F (POP CS) (undocumented on 8086/8088; replaced with opHelpInvalid on 80186/80188, and op0F on 80286 and up)
     *
     * @this {X86CPU}
     */
    opPOPCS: function() {
        this.setCS(this.popWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x0F (handler for two-byte opcodes; 80286 and up)
     *
     * @this {X86CPU}
     */
    op0F: function() {
        X86Op0F.aOps0F[this.getIPByte()].call(this);
    },
    /**
     * op=0x10 (ADC byte,reg)
     *
     * @this {X86CPU}
     */
    opADCmb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Grps.opGrpADCb);
    },
    /**
     * op=0x11 (ADC word,reg)
     *
     * @this {X86CPU}
     */
    opADCmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpADCw);
    },
    /**
     * op=0x12 (ADC reg,byte)
     *
     * @this {X86CPU}
     */
    opADCrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpADCb);
    },
    /**
     * op=0x13 (ADC reg,word)
     *
     * @this {X86CPU}
     */
    opADCrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpADCw);
    },
    /**
     * op=0x14 (ADC AL,imm8)
     *
     * @this {X86CPU}
     */
    opADCALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | X86Grps.opGrpADCb.call(this, this.regEAX & 0xff, this.getIPByte());
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        /*
         * In the absence of any EA calculations, opGrpADCb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x15 (ADC AX,imm16)
     *
     * @this {X86CPU}
     */
    opADCAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | X86Grps.opGrpADCw.call(this, this.regEAX & this.opMask, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        /*
         * In the absence of any EA calculations, opGrpADCw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x16 (PUSH SS)
     *
     * @this {X86CPU}
     */
    opPUSHSS: function() {
        this.pushWord(this.segSS.sel);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
    },
    /**
     * op=0x17 (POP SS)
     *
     * @this {X86CPU}
     */
    opPOPSS: function() {
        this.setSS(this.popWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x18 (SBB byte,reg)
     *
     * @this {X86CPU}
     */
    opSBBmb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Grps.opGrpSBBb);
    },
    /**
     * op=0x19 (SBB word,reg)
     *
     * @this {X86CPU}
     */
    opSBBmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpSBBw);
    },
    /**
     * op=0x1A (SBB reg,byte)
     *
     * @this {X86CPU}
     */
    opSBBrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpSBBb);
    },
    /**
     * op=0x1B (SBB reg,word)
     *
     * @this {X86CPU}
     */
    opSBBrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpSBBw);
    },
    /**
     * op=0x1C (SBB AL,imm8)
     *
     * @this {X86CPU}
     */
    opSBBALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | X86Grps.opGrpSBBb.call(this, this.regEAX & 0xff, this.getIPByte());
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        /*
         * In the absence of any EA calculations, opGrpSBBb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x1D (SBB AX,imm16)
     *
     * @this {X86CPU}
     */
    opSBBAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | X86Grps.opGrpSBBw.call(this, this.regEAX & this.opMask, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        /*
         * In the absence of any EA calculations, opGrpSBBw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x1E (PUSH DS)
     *
     * @this {X86CPU}
     */
    opPUSHDS: function() {
        this.pushWord(this.segDS.sel);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushSeg;
    },
    /**
     * op=0x1F (POP DS)
     *
     * @this {X86CPU}
     */
    opPOPDS: function() {
        this.setDS(this.popWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x20 (AND byte,reg)
     *
     * @this {X86CPU}
     */
    opANDmb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Grps.opGrpANDb);
    },
    /**
     * op=0x21 (AND word,reg)
     *
     * @this {X86CPU}
     */
    opANDmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpANDw);
    },
    /**
     * op=0x22 (AND reg,byte)
     *
     * @this {X86CPU}
     */
    opANDrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpANDb);
    },
    /**
     * op=0x23 (AND reg,word)
     *
     * @this {X86CPU}
     */
    opANDrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpANDw);
    },
    /**
     * op=0x24 (AND AL,imm8)
     *
     * @this {X86CPU}
     */
    opANDALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | X86Grps.opGrpANDb.call(this, this.regEAX & 0xff, this.getIPByte());
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        /*
         * In the absence of any EA calculations, opGrpANDb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x25 (AND AX,imm16)
     *
     * @this {X86CPU}
     */
    opANDAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | X86Grps.opGrpANDw.call(this, this.regEAX & this.opMask, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        /*
         * In the absence of any EA calculations, opGrpANDw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x26 (ES:)
     *
     * @this {X86CPU}
     */
    opES: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segES;
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0x27 (DAA)
     *
     * @this {X86CPU}
     */
    opDAA: function() {
        var AL = this.regEAX & 0xff;
        var fAuxCarry = this.getAF();
        var fCarry = (this.resultValue & this.resultSize);
        if ((AL & 0xf) > 9 || fAuxCarry) {
            AL += 0x6;
            fAuxCarry = true;
        }
        if (AL > 0x9f || fCarry) {
            AL += 0x60;
            fCarry = true;
        }
        this.regEAX = (this.regEAX & ~0xff) | (this.resultValue = this.resultParitySign = (AL & 0xff));
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.CYCLES.nOpCyclesAAA;          // AAA and DAA have the same cycle times
    },
    /**
     * op=0x28 (SUB byte,reg)
     *
     * @this {X86CPU}
     */
    opSUBmb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Grps.opGrpSUBb);
    },
    /**
     * op=0x29 (SUB word,reg)
     *
     * @this {X86CPU}
     */
    opSUBmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpSUBw);
    },
    /**
     * op=0x2A (SUB reg,byte)
     *
     * @this {X86CPU}
     */
    opSUBrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpSUBb);
    },
    /**
     * op=0x2B (SUB reg,word)
     *
     * @this {X86CPU}
     */
    opSUBrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpSUBw);
    },
    /**
     * op=0x2C (SUB AL,imm8)
     *
     * @this {X86CPU}
     */
    opSUBALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | X86Grps.opGrpSUBb.call(this, this.regEAX & 0xff, this.getIPByte());
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        /*
         * In the absence of any EA calculations, opGrpSUBb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x2D (SUB AX,imm16)
     *
     * @this {X86CPU}
     */
    opSUBAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | X86Grps.opGrpSUBw.call(this, this.regEAX & this.opMask, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        /*
         * In the absence of any EA calculations, opGrpSUBw() will deduct nOpCyclesArithRR, and for all CPUs
         * through the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x2E (CS:)
     *
     * @this {X86CPU}
     */
    opCS: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segCS;
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0x2F (DAS)
     *
     * @this {X86CPU}
     */
    opDAS: function() {
        var AL = this.regEAX & 0xff;
        var fAuxCarry = this.getAF();
        var fCarry = (this.resultValue & this.resultSize);
        if ((AL & 0xf) > 9 || fAuxCarry) {
            AL -= 0x6;
            fAuxCarry = true;
        }
        if (AL > 0x9f || fCarry) {
            AL -= 0x60;
            fCarry = true;
        }
        this.regEAX = (this.regEAX & ~0xff) | (this.resultValue = this.resultParitySign = (AL & 0xff));
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.CYCLES.nOpCyclesAAA;          // AAA and DAS have the same cycle times
    },
    /**
     * op=0x30 (XOR byte,reg)
     *
     * @this {X86CPU}
     */
    opXORmb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Grps.opGrpXORb);
    },
    /**
     * op=0x31 (XOR word,reg)
     *
     * @this {X86CPU}
     */
    opXORmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpXORw);
    },
    /**
     * op=0x32 (XOR reg,byte)
     *
     * @this {X86CPU}
     */
    opXORrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpXORb);
    },
    /**
     * op=0x33 (XOR reg,word)
     *
     * @this {X86CPU}
     */
    opXORrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpXORw);
    },
    /**
     * op=0x34 (XOR AL,imm8)
     *
     * @this {X86CPU}
     */
    opXORALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | X86Grps.opGrpXORb.call(this, this.regEAX & 0xff, this.getIPByte());
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        /*
         * In the absence of any EA calculations, opGrpXORb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x35 (XOR AX,imm16)
     *
     * @this {X86CPU}
     */
    opXORAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | X86Grps.opGrpXORw.call(this, this.regEAX & this.opMask, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        /*
         * In the absence of any EA calculations, opGrpXORw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x36 (SS:)
     *
     * @this {X86CPU}
     */
    opSS: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segSS;      // QUESTION: Is there a case where segStack would not already be segSS? (eg, multiple segment overrides?)
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0x37 (AAA)
     *
     * @this {X86CPU}
     */
    opAAA: function() {
        var AL = this.regEAX & 0xff;
        var AH = this.regEAX >> 8;
        var fCarry;
        var fAuxCarry = this.getAF();
        if ((AL & 0xf) > 9 || fAuxCarry) {
            AL = (AL + 0x6) & 0xf;
            AH = (AH + 1) & 0xff;
            fCarry = fAuxCarry = true;
        } else {
            fCarry = fAuxCarry = false;
        }
        this.regEAX = (this.regEAX & ~0xffff) | (AH << 8) | (this.resultValue = AL);
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.CYCLES.nOpCyclesAAA;
    },
    /**
     * op=0x38 (CMP byte,reg)
     *
     * @this {X86CPU}
     */
    opCMPmb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Grps.opGrpCMPb);
    },
    /**
     * op=0x39 (CMP word,reg)
     *
     * @this {X86CPU}
     */
    opCMPmw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Grps.opGrpCMPw);
    },
    /**
     * op=0x3A (CMP reg,byte)
     *
     * @this {X86CPU}
     */
    opCMPrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Grps.opGrpCMPb);
    },
    /**
     * op=0x3B (CMP reg,word)
     *
     * @this {X86CPU}
     */
    opCMPrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Grps.opGrpCMPw);
    },
    /**
     * op=0x3C (CMP AL,imm8)
     *
     * @this {X86CPU}
     */
    opCMPALb: function() {
        X86Grps.opGrpCMPb.call(this, this.regEAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpCMPb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x3D (CMP AX,imm16)
     *
     * @this {X86CPU}
     */
    opCMPAXw: function() {
        X86Grps.opGrpCMPw.call(this, this.regEAX & this.opMask, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpCMPw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * op=0x3E (DS:)
     *
     * @this {X86CPU}
     */
    opDS: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segDS;      // QUESTION: Is there a case where segData would not already be segDS? (eg, multiple segment overrides?)
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0x3D (AAS)
     *
     * From "The 8086 Book":
     *
     *  1. If the low-order four bits of the AL register are between 0 and 9 and the AF flag is 0, then go to Step 3.
     *  2. If the low-order four bits of the AL register are between A and F or the AF flag is 1, then subtract 6 from the AL register, subtract 1 from the AH register, and set the AF flag to 1.
     *  3. Clear the high-order four bits of the AL register.
     *  4. Set the CF flag to the value of the AF flag.
     *
     * @this {X86CPU}
     */
    opAAS: function() {
        var AL = this.regEAX & 0xff;
        var AH = this.regEAX >> 8;
        var fCarry;
        var fAuxCarry = this.getAF();
        if ((AL & 0xf) > 9 || fAuxCarry) {
            AL = (AL - 0x6) & 0xf;
            AH = (AH - 1) & 0xff;
            fCarry = fAuxCarry = true;
        } else {
            fCarry = fAuxCarry = false;
        }
        this.regEAX = (this.regEAX & ~0xffff) | (AH << 8) | (this.resultValue = AL);
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.CYCLES.nOpCyclesAAA;          // AAA and AAS have the same cycle times
    },
    /**
     * op=0x40 (INC AX)
     *
     * @this {X86CPU}
     */
    opINCAX: function() {
        this.resultAuxOverflow = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.resultParitySign = this.regEAX + 1) & this.opMask;
        this.resultValue = this.regEAX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x41 (INC CX)
     *
     * @this {X86CPU}
     */
    opINCCX: function() {
        this.resultAuxOverflow = this.regECX;
        this.regECX = (this.regECX & ~this.opMask) | (this.resultParitySign = this.regECX + 1) & this.opMask;
        this.resultValue = this.regECX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x42 (INC DX)
     *
     * @this {X86CPU}
     */
    opINCDX: function() {
        this.resultAuxOverflow = this.regEDX;
        this.regEDX = (this.regEDX & ~this.opMask) | (this.resultParitySign = this.regEDX + 1) & this.opMask;
        this.resultValue = this.regEDX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x43 (INC BX)
     *
     * @this {X86CPU}
     */
    opINCBX: function() {
        this.resultAuxOverflow = this.regEBX;
        this.regEBX = (this.regEBX & ~this.opMask) | (this.resultParitySign = this.regEBX + 1) & this.opMask;
        this.resultValue = this.regEBX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x44 (INC SP)
     *
     * @this {X86CPU}
     */
    opINCSP: function() {
        this.resultAuxOverflow = this.regESP;
        this.regESP = (this.regESP & ~this.opMask) | (this.resultParitySign = this.regESP + 1) & this.opMask;
        this.resultValue = this.regESP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x45 (INC BP)
     *
     * @this {X86CPU}
     */
    opINCBP: function() {
        this.resultAuxOverflow = this.regEBP;
        this.regEBP = (this.regEBP & ~this.opMask) | (this.resultParitySign = this.regEBP + 1) & this.opMask;
        this.resultValue = this.regEBP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x46 (INC SI)
     *
     * @this {X86CPU}
     */
    opINCSI: function() {
        this.resultAuxOverflow = this.regESI;
        this.regESI = (this.regESI & ~this.opMask) | (this.resultParitySign = this.regESI + 1) & this.opMask;
        this.resultValue = this.regESI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x47 (INC DI)
     *
     * @this {X86CPU}
     */
    opINCDI: function() {
        this.resultAuxOverflow = this.regEDI;
        this.regEDI = (this.regEDI & ~this.opMask) | (this.resultParitySign = this.regEDI + 1) & this.opMask;
        this.resultValue = this.regEDI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * op=0x48 (DEC AX)
     *
     * @this {X86CPU}
     */
    opDECAX: function() {
        this.resultAuxOverflow = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.resultParitySign = this.regEAX - 1) & this.opMask;
        this.resultValue = this.regEAX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x49 (DEC CX)
     *
     * @this {X86CPU}
     */
    opDECCX: function() {
        this.resultAuxOverflow = this.regECX;
        this.regECX = (this.regECX & ~this.opMask) | (this.resultParitySign = this.regECX - 1) & this.opMask;
        this.resultValue = this.regECX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x4A (DEC DX)
     *
     * @this {X86CPU}
     */
    opDECDX: function() {
        this.resultAuxOverflow = this.regEDX;
        this.regEDX = (this.regEDX & ~this.opMask) | (this.resultParitySign = this.regEDX - 1) & this.opMask;
        this.resultValue = this.regEDX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x4B (DEC BX)
     *
     * @this {X86CPU}
     */
    opDECBX: function() {
        this.resultAuxOverflow = this.regEBX;
        this.regEBX = (this.regEBX & ~this.opMask) | (this.resultParitySign = this.regEBX - 1) & this.opMask;
        this.resultValue = this.regEBX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x4C (DEC SP)
     *
     * @this {X86CPU}
     */
    opDECSP: function() {
        this.resultAuxOverflow = this.regESP;
        this.regESP = (this.regESP & ~this.opMask) | (this.resultParitySign = this.regESP - 1) & this.opMask;
        this.resultValue = this.regESP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x4D (DEC BP)
     *
     * @this {X86CPU}
     */
    opDECBP: function() {
        this.resultAuxOverflow = this.regEBP;
        this.regEBP = (this.regEBP & ~this.opMask) | (this.resultParitySign = this.regEBP - 1) & this.opMask;
        this.resultValue = this.regEBP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x4E (DEC SI)
     *
     * @this {X86CPU}
     */
    opDECSI: function() {
        this.resultAuxOverflow = this.regESI;
        this.regESI = (this.regESI & ~this.opMask) | (this.resultParitySign = this.regESI - 1) & this.opMask;
        this.resultValue = this.regESI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x4F (DEC DI)
     *
     * @this {X86CPU}
     */
    opDECDI: function() {
        this.resultAuxOverflow = this.regEDI;
        this.regEDI = (this.regEDI & ~this.opMask) | (this.resultParitySign = this.regEDI - 1) & this.opMask;
        this.resultValue = this.regEDI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * op=0x50 (PUSH AX)
     *
     * @this {X86CPU}
     */
    opPUSHAX: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.pushWord(this.regEAX & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x51 (PUSH CX)
     *
     * @this {X86CPU}
     */
    opPUSHCX: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.pushWord(this.regECX & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x52 (PUSH DX)
     *
     * @this {X86CPU}
     */
    opPUSHDX: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.pushWord(this.regEDX & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x53 (PUSH BX)
     *
     * @this {X86CPU}
     */
    opPUSHBX: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.pushWord(this.regEBX & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x54 (PUSH SP)
     *
     * @this {X86CPU}
     */
    opPUSHSP8086: function() {
        var w = (this.regESP - (2 << this.opSize)) & this.opMask;
        this.pushWord(w);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x54 (PUSH SP)
     *
     * @this {X86CPU}
     */
    opPUSHSP: function() {
        this.pushWord(this.regESP & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x55 (PUSH BP)
     *
     * @this {X86CPU}
     */
    opPUSHBP: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.pushWord(this.regEBP & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x56 (PUSH SI)
     *
     * @this {X86CPU}
     */
    opPUSHSI: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.pushWord(this.regESI & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x57 (PUSH DI)
     *
     * @this {X86CPU}
     */
    opPUSHDI: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.pushWord(this.regEDI & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x58 (POP AX)
     *
     * @this {X86CPU}
     */
    opPOPAX: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x59 (POP CX)
     *
     * @this {X86CPU}
     */
    opPOPCX: function() {
        this.regECX = (this.regECX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x5A (POP DX)
     *
     * @this {X86CPU}
     */
    opPOPDX: function() {
        this.regEDX = (this.regEDX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x5B (POP BX)
     *
     * @this {X86CPU}
     */
    opPOPBX: function() {
        this.regEBX = (this.regEBX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x5C (POP SP)
     *
     * @this {X86CPU}
     */
    opPOPSP: function() {
        this.regESP = (this.regESP & ~this.opMask) | this.popWord();
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x5D (POP BP)
     *
     * @this {X86CPU}
     */
    opPOPBP: function() {
        this.regEBP = (this.regEBP & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x5E (POP SI)
     *
     * @this {X86CPU}
     */
    opPOPSI: function() {
        this.regESI = (this.regESI & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x5F (POP DI)
     *
     * @this {X86CPU}
     */
    opPOPDI: function() {
        this.regEDI = (this.regEDI & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x60 (PUSHA) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opPUSHA: function() {
        var temp = this.regESP & this.opMask;
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.pushWord(this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.pushWord(this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.pushWord(this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.pushWord(this.regEBX & this.opMask);
        this.pushWord(temp);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.pushWord(this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.pushWord(this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.pushWord(this.regEDI & this.opMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesPushAll;
    },
    /**
     * op=0x61 (POPA) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opPOPA: function() {
        this.regEDI = (this.regEDI & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.regESI = (this.regESI & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.regEBP = (this.regEBP & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.regESP += (2 << this.opSize);
        this.regEBX = (this.regEBX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.regEDX = (this.regEDX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.regECX = (this.regECX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.regEAX = (this.regEAX & ~this.opMask) | this.popWord();
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesPopAll;
    },
    /**
     * op=0x62 (BOUND reg,word) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opBOUND: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpBOUND);
    },
    /**
     * op=0x63 (ARPL word,reg) (80286 and up)
     *
     * @this {X86CPU}
     */
    opARPL: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Help.opHelpARPL);
    },
    /**
     * op=0x66 (OS:) (80386 and up)
     *
     * TODO: Review other effective operand-size criteria, cycle count, etc.
     *
     * @this {X86CPU}
     */
    opOS: function() {
        this.opFlags |= X86.OPFLAG.SEG;
        this.opSize ^= 1;               // that which is 0 shall become 1, and vice versa
        this.opMask ^= 0xffff0000;      // that which is 0x0000ffff shall become 0xffffffff, and vice versa
        this.opMem = this.aaOpMem[this.opSize];
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0x67 (AS:) (80386 and up)
     *
     * TODO: Review other effective address-size criteria, cycle count, etc.
     *
     * @this {X86CPU}
     */
    opAS: function() {
        this.opFlags |= X86.OPFLAG.SEG;
        this.addrSize ^= 1;             // that which is 0 shall become 1, and vice versa
        this.addrMask ^= 0xffff0000;    // that which is 0x0000ffff shall become 0xffffffff, and vice versa
        this.opMod = this.aaOpMod[this.addrSize];
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0x68 (PUSH imm16) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opPUSH16: function() {
        this.pushWord(this.getIPWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x69 (IMUL reg,word,imm16) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opIMUL16: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpIMUL16);
    },
    /**
     * op=0x6A (PUSH imm8) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opPUSH8: function() {
        if (BACKTRACK) this.backTrack.btiMemHi = 0;
        this.pushWord(this.getIPByte());
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x6B (IMUL reg,word,imm8) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opIMUL8: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpIMUL8);
    },
    /**
     * op=0x6C (INSB) (80186/80188 and up)
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     *
     * @this {X86CPU}
     */
    opINSb: function() {
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
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0x6D (INSW) (80186/80188 and up)
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     *
     * @this {X86CPU}
     */
    opINSw: function() {
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
            var w = this.bus.checkPortInputNotify(this.regEDX, addrFrom);
            if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiIO;
            w |= (this.bus.checkPortInputNotify(this.regEDX, addrFrom) << 8);
            if (BACKTRACK) this.backTrack.btiMemHi = this.backTrack.btiIO;
            this.setSOWord(this.segES, this.regEDI & this.addrMask, w);
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -2 : 2)) & this.addrMask);
            this.nStepCycles -= nCycles;
            this.regECX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0x6E (OUTSB) (80186/80188 and up)
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
     *
     * @this {X86CPU}
     */
    opOUTSb: function() {
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
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0x6F (OUTSW) (80186/80188 and up)
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
     *
     * @this {X86CPU}
     */
    opOUTSw: function() {
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
            this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + ((this.regPS & X86.PS.DF)? -2 : 2)) & this.addrMask);
            this.nStepCycles -= nCycles;
            this.regECX -= nDelta;
            var addrFrom = this.regLIP - nDelta - 1;
            if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiMemLo;
            this.bus.checkPortOutputNotify(this.regEDX, w & 0xff, addrFrom);
            if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiMemHi;
            this.bus.checkPortOutputNotify(this.regEDX, w >> 8, addrFrom);
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0x70 (JO disp)
     *
     * @this {X86CPU}
     */
    opJO: function() {
        var disp = this.getIPDisp();
        if (this.getOF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x71 (JNO disp)
     *
     * @this {X86CPU}
     */
    opJNO: function() {
        var disp = this.getIPDisp();
        if (!this.getOF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x72 (JC disp, aka JB disp)
     *
     * @this {X86CPU}
     */
    opJC: function() {
        var disp = this.getIPDisp();
        if (this.getCF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x73 (JNC disp, aka JAE disp)
     *
     * @this {X86CPU}
     */
    opJNC: function() {
        var disp = this.getIPDisp();
        if (!this.getCF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x74 (JZ disp)
     *
     * @this {X86CPU}
     */
    opJZ: function() {
        var disp = this.getIPDisp();
        if (this.getZF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x75 (JNZ disp)
     *
     * @this {X86CPU}
     */
    opJNZ: function() {
        var disp = this.getIPDisp();
        if (!this.getZF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x76 (JBE disp)
     *
     * @this {X86CPU}
     */
    opJBE: function() {
        var disp = this.getIPDisp();
        if (this.getCF() || this.getZF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x77 (JNBE disp, JA disp)
     *
     * @this {X86CPU}
     */
    opJNBE: function() {
        var disp = this.getIPDisp();
        if (!this.getCF() && !this.getZF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x78 (JS disp)
     *
     * @this {X86CPU}
     */
    opJS: function() {
        var disp = this.getIPDisp();
        if (this.getSF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x79 (JNS disp)
     *
     * @this {X86CPU}
     */
    opJNS: function() {
        var disp = this.getIPDisp();
        if (!this.getSF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x7A (JP disp)
     *
     * @this {X86CPU}
     */
    opJP: function() {
        var disp = this.getIPDisp();
        if (this.getPF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x7B (JNP disp)
     *
     * @this {X86CPU}
     */
    opJNP: function() {
        var disp = this.getIPDisp();
        if (!this.getPF()) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x7C (JL disp)
     *
     * @this {X86CPU}
     */
    opJL: function() {
        var disp = this.getIPDisp();
        if (!this.getSF() != !this.getOF()) {                   // jshint ignore:line
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x7D (JNL disp, aka JGE disp)
     *
     * @this {X86CPU}
     */
    opJNL: function() {
        var disp = this.getIPDisp();
        if (!this.getSF() == !this.getOF()) {                   // jshint ignore:line
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x7E (JLE disp)
     *
     * @this {X86CPU}
     */
    opJLE: function() {
        var disp = this.getIPDisp();
        if (this.getZF() || !this.getSF() != !this.getOF()) {   // jshint ignore:line
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x7F (JNLE disp, aka JG disp)
     *
     * @this {X86CPU}
     */
    opJNLE: function() {
        var disp = this.getIPDisp();
        if (!this.getZF() && !this.getSF() == !this.getOF()) {  // jshint ignore:line
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpCFall;
    },
    /**
     * op=0x80/0x82 (GRP1 byte,imm8)
     *
     * @this {X86CPU}
     */
    opGrp1b: function() {
        this.opMod.aOpModGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrp1b, this.getIPByte);
        this.nStepCycles -= (this.regEAWrite < 0? 1 : this.CYCLES.nOpCyclesArithMID);
    },
    /**
     * op=0x81 (GRP1 word,imm16)
     *
     * @this {X86CPU}
     */
    opGrp1w: function() {
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrp1w, this.getIPWord);
        this.nStepCycles -= (this.regEAWrite < 0? 1 : this.CYCLES.nOpCyclesArithMID);
    },
    /**
     * op=0x83 (GRP1 word,disp)
     *
     * @this {X86CPU}
     */
    opGrp1sw: function() {
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrp1w, this.getIPDisp);
        this.nStepCycles -= (this.regEAWrite < 0? 1 : this.CYCLES.nOpCyclesArithMID);
    },
    /**
     * op=0x84 (TEST reg,byte)
     *
     * @this {X86CPU}
     */
    opTESTrb: function() {
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Help.opHelpTESTb);
    },
    /**
     * op=0x85 (TEST reg,word)
     *
     * @this {X86CPU}
     */
    opTESTrw: function() {
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Help.opHelpTESTw);
    },
    /**
     * op=0x86 (XCHG reg,byte)
     *
     * NOTE: The XCHG instruction is unique in that both src and dst are both read and written;
     * see opHelpXCHGrb() for how we deal with this special case.
     *
     * @this {X86CPU}
     */
    opXCHGrb: function() {
        /*
         * If the second operand is a register, then the ModRegByte decoder must use separate "get" and
         * "set" assignments, otherwise instructions like "XCHG DH,DL" will end up using a stale DL instead of
         * the updated DL.
         *
         * To be clear, a single assignment like this will fail:
         *
         *      opModRegByteF2: function(fn) {
         *          this.regEDX = (this.regEDX & 0xff) | (fn.call(this, this.regEDX >> 8, this.regEDX & 0xff) << 8);
         *      }
         *
         * which is why all affected decoders now use separate assignments; eg:
         *
         *      opModRegByteF2: function(fn) {
         *          var b = fn.call(this, this.regEDX >> 8, this.regEDX & 0xff);
         *          this.regEDX = (this.regEDX & 0xff) | (b << 8);
         *      }
         */
        this.opMod.aOpModRegByte[this.bModRM = this.getIPByte()].call(this, X86Help.opHelpXCHGrb);
    },
    /**
     * op=0x87 (XCHG reg,word)
     *
     * NOTE: The XCHG instruction is unique in that both src and dst are both read and written;
     * see opHelpXCHGrw() for how we deal with this special case.
     *
     * @this {X86CPU}
     */
    opXCHGrw: function() {
        this.opMod.aOpModRegWord[this.bModRM = this.getIPByte()].call(this, X86Help.opHelpXCHGrw);
    },
    /**
     * op=0x88 (MOV byte,reg)
     *
     * @this {X86CPU}
     */
    opMOVmb: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        this.opFlags |= X86.OPFLAG.NOREAD;
        this.opMod.aOpModMemByte[this.getIPByte()].call(this, X86Help.opHelpMOV);
    },
    /**
     * op=0x89 (MOV word,reg)
     *
     * @this {X86CPU}
     */
    opMOVmw: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        this.opFlags |= X86.OPFLAG.NOREAD;
        this.opMod.aOpModMemWord[this.getIPByte()].call(this, X86Help.opHelpMOV);
    },
    /**
     * op=0x8A (MOV reg,byte)
     *
     * @this {X86CPU}
     */
    opMOVrb: function() {
        this.opMod.aOpModRegByte[this.getIPByte()].call(this, X86Help.opHelpMOV);
    },
    /**
     * op=0x8B (MOV reg,word)
     *
     * @this {X86CPU}
     */
    opMOVrw: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpMOV);
    },
    /**
     * op=0x8C (MOV word,sr)
     *
     * NOTE: Since the ModRM decoders deal only with general-purpose registers, we must move
     * the appropriate segment register into a special variable (regMD16), which our helper function
     * (opHelpMOVSegSrc) will use to replace the decoder's src operand.
     *
     * @this {X86CPU}
     */
    opMOVwsr: function() {
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
                X86Help.opHelpUndefined.call(this);
                return;
        }
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        this.opFlags |= X86.OPFLAG.NOREAD;
        this.opMod.aOpModMemWord[bModRM].call(this, X86Help.opHelpMOVSegSrc);
    },
    /**
     * op=0x8D (LEA reg,word)
     *
     * @this {X86CPU}
     */
    opLEA: function() {
        this.opFlags |= X86.OPFLAG.NOREAD;
        this.segData = this.segStack = this.segNULL;    // we can't have the EA calculation, if any, "polluted" by segment arithmetic
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpLEA);
    },
    /**
     * op=0x8E (MOV sr,word)
     *
     * NOTE: Since the ModRM decoders deal only with general-purpose registers, we have to
     * make a note of which general-purpose register will be overwritten, so that we can restore it
     * after moving the modified value to the correct segment register.
     *
     * @this {X86CPU}
     */
    opMOVsrw: function() {
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
            if (this.model >= X86.MODEL_80286) {
                X86Help.opHelpInvalid.call(this);
                return;
            }
            switch(reg) {
            case 0x1:           // MOV to CS is undocumented on 8086/8088/80186/80188, and invalid on 80286 and up
                temp = this.regECX;
                break;
            case 0x4:           // this form of MOV to ES is undocumented on 8086/8088/80186/80188, invalid on 80286, and uses FS starting with 80386
                temp = this.regESP;
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
        this.opMod.aOpModRegWord[bModRM].call(this, X86Help.opHelpMOV);
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
            this.setES(this.regESP);
            this.regESP = temp;
            break;
        case 0x5:
            this.setCS(this.regEBP);
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
    },
    /**
     * op=0x8F (POP word)
     *
     * @this {X86CPU}
     */
    opPOPmw: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        this.opFlags |= X86.OPFLAG.NOREAD;
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrpPOPw, this.popWord);
    },
    /**
     * op=0x90 (NOP, aka XCHG AX,AX)
     *
     * @this {X86CPU}
     */
    opNOP: function() {
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x91 (XCHG AX,CX)
     *
     * @this {X86CPU}
     */
    opXCHGCX: function() {
        var temp = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.regECX & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | (temp & this.opMask);
        if (BACKTRACK) {
            temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiCL; this.backTrack.btiCL = temp;
            temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiCH; this.backTrack.btiCH = temp;
        }
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x92 (XCHG AX,DX)
     *
     * @this {X86CPU}
     */
    opXCHGDX: function() {
        var temp = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.regEDX & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | (temp & this.opMask);
        if (BACKTRACK) {
            temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiDL; this.backTrack.btiDL = temp;
            temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiDH; this.backTrack.btiDH = temp;
        }
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x93 (XCHG AX,BX)
     *
     * @this {X86CPU}
     */
    opXCHGBX: function() {
        var temp = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.regEBX & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | (temp & this.opMask);
        if (BACKTRACK) {
            temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiBL; this.backTrack.btiBL = temp;
            temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiBH; this.backTrack.btiBH = temp;
        }
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x94 (XCHG AX,SP)
     *
     * @this {X86CPU}
     */
    opXCHGSP: function() {
        var temp = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.regESP & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | (temp & this.opMask);
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiAH = 0;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x95 (XCHG AX,BP)
     *
     * @this {X86CPU}
     */
    opXCHGBP: function() {
        var temp = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.regEBP & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | (temp & this.opMask);
        if (BACKTRACK) {
            temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiBPLo; this.backTrack.btiBPLo = temp;
            temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiBPHi; this.backTrack.btiBPHi = temp;
        }
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x96 (XCHG AX,SI)
     *
     * @this {X86CPU}
     */
    opXCHGSI: function() {
        var temp = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.regESI & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | (temp & this.opMask);
        if (BACKTRACK) {
            temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiSILo; this.backTrack.btiSILo = temp;
            temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiSIHi; this.backTrack.btiSIHi = temp;
        }
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x97 (XCHG AX,DI)
     *
     * @this {X86CPU}
     */
    opXCHGDI: function() {
        var temp = this.regEAX;
        this.regEAX = (this.regEAX & ~this.opMask) | (this.regEDI & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | (temp & this.opMask);
        if (BACKTRACK) {
            temp = this.backTrack.btiAL; this.backTrack.btiAL = this.backTrack.btiDILo; this.backTrack.btiDILo = temp;
            temp = this.backTrack.btiAH; this.backTrack.btiAH = this.backTrack.btiDIHi; this.backTrack.btiDIHi = temp;
        }
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * op=0x98 (CBW/CWDE)
     *
     * NOTE: The 16-bit form (CBW) sign-extends AL into AX, whereas the 32-bit form (CWDE) sign-extends AX into EAX;
     * CWDE is similar to CWD, except that the destination is EAX rather than DX:AX.
     *
     * @this {X86CPU}
     */
    opCBW: function() {
        if (!this.opSize) {
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
    },
    /**
     * op=0x99 (CWD/CDQ)
     *
     * NOTE: The 16-bit form (CWD) sign-extends AX, producing a 32-bit result in DX:AX, while the 32-bit form (CDQ)
     * sign-extends EAX, producing a 64-bit result in EDX:EAX.
     *
     * @this {X86CPU}
     */
    opCWD: function() {
        if (!this.opSize) {
            /*
             * CWD
             */
            this.regEDX = (this.regEDX & ~0xffff) | ((this.regEAX & 0x8000)? 0xffff : 0);
            if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiDH = this.backTrack.btiAH;
        } else {
            /*
             * CDQ
             */
            this.regEDX = (this.regEAX & 0x80000000)? 0xffffffff : 0;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesCWD;
    },
    /**
     * op=0x9A (CALL seg:off)
     *
     * @this {X86CPU}
     */
    opCALLF: function() {
        X86Help.opHelpCALLF.call(this, this.getIPWord(), this.getIPWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesCallF;
    },
    /**
     * op=0x9B (WAIT)
     *
     * @this {X86CPU}
     */
    opWAIT: function() {
        this.printMessage("WAIT not implemented", Messages.CPU);
        this.nStepCycles--;
    },
    /**
     * op=0x9C (PUSHF)
     *
     * @this {X86CPU}
     */
    opPUSHF: function() {
        this.pushWord(this.getPS());
        this.nStepCycles -= this.CYCLES.nOpCyclesPushReg;
    },
    /**
     * op=0x9D (POPF)
     *
     * @this {X86CPU}
     */
    opPOPF: function() {
        this.setPS(this.popWord());
        /*
         * NOTE: I'm assuming that neither POPF nor IRET are required to set NOINTR like STI does.
         */
        this.nStepCycles -= this.CYCLES.nOpCyclesPopReg;
    },
    /**
     * op=0x9E (SAHF)
     *
     * @this {X86CPU}
     */
    opSAHF: function() {
        /*
         * NOTE: While it make LOOK more efficient to do this:
         *
         *      this.setPS((this.getPS() & ~X86.PS.SAHF) | ((this.regEAX >> 8) & X86.PS.SAHF));
         *
         * the call to getPS() forces all the "indirect" flags to be resolved first, and then the call
         * to setPS() forces them all to be recalculated, so on balance, the code below is probably more
         * efficient, and may also avoid some unexpected side-effects of slamming the entire PS register.
         */
        var ah = this.regEAX >> 8;
        if (ah & X86.PS.CF) this.setCF(); else this.clearCF();
        if (ah & X86.PS.PF) this.setPF(); else this.clearPF();
        if (ah & X86.PS.AF) this.setAF(); else this.clearAF();
        if (ah & X86.PS.ZF) this.setZF(); else this.clearZF();
        if (ah & X86.PS.SF) this.setSF(); else this.clearSF();
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
        this.assert((this.getPS() & X86.PS.SAHF) == (ah & X86.PS.SAHF));
    },
    /**
     * op=0x9F (LAHF)
     *
     * @this {X86CPU}
     */
    opLAHF: function() {
        this.regEAX = (this.regEAX & 0xff) | (this.getPS() & X86.PS.SAHF) << 8;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xA0 (MOV AL,mem)
     *
     * @this {X86CPU}
     */
    opMOVALm: function() {
        this.regEAX = (this.regEAX & ~0xff) | this.getSOByte(this.segData, this.getIPWord());
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesMovAM;
    },
    /**
     * op=0xA1 (MOV AX,mem)
     *
     * @this {X86CPU}
     */
    opMOVAXm: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | this.getSOWord(this.segData, this.getIPWord());
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesMovAM;
    },
    /**
     * op=0xA2 (MOV mem,AL)
     *
     * @this {X86CPU}
     */
    opMOVmAL: function() {
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        /*
         * setSOByte() truncates the value as appropriate
         */
        this.setSOByte(this.segData, this.getIPWord(), this.regEAX);
        this.nStepCycles -= this.CYCLES.nOpCyclesMovMA;
    },
    /**
     * op=0xA3 (MOV mem,AX)
     *
     * @this {X86CPU}
     */
    opMOVmAX: function() {
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        /*
         * setSOWord() truncates the value as appropriate
         */
        this.setSOWord(this.segData, this.getIPWord(), this.regEAX);
        this.nStepCycles -= this.CYCLES.nOpCyclesMovMA;
    },
    /**
     * op=0xA4 (MOVSB)
     *
     * @this {X86CPU}
     */
    opMOVSb: function() {
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
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 *
                 * TODO: Decide what to do about string instructions with multiple (ie, redundant)
                 * SEG prefixes, and whether we should strictly emulate the 8086's failure to restart
                 * string instructions with multiple prefixes.
                 */
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xA5 (MOVSW)
     *
     * @this {X86CPU}
     */
    opMOVSw: function() {
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
            var nInc = ((this.regPS & X86.PS.DF)? -2 : 2);
            this.setSOWord(this.segES, this.regEDI & this.addrMask, this.getSOWord(this.segData, this.regESI));
            this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + nInc) & this.addrMask);
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + nInc) & this.addrMask);
            this.nStepCycles -= nCycles;
            this.regECX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 *
                 * TODO: Decide what to do about string instructions with multiple (ie, redundant)
                 * SEG prefixes, and whether we should strictly emulate the 8086's failure to restart
                 * string instructions with multiple prefixes.
                 */
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xA6 (CMPSB)
     *
     * @this {X86CPU}
     */
    opCMPSb: function() {
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
            X86Grps.opGrpCMPb.call(this, bDst, bSrc);
            this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + nInc) & this.addrMask);
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + nInc) & this.addrMask);
            /*
             * NOTE: As long as we're calling opGrpCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
            this.regECX -= nDelta;
            /*
             * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
             * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
             * two values are equal, we must continue.
             */
            if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 *
                 * TODO: Decide what to do about string instructions with multiple (ie, redundant)
                 * SEG prefixes, and whether we should strictly emulate the 8086's failure to restart
                 * string instructions with multiple prefixes.
                 */
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xA7 (CMPSW)
     *
     * @this {X86CPU}
     */
    opCMPSw: function() {
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
            var nInc = ((this.regPS & X86.PS.DF)? -2 : 2);
            var wDst = this.getEAWord(this.segData, this.regESI & this.addrMask);
            var wSrc = this.modEAWord(this.segES, this.regEDI & this.addrMask);
            X86Grps.opGrpCMPw.call(this, wDst, wSrc);
            this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + nInc) & this.addrMask);
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + nInc) & this.addrMask);
            /*
             * NOTE: As long as we're calling opGrpCMPw(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
            this.regECX -= nDelta;
            /*
             * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
             * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
             * two values are equal, we must continue.
             */
            if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 *
                 * TODO: Decide what to do about string instructions with multiple (ie, redundant)
                 * SEG prefixes, and whether we should strictly emulate the 8086's failure to restart
                 * string instructions with multiple prefixes.
                 */
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xA8 (TEST AL,imm8)
     *
     * @this {X86CPU}
     */
    opTESTALb: function() {
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = this.regEAX & this.getIPByte();
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= this.CYCLES.nOpCyclesAAA;
    },
    /**
     * op=0xA9 (TEST AX,imm16)
     *
     * @this {X86CPU}
     */
    opTESTAXw: function() {
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = this.regEAX & this.getIPWord();
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= this.CYCLES.nOpCyclesAAA;
    },
    /**
     * op=0xAA (STOSB)
     *
     * NOTES: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     *
     * @this {X86CPU}
     */
    opSTOSb: function() {
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
             * NOTE: We rely on setSOByte() to truncate regEAX to 8 bits; if setSOByte() changes, mask AX below.
             */
            if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
            this.setSOByte(this.segES, this.regEDI & this.addrMask, this.regEAX);
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & this.addrMask);
            this.nStepCycles -= nCycles;
            this.regECX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xAB (STOSW)
     *
     * NOTES: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     *
     * @this {X86CPU}
     */
    opSTOSw: function() {
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
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -2 : 2)) & this.addrMask);
            this.nStepCycles -= nCycles;
            this.regECX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xAC (LODSB)
     *
     * @this {X86CPU}
     */
    opLODSb: function() {
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
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 *
                 * TODO: Decide what to do about string instructions with multiple (ie, redundant)
                 * SEG prefixes, and whether we should strictly emulate the 8086's failure to restart
                 * string instructions with multiple prefixes.
                 */
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xAD (LODSW)
     *
     * @this {X86CPU}
     */
    opLODSw: function() {
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
            this.regEAX = this.getSOWord(this.segData, this.regESI & this.addrMask);
            if (BACKTRACK) {
                this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
            }
            this.regESI = (this.regESI & ~this.addrMask) | ((this.regESI + ((this.regPS & X86.PS.DF)? -2 : 2)) & this.addrMask);
            this.nStepCycles -= nCycles;
            this.regECX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 *
                 * TODO: Decide what to do about string instructions with multiple (ie, redundant)
                 * SEG prefixes, and whether we should strictly emulate the 8086's failure to restart
                 * string instructions with multiple prefixes.
                 */
                this.advanceIP(((this.opPrefixes & X86.OPFLAG.SEG)? -3 : -2));
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xAE (SCASB)
     *
     * @this {X86CPU}
     */
    opSCASb: function() {
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
            X86Grps.opGrpCMPb.call(this, this.regEAX & 0xff, this.modEAByte(this.segES, this.regEDI & this.addrMask));
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & this.addrMask);
            /*
             * NOTE: As long as we're calling opGrpCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
            this.regECX -= nDelta;
            /*
             * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
             * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
             * two values are equal, we must continue.
             */
            if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xAF (SCASW)
     *
     * @this {X86CPU}
     */
    opSCASw: function() {
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
            X86Grps.opGrpCMPw.call(this, this.regEAX, this.modEAWord(this.segES, this.regEDI & this.addrMask));
            this.regEDI = (this.regEDI & ~this.addrMask) | ((this.regEDI + ((this.regPS & X86.PS.DF)? -2 : 2)) & this.addrMask);
            /*
             * NOTE: As long as we're calling opGrpCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.CYCLES.nOpCyclesArithRM;
            this.regECX -= nDelta;
            /*
             * Repetition continues while ZF matches bit 0 of the REP prefix.  getZF() returns 0x40 if ZF is
             * set, and OP_REPZ (which represents the REP prefix whose bit 0 is set) is 0x40 as well, so when those
             * two values are equal, we must continue.
             */
            if (nReps && this.getZF() == (this.opPrefixes & X86.OPFLAG.REPZ)) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.assert(this.regLIP == this.opLIP);
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * op=0xB0 (MOV AL,imm8)
     *
     * @this {X86CPU}
     */
    opMOVALb: function() {
        this.regEAX = (this.regEAX & ~0xff) | this.getIPByte();
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB1 (MOV CL,imm8)
     *
     * @this {X86CPU}
     */
    opMOVCLb: function() {
        this.regECX = (this.regECX & ~0xff) | this.getIPByte();
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB2 (MOV DL,imm8)
     *
     * @this {X86CPU}
     */
    opMOVDLb: function() {
        this.regEDX = (this.regEDX & ~0xff) | this.getIPByte();
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB3 (MOV BL,imm8)
     *
     * @this {X86CPU}
     */
    opMOVBLb: function() {
        this.regEBX = (this.regEBX & ~0xff) | this.getIPByte();
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB4 (MOV AH,imm8)
     *
     * @this {X86CPU}
     */
    opMOVAHb: function() {
        this.regEAX = (this.regEAX & 0xff) | (this.getIPByte() << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB5 (MOV CH,imm8)
     *
     * @this {X86CPU}
     */
    opMOVCHb: function() {
        this.regECX = (this.regECX & 0xff) | (this.getIPByte() << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB6 (MOV DH,imm8)
     *
     * @this {X86CPU}
     */
    opMOVDHb: function() {
        this.regEDX = (this.regEDX & 0xff) | (this.getIPByte() << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB7 (MOV BH,imm8)
     *
     * @this {X86CPU}
     */
    opMOVBHb: function() {
        this.regEBX = (this.regEBX & 0xff) | (this.getIPByte() << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB8 (MOV AX,imm16)
     *
     * @this {X86CPU}
     */
    opMOVAXw: function() {
        this.regEAX = (this.regEAX & ~this.opMask) | this.getIPWord();
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xB9 (MOV CX,imm16)
     *
     * @this {X86CPU}
     */
    opMOVCXw: function() {
        this.regECX = (this.regECX & ~this.opMask) | this.getIPWord();
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xBA (MOV DX,imm16)
     *
     * @this {X86CPU}
     */
    opMOVDXw: function() {
        this.regEDX = (this.regEDX & ~this.opMask) | this.getIPWord();
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xBB (MOV BX,imm16)
     *
     * @this {X86CPU}
     */
    opMOVBXw: function() {
        this.regEBX = (this.regEBX & ~this.opMask) | this.getIPWord();
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xBC (MOV SP,imm16)
     *
     * @this {X86CPU}
     */
    opMOVSPw: function() {
        this.regESP = (this.regESP & ~this.opMask) | this.getIPWord();
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xBD (MOV BP,imm16)
     *
     * @this {X86CPU}
     */
    opMOVBPw: function() {
        this.regEBP = (this.regEBP & ~this.opMask) | this.getIPWord();
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xBE (MOV SI,imm16)
     *
     * @this {X86CPU}
     */
    opMOVSIw: function() {
        this.regESI = (this.regESI & ~this.opMask) | this.getIPWord();
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xBF (MOV DI,imm16)
     *
     * @this {X86CPU}
     */
    opMOVDIw: function() {
        this.regEDI = (this.regEDI & ~this.opMask) | this.getIPWord();
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLAHF;
    },
    /**
     * op=0xC0 (GRP2 byte,imm8) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opGrp2bi: function() {
        this.opMod.aOpModGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrp2b, X86Grps.opGrp2CountImm);
    },
    /**
     * op=0xC1 (GRP2 word,imm16) (80186/80188 and up)
     *
     * @this {X86CPU}
     */
    opGrp2wi: function() {
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrp2w, X86Grps.opGrp2CountImm);
    },
    /**
     * op=0xC2 (RET n)
     *
     * @this {X86CPU}
     */
    opRETn: function() {
        var n = this.getIPWord();
        this.setIP(this.popWord());
        this.regESP = (this.regESP & ~this.addrMask) | ((this.regESP + (n << this.opSize)) & this.addrMask);
        this.nStepCycles -= this.CYCLES.nOpCyclesRetn;
    },
    /**
     * op=0xC3 (RET)
     *
     * @this {X86CPU}
     */
    opRET: function() {
        this.setIP(this.popWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesRet;
    },
    /**
     * op=0xC4 (LES reg,word)
     *
     * @this {X86CPU}
     */
    opLES: function() {
        /*
         * This is like a "MOV reg,rm" operation, but it also loads ES from the next word.
         */
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpLES);
    },
    /**
     * op=0xC5 (LDS reg,word)
     *
     * @this {X86CPU}
     */
    opLDS: function() {
        /*
         * This is like a "MOV reg,rm" operation, but it also loads DS from the next word.
         */
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpLDS);
    },
    /**
     * op=0xC6 (MOV byte,imm8)
     *
     * @this {X86CPU}
     */
    opMOVb: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        this.opFlags |= X86.OPFLAG.NOREAD;
        this.opMod.aOpModGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrpMOVImm, this.getIPByte);
    },
    /**
     * op=0xC7 (MOV word,imm16)
     *
     * @this {X86CPU}
     */
    opMOVw: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        this.opFlags |= X86.OPFLAG.NOREAD;
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrpMOVImm, this.getIPWord);
    },
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
    opENTER: function() {
        var wLocal = this.getIPWord();
        var bLevel = this.getIPByte() & 0x1f;
        /*
         * NOTE: 11 is the minimum cycle time for the 80286; the 80186/80188 has different cycle times: 15, 25 and
         * 22 + 16 * (bLevel - 1) for bLevel 0, 1 and > 1, respectively.  However, accurate cycle times for the 80186/80188
         * is low priority. TODO: Fix this someday.
         */
        this.nStepCycles -= 11;
        this.pushWord(this.regEBP);
        var wFrame = this.regESP & this.segSS.addrMask;
        if (bLevel > 0) {
            this.nStepCycles -= (bLevel << 2) + (bLevel > 1? 1 : 0);
            while (--bLevel) {
                this.regEBP = (this.regEBP & ~this.segSS.addrMask) | ((this.regEBP - (2 << this.opSize)) & this.segSS.addrMask);
                this.pushWord(this.getSOWord(this.segSS, this.regEBP & this.segSS.addrMask));
            }
            this.pushWord(wFrame);
        }
        this.regEBP = (this.regEBP & ~this.segSS.addrMask) | wFrame;
        this.regESP = (this.regESP & ~this.segSS.addrMask) | ((this.regESP - wLocal) & this.segSS.addrMask);
    },
    /**
     * op=0xC9 (LEAVE) (80186/80188 and up)
     *
     * Set SP to BP, then pop BP.
     *
     * @this {X86CPU}
     */
    opLEAVE: function() {
        this.regESP = (this.regESP & ~this.segSS.addrMask) | (this.regEBP & this.segSS.addrMask);
        this.regEBP = (this.regEBP & ~this.opMask) | (this.popWord() & this.opMask);
        /*
         * NOTE: 5 is the cycle time for the 80286; the 80186/80188 has a cycle time of 8.  However, accurate cycle
         * counts for the 80186/80188 is low priority. TODO: Fix this someday.
         */
        this.nStepCycles -= 5;
    },
    /**
     * op=0xCA (RETF n)
     *
     * @this {X86CPU}
     */
    opRETFn: function() {
        X86Help.opHelpRETF.call(this, this.getIPWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesRetFn;
    },
    /**
     * op=0xCB (RETF)
     *
     * @this {X86CPU}
     */
    opRETF: function() {
        X86Help.opHelpRETF.call(this, 0);
        this.nStepCycles -= this.CYCLES.nOpCyclesRetF;
    },
    /**
     * op=0xCC (INT 3)
     *
     * @this {X86CPU}
     */
    opINT3: function() {
        X86Help.opHelpINT.call(this, X86.EXCEPTION.BREAKPOINT, null, this.CYCLES.nOpCyclesInt3D);
    },
    /**
     * op=0xCD (INT n)
     *
     * @this {X86CPU}
     */
    opINTn: function() {
        var nInt = this.getIPByte();
        if (this.checkIntNotify(nInt)) {
            X86Help.opHelpINT.call(this, nInt, null, 0);
            return;
        }
        this.nStepCycles--;     // we don't need to assess the full cost of nOpCyclesInt, but we need to assess something...
    },
    /**
     * op=0xCE (INTO: INT 4 if OF set)
     *
     * @this {X86CPU}
     */
    opINTO: function() {
        if (this.getOF()) {
            X86Help.opHelpINT.call(this, X86.EXCEPTION.OVERFLOW, null, this.CYCLES.nOpCyclesIntOD);
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesIntOFall;
    },
    /**
     * op=0xCF (IRET)
     *
     * @this {X86CPU}
     */
    opIRET: function() {
        X86Help.opHelpIRET.call(this);
    },
    /**
     * op=0xD0 (GRP2 byte,1)
     *
     * @this {X86CPU}
     */
    opGrp2b1: function() {
        this.opMod.aOpModGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrp2b, X86Grps.opGrp2Count1);
    },
    /**
     * op=0xD1 (GRP2 word,1)
     *
     * @this {X86CPU}
     */
    opGrp2w1: function() {
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrp2w, X86Grps.opGrp2Count1);
    },
    /**
     * op=0xD2 (GRP2 byte,CL)
     *
     * @this {X86CPU}
     */
    opGrp2bCL: function() {
        this.opMod.aOpModGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrp2b, X86Grps.opGrp2CountCL);
    },
    /**
     * op=0xD3 (GRP2 word,CL)
     *
     * @this {X86CPU}
     */
    opGrp2wCL: function() {
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrp2w, X86Grps.opGrp2CountCL);
    },
    /**
     * op=0xD4 0x0A (AAM)
     *
     * From "The 8086 Book":
     *
     *  1. Divide the AL register by OA16. Store the quotient in the AH register. Store the remainder in the AL register.
     *  2. Set the flags in the following manner:
     *      Parity: based on the AL register
     *      Sign : based on the high-order bit of the AL register Zero: based on the AL register
     *      Carry, Overflow, and Arithmetic: undefined
     *
     * @this {X86CPU}
     */
    opAAM: function() {
        var bDivisor = this.getIPByte();
        var AL = this.regEAX & 0xff;
        var bQuotient = (AL / bDivisor) & 0xff;
        var bRemainder = AL % bDivisor;
        this.regEAX = (bQuotient << 8) | bRemainder;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.resultValue = this.resultParitySign = AL;
        this.nStepCycles -= this.CYCLES.nOpCyclesAAM;
    },
    /**
     * op=0xD5 (AAD)
     *
     * From "The 8086 Book":
     *
     *  1. Multiply the contents of the AH register by 0x0A
     *  2. Add AH to AL.
     *  3. Store 0x00 into the AH register.
     *  4. Set the flags in the following manner:
     *      Parity: based on the AL register
     *      Zero: based on the AL register
     *      Sign: based on the high-order bit of the AL register
     *      Carry, Overflow, Arithmetic: undefined
     *
     * @this {X86CPU}
     */
    opAAD: function() {
        var bMultiplier = this.getIPByte();
        this.resultValue = this.resultParitySign = this.regEAX = (((this.regEAX >> 8) * bMultiplier) + this.regEAX) & 0xff;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= this.CYCLES.nOpCyclesAAD;
    },
    /**
     * op=0xD6 (SALC aka SETALC) (undocumented until Pentium Pro)
     *
     * Sets AL to 0xFF if CF=1, 0x00 otherwise; no flags are affected (similar to SBB AL,AL, but without side-effects)
     *
     * WARNING: I have no idea how many clocks this instruction originally consumed, so for now, I'm going with the minimum of 2.
     *
     * @this {X86CPU}
     */
    opSALC: function() {
        this.regEAX = (this.regEAX & ~0xff) | (this.getCF()? 0xFF : 0);
        this.nStepCycles -= 2;
    },
    /**
     * op=0xD7 (XLAT)
     *
     * @this {X86CPU}
     */
    opXLAT: function() {
        /*
         * NOTE: I have no idea whether XLAT actually wraps the 16-bit address calculation;
         * I'm masking it as if it does, but I need to run a test on real hardware to be sure.
         */
        this.regEAX = (this.regEAX & ~0xff) | this.getEAByte(this.segData, ((this.regEBX + (this.regEAX & 0xff)) & 0xffff));
        this.nStepCycles -= this.CYCLES.nOpCyclesXLAT;
    },
    /**
     * op=0xD8-0xDF (ESC)
     *
     * @this {X86CPU}
     */
    opESC: function() {
        this.opMod.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpESC);
        this.nStepCycles -= 8;      // TODO: Fix
    },
    /**
     * op=0xE0 (LOOPNZ disp)
     *
     * @this {X86CPU}
     */
    opLOOPNZ: function() {
        var disp = this.getIPDisp();
        if ((this.regECX = (this.regECX - 1) & 0xffff) && (this.resultValue & (this.resultSize - 1))) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesLoopNZ;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLoopFall;
    },
    /**
     * op=0xE1 (LOOPZ disp)
     *
     * @this {X86CPU}
     */
    opLOOPZ: function() {
        var disp = this.getIPDisp();
        if ((this.regECX = (this.regECX - 1) & 0xffff) && !(this.resultValue & (this.resultSize - 1))) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesLoopZ;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLoopZFall;
    },
    /**
     * op=0xE2 (LOOP disp)
     *
     * @this {X86CPU}
     */
    opLOOP: function() {
        var disp = this.getIPDisp();
        if ((this.regECX = (this.regECX - 1) & 0xffff)) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesLoop;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLoopFall;
    },
    /**
     * op=0xE3 (JCXZ disp)
     *
     * @this {X86CPU}
     */
    opJCXZ: function() {
        var disp = this.getIPDisp();
        if (!this.regECX) {
            this.setIP(this.regEIP + disp);
            this.nStepCycles -= this.CYCLES.nOpCyclesLoopZ;
            return;
        }
        this.nStepCycles -= this.CYCLES.nOpCyclesLoopZFall;
    },
    /**
     * op=0xE4 (IN AL,port)
     *
     * @this {X86CPU}
     */
    opINb: function() {
        var port = this.getIPByte();
        this.regEAX = (this.regEAX & ~0xff) | this.bus.checkPortInputNotify(port, this.regLIP - 2);
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
        this.nStepCycles -= this.CYCLES.nOpCyclesInP;
    },
    /**
     * op=0xE5 (IN AX,port)
     *
     * @this {X86CPU}
     */
    opINw: function() {
        var port = this.getIPByte();
        this.regEAX = this.bus.checkPortInputNotify(port, this.regLIP - 2);
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
        this.regEAX |= (this.bus.checkPortInputNotify((port + 1) & 0xffff, this.regLIP - 2) << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiIO;
        this.nStepCycles -= this.CYCLES.nOpCyclesInP;
    },
    /**
     * op=0xE6 (OUT port,AL)
     *
     * @this {X86CPU}
     */
    opOUTb: function() {
        var port = this.getIPByte();
        this.bus.checkPortOutputNotify(port, this.regEAX & 0xff, this.regLIP - 2);
        this.nStepCycles -= this.CYCLES.nOpCyclesOutP;
    },
    /**
     * op=0xE7 (OUT port,AX)
     *
     * @this {X86CPU}
     */
    opOUTw: function() {
        var port = this.getIPByte();
        this.bus.checkPortOutputNotify(port, this.regEAX & 0xff, this.regLIP - 2);
        this.bus.checkPortOutputNotify((port + 1) & 0xffff, this.regEAX >> 8, this.regLIP - 2);
        this.nStepCycles -= this.CYCLES.nOpCyclesOutP;
    },
    /**
     * op=0xE8 (CALL disp16)
     *
     * @this {X86CPU}
     */
    opCALL: function() {
        var disp = this.getIPWord();
        this.pushWord(this.regEIP);
        this.setIP(this.regEIP + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesCall;
    },
    /**
     * op=0xE9 (JMP disp16)
     *
     * @this {X86CPU}
     */
    opJMP: function() {
        var disp = this.getIPWord();
        this.setIP(this.regEIP + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmp;
    },
    /**
     * op=0xEA (JMP seg:off)
     *
     * @this {X86CPU}
     */
    opJMPF: function() {
        this.setCSIP(this.getIPWord(), this.getIPWord());
        this.nStepCycles -= this.CYCLES.nOpCyclesJmpF;
    },
    /**
     * op=0xEB (JMP short disp8)
     *
     * @this {X86CPU}
     */
    opJMPs: function() {
        var disp = this.getIPDisp();
        this.setIP(this.regEIP + disp);
        this.nStepCycles -= this.CYCLES.nOpCyclesJmp;
    },
    /**
     * op=0xEC (IN AL,dx)
     *
     * @this {X86CPU}
     */
    opINDXb: function() {
        this.regEAX = (this.regEAX & ~0xff) | this.bus.checkPortInputNotify(this.regEDX, this.regLIP - 1);
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
        this.nStepCycles -= this.CYCLES.nOpCyclesInDX;
    },
    /**
     * op=0xED (IN AX,dx)
     *
     * @this {X86CPU}
     */
    opINDXw: function() {
        this.regEAX = this.bus.checkPortInputNotify(this.regEDX, this.regLIP - 1);
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiIO;
        this.regEAX |= (this.bus.checkPortInputNotify((this.regEDX + 1) & 0xffff, this.regLIP - 1) << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiIO;
        this.nStepCycles -= this.CYCLES.nOpCyclesInDX;
    },
    /**
     * op=0xEE (OUT dx,AL)
     *
     * @this {X86CPU}
     */
    opOUTDXb: function() {
        if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiAL;
        this.bus.checkPortOutputNotify(this.regEDX, this.regEAX & 0xff, this.regLIP - 1);
        this.nStepCycles -= this.CYCLES.nOpCyclesOutDX;
    },
    /**
     * op=0xEF (OUT dx,AX)
     *
     * @this {X86CPU}
     */
    opOUTDXw: function() {
        if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiAL;
        this.bus.checkPortOutputNotify(this.regEDX, this.regEAX & 0xff, this.regLIP - 1);
        if (BACKTRACK) this.backTrack.btiIO = this.backTrack.btiAH;
        this.bus.checkPortOutputNotify((this.regEDX + 1) & 0xffff, this.regEAX >> 8, this.regLIP - 1);
        this.nStepCycles -= this.CYCLES.nOpCyclesOutDX;
    },
    /**
     * op=0xF0 (LOCK:)
     *
     * @this {X86CPU}
     */
    opLOCK: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with LOCK is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.LOCK | X86.OPFLAG.NOINTR;
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0xF1 (INT1; undocumented; 80186/80188 and up; TODO: Verify)
     *
     * I still treat this as undefined, until I can verify the behavior on real hardware.
     *
     * @this {X86CPU}
     */
    opINT1: function() {
        X86Help.opHelpUndefined.call(this);
    },
    /**
     * op=0xF2 (REPNZ:) (repeat CMPS or SCAS until NZ; repeat MOVS, LODS, or STOS unconditionally)
     *
     * @this {X86CPU}
     */
    opREPNZ: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with REPNZ is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.REPNZ | X86.OPFLAG.NOINTR;
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0xF3 (REPZ:) (repeat CMPS or SCAS until Z; repeat MOVS, LODS, or STOS unconditionally)
     *
     * @this {X86CPU}
     */
    opREPZ: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with REPZ is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.REPZ | X86.OPFLAG.NOINTR;
        this.nStepCycles -= this.CYCLES.nOpCyclesPrefix;
    },
    /**
     * op=0xF4 (HLT)
     *
     * @this {X86CPU}
     */
    opHLT: function() {
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
    },
    /**
     * op=0xF5 (CMC)
     *
     * @this {X86CPU}
     */
    opCMC: function() {
        if (this.getCF()) this.clearCF(); else this.setCF();
        this.nStepCycles -= 2;                          // CMC takes 2 cycles on all CPUs
    },
    /**
     * op=0xF6 (GRP3 byte)
     *
     * The MUL byte instruction is problematic in two cases:
     *
     *      0xF6 0xE0:  MUL AL
     *      0xF6 0xE4:  MUL AH
     *
     * because the OpModGrpByte decoder function will attempt to put the opGrpMULb() function's
     * return value back into AL or AH, undoing opGrpMULb's update of AX.  And since opGrpMULb doesn't
     * know what the target is (only the target's value), it cannot easily work around the problem.
     *
     * A simple, albeit kludgy, solution is for opGrpMULb to always save its result in a special "register"
     * (eg, regMD16), which we will then put back into regEAX if it's been updated.  This also relieves us
     * from having to decode any part of the ModRM byte, so maybe it's not such a bad work-around after all.
     *
     * Similar issues with IMUL (and DIV and IDIV) are resolved using the same special variable(s).
     *
     * @this {X86CPU}
     */
    opGrp3b: function() {
        this.regMD16 = -1;
        this.opMod.aOpModGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrp3b, X86Grps.opGrpNoSrc);
        if (this.regMD16 >= 0) this.regEAX = this.regMD16;
    },
    /**
     * op=0xF7 (GRP3 word)
     *
     * The MUL word instruction is problematic in two cases:
     *
     *      0xF7 0xE0:  MUL AX
     *      0xF7 0xE2:  MUL DX
     *
     * because the OpModGrpWord decoder function will attempt to put the opGrpMULw() function's
     * return value back into AX or DX, undoing opGrpMULw's update of DX:AX.  And since opGrpMULw doesn't
     * know what the target is (only the target's value), it cannot easily work around the problem.
     *
     * A simple, albeit kludgey, solution is for opGrpMULw to always save its result in a special "register"
     * (eg, regMD16/regMD32), which we will then put back into regEAX/regEDX if it's been updated.  This also relieves
     * us from having to decode any part of the ModRM byte, so maybe it's not such a bad work-around after all.
     *
     * @this {X86CPU}
     */
    opGrp3w: function() {
        this.regMD16 = -1;
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrp3w, X86Grps.opGrpNoSrc);
        if (this.regMD16 >= 0) {
            this.regEAX = this.regMD16;
            this.regEDX = this.regMD32;
        }
    },
    /**
     * op=0xF8 (CLC)
     *
     * @this {X86CPU}
     */
    opCLC: function() {
        this.resultValue &= ~this.resultSize;
        this.nStepCycles -= 2;                          // CLC takes 2 cycles on all CPUs
    },
    /**
     * op=0xF9 (STC)
     *
     * @this {X86CPU}
     */
    opSTC: function() {
        this.resultValue |= this.resultSize;
        this.nStepCycles -= 2;                          // STC takes 2 cycles on all CPUs
    },
    /**
     * op=0xFA (CLI)
     *
     * @this {X86CPU}
     */
    opCLI: function() {
        this.clearIF();
        this.nStepCycles -= this.CYCLES.nOpCyclesCLI;          // CLI takes LONGER on an 80286
    },
    /**
     * op=0xFB (STI)
     *
     * @this {X86CPU}
     */
    opSTI: function() {
        this.setIF();
        this.opFlags |= X86.OPFLAG.NOINTR;
        this.nStepCycles -= 2;                          // STI takes 2 cycles on all CPUs
    },
    /**
     * op=0xFC (CLD)
     *
     * @this {X86CPU}
     */
    opCLD: function() {
        this.clearDF();
        this.nStepCycles -= 2;                          // CLD takes 2 cycles on all CPUs
    },
    /**
     * op=0xFD (STD)
     *
     * @this {X86CPU}
     */
    opSTD: function() {
        this.setDF();
        this.nStepCycles -= 2;                          // STD takes 2 cycles on all CPUs
    },
    /**
     * op=0xFE (GRP4 byte)
     *
     * @this {X86CPU}
     */
    opGrp4b: function() {
        this.opMod.aOpModGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrp4b, X86Grps.opGrpNoSrc);
    },
    /**
     * op=0xFF (GRP4 word)
     *
     * @this {X86CPU}
     */
    opGrp4w: function() {
        this.opMod.aOpModGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrp4w, X86Grps.opGrpNoSrc);
    }
};

/*
 * This 256-entry array of opcode functions is at the heart of the CPU engine: stepCPU(n).
 *
 * It might be worth trying a switch() statement instead, to see how the performance compares,
 * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
 * money on array lookup.
 */
X86OpXX.aOps = [
    X86OpXX.opADDmb,        X86OpXX.opADDmw,        X86OpXX.opADDrb,        X86OpXX.opADDrw,        // 0x00-0x03
    X86OpXX.opADDALb,       X86OpXX.opADDAXw,       X86OpXX.opPUSHES,       X86OpXX.opPOPES,        // 0x04-0x07
    X86OpXX.opORmb,         X86OpXX.opORmw,         X86OpXX.opORrb,         X86OpXX.opORrw,         // 0x08-0x0B
    X86OpXX.opORALb,        X86OpXX.opORAXw,        X86OpXX.opPUSHCS,       X86OpXX.opPOPCS,        // 0x0C-0x0F
    X86OpXX.opADCmb,        X86OpXX.opADCmw,        X86OpXX.opADCrb,        X86OpXX.opADCrw,        // 0x10-0x13
    X86OpXX.opADCALb,       X86OpXX.opADCAXw,       X86OpXX.opPUSHSS,       X86OpXX.opPOPSS,        // 0x14-0x17
    X86OpXX.opSBBmb,        X86OpXX.opSBBmw,        X86OpXX.opSBBrb,        X86OpXX.opSBBrw,        // 0x18-0x1B
    X86OpXX.opSBBALb,       X86OpXX.opSBBAXw,       X86OpXX.opPUSHDS,       X86OpXX.opPOPDS,        // 0x1C-0x1F
    X86OpXX.opANDmb,        X86OpXX.opANDmw,        X86OpXX.opANDrb,        X86OpXX.opANDrw,        // 0x20-0x23
    X86OpXX.opANDALb,       X86OpXX.opANDAXw,       X86OpXX.opES,           X86OpXX.opDAA,          // 0x24-0x27
    X86OpXX.opSUBmb,        X86OpXX.opSUBmw,        X86OpXX.opSUBrb,        X86OpXX.opSUBrw,        // 0x28-0x2B
    X86OpXX.opSUBALb,       X86OpXX.opSUBAXw,       X86OpXX.opCS,           X86OpXX.opDAS,          // 0x2C-0x2F
    X86OpXX.opXORmb,        X86OpXX.opXORmw,        X86OpXX.opXORrb,        X86OpXX.opXORrw,        // 0x30-0x33
    X86OpXX.opXORALb,       X86OpXX.opXORAXw,       X86OpXX.opSS,           X86OpXX.opAAA,          // 0x34-0x37
    X86OpXX.opCMPmb,        X86OpXX.opCMPmw,        X86OpXX.opCMPrb,        X86OpXX.opCMPrw,        // 0x38-0x3B
    X86OpXX.opCMPALb,       X86OpXX.opCMPAXw,       X86OpXX.opDS,           X86OpXX.opAAS,          // 0x3C-0x3F
    X86OpXX.opINCAX,        X86OpXX.opINCCX,        X86OpXX.opINCDX,        X86OpXX.opINCBX,        // 0x40-0x43
    X86OpXX.opINCSP,        X86OpXX.opINCBP,        X86OpXX.opINCSI,        X86OpXX.opINCDI,        // 0x44-0x47
    X86OpXX.opDECAX,        X86OpXX.opDECCX,        X86OpXX.opDECDX,        X86OpXX.opDECBX,        // 0x48-0x4B
    X86OpXX.opDECSP,        X86OpXX.opDECBP,        X86OpXX.opDECSI,        X86OpXX.opDECDI,        // 0x4C-0x4F
    X86OpXX.opPUSHAX,       X86OpXX.opPUSHCX,       X86OpXX.opPUSHDX,       X86OpXX.opPUSHBX,       // 0x50-0x53
    X86OpXX.opPUSHSP8086,   X86OpXX.opPUSHBP,       X86OpXX.opPUSHSI,       X86OpXX.opPUSHDI,       // 0x54-0x57
    X86OpXX.opPOPAX,        X86OpXX.opPOPCX,        X86OpXX.opPOPDX,        X86OpXX.opPOPBX,        // 0x58-0x5B
    X86OpXX.opPOPSP,        X86OpXX.opPOPBP,        X86OpXX.opPOPSI,        X86OpXX.opPOPDI,        // 0x5C-0x5F
    /*
     * On an 8086/8088, opcodes 0x60-0x6F are aliases for the conditional jumps 0x70-0x7F.  Sometimes you'll see
     * references to these opcodes (like 0x60) being a "two-byte NOP" and using them differentiate an 8088 from newer
     * CPUs, but they're only a "two-byte NOP" if the second byte is zero, resulting in zero displacement.
     */
    X86OpXX.opJO,           X86OpXX.opJNO,          X86OpXX.opJC,           X86OpXX.opJNC,          // 0x60-0x63
    X86OpXX.opJZ,           X86OpXX.opJNZ,          X86OpXX.opJBE,          X86OpXX.opJNBE,         // 0x64-0x67
    X86OpXX.opJS,           X86OpXX.opJNS,          X86OpXX.opJP,           X86OpXX.opJNP,          // 0x68-0x6B
    X86OpXX.opJL,           X86OpXX.opJNL,          X86OpXX.opJLE,          X86OpXX.opJNLE,         // 0x6C-0x6F
    X86OpXX.opJO,           X86OpXX.opJNO,          X86OpXX.opJC,           X86OpXX.opJNC,          // 0x70-0x73
    X86OpXX.opJZ,           X86OpXX.opJNZ,          X86OpXX.opJBE,          X86OpXX.opJNBE,         // 0x74-0x77
    X86OpXX.opJS,           X86OpXX.opJNS,          X86OpXX.opJP,           X86OpXX.opJNP,          // 0x78-0x7B
    X86OpXX.opJL,           X86OpXX.opJNL,          X86OpXX.opJLE,          X86OpXX.opJNLE,         // 0x7C-0x7F
    /*
     * On all processors, opcode groups 0x80 and 0x82 perform identically (0x82 opcodes sign-extend their
     * immediate data, but since both 0x80 and 0x82 are byte operations, the sign extension has no effect).
     *
     * WARNING: Intel's "Pentium Processor User's Manual (Volume 3: Architecture and Programming Manual)" refers
     * to opcode 0x82 as a "reserved" instruction, but also cryptically refers to it as "MOVB AL,imm".  This is
     * assumed to be an error in the manual, because as far as I know, 0x82 has always mirrored 0x80.
     */
    X86OpXX.opGrp1b,        X86OpXX.opGrp1w,        X86OpXX.opGrp1b,        X86OpXX.opGrp1sw,       // 0x80-0x83
    X86OpXX.opTESTrb,       X86OpXX.opTESTrw,       X86OpXX.opXCHGrb,       X86OpXX.opXCHGrw,       // 0x84-0x87
    X86OpXX.opMOVmb,        X86OpXX.opMOVmw,        X86OpXX.opMOVrb,        X86OpXX.opMOVrw,        // 0x88-0x8B
    X86OpXX.opMOVwsr,       X86OpXX.opLEA,          X86OpXX.opMOVsrw,       X86OpXX.opPOPmw,        // 0x8C-0x8F
    X86OpXX.opNOP,          X86OpXX.opXCHGCX,       X86OpXX.opXCHGDX,       X86OpXX.opXCHGBX,       // 0x90-0x93
    X86OpXX.opXCHGSP,       X86OpXX.opXCHGBP,       X86OpXX.opXCHGSI,       X86OpXX.opXCHGDI,       // 0x94-0x97
    X86OpXX.opCBW,          X86OpXX.opCWD,          X86OpXX.opCALLF,        X86OpXX.opWAIT,         // 0x98-0x9B
    X86OpXX.opPUSHF,        X86OpXX.opPOPF,         X86OpXX.opSAHF,         X86OpXX.opLAHF,         // 0x9C-0x9F
    X86OpXX.opMOVALm,       X86OpXX.opMOVAXm,       X86OpXX.opMOVmAL,       X86OpXX.opMOVmAX,       // 0xA0-0xA3
    X86OpXX.opMOVSb,        X86OpXX.opMOVSw,        X86OpXX.opCMPSb,        X86OpXX.opCMPSw,        // 0xA4-0xA7
    X86OpXX.opTESTALb,      X86OpXX.opTESTAXw,      X86OpXX.opSTOSb,        X86OpXX.opSTOSw,        // 0xA8-0xAB
    X86OpXX.opLODSb,        X86OpXX.opLODSw,        X86OpXX.opSCASb,        X86OpXX.opSCASw,        // 0xAC-0xAF
    X86OpXX.opMOVALb,       X86OpXX.opMOVCLb,       X86OpXX.opMOVDLb,       X86OpXX.opMOVBLb,       // 0xB0-0xB3
    X86OpXX.opMOVAHb,       X86OpXX.opMOVCHb,       X86OpXX.opMOVDHb,       X86OpXX.opMOVBHb,       // 0xB4-0xB7
    X86OpXX.opMOVAXw,       X86OpXX.opMOVCXw,       X86OpXX.opMOVDXw,       X86OpXX.opMOVBXw,       // 0xB8-0xBB
    X86OpXX.opMOVSPw,       X86OpXX.opMOVBPw,       X86OpXX.opMOVSIw,       X86OpXX.opMOVDIw,       // 0xBC-0xBF
    /*
     * On an 8086/8088, opcodes 0xC0 -> 0xC2, 0xC1 -> 0xC3, 0xC8 -> 0xCA and 0xC9 -> 0xCB.
     */
    X86OpXX.opRETn,         X86OpXX.opRET,          X86OpXX.opRETn,         X86OpXX.opRET,          // 0xC0-0xC3
    X86OpXX.opLES,          X86OpXX.opLDS,          X86OpXX.opMOVb,         X86OpXX.opMOVw,         // 0xC4-0xC7
    X86OpXX.opRETFn,        X86OpXX.opRETF,         X86OpXX.opRETFn,        X86OpXX.opRETF,         // 0xC8-0xCB
    X86OpXX.opINT3,         X86OpXX.opINTn,         X86OpXX.opINTO,         X86OpXX.opIRET,         // 0xCC-0xCF
    X86OpXX.opGrp2b1,       X86OpXX.opGrp2w1,       X86OpXX.opGrp2bCL,      X86OpXX.opGrp2wCL,      // 0xD0-0xD3
    /*
     * Even as of the Pentium, opcode 0xD6 is still marked as "reserved", but it's always been SALC (aka SETALC).
     */
    X86OpXX.opAAM,          X86OpXX.opAAD,          X86OpXX.opSALC,         X86OpXX.opXLAT,         // 0xD4-0xD7
    X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          // 0xD8-0xDB
    X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          // 0xDC-0xDF
    X86OpXX.opLOOPNZ,       X86OpXX.opLOOPZ,        X86OpXX.opLOOP,         X86OpXX.opJCXZ,         // 0xE0-0xE3
    X86OpXX.opINb,          X86OpXX.opINw,          X86OpXX.opOUTb,         X86OpXX.opOUTw,         // 0xE4-0xE7
    X86OpXX.opCALL,         X86OpXX.opJMP,          X86OpXX.opJMPF,         X86OpXX.opJMPs,         // 0xE8-0xEB
    X86OpXX.opINDXb,        X86OpXX.opINDXw,        X86OpXX.opOUTDXb,       X86OpXX.opOUTDXw,       // 0xEC-0xEF
    /*
     * On an 8086/8088, opcode 0xF1 is believed to be an alias for 0xF0; in any case, it definitely behaves like
     * a prefix on those processors, so we treat it as such.  On the 80186 and up, we treat as opINT1().
     *
     * As of the Pentium, opcode 0xF1 is still marked "reserved".
     */
    X86OpXX.opLOCK,         X86OpXX.opLOCK,         X86OpXX.opREPNZ,        X86OpXX.opREPZ,         // 0xF0-0xF3
    X86OpXX.opHLT,          X86OpXX.opCMC,          X86OpXX.opGrp3b,        X86OpXX.opGrp3w,        // 0xF4-0xF7
    X86OpXX.opCLC,          X86OpXX.opSTC,          X86OpXX.opCLI,          X86OpXX.opSTI,          // 0xF8-0xFB
    X86OpXX.opCLD,          X86OpXX.opSTD,          X86OpXX.opGrp4b,        X86OpXX.opGrp4w         // 0xFC-0xFF
];

if (typeof module !== 'undefined') module.exports = X86OpXX;
