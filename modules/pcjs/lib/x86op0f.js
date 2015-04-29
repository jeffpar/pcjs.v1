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
 * op=0x0F,0x00 (GRP6 mem/reg)
 *
 * @this {X86CPU}
 */
X86.opGRP6 = function GRP6()
{
    var bModRM = this.getIPByte();
    if ((bModRM & 0x38) < 0x10) {   // possible reg values: 0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38
        this.opFlags |= X86.OPFLAG.NOREAD;
    }
    this.aOpModGrpWord[bModRM].call(this, this.aOpGrp6, X86.fnSrcNone);
};

/**
 * op=0x0F,0x01 (GRP7 mem/reg)
 *
 * @this {X86CPU}
 */
X86.opGRP7 = function GRP7()
{
    var bModRM = this.getIPByte();
    if (!(bModRM & 0x10)) {
        this.opFlags |= X86.OPFLAG.NOREAD;
    }
    this.aOpModGrpWord[bModRM].call(this, X86.aOpGrp7, X86.fnSrcNone);
};

/**
 * opLAR()
 *
 * op=0x0F,0x02 (LAR reg,mem/reg)
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
 * op=0x0F,0x03 (LSL reg,mem/reg)
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
 * opMOVrc()
 *
 * op=0x0F,0x20 (MOV reg,creg)
 *
 * NOTE: Since the ModRM decoders deal only with general-purpose registers, we must move
 * the appropriate control register into a special variable (regXX), which our helper function
 * (fnMOVxx) will use to replace the decoder's src operand.
 *
 * @this {X86CPU}
 */
X86.opMOVrc = function MOVrc()
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
    switch(reg) {
    case 0x0:
        this.regXX = this.regCR0;
        break;
    case 0x1:
        this.regXX = this.regCR1;
        break;
    case 0x2:
        this.regXX = this.regCR2;
        break;
    case 0x3:
        this.regXX = this.regCR3;
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
    this.aOpModRegWord[bModRM].call(this, X86.fnMOVxx);
};

/**
 * opMOVcr()
 *
 * op=0x0F,0x22 (MOV creg,reg)
 *
 * NOTE: Since the ModRM decoders deal only with general-purpose registers, we have to
 * make a note of which general-purpose register will be overwritten, so that we can restore it
 * after moving the modified value to the correct control register.
 *
 * @this {X86CPU}
 */
X86.opMOVcr = function MOVcr()
{
    var temp;
    var bModRM = this.getIPByte() | 0xc0;
    /*
     * Unlike, say, opcode 0x8E (MOV sreg,word), this opcode supports only registers, not memory;
     * however, the 80386 apparently ignores the mod bits, treating any combination as if it was 0xc0.
     * TODO: Verify.
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
        if (DEBUG) this.stopCPU();
        break;
    case 0x3:
        temp = this.regEBX;
        if (DEBUG) this.stopCPU();
        break;
    default:
        X86.opInvalid.call(this);
        return;
    }
    this.aOpModRegWord[bModRM].call(this, X86.fnMOV);
    switch(reg) {
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
        /*
         * Normal use of regCR3 involves adding a 0-4K (12-bit) offset to obtain a page directory entry, so
         * let's ensure that the low 12 bits of regCR3 are always zero.
         */
        this.assert(!(this.regCR3 & X86.LADDR.OFFSET));
        this.regEBX = temp;
        break;
    }
};

