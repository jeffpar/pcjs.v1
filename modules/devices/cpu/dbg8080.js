/**
 * @fileoverview Debugger for the 8080 CPU
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2019 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <https://www.pcjs.org>.
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
 * <https://www.pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * Debugger for the 8080 CPU
 *
 * @class {Debugger}
 * @unrestricted
 */
class Debugger extends DbgIO {
    /**
     * DbgIO(idMachine, idDevice, config)
     *
     * @this {Debugger}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.styles = [Debugger.STYLE_8080, Debugger.STYLE_8086];
        this.style = Debugger.STYLE_8086;
        this.maxOpLength = 3;
    }

    /**
     * unassemble(opcodes)
     *
     * Overrides DbgIO's default unassemble() function with one that understands 8080 instructions.
     *
     * @this {Debugger}
     * @param {Address} address (advanced by the number of processed opcodes)
     * @param {Array.<number>} opcodes (each processed opcode is shifted out, reducing the size of the array)
     * @return {string}
     */
    unassemble(address, opcodes)
    {
        let dbg = this;
        let sAddr = this.dumpAddress(address), sBytes = "";
        let sLabel = this.getSymbolName(address, DbgIO.SYMBOL.LABEL);
        let sComment = this.getSymbolName(address, DbgIO.SYMBOL.COMMENT);

        let getNextByte = function() {
            let byte = opcodes.shift();
            sBytes += dbg.toBase(byte, 16, 8, "");
            dbg.addAddress(address, 1);
            return byte;
        };

        let getNextWord = function() {
            return getNextByte() | (getNextByte() << 8);
        };

        /**
         * getImmOperand(type)
         *
         * @param {number} type
         * @return {string} operand
         */
        let getImmOperand = function(type) {
            var sOperand = ' ';
            var typeSize = type & Debugger.TYPE_SIZE;
            switch (typeSize) {
            case Debugger.TYPE_BYTE:
                sOperand = dbg.toBase(getNextByte(), 16, 8, "");
                break;
            case Debugger.TYPE_SBYTE:
                sOperand = dbg.toBase((getNextWord() << 24) >> 24, 16, 16, "");
                break;
            case Debugger.TYPE_WORD:
                sOperand = dbg.toBase(getNextWord(), 16, 16, "");
                break;
            default:
                return "imm(" + dbg.toBase(type, 16, 16, "") + ')';
            }
            if (dbg.style == Debugger.STYLE_8086 && (type & Debugger.TYPE_MEM)) {
                sOperand = '[' + sOperand + ']';
            } else if (!(type & Debugger.TYPE_REG)) {
                sOperand = (dbg.style == Debugger.STYLE_8080? '$' : "0x") + sOperand;
            }
            return sOperand;
        };

        /**
         * getRegOperand(iReg, type)
         *
         * @param {number} iReg
         * @param {number} type
         * @return {string} operand
         */
        let getRegOperand = function(iReg, type)
        {
            /*
             * Although this breaks with 8080 assembler conventions, I'm going to experiment with some different
             * mnemonics; specifically, "[HL]" instead of "M".  This is also more in keeping with how getImmOperand()
             * displays memory references (ie, by enclosing them in brackets).
             */
            var sOperand = Debugger.REGS[iReg];
            if (dbg.style == Debugger.STYLE_8086 && (type & Debugger.TYPE_MEM)) {
                if (iReg == Debugger.REG_M) {
                    sOperand = "HL";
                }
                sOperand = '[' + sOperand + ']';
            }
            return sOperand;
        };

        let opcode = getNextByte();

        let asOpcodes = this.style != Debugger.STYLE_8086? Debugger.INS_NAMES : Debugger.INS_NAMES_8086;
        let aOpDesc = Debugger.aaOpDescs[opcode];
        let iOpcode = aOpDesc[0];

        let sOperands = "";
        let sOpcode = asOpcodes[iOpcode];
        let cOperands = aOpDesc.length - 1;
        let typeSizeDefault = Debugger.TYPE_NONE, type;

        for (let iOperand = 1; iOperand <= cOperands; iOperand++) {

            let sOperand = "";

            type = aOpDesc[iOperand];
            if (type === undefined) continue;
            if ((type & Debugger.TYPE_OPT) && this.style == Debugger.STYLE_8080) continue;

            let typeMode = type & Debugger.TYPE_MODE;
            if (!typeMode) continue;

            let typeSize = type & Debugger.TYPE_SIZE;
            if (!typeSize) {
                type |= typeSizeDefault;
            } else {
                typeSizeDefault = typeSize;
            }

            let typeOther = type & Debugger.TYPE_OTHER;
            if (!typeOther) {
                type |= (iOperand == 1? Debugger.TYPE_OUT : Debugger.TYPE_IN);
            }

            if (typeMode & Debugger.TYPE_IMM) {
                sOperand = getImmOperand(type);
            }
            else if (typeMode & Debugger.TYPE_REG) {
                sOperand = getRegOperand((type & Debugger.TYPE_IREG) >> 8, type);
            }
            else if (typeMode & Debugger.TYPE_INT) {
                sOperand = ((opcode >> 3) & 0x7).toString();
            }

            if (!sOperand || !sOperand.length) {
                sOperands = "INVALID";
                break;
            }
            if (sOperands.length > 0) sOperands += ',';
            sOperands += (sOperand || "???");
        }

        let s = this.sprintf("%s %-7s%s %-7s %s", sAddr, sBytes, (type & Debugger.TYPE_UNDOC)? '*' : ' ', sOpcode, sOperands);
        if (sLabel) s = sLabel + ":\n" + s;
        if (sComment) s = this.sprintf("%-32s; %s", s, sComment);
        return s + "\n";
    }
}

