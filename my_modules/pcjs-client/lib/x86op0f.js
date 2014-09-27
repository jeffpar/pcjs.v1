/**
 * @fileoverview Implements PCjs 0x0F two-byte opcodes
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
    var X86 = require("./x86");
    var X86Grps = require("./x86grps");
    var X86Help = require("./x86help");
    var X86Mods = require("./x86mods");
}

var X86Op0F = {
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x00 (grp6 rm)
     */
    opGRP6: function() {
        var bModRM = this.getIPByte();
        if ((bModRM & 0x38) < 0x10) {   // possible reg values: 0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38
            if (FASTDISABLE) this.modEAWord = this.modEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        }
        X86Mods.aOpModsGrpWord[bModRM].call(this, X86Op0F.aOpGRP6, X86Grps.opGrpNoSrc);
        if (FASTDISABLE) { this.modEAWord = this.modEAWordEnabled; this.setEAWord = this.setEAWordEnabled; }
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x01 (grp7 rm)
     */
    opGRP7: function() {
        var bModRM = this.getIPByte();
        if (!(bModRM & 0x10)) {
            if (FASTDISABLE) this.modEAWord = this.modEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOREAD;
        }
        X86Mods.aOpModsGrpWord[bModRM].call(this, X86Op0F.aOpGRP7, X86Grps.opGrpNoSrc);
        if (FASTDISABLE) { this.modEAWord = this.modEAWordEnabled; this.setEAWord = this.setEAWordEnabled; }
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x02 (lar reg,rm)
     */
    opLAR: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpLAR);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x03 (lsl reg,rm)
     */
    opLSL: function() {
        X86Mods.aOpModsRegWord[this.getIPByte()].call(this, X86Help.opHelpLSL);
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opSLDT: function(dst, src) {
        this.nStepCycles -= (2 + (this.regEA < 0? 0 : 1));
        return this.segLDT.sel;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opSTR: function(dst, src) {
        this.nStepCycles -= (2 + (this.regEA < 0? 0 : 1));
        return this.segTSS.sel;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opLLDT: function(dst, src) {
        if (FASTDISABLE) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        this.segLDT.load(dst);
        this.nStepCycles -= (17 + (this.regEA < 0? 0 : 2));
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opLTR: function(dst, src) {
        if (FASTDISABLE) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        this.segTSS.load(dst);
        this.nStepCycles -= (17 + (this.regEA < 0? 0 : 2));
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opVERR: function(dst, src) {
        if (FASTDISABLE) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        /*
         * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
         * descriptor table or the descriptor is not for a segment.
         */
        this.nStepCycles -= (14 + (this.regEA < 0? 0 : 2));
        if (this.segVER.load(dst, true) >= 0) {
            /*
             * Verify that this is a readable segment; that is, of these four combinations (code+readable,
             * code+nonreadable, data+writeable, date+nonwriteable), make sure we're not the second combination.
             */
            if ((this.segVER.acc & (X86.DESC.ACC.TYPE.READABLE | X86.DESC.ACC.TYPE.CODE)) != X86.DESC.ACC.TYPE.CODE) {
                /*
                 * For VERR, if the code segment is readable and conforming, the descriptor privilege level
                 * (DPL) can be any value.
                 * 
                 * Otherwise, DPL must be greater than or equal to (have less or the same privilege as) both the
                 * current privilege level and the selector's RPL.
                 * 
                 * TODO: Consider making a CPL (current privilege level) variable that tracks segCS.sel, so that we
                 * don't have to mask segCS.sel every time.
                 */
                if ((this.segVER.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING) == X86.DESC.ACC.TYPE.CODE_CONFORMING ||
                    this.segVER.level >= (this.segCS.sel & X86.SEL.LEVEL) && this.segVER.level >= (dst & X86.SEL.LEVEL)) {
                    this.setZF();
                    return dst;
                }
            }
        }
        this.clearZF();
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opVERW: function(dst, src) {
        if (FASTDISABLE) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        /*
         * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
         * descriptor table or the descriptor is not for a segment.
         */
        this.nStepCycles -= (14 + (this.regEA < 0? 0 : 2));
        if (this.segVER.load(dst, true) >= 0) {
            /*
             * Verify that this is a writeable data segment
             */
            if ((this.segVER.acc & (X86.DESC.ACC.TYPE.WRITEABLE | X86.DESC.ACC.TYPE.CODE)) == X86.DESC.ACC.TYPE.WRITEABLE) {
                /*
                 * DPL must be greater than or equal to (have less or the same privilege as) both the current
                 * privilege level and the selector's RPL.
                 * 
                 * TODO: Consider making a CPL (current privilege level) variable that tracks segCS.sel, so that we
                 * don't have to mask segCS.sel every time.
                 */
                if (this.segVER.level >= (this.segCS.sel & X86.SEL.LEVEL) && this.segVER.level >= (dst & X86.SEL.LEVEL)) {
                    this.setZF();
                    return dst;
                }
            }
        }
        this.clearZF();
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opSGDT: function(dst, src) {
        if (this.regEA < 0) {
            X86Help.opInvalid.call(this);
        } else {
            this.setWord(this.regEA + 2, this.addrGDT);
            this.setByte(this.regEA + 4, this.addrGDT >> 16);
            dst = this.addrGDTLimit - this.addrGDT;
            this.nStepCycles -= 11;
        }
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opSIDT: function(dst, src) {
        if (this.regEA < 0) {
            X86Help.opInvalid.call(this);
        } else {
            this.setWord(this.regEA + 2, this.addrIDT);
            this.setByte(this.regEA + 4, this.addrIDT >> 16);
            dst = this.addrIDTLimit - this.addrIDT;
            this.nStepCycles -= 12;
        }
        return dst;
    },
    /**
     * opLGDT(dst, src)
     *
     * The 80286 LGDT instruction expects a 40-bit operand: a 16-bit limit, followed by a 24-bit address;
     * the ModRM decoder has already supplied the first word of the operand (in dst), which corresponds to the
     * limit, so we must fetch the remaining 24 bits ourselves.
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opLGDT: function(dst, src) {
        if (this.regEA < 0) {
            X86Help.opInvalid.call(this);
        } else {
            this.addrGDT = this.getWord(this.regEA + 2) | (this.getByte(this.regEA + 4) << 16);
            this.addrGDTLimit = this.addrGDT + dst;
            if (FASTDISABLE) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
            this.nStepCycles -= 11;
        }
        return dst;
    },
    /**
     * opLIDT(dst, src)
     *
     * The 80286 LIDT instruction expects a 40-bit operand: a 16-bit limit, followed by a 24-bit address;
     * the ModRM decoder has already supplied the first word of the operand (in dst), which corresponds to the 
     * limit, so we must fetch the remaining 24 bits ourselves. 
     *
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opLIDT: function(dst, src) {
        if (this.regEA < 0) {
            X86Help.opInvalid.call(this);
        } else {
            this.addrIDT = this.getWord(this.regEA + 2) | (this.getByte(this.regEA + 4) << 16); 
            this.addrIDTLimit = this.addrIDT + dst;
            if (FASTDISABLE) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
            this.nStepCycles -= 12;
        }
        return dst;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opSMSW: function(dst, src) {
        this.nStepCycles -= (2 + (this.regEA < 0? 0 : 1));
        return this.regMSW;
    },
    /**
     * @this {X86CPU}
     * @param {number} dst
     * @param {number} src (null)
     * @return {number}
     */
    opLMSW: function(dst, src) {
        this.regMSW = (this.regMSW & X86.MSW.SET) | (dst & ~X86.MSW.SET);
        this.nStepCycles -= (3 + (this.regEA < 0? 0 : 3));
        /*
         * Since the 80286 did not allow you to disable protected-mode (ie, return to real-mode) by
         * CLEARING the X86.MSW.PE bit, we need only check for the bit being SET.  And the only functions
         * that call setProtMode() are resetRegs() and this function, so there's no danger of the mode
         * getting out of sync with the X86.MSW.PE bit.
         */
        if (this.regMSW & X86.MSW.PE) {
            this.setProtMode(true);
        }
        if (FASTDISABLE) this.setEAWord = this.setEAWordDisabled; else this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    }
};

X86Op0F.aOps0F = [
    X86Op0F.opGRP6,         X86Op0F.opGRP7,         X86Op0F.opLAR,          X86Op0F.opLSL,          // 0x00-0x03
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x04-0x07
    /*
     * On all processors (except the 8086/8088, of course), 0x0F,0x0B is also referred to as "UD2": an
     * instruction guaranteed to raise a #UD (Invalid Opcode) exception (INT 0x06) on all future x86 processors.
     */
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opInvalid,      // 0x08-0x0B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x0C-0x0F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x10-0x13
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x14-0x17
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x18-0x1B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x1C-0x1F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x20-0x23
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x24-0x27
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x28-0x2B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x2C-0x2F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x30-0x33
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x34-0x37
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x38-0x3B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x3C-0x3F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x40-0x43
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x44-0x47
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x48-0x4B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x4C-0x4F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x50-0x53
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x54-0x57
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x58-0x5B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x5C-0x5F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x60-0x63
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x64-0x67
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x68-0x6B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x6C-0x6F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x70-0x73
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x74-0x77
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x78-0x7B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x7C-0x7F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x80-0x83
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x84-0x87
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x88-0x8B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x8C-0x8F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x90-0x93
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x94-0x97
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x98-0x9B
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0x9C-0x9F
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xA0-0xA3
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xA4-0xA7
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xA8-0xAB
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xAC-0xAF
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xB0-0xB3
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xB4-0xB7
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xB8-0xBB
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xBC-0xBF
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xC0-0xC3
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xC4-0xC7
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xC8-0xCB
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xCC-0xCF
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xD0-0xD3
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xD4-0xD7
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xD8-0xDB
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xDC-0xDF
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xE0-0xE3
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xE4-0xE7
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xE8-0xEB
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xEC-0xEF
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xF0-0xF3
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xF4-0xF7
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    // 0xF8-0xFB
    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined,    X86Help.opUndefined     // 0xFC-0xFF
];

/*
 * These instruction groups are not as orthogonal as the original 8086/8088 groups (GRP1 through GRP4): some of
 * the instructions in GRP6 and GRP7 only read their dst operand (eg, LLDT), which means the ModRM helper function
 * must insure that setEAWord() is disabled, while others only write their dst operand (eg, SLDT), which means that
 * getEAWord() should be disabled *prior* to calling the ModRM helper function.  This latter case requires that
 * we decode the reg field of the ModRM byte before dispatching.  
 */
X86Op0F.aOpGRP6Prot = [
    X86Op0F.opSLDT,         X86Op0F.opSTR,          X86Op0F.opLLDT,         X86Op0F.opLTR,          // 0x0F,0x00(reg=0x0-0x3)
    X86Op0F.opVERR,         X86Op0F.opVERW,         X86Grps.opGrpUndefined, X86Grps.opGrpUndefined  // 0x0F,0x00(reg=0x4-0x7)
];

X86Op0F.aOpGRP6Real = [
    X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   // 0x0F,0x00(reg=0x0-0x3)
    X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   X86Grps.opGrpUndefined, X86Grps.opGrpUndefined  // 0x0F,0x00(reg=0x4-0x7)
];

/*
 * setProtMode() will ensure that aOpGRP6 is set to the appropriate group, but it doesn't hurt to statically
 * initialize to its real-mode default, either.
 */
X86Op0F.aOpGRP6 = X86Op0F.aOpGRP6Real;

/*
 * Unlike GRP6, GRP7 does not require separate real-mode and protected-mode dispatch tables, because all GRP7
 * instructions are valid in both modes.
 */
X86Op0F.aOpGRP7 = [
    X86Op0F.opSGDT,         X86Op0F.opSIDT,         X86Op0F.opLGDT,         X86Op0F.opLIDT,         // 0x0F,0x01(reg=0x0-0x3)
    X86Op0F.opSMSW,         X86Grps.opGrpUndefined, X86Op0F.opLMSW,         X86Grps.opGrpUndefined  // 0x0F,0x01(reg=0x4-0x7)
];

if (typeof module !== 'undefined') module.exports = X86Op0F;