/**
 * opJOw()
 *
 * op=0x0F,0x80 (JO rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJOw = function JOw()
{
    var disp = this.getIPDispWord();
    if (this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNOw()
 *
 * op=0x0F,0x81 (JNO rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNOw = function JNOw()
{
    var disp = this.getIPDispWord();
    if (!this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJCw()
 *
 * op=0x0F,0x82 (JC rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJCw = function JCw()
{
    var disp = this.getIPDispWord();
    if (this.getCF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNCw()
 *
 * op=0x0F,0x83 (JNC rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNCw = function JNCw()
{
    var disp = this.getIPDispWord();
    if (!this.getCF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJZw()
 *
 * op=0x0F,0x84 (JZ rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJZw = function JZw()
{
    var disp = this.getIPDispWord();
    if (this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNZw()
 *
 * op=0x0F,0x85 (JNZ rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNZw = function JNZw()
{
    var disp = this.getIPDispWord();
    if (!this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJBEw()
 *
 * op=0x0F,0x86 (JBE rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJBEw = function JBEw()
{
    var disp = this.getIPDispWord();
    if (this.getCF() || this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNBEw()
 *
 * op=0x0F,0x87 (JNBE rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNBEw = function JNBEw()
{
    var disp = this.getIPDispWord();
    if (!this.getCF() && !this.getZF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJSw()
 *
 * op=0x0F,0x88 (JS rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJSw = function JSw()
{
    var disp = this.getIPDispWord();
    if (this.getSF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNSw()
 *
 * op=0x0F,0x89 (JNS rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNSw = function JNSw()
{
    var disp = this.getIPDispWord();
    if (!this.getSF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJPw()
 *
 * op=0x0F,0x8A (JP rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJPw = function JPw()
{
    var disp = this.getIPDispWord();
    if (this.getPF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNPw()
 *
 * op=0x0F,0x8B (JNP rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNPw = function JNPw()
{
    var disp = this.getIPDispWord();
    if (!this.getPF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJLw()
 *
 * op=0x0F,0x8C (JL rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJLw = function JLw()
{
    var disp = this.getIPDispWord();
    if (!this.getSF() != !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNLw()
 *
 * op=0x0F,0x8D (JNL rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNLw = function JNLw()
{
    var disp = this.getIPDispWord();
    if (!this.getSF() == !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJLEw()
 *
 * op=0x0F,0x8E (JLE rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJLEw = function JLEw()
{
    var disp = this.getIPDispWord();
    if (this.getZF() || !this.getSF() != !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opJNLEw()
 *
 * op=0x0F,0x8F (JNLE rel16/rel32)
 *
 * @this {X86CPU}
 */
X86.opJNLEw = function JNLEw()
{
    var disp = this.getIPDispWord();
    if (!this.getZF() && !this.getSF() == !this.getOF()) {
        this.setIP(this.getIP() + disp);
        this.nStepCycles -= this.cycleCounts.nOpCyclesJmpC;
        return;
    }
    this.nStepCycles -= this.cycleCounts.nOpCyclesJmpCFall;
};

/**
 * opSETO()
 *
 * op=0x0F,0x90 (SETO b)
 *
 * @this {X86CPU}
 */
X86.opSETO = function SETO()
{
    X86.fnSETcc.call(this, X86.fnSETO);
};

/**
 * opSETNO()
 *
 * op=0x0F,0x91 (SETNO b)
 *
 * @this {X86CPU}
 */
X86.opSETNO = function SETNO()
{
    X86.fnSETcc.call(this, X86.fnSETO);
};

/**
 * opSETC()
 *
 * op=0x0F,0x92 (SETC b)
 *
 * @this {X86CPU}
 */
X86.opSETC = function SETC()
{
    X86.fnSETcc.call(this, X86.fnSETC);
};

/**
 * opSETNC()
 *
 * op=0x0F,0x93 (SETNC b)
 *
 * @this {X86CPU}
 */
X86.opSETNC = function SETNC()
{
    X86.fnSETcc.call(this, X86.fnSETNC);
};

/**
 * opSETZ()
 *
 * op=0x0F,0x94 (SETZ b)
 *
 * @this {X86CPU}
 */
X86.opSETZ = function SETZ()
{
    X86.fnSETcc.call(this, X86.fnSETZ);
};

/**
 * opSETNZ()
 *
 * op=0x0F,0x95 (SETNZ b)
 *
 * @this {X86CPU}
 */
X86.opSETNZ = function SETNZ()
{
    X86.fnSETcc.call(this, X86.fnSETNZ);
};

/**
 * opSETBE()
 *
 * op=0x0F,0x96 (SETBE b)
 *
 * @this {X86CPU}
 */
X86.opSETBE = function SETBE()
{
    X86.fnSETcc.call(this, X86.fnSETBE);
};

/**
 * opSETNBE()
 *
 * op=0x0F,0x97 (SETNBE b)
 *
 * @this {X86CPU}
 */
X86.opSETNBE = function SETNBE()
{
    X86.fnSETcc.call(this, X86.fnSETNBE);
};

/**
 * opSETS()
 *
 * op=0x0F,0x98 (SETS b)
 *
 * @this {X86CPU}
 */
X86.opSETS = function SETS()
{
    X86.fnSETcc.call(this, X86.fnSETS);
};

