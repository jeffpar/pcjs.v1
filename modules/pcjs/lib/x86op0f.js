/**
 * @fileoverview Implements PCjs 0x0F two-byte opcodes
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
    var X86         = require("./x86");
    var X86Grps     = require("./x86grps");
    var X86Help     = require("./x86help");
}

var X86Op0F = {
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x00 (grp6 rm)
     */
    opGrp6: function() {
        var bModRM = this.getIPByte();
        if ((bModRM & 0x38) < 0x10) {   // possible reg values: 0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38
            this.opFlags |= X86.OPFLAG.NOREAD;
        }
        this.aOpModGrpWord[bModRM].call(this, this.aOpGrp6, X86Grps.opGrpNoSrc);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x01 (grp7 rm)
     */
    opGrp7: function() {
        var bModRM = this.getIPByte();
        if (!(bModRM & 0x10)) {
            this.opFlags |= X86.OPFLAG.NOREAD;
        }
        this.aOpModGrpWord[bModRM].call(this, X86Op0F.aOpGrp7, X86Grps.opGrpNoSrc);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x02 (lar reg,rm)
     */
    opLAR: function() {
        this.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpLAR);
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x03 (lsl reg,rm)
     */
    opLSL: function() {
        this.aOpModRegWord[this.getIPByte()].call(this, X86Help.opHelpLSL);
    },
    /**
     * opLOADALL()
     *
     * From the "Undocumented iAPX 286 Test Instruction" document at http://www.pcjs.org/pubs/pc/reference/intel/80286/loadall/:
     *
     *  Physical Address (Hex)        Associated CPU Register
     *          800-805                        None
     *          806-807                        MSW
     *          808-815                        None
     *          816-817                        TR
     *          818-819                        Flag word
     *          81A-81B                        IP
     *          81C-81D                        LDT
     *          81E-81F                        DS
     *          820-821                        SS
     *          822-823                        CS
     *          824-825                        ES
     *          826-827                        DI
     *          828-829                        SI
     *          82A-82B                        BP
     *          82C-82D                        SP
     *          82E-82F                        BX
     *          830-831                        DX
     *          832-833                        CX
     *          834-835                        AX
     *          836-83B                        ES descriptor cache
     *          83C-841                        CS descriptor cache
     *          842-847                        SS descriptor cache
     *          848-84D                        DS descriptor cache
     *          84E-853                        GDTR
     *          854-859                        LDT descriptor cache
     *          85A-85F                        IDTR
     *          860-865                        TSS descriptor cache
     *
     * Oddly, the above document gives two contradictory cycle counts for LOADALL: 190 and 195.  I'll go with 195, for
     * no particular reason.
     *
     * @this {X86CPU}
     *
     * op=0x0F,0x05 (loadall)
     */
    opLOADALL: function() {
        if (this.segCS.cpl) {
            /*
             * You're not allowed to use LOADALL if the current privilege level is something other than zero
             */
            X86Help.opHelpFault.call(this, X86.EXCEPTION.GP_FAULT, 0, true);
            return;
        }
        X86Help.opHelpLMSW.call(this, this.getShort(0x806));
        this.regEDI = this.getShort(0x826);
        this.regESI = this.getShort(0x828);
        this.regEBP = this.getShort(0x82A);
        this.regESP = this.getShort(0x82C);
        this.regEBX = this.getShort(0x82E);
        this.regEDX = this.getShort(0x830);
        this.regECX = this.getShort(0x832);
        this.regEAX = this.getShort(0x834);
        this.segES.loadDesc6(0x836, this.getShort(0x824));
        this.segCS.loadDesc6(0x83C, this.getShort(0x822));
        this.segSS.loadDesc6(0x842, this.getShort(0x820));
        this.segDS.loadDesc6(0x848, this.getShort(0x81E));
        this.setPS(this.getShort(0x818));
        this.setIP(this.getShort(0x81A));
        /*
         * TODO: The bytes at 0x851 and 0x85D "should be zeroes", but do we rely on that, or do we load zeros ourselves?
         */
        this.addrGDT = this.getShort(0x84E) | (this.getShort(0x850) << 16);
        this.addrGDTLimit = this.addrGDT + this.getShort(0x852);
        this.segLDT.loadDesc6(0x854, this.getShort(0x81C));
        this.addrIDT = this.getShort(0x85A) | (this.getShort(0x85C) << 16);
        this.addrIDTLimit = this.addrIDT + this.getShort(0x85E);
        this.segTSS.loadDesc6(0x860, this.getShort(0x816));
        this.nStepCycles -= 195;
        /*
         * TODO: LOADALL operation still needs to be verified in protected mode....
         */
        if (DEBUG && DEBUGGER && (this.regMSW & X86.MSW.PE)) this.stopCPU();
    },
    /**
     * @this {X86CPU}
     *
     * op=0x0F,0x06 (clts)
     */
    opCLTS: function() {
        if (this.segCS.cpl) {
            X86Help.opHelpFault.call(this, X86.EXCEPTION.GP_FAULT, 0, true);
            return;
        }
        this.regMSW &= ~X86.MSW.TS;
        this.nStepCycles -= 2;
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
        this.opFlags |= X86.OPFLAG.NOWRITE;
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
        this.opFlags |= X86.OPFLAG.NOWRITE;
        if (this.segTSS.load(dst) != X86.ADDR_INVALID) {
            this.setShort(this.segTSS.addrDesc + X86.DESC.ACC.OFFSET, this.segTSS.acc |= X86.DESC.ACC.TYPE.LDT);
            this.segTSS.type = X86.DESC.ACC.TYPE.TSS_BUSY;
        }
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
        this.opFlags |= X86.OPFLAG.NOWRITE;
        /*
         * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
         * descriptor table or the descriptor is not for a segment.
         */
        this.nStepCycles -= (14 + (this.regEA < 0? 0 : 2));
        if (this.segVER.load(dst, true) != X86.ADDR_INVALID) {
            /*
             * Verify that this is a readable segment; that is, of these four combinations (code+readable,
             * code+nonreadable, data+writable, date+nonwritable), make sure we're not the second combination.
             */
            if ((this.segVER.acc & (X86.DESC.ACC.TYPE.READABLE | X86.DESC.ACC.TYPE.CODE)) != X86.DESC.ACC.TYPE.CODE) {
                /*
                 * For VERR, if the code segment is readable and conforming, the descriptor privilege level
                 * (DPL) can be any value.
                 *
                 * Otherwise, DPL must be greater than or equal to (have less or the same privilege as) both the
                 * current privilege level and the selector's RPL.
                 */
                if (this.segVER.dpl >= this.segCS.cpl && this.segVER.dpl >= (dst & X86.SEL.RPL) ||
                    (this.segVER.acc & X86.DESC.ACC.TYPE.CODE_CONFORMING) == X86.DESC.ACC.TYPE.CODE_CONFORMING) {
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
        this.opFlags |= X86.OPFLAG.NOWRITE;
        /*
         * Currently, segVER.load() will return an error only if the selector is beyond the bounds of the
         * descriptor table or the descriptor is not for a segment.
         */
        this.nStepCycles -= (14 + (this.regEA < 0? 0 : 2));
        if (this.segVER.load(dst, true) != X86.ADDR_INVALID) {
            /*
             * Verify that this is a writable data segment
             */
            if ((this.segVER.acc & (X86.DESC.ACC.TYPE.WRITABLE | X86.DESC.ACC.TYPE.CODE)) == X86.DESC.ACC.TYPE.WRITABLE) {
                /*
                 * DPL must be greater than or equal to (have less or the same privilege as) both the current
                 * privilege level and the selector's RPL.
                 */
                if (this.segVER.dpl >= this.segCS.cpl && this.segVER.dpl >= (dst & X86.SEL.RPL)) {
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
            X86Help.opHelpInvalid.call(this);
        } else {
            /*
             * We don't need to setShort() the first word of the operand, because the ModRM group decoder that
             * calls us does that automatically with the value we return (dst).
             */
            dst = this.addrGDTLimit - this.addrGDT;
            this.setShort(this.regEA + 2, this.addrGDT);
            /*
             * We previously left the 6th byte of the target operand "undefined".  But it turns out we have to set
             * it to *something*, because there's processor detection in PC-DOS 7.0 (at least in the SETUP portion)
             * that looks like this:
             *
             *      145E:4B84 9C            PUSHF
             *      145E:4B85 55            PUSH     BP
             *      145E:4B86 8BEC          MOV      BP,SP
             *      145E:4B88 B80000        MOV      AX,0000
             *      145E:4B8B 50            PUSH     AX
             *      145E:4B8C 9D            POPF
             *      145E:4B8D 9C            PUSHF
             *      145E:4B8E 58            POP      AX
             *      145E:4B8F 2500F0        AND      AX,F000
             *      145E:4B92 3D00F0        CMP      AX,F000
             *      145E:4B95 7511          JNZ      4BA8
             *      145E:4BA8 C8060000      ENTER    0006,00
             *      145E:4BAC 0F0146FA      SGDT     [BP-06]
             *      145E:4BB0 807EFFFF      CMP      [BP-01],FF
             *      145E:4BB4 C9            LEAVE
             *      145E:4BB5 BA8603        MOV      DX,0386
             *      145E:4BB8 7503          JNZ      4BBD
             *      145E:4BBA BA8602        MOV      DX,0286
             *      145E:4BBD 89163004      MOV      [0430],DX
             *      145E:4BC1 5D            POP      BP
             *      145E:4BC2 9D            POPF
             *      145E:4BC3 CB            RETF
             *
             * This code is expecting SGDT on an 80286 to set the 6th "undefined" byte to 0xFF.  So we use setShort()
             * instead of setByte() and force the upper byte to 0xFF.
             *
             * TODO: Remove the 0xFF00 below on post-80286 processors; also, determine whether this behavior is unique to real-mode.
             */
            this.setShort(this.regEA + 4, 0xFF00 | (this.addrGDT >> 16));
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
            X86Help.opHelpInvalid.call(this);
        } else {
            /*
             * We don't need to setShort() the first word of the operand, because the ModRM group decoder that calls
             * us does that automatically with the value we return (dst).
             */
            dst = this.addrIDTLimit - this.addrIDT;
            this.setShort(this.regEA + 2, this.addrIDT);
            /*
             * As with SGDT, the 6th byte is technically "undefined" on an 80286, but we now set it to 0xFF, for the
             * same reasons discussed in SGDT (above).
             *
             * TODO: Remove the 0xFF00 below on post-80286 processors; also, determine whether this behavior is unique to real-mode.
             */
            this.setShort(this.regEA + 4, 0xFF00 | (this.addrIDT >> 16));
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
            X86Help.opHelpInvalid.call(this);
        } else {
            this.addrGDT = this.getShort(this.regEA + 2) | (this.getByte(this.regEA + 4) << 16);
            this.addrGDTLimit = this.addrGDT + dst;
            this.opFlags |= X86.OPFLAG.NOWRITE;
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
            X86Help.opHelpInvalid.call(this);
        } else {
            this.addrIDT = this.getShort(this.regEA + 2) | (this.getByte(this.regEA + 4) << 16);
            this.addrIDTLimit = this.addrIDT + dst;
            this.opFlags |= X86.OPFLAG.NOWRITE;
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
        X86Help.opHelpLMSW.call(this, dst);
        this.nStepCycles -= (this.regEA < 0? 3 : 6);
        this.opFlags |= X86.OPFLAG.NOWRITE;
        return dst;
    }
};

X86Op0F.aOps0F = [
    X86Op0F.opGrp6,         X86Op0F.opGrp7,         X86Op0F.opLAR,          X86Op0F.opLSL,          // 0x00-0x03
    X86Help.opHelpUndefined,X86Op0F.opLOADALL,      X86Op0F.opCLTS,         X86Help.opHelpUndefined,// 0x04-0x07
    /*
     * On all processors (except the 8086/8088, of course), 0x0F,0x0B is also referred to as "UD2": an
     * instruction guaranteed to raise a #UD (Invalid Opcode) exception (INT 0x06) on all future x86 processors.
     */
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpInvalid,  // 0x08-0x0B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x0C-0x0F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x10-0x13
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x14-0x17
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x18-0x1B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x1C-0x1F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x20-0x23
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x24-0x27
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x28-0x2B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x2C-0x2F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x30-0x33
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x34-0x37
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x38-0x3B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x3C-0x3F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x40-0x43
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x44-0x47
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x48-0x4B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x4C-0x4F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x50-0x53
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x54-0x57
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x58-0x5B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x5C-0x5F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x60-0x63
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x64-0x67
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x68-0x6B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x6C-0x6F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x70-0x73
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x74-0x77
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x78-0x7B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x7C-0x7F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x80-0x83
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x84-0x87
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x88-0x8B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x8C-0x8F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x90-0x93
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x94-0x97
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x98-0x9B
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0x9C-0x9F
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xA0-0xA3
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xA4-0xA7
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xA8-0xAB
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xAC-0xAF
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xB0-0xB3
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xB4-0xB7
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xB8-0xBB
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xBC-0xBF
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xC0-0xC3
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xC4-0xC7
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xC8-0xCB
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xCC-0xCF
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xD0-0xD3
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xD4-0xD7
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xD8-0xDB
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xDC-0xDF
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xE0-0xE3
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xE4-0xE7
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xE8-0xEB
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xEC-0xEF
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xF0-0xF3
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xF4-0xF7
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,// 0xF8-0xFB
    X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined,X86Help.opHelpUndefined // 0xFC-0xFF
];

/*
 * These instruction groups are not as orthogonal as the original 8086/8088 groups (Grp1 through Grp4): some of
 * the instructions in Grp6 and Grp7 only read their dst operand (eg, LLDT), which means the ModRM helper function
 * must insure that setEAWord() is disabled, while others only write their dst operand (eg, SLDT), which means that
 * getEAWord() should be disabled *prior* to calling the ModRM helper function.  This latter case requires that
 * we decode the reg field of the ModRM byte before dispatching.
 */
X86Op0F.aOpGrp6Prot = [
    X86Op0F.opSLDT,         X86Op0F.opSTR,          X86Op0F.opLLDT,         X86Op0F.opLTR,          // 0x0F,0x00(reg=0x0-0x3)
    X86Op0F.opVERR,         X86Op0F.opVERW,         X86Grps.opGrpUndefined, X86Grps.opGrpUndefined  // 0x0F,0x00(reg=0x4-0x7)
];

X86Op0F.aOpGrp6Real = [
    X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   // 0x0F,0x00(reg=0x0-0x3)
    X86Grps.opGrpInvalid,   X86Grps.opGrpInvalid,   X86Grps.opGrpUndefined, X86Grps.opGrpUndefined  // 0x0F,0x00(reg=0x4-0x7)
];

/*
 * Unlike Grp6, Grp7 does not require separate real-mode and protected-mode dispatch tables, because all Grp7
 * instructions are valid in both modes.
 */
X86Op0F.aOpGrp7 = [
    X86Op0F.opSGDT,         X86Op0F.opSIDT,         X86Op0F.opLGDT,         X86Op0F.opLIDT,         // 0x0F,0x01(reg=0x0-0x3)
    X86Op0F.opSMSW,         X86Grps.opGrpUndefined, X86Op0F.opLMSW,         X86Grps.opGrpUndefined  // 0x0F,0x01(reg=0x4-0x7)
];

if (typeof module !== 'undefined') module.exports = X86Op0F;
