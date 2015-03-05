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
}

/**
 * op=0x0F,0x00 (GRP6 rm)
 *
 * @this {X86CPU}
 */
X86.opGrp6 = function GRP6()
{
    var bModRM = this.getIPByte();
    if ((bModRM & 0x38) < 0x10) {   // possible reg values: 0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38
        this.opFlags |= X86.OPFLAG.NOREAD;
    }
    this.aOpModGrpWord[bModRM].call(this, this.aOpGrp6, X86.fnGRPSrcNone);
};

/**
 * op=0x0F,0x01 (GRP7 rm)
 *
 * @this {X86CPU}
 */
X86.opGrp7 = function GRP7()
{
    var bModRM = this.getIPByte();
    if (!(bModRM & 0x10)) {
        this.opFlags |= X86.OPFLAG.NOREAD;
    }
    this.aOpModGrpWord[bModRM].call(this, X86.aOpGrp7, X86.fnGRPSrcNone);
};

/**
 * opLAR()
 *
 * op=0x0F,0x02 (LAR reg,rm)
 *
 * @this {X86CPU}
 */
X86.opLAR = function LAR()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLAR);
};

/**
 * opLSL()
 *
 * op=0x0F,0x03 (LSL reg,rm)
 *
 * @this {X86CPU}
 */
X86.opLSL = function LSL()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLSL);
};

/**
 * opLOADALL()
 *
 * op=0x0F,0x05 (LOADALL)
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
 */
X86.opLOADALL = function LOADALL()
{
    if (this.segCS.cpl) {
        /*
         * You're not allowed to use LOADALL if the current privilege level is something other than zero
         */
        X86.fnFault.call(this, X86.EXCEPTION.GP_FAULT, 0, true);
        return;
    }
    this.setMSW(this.getShort(0x806));
    this.regEDI = this.getShort(0x826);
    this.regESI = this.getShort(0x828);
    this.regEBP = this.getShort(0x82A);
    this.regEBX = this.getShort(0x82E);
    this.regEDX = this.getShort(0x830);
    this.regECX = this.getShort(0x832);
    this.regEAX = this.getShort(0x834);
    this.segES.loadDesc6(0x836, this.getShort(0x824));
    this.segCS.loadDesc6(0x83C, this.getShort(0x822));
    this.segSS.loadDesc6(0x842, this.getShort(0x820));
    this.segDS.loadDesc6(0x848, this.getShort(0x81E));
    this.setPS(this.getShort(0x818));
    /*
     * It's important to call setIP() and setSP() *after* the segCS and segSS loads, so that the CPU's
     * linear IP and SP registers (regLIP and regLSP) will be updated properly.  Ordinarily that would be
     * taken care of by simply using the CPU's setCS() and setSS() functions, but those functions call the
     * default descriptor load() functions, and obviously here we must use loadDesc6() instead.
     */
    this.setIP(this.getShort(0x81A));
    this.setSP(this.getShort(0x82C));
    /*
     * The bytes at 0x851 and 0x85D "should be zeroes", as per the "Undocumented iAPX 286 Test Instruction"
     * document, but the LOADALL issued by RAMDRIVE in PC-DOS 7.0 contains 0xFF in both of those bytes, resulting
     * in very large addrGDT and addrIDT values.  Obviously, we can't have that, so we load only the low byte
     * of the second word for both of those registers.
     */
    this.addrGDT = this.getShort(0x84E) | (this.getByte(0x850) << 16);
    this.addrGDTLimit = this.addrGDT + this.getShort(0x852);
    this.segLDT.loadDesc6(0x854, this.getShort(0x81C));
    this.addrIDT = this.getShort(0x85A) | (this.getByte(0x85C) << 16);
    this.addrIDTLimit = this.addrIDT + this.getShort(0x85E);
    this.segTSS.loadDesc6(0x860, this.getShort(0x816));
    this.nStepCycles -= 195;
    /*
     * TODO: LOADALL operation still needs to be verified in protected mode....
     */
    if (DEBUG && DEBUGGER && (this.regCR0 & X86.CR0.MSW.PE)) this.stopCPU();
};