/**
 * opSETNS()
 *
 * op=0x0F,0x99 (SETNS b)
 *
 * @this {X86CPU}
 */
X86.opSETNS = function SETNS()
{
    X86.fnSETcc.call(this, X86.fnSETNS);
};

/**
 * opSETP()
 *
 * op=0x0F,0x9A (SETP b)
 *
 * @this {X86CPU}
 */
X86.opSETP = function SETP()
{
    X86.fnSETcc.call(this, X86.fnSETP);
};

/**
 * opSETNP()
 *
 * op=0x0F,0x9B (SETNP b)
 *
 * @this {X86CPU}
 */
X86.opSETNP = function SETNP()
{
    X86.fnSETcc.call(this, X86.fnSETNP);
};

/**
 * opSETL()
 *
 * op=0x0F,0x9C (SETL b)
 *
 * @this {X86CPU}
 */
X86.opSETL = function SETL()
{
    X86.fnSETcc.call(this, X86.fnSETL);
};

/**
 * opSETNL()
 *
 * op=0x0F,0x9D (SETNL b)
 *
 * @this {X86CPU}
 */
X86.opSETNL = function SETNL()
{
    X86.fnSETcc.call(this, X86.fnSETNL);
};

/**
 * opSETLE()
 *
 * op=0x0F,0x9E (SETLE b)
 *
 * @this {X86CPU}
 */
X86.opSETLE = function SETLE()
{
    X86.fnSETcc.call(this, X86.fnSETLE);
};

/**
 * opSETNLE()
 *
 * op=0x0F,0x9F (SETNLE b)
 *
 * @this {X86CPU}
 */
X86.opSETNLE = function SETNLE()
{
    X86.fnSETcc.call(this, X86.fnSETNLE);
};

/**
 * opPUSHFS()
 *
 * op=0x0F,0xA0 (PUSH FS)
 *
 * @this {X86CPU}
 */
X86.opPUSHFS = function PUSHFS()
{
    this.pushWord(this.segFS.sel);
    this.nStepCycles -= this.cycleCounts.nOpCyclesPushSeg;
};

/**
 * opPOPFS()
 *
 * op=0x0F,0xA1 (POP FS)
 *
 * @this {X86CPU}
 */
X86.opPOPFS = function POPFS()
{
    this.setFS(this.popWord());
    this.nStepCycles -= this.cycleCounts.nOpCyclesPopReg;
};

/**
 * opBT()
 *
 * op=0x0F,0xA3 (BT mem/reg,reg)
 *
 * @this {X86CPU}
 */
X86.opBT = function BT()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnBT);
    if (this.regEA !== X86.ADDR_INVALID) this.nStepCycles -= this.cycleCounts.nOpCyclesBitTestMExtra;
};

/**
 * opSHLDn()
 *
 * op=0x0F,0xA4 (SHLD mem/reg,reg,imm8)
 *
 * @this {X86CPU}
 */
X86.opSHLDn = function SHLDn()
{
    this.aOpModMemWord[this.getIPByte()].call(this, this.dataSize == 2? X86.fnSHLDwi : X86.fnSHLDdi);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesShiftDR : this.cycleCounts.nOpCyclesShiftDM);
};

/**
 * opSHLDcl()
 *
 * op=0x0F,0xA5 (SHLD mem/reg,reg,CL)
 *
 * @this {X86CPU}
 */
X86.opSHLDcl = function SHLDcl()
{
    this.aOpModMemWord[this.getIPByte()].call(this, this.dataSize == 2? X86.fnSHLDwCL : X86.fnSHLDdCL);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesShiftDR : this.cycleCounts.nOpCyclesShiftDM);
};

/**
 * opPUSHGS()
 *
 * op=0x0F,0xA8 (PUSH GS)
 *
 * @this {X86CPU}
 */
X86.opPUSHGS = function PUSHGS()
{
    this.pushWord(this.segGS.sel);
    this.nStepCycles -= this.cycleCounts.nOpCyclesPushSeg;
};

/**
 * opPOPGS()
 *
 * op=0x0F,0xA9 (POP GS)
 *
 * @this {X86CPU}
 */
X86.opPOPGS = function POPGS()
{
    this.setGS(this.popWord());
    this.nStepCycles -= this.cycleCounts.nOpCyclesPopReg;
};