Debugger.STYLE_8080 = "8080";
Debugger.STYLE_8086 = "8086";

/*
 * CPU instruction ordinals
 */
Debugger.INS = {
    NONE:   0,  ACI:    1,  ADC:    2,  ADD:    3,  ADI:    4,  ANA:    5,  ANI:    6,  CALL:   7,
    CC:     8,  CM:     9,  CNC:   10,  CNZ:   11,  CP:    12,  CPE:   13,  CPO:   14,  CZ:    15,
    CMA:   16,  CMC:   17,  CMP:   18,  CPI:   19,  DAA:   20,  DAD:   21,  DCR:   22,  DCX:   23,
    DI:    24,  EI:    25,  HLT:   26,  IN:    27,  INR:   28,  INX:   29,  JMP:   30,  JC:    31,
    JM:    32,  JNC:   33,  JNZ:   34,  JP:    35,  JPE:   36,  JPO:   37,  JZ:    38,  LDA:   39,
    LDAX:  40,  LHLD:  41,  LXI:   42,  MOV:   43,  MVI:   44,  NOP:   45,  ORA:   46,  ORI:   47,
    OUT:   48,  PCHL:  49,  POP:   50,  PUSH:  51,  RAL:   52,  RAR:   53,  RET:   54,  RC:    55,
    RM:    56,  RNC:   57,  RNZ:   58,  RP:    59,  RPE:   60,  RPO:   61,  RZ:    62,  RLC:   63,
    RRC:   64,  RST:   65,  SBB:   66,  SBI:   67,  SHLD:  68,  SPHL:  69,  STA:   70,  STAX:  71,
    STC:   72,  SUB:   73,  SUI:   74,  XCHG:  75,  XRA:   76,  XRI:   77,  XTHL:  78
};

/*
 * CPU instruction names (mnemonics), indexed by CPU instruction ordinal (above)
 *
 * If you change the default style, using the "s" command (eg, "s 8086"), then the 8086 table
 * will be used instead.  TODO: Add a "s z80" command for Z80-style mnemonics.
 */
