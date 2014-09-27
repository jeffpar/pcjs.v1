/**
 * @fileoverview Implements PCjs 8086 opcode decoding.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Sep-05
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
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
    var Component = require("../../shared/lib/component");
    var X86 = require("./x86");
    var X86Grps = require("./x86grps");
    var X86Help = require("./x86help");
    var X86Mods = require("./x86mods");
    var X86Op0F = require("./x86op0f");
}

var X86OpXX = {
    /**
     * @this {X86CPU}
     *
     * op=0x00 (addb rm,reg)
     */
    opADDmb: function() {
        var b = this.getIPByte();
        /*
         * Look for common *potentially* bogus opcodes in DEBUG
         */
        if (DEBUG && !b) this.haltCPU();
        X86Mods.aOpModsMemByte[b].call(this, X86Grps.opGrpADDb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x01 (addw rm,reg)
     */
    opADDmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpADDw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x02 (addb reg,rm)
     */
    opADDrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpADDb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x03 (addw reg,rm)
     */
    opADDrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpADDw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x04 (add AL,imm8)
     */
    opADDALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpADDb.call(this, this.regAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpADDb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x05 (add AX,imm16)
     */
    opADDAXw: function() {
        this.regAX = X86Grps.opGrpADDw.call(this, this.regAX, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpADDw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x06 (push ES)
     */
    opPUSHES: function() {
        this.pushWord(this.segES.sel);
        this.nStepCycles -= this.nOpCyclesPushSeg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x07 (pop ES)
     */
    opPOPES: function() {
        this.setES(this.popWord());
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x08 (orb rm,reg)
     */
    opORmb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Grps.opGrpORb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x09 (orw rm,reg)
     */
    opORmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpORw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0A (orb reg,rm)
     */
    opORrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpORb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0B (orw reg,rm)
     */
    opORrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpORw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0C (or AL,imm8)
     */
    opORALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpORb.call(this, this.regAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpORb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0D (or AX,imm16)
     */
    opORAXw: function() {
        this.regAX = X86Grps.opGrpORw.call(this, this.regAX, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpORw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0E (push CS)
     */
    opPUSHCS: function() {
        this.pushWord(this.segCS.sel);
        this.nStepCycles -= this.nOpCyclesPushSeg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F (pop CS) (undocumented on 8086/8088; replaced with opInvalid on 80186/80188, and op0F on 80286 and up)
     */
    opPOPCS: function() {
        this.setCS(this.popWord());
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F (handler for two-byte opcodes on 80286 and up)
     */
    op0F: function() {
        X86Op0F.aOps0F[this.getIPByte()].call(this);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x10 (adcb rm,reg)
     */
    opADCmb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Grps.opGrpADCb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x11 (adcw rm,reg)
     */
    opADCmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpADCw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x12 (adcb reg,rm)
     */
    opADCrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpADCb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x13 (adcw reg,rm)
     */
    opADCrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpADCw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x14 (adc AL,imm8)
     */
    opADCALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpADCb.call(this, this.regAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpADCb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x15 (adc AX,imm16)
     */
    opADCAXw: function() {
        this.regAX = X86Grps.opGrpADCw.call(this, this.regAX, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpADCw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x16 (push SS)
     */
    opPUSHSS: function() {
        this.pushWord(this.segSS.sel);
        this.nStepCycles -= this.nOpCyclesPushSeg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x17 (pop SS)
     */
    opPOPSS: function() {
        this.setSS(this.popWord());
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x18 (sbbb rm,reg)
     */
    opSBBmb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Grps.opGrpSBBb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x19 (sbbw rm,reg)
     */
    opSBBmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpSBBw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x1A (sbbb reg,rm)
     */
    opSBBrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpSBBb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x1B (sbbw reg,rm)
     */
    opSBBrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpSBBw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x1C (sbb AL,imm8)
     */
    opSBBALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpSBBb.call(this, this.regAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpSBBb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x1D (sbb AX,imm16)
     */
    opSBBAXw: function() {
        this.regAX = X86Grps.opGrpSBBw.call(this, this.regAX, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpSBBw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x1E (push DS)
     */
    opPUSHDS: function() {
        this.pushWord(this.segDS.sel);
        this.nStepCycles -= this.nOpCyclesPushSeg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x1F (pop DS)
     */
    opPOPDS: function() {
        this.setDS(this.popWord());
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x20 (andb rm,reg)
     */
    opANDmb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Grps.opGrpANDb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x21 (andw rm,reg)
     */
    opANDmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpANDw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x22 (andb reg,rm)
     */
    opANDrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpANDb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x23 (andw reg,rm)
     */
    opANDrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpANDw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x24 (and AL,imm8)
     */
    opANDALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpANDb.call(this, this.regAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpANDb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x25 (and AX,imm16)
     */
    opANDAXw: function() {
        this.regAX = X86Grps.opGrpANDw.call(this, this.regAX, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpANDw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x26 (ES:)
     */
    opES: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segES;
        this.nStepCycles -= this.nOpCyclesPrefix;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x27 (daa)
     */
    opDAA: function() {
        var AL = this.regAX & 0xff;
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
        this.regAX = (this.regAX & ~0xff) | (this.resultValue = this.resultParitySign = (AL & 0xff));
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.nOpCyclesAAA;          // AAA and DAA have the same cycle times
    },
    /**
     * @this {X86CPU}
     *
     * op=0x28 (subb rm,reg)
     */
    opSUBmb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Grps.opGrpSUBb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x29 (subw rm,reg)
     */
    opSUBmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpSUBw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x2A (subb reg,rm)
     */
    opSUBrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpSUBb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x2B (subw reg,rm)
     */
    opSUBrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpSUBw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x2C (sub AL,imm8)
     */
    opSUBALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpSUBb.call(this, this.regAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpSUBb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x2D (sub AX,imm16)
     */
    opSUBAXw: function() {
        this.regAX = X86Grps.opGrpSUBw.call(this, this.regAX, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpSUBw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x2E (CS:)
     */
    opCS: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segCS;
        this.nStepCycles -= this.nOpCyclesPrefix;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x2F (das)
     */
    opDAS: function() {
        var AL = this.regAX & 0xff;
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
        this.regAX = (this.regAX & ~0xff) | (this.resultValue = this.resultParitySign = (AL & 0xff));
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.nOpCyclesAAA;          // AAA and DAS have the same cycle times
    },
    /**
     * @this {X86CPU}
     *
     * op=0x30 (xorb rm,reg)
     */
    opXORmb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Grps.opGrpXORb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x31 (xorw rm,reg)
     */
    opXORmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpXORw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x32 (xorb reg,rm)
     */
    opXORrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpXORb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x33 (xorw reg,rm)
     */
    opXORrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpXORw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x34 (xor AL,imm8)
     */
    opXORALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpXORb.call(this, this.regAX & 0xff, this.getIPByte());
        /*
         * In the absence of any EA calculations, opGrpXORb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x35 (xor AX,imm16)
     */
    opXORAXw: function() {
        this.regAX = X86Grps.opGrpXORw.call(this, this.regAX, this.getIPWord());
        /*
         * In the absence of any EA calculations, opGrpXORw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x36 (SS:)
     */
    opSS: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segSS;      // QUESTION: Is there a case where segStack would not already be segSS? (eg, multiple segment overrides?)
        this.nStepCycles -= this.nOpCyclesPrefix;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x37 (aaa)
     */
    opAAA: function() {
        var AL = this.regAX & 0xff;
        var AH = this.regAX >> 8;
        var fCarry;
        var fAuxCarry = this.getAF();
        if ((AL & 0xf) > 9 || fAuxCarry) {
            AL = (AL + 0x6) & 0xf;
            AH = (AH + 1) & 0xff;
            fCarry = fAuxCarry = true;
        } else {
            fCarry = fAuxCarry = false;
        }
        this.regAX = (AH << 8) | (this.resultValue = AL);
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.nOpCyclesAAA;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x38 (cmpb rm,reg)
     */
    opCMPmb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Grps.opGrpCMPb);
        if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x39 (cmpw rm,reg)
     */
    opCMPmw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Grps.opGrpCMPw);
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x3A (cmpb reg,rm)
     */
    opCMPrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Grps.opGrpCMPb);
        if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x3B (cmpw reg,rm)
     */
    opCMPrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Grps.opGrpCMPw);
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x3C (cmp AL,imm8)
     */
    opCMPALb: function() {
        this.regAX = (this.regAX & ~0xff) | X86Grps.opGrpCMPb.call(this, this.regAX & 0xff, this.getIPByte());
        if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
        /*
         * In the absence of any EA calculations, opGrpCMPb() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x3D (cmp AX,imm16)
     */
    opCMPAXw: function() {
        this.regAX = X86Grps.opGrpCMPw.call(this, this.regAX, this.getIPWord());
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
        /*
         * In the absence of any EA calculations, opGrpCMPw() will deduct nOpCyclesArithRR, and for all CPUs through
         * the 80286, we need deduct only one more cycle.
         */
        this.nStepCycles--;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x3E (DS:)
     */
    opDS: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with SEG is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.SEG | X86.OPFLAG.NOINTR;
        this.segData = this.segStack = this.segDS;      // QUESTION: Is there a case where segData would not already be segDS? (eg, multiple segment overrides?)
        this.nStepCycles -= this.nOpCyclesPrefix;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x3D (aas)
     *
     * From "The 8086 Book":
     *
     *  1. If the low-order four bits of the AL register are between 0 and 9 and the AF flag is 0, then go to Step 3.
     *  2. If the low-order four bits of the AL register are between A and F or the AF flag is 1, then subtract 6 from the AL register, subtract 1 from the AH register, and set the AF flag to 1.
     *  3. Clear the high-order four bits of the AL register.
     *  4. Set the CF flag to the value of the AF flag.
     */
    opAAS: function() {
        var AL = this.regAX & 0xff;
        var AH = this.regAX >> 8;
        var fCarry;
        var fAuxCarry = this.getAF();
        if ((AL & 0xf) > 9 || fAuxCarry) {
            AL = (AL - 0x6) & 0xf;
            AH = (AH - 1) & 0xff;
            fCarry = fAuxCarry = true;
        } else {
            fCarry = fAuxCarry = false;
        }
        this.regAX = (AH << 8) | (this.resultValue = AL);
        this.resultSize = X86.RESULT.SIZE_WORD;
        if (fCarry) this.resultValue |= this.resultSize;
        if (fAuxCarry) this.setAF(); else this.clearAF();
        this.nStepCycles -= this.nOpCyclesAAA;          // AAA and AAS have the same cycle times
    },
    /**
     * @this {X86CPU}
     *
     * op=0x40 (inc AX)
     */
    opINCAX: function() {
        this.resultAuxOverflow = this.regAX;
        this.regAX = (this.resultParitySign = this.regAX + 1) & 0xffff;
        this.resultValue = this.regAX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x41 (inc CX)
     */
    opINCCX: function() {
        this.resultAuxOverflow = this.regCX;
        this.regCX = (this.resultParitySign = this.regCX + 1) & 0xffff;
        this.resultValue = this.regCX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x42 (inc DX)
     */
    opINCDX: function() {
        this.resultAuxOverflow = this.regDX;
        this.regDX = (this.resultParitySign = this.regDX + 1) & 0xffff;
        this.resultValue = this.regDX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x43 (inc BX)
     */
    opINCBX: function() {
        this.resultAuxOverflow = this.regBX;
        this.regBX = (this.resultParitySign = this.regBX + 1) & 0xffff;
        this.resultValue = this.regBX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x44 (inc SP)
     */
    opINCSP: function() {
        this.resultAuxOverflow = this.regSP;
        this.regSP = (this.resultParitySign = this.regSP + 1) & 0xffff;
        this.resultValue = this.regSP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x45 (inc BP)
     */
    opINCBP: function() {
        this.resultAuxOverflow = this.regBP;
        this.regBP = (this.resultParitySign = this.regBP + 1) & 0xffff;
        this.resultValue = this.regBP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x46 (inc SI)
     */
    opINCSI: function() {
        this.resultAuxOverflow = this.regSI;
        this.regSI = (this.resultParitySign = this.regSI + 1) & 0xffff;
        this.resultValue = this.regSI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x47 (inc DI)
     */
    opINCDI: function() {
        this.resultAuxOverflow = this.regDI;
        this.regDI = (this.resultParitySign = this.regDI + 1) & 0xffff;
        this.resultValue = this.regDI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of INC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x48 (dec AX)
     */
    opDECAX: function() {
        this.resultAuxOverflow = this.regAX;
        this.regAX = (this.resultParitySign = this.regAX - 1) & 0xffff;
        this.resultValue = this.regAX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x49 (dec CX)
     */
    opDECCX: function() {
        this.resultAuxOverflow = this.regCX;
        this.regCX = (this.resultParitySign = this.regCX - 1) & 0xffff;
        this.resultValue = this.regCX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x4A (dec DX)
     */
    opDECDX: function() {
        this.resultAuxOverflow = this.regDX;
        this.regDX = (this.resultParitySign = this.regDX - 1) & 0xffff;
        this.resultValue = this.regDX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x4B (dec BX)
     */
    opDECBX: function() {
        this.resultAuxOverflow = this.regBX;
        this.regBX = (this.resultParitySign = this.regBX - 1) & 0xffff;
        this.resultValue = this.regBX | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x4C (dec SP)
     */
    opDECSP: function() {
        this.resultAuxOverflow = this.regSP;
        this.regSP = (this.resultParitySign = this.regSP - 1) & 0xffff;
        this.resultValue = this.regSP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x4D (dec BP)
     */
    opDECBP: function() {
        this.resultAuxOverflow = this.regBP;
        this.regBP = (this.resultParitySign = this.regBP - 1) & 0xffff;
        this.resultValue = this.regBP | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x4E (dec SI)
     */
    opDECSI: function() {
        this.resultAuxOverflow = this.regSI;
        this.regSI = (this.resultParitySign = this.regSI - 1) & 0xffff;
        this.resultValue = this.regSI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x4F (dec DI)
     */
    opDECDI: function() {
        this.resultAuxOverflow = this.regDI;
        this.regDI = (this.resultParitySign = this.regDI - 1) & 0xffff;
        this.resultValue = this.regDI | (((this.resultValue & this.resultSize)? 1 : 0) << 16);
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= 2;                          // this form of DEC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x50 (push AX)
     */
    opPUSHAX: function() {
        this.pushWord(this.regAX);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x51 (push CX)
     */
    opPUSHCX: function() {
        this.pushWord(this.regCX);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x52 (push DX)
     */
    opPUSHDX: function() {
        this.pushWord(this.regDX);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x53 (push BX)
     */
    opPUSHBX: function() {
        this.pushWord(this.regBX);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x54 (push SP)
     */
    opPUSHSP: function() {
        var w = (this.regSP - 2) & 0xffff;
        this.pushWord(w);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x54 (push SP)
     */
    op286PUSHSP: function() {
        this.pushWord(this.regSP);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x55 (push BP)
     */
    opPUSHBP: function() {
        this.pushWord(this.regBP);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x56 (push SI)
     */
    opPUSHSI: function() {
        this.pushWord(this.regSI);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x57 (push DI)
     */
    opPUSHDI: function() {
        this.pushWord(this.regDI);
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x58 (pop AX)
     */
    opPOPAX: function() {
        this.regAX = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x59 (pop CX)
     */
    opPOPCX: function() {
        this.regCX = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x5A (pop DX)
     */
    opPOPDX: function() {
        this.regDX = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x5B (pop BX)
     */
    opPOPBX: function() {
        this.regBX = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x5C (pop SP)
     */
    opPOPSP: function() {
        this.regSP = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x5D (pop BP)
     */
    opPOPBP: function() {
        this.regBP = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x5E (pop SI)
     */
    opPOPSI: function() {
        this.regSI = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x5F (pop DI)
     */
    opPOPDI: function() {
        this.regDI = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x60 (pusha) (80186/80188 and up)
     */
    opPUSHA: function() {
        var temp = this.regSP;
        this.pushWord(this.regAX);
        this.pushWord(this.regCX);
        this.pushWord(this.regDX);
        this.pushWord(this.regBX);
        this.pushWord(temp);
        this.pushWord(this.regBP);
        this.pushWord(this.regSI);
        this.pushWord(this.regDI);
        this.nStepCycles -= this.nOpCyclesPushAll;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x61 (popa) (80186/80188 and up)
     */
    opPOPA: function() {
        this.regDI = this.popWord();
        this.regSI = this.popWord();
        this.regBP = this.popWord();
        this.regSP += 2;
        this.regBX = this.popWord();
        this.regDX = this.popWord();
        this.regCX = this.popWord();
        this.regAX = this.popWord();
        this.nStepCycles -= this.nOpCyclesPopAll;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x62 (bound reg,rm) (80186/80188 and up)
     */
    opBOUND: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpBOUND);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x63 (arpl rm,reg) (80286 and up)
     */
    opARPL: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Help.opHelpARPL);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x68 (push imm16) (80186/80188 and up)
     */
    opPUSH16: function() {
        this.pushWord(this.getIPWord());
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x69 (imul reg,rm,imm16) (80186/80188 and up)
     */
    opIMUL16: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpIMUL16);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x6A (push imm8) (80186/80188 and up)
     */
    opPUSH8: function() {
        this.pushWord(this.getIPByte());
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x6B (imul reg,rm,imm8) (80186/80188 and up)
     */
    opIMUL8: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpIMUL8);
    },
    /**
     * @this {X86CPU}
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     *
     * op=0x6C (insb) (80186/80188 and up)
     */
    opINSb: function() {
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
            nReps = this.regCX;
            nDelta = 1;
            if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
        }
        
        if (nReps--) {
            var b = this.bus.checkPortInputNotify(this.regDX, this.regEIP - nDelta - 1);
            this.setSOByte(this.segES, this.regDI, b);
            this.regDI = (this.regDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     *
     * op=0x6D (insw) (80186/80188 and up)
     */
    opINSw: function() {
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
            nReps = this.regCX;
            nDelta = 1;
            if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
        }
        if (nReps--) {
            var addrFrom = this.regEIP - nDelta - 1;
            var w = this.bus.checkPortInputNotify(this.regDX, addrFrom) | (this.bus.checkPortInputNotify((this.regDX + 1) & 0xffff, addrFrom) << 8);
            this.setSOWord(this.segES, this.regDI, w);
            this.regDI = (this.regDI + ((this.regPS & X86.PS.DF)? -2 : 2)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
     * 
     * op=0x6E (outsb) (80186/80188 and up)
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
            nReps = this.regCX;
            nDelta = 1;
            if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
        }
        if (nReps--) {
            var b = this.getSOByte(this.segDS, this.regSI);
            this.regSI = (this.regSI + ((this.regPS & X86.PS.DF)? -1 : 1)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
            this.bus.checkPortOutputNotify(this.regDX, b, this.regEIP - nDelta - 1);
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * NOTE: Segment overrides are ignored for this instruction, so we must use segDS instead of segData.
     *
     * op=0x6F (outsw) (80186/80188 and up)
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
            nReps = this.regCX;
            nDelta = 1;
            if (this.opPrefixes & X86.OPFLAG.REPEAT) nCycles = 4;
        }
        if (nReps--) {
            var w = this.getSOWord(this.segDS, this.regSI);
            this.regSI = (this.regSI + ((this.regPS & X86.PS.DF)? -2 : 2)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
            var addrFrom = this.regEIP - nDelta - 1;
            this.bus.checkPortOutputNotify(this.regDX, w & 0xff, addrFrom);
            this.bus.checkPortOutputNotify((this.regDX + 1) & 0xffff, w >> 8, addrFrom);
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0x70 (jo disp)
     */
    opJO: function() {
        var disp = this.getIPDisp();
        if (this.getOF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x71 (jno disp)
     */
    opJNO: function() {
        var disp = this.getIPDisp();
        if (!this.getOF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x72 (jc disp, aka jb disp)
     */
    opJC: function() {
        var disp = this.getIPDisp();
        if (this.getCF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x73 (jnc disp, aka jae disp)
     */
    opJNC: function() {
        var disp = this.getIPDisp();
        if (!this.getCF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x74 (jz disp)
     */
    opJZ: function() {
        var disp = this.getIPDisp();
        if (this.getZF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x75 (jnz disp)
     */
    opJNZ: function() {
        var disp = this.getIPDisp();
        if (!this.getZF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x76 (jbe disp)
     */
    opJBE: function() {
        var disp = this.getIPDisp();
        if (this.getCF() || this.getZF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x77 (jnbe disp, ja disp)
     */
    opJNBE: function() {
        var disp = this.getIPDisp();
        if (!this.getCF() && !this.getZF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x78 (js disp)
     */
    opJS: function() {
        var disp = this.getIPDisp();
        if (this.getSF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x79 (jns disp)
     */
    opJNS: function() {
        var disp = this.getIPDisp();
        if (!this.getSF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x7A (jp disp)
     */
    opJP: function() {
        var disp = this.getIPDisp();
        if (this.getPF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x7B (jnp disp)
     */
    opJNP: function() {
        var disp = this.getIPDisp();
        if (!this.getPF()) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x7C (jl disp)
     */
    opJL: function() {
        var disp = this.getIPDisp();
        if (!this.getSF() != !this.getOF()) {                   // jshint ignore:line
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x7D (jnl disp, aka jge disp)
     */
    opJNL: function() {
        var disp = this.getIPDisp();
        if (!this.getSF() == !this.getOF()) {                   // jshint ignore:line
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x7E (jle disp)
     */
    opJLE: function() {
        var disp = this.getIPDisp();
        if (this.getZF() || !this.getSF() != !this.getOF()) {   // jshint ignore:line
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x7F (jnle disp, aka jg disp)
     */
    opJNLE: function() {
        var disp = this.getIPDisp();
        if (!this.getZF() && !this.getSF() == !this.getOF()) {  // jshint ignore:line
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesJmpC;
            return;
        }
        this.nStepCycles -= this.nOpCyclesJmpCFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x80/0x82 (grp1b rm,imm8)
     */
    opGRP1b: function() {
        X86Mods.aOpModsGrpByte[this.getIPByte()].call(this, X86Grps.aOpGRP1b, this.getIPByte);
        if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
        this.nStepCycles -= (this.regEAWrite < 0? 1 : this.nOpCyclesArithMID);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x81 (grp1w rm,imm16)
     */
    opGRP1w: function() {
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGRP1w, this.getIPWord);
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
        this.nStepCycles -= (this.regEAWrite < 0? 1 : this.nOpCyclesArithMID);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x83 (grp1sw rm,disp)
     */
    opGRP1sw: function() {
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGRP1w, this.getIPDisp);
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
        this.nStepCycles -= (this.regEAWrite < 0? 1 : this.nOpCyclesArithMID);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x84 (testb reg,rm)
     */
    opTESTrb: function() {
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Help.opHelpTESTb);
        if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x85 (testw reg,rm)
     */
    opTESTrw: function() {
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Help.opHelpTESTw);
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x86 (xchgb reg,rm)
     *
     * NOTE: The XCHG instruction is unique in that both src and dst are both read and written
     * (and therefore, if regEA is set, then regEAWrite must be set as well).
     */
    opXCHGrb: function() {
        /*
         * If the second operand is a register, then the ModeRegByte decoder must use separate "get" and
         * "set" assignments, otherwise instructions like "XCHG DH,DL" will end up using a stale DL instead of
         * our updated DL.
         * 
         * To be clear, a single assignment like this will fail:
         * 
         *      opModeRegByteF2: function(fn) {
         *          this.regDX = (this.regDX & 0xff) | (fn.call(this, this.regDX >> 8, this.regDX & 0xff) << 8);
         *      }
         *
         * which is why all affected decoders now use separate assignments; eg:
         * 
         *      opModeRegByteF2: function(fn) {
         *          var b = fn.call(this, this.regDX >> 8, this.regDX & 0xff);
         *          this.regDX = (this.regDX & 0xff) | (b << 8);
         *      }
         */
        X86Mods.aOpModsRegByte[this.bModRM = this.getIPByte()].call(this, X86Help.opHelpXCHGrb);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x87 (xchgw reg,rm)
     *
     * NOTE: The XCHG instruction is unique in that both src and dst are both read and written
     * (and therefore, if regEA is set, then regEAWrite must be set as well).
     */
    opXCHGrw: function() {
        X86Mods.aOpModsRegWord[this.bModRM = this.getIPByte()].call(this, X86Help.opHelpXCHGrw);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x88 (movb rm,reg)
     */
    opMOVmb: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        if (FASTDISABLE) this.modEAByte = this.modEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        X86Mods.aOpModsMemByte[this.getIPByte()].call(this, X86Help.opHelpMOV);
        if (FASTDISABLE) this.modEAByte = this.modEAByteEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x89 (movw rm,reg)
     */
    opMOVmw: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        if (FASTDISABLE) this.modEAWord = this.modEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        X86Mods.aOpModsMemWord[this.getIPByte()].call(this, X86Help.opHelpMOV);
        if (FASTDISABLE) this.modEAWord = this.modEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x8A (movb reg,rm)
     */
    opMOVrb: function() {
        X86Mods.aOpModsRegByte[this.getIPByte()].call(this, X86Help.opHelpMOV);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x8B (movw reg,rm)
     */
    opMOVrw: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpMOV);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x8C (mov rm,segreg)
     *
     * NOTE: Since the ModRM decoders deal only with general-purpose registers, we must move
     * move the appropriate segment register into a special variable (regMD16) which our helper function
     * (opHelpMOVSegSrc) will replace the decoder's src operand with.
     */
    opMOVSegSrc: function() {
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
                X86Help.opUndefined.call(this);
                return;
        }
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        if (FASTDISABLE) this.modEAWord = this.modEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        X86Mods.aOpModsMemWord[bModRM].call(this, X86Help.opHelpMOVSegSrc);
        if (FASTDISABLE) this.modEAWord = this.modEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x8D (lea reg,rm)
     */
    opLEA: function() {
        if (FASTDISABLE) this.getEAWord = this.getEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        this.segData = this.segStack = this.segZERO;    // we can't have the EA calculation, if any, "polluted" by segment arithmetic
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpLEA);
        if (FASTDISABLE) this.getEAWord = this.getEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x8E (mov segreg,rm)
     *
     * NOTE: Since the ModRM decoders deal only with general-purpose registers, we have to
     * make a note of which general-purpose register will be overwritten, so that we can restore it
     * after moving the modified value to the correct segment register.
     */
    opMOVSegDst: function() {
        var temp;
        var bModRM = this.getIPByte();
        var reg = (bModRM & 0x38) >> 3;
        switch(reg) {
        case 0x0:
            temp = this.regAX;
            break;
        case 0x2:
            temp = this.regDX;
            break;
        case 0x3:
            temp = this.regBX;
            break;
        default:
            if (this.model >= X86.MODEL_80286) {
                X86Help.opInvalid.call(this);
                return;
            }
            switch(reg) {
            case 0x1:           // MOV to CS is undocumented on 8086/8088/80186/80188, and invalid on 80286 and up
                temp = this.regCX;
                break;
            case 0x4:           // this form of MOV to ES is undocumented on 8086/8088/80186/80188, invalid on 80286, and uses FS starting with 80386
                temp = this.regSP;
                break;
            case 0x5:           // this form of MOV to CS is undocumented on 8086/8088/80186/80188, invalid on 80286, and uses GS starting with 80386
                temp = this.regBP;
                break;
            case 0x6:           // this form of MOV to SS is undocumented on 8086/8088/80186/80188, invalid on 80286 and up
                temp = this.regSI;
                break;
            case 0x7:           // this form of MOV to DS is undocumented on 8086/8088/80186/80188, invalid on 80286 and up
                temp = this.regDI;
                break;
            }
            break;
        }
        X86Mods.aOpModsRegWord[bModRM].call(this, X86Help.opHelpMOV);
        switch (reg) {
            case 0x0:
                this.setES(this.regAX);
                this.regAX = temp;
                break;
            case 0x1:
                this.setCS(this.regCX);
                this.regCX = temp;
                break;
            case 0x2:
                this.setSS(this.regDX);
                this.regDX = temp;
                break;
            case 0x3:
                this.setDS(this.regBX);
                this.regBX = temp;
                break;
            case 0x4:
                this.setES(this.regSP);
                this.regSP = temp;
                break;
            case 0x5:
                this.setCS(this.regBP);
                this.regBP = temp;
                break;
            case 0x6:
                this.setSS(this.regSI);
                this.regSI = temp;
                break;
            case 0x7:
                this.setDS(this.regDI);
                this.regDI = temp;
                break;
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0x8F (pop rm)
     */
    opPOPmw: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        if (FASTDISABLE) this.modEAWord = this.modEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrpPOPw, this.popWord);
        if (FASTDISABLE) this.modEAWord = this.modEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x90 (nop, aka xchg AX,AX)
     */
    opNOP: function() {
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x91 (xchg AX,CX)
     */
    opXCHGCX: function() {
        var temp = this.regAX;
        this.regAX = this.regCX;
        this.regCX = temp;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x92 (xchg AX,DX)
     */
    opXCHGDX: function() {
        var temp = this.regAX;
        this.regAX = this.regDX;
        this.regDX = temp;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x93 (xchg AX,BX)
     */
    opXCHGBX: function() {
        var temp = this.regAX;
        this.regAX = this.regBX;
        this.regBX = temp;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x94 (xchg AX,SP)
     */
    opXCHGSP: function() {
        var temp = this.regAX;
        this.regAX = this.regSP;
        this.regSP = temp;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x95 (xchg AX,BP)
     */
    opXCHGBP: function() {
        var temp = this.regAX;
        this.regAX = this.regBP;
        this.regBP = temp;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x96 (xchg AX,SI)
     */
    opXCHGSI: function() {
        var temp = this.regAX;
        this.regAX = this.regSI;
        this.regSI = temp;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x97 (xchg AX,DI)
     */
    opXCHGDI: function() {
        var temp = this.regAX;
        this.regAX = this.regDI;
        this.regDI = temp;
        this.nStepCycles -= 3;                          // this form of XCHG takes 3 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0x98 (cbw)
     */
    opCBW: function() {
        this.regAX = ((this.regAX << 24) >> 24) & 0xffff;
        this.nStepCycles -= 2;                          // CBW takes 2 cycles on all CPUs through 80286
    },
    /**
     * @this {X86CPU}
     *
     * op=0x99 (cwd)
     */
    opCWD: function() {
        this.regDX = (this.regAX & 0x8000)? 0xffff : 0x0000;
        this.nStepCycles -= this.nOpCyclesCWD;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x9A (call seg:off)
     */
    opCALLf: function() {
        var newIP = this.getIPWord();
        var newCS = this.getIPWord();
        this.pushWord(this.segCS.sel);
        this.pushWord(this.regIP);
        this.setCSIP(newIP, newCS);
        this.nStepCycles -= this.nOpCyclesCallF;
    },
    /**
     * @this {X86CPU}
     * 
     * op=0x9B (wait)
     */
    opWAIT: function() {
        /*
         * TODO: Implement
         */
        X86Help.opUndefined.call(this);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x9C (pushf)
     */
    opPUSHF: function() {
        this.pushWord(this.getPS());
        this.nStepCycles -= this.nOpCyclesPushReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x9D (popf)
     */
    opPOPF: function() {
        this.setPS(this.popWord());
        /*
         * NOTE: I'm assuming that neither POPF nor IRET are required to set NOINTR like STI does.
         */
        this.nStepCycles -= this.nOpCyclesPopReg;
    },
    /**
     * @this {X86CPU}
     *
     * op=0x9E (sahf)
     */
    opSAHF: function() {
        /*
         * NOTE: While it make LOOK more efficient to do this:
         * 
         *      this.setPS((this.getPS() & ~X86.PS.SAHF) | ((this.regAX >> 8) & X86.PS.SAHF));
         *
         * the call to getPS() forces all the "indirect" flags to be resolved first, and then the call
         * to setPS() forces them all to be recalculated, so on balance, the code below is probably more
         * efficient, and may also avoid some unexpected side-effects of slamming the entire PS register.
         */
        var ah = this.regAX >> 8;
        if (ah & X86.PS.CF) this.setCF(); else this.clearCF();
        if (ah & X86.PS.PF) this.setPF(); else this.clearPF();
        if (ah & X86.PS.AF) this.setAF(); else this.clearAF();
        if (ah & X86.PS.ZF) this.setZF(); else this.clearZF();
        if (ah & X86.PS.SF) this.setSF(); else this.clearSF();
        this.nStepCycles -= this.nOpCyclesLAHF;
        Component.assert((this.getPS() & X86.PS.SAHF) == (ah & X86.PS.SAHF));
    },
    /**
     * @this {X86CPU}
     *
     * op=0x9F (lahf)
     */
    opLAHF: function() {
        this.regAX = (this.regAX & 0xff) | (this.getPS() & X86.PS.SAHF) << 8;
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA0 (mov AL,mem)
     */
    opMOVALDst: function() {
        this.regAX = (this.regAX & ~0xff) | this.getEAByte(this.segData, this.getIPWord());
        this.nStepCycles -= this.nOpCyclesMovAM;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA1 (mov AX,mem)
     */
    opMOVAXDst: function() {
        this.regAX = this.getEAWord(this.segData, this.getIPWord());
        this.nStepCycles -= this.nOpCyclesMovAM;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA2 (mov mem,AL)
     */
    opMOVALSrc: function() {
        this.setSOByte(this.segData, this.getIPWord(), this.regAX);
        this.nStepCycles -= this.nOpCyclesMovMA;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA3 (mov mem,AX)
     */
    opMOVAXSrc: function() {
        this.setSOWord(this.segData, this.getIPWord(), this.regAX);
        this.nStepCycles -= this.nOpCyclesMovMA;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA4 (movsb)
     */
    opMOVSb: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesMovS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesMovSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesMovSr0;
        }
        if (nReps--) {
            var nInc = ((this.regPS & X86.PS.DF)? -1 : 1);
            this.setSOByte(this.segES, this.regDI, this.getEAByte(this.segData, this.regSI));
            this.regSI = (this.regSI + nInc) & 0xffff;
            this.regDI = (this.regDI + nInc) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA5 (movsw)
     */
    opMOVSw: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesMovS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesMovSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesMovSr0;
        }
        if (nReps--) {
            var nInc = ((this.regPS & X86.PS.DF)? -2 : 2);
            this.setSOWord(this.segES, this.regDI, this.getEAWord(this.segData, this.regSI));
            this.regSI = (this.regSI + nInc) & 0xffff;
            this.regDI = (this.regDI + nInc) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA6 (cmpsb)
     */
    opCMPSb: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesCmpS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesCmpSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesCmpSr0;
        }
        if (nReps--) {
            var nInc = ((this.regPS & X86.PS.DF)? -1 : 1);
            var bDst = this.getEAByte(this.segData, this.regSI);
            var bSrc = this.modEAByte(this.segES, this.regDI);
            X86Grps.opGrpCMPb.call(this, bDst, bSrc);
            this.regSI = (this.regSI + nInc) & 0xffff;
            this.regDI = (this.regDI + nInc) & 0xffff;
            /*
             * NOTE: As long as we're calling opGrpCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.nOpCyclesArithRM;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
            if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA7 (cmpsw)
     */
    opCMPSw: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesCmpS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesCmpSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesCmpSr0;
        }
        if (nReps--) {
            var nInc = ((this.regPS & X86.PS.DF)? -2 : 2);
            var wDst = this.getEAWord(this.segData, this.regSI);
            var wSrc = this.modEAWord(this.segES, this.regDI);
            X86Grps.opGrpCMPw.call(this, wDst, wSrc);
            this.regSI = (this.regSI + nInc) & 0xffff;
            this.regDI = (this.regDI + nInc) & 0xffff;
            /*
             * NOTE: As long as we're calling opGrpCMPw(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.nOpCyclesArithRM;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
            if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA8 (test AL,imm8)
     */
    opTESTALb: function() {
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = (this.regAX & 0xff) & this.getIPByte();
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= this.nOpCyclesAAA;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xA9 (test AX,imm16)
     */
    opTESTAXw: function() {
        this.resultValue = this.resultParitySign = this.resultAuxOverflow = this.regAX & this.getIPWord();
        this.resultSize = X86.RESULT.SIZE_WORD;
        this.nStepCycles -= this.nOpCyclesAAA;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xAA (stosb)
     *
     * NOTES: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     */
    opSTOSb: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesStoS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesStoSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesStoSr0;
        }
        if (nReps--) {
            /*
             * NOTE: We rely on setSOByte() to truncate regAX to 8 bits; if setSOByte() changes, mask AX below.
             */
            this.setSOByte(this.segES, this.regDI, this.regAX);
            this.regDI = (this.regDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xAB (stosw)
     *
     * NOTES: Segment overrides are ignored for this instruction, so we must use segES instead of segData.
     * In fact, this is a good thing, because otherwise we would need a separate internal register to track
     * the effect of segment overrides on ES (eg, segExtra), because segData tracks overrides for DS only.
     */
    opSTOSw: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesStoS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesStoSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesStoSr0;
        }
        if (nReps--) {
            /*
             * NOTE: Storing a word imposes another 4-cycle penalty on the 8088, so consider that if you think the
             * cycle times here are too high.
             */
            this.setSOWord(this.segES, this.regDI, this.regAX);
            this.regDI = (this.regDI + ((this.regPS & X86.PS.DF)? -2 : 2)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
            if (nReps) {
                /*
                 * We have to back up to the prefix byte(s), not just to the string instruction,
                 * because if a h/w interrupt is acknowledged before the next repetition begins,
                 * the interrupt handler will return us to an invalid state.
                 */
                this.advanceIP(-2);             // this instruction does not support segment overrides
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xAC (lodsb)
     */
    opLODSb: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesLodS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesLodSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesLodSr0;
        }
        if (nReps--) {
            this.regAX = (this.regAX & ~0xff) | this.getEAByte(this.segData, this.regSI);
            this.regSI = (this.regSI + ((this.regPS & X86.PS.DF)? -1 : 1)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xAD (lodsw)
     */
    opLODSw: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesLodS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesLodSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesLodSr0;
        }
        if (nReps--) {
            this.regAX = this.getEAWord(this.segData, this.regSI);
            this.regSI = (this.regSI + ((this.regPS & X86.PS.DF)? -2 : 2)) & 0xffff;
            this.nStepCycles -= nCycles;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xAE (scasb)
     */
    opSCASb: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesScaS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesScaSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesScaSr0;
        }
        if (nReps--) {
            X86Grps.opGrpCMPb.call(this, this.regAX & 0xff, this.modEAByte(this.segES, this.regDI));
            this.regDI = (this.regDI + ((this.regPS & X86.PS.DF)? -1 : 1)) & 0xffff;
            /*
             * NOTE: As long as we're calling opGrpCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.nOpCyclesArithRM;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
            if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xAF (scasw)
     */
    opSCASw: function() {
        var nReps = 1;
        var nDelta = 0;
        var nCycles = this.nOpCyclesScaS;
        if (this.opPrefixes & (X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ)) {
            nReps = this.regCX;
            nDelta = 1;
            nCycles = this.nOpCyclesScaSrn;
            if (!(this.opPrefixes & X86.OPFLAG.REPEAT)) this.nStepCycles -= this.nOpCyclesScaSr0;
        }
        if (nReps--) {
            X86Grps.opGrpCMPw.call(this, this.regAX, this.modEAWord(this.segES, this.regDI));
            this.regDI = (this.regDI + ((this.regPS & X86.PS.DF)? -2 : 2)) & 0xffff;
            /*
             * NOTE: As long as we're calling opGrpCMPb(), all our cycle times must be reduced by nOpCyclesArithRM
             */
            this.nStepCycles -= nCycles - this.nOpCyclesArithRM;
            this.regCX -= nDelta;
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
                this.opFlags |= X86.OPFLAG.REPEAT;
            }
            if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB0 (mov AL,imm8)
     */
    opMOVALb: function() {
        this.regAX = (this.regAX & ~0xff) | this.getIPByte();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB1 (mov CL,imm8)
     */
    opMOVCLb: function() {
        this.regCX = (this.regCX & ~0xff) | this.getIPByte();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB2 (mov DL,imm8)
     */
    opMOVDLb: function() {
        this.regDX = (this.regDX & ~0xff) | this.getIPByte();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB3 (mov BL,imm8)
     */
    opMOVBLb: function() {
        this.regBX = (this.regBX & ~0xff) | this.getIPByte();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB4 (mov AH,imm8)
     */
    opMOVAHb: function() {
        this.regAX = (this.regAX & 0xff) | (this.getIPByte() << 8);
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB5 (mov CH,imm8)
     */
    opMOVCHb: function() {
        this.regCX = (this.regCX & 0xff) | (this.getIPByte() << 8);
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB6 (mov DH,imm8)
     */
    opMOVDHb: function() {
        this.regDX = (this.regDX & 0xff) | (this.getIPByte() << 8);
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB7 (mov BH,imm8)
     */
    opMOVBHb: function() {
        this.regBX = (this.regBX & 0xff) | (this.getIPByte() << 8);
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB8 (mov AX,imm16)
     */
    opMOVAXw: function() {
        this.regAX = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xB9 (mov CX,imm16)
     */
    opMOVCXw: function() {
        this.regCX = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xBA (mov DX,imm16)
     */
    opMOVDXw: function() {
        this.regDX = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xBB (mov BX,imm16)
     */
    opMOVBXw: function() {
        this.regBX = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xBC (mov SP,imm16)
     */
    opMOVSPw: function() {
        this.regSP = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xBD (mov BP,imm16)
     */
    opMOVBPw: function() {
        this.regBP = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xBE (mov SI,imm16)
     */
    opMOVSIw: function() {
        this.regSI = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xBF (mov DI,imm16)
     */
    opMOVDIw: function() {
        this.regDI = this.getIPWord();
        this.nStepCycles -= this.nOpCyclesLAHF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC0 (grp2ab rm) (80186/80188 and up)
     */
    opGRP2ab: function() {
        X86Mods.aOpModsGrpByte[this.getIPByte()].call(this, X86Grps.aOpGRP2ab, X86Grps.opGrp2CountImm);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC1 (grp2aw rm) (80186/80188 and up)
     */
    opGRP2aw: function() {
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGRP2aw, X86Grps.opGrp2CountImm);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC2 (ret n)
     */
    opRETn: function() {
        var n = this.getIPWord();
        this.setIP(this.popWord());
        this.regSP = (this.regSP + n) & 0xffff;
        this.nStepCycles -= this.nOpCyclesRetn;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC3 (ret)
     */
    opRET: function() {
        this.setIP(this.popWord());
        this.nStepCycles -= this.nOpCyclesRet;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC4 (les reg,rm)
     */
    opLES: function() {
        /*
         * This is like a "MOV reg,rm" operation, but it also loads ES from the next word.
         */
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpLES);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC5 (lds reg,rm)
     */
    opLDS: function() {
        /*
         * This is like a "MOV reg,rm" operation, but it also loads DS from the next word.
         */
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpLDS);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC6 (mov rm,imm8)
     */
    opMOVb: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        if (FASTDISABLE) this.modEAByte = this.modEAByteDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        X86Mods.aOpModsGrpByte[this.getIPByte()].call(this, X86Grps.aOpGrpMOVImm, this.getIPByte);
        if (FASTDISABLE) this.modEAByte = this.modEAByteEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xC7 (mov rm,imm16)
     */
    opMOVw: function() {
        /*
         * Like other MOV operations, the destination does not need to be read, just written.
         */
        if (FASTDISABLE) this.modEAWord = this.modEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGrpMOVImm, this.getIPWord);
        if (FASTDISABLE) this.modEAWord = this.modEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * Here's the pseudo-code from /pubs/pc/programming/80286_and_80287_Programmers_Reference_Manual_1987.pdf, p.B-40 (p.250):
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
     * op=0xC8 (enter imm16,imm8) (80186/80188 and up)
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
        this.pushWord(this.regBP);
        var wFrame = this.regSP;
        if (bLevel > 0) {
            this.nStepCycles -= (bLevel << 2) + (bLevel > 1? 1 : 0);
            while (--bLevel) {
                this.regBP = (this.regBP - 2) & 0xffff;
                this.pushWord(this.getSOWord(this.segSS, this.regBP));
            }
            this.pushWord(wFrame);
        }
        this.regBP = wFrame;
        this.regSP = (this.regSP - wLocal) & 0xffff;
    },
    /**
     * @this {X86CPU}
     * 
     * Set SP to BP, then pop BP
     *
     * op=0xC9 (leave) (80186/80188 and up)
     */
    opLEAVE: function() {
        this.regSP = this.regBP;
        this.regBP = this.popWord();
        /*
         * NOTE: 5 is the cycle time for the 80286; the 80186/80188 has a cycle time of 8.  However, accurate cycle
         * counts for the 80186/80188 is low priority. TODO: Fix this someday.
         */
        this.nStepCycles -= 5;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xCA (retf n)
     */
    opRETFn: function() {
        var n = this.getIPWord();
        this.setCSIP(this.popWord(), this.popWord());
        this.regSP = (this.regSP + n) & 0xffff;
        if (this.cInterruptReturn) this.checkInterruptReturn(this.regEIP);
        this.nStepCycles -= this.nOpCyclesRetFn;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xCB (retf)
     */
    opRETF: function() {
        this.setCSIP(this.popWord(), this.popWord());
        this.nStepCycles -= this.nOpCyclesRetF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xCC (int 3)
     */
    opINT3: function() {
        X86Help.opHelpINT.call(this, X86.EXCEPTION.BREAKPOINT, null, this.nOpCyclesInt3D);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xCD (int n)
     */
    opINTn: function() {
        var nInt = this.getIPByte();
        if (this.checkInterruptNotify(nInt)) {
            X86Help.opHelpINT.call(this, nInt, null, 0);
        }
    },
    /**
     * @this {X86CPU}
     *
     * op=0xCE (into: int 4 if OF set)
     */
    opINTO: function() {
        if (this.getOF()) {
            X86Help.opHelpINT.call(this, X86.EXCEPTION.OVERFLOW, null, this.nOpCyclesIntOD);
            return;
        }
        this.nStepCycles -= this.nOpCyclesIntOFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xCF (iret)
     */
    opIRET: function() {
        this.setCSIP(this.popWord(), this.popWord());
        this.setPS(this.popWord());
        if (this.cInterruptReturn) this.checkInterruptReturn(this.regEIP);
        /*
         * NOTE: I'm assuming that neither POPF nor IRET are required to set NOINTR like STI does.
         */
        this.nStepCycles -= this.nOpCyclesIRet;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD0 (grp2b rm,1)
     */
    opGRP2b1: function() {
        X86Mods.aOpModsGrpByte[this.getIPByte()].call(this, X86Grps.aOpGRP2b, X86Grps.opGrp2Count1);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD1 (grp2w rm,1)
     */
    opGRP2w1: function() {
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGRP2w, X86Grps.opGrp2Count1);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD2 (grp2b rm,CL)
     */
    opGRP2bCL: function() {
        X86Mods.aOpModsGrpByte[this.getIPByte()].call(this, X86Grps.aOpGRP2b, X86Grps.opGrp2CountCL);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD3 (grp2w rm,CL)
     */
    opGRP2wCL: function() {
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGRP2w, X86Grps.opGrp2CountCL);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD4 0x0A (aam)
     *
     * From "The 8086 Book":
     *
     *  1. Divide the AL register by OA16. Store the quotient in the AH register. Store the remainder in the AL register.
     *  2. Set the flags in the following manner:
     *      Parity: based on the AL register
     *      Sign : based on the high-order bit of the AL register Zero: based on the AL register
     *      Carry, Overflow, and Arithmetic: undefined
     */
    opAAM: function() {
        var bDivisor = this.getIPByte();
        var AL = this.regAX & 0xff;
        var bQuotient = (AL / bDivisor) & 0xff;
        var bRemainder = AL % bDivisor;
        this.regAX = (bQuotient << 8) | bRemainder;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.resultValue = this.resultParitySign = AL;
        this.nStepCycles -= this.nOpCyclesAAM;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD5 (aad)
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
     */
    opAAD: function() {
        var bMultiplier = this.getIPByte();
        this.resultValue = this.resultParitySign = this.regAX = (((this.regAX >> 8) * bMultiplier) + this.regAX) & 0xff;
        this.resultSize = X86.RESULT.SIZE_BYTE;
        this.nStepCycles -= this.nOpCyclesAAD;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD6 (setalc/salc) (undocumented until Pentium Pro)
     *
     * Sets AL to 0xFF if CF=1, 0x00 otherwise; no flags are affected (similar to SBB AL,AL, but without side-effects)
     *
     * WARNING: I have no idea how many clocks this instruction originally consumed, so for now, I'm going with the minimum of 2.
     */
    opSALC: function() {
        this.regAX = (this.regAX & ~0xff) | (this.getCF()? 0xFF : 0);
        this.nStepCycles -= 2;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD7 (xlat)
     */
    opXLAT: function() {
        /*
         * NOTE: I have no idea whether XLAT actually wraps the 16-bit address calculation;
         * I'm masking it as if it does, but I need to run a test on real hardware to be sure.
         */
        this.regAX = (this.regAX & ~0xff) | this.getEAByte(this.segData, ((this.regBX + (this.regAX & 0xff)) & 0xffff));
        this.nStepCycles -= this.nOpCyclesXLAT;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xD8-0xDF (esc)
     */
    opESC: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpESC);
        this.nStepCycles -= 8;      // TODO: Fix
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE0 (loopnz disp)
     */
    opLOOPNZ: function() {
        var disp = this.getIPDisp();
        if ((this.regCX = (this.regCX - 1) & 0xffff) && (this.resultValue & (this.resultSize - 1))) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesLoopNZ;
            return;
        }
        this.nStepCycles -= this.nOpCyclesLoopFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE1 (loopz disp)
     */
    opLOOPZ: function() {
        var disp = this.getIPDisp();
        if ((this.regCX = (this.regCX - 1) & 0xffff) && !(this.resultValue & (this.resultSize - 1))) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesLoopZ;
            return;
        }
        this.nStepCycles -= this.nOpCyclesLoopZFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE2 (loop disp)
     */
    opLOOP: function() {
        var disp = this.getIPDisp();
        if ((this.regCX = (this.regCX - 1) & 0xffff)) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesLoop;
            return;
        }
        this.nStepCycles -= this.nOpCyclesLoopFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE3 (jcxz disp)
     */
    opJCXZ: function() {
        var disp = this.getIPDisp();
        if (!this.regCX) {
            this.setIP(this.regIP + disp);
            this.nStepCycles -= this.nOpCyclesLoopZ;
            return;
        }
        this.nStepCycles -= this.nOpCyclesLoopZFall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE4 (in AL,port)
     */
    opINb: function() {
        var port = this.getIPByte();
        this.regAX = (this.regAX & ~0xff) | this.bus.checkPortInputNotify(port, this.regEIP - 2);
        this.nStepCycles -= this.nOpCyclesInP;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE5 (in AX,port)
     */
    opINw: function() {
        var port = this.getIPByte();
        this.regAX = this.bus.checkPortInputNotify(port, this.regEIP - 1) | (this.bus.checkPortInputNotify((port + 1) & 0xffff, this.regEIP - 2) << 8);
        this.nStepCycles -= this.nOpCyclesInP;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE6 (out port,AL)
     */
    opOUTb: function() {
        var port = this.getIPByte();
        this.bus.checkPortOutputNotify(port, this.regAX & 0xff, this.regEIP - 2);
        this.nStepCycles -= this.nOpCyclesOutP;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE7 (out port,AX)
     */
    opOUTw: function() {
        var port = this.getIPByte();
        this.bus.checkPortOutputNotify(port, this.regAX & 0xff, this.regEIP - 2);
        this.bus.checkPortOutputNotify((port + 1) & 0xffff, this.regAX >> 8, this.regEIP - 2);
        this.nStepCycles -= this.nOpCyclesOutP;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE8 (call disp16)
     */
    opCALL: function() {
        var disp = this.getIPWord();
        this.pushWord(this.regIP);
        this.setIP(this.regIP + disp);
        this.nStepCycles -= this.nOpCyclesCall;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xE9 (jmp disp16)
     */
    opJMP: function() {
        var disp = this.getIPWord();
        this.setIP(this.regIP + disp);
        this.nStepCycles -= this.nOpCyclesJmp;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xEA (jmp seg:off)
     */
    opJMPf: function() {
        this.setCSIP(this.getIPWord(), this.getIPWord());
        this.nStepCycles -= this.nOpCyclesJmpF;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xEB (jmp short disp8)
     */
    opJMPs: function() {
        var disp = this.getIPDisp();
        this.setIP(this.regIP + disp);
        this.nStepCycles -= this.nOpCyclesJmp;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xEC (in AL,dx)
     */
    opINDXb: function() {
        this.regAX = (this.regAX & ~0xff) | this.bus.checkPortInputNotify(this.regDX, this.regEIP - 1);
        this.nStepCycles -= this.nOpCyclesInDX;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xED (in AX,dx)
     */
    opINDXw: function() {
        this.regAX = this.bus.checkPortInputNotify(this.regDX, this.regEIP - 1) | (this.bus.checkPortInputNotify((this.regDX + 1) & 0xffff, this.regEIP - 1) << 8);
        this.nStepCycles -= this.nOpCyclesInDX;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xEE (out dx,AL)
     */
    opOUTDXb: function() {
        this.bus.checkPortOutputNotify(this.regDX, this.regAX & 0xff, this.regEIP - 1);
        this.nStepCycles -= this.nOpCyclesOutDX;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xEF (out dx,AX)
     */
    opOUTDXw: function() {
        this.bus.checkPortOutputNotify(this.regDX, this.regAX & 0xff, this.regEIP - 1);
        this.bus.checkPortOutputNotify((this.regDX + 1) & 0xffff, this.regAX >> 8, this.regEIP - 1);
        this.nStepCycles -= this.nOpCyclesOutDX;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF0 (lock:)
     */
    opLOCK: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with LOCK is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.LOCK | X86.OPFLAG.NOINTR;
        this.nStepCycles -= this.nOpCyclesPrefix;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF1 (INT1; undocumented; 80186/80188 and up; TODO: Verify)
     *
     * I still treat this as undefined, until I can verify the behavior on real hardware.
     */
    opINT1: function() {
        X86Help.opUndefined.call(this);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF2 (repnz:) (repeat CMPS or SCAS until NZ; repeat MOVS, LODS, or STOS unconditionally)
     */
    opREPNZ: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with REPNZ is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.REPNZ | X86.OPFLAG.NOINTR;
        this.nStepCycles -= this.nOpCyclesPrefix;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF3 (repz:) (repeat CMPS or SCAS until Z; repeat MOVS, LODS, or STOS unconditionally)
     */
    opREPZ: function() {
        /*
         * NOTE: The fact that we're setting NOINTR along with REPZ is really just for documentation purposes;
         * the way stepCPU() is written, the presence of any prefix bypasses normal interrupt processing anyway.
         */
        this.opFlags |= X86.OPFLAG.REPZ | X86.OPFLAG.NOINTR;
        this.nStepCycles -= this.nOpCyclesPrefix;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF4 (hlt)
     *
     * WARNING: Because other components "thrive" on the CPU's runCPU() loop notifications,
     * (eg, the Video component's blinking elements, and the Chipset component's timers),
     * we can't really stop.  What we do instead is set INTFLAG.HALT and "wait" for INTFLAG.INTR
     * to be set; since stepCPU() is already monitoring intFlags, this INTFLAG.HALT bit doesn't
     * impact performance.
     *
     * All stepCPU() has to do when INTFLAG.HALT is set is advance the cycle count without
     * advancing the program counter.  That continues indefinitely until stepCPU() finally detects
     * and acknowledges a INTFLAG.INTR notification, at which point INTFLAG.HALT is cleared.
     */
    opHLT: function() {
        this.intFlags |= X86.INTFLAG.HALT;
        this.nStepCycles -= 2;
        /*
         * We halt the machine only if a Debugger is present AND Debugger checks are enabled (eg,
         * one or more breakpoints are set, or the global DEBUG flag is set, etc), on the theory that
         * whoever's using the Debugger might like to see halts; we also halt the machine if interrupts
         * have been disabled, since that means it's dead in the water (we have no NMI generation
         * mechanism at the moment).
         * 
         * Otherwise, HLT is treated like any other instruction.
         */
        if (DEBUGGER && this.dbg && this.dbg.checksEnabled(true)) {
            this.advanceIP(-1);     // this is purely for the Debugger's benefit, to show the HLT
            this.haltCPU();
            return;
        }
        if (!this.getIF()) {
            if (DEBUGGER && this.dbg) this.advanceIP(-1);
            this.haltCPU();
         // return;
        }
        /*
         * Per my discussion of waitCPU() in cpu.js, this seems rather pointless, so I don't call it anymore.
         * If you re-enable this, make sure you re-enable the return statement above, too.
         *
        this.waitCPU();
         */
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF5 (cmc)
     */
    opCMC: function() {
        if (this.getCF()) this.clearCF(); else this.setCF();
        this.nStepCycles -= 2;                          // CMC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF6 (grp3b rm)
     *
     * The MUL instruction is problematic in two cases:
     *
     *      0xF6 0xE0:  MUL AL
     *      0xF6 0xE4:  MUL AH
     *
     * because the OpModeGrpByte decoder function will attempt to put the opGrpMULb() function's
     * return value back into AL or AH, undoing opGrpMULb's update of AX.  And since opGrpMULb doesn't
     * know what the target is (only the target's value), it cannot easily work around the problem.
     *
     * A simple, albeit kludgy, solution is for opGrpMULb to always save its result in a special "register"
     * (eg, regMD16), which we will then put back into regAX if it's been updated.  This also relieves us
     * from having to decode any part of the ModRM byte, so maybe it's not such a bad work-around after all.
     *
     * Similar issues with IMUL (and DIV and IDIV) are resolved using the same special variable(s).
     */
    opGRP3b: function() {
        this.regMD16 = -1;
        X86Mods.aOpModsGrpByte[this.getIPByte()].call(this, X86Grps.aOpGRP3b, X86Grps.opGrpNoSrc);
        if (this.regMD16 >= 0) this.regAX = this.regMD16;
        if (FASTDISABLE) this.setEAByte = this.setEAByteEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF7 (grp3w rm)
     *
     * The MUL instruction is problematic in two cases:
     *
     *      0xF7 0xE0:  MUL AX
     *      0xF7 0xE2:  MUL DX
     *
     * because the OpModeGrpWord decoder function will attempt to put the opGrpMULw() function's
     * return value back into AX or DX, undoing opGrpMULw's update of DX:AX.  And since opGrpMULw doesn't
     * know what the target is (only the target's value), it cannot easily work around the problem.
     *
     * A simple, albeit kludgey, solution is for opGrpMULw to always save its result in a special "register"
     * (eg, regMD16/regMD32), which we will then put back into regAX/regDX if it's been updated.  This also relieves
     * us from having to decode any part of the ModRM byte, so maybe it's not such a bad work-around after all.
     */
    opGRP3w: function() {
        this.regMD16 = -1;
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGRP3w, X86Grps.opGrpNoSrc);
        if (this.regMD16 >= 0) {
            this.regAX = this.regMD16;
            this.regDX = this.regMD32;
        }
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF8 (clc)
     */
    opCLC: function() {
        this.resultValue &= ~this.resultSize;
        this.nStepCycles -= 2;                          // CLC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0xF9 (stc)
     */
    opSTC: function() {
        this.resultValue |= this.resultSize;
        this.nStepCycles -= 2;                          // STC takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0xFA (cli)
     */
    opCLI: function() {
        this.clearIF();
        this.nStepCycles -= this.nOpCyclesCLI;          // CLI takes LONGER on an 80286
    },
    /**
     * @this {X86CPU}
     *
     * op=0xFB (sti)
     */
    opSTI: function() {
        this.setIF();
        this.opFlags |= X86.OPFLAG.NOINTR;
        this.nStepCycles -= 2;                          // STI takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0xFC (cld)
     */
    opCLD: function() {
        this.clearDF();
        this.nStepCycles -= 2;                          // CLD takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0xFD (std)
     */
    opSTD: function() {
        this.setDF();
        this.nStepCycles -= 2;                          // STD takes 2 cycles on all CPUs
    },
    /**
     * @this {X86CPU}
     *
     * op=0xFE (grp4b rm)
     */
    opGRP4b: function() {
        X86Mods.aOpModsGrpByte[this.getIPByte()].call(this, X86Grps.aOpGRP4b, X86Grps.opGrpNoSrc);
    },
    /**
     * @this {X86CPU}
     *
     * op=0xFF (grp4w rm)
     */
    opGRP4w: function() {
        X86Mods.aOpModsGrpWord[this.getIPByte()].call(this, X86Grps.aOpGRP4w, X86Grps.opGrpNoSrc);
        if (FASTDISABLE) this.setEAWord = this.setEAWordEnabled;
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
    X86OpXX.opPUSHSP,       X86OpXX.opPUSHBP,       X86OpXX.opPUSHSI,       X86OpXX.opPUSHDI,       // 0x54-0x57
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
    X86OpXX.opGRP1b,        X86OpXX.opGRP1w,        X86OpXX.opGRP1b,        X86OpXX.opGRP1sw,       // 0x80-0x83
    X86OpXX.opTESTrb,       X86OpXX.opTESTrw,       X86OpXX.opXCHGrb,       X86OpXX.opXCHGrw,       // 0x84-0x87
    X86OpXX.opMOVmb,        X86OpXX.opMOVmw,        X86OpXX.opMOVrb,        X86OpXX.opMOVrw,        // 0x88-0x8B
    X86OpXX.opMOVSegSrc,    X86OpXX.opLEA,          X86OpXX.opMOVSegDst,    X86OpXX.opPOPmw,        // 0x8C-0x8F
    X86OpXX.opNOP,          X86OpXX.opXCHGCX,       X86OpXX.opXCHGDX,       X86OpXX.opXCHGBX,       // 0x90-0x93
    X86OpXX.opXCHGSP,       X86OpXX.opXCHGBP,       X86OpXX.opXCHGSI,       X86OpXX.opXCHGDI,       // 0x94-0x97
    X86OpXX.opCBW,          X86OpXX.opCWD,          X86OpXX.opCALLf,        X86OpXX.opWAIT,         // 0x98-0x9B
    X86OpXX.opPUSHF,        X86OpXX.opPOPF,         X86OpXX.opSAHF,         X86OpXX.opLAHF,         // 0x9C-0x9F
    X86OpXX.opMOVALDst,     X86OpXX.opMOVAXDst,     X86OpXX.opMOVALSrc,     X86OpXX.opMOVAXSrc,     // 0xA0-0xA3
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
    X86OpXX.opGRP2b1,       X86OpXX.opGRP2w1,       X86OpXX.opGRP2bCL,      X86OpXX.opGRP2wCL,      // 0xD0-0xD3
    /*
     * Even as of the Pentium, opcode 0xD6 is still marked as "reserved", but it's always been SETALC/SALC.
     */
    X86OpXX.opAAM,          X86OpXX.opAAD,          X86OpXX.opSALC,         X86OpXX.opXLAT,         // 0xD4-0xD7
    X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          // 0xD8-0xDB
    X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          X86OpXX.opESC,          // 0xDC-0xDF
    X86OpXX.opLOOPNZ,       X86OpXX.opLOOPZ,        X86OpXX.opLOOP,         X86OpXX.opJCXZ,         // 0xE0-0xE3
    X86OpXX.opINb,          X86OpXX.opINw,          X86OpXX.opOUTb,         X86OpXX.opOUTw,         // 0xE4-0xE7
    X86OpXX.opCALL,         X86OpXX.opJMP,          X86OpXX.opJMPf,         X86OpXX.opJMPs,         // 0xE8-0xEB
    X86OpXX.opINDXb,        X86OpXX.opINDXw,        X86OpXX.opOUTDXb,       X86OpXX.opOUTDXw,       // 0xEC-0xEF
    /*
     * On an 8086/8088, opcode 0xF1 is assumed to be an alias for 0xF0; in any case, it definitely behaves like
     * a prefix on those processors, so we treat it as such.  As of the Pentium, it is still marked as "reserved".
     */
    X86OpXX.opLOCK,         X86OpXX.opLOCK,         X86OpXX.opREPNZ,        X86OpXX.opREPZ,         // 0xF0-0xF3
    X86OpXX.opHLT,          X86OpXX.opCMC,          X86OpXX.opGRP3b,        X86OpXX.opGRP3w,        // 0xF4-0xF7
    X86OpXX.opCLC,          X86OpXX.opSTC,          X86OpXX.opCLI,          X86OpXX.opSTI,          // 0xF8-0xFB
    X86OpXX.opCLD,          X86OpXX.opSTD,          X86OpXX.opGRP4b,        X86OpXX.opGRP4w         // 0xFC-0xFF
];

if (typeof module !== 'undefined') module.exports = X86OpXX;