/**
 * opBTS()
 *
 * op=0x0F,0xAB (BTC mem/reg,reg)
 *
 * @this {X86CPU}
 */
X86.opBTS = function BTS()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnBTS);
    if (this.regEA !== X86.ADDR_INVALID) this.nStepCycles -= this.cycleCounts.nOpCyclesBitSetMExtra;
};

/**
 * opSHRDn()
 *
 * op=0x0F,0xAC (SHRD mem/reg,reg,imm8)
 *
 * @this {X86CPU}
 */
X86.opSHRDn = function SHRDn()
{
    this.aOpModMemWord[this.getIPByte()].call(this, this.dataSize == 2? X86.fnSHRDwi : X86.fnSHRDdi);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesShiftDR : this.cycleCounts.nOpCyclesShiftDM);
};

/**
 * opSHRDcl()
 *
 * op=0x0F,0xAD (SHRD mem/reg,reg,CL)
 *
 * @this {X86CPU}
 */
X86.opSHRDcl = function SHRDcl()
{
    this.aOpModMemWord[this.getIPByte()].call(this, this.dataSize == 2? X86.fnSHRDwCL : X86.fnSHRDdCL);
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesShiftDR : this.cycleCounts.nOpCyclesShiftDM);
};

/**
 * opIMUL()
 *
 * op=0x0F,0xAF (IMUL reg,mem/reg) (80386 and up)
 *
 * @this {X86CPU}
 */
X86.opIMUL = function IMUL()
{
    this.aOpModRegWord[this.getIPByte()].call(this, this.dataSize == 2? X86.fnIMULrw : X86.fnIMULrd);
};

/**
 * opLSS()
 *
 * op=0x0F,0xB2 (LSS reg,word)
 *
 * This is like a "MOV reg,rm" operation, but it also loads SS from the next word.
 *
 * @this {X86CPU}
 */
X86.opLSS = function LSS()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLSS);
};

/**
 * opBTR()
 *
 * op=0x0F,0xB3 (BTC mem/reg,reg) (80386 and up)
 *
 * @this {X86CPU}
 */
X86.opBTR = function BTR()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnBTR);
    if (this.regEA !== X86.ADDR_INVALID) this.nStepCycles -= this.cycleCounts.nOpCyclesBitSetMExtra;
};

/**
 * opLFS()
 *
 * op=0x0F,0xB4 (LFS reg,word)
 *
 * This is like a "MOV reg,rm" operation, but it also loads FS from the next word.
 *
 * @this {X86CPU}
 */
X86.opLFS = function LFS()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLFS);
};

/**
 * opLGS()
 *
 * op=0x0F,0xB5 (LGS reg,word)
 *
 * This is like a "MOV reg,rm" operation, but it also loads GS from the next word.
 *
 * @this {X86CPU}
 */
X86.opLGS = function LGS()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnLGS);
};

/**
 * opMOVZXb()
 *
 * op=0x0F,0xB6 (MOVZX reg,byte)
 *
 * @this {X86CPU}
 */
X86.opMOVZXb = function MOVZXb()
{
    /*
     * The ModRegByte handlers update the registers in the 1st column, but we need to update those in the 2nd column.
     *
     *      000:    AL      ->      000:    AX
     *      001:    CL      ->      001:    CX
     *      010:    DL      ->      010:    DX
     *      011:    BL      ->      011:    BX
     *      100:    AH      ->      100:    SP
     *      101:    CH      ->      101:    BP
     *      110:    DH      ->      110:    SI
     *      111:    BH      ->      111:    DI
     */
    var temp;
    var bModRM = this.getIPByte();
    var reg = (bModRM & 0x38) >> 3;
    switch(reg) {
    case 0x4:
        temp = this.regEAX;
        break;
    case 0x5:
        temp = this.regECX;
        break;
    case 0x6:
        temp = this.regEDX;
        break;
    case 0x7:
        temp = this.regEBX;
        break;
    }
    this.aOpModRegByte[bModRM].call(this, X86.fnMOVX);
    switch(reg) {
    case 0x0:
        this.regEAX = (this.regEAX & ~this.dataMask) | (this.regEAX & 0xff);
        break;
    case 0x1:
        this.regECX = (this.regECX & ~this.dataMask) | (this.regECX & 0xff);
        break;
    case 0x2:
        this.regEDX = (this.regEDX & ~this.dataMask) | (this.regEDX & 0xff);
        break;
    case 0x3:
        this.regEBX = (this.regEBX & ~this.dataMask) | (this.regEBX & 0xff);
        break;
    case 0x4:
        this.regESP = (this.regESP & ~this.dataMask) | ((this.regEAX >> 8) & 0xff);
        this.regEAX = temp;
        break;
    case 0x5:
        this.regEBP = (this.regEBP & ~this.dataMask) | ((this.regECX >> 8) & 0xff);
        this.regECX = temp;
        break;
    case 0x6:
        this.regESI = (this.regESI & ~this.dataMask) | ((this.regEDX >> 8) & 0xff);
        this.regEDX = temp;
        break;
    case 0x7:
        this.regEDI = (this.regEDI & ~this.dataMask) | ((this.regEBX >> 8) & 0xff);
        this.regEBX = temp;
        break;
    }
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMovXR : this.cycleCounts.nOpCyclesMovXM);
};