Debugger.INS_NAMES = [
    "NONE",     "ACI",      "ADC",      "ADD",      "ADI",      "ANA",      "ANI",      "CALL",
    "CC",       "CM",       "CNC",      "CNZ",      "CP",       "CPE",      "CPO",      "CZ",
    "CMA",      "CMC",      "CMP",      "CPI",      "DAA",      "DAD",      "DCR",      "DCX",
    "DI",       "EI",       "HLT",      "IN",       "INR",      "INX",      "JMP",      "JC",
    "JM",       "JNC",      "JNZ",      "JP",       "JPE",      "JPO",      "JZ",       "LDA",
    "LDAX",     "LHLD",     "LXI",      "MOV",      "MVI",      "NOP",      "ORA",      "ORI",
    "OUT",      "PCHL",     "POP",      "PUSH",     "RAL",      "RAR",      "RET",      "RC",
    "RM",       "RNC",      "RNZ",      "RP",       "RPE",      "RPO",      "RZ",       "RLC",
    "RRC",      "RST",      "SBB",      "SBI",      "SHLD",     "SPHL",     "STA",      "STAX",
    "STC",      "SUB",      "SUI",      "XCHG",     "XRA",      "XRI",      "XTHL"
];

Debugger.INS_NAMES_8086 = [
    "NONE",     "ADC",      "ADC",      "ADD",      "ADD",      "AND",      "AND",      "CALL",
    "CALLC",    "CALLS",    "CALLNC",   "CALLNZ",   "CALLNS",   "CALLP",    "CALLNP",   "CALLZ",
    "NOT",      "CMC",      "CMP",      "CMP",      "DAA",      "ADD",      "DEC",      "DEC",
    "CLI",      "STI",      "HLT",      "IN",       "INC",      "INC",      "JMP",      "JC",
    "JS",       "JNC",      "JNZ",      "JNS",      "JP",       "JNP",      "JZ",       "MOV",
    "MOV",      "MOV",      "MOV",      "MOV",      "MOV",      "NOP",      "OR",       "OR",
    "OUT",      "JMP",      "POP",      "PUSH",     "RCL",      "RCR",      "RET",      "RETC",
    "RETS",     "RETNC",    "RETNZ",    "RETNS",    "RETP",     "RETNP",    "RETZ",     "ROL",
    "ROR",      "RST",      "SBB",      "SBB",      "MOV",      "MOV",      "MOV",      "MOV",
    "STC",      "SUB",      "SUB",      "XCHG",     "XOR",      "XOR",      "XCHG"
];

Debugger.REG_B      = 0x00;
Debugger.REG_C      = 0x01;
Debugger.REG_D      = 0x02;
Debugger.REG_E      = 0x03;
Debugger.REG_H      = 0x04;
Debugger.REG_L      = 0x05;
Debugger.REG_M      = 0x06;
Debugger.REG_A      = 0x07;
Debugger.REG_BC     = 0x08;
Debugger.REG_DE     = 0x09;
Debugger.REG_HL     = 0x0A;
Debugger.REG_SP     = 0x0B;
Debugger.REG_PC     = 0x0C;
Debugger.REG_PS     = 0x0D;
Debugger.REG_PSW    = 0x0E;         // aka AF if Z80-style mnemonics

/*
 * NOTE: "PS" is the complete processor status, which includes bits like the Interrupt flag (IF),
 * which is NOT the same as "PSW", which is the low 8 bits of "PS" combined with "A" in the high byte.
 */
Debugger.REGS = [
    "B", "C", "D", "E", "H", "L", "M", "A", "BC", "DE", "HL", "SP", "PC", "PS", "PSW"
];

/*
 * Operand type descriptor masks and definitions
 */
Debugger.TYPE_SIZE  = 0x000F;       // size field
Debugger.TYPE_MODE  = 0x00F0;       // mode field
Debugger.TYPE_IREG  = 0x0F00;       // implied register field
Debugger.TYPE_OTHER = 0xF000;       // "other" field

/*
 * TYPE_SIZE values
 */
Debugger.TYPE_NONE  = 0x0000;       // (all other TYPE fields ignored)
Debugger.TYPE_BYTE  = 0x0001;       // byte, regardless of operand size
Debugger.TYPE_SBYTE = 0x0002;       // byte sign-extended to word
Debugger.TYPE_WORD  = 0x0003;       // word (16-bit value)