/**
 * opCLTS()
 *
 * op=0x0F,0x06 (CLTS)
 *
 * @this {X86CPU}
 */
X86.opCLTS = function CLTS()
{
    if (this.segCS.cpl) {
        X86.fnFault.call(this, X86.EXCEPTION.GP_FAULT, 0, true);
        return;
    }
    this.regCR0 &= ~X86.CR0.MSW.TS;
    this.nStepCycles -= 2;
};

/**
 * opMOVrcr()
 *
 * op=0x0F,0x20 (MOV reg,cr)
 *
 * NOTE: Since the ModRM decoders deal only with general-purpose registers, we must move
 * the appropriate control register into a special variable (regMD16), which our helper function
 * (opHelpMOVMD16) will use to replace the decoder's src operand.
 *
 * @this {X86CPU}
 */
X86.opMOVrcr = function MOVrcr()
{
    var bModRM = this.getIPByte() | 0xc0;
    /*
     * Unlike, say, opcode 0x8C (MOV word,sr), this opcode supports only registers, not memory;
     * however, the 80386 apparently ignores the mod bits, treating any combination as if it was 0xc0.
     *
    if ((bModRM & 0xc0) != 0xc0) {
        X86.opInvalid.call(this);
        return;
    }
     */
    var reg = (bModRM & 0x38) >> 3;
    switch (reg) {
    case 0x0:
        this.regMD16 = this.regCR0;
        break;
    case 0x1:
        this.regMD16 = this.regCR1;
        break;
    case 0x2:
        this.regMD16 = this.regCR2;
        break;
    case 0x3:
        this.regMD16 = this.regCR3;
        break;
    default:
        X86.opUndefined.call(this);
        return;
    }
    /*
     * Like other MOV operations, the destination does not need to be read, just written;
     * however, it's moot, because we've already restricted this opcode to registers only.
     *
     *      this.opFlags |= X86.OPFLAG.NOREAD;
     */
    this.aOpModRegWord[bModRM].call(this, X86.fnMOVMD16);
};

/**
 * opMOVcrr()
 *
 * op=0x0F,0x22 (MOV cr,reg)
 *
 * NOTE: Since the ModRM decoders deal only with general-purpose registers, we have to
 * make a note of which general-purpose register will be overwritten, so that we can restore it
 * after moving the modified value to the correct control register.
 *
 * @this {X86CPU}
 */
X86.opMOVcrr = function MOVcrr()
{
    var temp;
    var bModRM = this.getIPByte() | 0xc0;
    /*
     * Unlike, say, opcode 0x8E (MOV sr,word), this opcode supports only registers, not memory;
     * however, the 80386 apparently ignores the mod bits, treating any combination as if it was 0xc0.
     *
    if ((bModRM & 0xc0) != 0xc0) {
        X86.opInvalid.call(this);
        return;
    }
     */
    var reg = (bModRM & 0x38) >> 3;
    switch(reg) {
    case 0x0:
        temp = this.regEAX;
        break;
    case 0x1:
        temp = this.regECX; // TODO: Is setting CR1 actually allowed on an 80386?
        break;
    case 0x2:
        temp = this.regEDX;
        break;
    case 0x3:
        temp = this.regEBX;
        break;
    default:
        X86.opInvalid.call(this);
        return;
    }
    this.aOpModRegWord[bModRM].call(this, X86.fnMOV);
    switch (reg) {
    case 0x0:
        reg = this.regEAX;
        this.regEAX = temp;
        X86.fnLCR0.call(this, reg);
        break;
    case 0x1:
        this.regCR1 = this.regECX;
        this.regECX = temp;
        break;
    case 0x2:
        this.regCR2 = this.regEDX;
        this.regEDX = temp;
        break;
    case 0x3:
        this.regCR3 = this.regEBX;
        this.regEBX = temp;
        break;
    default:
        break;              // there IS no other case, but JavaScript inspections don't know that
    }
};