/**
 * opMOVZXw()
 *
 * op=0x0F,0xB7 (MOVZX reg,word)
 *
 * @this {X86CPU}
 */
X86.opMOVZXw = function MOVZXw()
{
    var bModRM = this.getIPByte();
    this.aOpModRegWord[bModRM].call(this, X86.fnMOVX);
    switch((bModRM & 0x38) >> 3) {
    case 0x0:
        this.regEAX = (this.regEAX & 0xffff);
        break;
    case 0x1:
        this.regECX = (this.regECX & 0xffff);
        break;
    case 0x2:
        this.regEDX = (this.regEDX & 0xffff);
        break;
    case 0x3:
        this.regEBX = (this.regEBX & 0xffff);
        break;
    case 0x4:
        this.regESP = (this.regESP & 0xffff);
        break;
    case 0x5:
        this.regEBP = (this.regEBP & 0xffff);
        break;
    case 0x6:
        this.regESI = (this.regESI & 0xffff);
        break;
    case 0x7:
        this.regEDI = (this.regEDI & 0xffff);
        break;
    }
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMovXR : this.cycleCounts.nOpCyclesMovXM);
};

/**
 * op=0x0F,0xBA (GRP8 mem/reg) (80386 and up)
 *
 * @this {X86CPU}
 */
X86.opGRP8 = function GRP8()
{
    this.aOpModGrpWord[this.getIPByte()].call(this, X86.aOpGrp8, this.getIPByte);
};

/**
 * opBTC()
 *
 * op=0x0F,0xBB (BTC mem/reg,reg)
 *
 * @this {X86CPU}
 */
X86.opBTC = function BTC()
{
    this.aOpModMemWord[this.getIPByte()].call(this, X86.fnBTC);
    if (this.regEA !== X86.ADDR_INVALID) this.nStepCycles -= this.cycleCounts.nOpCyclesBitSetMExtra;
};

/**
 * opBSF()
 *
 * op=0x0F,0xBB (BSF reg,mem/reg)
 *
 * @this {X86CPU}
 */
X86.opBSF = function BSF()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnBSF);
};

/**
 * opBSR()
 *
 * op=0x0F,0xBC (BSR reg,mem/reg)
 *
 * @this {X86CPU}
 */
X86.opBSR = function BSR()
{
    this.aOpModRegWord[this.getIPByte()].call(this, X86.fnBSR);
};

/**
 * opMOVSXb()
 *
 * op=0x0F,0xBE (MOVSX reg,byte)
 *
 * @this {X86CPU}
 */