/*
 * TYPE_MODE values
 */
Debugger.TYPE_REG   = 0x0010;       // register
Debugger.TYPE_IMM   = 0x0020;       // immediate data
Debugger.TYPE_ADDR  = 0x0033;       // immediate (word) address
Debugger.TYPE_MEM   = 0x0040;       // memory reference
Debugger.TYPE_INT   = 0x0080;       // interrupt level encoded in instruction (bits 3-5)

/*
 * TYPE_IREG values, based on the REG_* constants.
 *
 * Note that TYPE_M isn't really a register, just an alternative form of TYPE_HL | TYPE_MEM.
 */
Debugger.TYPE_A     = (Debugger.REG_A  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_B     = (Debugger.REG_B  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_C     = (Debugger.REG_C  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_D     = (Debugger.REG_D  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_E     = (Debugger.REG_E  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_H     = (Debugger.REG_H  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_L     = (Debugger.REG_L  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_M     = (Debugger.REG_M  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE | Debugger.TYPE_MEM);
Debugger.TYPE_BC    = (Debugger.REG_BC << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_DE    = (Debugger.REG_DE << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_HL    = (Debugger.REG_HL << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_SP    = (Debugger.REG_SP << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_PC    = (Debugger.REG_PC << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_PSW   = (Debugger.REG_PSW<< 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);

/*
 * TYPE_OTHER bit definitions
 */
Debugger.TYPE_IN    = 0x1000;       // operand is input
Debugger.TYPE_OUT   = 0x2000;       // operand is output
Debugger.TYPE_BOTH  = (Debugger.TYPE_IN | Debugger.TYPE_OUT);
Debugger.TYPE_OPT   = 0x4000;       // optional operand (ie, normally omitted in 8080 assembly language)
Debugger.TYPE_UNDOC = 0x8000;       // opcode is an undocumented alternative encoding

/*
 * The aaOpDescs array is indexed by opcode, and each element is a sub-array (aOpDesc) that describes
 * the corresponding opcode. The sub-elements are as follows:
 *
 *      [0]: {number} of the opcode name (see INS.*)
 *      [1]: {number} containing the destination operand descriptor bit(s), if any
 *      [2]: {number} containing the source operand descriptor bit(s), if any
 *      [3]: {number} containing the occasional third operand descriptor bit(s), if any
 *
 * These sub-elements are all optional. If [0] is not present, the opcode is undefined; if [1] is not
 * present (or contains zero), the opcode has no (or only implied) operands; if [2] is not present, the
 * opcode has only a single operand.  And so on.
 *
 * Additional default rules:
 *
 *      1) If no TYPE_OTHER bits are specified for the first (destination) operand, TYPE_OUT is assumed;
 *      2) If no TYPE_OTHER bits are specified for the second (source) operand, TYPE_IN is assumed;
 *      3) If no size is specified for the second operand, the size is assumed to match the first operand.
 */
Debugger.aaOpDescs = [
/* 0x00 */  [Debugger.INS.NOP],
/* 0x01 */  [Debugger.INS.LXI,   Debugger.TYPE_BC,    Debugger.TYPE_IMM],
/* 0x02 */  [Debugger.INS.STAX,  Debugger.TYPE_BC   | Debugger.TYPE_MEM, Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x03 */  [Debugger.INS.INX,   Debugger.TYPE_BC],
/* 0x04 */  [Debugger.INS.INR,   Debugger.TYPE_B],
/* 0x05 */  [Debugger.INS.DCR,   Debugger.TYPE_B],
/* 0x06 */  [Debugger.INS.MVI,   Debugger.TYPE_B,     Debugger.TYPE_IMM],
/* 0x07 */  [Debugger.INS.RLC],
/* 0x08 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x09 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_BC],
/* 0x0A */  [Debugger.INS.LDAX,  Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_BC   | Debugger.TYPE_MEM],
/* 0x0B */  [Debugger.INS.DCX,   Debugger.TYPE_BC],
/* 0x0C */  [Debugger.INS.INR,   Debugger.TYPE_C],
/* 0x0D */  [Debugger.INS.DCR,   Debugger.TYPE_C],
/* 0x0E */  [Debugger.INS.MVI,   Debugger.TYPE_C,     Debugger.TYPE_IMM],
/* 0x0F */  [Debugger.INS.RRC],
/* 0x10 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x11 */  [Debugger.INS.LXI,   Debugger.TYPE_DE,    Debugger.TYPE_IMM],
/* 0x12 */  [Debugger.INS.STAX,  Debugger.TYPE_DE   | Debugger.TYPE_MEM, Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x13 */  [Debugger.INS.INX,   Debugger.TYPE_DE],
/* 0x14 */  [Debugger.INS.INR,   Debugger.TYPE_D],
/* 0x15 */  [Debugger.INS.DCR,   Debugger.TYPE_D],
/* 0x16 */  [Debugger.INS.MVI,   Debugger.TYPE_D,     Debugger.TYPE_IMM],
/* 0x17 */  [Debugger.INS.RAL],
/* 0x18 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x19 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_DE],
/* 0x1A */  [Debugger.INS.LDAX,  Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_DE   | Debugger.TYPE_MEM],
/* 0x1B */  [Debugger.INS.DCX,   Debugger.TYPE_DE],
/* 0x1C */  [Debugger.INS.INR,   Debugger.TYPE_E],
/* 0x1D */  [Debugger.INS.DCR,   Debugger.TYPE_E],
/* 0x1E */  [Debugger.INS.MVI,   Debugger.TYPE_E,     Debugger.TYPE_IMM],
/* 0x1F */  [Debugger.INS.RAR],
/* 0x20 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x21 */  [Debugger.INS.LXI,   Debugger.TYPE_HL,    Debugger.TYPE_IMM],
/* 0x22 */  [Debugger.INS.SHLD,  Debugger.TYPE_ADDR | Debugger.TYPE_MEM, Debugger.TYPE_HL   | Debugger.TYPE_OPT],
/* 0x23 */  [Debugger.INS.INX,   Debugger.TYPE_HL],
/* 0x24 */  [Debugger.INS.INR,   Debugger.TYPE_H],
/* 0x25 */  [Debugger.INS.DCR,   Debugger.TYPE_H],
/* 0x26 */  [Debugger.INS.MVI,   Debugger.TYPE_H,     Debugger.TYPE_IMM],
/* 0x27 */  [Debugger.INS.DAA],
/* 0x28 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x29 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_HL],
/* 0x2A */  [Debugger.INS.LHLD,  Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_ADDR | Debugger.TYPE_MEM],
/* 0x2B */  [Debugger.INS.DCX,   Debugger.TYPE_HL],
/* 0x2C */  [Debugger.INS.INR,   Debugger.TYPE_L],
/* 0x2D */  [Debugger.INS.DCR,   Debugger.TYPE_L],
/* 0x2E */  [Debugger.INS.MVI,   Debugger.TYPE_L,     Debugger.TYPE_IMM],
/* 0x2F */  [Debugger.INS.CMA,   Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x30 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x31 */  [Debugger.INS.LXI,   Debugger.TYPE_SP,    Debugger.TYPE_IMM],
/* 0x32 */  [Debugger.INS.STA,   Debugger.TYPE_ADDR | Debugger.TYPE_MEM, Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x33 */  [Debugger.INS.INX,   Debugger.TYPE_SP],
/* 0x34 */  [Debugger.INS.INR,   Debugger.TYPE_M],
/* 0x35 */  [Debugger.INS.DCR,   Debugger.TYPE_M],
/* 0x36 */  [Debugger.INS.MVI,   Debugger.TYPE_M,     Debugger.TYPE_IMM],
/* 0x37 */  [Debugger.INS.STC],
/* 0x38 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x39 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_SP],
/* 0x3A */  [Debugger.INS.LDA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_ADDR | Debugger.TYPE_MEM],
/* 0x3B */  [Debugger.INS.DCX,   Debugger.TYPE_SP],
/* 0x3C */  [Debugger.INS.INR,   Debugger.TYPE_A],
/* 0x3D */  [Debugger.INS.DCR,   Debugger.TYPE_A],
/* 0x3E */  [Debugger.INS.MVI,   Debugger.TYPE_A,     Debugger.TYPE_IMM],
/* 0x3F */  [Debugger.INS.CMC],
/* 0x40 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_B],
/* 0x41 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_C],
/* 0x42 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_D],
/* 0x43 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_E],
/* 0x44 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_H],
/* 0x45 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_L],
/* 0x46 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_M],
/* 0x47 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_A],
/* 0x48 */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_B],
/* 0x49 */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_C],
/* 0x4A */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_D],
/* 0x4B */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_E],
/* 0x4C */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_H],
/* 0x4D */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_L],
/* 0x4E */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_M],
/* 0x4F */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_A],
/* 0x50 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_B],
/* 0x51 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_C],
/* 0x52 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_D],
/* 0x53 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_E],
/* 0x54 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_H],
/* 0x55 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_L],
/* 0x56 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_M],
/* 0x57 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_A],
/* 0x58 */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_B],
/* 0x59 */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_C],
/* 0x5A */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_D],
/* 0x5B */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_E],
/* 0x5C */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_H],
/* 0x5D */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_L],
/* 0x5E */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_M],
/* 0x5F */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_A],
/* 0x60 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_B],
/* 0x61 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_C],
/* 0x62 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_D],
/* 0x63 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_E],
/* 0x64 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_H],
/* 0x65 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_L],
/* 0x66 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_M],
/* 0x67 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_A],
/* 0x68 */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_B],
/* 0x69 */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_C],
/* 0x6A */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_D],
/* 0x6B */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_E],
/* 0x6C */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_H],
/* 0x6D */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_L],
/* 0x6E */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_M],
/* 0x6F */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_A],
/* 0x70 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_B],
/* 0x71 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_C],
/* 0x72 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_D],
/* 0x73 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_E],
/* 0x74 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_H],
/* 0x75 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_L],
/* 0x76 */  [Debugger.INS.HLT],
/* 0x77 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_A],
/* 0x78 */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_B],
/* 0x79 */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_C],
/* 0x7A */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_D],
/* 0x7B */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_E],
/* 0x7C */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_H],
/* 0x7D */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_L],
/* 0x7E */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_M],
/* 0x7F */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_A],
/* 0x80 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x81 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x82 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x83 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x84 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x85 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x86 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x87 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0x88 */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x89 */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x8A */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x8B */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x8C */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x8D */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x8E */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x8F */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0x90 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x91 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x92 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x93 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x94 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x95 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x96 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x97 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0x98 */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x99 */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x9A */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x9B */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x9C */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x9D */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x9E */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x9F */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xA0 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xA1 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xA2 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xA3 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xA4 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xA5 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xA6 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xA7 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xA8 */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xA9 */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xAA */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xAB */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xAC */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xAD */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xAE */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xAF */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xB0 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xB1 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xB2 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xB3 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xB4 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xB5 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xB6 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xB7 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xB8 */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xB9 */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xBA */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xBB */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xBC */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xBD */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xBE */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xBF */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xC0 */  [Debugger.INS.RNZ],
/* 0xC1 */  [Debugger.INS.POP,   Debugger.TYPE_BC],
/* 0xC2 */  [Debugger.INS.JNZ,   Debugger.TYPE_ADDR],
/* 0xC3 */  [Debugger.INS.JMP,   Debugger.TYPE_ADDR],
/* 0xC4 */  [Debugger.INS.CNZ,   Debugger.TYPE_ADDR],
/* 0xC5 */  [Debugger.INS.PUSH,  Debugger.TYPE_BC],
/* 0xC6 */  [Debugger.INS.ADI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xC7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xC8 */  [Debugger.INS.RZ],
/* 0xC9 */  [Debugger.INS.RET],
/* 0xCA */  [Debugger.INS.JZ,    Debugger.TYPE_ADDR],
/* 0xCB */  [Debugger.INS.JMP,   Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xCC */  [Debugger.INS.CZ,    Debugger.TYPE_ADDR],
/* 0xCD */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR],
/* 0xCE */  [Debugger.INS.ACI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xCF */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xD0 */  [Debugger.INS.RNC],
/* 0xD1 */  [Debugger.INS.POP,   Debugger.TYPE_DE],
/* 0xD2 */  [Debugger.INS.JNC,   Debugger.TYPE_ADDR],
/* 0xD3 */  [Debugger.INS.OUT,   Debugger.TYPE_IMM  | Debugger.TYPE_BYTE,Debugger.TYPE_A   | Debugger.TYPE_OPT],
/* 0xD4 */  [Debugger.INS.CNC,   Debugger.TYPE_ADDR],
/* 0xD5 */  [Debugger.INS.PUSH,  Debugger.TYPE_DE],
/* 0xD6 */  [Debugger.INS.SUI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xD7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xD8 */  [Debugger.INS.RC],
/* 0xD9 */  [Debugger.INS.RET,   Debugger.TYPE_UNDOC],
/* 0xDA */  [Debugger.INS.JC,    Debugger.TYPE_ADDR],
/* 0xDB */  [Debugger.INS.IN,    Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xDC */  [Debugger.INS.CC,    Debugger.TYPE_ADDR],
/* 0xDD */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xDE */  [Debugger.INS.SBI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xDF */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xE0 */  [Debugger.INS.RPO],
/* 0xE1 */  [Debugger.INS.POP,   Debugger.TYPE_HL],
/* 0xE2 */  [Debugger.INS.JPO,   Debugger.TYPE_ADDR],
/* 0xE3 */  [Debugger.INS.XTHL,  Debugger.TYPE_SP   | Debugger.TYPE_MEM| Debugger.TYPE_OPT,  Debugger.TYPE_HL | Debugger.TYPE_OPT],
/* 0xE4 */  [Debugger.INS.CPO,   Debugger.TYPE_ADDR],
/* 0xE5 */  [Debugger.INS.PUSH,  Debugger.TYPE_HL],
/* 0xE6 */  [Debugger.INS.ANI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xE7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xE8 */  [Debugger.INS.RPE],
/* 0xE9 */  [Debugger.INS.PCHL,  Debugger.TYPE_HL],
/* 0xEA */  [Debugger.INS.JPE,   Debugger.TYPE_ADDR],
/* 0xEB */  [Debugger.INS.XCHG,  Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_DE  | Debugger.TYPE_OPT],
/* 0xEC */  [Debugger.INS.CPE,   Debugger.TYPE_ADDR],
/* 0xED */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xEE */  [Debugger.INS.XRI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xEF */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xF0 */  [Debugger.INS.RP],
/* 0xF1 */  [Debugger.INS.POP,   Debugger.TYPE_PSW],
/* 0xF2 */  [Debugger.INS.JP,    Debugger.TYPE_ADDR],
/* 0xF3 */  [Debugger.INS.DI],
/* 0xF4 */  [Debugger.INS.CP,    Debugger.TYPE_ADDR],
/* 0xF5 */  [Debugger.INS.PUSH,  Debugger.TYPE_PSW],
/* 0xF6 */  [Debugger.INS.ORI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xF7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xF8 */  [Debugger.INS.RM],
/* 0xF9 */  [Debugger.INS.SPHL,  Debugger.TYPE_SP   | Debugger.TYPE_OPT, Debugger.TYPE_HL  | Debugger.TYPE_OPT],
/* 0xFA */  [Debugger.INS.JM,    Debugger.TYPE_ADDR],
/* 0xFB */  [Debugger.INS.EI],
/* 0xFC */  [Debugger.INS.CM,    Debugger.TYPE_ADDR],
/* 0xFD */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xFE */  [Debugger.INS.CPI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xFF */  [Debugger.INS.RST,   Debugger.TYPE_INT]
];

Defs.CLASSES["Debugger"] = Debugger;