X86.aOps0F = [
    X86.opGrp6,             X86.opGrp7,             X86.opLAR,              X86.opLSL,              // 0x00-0x03
    X86.opUndefined,        X86.opLOADALL,          X86.opCLTS,             X86.opUndefined,        // 0x04-0x07
    /*
     * On all processors (except the 8086/8088, of course), 0x0F,0x0B is also referred to as "UD2": an
     * instruction guaranteed to raise a #UD (Invalid Opcode) exception (INT 0x06) on all future x86 processors.
     */
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opInvalid,          // 0x08-0x0B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x0C-0x0F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x10-0x13
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x14-0x17
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x18-0x1B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x1C-0x1F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x20-0x23
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x24-0x27
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x28-0x2B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x2C-0x2F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x30-0x33
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x34-0x37
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x38-0x3B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x3C-0x3F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x40-0x43
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x44-0x47
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x48-0x4B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x4C-0x4F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x50-0x53
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x54-0x57
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x58-0x5B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x5C-0x5F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x60-0x63
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x64-0x67
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x68-0x6B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x6C-0x6F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x70-0x73
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x74-0x77
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x78-0x7B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x7C-0x7F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x80-0x83
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x84-0x87
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x88-0x8B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x8C-0x8F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x90-0x93
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x94-0x97
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x98-0x9B
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0x9C-0x9F
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xA0-0xA3
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xA4-0xA7
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xA8-0xAB
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xAC-0xAF
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xB0-0xB3
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xB4-0xB7
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xB8-0xBB
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xBC-0xBF
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xC0-0xC3
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xC4-0xC7
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xC8-0xCB
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xCC-0xCF
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xD0-0xD3
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xD4-0xD7
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xD8-0xDB
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xDC-0xDF
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xE0-0xE3
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xE4-0xE7
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xE8-0xEB
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xEC-0xEF
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xF0-0xF3
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xF4-0xF7
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        // 0xF8-0xFB
    X86.opUndefined,        X86.opUndefined,        X86.opUndefined,        X86.opUndefined         // 0xFC-0xFF
];

/*
 * These instruction groups are not as orthogonal as the original 8086/8088 groups (Grp1 through Grp4): some of
 * the instructions in Grp6 and Grp7 only read their dst operand (eg, LLDT), which means the ModRM helper function
 * must insure that setEAWord() is disabled, while others only write their dst operand (eg, SLDT), which means that
 * getEAWord() should be disabled *prior* to calling the ModRM helper function.  This latter case requires that
 * we decode the reg field of the ModRM byte before dispatching.
 */
X86.aOpGrp6Prot = [
    X86.fnSLDT,             X86.fnSTR,              X86.fnLLDT,             X86.fnLTR,              // 0x0F,0x00(reg=0x0-0x3)
    X86.fnVERR,             X86.fnVERW,             X86.fnGRPUndefined,     X86.fnGRPUndefined      // 0x0F,0x00(reg=0x4-0x7)
];

X86.aOpGrp6Real = [
    X86.fnGRPInvalid,       X86.fnGRPInvalid,       X86.fnGRPInvalid,       X86.fnGRPInvalid,       // 0x0F,0x00(reg=0x0-0x3)
    X86.fnGRPInvalid,       X86.fnGRPInvalid,       X86.fnGRPUndefined,     X86.fnGRPUndefined      // 0x0F,0x00(reg=0x4-0x7)
];

/*
 * Unlike Grp6, Grp7 does not require separate real-mode and protected-mode dispatch tables, because all Grp7
 * instructions are valid in both modes.
 */
X86.aOpGrp7 = [
    X86.fnSGDT,             X86.fnSIDT,             X86.fnLGDT,             X86.fnLIDT,             // 0x0F,0x01(reg=0x0-0x3)
    X86.fnSMSW,             X86.fnGRPUndefined,     X86.fnLMSW,             X86.fnGRPUndefined      // 0x0F,0x01(reg=0x4-0x7)
];