X86.opMOVSXb = function MOVSXb()
{
    /*
     * The ModRegByte handlers update the registers in the 1st column, but we need to update those in the 2nd column.
     *
     *      000:    AL      ->      000:    AX
     *      001:    CL      ->      001:    CX
     *      010:    DL      ->      010:    DX
     *      011:    BL      ->      011:    BX
     *      100:    AH      ->      100:    SP
     *      101:    CH      ->      101:    BP
     *      110:    DH      ->      110:    SI
     *      111:    BH      ->      111:    DI
     */
    var temp;
    var bModRM = this.getIPByte();
    var reg = (bModRM & 0x38) >> 3;
    switch(reg) {
    case 0x4:
        temp = this.regEAX;
        break;
    case 0x5:
        temp = this.regECX;
        break;
    case 0x6:
        temp = this.regEDX;
        break;
    case 0x7:
        temp = this.regEBX;
        break;
    }
    this.aOpModRegByte[bModRM].call(this, X86.fnMOVX);
    switch(reg) {
    case 0x0:
        this.regEAX = (this.regEAX & ~this.dataMask) | ((((this.regEAX & 0xff) << 24) >> 24) & this.dataMask);
        break;
    case 0x1:
        this.regECX = (this.regECX & ~this.dataMask) | ((((this.regECX & 0xff) << 24) >> 24) & this.dataMask);
        break;
    case 0x2:
        this.regEDX = (this.regEDX & ~this.dataMask) | ((((this.regEDX & 0xff) << 24) >> 24) & this.dataMask);
        break;
    case 0x3:
        this.regEBX = (this.regEBX & ~this.dataMask) | ((((this.regEBX & 0xff) << 24) >> 24) & this.dataMask);
        break;
    case 0x4:
        this.regESP = (this.regESP & ~this.dataMask) | (((this.regEAX << 16) >> 24) & this.dataMask);
        this.regEAX = temp;
        break;
    case 0x5:
        this.regEBP = (this.regEBP & ~this.dataMask) | (((this.regECX << 16) >> 24) & this.dataMask);
        this.regECX = temp;
        break;
    case 0x6:
        this.regESI = (this.regESI & ~this.dataMask) | (((this.regEDX << 16) >> 24) & this.dataMask);
        this.regEDX = temp;
        break;
    case 0x7:
        this.regEDI = (this.regEDI & ~this.dataMask) | (((this.regEBX << 16) >> 24) & this.dataMask);
        this.regEBX = temp;
        break;
    }
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMovXR : this.cycleCounts.nOpCyclesMovXM);
};

/**
 * opMOVSXw()
 *
 * op=0x0F,0xBF (MOVSX reg,word)
 *
 * @this {X86CPU}
 */
X86.opMOVSXw = function MOVSXw()
{
    var bModRM = this.getIPByte();
    this.aOpModRegWord[bModRM].call(this, X86.fnMOVX);
    switch((bModRM & 0x38) >> 3) {
    case 0x0:
        this.regEAX = ((this.regEAX << 16) >> 16);
        break;
    case 0x1:
        this.regECX = ((this.regECX << 16) >> 16);
        break;
    case 0x2:
        this.regEDX = ((this.regEDX << 16) >> 16);
        break;
    case 0x3:
        this.regEBX = ((this.regEBX << 16) >> 16);
        break;
    case 0x4:
        this.regESP = ((this.regESP << 16) >> 16);
        break;
    case 0x5:
        this.regEBP = ((this.regEBP << 16) >> 16);
        break;
    case 0x6:
        this.regESI = ((this.regESI << 16) >> 16);
        break;
    case 0x7:
        this.regEDI = ((this.regEDI << 16) >> 16);
        break;
    }
    this.nStepCycles -= (this.regEA === X86.ADDR_INVALID? this.cycleCounts.nOpCyclesMovXR : this.cycleCounts.nOpCyclesMovXM);
};

X86.aOps0F = new Array(256);

X86.aOps0F[0x00] = X86.opGRP6;
X86.aOps0F[0x01] = X86.opGRP7;
X86.aOps0F[0x02] = X86.opLAR;
X86.aOps0F[0x03] = X86.opLSL;
X86.aOps0F[0x05] = X86.opLOADALL;
X86.aOps0F[0x06] = X86.opCLTS;

/*
 * On all processors (except the 8086/8088, of course), X86.OPCODE.UD2 (0x0F,0x0B), aka "UD2", is an
 * instruction guaranteed to raise a #UD (Invalid Opcode) exception (INT 0x06) on all future x86 processors.
 */
X86.aOps0F[0x0B] = X86.opInvalid;

if (I386) {
    X86.aOps0F386 = [];
    X86.aOps0F386[0x20] = X86.opMOVrc;
    X86.aOps0F386[0x22] = X86.opMOVcr;
    X86.aOps0F386[0x80] = X86.opJOw;
    X86.aOps0F386[0x81] = X86.opJNOw;
    X86.aOps0F386[0x82] = X86.opJCw;
    X86.aOps0F386[0x83] = X86.opJNCw;
    X86.aOps0F386[0x84] = X86.opJZw;
    X86.aOps0F386[0x85] = X86.opJNZw;
    X86.aOps0F386[0x86] = X86.opJBEw;
    X86.aOps0F386[0x87] = X86.opJNBEw;
    X86.aOps0F386[0x88] = X86.opJSw;
    X86.aOps0F386[0x89] = X86.opJNSw;
    X86.aOps0F386[0x8A] = X86.opJPw;
    X86.aOps0F386[0x8B] = X86.opJNPw;
    X86.aOps0F386[0x8C] = X86.opJLw;
    X86.aOps0F386[0x8D] = X86.opJNLw;
    X86.aOps0F386[0x8E] = X86.opJLEw;
    X86.aOps0F386[0x8F] = X86.opJNLEw;
    X86.aOps0F386[0x90] = X86.opSETO;
    X86.aOps0F386[0x91] = X86.opSETNO;
    X86.aOps0F386[0x92] = X86.opSETC;
    X86.aOps0F386[0x93] = X86.opSETNC;
    X86.aOps0F386[0x94] = X86.opSETZ;
    X86.aOps0F386[0x95] = X86.opSETNZ;
    X86.aOps0F386[0x96] = X86.opSETBE;
    X86.aOps0F386[0x97] = X86.opSETNBE;
    X86.aOps0F386[0x98] = X86.opSETS;
    X86.aOps0F386[0x99] = X86.opSETNS;
    X86.aOps0F386[0x9A] = X86.opSETP;
    X86.aOps0F386[0x9B] = X86.opSETNP;
    X86.aOps0F386[0x9C] = X86.opSETL;
    X86.aOps0F386[0x9D] = X86.opSETNL;
    X86.aOps0F386[0x9E] = X86.opSETLE;
    X86.aOps0F386[0x9F] = X86.opSETNLE;
    X86.aOps0F386[0xA0] = X86.opPUSHFS;
    X86.aOps0F386[0xA1] = X86.opPOPFS;
    X86.aOps0F386[0xA3] = X86.opBT;
    X86.aOps0F386[0xA4] = X86.opSHLDn;
    X86.aOps0F386[0xA5] = X86.opSHLDcl;
    X86.aOps0F386[0xA8] = X86.opPUSHGS;
    X86.aOps0F386[0xA9] = X86.opPOPGS;
    X86.aOps0F386[0xAB] = X86.opBTS;
    X86.aOps0F386[0xAC] = X86.opSHRDn;
    X86.aOps0F386[0xAD] = X86.opSHRDcl;
    X86.aOps0F386[0xAF] = X86.opIMUL;
    X86.aOps0F386[0xB2] = X86.opLSS;
    X86.aOps0F386[0xB3] = X86.opBTR;
    X86.aOps0F386[0xB4] = X86.opLFS;
    X86.aOps0F386[0xB5] = X86.opLGS;
    X86.aOps0F386[0xB6] = X86.opMOVZXb;
    X86.aOps0F386[0xB7] = X86.opMOVZXw;
    X86.aOps0F386[0xBA] = X86.opGRP8;
    X86.aOps0F386[0xBB] = X86.opBTC;
    X86.aOps0F386[0xBC] = X86.opBSF;
    X86.aOps0F386[0xBE] = X86.opMOVSXb;
    X86.aOps0F386[0xBF] = X86.opMOVSXw;
}

/*
 * These instruction groups are not as orthogonal as the original 8086/8088 groups (Grp1 through Grp4); some of
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
 * Unlike Grp6, Grp7 does not require separate real-mode and protected-mode dispatch tables,
 * because all Grp7 instructions are valid in both modes.
 */
X86.aOpGrp7 = [
    X86.fnSGDT,             X86.fnSIDT,             X86.fnLGDT,             X86.fnLIDT,             // 0x0F,0x01(reg=0x0-0x3)
    X86.fnSMSW,             X86.fnGRPUndefined,     X86.fnLMSW,             X86.fnGRPUndefined      // 0x0F,0x01(reg=0x4-0x7)
];

X86.aOpGrp8 = [
    X86.fnGRPUndefined,     X86.fnGRPUndefined,     X86.fnGRPUndefined,     X86.fnGRPUndefined,     // 0x0F,0xBA(reg=0x0-0x3)
    X86.fnBT,               X86.fnBTS,              X86.fnBTR,              X86.fnBTC               // 0x0F,0xBA(reg=0x4-0x7)
];
