/**
 * @fileoverview Implements the PCjs Debugger component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-21
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

if (DEBUGGER) {
    if (typeof module !== 'undefined') {
        var str         = require("../../shared/lib/strlib");
        var usr         = require("../../shared/lib/usrlib");
        var web         = require("../../shared/lib/weblib");
        var Component   = require("../../shared/lib/component");
        var Bus         = require("./bus");
        var State       = require("./state");
        var CPU         = require("./cpu");
        var X86         = require("./x86");
        var X86Seg      = require("./x86seg");
    }
}

/**
 * Debugger(parmsDbg)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsDbg
 *
 * The Debugger component supports the following optional (parmsDbg) properties:
 *
 *      commands: string containing zero or more commands, separated by ';'
 *
 *      messages: string containing zero or more message categories to enable;
 *      multiple categories must be separated by '|' or ';'.  Parsed by initMessages().
 *
 * The Debugger component is an optional component that implements a variety of user
 * commands for controlling the CPU, dumping and editing memory, etc.
 */
function Debugger(parmsDbg)
{
    if (DEBUGGER) {

        Component.call(this, "Debugger", parmsDbg, Debugger);

        /*
         * These keep track of instruction activity, but only when tracing or when Debugger checks
         * have been enabled (eg, one or more breakpoints have been set).
         *
         * They are zeroed by the reset() notification handler.  cInstructions is advanced by
         * stepCPU() and checkInstruction() calls.  nCycles is updated by every stepCPU() or stop()
         * call and simply represents the number of cycles performed by the last run of instructions.
         */
        this.nCycles = -1;
        this.cInstructions = -1;

        /*
         * The default numder of hex characters in a physical address; updated by initBus().
         */
        this.cchAddr = 5;

        /*
         * Most commands that require an address call parseAddr(), which defaults to aAddrNextCode
         * or aAddrNextData when no address has been given.  doDump() and doUnassemble(), in turn,
         * update aAddrNextData and aAddrNextCode, respectively, when they're done.
         *
         * The format of all aAddr variables is [off, seg, addr], where seg:off is the segmented
         * address and addr is the corresponding physical address (if known).  For certain segmented
         * addresses (eg, breakpoint addresses), we pre-compute the physical address and save that
         * in aAddr[2], so that the breakpoint will still operate as intended even if the mode changes
         * later (eg, from real-mode to protected-mode).
         *
         * Finally, for TEMPORARY breakpoint addresses, we set aAddr[3] to true, so that they can be
         * automatically cleared when they're hit.
         */
        this.aAddrNextCode = [0, 0];
        this.aAddrNextData = [0, 0];

        /*
         * When Enter is pressed on an empty input buffer, we default to the previous command,
         * which is preserved here.
         */
        this.prevCmd = null;

        /*
         * fAssemble is true when "assemble mode" is active, false when not.
         */
        this.fAssemble = false;
        this.aAddrAssemble = [0, 0];

        /*
         * aSymbolTable is an array of 4-element arrays, one per ROM or other chunk of address space.
         * Each 4-element arrays contains:
         *
         *      [0]: addr
         *      [1]: size
         *      [2]: aSymbols
         *      [3]: aOffsetPairs
         *
         * See addSymbols() for more details, since that's how callers add sets of symbols to the table.
         */
        this.aSymbolTable = [];

        /*
         * clearBreakpoints() initializes the breakpoints lists: aBreakExec is a list of addresses
         * to halt on whenever attempting to execute an instruction at the corresponding address,
         * and aBreakRead and aBreakWrite are lists of addresses to halt on whenever a read or write,
         * respectively, occurs at the corresponding address.
         */
        this.clearBreakpoints();

        /*
         * Execution history is allocated by initHistory() whenever checksEnabled() conditions change.
         * Execution history is updated whenever the CPU calls checkInstruction(), which will happen only
         * when checksEnabled() returns true (eg, whenever one or more breakpoints have been set).
         * This ensures that, by default, the CPU runs as fast as possible.
         */
        this.initHistory();

        /*
         * Initialize Debugger message support
         */
        this.initMessages(parmsDbg['messages']);

        /*
         * This object is filled in by updateRegValues() whenever we need a fresh snapshot.
         */
        this.aRegValues = {
            "AL":0, "CL":0, "DL":0, "BL":0, "AH":0, "CH":0, "DH":0, "BH":0,
            "AX":0, "CX":0, "DX":0, "BX":0, "SP":0, "BP":0, "SI":0, "DI":0,
            "ES":0, "CS":0, "SS":0, "DS":0, "IP":0
        };

        /*
         * The instruction trace buffer is a lightweight logging mechanism with minimal impact
         * on the browser (unlike printing to either console.log or an HTML control, which can
         * make the browser unusable if printing is too frequent).  The Debugger's info command
         * ("n dump [#]") dumps this buffer.  Note that dumping too much at once can also bog
         * things down, but by that point, you've presumably already captured the info you need
         * and are willing to wait.
         */
        if (DEBUG) this.traceInit();

        this.sInitCommands = parmsDbg['commands'];

        /*
         * Make it easier to access Debugger commands from an external REPL (eg, the WebStorm
         * "live" console window); eg:
         *
         *      $('r')
         */
        var dbg = this;
        if (window && window['$'] === undefined) {
            window['$'] = function(s) { return dbg.doCommand(s); };
        }

    }   // endif DEBUGGER
}

/*
 * Debugger message constants must always be defined, even when DEBUGGER is false, lest the Closure Compiler complain
 */
Debugger.MESSAGE = {
    CPU:        0x00000001,
    SEG:        0x00000002,
    DESC:       0x00000004,
    TSS:        0x00000008,
    INT:        0x00000010,
    FAULT:      0x00000020,
    MEM:        0x00000040,
    PORT:       0x00000080,
    DMA:        0x00000100,
    PIC:        0x00000200,
    TIMER:      0x00000400,
    CMOS:       0x00000800,
    RTC:        0x00001000,
    C8042:      0x00002000,
    CHIPSET:    0x00004000,
    KBD:        0x00008000,
    KEYS:       0x00010000,
    VIDEO:      0x00020000,
    FDC:        0x00040000,
    HDC:        0x00080000,
    DISK:       0x00100000,
    SERIAL:     0x00200000,
    SPEAKER:    0x00400000,
    STATE:      0x00800000,
    MOUSE:      0x01000000,
    COMPUTER:   0x02000000,
    LOG:        0x04000000,
    DOS:        0x08000000,
    HALT:       0x80000000
};

if (DEBUGGER) {

    Component.subclass(Component, Debugger);

    /*
     * Information regarding interrupts of interest (used by messageInt() and others)
     */
    Debugger.INT = {
        VIDEO:      0x10,
        DISK:       0x13,
        CASSETTE:   0x15,
        KBD:        0x16,
        RTC:        0x1a,
        TIMER_TICK: 0x1c,
        DOS:        0x21,
        MOUSE:      0x33
    };

    Debugger.INT_MESSAGE = {
        0x10:       Debugger.MESSAGE.VIDEO,
        0x13:       Debugger.MESSAGE.FDC,
        0x15:       Debugger.MESSAGE.CHIPSET,
        0x16:       Debugger.MESSAGE.KBD,
     // 0x1a:       Debugger.MESSAGE.RTC,       // ChipSet contains its own specialized messageInt() handler for the RTC
        0x1c:       Debugger.MESSAGE.TIMER,
        0x21:       Debugger.MESSAGE.DOS,
        0x33:       Debugger.MESSAGE.MOUSE
    };

    Debugger.aCommands = {
        '?':     "help",
        'a [#]': "assemble",
        'b [#]': "breakpoint",
        'c':     "clear output",
        'd [#]': "dump memory",
        'e [#]': "edit memory",
        'f':     "frequencies",
        'g [#]': "go [to #]",
        'h [#]': "halt/history",
        'i [#]': "input port #",
        'l':     "load sector(s)",
        'm':     "messages",
        'o [#]': "output port #",
        'p':     "step over",
        'r':     "dump/edit registers",
        't [#]': "step instruction(s)",
        'u [#]': "unassemble",
        'x':     "execution options",
        'reset': "reset computer",
        'ver':   "display version"
    };

    /*
     * Address types for parseAddr(), to help choose between aAddrNextCode and aAddrNextData
     */
    Debugger.ADDR_CODE = 1;
    Debugger.ADDR_DATA = 2;

    /*
     * Instruction ordinals (indexes into Debugger.asIns)
     *
     * (And yes, there are a number of non-8086/8088 instructions in the following tables;
     * if I decide to expand CPU support, even if it's just to broaden real-mode support on a simulated
     * 286 or 386, then I might as well leave some of that support in place, since the impact is minimal).
     */
    Debugger.INS = {
        NONE:   0,   AAA:    1,   AAD:    2,   AAM:    3,   AAS:    4,   ADC:    5,   ADD:    6,   AND:    7,
        ARPL:   8,   ASIZE:  9,   BOUND:  10,  BSF:    11,  BSR:    12,  BT:     13,  BTC:    14,  BTR:    15,
        BTS:    16,  CALL:   17,  CBW:    18,  CLC:    19,  CLD:    20,  CLI:    21,  CLTS:   22,  CMC:    23,
        CMP:    24,  CMPSB:  25,  CMPSW:  26,  CS:     27,  CWD:    28,  DAA:    29,  DAS:    30,  DEC:    31,
        DIV:    32,  DS:     33,  ENTER:  34,  ES:     35,  ESC:    36,  FADD:   37,  FBLD:   38,  FBSTP:  39,
        FCOM:   40,  FCOMP:  41,  FDIV:   42,  FDIVR:  43,  FIADD:  44,  FICOM:  45,  FICOMP: 46,  FIDIV:  47,
        FIDIVR: 48,  FILD:   49,  FIMUL:  50,  FIST:   51,  FISTP:  52,  FISUB:  53,  FISUBR: 54,  FLD:    55,
        FLDCW:  56,  FLDENV: 57,  FMUL:   58,  FNSAVE: 59,  FNSTCW: 60,  FNSTENV:61,  FNSTSW: 62,  FRSTOR: 63,
        FS:     64,  FST:    65,  FSTP:   66,  FSUB:   67,  FSUBR:  68,  GBP:    69,  GS:     70,  HLT:    71,
        IDIV:   72,  IMUL:   73,  IN:     74,  INC:    75,  INS:    76,  INT:    77,  INT3:   78,  INTO:   79,
        IRET:   80,  JBE:    81,  JC:     82,  JCXZ:   83,  JG:     84,  JGE:    85,  JL:     86,  JLE:    87,
        JMP:    88,  JNBE:   89,  JNC:    90,  JNO:    91,  JNP:    92,  JNS:    93,  JNZ:    94,  JO:     95,
        JP:     96,  JS:     97,  JZ:     98,  LAHF:   99,  LAR:    100, LDS:    101, LEA:    102, LEAVE:  103,
        LES:    104, LFS:    105, LGDT:   106, LGS:    107, LIDT:   108, LLDT:   109, LMSW:   110, LOADALL:111,
        LOCK:   112, LODSB:  113, LODSW:  114, LOOP:   115, LOOPNZ: 116, LOOPZ:  117, LSL:    118, LSS:    119,
        LTR:    120, MOV:    121, MOVSB:  122, MOVSW:  123, MOVSX:  124, MOVZX:  125, MUL:    126, NEG:    127,
        NOP:    128, NOT:    129, OR:     130, OSIZE:  131, OUT:    132, OUTS:   133, POP:    134, POPA:   135,
        POPF:   136, PUSH:   137, PUSHA:  138, PUSHF:  139, RCL:    140, RCR:    141, REPNZ:  142, REPZ:   143,
        RET:    144, RETF:   145, ROL:    146, ROR:    147, SAHF:   148, SAR:    149, SBB:    150, SCASB:  151,
        SCASW:  152, SETBE:  153, SETC:   154, SETG:   155, SETGE:  156, SETL:   157, SETLE:  158, SETNBE: 159,
        SETNC:  160, SETNO:  161, SETNP:  162, SETNS:  163, SETNZ:  164, SETO:   165, SETP:   166, SETS:   167,
        SETZ:   168, SGDT:   169, SHL:    170, SHLD:   171, SHR:    172, SHRD:   173, SIDT:   174, SLDT:   175,
        SMSW:   176, SS:     177, STC:    178, STD:    179, STI:    180, STOSB:  181, STOSW:  182, STR:    183,
        SUB:    184, TEST:   185, VERR:   186, VERW:   187, WAIT:   188, XCHG:   189, XLAT:   190, XOR:    191,
        GRP1B:  192, GRP1W:  193, GRP1SW: 194, GRP2B:  195, GRP2W:  196, GRP2B1: 197, GRP2W1: 198, GRP2BC: 199,
        GRP2WC: 200, GRP3B:  201, GRP3W:  202, GRP4B:  203, GRP4W:  204, OP0F:   205, GRP6:   206, GRP7:   207
    };

    /*
     * Instruction names, indexed by instruction ordinal (above)
     */
    Debugger.asIns = [
        "DB",     "AAA",    "AAD",    "AAM",    "AAS",    "ADC",    "ADD",    "AND",
        "ARPL",   "AS:",    "BOUND",  "BSF",    "BSR",    "BT",     "BTC",    "BTR",
        "BTS",    "CALL",   "CBW",    "CLC",    "CLD",    "CLI",    "CLTS",   "CMC",
        "CMP",    "CMPSB",  "CMPSW",  "CS:",    "CWD",    "DAA",    "DAS",    "DEC",
        "DIV",    "DS:",    "ENTER",  "ES:",    "ESC",    "FADD",   "FBLD",   "FBSTP",
        "FCOM",   "FCOMP",  "FDIV",   "FDIVR",  "FIADD",  "FICOM",  "FICOMP", "FIDIV",
        "FIDIVR", "FILD",   "FIMUL",  "FIST",   "FISTP",  "FISUB",  "FISUBR", "FLD",
        "FLDCW",  "FLDENV", "FMUL",   "FNSAVE", "FNSTCW", "FNSTENV","FNSTSW", "FRSTOR",
        "FS:",    "FST",    "FSTP",   "FSUB",   "FSUBR",  "GBP",    "GS:",    "HLT",
        "IDIV",   "IMUL",   "IN",     "INC",    "INS",    "INT",    "INT3",   "INTO",
        "IRET",   "JBE",    "JC",     "JCXZ",   "JG",     "JGE",    "JL",     "JLE",
        "JMP",    "JNBE",   "JNC",    "JNO",    "JNP",    "JNS",    "JNZ",    "JO",
        "JP",     "JS",     "JZ",     "LAHF",   "LAR",    "LDS",    "LEA",    "LEAVE",
        "LES",    "LFS",    "LGDT",   "LGS",    "LIDT",   "LLDT",   "LMSW",   "LOADALL",
        "LOCK",   "LODSB",  "LODSW",  "LOOP",   "LOOPNZ", "LOOPZ",  "LSL",    "LSS",
        "LTR",    "MOV",    "MOVSB",  "MOVSW",  "MOVSX",  "MOVZX",  "MUL",    "NEG",
        "NOP",    "NOT",    "OR",     "OS:",    "OUT",    "OUTS",   "POP",    "POPA",
        "POPF",   "PUSH",   "PUSHA",  "PUSHF",  "RCL",    "RCR",    "REPNZ",  "REPZ",
        "RET",    "RETF",   "ROL",    "ROR",    "SAHF",   "SAR",    "SBB",    "SCASB",
        "SCASW",  "SETBE",  "SETC",   "SETG",   "SETGE",  "SETL",   "SETLE",  "SETNBE",
        "SETNC",  "SETNO",  "SETNP",  "SETNS",  "SETNZ",  "SETO",   "SETP",   "SETS",
        "SETZ",   "SGDT",   "SHL",    "SHLD",   "SHR",    "SHRD",   "SIDT",   "SLDT",
        "SMSW",   "SS:",    "STC",    "STD",    "STI",    "STOSB",  "STOSW",  "STR",
        "SUB",    "TEST",   "VERR",   "VERW",   "WAIT",   "XCHG",   "XLAT",   "XOR"
    ];

    Debugger.CPU_86 = 0;
    Debugger.CPU_186 = 1;
    Debugger.CPU_286 = 2;
    Debugger.CPU_386 = 3;
    Debugger.CPU = Debugger.CPU_86;     // current CPU definition

    /*
     * ModRM masks and definitions
     */
    Debugger.REG_AL = 0x00;             // bits 0-2 are standard Reg encodings
    Debugger.REG_CL = 0x01;
    Debugger.REG_DL = 0x02;
    Debugger.REG_BL = 0x03;
    Debugger.REG_AH = 0x04;
    Debugger.REG_CH = 0x05;
    Debugger.REG_DH = 0x06;
    Debugger.REG_BH = 0x07;
    Debugger.REG_AX = 0x08;             // the rest of these encodings are non-standard (internal only)
    Debugger.REG_CX = 0x09;
    Debugger.REG_DX = 0x0A;
    Debugger.REG_BX = 0x0B;
    Debugger.REG_SP = 0x0C;
    Debugger.REG_BP = 0x0D;
    Debugger.REG_SI = 0x0E;
    Debugger.REG_DI = 0x0F;

    Debugger.asRegs = [
        "AL", "CL", "DL", "BL", "AH", "CH", "DH", "BH",
        "AX", "CX", "DX", "BX", "SP", "BP", "SI", "DI",
        "ES", "CS", "SS", "DS", "IP"
    ];

    Debugger.REG_ES         = 0x00;     // bits 0-1 are standard SegReg encodings
    Debugger.REG_CS         = 0x01;
    Debugger.REG_SS         = 0x02;
    Debugger.REG_DS         = 0x03;
    Debugger.REG_FS         = 0x04;
    Debugger.REG_GS         = 0x05;
    Debugger.REG_UNKNOWN    = 0x00;

    Debugger.MOD_NODISP     = 0x00;     // use RM below, no displacement
    Debugger.MOD_DISP8      = 0x01;     // use RM below + 8-bit displacement
    Debugger.MOD_DISP16     = 0x02;     // use RM below + 16-bit displacement
    Debugger.MOD_REGISTER   = 0x03;     // use REG above

    Debugger.RM_BXSI        = 0x00;
    Debugger.RM_BXDI        = 0x01;
    Debugger.RM_BPSI        = 0x02;
    Debugger.RM_BPDI        = 0x03;
    Debugger.RM_SI          = 0x04;
    Debugger.RM_DI          = 0x05;
    Debugger.RM_BP          = 0x06;
    Debugger.RM_IMMOFF      = Debugger.RM_BP;       // only if MOD_NODISP
    Debugger.RM_BX          = 0x07;

    Debugger.asRM = [
        "BX+SI", "BX+DI", "BP+SI", "BP+DI", "SI", "DI", "BP", "BX"
    ];

    /*
     * Operand type descriptor masks and definitions
     *
     * Note that the letters in () in the comments refer to Intel's
     * nomenclature used in Appendix A of the 80386 Programmers Reference Manual.
     */
    Debugger.TYPE_SIZE      = 0x000F;   // size field
    Debugger.TYPE_MODE      = 0x00F0;   // mode field
    Debugger.TYPE_IREG      = 0x0F00;   // implied register field
    Debugger.TYPE_OTHER     = 0xF000;   // "other" field

    /*
     * TYPE_SIZE values.  Note that some of the values (eg, TYPE_WORDIB
     * and TYPE_WORDIW) imply the presence of a third operand, for those
     * weird cases....
     */
    Debugger.TYPE_NONE      = 0x0000;   //     (all other TYPE fields ignored)
    Debugger.TYPE_BYTE      = 0x0001;   // (b) byte, regardless of operand size
    Debugger.TYPE_SBYTE     = 0x0002;   //     byte sign-extended to word
    Debugger.TYPE_WORD      = 0x0003;   // (w) word, regardless...
    Debugger.TYPE_VWORD     = 0x0004;   // (v) word or double-word, depending...
    Debugger.TYPE_DWORD     = 0x0005;   // (d) double-word, regardless...
    Debugger.TYPE_FARP      = 0x0006;   // (p) 32-bit or 48-bit pointer, depending
    Debugger.TYPE_2WORDD    = 0x0007;   // (a) two memory operands (BOUND only)
    Debugger.TYPE_DESC      = 0x0008;   // (s) 6 byte pseudo-descriptor
    Debugger.TYPE_WORDIB    = 0x0009;   //     two source operands (eg, IMUL)
    Debugger.TYPE_WORDIW    = 0x000A;   //     two source operands (eg, IMUL)
    Debugger.TYPE_PREFIX    = 0x000F;   //     (treat similarly to TYPE_NONE)

    /*
     * TYPE_MODE values.  Note that order is somewhat important, as all values implying
     * the presence of a ModRM byte are assumed to be >= TYPE_MODRM.
     */
    Debugger.TYPE_IMM       = 0x0000;   // (I) immediate data
    Debugger.TYPE_ONE       = 0x0010;   //     implicit 1 (eg, shifts/rotates)
    Debugger.TYPE_IMMOFF    = 0x0020;   // (A) immediate offset
    Debugger.TYPE_IMMREL    = 0x0030;   // (J) immediate relative
    Debugger.TYPE_DSSI      = 0x0040;   // (X) memory addressed by DS:SI
    Debugger.TYPE_ESDI      = 0x0050;   // (Y) memory addressed by ES:DI
    Debugger.TYPE_IMPREG    = 0x0060;   //     implicit register in TYPE_IREG
    Debugger.TYPE_IMPSEG    = 0x0070;   //     implicit seg. register in TYPE_IREG
    Debugger.TYPE_MODRM     = 0x0080;   // (E) standard ModRM decoding
    Debugger.TYPE_MEM       = 0x0090;   // (M) ModRM refers to memory only
    Debugger.TYPE_REG       = 0x00A0;   // (G) standard Reg decoding
    Debugger.TYPE_SEGREG    = 0x00B0;   // (S) Reg selects segment register
    Debugger.TYPE_MODREG    = 0x00C0;   // (R) Mod refers to register only
    Debugger.TYPE_CTLREG    = 0x00D0;   // (C) Reg selects control register
    Debugger.TYPE_DBGREG    = 0x00E0;   // (D) Reg selects debug register
    Debugger.TYPE_TSTREG    = 0x00F0;   // (T) Reg selects test register

    /*
     * TYPE_IREG values, based on the REG_* constants.
     * For convenience, they include TYPE_IMPREG or TYPE_IMPSEG as appropriate.
     */
    Debugger.TYPE_AL = (Debugger.REG_AL << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_CL = (Debugger.REG_CL << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_DL = (Debugger.REG_DL << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_BL = (Debugger.REG_BL << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_AH = (Debugger.REG_AH << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_CH = (Debugger.REG_CH << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_DH = (Debugger.REG_DH << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_BH = (Debugger.REG_BH << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_BYTE);
    Debugger.TYPE_AX = (Debugger.REG_AX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_CX = (Debugger.REG_CX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_DX = (Debugger.REG_DX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_BX = (Debugger.REG_BX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_SP = (Debugger.REG_SP << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_BP = (Debugger.REG_BP << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_SI = (Debugger.REG_SI << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_DI = (Debugger.REG_DI << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_WORD);
    Debugger.TYPE_ES = (Debugger.REG_ES << 8 | Debugger.TYPE_IMPSEG | Debugger.TYPE_WORD);
    Debugger.TYPE_CS = (Debugger.REG_CS << 8 | Debugger.TYPE_IMPSEG | Debugger.TYPE_WORD);
    Debugger.TYPE_SS = (Debugger.REG_SS << 8 | Debugger.TYPE_IMPSEG | Debugger.TYPE_WORD);
    Debugger.TYPE_DS = (Debugger.REG_DS << 8 | Debugger.TYPE_IMPSEG | Debugger.TYPE_WORD);
    Debugger.TYPE_FS = (Debugger.REG_FS << 8 | Debugger.TYPE_IMPSEG | Debugger.TYPE_WORD);
    Debugger.TYPE_GS = (Debugger.REG_GS << 8 | Debugger.TYPE_IMPSEG | Debugger.TYPE_WORD);

    /*
     * TYPE_OTHER bit definitions
     */
    Debugger.TYPE_IN    = 0x1000;        // operand is input
    Debugger.TYPE_OUT   = 0x2000;        // operand is output
    Debugger.TYPE_BOTH  = (Debugger.TYPE_IN | Debugger.TYPE_OUT);
    Debugger.TYPE_86    = (Debugger.CPU_86 << 14);
    Debugger.TYPE_186   = (Debugger.CPU_186 << 14);
    Debugger.TYPE_286   = (Debugger.CPU_286 << 14);
    Debugger.TYPE_386   = (Debugger.CPU_386 << 14);

    /*
     * Message categories supported by the messageEnabled() function and other assorted message
     * functions. Each category has a corresponding bit value that can be combined (ie, OR'ed) as
     * needed.  The Debugger's message command ("m") is used to turn message categories on and off,
     * like so:
     *
     *      m port on
     *      m port off
     *      ...
     *
     * NOTE: The order of these categories can be rearranged, alphabetized, etc, as desired; just be
     * aware that changing the bit values could break saved Debugger states (not a huge concern, just
     * something to be aware of).
     */
    Debugger.MESSAGES = {
        "cpu":      Debugger.MESSAGE.CPU,
        "seg":      Debugger.MESSAGE.SEG,
        "desc":     Debugger.MESSAGE.DESC,
        "tss":      Debugger.MESSAGE.TSS,
        "int":      Debugger.MESSAGE.INT,
        "fault":    Debugger.MESSAGE.FAULT,
        "mem":      Debugger.MESSAGE.MEM,
        "port":     Debugger.MESSAGE.PORT,
        "dma":      Debugger.MESSAGE.DMA,
        "pic":      Debugger.MESSAGE.PIC,
        "timer":    Debugger.MESSAGE.TIMER,
        "cmos":     Debugger.MESSAGE.CMOS,
        "rtc":      Debugger.MESSAGE.RTC,
        "8042":     Debugger.MESSAGE.C8042,
        "chipset":  Debugger.MESSAGE.CHIPSET,   // ie, anything else in ChipSet besides DMA, PIC, TIMER, CMOS, RTC and 8042
        "kbd":      Debugger.MESSAGE.KBD,
        "keys":     Debugger.MESSAGE.KEYS,
        "video":    Debugger.MESSAGE.VIDEO,
        "fdc":      Debugger.MESSAGE.FDC,
        "hdc":      Debugger.MESSAGE.HDC,
        "disk":     Debugger.MESSAGE.DISK,
        "serial":   Debugger.MESSAGE.SERIAL,
        "speaker":  Debugger.MESSAGE.SPEAKER,
        "state":    Debugger.MESSAGE.STATE,
        "mouse":    Debugger.MESSAGE.MOUSE,
        "computer": Debugger.MESSAGE.COMPUTER,
        "log":      Debugger.MESSAGE.LOG,
        "dos":      Debugger.MESSAGE.DOS,
        /*
         * Now we turn to message actions rather than message types; for example, setting "halt"
         * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
         */
        "halt":     Debugger.MESSAGE.HALT
    };

    /*
     * Instruction trace categories supported by the traceLog() function.  The Debugger's info
     * command ("n") is used to turn trace categories on and off, like so:
     *
     *      n shl on
     *      n shl off
     *      ...
     *
     * Note that there are usually multiple entries for each category (one for each supported operand size);
     * all matching entries are enabled or disabled as a group.
     */
    Debugger.TRACE = {
        ROLB:   {ins: Debugger.INS.ROL,  size: 8},
        ROLW:   {ins: Debugger.INS.ROL,  size: 16},
        RORB:   {ins: Debugger.INS.ROR,  size: 8},
        RORW:   {ins: Debugger.INS.ROR,  size: 16},
        RCLB:   {ins: Debugger.INS.RCL,  size: 8},
        RCLW:   {ins: Debugger.INS.RCL,  size: 16},
        RCRB:   {ins: Debugger.INS.RCR,  size: 8},
        RCRW:   {ins: Debugger.INS.RCR,  size: 16},
        SHLB:   {ins: Debugger.INS.SHL,  size: 8},
        SHLW:   {ins: Debugger.INS.SHL,  size: 16},
        MULB:   {ins: Debugger.INS.MUL,  size: 16}, // dst is 8-bit (AL), src is 8-bit (operand), result is 16-bit (AH:AL)
        IMULB:  {ins: Debugger.INS.IMUL, size: 16}, // dst is 8-bit (AL), src is 8-bit (operand), result is 16-bit (AH:AL)
        DIVB:   {ins: Debugger.INS.DIV,  size: 16}, // dst is 16-bit (AX), src is 8-bit (operand), result is 16-bit (AH:AL, remainder:quotient)
        IDIVB:  {ins: Debugger.INS.IDIV, size: 16}, // dst is 16-bit (AX), src is 8-bit (operand), result is 16-bit (AH:AL, remainder:quotient)
        MULW:   {ins: Debugger.INS.MUL,  size: 32}, // dst is 16-bit (AX), src is 16-bit (operand), result is 32-bit (DX:AX)
        IMULW:  {ins: Debugger.INS.IMUL, size: 32}, // dst is 16-bit (AX), src is 16-bit (operand), result is 32-bit (DX:AX)
        DIVW:   {ins: Debugger.INS.DIV,  size: 32}, // dst is 32-bit (DX:AX), src is 16-bit (operand), result is 32-bit (DX:AX, remainder:quotient)
        IDIVW:  {ins: Debugger.INS.IDIV, size: 32}  // dst is 32-bit (DX:AX), src is 16-bit (operand), result is 32-bit (DX:AX, remainder:quotient)
    };

    Debugger.TRACE_LIMIT = 100000;

    /*
     * Opcode 0x0F has a distinguished history:
     *
     *      On the 8086, it functioned as POP CS
     *      On the 80186, it generated an illegal opcode (UD_FAULT) exception
     *      On the 80286, it introduced a new (and growing) series of two-byte opcodes
     *
     * Based on the active CPU model, we make every effort to execute and disassemble this (and every other)
     * opcode appropriately, by setting the opcode's entry in aaOpDescs accordingly.  0x0F defaults to the 8086
     * entry: aOpDescPopCS.
     *
     * Note that we do NOT modify aaOpDescs directly; this.aaOpDescs is a reference to it if the processor
     * is an 8086, otherwise we make a copy of the array and THEN modify it.
     */
    Debugger.aOpDescPopCS     = [Debugger.INS.POP,  Debugger.TYPE_CS   | Debugger.TYPE_OUT];
    Debugger.aOpDescUndefined = [Debugger.INS.NONE, Debugger.TYPE_NONE];
    Debugger.aOpDesc0F        = [Debugger.INS.OP0F, Debugger.TYPE_WORD | Debugger.TYPE_BOTH];

    /*
     * The aaOpDescs array is indexed by opcode, and each element is a sub-array (aOpDesc) that describes
     * the corresponding opcode. The sub-elements are as follows:
     *
     *      [0]: {number} of the opcode name (see INS.*)
     *      [1]: {number} containing the destination operand descriptor bit(s)
     *      [2]: {number} containing the source operand descriptor bit(s)
     *
     * These sub-elements are all optional. If [0] is not present, the opcode is undefined; if [1] is not
     * present (or contains zero), the opcode has no (or only implied) operands; and if [2] is not present,
     * the opcode has only a single operand.
     */
    Debugger.aaOpDescs = [
    /* 0x00 */ [Debugger.INS.ADD,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x01 */ [Debugger.INS.ADD,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x02 */ [Debugger.INS.ADD,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x03 */ [Debugger.INS.ADD,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x04 */ [Debugger.INS.ADD,   Debugger.TYPE_AL     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x05 */ [Debugger.INS.ADD,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x06 */ [Debugger.INS.PUSH,  Debugger.TYPE_ES     | Debugger.TYPE_IN],
    /* 0x07 */ [Debugger.INS.POP,   Debugger.TYPE_ES     | Debugger.TYPE_OUT],

    /* 0x08 */ [Debugger.INS.OR,    Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x09 */ [Debugger.INS.OR,    Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x0A */ [Debugger.INS.OR,    Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x0B */ [Debugger.INS.OR,    Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x0C */ [Debugger.INS.OR,    Debugger.TYPE_AL     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x0D */ [Debugger.INS.OR,    Debugger.TYPE_AX     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x0E */ [Debugger.INS.PUSH,  Debugger.TYPE_CS     | Debugger.TYPE_IN],
    /* 0x0F */ Debugger.aOpDescPopCS,

    /* 0x10 */ [Debugger.INS.ADC,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x11 */ [Debugger.INS.ADC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x12 */ [Debugger.INS.ADC,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x13 */ [Debugger.INS.ADC,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x14 */ [Debugger.INS.ADC,   Debugger.TYPE_AL     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x15 */ [Debugger.INS.ADC,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x16 */ [Debugger.INS.PUSH,  Debugger.TYPE_SS     | Debugger.TYPE_IN],
    /* 0x17 */ [Debugger.INS.POP,   Debugger.TYPE_SS     | Debugger.TYPE_OUT],

    /* 0x18 */ [Debugger.INS.SBB,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x19 */ [Debugger.INS.SBB,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x1A */ [Debugger.INS.SBB,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x1B */ [Debugger.INS.SBB,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x1C */ [Debugger.INS.SBB,   Debugger.TYPE_AL     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x1D */ [Debugger.INS.SBB,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x1E */ [Debugger.INS.PUSH,  Debugger.TYPE_DS     | Debugger.TYPE_IN],
    /* 0x1F */ [Debugger.INS.POP,   Debugger.TYPE_DS     | Debugger.TYPE_OUT],

    /* 0x20 */ [Debugger.INS.AND,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x21 */ [Debugger.INS.AND,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x22 */ [Debugger.INS.AND,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x23 */ [Debugger.INS.AND,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x24 */ [Debugger.INS.AND,   Debugger.TYPE_AL     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x25 */ [Debugger.INS.AND,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x26 */ [Debugger.INS.ES,    Debugger.TYPE_PREFIX],
    /* 0x27 */ [Debugger.INS.DAA],

    /* 0x28 */ [Debugger.INS.SUB,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x29 */ [Debugger.INS.SUB,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x2A */ [Debugger.INS.SUB,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x2B */ [Debugger.INS.SUB,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x2C */ [Debugger.INS.SUB,   Debugger.TYPE_AL     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x2D */ [Debugger.INS.SUB,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x2E */ [Debugger.INS.CS,    Debugger.TYPE_PREFIX],
    /* 0x2F */ [Debugger.INS.DAS],

    /* 0x30 */ [Debugger.INS.XOR,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x31 */ [Debugger.INS.XOR,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x32 */ [Debugger.INS.XOR,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x33 */ [Debugger.INS.XOR,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x34 */ [Debugger.INS.XOR,   Debugger.TYPE_AL     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x35 */ [Debugger.INS.XOR,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x36 */ [Debugger.INS.SS,    Debugger.TYPE_PREFIX],
    /* 0x37 */ [Debugger.INS.AAA],

    /* 0x38 */ [Debugger.INS.CMP,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_IN,   Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x39 */ [Debugger.INS.CMP,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN,   Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x3A */ [Debugger.INS.CMP,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_IN,   Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x3B */ [Debugger.INS.CMP,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN,   Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x3C */ [Debugger.INS.CMP,   Debugger.TYPE_AL     | Debugger.TYPE_IN,     Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x3D */ [Debugger.INS.CMP,   Debugger.TYPE_AX     | Debugger.TYPE_IN,     Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x3E */ [Debugger.INS.DS,    Debugger.TYPE_PREFIX],
    /* 0x3F */ [Debugger.INS.AAS],

    /* 0x40 */ [Debugger.INS.INC,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH],
    /* 0x41 */ [Debugger.INS.INC,   Debugger.TYPE_CX     | Debugger.TYPE_BOTH],
    /* 0x42 */ [Debugger.INS.INC,   Debugger.TYPE_DX     | Debugger.TYPE_BOTH],
    /* 0x43 */ [Debugger.INS.INC,   Debugger.TYPE_BX     | Debugger.TYPE_BOTH],
    /* 0x44 */ [Debugger.INS.INC,   Debugger.TYPE_SP     | Debugger.TYPE_BOTH],
    /* 0x45 */ [Debugger.INS.INC,   Debugger.TYPE_BP     | Debugger.TYPE_BOTH],
    /* 0x46 */ [Debugger.INS.INC,   Debugger.TYPE_SI     | Debugger.TYPE_BOTH],
    /* 0x47 */ [Debugger.INS.INC,   Debugger.TYPE_DI     | Debugger.TYPE_BOTH],

    /* 0x48 */ [Debugger.INS.DEC,   Debugger.TYPE_AX     | Debugger.TYPE_BOTH],
    /* 0x49 */ [Debugger.INS.DEC,   Debugger.TYPE_CX     | Debugger.TYPE_BOTH],
    /* 0x4A */ [Debugger.INS.DEC,   Debugger.TYPE_DX     | Debugger.TYPE_BOTH],
    /* 0x4B */ [Debugger.INS.DEC,   Debugger.TYPE_BX     | Debugger.TYPE_BOTH],
    /* 0x4C */ [Debugger.INS.DEC,   Debugger.TYPE_SP     | Debugger.TYPE_BOTH],
    /* 0x4D */ [Debugger.INS.DEC,   Debugger.TYPE_BP     | Debugger.TYPE_BOTH],
    /* 0x4E */ [Debugger.INS.DEC,   Debugger.TYPE_SI     | Debugger.TYPE_BOTH],
    /* 0x4F */ [Debugger.INS.DEC,   Debugger.TYPE_DI     | Debugger.TYPE_BOTH],

    /* 0x50 */ [Debugger.INS.PUSH,  Debugger.TYPE_AX     | Debugger.TYPE_IN],
    /* 0x51 */ [Debugger.INS.PUSH,  Debugger.TYPE_CX     | Debugger.TYPE_IN],
    /* 0x52 */ [Debugger.INS.PUSH,  Debugger.TYPE_DX     | Debugger.TYPE_IN],
    /* 0x53 */ [Debugger.INS.PUSH,  Debugger.TYPE_BX     | Debugger.TYPE_IN],
    /* 0x54 */ [Debugger.INS.PUSH,  Debugger.TYPE_SP     | Debugger.TYPE_IN],
    /* 0x55 */ [Debugger.INS.PUSH,  Debugger.TYPE_BP     | Debugger.TYPE_IN],
    /* 0x56 */ [Debugger.INS.PUSH,  Debugger.TYPE_SI     | Debugger.TYPE_IN],
    /* 0x57 */ [Debugger.INS.PUSH,  Debugger.TYPE_DI     | Debugger.TYPE_IN],

    /* 0x58 */ [Debugger.INS.POP,   Debugger.TYPE_AX     | Debugger.TYPE_OUT],
    /* 0x59 */ [Debugger.INS.POP,   Debugger.TYPE_CX     | Debugger.TYPE_OUT],
    /* 0x5A */ [Debugger.INS.POP,   Debugger.TYPE_DX     | Debugger.TYPE_OUT],
    /* 0x5B */ [Debugger.INS.POP,   Debugger.TYPE_BX     | Debugger.TYPE_OUT],
    /* 0x5C */ [Debugger.INS.POP,   Debugger.TYPE_SP     | Debugger.TYPE_OUT],
    /* 0x5D */ [Debugger.INS.POP,   Debugger.TYPE_BP     | Debugger.TYPE_OUT],
    /* 0x5E */ [Debugger.INS.POP,   Debugger.TYPE_SI     | Debugger.TYPE_OUT],
    /* 0x5F */ [Debugger.INS.POP,   Debugger.TYPE_DI     | Debugger.TYPE_OUT],

    /* 0x60 */ [Debugger.INS.PUSHA, Debugger.TYPE_NONE   | Debugger.TYPE_286],
    /* 0x61 */ [Debugger.INS.POPA,  Debugger.TYPE_NONE   | Debugger.TYPE_286],
    /* 0x62 */ [Debugger.INS.BOUND, Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_286, Debugger.TYPE_MEM   | Debugger.TYPE_2WORDD | Debugger.TYPE_IN],
    /* 0x63 */ [Debugger.INS.ARPL,  Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  | Debugger.TYPE_OUT,                      Debugger.TYPE_REG   | Debugger.TYPE_WORD   | Debugger.TYPE_IN],
    /* 0x64 */ [Debugger.INS.FS,    Debugger.TYPE_NONE   | Debugger.TYPE_386],
    /* 0x65 */ [Debugger.INS.GS,    Debugger.TYPE_NONE   | Debugger.TYPE_386],
    /* 0x66 */ [Debugger.INS.OSIZE, Debugger.TYPE_NONE   | Debugger.TYPE_386],
    /* 0x67 */ [Debugger.INS.ASIZE, Debugger.TYPE_NONE   | Debugger.TYPE_386],

    /* 0x68 */ [Debugger.INS.PUSH,  Debugger.TYPE_IMM    | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_286],
    /* 0x69 */ [Debugger.INS.IMUL,  Debugger.TYPE_REG    | Debugger.TYPE_WORD  | Debugger.TYPE_BOTH | Debugger.TYPE_286,   Debugger.TYPE_MODRM | Debugger.TYPE_WORDIW | Debugger.TYPE_IN],
    /* 0x6A */ [Debugger.INS.PUSH,  Debugger.TYPE_IMM    | Debugger.TYPE_SBYTE | Debugger.TYPE_IN   | Debugger.TYPE_286],
    /* 0x6B */ [Debugger.INS.IMUL,  Debugger.TYPE_REG    | Debugger.TYPE_WORD  | Debugger.TYPE_BOTH | Debugger.TYPE_286,   Debugger.TYPE_MODRM | Debugger.TYPE_WORDIB | Debugger.TYPE_IN],
    /* 0x6C */ [Debugger.INS.INS,   Debugger.TYPE_ESDI   | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT  | Debugger.TYPE_286,   Debugger.TYPE_DX    | Debugger.TYPE_IN],
    /* 0x6D */ [Debugger.INS.INS,   Debugger.TYPE_ESDI   | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_286,   Debugger.TYPE_DX    | Debugger.TYPE_IN],
    /* 0x6E */ [Debugger.INS.OUTS,  Debugger.TYPE_DX     | Debugger.TYPE_IN    | Debugger.TYPE_286,   Debugger.TYPE_DSSI | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x6F */ [Debugger.INS.OUTS,  Debugger.TYPE_DX     | Debugger.TYPE_IN    | Debugger.TYPE_286,   Debugger.TYPE_DSSI | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

    /* 0x70 */ [Debugger.INS.JO,    Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x71 */ [Debugger.INS.JNO,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x72 */ [Debugger.INS.JC,    Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x73 */ [Debugger.INS.JNC,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x74 */ [Debugger.INS.JZ,    Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x75 */ [Debugger.INS.JNZ,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x76 */ [Debugger.INS.JBE,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x77 */ [Debugger.INS.JNBE,  Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],

    /* 0x78 */ [Debugger.INS.JS,    Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x79 */ [Debugger.INS.JNS,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x7A */ [Debugger.INS.JP,    Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x7B */ [Debugger.INS.JNP,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x7C */ [Debugger.INS.JL,    Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x7D */ [Debugger.INS.JGE,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x7E */ [Debugger.INS.JLE,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x7F */ [Debugger.INS.JG,    Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],

    /* 0x80 */ [Debugger.INS.GRP1B, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_IMM   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x81 */ [Debugger.INS.GRP1W, Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x82 */ [Debugger.INS.GRP1B, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_IMM   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x83 */ [Debugger.INS.GRP1SW,Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x84 */ [Debugger.INS.TEST,  Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_IN,   Debugger.TYPE_REG   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x85 */ [Debugger.INS.TEST,  Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN,   Debugger.TYPE_REG   | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x86 */ [Debugger.INS.XCHG,  Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
    /* 0x87 */ [Debugger.INS.XCHG,  Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH],

    /* 0x88 */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT,  Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x89 */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,  Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x8A */ [Debugger.INS.MOV,   Debugger.TYPE_REG    | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT,  Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x8B */ [Debugger.INS.MOV,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,  Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0x8C */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  | Debugger.TYPE_OUT,  Debugger.TYPE_SEGREG | Debugger.TYPE_WORD  | Debugger.TYPE_IN],
    /* 0x8D */ [Debugger.INS.LEA,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,  Debugger.TYPE_MEM    | Debugger.TYPE_VWORD],
    /* 0x8E */ [Debugger.INS.MOV,   Debugger.TYPE_SEGREG | Debugger.TYPE_WORD  | Debugger.TYPE_OUT,  Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  | Debugger.TYPE_IN],
    /* 0x8F */ [Debugger.INS.POP,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT],

    /* 0x90 */ [Debugger.INS.NOP],
    /* 0x91 */ [Debugger.INS.XCHG,  Debugger.TYPE_AX     | Debugger.TYPE_BOTH, Debugger.TYPE_CX | Debugger.TYPE_BOTH],
    /* 0x92 */ [Debugger.INS.XCHG,  Debugger.TYPE_AX     | Debugger.TYPE_BOTH, Debugger.TYPE_DX | Debugger.TYPE_BOTH],
    /* 0x93 */ [Debugger.INS.XCHG,  Debugger.TYPE_AX     | Debugger.TYPE_BOTH, Debugger.TYPE_BX | Debugger.TYPE_BOTH],
    /* 0x94 */ [Debugger.INS.XCHG,  Debugger.TYPE_AX     | Debugger.TYPE_BOTH, Debugger.TYPE_SP | Debugger.TYPE_BOTH],
    /* 0x95 */ [Debugger.INS.XCHG,  Debugger.TYPE_AX     | Debugger.TYPE_BOTH, Debugger.TYPE_BP | Debugger.TYPE_BOTH],
    /* 0x96 */ [Debugger.INS.XCHG,  Debugger.TYPE_AX     | Debugger.TYPE_BOTH, Debugger.TYPE_SI | Debugger.TYPE_BOTH],
    /* 0x97 */ [Debugger.INS.XCHG,  Debugger.TYPE_AX     | Debugger.TYPE_BOTH, Debugger.TYPE_DI | Debugger.TYPE_BOTH],

    /* 0x98 */ [Debugger.INS.CBW],
    /* 0x99 */ [Debugger.INS.CWD],
    /* 0x9A */ [Debugger.INS.CALL,  Debugger.TYPE_IMM    | Debugger.TYPE_FARP | Debugger.TYPE_IN],
    /* 0x9B */ [Debugger.INS.WAIT],
    /* 0x9C */ [Debugger.INS.PUSHF],
    /* 0x9D */ [Debugger.INS.POPF],
    /* 0x9E */ [Debugger.INS.SAHF],
    /* 0x9F */ [Debugger.INS.LAHF],

    /* 0xA0 */ [Debugger.INS.MOV,   Debugger.TYPE_AL     | Debugger.TYPE_OUT,    Debugger.TYPE_IMMOFF | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xA1 */ [Debugger.INS.MOV,   Debugger.TYPE_AX     | Debugger.TYPE_OUT,    Debugger.TYPE_IMMOFF | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xA2 */ [Debugger.INS.MOV,   Debugger.TYPE_IMMOFF | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT,     Debugger.TYPE_AL    | Debugger.TYPE_IN],
    /* 0xA3 */ [Debugger.INS.MOV,   Debugger.TYPE_IMMOFF | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,     Debugger.TYPE_AX    | Debugger.TYPE_IN],
    /* 0xA4 */ [Debugger.INS.MOVSB, Debugger.TYPE_ESDI   | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT,     Debugger.TYPE_DSSI  | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xA5 */ [Debugger.INS.MOVSW, Debugger.TYPE_ESDI   | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,     Debugger.TYPE_DSSI  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xA6 */ [Debugger.INS.CMPSB, Debugger.TYPE_ESDI   | Debugger.TYPE_BYTE  | Debugger.TYPE_IN,      Debugger.TYPE_DSSI  | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xA7 */ [Debugger.INS.CMPSW, Debugger.TYPE_ESDI   | Debugger.TYPE_VWORD | Debugger.TYPE_IN,      Debugger.TYPE_DSSI  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

    /* 0xA8 */ [Debugger.INS.TEST,  Debugger.TYPE_AL     | Debugger.TYPE_IN,     Debugger.TYPE_IMM  | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xA9 */ [Debugger.INS.TEST,  Debugger.TYPE_AX     | Debugger.TYPE_IN,     Debugger.TYPE_IMM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xAA */ [Debugger.INS.STOSB, Debugger.TYPE_ESDI   | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT,   Debugger.TYPE_AL    | Debugger.TYPE_IN],
    /* 0xAB */ [Debugger.INS.STOSW, Debugger.TYPE_ESDI   | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,   Debugger.TYPE_AX    | Debugger.TYPE_IN],
    /* 0xAC */ [Debugger.INS.LODSB, Debugger.TYPE_AL     | Debugger.TYPE_OUT,    Debugger.TYPE_DSSI | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xAD */ [Debugger.INS.LODSW, Debugger.TYPE_AX     | Debugger.TYPE_OUT,    Debugger.TYPE_DSSI | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xAE */ [Debugger.INS.SCASB, Debugger.TYPE_AL     | Debugger.TYPE_IN,     Debugger.TYPE_ESDI | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xAF */ [Debugger.INS.SCASW, Debugger.TYPE_AX     | Debugger.TYPE_IN,     Debugger.TYPE_ESDI | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

    /* 0xB0 */ [Debugger.INS.MOV,   Debugger.TYPE_AL     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xB1 */ [Debugger.INS.MOV,   Debugger.TYPE_CL     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xB2 */ [Debugger.INS.MOV,   Debugger.TYPE_DL     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xB3 */ [Debugger.INS.MOV,   Debugger.TYPE_BL     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xB4 */ [Debugger.INS.MOV,   Debugger.TYPE_AH     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xB5 */ [Debugger.INS.MOV,   Debugger.TYPE_CH     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xB6 */ [Debugger.INS.MOV,   Debugger.TYPE_DH     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xB7 */ [Debugger.INS.MOV,   Debugger.TYPE_BH     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],

    /* 0xB8 */ [Debugger.INS.MOV,   Debugger.TYPE_AX     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xB9 */ [Debugger.INS.MOV,   Debugger.TYPE_CX     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xBA */ [Debugger.INS.MOV,   Debugger.TYPE_DX     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xBB */ [Debugger.INS.MOV,   Debugger.TYPE_BX     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xBC */ [Debugger.INS.MOV,   Debugger.TYPE_SP     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xBD */ [Debugger.INS.MOV,   Debugger.TYPE_BP     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xBE */ [Debugger.INS.MOV,   Debugger.TYPE_SI     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xBF */ [Debugger.INS.MOV,   Debugger.TYPE_DI     | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

    /* 0xC0 */ [Debugger.INS.GRP2B, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH | Debugger.TYPE_186, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xC1 */ [Debugger.INS.GRP2W, Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_186, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xC2 */ [Debugger.INS.RET,   Debugger.TYPE_IMM    | Debugger.TYPE_WORD  | Debugger.TYPE_IN],
    /* 0xC3 */ [Debugger.INS.RET],
    /* 0xC4 */ [Debugger.INS.LES,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT, Debugger.TYPE_MEM | Debugger.TYPE_FARP  | Debugger.TYPE_IN],
    /* 0xC5 */ [Debugger.INS.LDS,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT, Debugger.TYPE_MEM | Debugger.TYPE_FARP  | Debugger.TYPE_IN],
    /* 0xC6 */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xC7 */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

    /* 0xC8 */ [Debugger.INS.ENTER, Debugger.TYPE_IMM    | Debugger.TYPE_WORD  | Debugger.TYPE_IN | Debugger.TYPE_286,  Debugger.TYPE_IMM   | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xC9 */ [Debugger.INS.LEAVE, Debugger.TYPE_NONE   | Debugger.TYPE_286],
    /* 0xCA */ [Debugger.INS.RETF,  Debugger.TYPE_IMM    | Debugger.TYPE_WORD  | Debugger.TYPE_IN],
    /* 0xCB */ [Debugger.INS.RETF],
    /* 0xCC */ [Debugger.INS.INT3],
    /* 0xCD */ [Debugger.INS.INT,   Debugger.TYPE_IMM    | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xCE */ [Debugger.INS.INTO],
    /* 0xCF */ [Debugger.INS.IRET],

    /* 0xD0 */ [Debugger.INS.GRP2B1,Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_ONE    | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xD1 */ [Debugger.INS.GRP2W1,Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE    | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xD2 */ [Debugger.INS.GRP2BC,Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL |   Debugger.TYPE_IN],
    /* 0xD3 */ [Debugger.INS.GRP2WC,Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL |   Debugger.TYPE_IN],
    /* 0xD4 */ [Debugger.INS.AAM,   Debugger.TYPE_IMM    | Debugger.TYPE_BYTE],
    /* 0xD5 */ [Debugger.INS.AAD,   Debugger.TYPE_IMM    | Debugger.TYPE_BYTE],
    /* 0xD6 */ [Debugger.INS.GBP],
    /* 0xD7 */ [Debugger.INS.XLAT],

    /* 0xD8 */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xD9 */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xDA */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xDB */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xDC */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xDD */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xDE */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xDF */ [Debugger.INS.ESC,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

    /* 0xE0 */ [Debugger.INS.LOOPNZ,Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xE1 */ [Debugger.INS.LOOPZ, Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xE2 */ [Debugger.INS.LOOP,  Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xE3 */ [Debugger.INS.JCXZ,  Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xE4 */ [Debugger.INS.IN,    Debugger.TYPE_AL     | Debugger.TYPE_OUT,    Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xE5 */ [Debugger.INS.IN,    Debugger.TYPE_AX     | Debugger.TYPE_OUT,    Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xE6 */ [Debugger.INS.OUT,   Debugger.TYPE_IMM    | Debugger.TYPE_BYTE  | Debugger.TYPE_IN,   Debugger.TYPE_AL   | Debugger.TYPE_IN],
    /* 0xE7 */ [Debugger.INS.OUT,   Debugger.TYPE_IMM    | Debugger.TYPE_BYTE  | Debugger.TYPE_IN,   Debugger.TYPE_AX   | Debugger.TYPE_IN],

    /* 0xE8 */ [Debugger.INS.CALL,  Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xE9 */ [Debugger.INS.JMP,   Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
    /* 0xEA */ [Debugger.INS.JMP,   Debugger.TYPE_IMM    | Debugger.TYPE_FARP  | Debugger.TYPE_IN],
    /* 0xEB */ [Debugger.INS.JMP,   Debugger.TYPE_IMMREL | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xEC */ [Debugger.INS.IN,    Debugger.TYPE_AL     | Debugger.TYPE_OUT,    Debugger.TYPE_DX | Debugger.TYPE_IN],
    /* 0xED */ [Debugger.INS.IN,    Debugger.TYPE_AX     | Debugger.TYPE_OUT,    Debugger.TYPE_DX | Debugger.TYPE_IN],
    /* 0xEE */ [Debugger.INS.OUT,   Debugger.TYPE_DX     | Debugger.TYPE_IN,     Debugger.TYPE_AL | Debugger.TYPE_IN],
    /* 0xEF */ [Debugger.INS.OUT,   Debugger.TYPE_DX     | Debugger.TYPE_IN,     Debugger.TYPE_AX | Debugger.TYPE_IN],

    /* 0xF0 */ [Debugger.INS.LOCK,  Debugger.TYPE_PREFIX],
    /* 0xF1 */ [Debugger.INS.NONE],
    /* 0xF2 */ [Debugger.INS.REPNZ, Debugger.TYPE_PREFIX],
    /* 0xF3 */ [Debugger.INS.REPZ,  Debugger.TYPE_PREFIX],
    /* 0xF4 */ [Debugger.INS.HLT],
    /* 0xF5 */ [Debugger.INS.CMC],
    /* 0xF6 */ [Debugger.INS.GRP3B, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
    /* 0xF7 */ [Debugger.INS.GRP3W, Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH],

    /* 0xF8 */ [Debugger.INS.CLC],
    /* 0xF9 */ [Debugger.INS.STC],
    /* 0xFA */ [Debugger.INS.CLI],
    /* 0xFB */ [Debugger.INS.STI],
    /* 0xFC */ [Debugger.INS.CLD],
    /* 0xFD */ [Debugger.INS.STD],
    /* 0xFE */ [Debugger.INS.GRP4B, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
    /* 0xFF */ [Debugger.INS.GRP4W, Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH]
    ];

    Debugger.aaOp0FDescs = {
        0x00: [Debugger.INS.GRP6,   Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  |  Debugger.TYPE_BOTH],
        0x01: [Debugger.INS.GRP7,   Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  |  Debugger.TYPE_BOTH],
        0x02: [Debugger.INS.LAR,    Debugger.TYPE_REG    | Debugger.TYPE_WORD  |  Debugger.TYPE_IN | Debugger.TYPE_286,   Debugger.TYPE_MEM  | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        0x03: [Debugger.INS.LSL,    Debugger.TYPE_REG    | Debugger.TYPE_WORD  |  Debugger.TYPE_IN | Debugger.TYPE_286,   Debugger.TYPE_MEM  | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        0x05: [Debugger.INS.LOADALL,Debugger.TYPE_286],
        0x06: [Debugger.INS.CLTS,   Debugger.TYPE_286]
    };

    Debugger.aaGrpDescs = [
      [
        /* GRP1B */
        [Debugger.INS.ADD,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.OR,   Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.ADC,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SBB,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.AND,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SUB,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.XOR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.CMP,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_IN,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN]
      ],
      [
        /* GRP1W */
        [Debugger.INS.ADD,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.OR,   Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.ADC,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.SBB,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.AND,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.SUB,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.XOR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.CMP,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN]
      ],
      [
        /* GRP1SW */
        [Debugger.INS.ADD,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN],
        [Debugger.INS.OR,   Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN],
        [Debugger.INS.ADC,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN],
        [Debugger.INS.SBB,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN],
        [Debugger.INS.AND,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN],
        [Debugger.INS.SUB,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN],
        [Debugger.INS.XOR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN],
        [Debugger.INS.CMP,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN,   Debugger.TYPE_IMM | Debugger.TYPE_SBYTE | Debugger.TYPE_IN]
      ],
      [
        /* GRP2B */
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN]
      ],
      [
        /* GRP2W */
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN]
      ],
      [
        /* GRP2B1 */
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN]
      ],
      [
        /* GRP2W1 */
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_ONE | Debugger.TYPE_BYTE | Debugger.TYPE_IN]
      ],
      [
        /* GRP2BC */
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN]
      ],
      [
        /* GRP2WC */
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH, Debugger.TYPE_IMPREG | Debugger.TYPE_CL | Debugger.TYPE_IN]
      ],
      [
        /* GRP3B */
        [Debugger.INS.TEST, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN,   Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.NOT,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
        [Debugger.INS.NEG,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
        [Debugger.INS.MUL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
        [Debugger.INS.IMUL, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
        [Debugger.INS.DIV,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
        [Debugger.INS.IDIV, Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH]
      ],
      [
        /* GRP3W */
        [Debugger.INS.TEST, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN,   Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.NOT,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH],
        [Debugger.INS.NEG,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH],
        [Debugger.INS.MUL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.IMUL, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH],
        [Debugger.INS.DIV,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.IDIV, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH]
      ],
      [
        /* GRP4B */
        [Debugger.INS.INC,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
        [Debugger.INS.DEC,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH],
         Debugger.aOpDescUndefined,
         Debugger.aOpDescUndefined,
         Debugger.aOpDescUndefined,
         Debugger.aOpDescUndefined,
         Debugger.aOpDescUndefined,
         Debugger.aOpDescUndefined
      ],
      [
        /* GRP4W */
        [Debugger.INS.INC,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH],
        [Debugger.INS.DEC,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH],
        [Debugger.INS.CALL, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.CALL, Debugger.TYPE_MODRM | Debugger.TYPE_FARP  | Debugger.TYPE_IN],
        [Debugger.INS.JMP,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
        [Debugger.INS.JMP,  Debugger.TYPE_MODRM | Debugger.TYPE_FARP  | Debugger.TYPE_IN],
        [Debugger.INS.PUSH, Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined
      ],
      [ /* OP0F */ ],
      [
        /* GRP6 */
        [Debugger.INS.SLDT, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_OUT],
        [Debugger.INS.STR,  Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_OUT],
        [Debugger.INS.LLDT, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        [Debugger.INS.LTR,  Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        [Debugger.INS.VERR, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        [Debugger.INS.VERW, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
         Debugger.aOpDescUndefined
      ],
      [
        /* GRP7 */
        [Debugger.INS.SGDT, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_OUT],
        [Debugger.INS.SIDT, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_OUT],
        [Debugger.INS.LGDT, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        [Debugger.INS.LIDT, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        [Debugger.INS.SMSW, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_OUT],
         Debugger.aOpDescUndefined,
        [Debugger.INS.LMSW, Debugger.TYPE_MODRM | Debugger.TYPE_WORD | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined
      ]
    ];

    Debugger.INT_FUNCS = {
        0x13: {
            0x00: "disk reset",
            0x01: "get status",
            0x02: "read drive DL (CH:DH:CL:AL) into ES:BX",
            0x03: "write drive DL (CH:DH:CL:AL) from ES:BX",
            0x04: "verify drive DL (CH:DH:CL:AL)",
            0x05: "format drive DL using ES:BX",
            0x08: "read drive DL parameters into ES:DI",
            0x15: "get drive DL DASD type",
            0x16: "get drive DL change line status",
            0x17: "set drive DL DASD type",
            0x18: "set drive DL media type"
        },
        0x15: {
            0x80: "open device",
            0x81: "close device",
            0x82: "program termination",
            0x83: "wait CX:DXus for event",
            0x84: "joystick support",
            0x85: "SYSREQ pressed",
            0x86: "wait CX:DXus",
            0x87: "move block (CX words)",
            0x88: "get extended memory size",
            0x89: "processor to virtual mode",
            0x90: "device busy loop",
            0x91: "interrupt complete flag set"
        },
        0x21: {
            0x00: "terminate program",
            0x01: "read character (al) from stdin with echo",
            0x02: "write character DL to stdout",
            0x03: "read character (al) from stdaux",                            // eg, COM1
            0x04: "write character DL to stdaux",                               // eg, COM1
            0x05: "write character DL to stdprn",                               // eg, LPT1
            0x06: "direct console output (input if DL=FF)",
            0x07: "direct console input without echo",
            0x08: "read character (al) from stdin without echo",
            0x09: "write $-terminated string DS:DX to stdout",
            0x0A: "buffered input (ds:dx)",                                     // byte 0 is maximum chars, byte 1 is number of previous characters, byte 2 is number of characters read
            0x0B: "get stdin status",
            0x0C: "flush buffer and read stdin",                                // AL is a function # (0x01, 0x06, 0x07, 0x08, or 0x0A)
            0x0D: "disk reset",
            0x0E: "select default drive DL",                                    // returns # of available drives in AL
            0x0F: "open file using fcb DS:DX",                                  // DS:DX -> unopened File Control Block
            0x10: "close file using fcb DS:DX",
            0x11: "find first matching file using fcb DS:DX",
            0x12: "find next matching file using fcb DS:DX",
            0x13: "delete file using fcb DS:DX",
            0x14: "sequential read from file using fcb DS:DX",
            0x15: "sequential write to file using fcb DS:DX",
            0x16: "create or truncate file using fcb DS:DX",
            0x17: "rename file using fcb DS:DX",
            0x19: "get current default drive (al)",
            0x1A: "set disk transfer area (dta) DS:DX",
            0x1B: "get allocation information for default drive",
            0x1C: "get allocation information for specific drive DL",
            0x1F: "get drive parameter block for default drive",
            0x21: "read random record from file using fcb DS:DX",
            0x22: "write random record to file using fcb DS:DX",
            0x23: "get file size using fcb DS:DX",
            0x24: "set random record number for fcb DS:DX",
            0x25: "set address DS:DX of interrupt vector AL",
            0x26: "create new program segment prefix (psp) at segment DX",
            0x27: "random block read from file using fcb DS:DX",
            0x28: "random block write to file using fcb DS:DX",
            0x29: "parse filename DS:SI into fcb ES:DI using AL",
            0x2A: "get system date (year=cx, mon=dh, day=dl)",
            0x2B: "set system date (year=CX, mon=DH, day=DL)",
            0x2C: "get system time (hour=ch, min=cl, sec=dh, 100ths=dl)",
            0x2D: "set system time (hour=CH, min=CL, sec=DH, 100ths=DL)",
            0x2E: "set verify flag AL",
            0x2F: "get disk transfer area address (es:bx)",                     // DOS 2.00+
            0x30: "get DOS version (al=major, ah=minor)",
            0x31: "terminate and stay resident",
            0x32: "get drive parameter block (dpb=ds:bx) for drive DL",
            0x33: "extended break check",
            0x34: "get address (es:bx) of InDOS flag",
            0x35: "get address (es:bx) of interrupt vector AL",
            0x36: "get free disk space of drive DL",
            0x37: "get(0)/set(1) switch character DL (AL)",
            0x38: "get country-specific information",
            0x39: "create subdirectory DS:DX",
            0x3A: "remove subdirectory DS:DX",
            0x3B: "set current directory DS:DX",
            0x3C: "create or truncate file DS:DX with attributes CX",
            0x3D: "open existing file DS:DX with mode AL",
            0x3E: "close file BX",
            0x3F: "read CX bytes from file BX into buffer DS:DX",
            0x40: "write CX bytes to file BX from buffer DS:DX",
            0x41: "delete file DS:DX",
            0x42: "set position CX:DX of file BX relative to AL",
            0x43: "get(0)/set(1) attributes CX of file DS:DX (AL)",
            0x44: "get device information (IOCTL)",
            0x45: "duplicate file handle BX",
            0x46: "force file handle CX to duplicate file handle BX",
            0x47: "get current directory (ds:si) for drive DL",
            0x48: "allocate memory segment with BX paragraphs",
            0x49: "free memory segment ES",
            0x4A: "resize memory segment ES to BX paragraphs",
            0x4B: "load program DS:DX using parameter block ES:BX",
            0x4C: "terminate with return code AL",
            0x4D: "get return code (al)",
            0x4E: "find first matching file DS:DX with attributes CX",
            0x4F: "find next matching file",
            0x50: "set current psp BX",
            0x51: "get current psp (bx)",
            0x52: "get system variables (es:bx)",
            0x53: "translate bpb DS:SI to dpb (es:bp)",
            0x54: "get verify flag (al)",
            0x55: "create child psp at segment DX",
            0x56: "rename file DS:DX to name ES:DI",
            0x57: "get(0)/set(1) file date DX and time CX (AL)",
            0x58: "get(0)/set(1) memory allocation strategy (AL)",              // DOS 2.11+
            0x59: "get extended error information",                             // DOS 3.00+
            0x5A: "create temporary file DS:DX with attributes CX",             // DOS 3.00+
            0x5B: "create file DS:DX with attributes CX",                       // DOS 3.00+ (doesn't truncate existing files like 0x3C)
            0x5C: "lock(0)/unlock(1) file BX region CX:DX length SI:DI (AL)"    // DOS 3.00+
        }
    };

    /**
     * initBus(bus, cpu, dbg)
     *
     * @this {Debugger}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {X86CPU} cpu
     * @param {Debugger} dbg
     */
    Debugger.prototype.initBus = function(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cpu = cpu;
        this.cmp = cmp;
        this.fdc = cmp.getComponentByType("FDC");
        this.hdc = cmp.getComponentByType("HDC");
        if (MAXDEBUG) this.chipset = cmp.getComponentByType("ChipSet");

        this.cchAddr = bus.getWidth() >> 2;

        this.aaOpDescs = Debugger.aaOpDescs;
        if (this.cpu.model >= X86.MODEL_80186) {
            this.aaOpDescs = Debugger.aaOpDescs.slice();
            this.aaOpDescs[0x0F] = Debugger.aOpDescUndefined;
            if (this.cpu.model >= X86.MODEL_80286) {
                this.aaOpDescs[0x0F] = Debugger.aOpDesc0F;
            }
        }

        this.messageDump(Debugger.MESSAGE.DESC, function onDumpDesc(s) { dbg.dumpDesc(s); });
        this.messageDump(Debugger.MESSAGE.TSS,  function onDumpTSS(s)  { dbg.dumpTSS(s); });
        this.messageDump(Debugger.MESSAGE.DOS,  function onDumpDOS(s)  { dbg.dumpDOS(s); });

        this.setReady();

        if (this.sInitCommands) {
            var a = this.parseCommand(this.sInitCommands);
            delete this.sInitCommands;
            for (var s in a) this.doCommand(a[s]);
        }
    };

    /**
     * setBinding(sHTMLType, sBinding, control)
     *
     * @this {Debugger}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "debugInput")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    Debugger.prototype.setBinding = function(sHTMLType, sBinding, control)
    {
        var dbg = this;
        switch (sBinding) {

        case "debugInput":
            this.bindings[sBinding] = control;
            this.controlDebug = control;
            /*
             * For halted machines, this is fine, but for auto-start machines, it can be annoying.
             *
             *      this.controlDebug.focus();
             */
            control.onkeypress = function onKeyPressDebugInput(event) {
                if (event.keyCode == 13) {
                    var s = control.value;
                    control.value = "";
                    var a = dbg.parseCommand(s, true);
                    for (s in a) dbg.doCommand(a[s]);
                    /*
                     * The following preventDefault() hack seems to be necessary only for IE; IE insists on giving
                     * focus to the debugEnter control after we've processed the Enter key above (keyCode == 13)
                     * for the debugInput control.  This hack allows focus to remain with debugInput.
                     *
                     * NOTE: In IE9, I was able to resolve this problem (or so I thought) by forcing focus back to the
                     * debugInput control (eg, "control.focus()") but that wasn't working in IE10.  Here's hoping this
                     * also works in IE9 until I have a chance to test it.
                     */
                    if (event.preventDefault) event.preventDefault();
                }
            };
            return true;

        case "debugEnter":
            this.bindings[sBinding] = control;
            web.onClickRepeat(
                control,
                500, 100,
                function onClickDebugEnter(fRepeat) {
                    if (dbg.controlDebug) {
                        var s = dbg.controlDebug.value;
                        /*
                         *  NOTE: If we wanted to use the debugEnter button to repeatedly enter the same command, it
                         *  used to be the case that we couldn't clear the command string.  That's apparently no longer true.
                         */
                        dbg.controlDebug.value = "";
                        var a = dbg.parseCommand(s, true);
                        for (s in a) dbg.doCommand(a[s]);
                        return true;
                    }
                    if (DEBUG) dbg.log("no debugger input buffer");
                    return false;
                }
            );
            return true;

        case "step":
            this.bindings[sBinding] = control;
            web.onClickRepeat(
                control,
                500, 100,
                function onClickStep(fRepeat) {
                    var fCompleted = false;
                    if (!dbg.isBusy(true)) {
                        dbg.setBusy(true);
                        fCompleted = dbg.stepCPU(fRepeat? 1 : 0);
                        dbg.setBusy(false);
                    }
                    return fCompleted;
                }
            );
            return true;

        default:
            break;
        }
        return false;
    };

    /**
     * setFocus()
     *
     * @this {Debugger}
     */
    Debugger.prototype.setFocus = function()
    {
        if (this.controlDebug) this.controlDebug.focus();
    };

    /**
     * dumpDOS(s)
     *
     * This dumps DOS MCBs (Memory Control Blocks).
     *
     * @this {Debugger}
     * @param {string} [s]
     */
    Debugger.prototype.dumpDOS = function(s)
    {
        if (!s) return;

        this.println("dumpDOS(" + s + ")");

        /*
         * If s is provided and str.parseInt(s) succeeds, then we assume it represents a starting
         * MCB (Memory Control Block) segment, and we dump the corresponding blocks.
         */
        var seg = this.parseValue(s);
        while (seg) {
            var aAddr = this.newAddr(0, seg);
            var bSig = this.getByte(aAddr, 1);
            var wPID = this.getWord(aAddr, 2);
            var wParas = this.getWord(aAddr, 5);
            if (bSig != 0x4D && bSig != 0x5A) break;
            this.println(str.toHexAddr(0, seg) + ": '" + String.fromCharCode(bSig) + "' PID=" + str.toHexWord(wPID) + " LEN=" + str.toHexWord(wParas) + ' "' + this.dumpSZ(aAddr, 8) + '"');
            seg += 1 + wParas;
        }
    };

    Debugger.aTSSFields = {
        "PREV_TSS":     0x00,
        "CPL0_SP":      0x02,
        "CPL0_SS":      0x04,
        "CPL1_SP":      0x06,
        "CPL1_SS":      0x08,
        "CPL2_SP":      0x0a,
        "CPL2_SS":      0x0c,
        "TASK_IP":      0x0e,
        "TASK_PS":      0x10,
        "TASK_AX":      0x12,
        "TASK_CX":      0x14,
        "TASK_DX":      0x16,
        "TASK_BX":      0x18,
        "TASK_SP":      0x1a,
        "TASK_BP":      0x1c,
        "TASK_SI":      0x1e,
        "TASK_DI":      0x20,
        "TASK_ES":      0x22,
        "TASK_CS":      0x24,
        "TASK_SS":      0x26,
        "TASK_DS":      0x28,
        "TASK_LDT":     0x2a
    };

    /**
     * dumpDesc(s)
     *
     * This dumps a descriptor for the given selector.
     *
     * @this {Debugger}
     * @param {string} [s]
     */
    Debugger.prototype.dumpDesc = function(s)
    {
        if (!s) {
            this.println("no selector");
            return;
        }

        var sel = this.parseValue(s);
        if (sel === undefined) {
            this.println("invalid selector: " + s);
            return;
        }

        var seg = this.getSegment(sel);

        this.println("dumpDesc(" + str.toHexWord(seg.sel) + "): %" + str.toHex(seg.addrDesc, this.cchAddr));

        var sType;
        if (seg.type & X86.DESC.ACC.TYPE.SEG) {
            if (seg.type & X86.DESC.ACC.TYPE.CODE) {
                sType = "code";
                if (seg.type & X86.DESC.ACC.TYPE.READABLE) sType += ",readable";
                if (seg.type & X86.DESC.ACC.TYPE.CONFORMING) sType += ",conforming";
            }
            else {
                sType = "data";
                if (seg.type & X86.DESC.ACC.TYPE.WRITABLE) sType += ",writable";
                if (seg.type & X86.DESC.ACC.TYPE.EXPDOWN) sType += ",expdown";
            }
            if (seg.type & X86.DESC.ACC.TYPE.ACCESSED) sType += ",accessed";
        }
        else {
            switch(seg.type) {
            case X86.DESC.ACC.TYPE.TSS:
                sType = "tss";
                break;
            case X86.DESC.ACC.TYPE.LDT:
                sType = "ldt";
                break;
            case X86.DESC.ACC.TYPE.TSS_BUSY:
                sType = "busy tss";
                break;
            case X86.DESC.ACC.TYPE.GATE_CALL:
                sType = "call gate";
                break;
            case X86.DESC.ACC.TYPE.GATE_TASK:
                sType = "task gate";
                break;
            case X86.DESC.ACC.TYPE.GATE_INT:
                sType = "int gate";
                break;
            case X86.DESC.ACC.TYPE.GATE_TRAP:
                sType = "trap gate";
                break;
            default:
                break;
            }
        }

        if (sType && !(seg.acc & X86.DESC.ACC.PRESENT)) sType += ",not present";

        this.println("base=" + str.toHex(seg.base, this.cchAddr) + " limit=" + str.toHexWord(seg.limit) + " dpl=" + str.toHexByte(seg.dpl) + " type=" + str.toHexByte(seg.acc >>> 8) + " (" + sType + ")");
    };

    /**
     * dumpTSS(s)
     *
     * This dumps a TSS using the given selector.  If none is specified, the current TR is used.
     *
     * @this {Debugger}
     * @param {string} [s]
     */
    Debugger.prototype.dumpTSS = function(s)
    {
        var seg;
        if (!s) {
            seg = this.cpu.segTSS;
        } else {
            var sel = this.parseValue(s);
            if (sel === undefined) {
                this.println("invalid task selector: " + s);
                return;
            }
            seg = this.getSegment(sel);
        }

        this.println("dumpTSS(" + str.toHexWord(seg.sel) + "): %" + str.toHex(seg.base, this.cchAddr));

        var sDump = "";
        for (var sField in Debugger.aTSSFields) {
            var off = Debugger.aTSSFields[sField];
            var ch = (sField.length < 8? ' ' : '');
            var w = this.bus.getWordDirect(seg.base + off);
            if (sDump) sDump += '\n';
            sDump += str.toHexWord(off) + " " + sField + ": " + ch + str.toHexWord(w);
        }

        this.println(sDump);
    };

    /**
     * dumpSZ(aAddr, cchMax)
     *
     * Dump helper for zero-terminated strings.
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} [cchMax]
     * @return {string} (and aAddr advanced past the terminating zero)
     */
    Debugger.prototype.dumpSZ = function(aAddr, cchMax)
    {
        var sChars = "";
        cchMax = cchMax || 256;
        while (sChars.length < cchMax) {
            var b = this.getByte(aAddr, 1);
            if (!b) break;
            sChars += (b >= 32 && b < 128? String.fromCharCode(b) : ".");
        }
        return sChars;
    };

    /**
     * initMessages(sEnable)
     *
     * @this {Debugger}
     * @param {string|undefined} sEnable contains zero or more message categories to enable, separated by '|' or ';'
     */
    Debugger.prototype.initMessages = function(sEnable)
    {
        this.afnDumpers = [];
        this.bitsMessageEnabled = 0;
        this.sMessagePrev = null;
        var aEnable = this.parseCommand(sEnable);
        if (aEnable.length) {
            for (var m in Debugger.MESSAGES) {
                if (aEnable.indexOf(m) >= 0) {
                    this.bitsMessageEnabled |= Debugger.MESSAGES[m];
                    this.println(m + " messages enabled");
                }
            }
        }
    };

    /**
     * messageDump(bitMessage, fnDumper)
     *
     * @this {Debugger}
     * @param {number} bitMessage is one Debugger MESSAGE_* category flag
     * @param {function(string)} fnDumper is a function the Debugger can use to dump data for that category
     * @return {boolean} true if successfully registered, false if not
     */
    Debugger.prototype.messageDump = function(bitMessage, fnDumper)
    {
        for (var m in Debugger.MESSAGES) {
            if (bitMessage == Debugger.MESSAGES[m]) {
                this.afnDumpers[m] = fnDumper;
                return true;
            }
        }
        return false;
    };

    /**
     * messageEnabled(bitsMessage)
     *
     * NOTE: If the caller specifies multiple MESSAGE category flags, then ALL the corresponding flags
     * in the Debugger's bitsMessageEnabled variable must be enabled as well, else the result will be false.
     *
     * @this {Debugger}
     * @param {number} bitsMessage is one or more Debugger MESSAGE_* category flag(s)
     * @return {boolean} true if message category is enabled, false if not
     */
    Debugger.prototype.messageEnabled = function(bitsMessage)
    {
        return ((this.bitsMessageEnabled & bitsMessage) === bitsMessage);
    };

    /**
     * updateRegValues()
     *
     * @this {Debugger}
     */
    Debugger.prototype.updateRegValues = function() {
        var cpu = this.cpu;
        var asRegs = Debugger.asRegs;
        this.aRegValues[asRegs[0]]  = str.toHexByte(cpu.regAX & 0xff);
        this.aRegValues[asRegs[1]]  = str.toHexByte(cpu.regCX & 0xff);
        this.aRegValues[asRegs[2]]  = str.toHexByte(cpu.regDX & 0xff);
        this.aRegValues[asRegs[3]]  = str.toHexByte(cpu.regBX & 0xff);
        this.aRegValues[asRegs[4]]  = str.toHexByte(cpu.regAX >> 8);
        this.aRegValues[asRegs[5]]  = str.toHexByte(cpu.regCX >> 8);
        this.aRegValues[asRegs[6]]  = str.toHexByte(cpu.regDX >> 8);
        this.aRegValues[asRegs[7]]  = str.toHexByte(cpu.regBX >> 8);
        this.aRegValues[asRegs[8]]  = str.toHexWord(cpu.regAX);
        this.aRegValues[asRegs[9]]  = str.toHexWord(cpu.regCX);
        this.aRegValues[asRegs[10]] = str.toHexWord(cpu.regDX);
        this.aRegValues[asRegs[11]] = str.toHexWord(cpu.regBX);
        this.aRegValues[asRegs[12]] = str.toHexWord(cpu.regSP);
        this.aRegValues[asRegs[13]] = str.toHexWord(cpu.regBP);
        this.aRegValues[asRegs[14]] = str.toHexWord(cpu.regSI);
        this.aRegValues[asRegs[15]] = str.toHexWord(cpu.regDI);
        this.aRegValues[asRegs[16]] = str.toHexWord(cpu.segES.sel);
        this.aRegValues[asRegs[17]] = str.toHexWord(cpu.segCS.sel);
        this.aRegValues[asRegs[18]] = str.toHexWord(cpu.segSS.sel);
        this.aRegValues[asRegs[19]] = str.toHexWord(cpu.segDS.sel);
        this.aRegValues[asRegs[20]] = str.toHexWord(cpu.regIP);
    };

    /**
     * messageInt(nInt, addr)
     *
     * @this {Debugger}
     * @param {number} nInt
     * @param {number} addr
     * @return {boolean} true if message generated, false if not
     */
    Debugger.prototype.messageInt = function(nInt, addr)
    {
        var nCategory = Debugger.INT_MESSAGE[nInt];
        var fMessage = nCategory && this.messageEnabled(nCategory);
        if (fMessage) {
            var AH = this.cpu.regAX >> 8;
            var DL = this.cpu.regDX & 0xff;
            if (nInt == Debugger.INT.DOS && AH == 0x0b ||
                nCategory == Debugger.MESSAGE.FDC && DL >= 0x80 || nCategory == Debugger.MESSAGE.HDC && DL < 0x80) {
                fMessage = false;
            }
        }
        if (fMessage) {
            var aFuncs = Debugger.INT_FUNCS[nInt];
            var sFunc = (aFuncs && aFuncs[AH]) || "";
            if (sFunc) {
                this.updateRegValues();
                sFunc = " " + str.replaceArray(this.aRegValues, sFunc);
            }
            this.message("INT 0x" + str.toHexByte(nInt) + ": AH=" + str.toHexByte(AH) + " at " + str.toHexAddr(addr - this.cpu.segCS.base, this.cpu.segCS.sel) + sFunc);
        }
        return fMessage;
    };

    /**
     * messageIntReturn(nInt, nLevel, nCycles)
     *
     * @this {Debugger}
     * @param {number} nInt
     * @param {number} nLevel
     * @param {number} nCycles
     * @param {string} [sResult]
     */
    Debugger.prototype.messageIntReturn = function(nInt, nLevel, nCycles, sResult)
    {
        this.message("INT 0x" + str.toHexByte(nInt) + ": C=" + (this.cpu.getCF()? 1 : 0) + (sResult || "") + " (cycles=" + nCycles + (nLevel? ",level=" + (nLevel+1) : "") + ")");
    };

    /**
     * messageMem(component, addr, fWrite, addrFrom, name, bitsMessage)
     *
     * NOTE: Not currently used
     *
     * @this {Debugger}
     * @param {Component} component
     * @param {number} addr
     * @param {boolean} fWrite is true if this was a write, false if read
     * @param {number|null} [addrFrom]
     * @param {string|null} [name] of the memory address, if any
     * @param {number} [bitsMessage] is one or more Debugger MESSAGE_* category flag(s)
     *
    Debugger.prototype.messageMem = function(component, addr, fWrite, addrFrom, name, bitsMessage)
     {
        if (!bitsMessage) bitsMessage = 0;
        bitsMessage |= Debugger.MESSAGES_MEM;
        if (addrFrom == null || (this.bitsMessageEnabled & bitsMessage) == bitsMessage) {
            var b = this.bus.getByteDirect(addr);
            this.message(component.idComponent + "." + (fWrite? "setByte" : "getByte") + "(0x" + str.toHexAddr(addr) + ")" + (addrFrom != null? (" at " + str.toHexAddr(addrFrom)) : "") + ": " + (name? (name + "=") : "") + str.toHexByte(b));
        }
    };
     */

    /**
     * messagePort(component, port, bOut, addrFrom, name, bitsMessage, bIn)
     *
     * @this {Debugger}
     * @param {Component} component
     * @param {number} port
     * @param {number|null} bOut if an output operation
     * @param {number|null} [addrFrom]
     * @param {string|null} [name] of the port, if any
     * @param {number|null} [bitsMessage] is one or more Debugger MESSAGE_* category flag(s)
     * @param {number} [bIn] is the input value, if known, on an input operation
     */
    Debugger.prototype.messagePort = function(component, port, bOut, addrFrom, name, bitsMessage, bIn)
    {
        if (!bitsMessage) bitsMessage = 0;
        bitsMessage |= Debugger.MESSAGE.PORT;
        if (addrFrom == null || (this.bitsMessageEnabled & bitsMessage) == bitsMessage) {
            var segFrom = null;
            if (addrFrom != null) {
                segFrom = this.cpu.segCS.sel;
                addrFrom -= this.cpu.segCS.base;
            }
            this.message(component.idComponent + "." + (bOut != null? "outPort" : "inPort") + "(0x" + str.toHexWord(port) + "," + (name? name : "unknown") + (bOut != null? ",0x" + str.toHexByte(bOut) : "") + ")" + (bIn != null? (": 0x" + str.toHexByte(bIn)) : "") + (addrFrom != null? (" at " + str.toHexAddr(addrFrom, segFrom)) : ""));
        }
    };

    /**
     * message(sMessage)
     *
     * @this {Debugger}
     * @param {string} sMessage is any caller-defined message string
     */
    Debugger.prototype.message = function(sMessage)
    {
        if (this.sMessagePrev && sMessage == this.sMessagePrev) return;

        this.println(sMessage);             // + " (" + this.cpu.getCycles() + " cycles)"

        this.sMessagePrev = sMessage;

        if (this.cpu) {
            if (this.bitsMessageEnabled & Debugger.MESSAGE.HALT) {
                this.cpu.stopCPU();
            }
            /*
             * We have no idea what the frequency of println() calls might be; all we know is that they easily
             * screw up the CPU's careful assumptions about cycles per burst.  So we need call yieldCPU() after
             * every message, to effectively end the current burst and start fresh.
             *
             * TODO: See CPU.calcStartTime() for a discussion of why we might want to call yieldCPU() *before*
             * we display the message.
             */
            this.cpu.yieldCPU();
        }
    };

    /**
     * traceInit()
     *
     * @this {Debugger}
     */
    Debugger.prototype.traceInit = function()
    {
        if (DEBUG) {
            this.traceEnabled = {};
            for (var prop in Debugger.TRACE) {
                this.traceEnabled[prop] = false;
            }
            this.iTraceBuffer = 0;
            this.aTraceBuffer = [];     // we now defer TRACE_LIMIT allocation until the first traceLog() call
        }
    };

    /**
     * traceLog(prop, dst, src, flagsIn, flagsOut, result)
     *
     * @this {Debugger}
     * @param {string} prop
     * @param {number} dst
     * @param {number} src
     * @param {number|null} flagsIn
     * @param {number|null} flagsOut
     * @param {number} result
     */
    Debugger.prototype.traceLog = function(prop, dst, src, flagsIn, flagsOut, result)
    {
        if (DEBUG) {
            if (this.traceEnabled !== undefined && this.traceEnabled[prop]) {
                var trace = Debugger.TRACE[prop];
                var len = (trace.size >> 2);
                var s = str.toHexAddr(this.cpu.opEA - this.cpu.segCS.base, this.cpu.segCS.sel) + " " + Debugger.asIns[trace.ins] + "(" + str.toHex(dst, len) + "," + str.toHex(src, len) + "," + (flagsIn === null? "-" : str.toHexWord(flagsIn)) + ") " + str.toHex(result, len) + "," + (flagsOut === null? "-" : str.toHexWord(flagsOut));
                if (!this.aTraceBuffer.length) this.aTraceBuffer = new Array(Debugger.TRACE_LIMIT);
                this.aTraceBuffer[this.iTraceBuffer++] = s;
                if (this.iTraceBuffer >= this.aTraceBuffer.length) {
                    /*
                     * Instead of wrapping the buffer, we're going to turn all tracing off.
                     *
                     *      this.iTraceBuffer = 0;
                     */
                    for (prop in this.traceEnabled) {
                        this.traceEnabled[prop] = false;
                    }
                    this.println("trace buffer full");
                }
            }
        }
    };

    /**
     * init()
     *
     * @this {Debugger}
     */
    Debugger.prototype.init = function()
    {
        this.println("Type ? for list of debugger commands");
    };

    /**
     * initHistory()
     *
     * This function is intended to be called by the constructor, reset(), addBreakpoint(), findBreakpoint()
     * and any other function that changes the checksEnabled() criteria used to decide whether checkInstruction()
     * should be called.
     *
     * That is, if the history arrays need to be allocated and haven't already been allocated, then allocate them,
     * and if the arrays are no longer needed, then deallocate them.
     *
     * @this {Debugger}
     */
    Debugger.prototype.initHistory = function()
    {
        var i;
        if (!this.checksEnabled()) {
            this.iOpcodeHistory = 0;
            this.aOpcodeHistory = [];
            this.aaOpcodeCounts = [];
            return;
        }
        if (!this.aOpcodeHistory || !this.aOpcodeHistory.length) {
            this.aOpcodeHistory = new Array(10000);
            for (i = 0; i < this.aOpcodeHistory.length; i++) {
                /*
                 * Preallocate dummy Addr (Array) objects in every history slot, so that checkInstruction()
                 * doesn't need to call newAddr() on every slot update.
                 */
                this.aOpcodeHistory[i] = [0, null, 0];
            }
            this.iOpcodeHistory = 0;
        }
        if (!this.aaOpcodeCounts || !this.aaOpcodeCounts.length) {
            this.aaOpcodeCounts = new Array(256);
            for (i = 0; i < this.aaOpcodeCounts.length; i++) {
                this.aaOpcodeCounts[i] = [i, 0];
            }
        }
    };

    /**
     * runCPU(fOnClick)
     *
     * @this {Debugger}
     * @param {boolean} [fOnClick] is true if called from a click handler that might have stolen focus
     * @return {boolean} true if run request successful, false if not
     */
    Debugger.prototype.runCPU = function(fOnClick)
    {
        if (!this.isCPUAvail()) return false;
        this.cpu.runCPU(fOnClick);
        return true;
    };

    /**
     * stepCPU(nCycles, fRegs, fUpdateCPU)
     *
     * @this {Debugger}
     * @param {number} nCycles (0 for one instruction without checking breakpoints)
     * @param {boolean} [fRegs] is true to display registers after step (default is false)
     * @param {boolean} [fUpdateCPU] is false to disable calls to updateCPU() (default is true)
     * @return {boolean}
     */
    Debugger.prototype.stepCPU = function(nCycles, fRegs, fUpdateCPU)
    {
        if (!this.isCPUAvail()) return false;

        this.nCycles = 0;
        do {
            if (!nCycles) {
                /*
                 * In the single-step case (n == 0), the CPU won't call checkInstruction(), which
                 * is good for avoiding breakpoints, but bad for our instruction data collection if
                 * checks are enabled.
                 */
                if (this.checksEnabled()) this.checkInstruction(this.cpu.regEIP, true);
            }
            try {
                var nCyclesStep = this.cpu.stepCPU(nCycles);
                if (nCyclesStep > 0) {
                    this.nCycles += nCyclesStep;
                    this.cpu.addCycles(nCyclesStep, true);
                    this.cpu.updateChecksum(nCyclesStep);
                    this.cInstructions++;
                }
            }
            catch (e) {
                this.nCycles = 0;
                this.cpu.setError(e.message || e);
            }
        } while (this.cpu.opFlags & X86.OPFLAG.PREFIXES);

        /*
         * Because we called cpu.stepCPU() and not cpu.runCPU(), we must nudge the cpu's update code,
         * and then update our own state.  Normally, the only time fUpdateCPU will be false is when doStep()
         * is calling us in a loop, in which case it will perform its own updateCPU() when it's done.
         */
        if (fUpdateCPU !== false) this.cpu.updateCPU();

        this.updateStatus(fRegs || false, false);
        return (this.nCycles > 0);
    };

    /**
     * stopCPU(s)
     *
     * @this {Debugger}
     * @param {string} [s]
     */
    Debugger.prototype.stopCPU = function(s)
    {
        if (s) this.message(s);
        this.cpu.stopCPU();
    };

    /**
     * updateStatus(fRegs, fCompact)
     *
     * @this {Debugger}
     * @param {boolean} [fRegs] (default is true)
     * @param {boolean} [fCompact] (default is true)
     */
    Debugger.prototype.updateStatus = function(fRegs, fCompact)
    {
        if (fRegs === undefined) fRegs = true;
        if (fCompact === undefined) fCompact = true;

        this.aAddrNextCode = this.newAddr(this.cpu.regIP, this.cpu.segCS.sel);
        /*
         * this.fProcStep used to be a simple boolean, but now it's 0 (or undefined)
         * if inactive, 1 if stepping over an instruction without a register dump, or 2
         * if stepping over an instruction with a register dump.
         */
        if (!fRegs || this.fProcStep == 1)
            this.doUnassemble();
        else {
            this.doRegisters(null, fCompact);
        }
    };

    /**
     * isCPUAvail()
     *
     * Make sure the CPU is ready (finished initializing), not busy (already running), and not in an error state.
     *
     * @this {Debugger}
     * @return {boolean}
     */
    Debugger.prototype.isCPUAvail = function()
    {
        if (!this.cpu)
            return false;
        if (!this.cpu.isReady())
            return false;
        if (!this.cpu.isPowered())
            return false;
        if (this.cpu.isBusy())
            return false;
        return !this.cpu.isError();
    };

    /**
     * powerUp(data, fRepower)
     *
     * @this {Debugger}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    Debugger.prototype.powerUp = function(data, fRepower)
    {
        if (!fRepower) {
            /*
             * Because Debugger save/restore support is somewhat limited (and didn't always exist),
             * we deviate from the typical save/restore design pattern: instead of reset OR restore,
             * we always reset and then perform a (potentially limited) restore.
             */
            this.reset(true);
            this.println(data? "resuming" : "powering up");
            if (data && this.restore) {
                if (!this.restore(data)) return false;
            }
        }
        return true;
    };

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {Debugger}
     * @param {boolean} fSave
     * @param {boolean} [fShutdown]
     * @return {Object|boolean}
     */
    Debugger.prototype.powerDown = function(fSave, fShutdown)
    {
        if (fShutdown) this.println(fSave? "suspending" : "shutting down");
        return fSave && this.save? this.save() : true;
    };

    /**
     * reset(fQuiet)
     *
     * This is a notification handler, called by the Computer, to inform us of a reset.
     *
     * @this {Debugger}
     * @param {boolean} fQuiet (true only when called from our own powerUp handler)
     */
    Debugger.prototype.reset = function(fQuiet)
    {
        this.initHistory();
        this.cInstructions = 0;
        this.nCycles = 0;
        this.aAddrNextCode = this.newAddr(this.cpu.regIP, this.cpu.segCS.sel);
        /*
         * fRunning is set by start() and cleared by stop().  In addition, we clear
         * it here, so that if the CPU is reset while running, we can prevent stop()
         * from unnecessarily dumping the CPU state.
         */
        if (this.aFlags.fRunning !== undefined && !fQuiet) this.println("reset");
        this.aFlags.fRunning = false;
        this.clearTempBreakpoint();
        if (!fQuiet) this.updateStatus();
    };

    /**
     * save()
     *
     * This implements (very rudimentary) save support for the Debugger component.
     *
     * @this {Debugger}
     * @return {Object}
     */
    Debugger.prototype.save = function()
    {
        var state = new State(this);
        state.set(0, this.aAddrNextCode);
        state.set(1, this.aAddrAssemble);
        state.set(2, [this.prevCmd, this.fAssemble, this.bitsMessageEnabled]);
        return state.data();
    };

    /**
     * restore(data)
     *
     * This implements (very rudimentary) restore support for the Debugger component.
     *
     * @this {Debugger}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    Debugger.prototype.restore = function(data)
    {
        var i = 0;
        if (data[2] !== undefined) {
            this.aAddrNextCode = data[i++];
            this.aAddrAssemble = data[i++];
            this.prevCmd = data[i][0];
            this.fAssemble = data[i][1];
            if (!this.bitsMessageEnabled) {
                /*
                 * It's actually kinda annoying that a restored (or predefined) state will trump my initial state,
                 * at least in situations where I've changed the initial state, if I want to diagnose something.
                 * Perhaps I should save/restore both the initial and current bitsMessageEnabled, and if the initial
                 * values don't agree, then leave the current value alone.
                 *
                 * But, it's much easier to just leave bitsMessageEnabled alone whenever it already contains set bits.
                 */
                this.bitsMessageEnabled = data[i][2];
            }
        }
        return true;
    };

    /**
     * start(ms, nCycles)
     *
     * This is a notification handler, called by the Computer, to inform us the CPU has started.
     *
     * @this {Debugger}
     * @param {number} ms
     * @param {number} nCycles
     */
    Debugger.prototype.start = function(ms, nCycles)
    {
        if (!this.fProcStep) this.println("running");
        this.aFlags.fRunning = true;
        this.msStart = ms;
        this.nCyclesStart = nCycles;
    };

    /**
     * stop(ms, nCycles)
     *
     * This is a notification handler, called by the Computer, to inform us the CPU has now stopped.
     *
     * @this {Debugger}
     * @param {number} ms
     * @param {number} nCycles
     */
    Debugger.prototype.stop = function(ms, nCycles)
    {
        if (this.aFlags.fRunning) {
            this.aFlags.fRunning = false;
            this.nCycles = nCycles - this.nCyclesStart;
            if (!this.fProcStep) {
                var sStopped = "stopped";
                if (this.nCycles) {
                    var msTotal = ms - this.msStart;
                    var nCyclesPerSecond = (msTotal > 0? Math.round(this.nCycles * 1000 / msTotal) : 0);
                    sStopped += " (";
                    if (this.checksEnabled()) sStopped += this.cInstructions + " ops, ";
                    sStopped += this.nCycles + " cycles, " + msTotal + " ms, " + nCyclesPerSecond + " hz)";
                    if (MAXDEBUG && this.chipset) {
                        var i, c, n;
                        for (i = 0; i < this.chipset.acInterrupts.length; i++) {
                            c = this.chipset.acInterrupts[i];
                            if (!c) continue;
                            n = c / Math.round(msTotal / 1000);
                            this.println("IRQ" + i + ": " + c + " interrupts (" + n + " per sec)");
                            this.chipset.acInterrupts[i] = 0;
                        }
                        for (i = 0; i < this.chipset.acTimersFired.length; i++) {
                            c = this.chipset.acTimersFired[i];
                            if (!c) continue;
                            n = c / Math.round(msTotal / 1000);
                            this.println("TIMER" + i + ": " + c + " fires (" + n + " per sec)");
                            this.chipset.acTimersFired[i] = 0;
                        }
                        n = 0;
                        for (i = 0; i < this.chipset.acTimer0Counts.length; i++) {
                            var a = this.chipset.acTimer0Counts[i];
                            n += a[0];
                            this.println("TIMER0 update #" + i + ": [" + a[0] + "," + a[1] + "," + a[2] + "]");
                        }
                        this.chipset.acTimer0Counts = [];
                    }
                }
                this.println(sStopped);
            }
            this.updateStatus(true, this.fProcStep != 2);
            this.setFocus();
            this.clearTempBreakpoint(this.cpu.regEIP);
        }
    };

    /**
     * checksEnabled(fBreak)
     *
     * This "check" function is called by the CPU; we indicate whether or not every instruction needs to be checked.
     *
     * Originally, this returned true even when there were only read and/or write breakpoints, but those breakpoints
     * no longer require the intervention of checkInstruction(); the Bus component automatically swaps in/out appropriate
     * functions to deal with those breakpoints in the appropriate memory blocks.  So I've simplified the test below.
     *
     * @this {Debugger}
     * @param {boolean} [fBreak] is true if the caller really wants to break (default is false)
     * @return {boolean} true if every instruction needs to pass through checkInstruction(), false if not
     */
    Debugger.prototype.checksEnabled = function(fBreak)
    {
        return ((DEBUG && !fBreak)? true : (this.aBreakExec.length > 1 || this.messageEnabled(Debugger.MESSAGE.INT) /* || this.aBreakRead.length > 1 || this.aBreakWrite.length > 1 */));
    };

    /**
     * checkInstruction(addr, fSkipBP)
     *
     * This "check" function is called by the CPU to inform us about the next instruction to be executed,
     * giving us an opportunity to look for "exec" breakpoints and update opcode frequencies and instruction history.
     *
     * @this {Debugger}
     * @param {number} addr
     * @param {boolean} [fSkipBP] is true to skip breakpoint check
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkInstruction = function(addr, fSkipBP)
    {
        /*
         * Assert that general-purpose register contents remain within their respective ranges;
         * this isn't intended to be complete, just a spot-check.
         */
        if (DEBUG) this.assert(!(this.cpu.regAX & ~0xffff) && !(this.cpu.regBX & ~0xffff) && !(this.cpu.regCX & ~0xffff) && !(this.cpu.regDX & ~0xffff), "register out of bounds");

        if (!fSkipBP && this.checkBreakpoint(addr, this.aBreakExec)) {
            return true;
        }

        /*
         * The rest of the instruction tracking logic can only be performed if initHistory() has allocated
         * the necessary data structures; note that there is no explicit UI for enabling/disabling history,
         * other than adding/removing breakpoints, simply because it's breakpoints that trigger the call to
         * checkInstruction() -- well, OK, and a few other things now, like enabling MESSAGE_INT messages.
         */
        if (this.aaOpcodeCounts.length) {

            this.cInstructions++;
            var bOpcode = this.bus.getByteDirect(addr);
            this.aaOpcodeCounts[bOpcode][1]++;

            /*
             * This is a good example of what NOT to do in a high-frequency function, and defeats
             * the purpose of preallocating and preinitializing the history array in initHistory():
             *
             *      this.aOpcodeHistory[this.iOpcodeHistory] = this.newAddr(this.cpu.regIP, this.cpu.segCS.sel, addr);
             *
             * As the name implies, newAddr() returns a new "Addr" (Array) object every time it's called.
             */
            var a = this.aOpcodeHistory[this.iOpcodeHistory];
            a[0] = this.cpu.regIP;
            a[1] = this.cpu.segCS.sel;
            a[2] = addr;
            if (++this.iOpcodeHistory == this.aOpcodeHistory.length) this.iOpcodeHistory = 0;
        }
        return false;
    };

    /**
     * checkMemoryRead(addr)
     *
     * This "check" function is called by a Memory block to inform us that a memory read occurred, giving us an
     * opportunity to track the read if we want, and look for a matching "read" breakpoint, if any.
     *
     * @this {Debugger}
     * @param {number} addr
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkMemoryRead = function(addr)
    {
        if (this.checkBreakpoint(addr, this.aBreakRead)) {
            this.cpu.stopCPU(true);
            return true;
        }
        return false;
    };

    /**
     * checkMemoryWrite(addr)
     *
     * This "check" function is called by a Memory block to inform us that a memory write occurred, giving us an
     * opportunity to track the write if we want, and look for a matching "write" breakpoint, if any.
     *
     * @this {Debugger}
     * @param {number} addr
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkMemoryWrite = function(addr)
    {
        if (this.checkBreakpoint(addr, this.aBreakWrite)) {
            this.cpu.stopCPU(true);
            return true;
        }
        return false;
    };

    /**
     * checkPortInput(port, bIn)
     *
     * This "check" function is called by the Bus component to inform us that port input occurred.
     *
     * @this {Debugger}
     * @param {number} port
     * @param {number} bIn
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkPortInput = function(port, bIn)
    {
        /*
         * We trust that the Bus component won't call us unless we told it to, so we halt unconditionally
         */
        this.println("break on input from port " + str.toHexWord(port) + ": " + str.toHexByte(bIn));
        this.cpu.stopCPU(true);
        return true;
    };

    /**
     * checkPortOutput(port, bOut)
     *
     * This "check" function is called by the Bus component to inform us that port output occurred.
     *
     * @this {Debugger}
     * @param {number} port
     * @param {number} bOut
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkPortOutput = function(port, bOut)
    {
        /*
         * We trust that the Bus component won't call us unless we told it to, so we halt unconditionally
         */
        this.println("break on output to port " + str.toHexWord(port) + ": " + str.toHexByte(bOut));
        this.cpu.stopCPU(true);
        return true;
    };

    /**
     * getSegment(sel)
     *
     * If the selector matches that of any of the CPU segment registers, then return the CPU's segment
     * register, instead of creating our own dummy segment register.  This makes it possible for us to
     * see what the CPU is seeing at certain critical junctures, such as after an LMSW instruction has
     * switched the processor from real to protected mode.  Actually loading the selector from the GDT/LDT
     * should be done only as a last resort.
     *
     * @param {number} sel
     * @return {X86Seg} seg
     */
    Debugger.prototype.getSegment = function(sel)
    {
        if (sel == this.cpu.segCS.sel) return this.cpu.segCS;
        if (sel == this.cpu.segDS.sel) return this.cpu.segDS;
        if (sel == this.cpu.segES.sel) return this.cpu.segES;
        if (sel == this.cpu.segSS.sel) return this.cpu.segSS;
        var seg = new X86Seg(this.cpu, X86Seg.ID.OTHER, "DBG");
        /*
         * TODO: Confirm that it's OK for this function to drop any error from seg.load() on the floor....
         */
        seg.load(sel, true);
        return seg;
    };

    /**
     * getAddr(aAddr, fWrite, cb)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {boolean} [fWrite]
     * @param {number} [cb] is number of extra bytes to check (0 or 1)
     * @return {number} is the corresponding physical address, or -1 if there's an error
     */
    Debugger.prototype.getAddr = function(aAddr, fWrite, cb)
    {
        /*
         * Some addresses (eg, breakpoint addresses) save their original physical address
         * in aAddr[2], so we want to use that if it's there, but otherwise, aAddr is assumed
         * to be a virtual address ([off, seg]) whose physical address must be calculated based
         * on current machine state (mode, active descriptor tables, etc).
         */
        var addr = aAddr[2];
        if (addr == null) {
            var seg = this.getSegment(aAddr[1]);
            if (!fWrite) {
                addr = seg.checkRead(aAddr[0], cb || 0, true);
            } else {
                addr = seg.checkWrite(aAddr[0], cb || 0, true);
            }
        }
        /*
         * Map addresses in the top 64Kb (at the top of the 16Mb range) to the top of the 1Mb range.
         */
        if ((addr & 0xFF0000) == 0xFF0000) addr &= 0x0FFFFF;
        return addr;
    };

    /**
     * getByte(aAddr, inc)
     *
     * getByte() should be used for all Debugger memory reads (eg, doDump, doUnassemble), to ensure
     * all notification handlers are bypassed for physical addresses; for segmented addresses, we must
     * use the CPU's X86Seg load() logic, but we don't call the CPU's getSOByte() or getByte() functions,
     * to avoid triggering any memory read notifications.
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} [inc]
     * @return {number}
     */
    Debugger.prototype.getByte = function(aAddr, inc)
    {
        var b = 0xff;
        var addr = this.getAddr(aAddr, false, 0);
        if (addr >= 0) {
            b = this.bus.getByteDirect(addr);
            if (DEBUG) this.assert((b == (b & 0xff)), "invalid byte (" + b + ") at address: " + this.hexAddr(aAddr));
            if (inc !== undefined) this.incAddr(aAddr, inc);
        }
        return b;
    };

    /**
     * getWord(aAddr, inc)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} [inc]
     * @return {number}
     */
    Debugger.prototype.getWord = function(aAddr, inc)
    {
        var w = 0xffff;
        var addr = this.getAddr(aAddr, false, 1);
        if (addr >= 0) {
            w = this.bus.getWordDirect(addr);
            if (DEBUG) this.assert((w == (w & 0xffff)), "invalid word (" + w + ") at address: " + this.hexAddr(aAddr));
            if (inc !== undefined) this.incAddr(aAddr, inc);
        }
        return w;
    };

    /**
     * setByte(aAddr, b, inc)
     *
     * setByte() should be used for all Debugger memory writes (eg, doAssemble, doEdit), to insure
     * all memory notification handlers are bypassed; in addition, we want the Debugger to be able to
     * change the contents of the simulated ROM images.
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} b
     * @param {number} [inc]
     */
    Debugger.prototype.setByte = function(aAddr, b, inc)
    {
        var addr = this.getAddr(aAddr, true, 0);
        if (addr >= 0) {
            this.bus.setByteDirect(addr, b);
            if (inc !== undefined) this.incAddr(aAddr, inc);
            this.cpu.updateCPU();
        }
    };

    /**
     * setWord(aAddr, w, inc)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} w
     * @param {number} [inc]
     */
    Debugger.prototype.setWord = function(aAddr, w, inc)
    {
        var addr = this.getAddr(aAddr, true, 1);
        if (addr >= 0) {
            this.bus.setWordDirect(addr, w);
            if (inc !== undefined) this.incAddr(aAddr, inc);
            this.cpu.updateCPU();
        }
    };

    /**
     * hexAddr(aAddr)
     *
     * @this {Debugger}
     * @param {Array} aAddr containing [off, seg]
     * @return {string} the hex representation of the address
     */
    Debugger.prototype.hexAddr = function(aAddr)
    {
        return aAddr[1] == null? ("%" + str.toHex(aAddr[2])) : str.toHexAddr(aAddr[0], aAddr[1]);
    };

    /**
     * incAddr(aAddr, inc)
     *
     * @this {Debugger}
     * @param {Array} aAddr containing [off, seg, addr]
     * @param {number|undefined} inc contains value to increment by (default is 1)
     */
    Debugger.prototype.incAddr = function(aAddr, inc)
    {
        inc = (inc === undefined? 1 : inc);
        if (aAddr[2] != null) {
            aAddr[2] += inc;
        }
        if (aAddr[1] != null) {
            aAddr[0] += inc;
            /*
             * TODO: Shouldn't we be using the segment (aAddr[1]) limit instead of 0xffff?
             */
            if (aAddr[0] != (aAddr[0] & 0xffff)) {
                aAddr[0] = aAddr[0] & 0xffff;
                aAddr[2] = null;
            }
        }
    };

    /**
     * newAddr(off, seg, addr)
     *
     * @this {Debugger}
     * @param {number} off
     * @param {number} seg
     * @param {number} [addr] is the physical address, if known
     * @return {Array} containing [off, seg, addr]
     */
    Debugger.prototype.newAddr = function(off, seg, addr)
    {
        return [off, seg, addr];
    };

    /**
     * clearBreakpoints()
     *
     * @this {Debugger}
     */
    Debugger.prototype.clearBreakpoints = function()
    {
        var i;
        this.aBreakExec = ["exec"];
        if (this.aBreakRead !== undefined) {
            for (i = 1; i < this.aBreakRead.length; i++) {
                this.bus.removeMemoryBreakpoint(this.getAddr(this.aBreakRead[i]), false);
            }
        }
        this.aBreakRead = ["read"];
        if (this.aBreakWrite !== undefined) {
            for (i = 1; i < this.aBreakWrite.length; i++) {
                this.bus.removeMemoryBreakpoint(this.getAddr(this.aBreakWrite[i]), true);
            }
        }
        this.aBreakWrite = ["write"];
    };

    /**
     * addBreakpoint(aBreak, aAddr, fTemp)
     *
     * @this {Debugger}
     * @param {Array} aBreak
     * @param {Array} aAddr
     * @param {boolean} [fTemp]
     * @return {boolean} true if breakpoint added, false if already exists
     */
    Debugger.prototype.addBreakpoint = function(aBreak, aAddr, fTemp)
    {
        if (!this.findBreakpoint(aBreak, aAddr)) {
            /*
             * Breakpoint addresses are managed slightly different than other addresses:
             * we calculate the physical address at the time the breakpoint is added and save
             * it in aAddr[2], so that a breakpoint set in one mode (eg, in real-mode) will still
             * work as intended if the mode changes later (eg, to protected-mode).
             */
            aAddr[2] = this.getAddr(aAddr);
            aAddr[3] = fTemp;
            aBreak.push(aAddr);
            if (aBreak != this.aBreakExec) {
                this.bus.addMemoryBreakpoint(this.getAddr(aAddr), aBreak == this.aBreakWrite);
            }
            if (!fTemp) this.println("breakpoint enabled: " + this.hexAddr(aAddr) + " (" + aBreak[0] + ")");
            this.initHistory();
            return true;
        }
        return false;
    };

    /**
     * findBreakpoint(aBreak, aAddr, fRemove)
     *
     * @this {Debugger}
     * @param {Array} aBreak
     * @param {Array} aAddr
     * @param {boolean} [fRemove]
     * @return {boolean} true if found, false if not
     */
    Debugger.prototype.findBreakpoint = function(aBreak, aAddr, fRemove)
    {
        var fFound = false;
        var addr = this.getAddr(aAddr);
        for (var i = 1; i < aBreak.length; i++) {
            var aAddrBreak = aBreak[i];
            if (addr == this.getAddr(aAddrBreak)) {
                fFound = true;
                if (fRemove) {
                    aBreak.splice(i, 1);
                    if (aBreak != this.aBreakExec) {
                        this.bus.removeMemoryBreakpoint(addr, aBreak == this.aBreakWrite);
                    }
                    if (!aAddrBreak[3]) this.println("breakpoint cleared: " + this.hexAddr(aAddrBreak) + " (" + aBreak[0] + ")");
                    this.initHistory();
                    break;
                }
                this.println("breakpoint exists: " + this.hexAddr(aAddrBreak) + " (" + aBreak[0] + ")");
                break;
            }
        }
        return fFound;
    };

    /**
     * listBreakpoints(aBreak)
     *
     * TODO: We may need to start listing the physical addresses of breakpoints, because
     * segmented address can be ambiguous.
     *
     * @this {Debugger}
     * @param {Array} aBreak
     * @return {number} of breakpoints listed, 0 if none
     */
    Debugger.prototype.listBreakpoints = function(aBreak)
    {
        for (var i = 1; i < aBreak.length; i++) {
            this.println("breakpoint enabled: " + this.hexAddr(aBreak[i]) + " (" + aBreak[0] + ")");
        }
        return aBreak.length - 1;
    };

    /**
     * redoBreakpoints()
     *
     * This function is for the Memory component: whenever the Bus allocates a new Memory block, it calls
     * the block's setDebugInfo() method, which clears the memory block's breakpoint counts.  setDebugInfo(),
     * in turn, must call this function to re-apply any existing breakpoints to that block.
     *
     * This ensures that, even if a memory region is remapped (which creates new Memory blocks in the process),
     * any breakpoints that were previously applied to that region will still work.
     *
     * @this {Debugger}
     * @param {number} addr of memory block
     * @param {number} size of memory block
     * @param {Array} [aBreak]
     */
    Debugger.prototype.redoBreakpoints = function(addr, size, aBreak)
    {
        if (aBreak === undefined) {
            this.redoBreakpoints(addr, size, this.aBreakRead);
            this.redoBreakpoints(addr, size, this.aBreakWrite);
            return;
        }
        for (var i = 1; i < aBreak.length; i++) {
            var addrBreak = this.getAddr(aBreak[i]);
            if (addrBreak >= addr && addrBreak < addr + size) {
                this.bus.addMemoryBreakpoint(addrBreak, aBreak == this.aBreakWrite);
            }
        }
    };

    /**
     * setTempBreakpoint(aAddr)
     *
     * @this {Debugger}
     * @param {Array} aAddr of new temp breakpoint
     */
    Debugger.prototype.setTempBreakpoint = function(aAddr)
    {
        this.addBreakpoint(this.aBreakExec, aAddr, true);
    };

    /**
     * clearTempBreakpoint(addr)
     *
     * @this {Debugger}
     * @param {number|undefined} [addr] clear all temp breakpoints if no address specified
     */
    Debugger.prototype.clearTempBreakpoint = function(addr)
    {
        if (addr !== undefined) {
            this.checkBreakpoint(addr, this.aBreakExec, true);
            this.fProcStep = 0;
        } else {
            for (var i = 1; i < this.aBreakExec.length; i++) {
                var aAddrBreak = this.aBreakExec[i];
                if (aAddrBreak[3]) {
                    if (!this.findBreakpoint(this.aBreakExec, aAddrBreak, true)) break;
                    i = 0;
                }
            }
        }
    };

    /**
     * checkBreakpoint(addr, aBreak, fTemp)
     *
     * @this {Debugger}
     * @param {number} addr
     * @param {Array} aBreak
     * @param {boolean} [fTemp]
     * @return {boolean} true if breakpoint has been hit, false if not
     */
    Debugger.prototype.checkBreakpoint = function(addr, aBreak, fTemp)
    {
        /*
         * Time to check for execution breakpoints; note that this should be done BEFORE updating frequency
         * or history data (see checkInstruction), since we might not actually execute the current instruction.
         */
        var fBreak = false;

        /*
         * Map addresses in the top 64Kb (at the top of the 16Mb range) to the top of the 1Mb range.
         *
         * The fact that those two 64Kb regions are aliases of each other on an 80286 is a pain in the BUTT,
         * because any CS-based breakpoint you set immediately after a CPU reset will have a physical address
         * in the top 16Mb, yet after the first inter-segment JMP, you will be running in the first 1Mb.
         */
        if ((addr & 0xFF0000) == 0xFF0000) addr &= 0x0FFFFF;

        for (var i = 1; i < aBreak.length; i++) {
            var aAddrBreak = aBreak[i];
            if (addr == this.getAddr(aAddrBreak)) {
                if (aAddrBreak[3]) {
                    this.findBreakpoint(aBreak, aAddrBreak, true);
                } else if (!fTemp) {
                    this.println("breakpoint hit: " + this.hexAddr(aAddrBreak) + " (" + aBreak[0] + ")");
                }
                fBreak = true;
                break;
            }
        }
        return fBreak;
    };

    /**
     * getInstruction(aAddr, sComment, nSequence)
     *
     * @this {Debugger}
     * @param {Array} aAddr (updated to next instruction)
     * @param {string} [sComment] is an associated comment
     * @param {number} [nSequence] is an associated sequence number, undefined if none
     * @return {string}
     */
    Debugger.prototype.getInstruction = function(aAddr, sComment, nSequence)
    {
        var aAddrIns = this.newAddr(aAddr[0], aAddr[1], aAddr[2]);

        var bOpcode = this.getByte(aAddr, 1);
        var aOpDesc = this.aaOpDescs[bOpcode];
        var iIns = aOpDesc[0];
        var bModRM = -1;

        if (iIns == Debugger.INS.OP0F) {
            var b = this.getByte(aAddr, 1);
            aOpDesc = Debugger.aaOp0FDescs[b] || Debugger.aOpDescUndefined;
            bOpcode |= (b << 8);
            iIns = aOpDesc[0];
        }

        if (iIns >= Debugger.asIns.length) {
            bModRM = this.getByte(aAddr, 1);
            aOpDesc = Debugger.aaGrpDescs[iIns - Debugger.asIns.length][(bModRM >> 3) & 0x7];
        }

        var cOperands = 2;
        var sOperands = "";
        if (bOpcode >= X86.OPCODE.MOVSB && bOpcode <= X86.OPCODE.CMPSW || bOpcode >= X86.OPCODE.STOSB && bOpcode <= X86.OPCODE.SCASW) {
            cOperands = 0;              // HACK to suppress display of operands for the string instructions
        }

        for (var iOperand = 1; iOperand <= cOperands; iOperand++) {
            var sOperand = "";
            var type = aOpDesc[iOperand];
            if (type === undefined) continue;
            var typeSize = type & Debugger.TYPE_SIZE;
            if (typeSize == Debugger.TYPE_NONE || typeSize == Debugger.TYPE_PREFIX)
                continue;
            var typeMode = type & Debugger.TYPE_MODE;
            if (typeMode >= Debugger.TYPE_MODRM) {
                if (bModRM < 0) {
                    bModRM = this.getByte(aAddr, 1);
                }
                if (typeMode >= Debugger.TYPE_REG) {
                    sOperand = this.getRegOperand((bModRM >> 3) & 0x7, type, aAddr);
                }
                else if (typeMode >= Debugger.TYPE_MODRM) {
                    sOperand = this.getModRMOperand(bModRM, type, aAddr);
                }
            }
            else if (typeMode == Debugger.TYPE_ONE) {
                sOperand = "1";
            }
            else if (typeMode == Debugger.TYPE_IMM) {
                sOperand = this.getImmediateOperand(type, aAddr);
            }
            else if (typeMode == Debugger.TYPE_IMMOFF) {
                sOperand = "[" + str.toHexWord(this.getWord(aAddr, 2)) + "]";
            }
            else if (typeMode == Debugger.TYPE_IMMREL) {
                var disp;
                if (typeSize == Debugger.TYPE_BYTE) {
                    disp = this.getByte(aAddr, 1);
                    disp = ((disp << 24) >> 24);
                }
                else {
                    disp = this.getWord(aAddr, 2);
                }
                var offset = (aAddr[0] + disp) & 0xffff;
                var aSymbol = this.findSymbolAtAddr(this.newAddr(offset, aAddr[1]));
                sOperand = aSymbol[0] || str.toHexWord(offset);
            }
            else if (typeMode == Debugger.TYPE_IMPREG) {
                sOperand = Debugger.asRegs[(type & Debugger.TYPE_IREG) >> 8];
            }
            else if (typeMode == Debugger.TYPE_IMPSEG) {
                sOperand = Debugger.asRegs[((type & Debugger.TYPE_IREG) >> 8) + 16];
            }
            else if (typeMode == Debugger.TYPE_DSSI) {
                sOperand = "DS:[SI]";
            }
            else if (typeMode == Debugger.TYPE_ESDI) {
                sOperand = "ES:[DI]";
            }
            if (!sOperand.length) {
                sOperand = "type(" + str.toHexWord(type) + ")";
            }
            if (sOperands.length > 0) sOperands += ",";
            sOperands += sOperand;
        }

        var sLine = this.hexAddr(aAddrIns) + " ";
        var sBytes = "";
        do {
            sBytes += str.toHexByte(this.getByte(aAddrIns, 1));
        } while (aAddrIns[0] != aAddr[0]);
        sLine += (sBytes + "            ").substr(0, 14);
        sLine += (Debugger.asIns[aOpDesc[0]] + "       ").substr(0, 8);
        if (sOperands) sLine += " " + sOperands;

        if (sComment) {
            sLine += "                         ";
            sLine = sLine.substr(0, 50);
            sLine += ";";
            if (!this.cpu.aFlags.fChecksum) {
                sLine += sComment + (nSequence != null? '=' + nSequence.toString() : "");
            } else {
                var nCycles = this.cpu.getCycles();
                sLine += "cycles=" + nCycles.toString() + " cs=" + str.toHex(this.cpu.aCounts.nChecksum);
            }
        }
        return sLine;
    };

    /**
     * getImmediateOperand(type, aAddr)
     *
     * @this {Debugger}
     * @param {number} type
     * @param {Array} aAddr
     * @return {string} operand
     */
    Debugger.prototype.getImmediateOperand = function(type, aAddr)
    {
        var sOperand = " ";
        var typeSize = type & Debugger.TYPE_SIZE;
        switch (typeSize) {
            case Debugger.TYPE_BYTE:
                /*
                 * There's the occasional immediate byte we don't need to display (eg, the 0x0A
                 * following an AAM or AAD instruction), so we suppress the byte if it lacks a TYPE_IN
                 * or TYPE_OUT designation (and TYPE_BOTH, as it name implies, includes both).
                 */
                if (type & Debugger.TYPE_BOTH) {
                    sOperand = str.toHexByte(this.getByte(aAddr, 1));
                }
                break;
            case Debugger.TYPE_SBYTE:
                sOperand = str.toHexWord((this.getByte(aAddr, 1) << 24) >> 24);
                break;
            case Debugger.TYPE_WORD:
            case Debugger.TYPE_VWORD:
                sOperand = str.toHexWord(this.getWord(aAddr, 2));
                break;
            case Debugger.TYPE_FARP:
                sOperand = this.hexAddr(this.newAddr(this.getWord(aAddr, 2), this.getWord(aAddr, 2)));
                break;
            default:
                sOperand = "imm(" + str.toHexWord(type) + ")";
        }
        return sOperand;
    };

    /**
     * getRegOperand(bReg, type, aAddr)
     *
     * @this {Debugger}
     * @param {number} bReg
     * @param {number} type
     * @param {Array} aAddr
     * @return {string} operand
     */
    Debugger.prototype.getRegOperand = function(bReg, type, aAddr)
    {
        if ((type & Debugger.TYPE_MODE) == Debugger.TYPE_SEGREG)
            bReg += 16;
        else if ((type & Debugger.TYPE_SIZE) >= Debugger.TYPE_WORD)
            bReg += 8;
        return Debugger.asRegs[bReg];
    };

    /**
     * getModRMOperand(bModRM, type, aAddr)
     *
     * @this {Debugger}
     * @param {number} bModRM
     * @param {number} type
     * @param {Array} aAddr
     * @return {string} operand
     */
    Debugger.prototype.getModRMOperand = function(bModRM, type, aAddr)
    {
        var sOperand = "";
        var bMod = bModRM >> 6;
        var bRM = bModRM & 0x7;
        if (bMod < 3) {
            var disp;
            if (!bMod && bRM == 6) {
                disp = this.getWord(aAddr, 2);
                sOperand = str.toHexWord(disp);
            }
            else {
                sOperand = Debugger.asRM[bRM];
                if (bMod == 1) {
                    disp = this.getByte(aAddr, 1);
                    if (!(disp & 0x80)) {
                        sOperand += "+" + str.toHexByte(disp);
                    }
                    else {
                        disp = ((disp << 24) >> 24);
                        sOperand += "-" + str.toHexByte(-disp);
                    }
                }
                else if (bMod == 2) {
                    disp = this.getWord(aAddr, 2);
                    sOperand += "+" + str.toHexWord(disp);
                }
            }
            sOperand = "[" + sOperand + "]";
        }
        else {
            sOperand = Debugger.asRegs[bRM + ((type & Debugger.TYPE_SIZE) == Debugger.TYPE_BYTE? 0 : 8)];
        }
        return sOperand;
    };

    /**
     * parseInstruction(sOp, sOperand, addr)
     *
     * This generally requires an exact match of both the operation code (sOp) and mode operand
     * (sOperand) against the aOps[] and aOpMods[] arrays, respectively; however, the regular
     * expression built from aOpMods and stored in regexOpModes does relax the matching criteria
     * slightly; ie, a 4-digit hex value ("nnnn") will be satisfied with either 3 or 4 digits, and
     * similarly, a 2-digit hex address (nn) will be satisfied with either 1 or 2 digits.
     *
     * Note that this function does not actually store the instruction into memory, even though it requires
     * a target address (addr); that parameter is currently needed ONLY for "branch" instructions, because in
     * order to calculate the branch displacement, it needs to know where the instruction will ultimately be
     * stored, relative to its target address.
     *
     * Another handy feature of this function is its ability to display all available modes for a particular
     * operation. For example, while in "assemble mode", if one types:
     *
     *      ldy?
     *
     * the Debugger will display:
     *
     *      supported opcodes:
     *           A0: LDY nn
     *           A4: LDY [nn]
     *           AC: LDY [nnnn]
     *           B4: LDY [nn+X]
     *           BC: LDY [nnnn+X]
     *
     * Use of a trailing "?" on any opcode will display all variations of that opcode; no instruction will be
     * assembled, and the operand parameter, if any, will be ignored.
     *
     * Although this function is capable of reporting numerous errors, roughly half of them indicate internal
     * consistency errors, not user errors; the former should really be asserts, but I'm not comfortable bombing
     * out because of my error as opposed to their error.  The only errors a user should expect to see:
     *
     *      "unknown operation":    sOp is not a valid operation (per aOps)
     *      "unknown operand":      sOperand is not a valid operand (per aOpMods)
     *      "unknown instruction":  the combination of sOp + sOperand does not exist (per aaOpDescs)
     *      "branch out of range":  the branch address, relative to addr, is too far away
     *
     * @this {Debugger}
     * @param {string} sOp
     * @param {string|undefined} sOperand
     * @param {Array} aAddr of memory where this instruction is being assembled
     * @return {Array.<number>} of opcode bytes; if the instruction can't be parsed, the array will be empty
     */
    Debugger.prototype.parseInstruction = function(sOp, sOperand, aAddr)
    {
        var aOpBytes = [];
        this.println("not supported yet");
        return aOpBytes;
    };

    /**
     * getFlagStr(sFlag)
     *
     * @this {Debugger}
     * @param {string} sFlag
     * @return {string} value of flag
     */
    Debugger.prototype.getFlagStr = function(sFlag)
    {
        var b;
        switch (sFlag) {
            case "V":
                b = this.cpu.getOF();
                break;
            case "D":
                b = this.cpu.getDF();
                break;
            case "I":
                b = this.cpu.getIF();
                break;
            case "T":
                b = this.cpu.getTF();
                break;
            case "S":
                b = this.cpu.getSF();
                break;
            case "Z":
                b = this.cpu.getZF();
                break;
            case "A":
                b = this.cpu.getAF();
                break;
            case "P":
                b = this.cpu.getPF();
                break;
            case "C":
                b = this.cpu.getCF();
                break;
            default:
                b = 0;
                break;
        }
        return " " + sFlag + (b? "1" : "0");
    };

    /**
     * getSegStr(seg)
     *
     * @this {Debugger}
     * @param {X86Seg} seg
     * @param {boolean} [fProt]
     * @return {string}
     */
    Debugger.prototype.getSegStr = function(seg, fProt)
    {
        return seg.sName + '=' + str.toHexWord(seg.sel) + (fProt? '[' + str.toHex(seg.base, this.cchAddr) + ',' + str.toHexWord(seg.limit) + ']' : "");
    };

    /**
     * getDTRStr(seg)
     *
     * @this {Debugger}
     * @param {string} sName
     * @param {number|null} sel
     * @param {number} addr
     * @param {number} addrLimit
     * @return {string}
     */
    Debugger.prototype.getDTRStr = function(sName, sel, addr, addrLimit)
    {
        return sName + '=' + (sel != null? str.toHexWord(sel) : "") + '[' + str.toHex(addr, this.cchAddr) + ',' + str.toHexWord(addrLimit - addr) + ']';
    };

    /**
     * getRegStr(fProt)
     *
     * @this {Debugger}
     * @param {boolean} [fProt]
     * @return {string}
     */
    Debugger.prototype.getRegStr = function(fProt)
    {
        if (fProt === undefined) {
            fProt = !!(this.cpu.regMSW & X86.MSW.PE);
        }
        var s = "AX=" + str.toHexWord(this.cpu.regAX) +
               " BX=" + str.toHexWord(this.cpu.regBX) +
               " CX=" + str.toHexWord(this.cpu.regCX) +
               " DX=" + str.toHexWord(this.cpu.regDX) +
               " SP=" + str.toHexWord(this.cpu.regSP) +
               " BP=" + str.toHexWord(this.cpu.regBP) +
               " SI=" + str.toHexWord(this.cpu.regSI) +
               " DI=" + str.toHexWord(this.cpu.regDI) + '\n';
        s += this.getSegStr(this.cpu.segDS, fProt) + ' ' + this.getSegStr(this.cpu.segES, fProt) + ' ' + this.getSegStr(this.cpu.segSS, fProt);
        s += (fProt? '\n' : ' ');
        s += this.getSegStr(this.cpu.segCS, fProt) + " IP=" + str.toHexWord(this.cpu.regIP) +
             this.getFlagStr("V") + this.getFlagStr("D") + this.getFlagStr("I") + this.getFlagStr("T") +
             this.getFlagStr("S") + this.getFlagStr("Z") + this.getFlagStr("A") + this.getFlagStr("P") + this.getFlagStr("C") +
             " PS=" + str.toHexWord(this.cpu.getPS());
        if (fProt) {
            s += " MS=" + str.toHexWord(this.cpu.regMSW) + '\n' +
                this.getDTRStr("LD", this.cpu.segLDT.sel, this.cpu.segLDT.base, this.cpu.segLDT.base + this.cpu.segLDT.limit) + ' ' +
                this.getDTRStr("GD", null, this.cpu.addrGDT, this.cpu.addrGDTLimit) + ' ' +
                this.getDTRStr("ID", null, this.cpu.addrIDT, this.cpu.addrIDTLimit) + "  TR=" + str.toHexWord(this.cpu.segTSS.sel) +
                " A20=" + (this.bus.getA20()? "ON" : "OFF");
        }
        return s;
    };

    /**
     * parseAddr(sAddr, type)
     *
     * As discussed above, the format of aAddr variables is [off, seg, addr]; they represent a segmented
     * address (seg:off) when seg is defined or a physical address (addr) when seg is undefined (or null).
     *
     * To create a segmented address, specify two values separated by ":"; for a physical address, use
     * a "%" prefix.  We check for ":" after "%", so if for some strange reason you specify both, the
     * address will be treated as segmented, not physical.
     *
     * The "%" syntax is similar to that used by the Windows 80386 kernel debugger (wdeb386) for linear
     * addresses.  If/when we add support for processors with page tables, we will likely adopt the same
     * convention for linear addresses and provide a different syntax (eg, "%%") physical memory references.
     *
     * Address evaluation and validation (eg, range checks) are no longer performed at this stage.  That's
     * done later, by getAddr(), which returns a negative result (-1) for invalid segments, out-of-range offsets,
     * etc.  The Debugger's low-level get/set memory functions verify all getAddr() results, but even if an
     * invalid address is passed through to the Bus memory interfaces, the address will simply be masked with
     * Bus.addrLimit; in the case of -1, that will generally refer to the last byte of physical address space.
     *
     * @this {Debugger}
     * @param {string|undefined} sAddr
     * @param {number|undefined} type is the address segment type, in case sAddr doesn't specify a segment
     * @return {Array} aAddr
     */
    Debugger.prototype.parseAddr = function(sAddr, type)
    {
        var aAddrNext = (type == Debugger.ADDR_DATA? this.aAddrNextData : this.aAddrNextCode);

        var off = aAddrNext[0], seg = aAddrNext[1], addr = aAddrNext[2];

        if (sAddr !== undefined) {

            if (sAddr.charAt(0) == '%') {
                sAddr = sAddr.substr(1);
                seg = null;
                addr = 0;
            }

            var aAddr = this.findSymbolAddr(sAddr);
            if (aAddr && aAddr.length) return aAddr;

            var iColon = sAddr.indexOf(":");
            if (iColon < 0) {
                if (seg != null) {
                    off = this.parseValue(sAddr);
                    addr = null;
                } else {
                    addr = this.parseValue(sAddr);
                }
            }
            else {
                seg = this.parseValue(sAddr.substring(0, iColon));
                off = this.parseValue(sAddr.substring(iColon + 1));
                addr = null;
            }
        }
        return [off, seg, addr];
    };

    /**
     * parseValue(sValue, sName)
     *
     * @this {Debugger}
     * @param {string|undefined} sValue
     * @param {string} [sName] is the name of the value, if any
     * @return {number|undefined} numeric value, or undefined if sValue is either undefined or invalid
     */
    Debugger.prototype.parseValue = function(sValue, sName)
    {
        var value;
        if (sValue !== undefined) {
            sValue = sValue.toUpperCase();
            switch (sValue) {
                case "AX":
                    value = this.cpu.regAX;
                    break;
                case "BX":
                    value = this.cpu.regBX;
                    break;
                case "CX":
                    value = this.cpu.regCX;
                    break;
                case "DX":
                    value = this.cpu.regDX;
                    break;
                case "SI":
                    value = this.cpu.regSI;
                    break;
                case "DI":
                    value = this.cpu.regDI;
                    break;
                case "BP":
                    value = this.cpu.regBP;
                    break;
                case "SP":
                    value = this.cpu.regSP;
                    break;
                case "CS":
                    value = this.cpu.segCS.sel;
                    break;
                case "DS":
                    value = this.cpu.segDS.sel;
                    break;
                case "ES":
                    value = this.cpu.segES.sel;
                    break;
                case "SS":
                    value = this.cpu.segSS.sel;
                    break;
                /*
                 * I used to alias "PC" to "IP", until I discovered that early (perhaps even ALL) versions of DEBUG.COM
                 * treat "PC" as an alias for the 16-bit flags register.  So for purposes of parseValue(), "PC" has been removed.
                 */
                case "IP":
                    value = this.cpu.regIP;
                    break;
                default:
                    value = str.parseInt(sValue);
                    if (value === undefined) this.println("invalid " + (sName? sName : "value") + ": " + sValue);
                    break;
            }
        } else {
            this.println("missing " + (sName || "value"));
        }
        return value;
    };

    /**
     * addSymbols(addr, size, aSymbols)
     *
     * As filedump.js (formerly convrom.php) explains, aSymbols is a JSON-encoded object whose properties consist
     * of all the symbols (in upper-case), and the values of those properties are objects containing any or all of
     * the following properties:
     *
     *      "v": the value of an absolute (unsized) value
     *      "b": either 1, 2, 4 or undefined if an unsized value
     *      "s": either a hard-coded segment or undefined
     *      "o": the offset of the symbol within the associated address space
     *      "l": the original-case version of the symbol, present only if it wasn't originally upper-case
     *      "a": annotation for the specified offset; eg, the original assembly language, with optional comment
     *
     * To that list of properties, we also add:
     *
     *      "p": the physical address (calculated whenever both "s" and "o" properties are defined)
     *
     * Note that values for any "v", "b", "s" and "o" properties are unquoted decimal values, and the values
     * for any "l" or "a" properties are quoted strings. Also, if double-quotes were used in any of the original
     * annotation ("a") values, they will have been converted to two single-quotes, so we're responsible for
     * converting them back to individual double-quotes.
     *
     * For example:
     *      {
     *          "HF_PORT": {
     *              "v":800
     *          },
     *          "HDISK_INT": {
     *              "b":4, "s":0, "o":52
     *          },
     *          "ORG_VECTOR": {
     *              "b":4, "s":0, "o":76
     *          },
     *          "CMD_BLOCK": {
     *              "b":1, "s":64, "o":66
     *          },
     *          "DISK_SETUP": {
     *              "o":3
     *          },
     *          ".40": {
     *              "o":40, "a":"MOV AX,WORD PTR ORG_VECTOR ;GET DISKETTE VECTOR"
     *          }
     *      }
     *
     * If a symbol only has an offset, then that offset value can be assigned to the symbol property directly:
     *
     *          "DISK_SETUP": 3
     *
     * The last property is an example of an "anonymous" entry, for offsets where there is no associated symbol.
     * Such entries are identified by a period followed by a unique number (usually the offset of the entry), and
     * they usually only contain offset ("o") and annotation ("a") properties.  I could eliminate the leading
     * period, but it offers a very convenient way of quickly discriminating among genuine vs. anonymous symbols.
     *
     * We add all these entries to our internal symbol table, which is an array of 4-element arrays, each of which
     * look like:
     *
     *      [addr, size, aSymbols, aOffsetPairs]
     *
     * There are two basic symbol operations: findSymbolAddr(), which takes a string and attempts to match it
     * to a non-anonymous symbol with a matching offset ("o") property, and findSymbolAtAddr(), which takes an
     * address and finds the symbol, if any, at that address.
     *
     * To implement findSymbolAtAddr() efficiently, addSymbols() creates an array of [offset, sSymbol] pairs
     * (aOffsetPairs), one pair for each symbol that corresponds to an offset within the specified address space.
     *
     * We guarantee the elements of aOffsetPairs are in offset order, because we build it using binaryInsert();
     * it's quite likely that the MAP file already ordered all its symbols in offset order, but since they're
     * hand-edited files, we can't assume that.  This insures that findSymbolAtAddr()'s binarySearch() will operate
     * properly.
     *
     * @this {Debugger}
     * @param {number} addr is the physical address of the region where the given symbols are located
     * @param {number} size is the size of the region, in bytes
     * @param {Object} aSymbols is the collection of symbols (the format of this object is described below)
     */
    Debugger.prototype.addSymbols = function(addr, size, aSymbols)
    {
        var aAddr = [];
        var aOffsetPairs = [];
        var fnComparePairs = function(p1, p2) {
            return p1[0] > p2[0]? 1 : p1[0] < p2[0]? -1 : 0;
        };
        for (var sSymbol in aSymbols) {
            var symbol = aSymbols[sSymbol];
            if (typeof symbol == "number") {
                aSymbols[sSymbol] = symbol = {'o': symbol};
            }
            var offset = symbol['o'];
            var segment = symbol['s'];
            var sAnnotation = symbol['a'];
            if (offset !== undefined) {
                if (segment !== undefined) {
                    aAddr[0] = offset;
                    aAddr[1] = segment;
                    symbol['p'] = this.getAddr(aAddr);
                }
                usr.binaryInsert(aOffsetPairs, [offset, sSymbol], fnComparePairs);
            }
            if (sAnnotation) symbol['a'] = sAnnotation.replace(/''/g, "\"");
        }
        this.aSymbolTable.push([addr, size, aSymbols, aOffsetPairs]);
    };

    /**
     * dumpSymbols()
     *
     * TODO: Add "numerical" and "alphabetical" dump options. This is simply dumping them in whatever
     * order they appeared in the original MAP file.
     *
     * @this {Debugger}
     */
    Debugger.prototype.dumpSymbols = function()
    {
        for (var i = 0; i < this.aSymbolTable.length; i++) {
            var addr = this.aSymbolTable[i][0];
          //var size = this.aSymbolTable[i][1];
            var aSymbols = this.aSymbolTable[i][2];
            for (var sSymbol in aSymbols) {
                if (sSymbol.charAt(0) == '.') continue;
                var symbol = aSymbols[sSymbol];
                var off = symbol['o'];
                if (off === undefined) continue;
                var seg = symbol['s'];
                if (seg === undefined) seg = (addr >>> 4);
                var sSymbolOrig = aSymbols[sSymbol]['l'];
                if (sSymbolOrig) sSymbol = sSymbolOrig;
                this.println(str.toHexAddr(off, seg) + " " + sSymbol);
            }
        }
    };

    /**
     * findSymbolAddr(sSymbol)
     *
     * Search aSymbolTable for sSymbol, and if found, return an aAddr (using the same format as parseAddr())
     *
     * @this {Debugger}
     * @param {string} sSymbol
     * @return {Array|null} a valid aAddr if a valid symbol, an empty aAddr if an unknown symbol, or null if not a symbol
     */
    Debugger.prototype.findSymbolAddr = function(sSymbol)
    {
        var aAddr = null;
        if (sSymbol.match(/^[a-z_][a-z0-9_]*$/i)) {
            aAddr = [];
            var sUpperCase = sSymbol.toUpperCase();
            for (var i = 0; i < this.aSymbolTable.length; i++) {
                var addr = this.aSymbolTable[i][0];
                //var size = this.aSymbolTable[i][1];
                var aSymbols = this.aSymbolTable[i][2];
                var symbol = aSymbols[sUpperCase];
                if (symbol !== undefined) {
                    var offset = symbol['o'];
                    if (offset !== undefined) {
                        /*
                         * We assume that every ROM is ORG'ed at 0x0000, and therefore unless the symbol has an
                         * explicitly-defined segment, we return the segment as "addr >>> 4".  Down the road, we may
                         * want/need to support a special symbol entry (eg, ".ORG") that defines an alternate origin.
                         */
                        var segment = symbol['s'];
                        if (segment === undefined) segment = addr >>> 4;
                        // aAddr = this.newAddr(offset, segment);
                        aAddr[0] = offset;
                        aAddr[1] = segment;
                        if (symbol['p'] !== undefined) aAddr[2] = symbol['p'];
                    }
                    /*
                     * The symbol matched, but it wasn't for an address (no "o" offset), and there's no point
                     * looking any farther, since each symbol appears only once, so we indicate it's an unknown symbol.
                     */
                    break;
                }
            }
        }
        return aAddr;
    };

    /**
     * findSymbolAtAddr(aAddr, fNearest)
     *
     * Search aSymbolTable for aAddr, and return an Array for the corresponding symbol (empty if not found).
     *
     * If fNearest is true, and no exact match was found, then the Array returned will contain TWO sets of
     * entries: [0]-[3] will refer to closest preceding symbol, and [4]-[7] will refer to the closest subsequent symbol.
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {boolean} [fNearest]
     * @return {Array|null} where [0] == symbol name, [1] == symbol value, [2] == any annotation, and [3] == any associated comment
     */
    Debugger.prototype.findSymbolAtAddr = function(aAddr, fNearest)
    {
        var aSymbol = [];
        var addr = this.getAddr(aAddr);
        for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
            var addrSymbol = this.aSymbolTable[iTable][0];
            var sizeSymbol = this.aSymbolTable[iTable][1];
            if (addr >= addrSymbol && addr < addrSymbol + sizeSymbol) {
                var offset = aAddr[0];
                var aOffsetPairs = this.aSymbolTable[iTable][3];
                var fnComparePairs = function(p1, p2)
                {
                    return p1[0] > p2[0]? 1 : p1[0] < p2[0]? -1 : 0;
                };
                var result = usr.binarySearch(aOffsetPairs, [offset], fnComparePairs);
                if (result >= 0) {
                    this.returnSymbol(iTable, result, aSymbol);
                }
                else if (fNearest) {
                    result = ~result;
                    this.returnSymbol(iTable, result-1, aSymbol);
                    this.returnSymbol(iTable, result, aSymbol);
                }
                break;
            }
        }
        return aSymbol;
    };

    /**
     * returnSymbol(iTable, iOffset, aSymbol)
     *
     * Helper function for findSymbolAtAddr().
     *
     * @param {number} iTable
     * @param {number} iOffset
     * @param {Array} aSymbol is updated with the specified symbol, if it exists
     */
    Debugger.prototype.returnSymbol = function(iTable, iOffset, aSymbol)
    {
        var symbol = {};
        var aOffsetPairs = this.aSymbolTable[iTable][3];
        var offset = 0, sSymbol = null;
        if (iOffset >= 0 && iOffset < aOffsetPairs.length) {
            offset = aOffsetPairs[iOffset][0];
            sSymbol = aOffsetPairs[iOffset][1];
        }
        if (sSymbol) {
            symbol = this.aSymbolTable[iTable][2][sSymbol];
            sSymbol = (sSymbol.charAt(0) == '.'? null : (symbol['l'] || sSymbol));
        }
        aSymbol.push(sSymbol);
        aSymbol.push(offset);
        aSymbol.push(symbol['a']);
        aSymbol.push(symbol['c']);
    };

    /**
     * doHelp()
     *
     * @this {Debugger}
     */
    Debugger.prototype.doHelp = function()
    {
        var s = "commands:";
        for (var sCommand in Debugger.aCommands) {
            s += '\n' + sCommand + "       ".substr(0, 7-sCommand.length) + Debugger.aCommands[sCommand];
        }
        if (!this.checksEnabled()) s += "\nnote: frequency/history disabled if no exec breakpoints";
        this.println(s);
    };

    /**
     * doAssemble(asArgs)
     *
     * This always receives the complete argument array, where the order of the arguments is:
     *
     *      [0]: the assemble command (assumed to be "a")
     *      [1]: the target address (eg, "200")
     *      [2]: the operation code, aka instruction name (eg, "adc")
     *      [3]: the operation mode operand, if any (eg, "14", "[1234]", etc)
     *
     * The Debugger enters "assemble mode" whenever only the first (or first and second) arguments are present.
     * As long as "assemble mode is active, the user can omit the first two arguments on all later assemble commands
     * until "assemble mode" is cancelled with an empty command line; the command processor automatically prepends "a"
     * and the next available target address to the argument array.
     *
     * Entering "assemble mode" is optional; one could enter a series of fully-qualified assemble commands; eg:
     *
     *      a ff00 cld
     *      a ff01 ldx 28
     *      ...
     *
     * without ever entering "assemble mode", but of course, that requires more typing and doesn't take advantage
     * of automatic target address advancement (see aAddrAssemble).
     *
     * NOTE: As the previous example implies, you can even assemble new instructions into ROM address space;
     * as our setByte() function explains, the ROM write-notification handlers only refuse writes from the CPU.
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs is the complete argument array, beginning with the "a" command in asArgs[0]
     */
    Debugger.prototype.doAssemble = function(asArgs)
    {
        var aAddr = this.parseAddr(asArgs[1], Debugger.ADDR_CODE);
        if (aAddr[0] == null)
            return;
        this.aAddrAssemble = aAddr;
        if (asArgs[2] === undefined) {
            this.println("begin assemble @" + this.hexAddr(aAddr));
            this.fAssemble = true;
            this.cpu.updateCPU();
            return;
        }
        var aOpBytes = this.parseInstruction(asArgs[2], asArgs[3], aAddr);
        if (aOpBytes.length) {
            for (var i = 0; i < aOpBytes.length; i++) {
                // this.println(this.hexAddr(aAddr) + ": " + str.toHexByte(aOpBytes[i]));
                this.setByte(aAddr, aOpBytes[i], 1);
            }
            /*
             * Since getInstruction() also updates the specified address, aAddrAssemble is automatically advanced
             */
            this.println(this.getInstruction(this.aAddrAssemble));
        }
    };

    /**
     * doBreak(sCmd, sAddr)
     *
     * As the "help" output below indicates, the following breakpoint commands are supported:
     *
     *      bp [a]  set exec breakpoint on physical addr [a]
     *      br [a]  set read breakpoint on physical addr [a]
     *      bw [a]  set write breakpoint on physical addr [a]
     *      bc [a]  clear breakpoint on physical addr [a] (use "*" for all breakpoints)
     *      bl      list breakpoints
     *
     * to which we have recently added the following I/O breakpoint commands:
     *
     *      bi [p]  toggle input breakpoint on port [p] (use "*" for all input ports)
     *      bo [p]  toggle output breakpoint on port [p] (use "*" for all output ports)
     *
     * These two new commands operate as toggles so that if "*" is used to trap all input (or output),
     * you can also use these commands to NOT trap specific ports.
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {string} [sAddr]
     */
    Debugger.prototype.doBreak = function(sCmd, sAddr)
    {
        var sParm = sCmd.charAt(1);
        if (!sParm || sParm == "?") {
            this.println("\nbreakpoint commands:");
            this.println("\tbi [p]\ttoggle break on input port [p]");
            this.println("\tbo [p]\ttoggle break on output port [p]");
            this.println("\tbp [a]\tset exec breakpoint at addr [a]");
            this.println("\tbr [a]\tset read breakpoint at addr [a]");
            this.println("\tbw [a]\tset write breakpoint at addr [a]");
            this.println("\tbc [a]\tclear breakpoint at addr [a]");
            this.println("\tbl\tlist all breakpoints");
            return;
        }
        if (sParm == "l") {
            var cBreaks = 0;
            cBreaks += this.listBreakpoints(this.aBreakExec);
            cBreaks += this.listBreakpoints(this.aBreakRead);
            cBreaks += this.listBreakpoints(this.aBreakWrite);
            if (!cBreaks) this.println("no breakpoints");
            return;
        }
        if (sAddr === undefined) {
            this.println("missing breakpoint address");
            return;
        }
        var aAddr = [];
        if (sAddr != "*") {
            aAddr = this.parseAddr(sAddr, Debugger.ADDR_CODE);
            if (aAddr[0] == null) return;
        }
        sAddr = (aAddr[0] == null? sAddr : str.toHexWord(aAddr[0]));
        if (sParm == "c") {
            if (aAddr[0] == null) {
                this.clearBreakpoints();
                this.println("all breakpoints cleared");
                return;
            }
            if (this.findBreakpoint(this.aBreakExec, aAddr, true))
                return;
            if (this.findBreakpoint(this.aBreakRead, aAddr, true))
                return;
            if (this.findBreakpoint(this.aBreakWrite, aAddr, true))
                return;
            this.println("breakpoint missing: " + this.hexAddr(aAddr));
            return;
        }
        if (sParm == "i") {
            this.println("breakpoint " + (this.bus.addPortInputBreak(aAddr[0])? "enabled" : "cleared") + ": port " + sAddr + " (input)");
            return;
        }
        if (sParm == "o") {
            this.println("breakpoint " + (this.bus.addPortOutputBreak(aAddr[0])? "enabled" : "cleared") + ": port " + sAddr + " (output)");
            return;
        }
        if (aAddr[0] == null) return;
        if (sParm == "p") {
            this.addBreakpoint(this.aBreakExec, aAddr);
            return;
        }
        if (sParm == "r") {
            this.addBreakpoint(this.aBreakRead, aAddr);
            return;
        }
        if (sParm == "w") {
            this.addBreakpoint(this.aBreakWrite, aAddr);
            return;
        }
        this.println("unknown breakpoint command: " + sParm);
    };

    /**
     * doClear(sCmd)
     *
     * @this {Debugger}
     * @param {string} sCmd (eg, "cls" or "clear")
     */
    Debugger.prototype.doClear = function(sCmd)
    {
        /*
         * TODO: There should be a clear() component method that the Control Panel overrides to perform this function.
         */
        if (this.controlPrint) this.controlPrint.value = "";
    };

    /**
     * doDump(sCmd, sAddr, sLen)
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {string|undefined} sAddr
     * @param {string|undefined} sLen (if present, it can be preceded by an "l", which we simply ignore; this is purely for historical reasons)
     */
    Debugger.prototype.doDump = function(sCmd, sAddr, sLen)
    {
        var m;
        if (sAddr == "?") {
            var sDumpers = "";
            for (m in Debugger.MESSAGES) {
                if (this.afnDumpers[m]) {
                    if (sDumpers) sDumpers += ",";
                    sDumpers = sDumpers + m;
                }
            }
            sDumpers += ",state,symbols";
            this.println("\ndump commands:");
            this.println("\tdb [a] [#]    dump bytes at address a");
            this.println("\tdw [a] [#]    dump words at address a");
            this.println("\tds [s]        dump descriptor for selector s");
            if (sDumpers.length) this.println("dump extensions:\n\t" + sDumpers);
            return;
        }
        if (sAddr == "state") {
            this.println(this.cmp.powerOff(true));
            return;
        }
        if (sAddr == "symbols") {
            this.dumpSymbols();
            return;
        }
        for (m in Debugger.MESSAGES) {
            if (sAddr == m) {
                var fnDumper = this.afnDumpers[m];
                if (fnDumper) {
                    fnDumper(sLen);
                } else {
                    this.println("no dump registered for " + sAddr);
                }
                return;
            }
        }
        var aAddr = this.parseAddr(sAddr, Debugger.ADDR_DATA);
        if (aAddr[0] == null)
            return;
        if (sCmd == "ds") {
            var seg = this.getSegment(aAddr[0]);
            if (seg.sel != null) {
                var s = "selector=" + str.toHexWord(aAddr[0]) + " limit=" + str.toHexWord(seg.limit) + " base=" + str.toHex(seg.base);
                if (seg.acc) {
                    s += " access=" + str.toHexWord(seg.acc);
                    if (seg.acc & X86.DESC.ACC.TYPE.SEG) {
                        if (seg.acc & X86.DESC.ACC.TYPE.CODE) {
                            s += "code:";
                            s += (seg.acc & X86.DESC.ACC.TYPE.READABLE)? "readable," : "execonly,";
                            s += (seg.acc & X86.DESC.ACC.TYPE.CONFORMING)? "conforming," : "nonconforming,";
                        } else {
                            s += "data:";
                            s += (seg.acc & X86.DESC.ACC.TYPE.WRITABLE)? "writable," : "readonly,";
                            s += (seg.acc & X86.DESC.ACC.TYPE.EXPDOWN)? "expand down," : "expand up,";
                        }
                        s += (seg.acc & X86.DESC.ACC.TYPE.ACCESSED)? "accessed" : "not accessed";
                    } else {
                        s += "type:";
                        switch(seg.acc & X86.DESC.ACC.TYPE.MASK) {
                        case X86.DESC.ACC.TYPE.TSS:
                            s += "tss";
                            break;
                        case X86.DESC.ACC.TYPE.LDT:
                            s += "ldt";
                            break;
                        case X86.DESC.ACC.TYPE.TSS_BUSY:
                            s += "tss(busy)";
                            break;
                        case X86.DESC.ACC.TYPE.GATE_CALL:
                            s += "call";
                            break;
                        case X86.DESC.ACC.TYPE.GATE_TASK:
                            s += "task";
                            break;
                        case X86.DESC.ACC.TYPE.GATE_INT:
                            s += "int";
                            break;
                        case X86.DESC.ACC.TYPE.GATE_TRAP:
                            s += "trap";
                            break;
                        default:
                            s += "unknown";
                            break;
                        }
                    }
                    s += ",dpl" + ((seg.acc >> X86.DESC.ACC.DPL.SHIFT) & X86.DESC.ACC.DPL.MASK);
                    s += (seg.acc & X86.DESC.ACC.PRESENT)? ",present" : ",not present";
                } else {
                    // We must be in real-mode, where selectors have no access bytes
                }
                this.println(s);
            } else {
                this.println("invalid selector: " + str.toHexWord(aAddr[0]));
            }
            return;
        }
        var cLines = 0;
        if (sLen !== undefined) {
            if (sLen.charAt(0) == "l")
                sLen = sLen.substr(1);
            cLines = parseInt(sLen, 10);
        }
        var sDump = "";
        if (!cLines) cLines = 8;
        for (var iLine = 0; iLine < cLines; iLine++) {
            var sBytes = "";
            var sChars = "";
            sAddr = this.hexAddr(aAddr);
            var bPrev = 0;
            for (var i = 0; i < 16; i++) {
                var b = this.getByte(aAddr, 1);
                if (sCmd == "dw") {
                    if (i & 0x1) {
                        sBytes += str.toHexWord(bPrev | (b << 8)) + (i == 7? " - " : "  ");
                    }
                }
                else {
                    sBytes += str.toHexByte(b) + (i == 7? "-" : " ");
                }
                sChars += (b >= 32 && b < 128? String.fromCharCode(b) : ".");
                bPrev = b;
            }
            if (sDump) sDump += "\n";
            sDump += sAddr + "  " + sBytes + " " + sChars;
        }
        if (sDump) this.println(sDump);
        this.aAddrNextData = aAddr;
    };

    /**
     * doEdit(asArgs)
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     */
    Debugger.prototype.doEdit = function(asArgs)
    {
        var sAddr = asArgs[1];
        if (sAddr === undefined) {
            this.println("missing address");
            return;
        }
        var aAddr = this.parseAddr(sAddr, Debugger.ADDR_DATA);
        if (aAddr[0] == null)
            return;
        for (var i = 2; i < asArgs.length; i++) {
            var b = parseInt(asArgs[i], 16);
            this.println("setting " + this.hexAddr(aAddr) + " to " + str.toHexByte(b));
            this.setByte(aAddr, b, 1);
        }
    };

    /**
     * doFreqs(sParm)
     *
     * @this {Debugger}
     * @param {string|undefined} sParm
     */
    Debugger.prototype.doFreqs = function(sParm)
    {
        if (sParm == "?") {
            this.println("\nfrequency commands:");
            this.println("\tclear\tclear all frequency counts");
            return;
        }
        var i;
        var cData = 0;
        if (this.aaOpcodeCounts) {
            if (sParm == "clear") {
                for (i = 0; i < this.aaOpcodeCounts.length; i++)
                    this.aaOpcodeCounts[i] = [i, 0];
                this.println("frequency data cleared");
                cData++;
            }
            else if (sParm !== undefined) {
                this.println("unknown frequency command: " + sParm);
                cData++;
            }
            else {
                var aaSortedOpcodeCounts = this.aaOpcodeCounts.slice();
                aaSortedOpcodeCounts.sort(function(p, q) {
                    return q[1] - p[1];
                });
                for (i = 0; i < aaSortedOpcodeCounts.length; i++) {
                    var bOpcode = aaSortedOpcodeCounts[i][0];
                    var cFreq = aaSortedOpcodeCounts[i][1];
                    if (cFreq) {
                        this.println((Debugger.asIns[this.aaOpDescs[bOpcode][0]] + "  ").substr(0, 5) + " (" + str.toHexByte(bOpcode) + "): " + cFreq + " times");
                        cData++;
                    }
                }
            }
        }
        if (!cData) {
            this.println("no frequency data available");
        }
    };

    /**
     * doHalt(sCount)
     *
     * If the CPU is running and no count is provided, we halt the CPU; otherwise we treat this as a history command.
     *
     * @this {Debugger}
     * @param {string|undefined} sCount is the number of instructions to rewind to (default is 10)
     */
    Debugger.prototype.doHalt = function(sCount)
    {
        if (this.aFlags.fRunning && sCount === undefined) {
            this.cpu.stopCPU();
            return;
        }
        var sMore = "";
        var cLines = 10;
        var iHistory = this.iOpcodeHistory;
        var aHistory = this.aOpcodeHistory;
        if (aHistory.length) {
            var n = (sCount === undefined? this.nextHistory : parseInt(sCount, 10));
            if (isNaN(n))
                n = cLines;
            else
                sMore = "more ";
            if (n > aHistory.length) {
                this.println("note: only " + aHistory.length + " available");
                n = aHistory.length;
            }
            iHistory -= n;
            if (iHistory < 0) {
                if (aHistory[aHistory.length - 1][1] != null) {
                    iHistory += aHistory.length;
                } else {
                    n = iHistory + n;
                    iHistory = 0;
                }
            }
            if (sCount !== undefined) {
                this.println(n + " instructions earlier:");
            }
            while (cLines && iHistory != this.iOpcodeHistory) {
                var aAddr = aHistory[iHistory];
                if (aAddr[1] == null) break;
                /*
                 * We must create a new aAddr from the address we obtained from aHistory, because
                 * aAddr was a reference, not a copy, and we don't want getInstruction() modifying the original.
                 */
                aAddr = this.newAddr(aAddr[0], aAddr[1], aAddr[2]);
                this.println(this.getInstruction(aAddr, "history", -n));
                if (++iHistory == aHistory.length) iHistory = 0;
                this.nextHistory = --n;
                cLines--;
            }
        }
        if (cLines == 10) {
            this.println("no " + sMore + "history available");
            this.nextHistory = undefined;
        }
    };

    /**
     * doInfo(asArgs)
     *
     * Prints the contents of the Debugger's instruction trace buffer.
     *
     * Examples:
     *
     *      n shl
     *      n shl on
     *      n shl off
     *      n dump 100
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     * @return {boolean} true only if the instruction info command ("n") is supported
     */
    Debugger.prototype.doInfo = function(asArgs)
    {
        if (DEBUG) {
            var sCategory = asArgs[1];
            if (sCategory !== undefined) {
                sCategory = sCategory.toUpperCase();
            }
            var sEnable = asArgs[2];
            var fPrint = false;
            if (sCategory == "DUMP") {
                var sDump = "";
                var cLines = (sEnable === undefined? -1 : parseInt(sEnable, 10));
                var i = this.iTraceBuffer;
                do {
                    var s = this.aTraceBuffer[i++];
                    if (s !== undefined) {
                        /*
                         * The browser is MUCH happier if we buffer all the lines for one single enormous print
                         *
                         *      this.println(s);
                         */
                        sDump += (sDump? "\n" : "") + s;
                        cLines--;
                    }
                    if (i >= this.aTraceBuffer.length)
                        i = 0;
                } while (cLines && i != this.iTraceBuffer);
                if (!sDump) sDump = "nothing to dump";
                this.println(sDump);
                this.println("msPerYield: " + this.cpu.aCounts.msPerYield);
                this.println("nCyclesPerBurst: " + this.cpu.aCounts.nCyclesPerBurst);
                this.println("nCyclesPerYield: " + this.cpu.aCounts.nCyclesPerYield);
                this.println("nCyclesPerVideoUpdate: " + this.cpu.aCounts.nCyclesPerVideoUpdate);
                this.println("nCyclesPerStatusUpdate: " + this.cpu.aCounts.nCyclesPerStatusUpdate);
            } else {
                var fEnable = (sEnable == "on");
                for (var prop in this.traceEnabled) {
                    var trace = Debugger.TRACE[prop];
                    if (sCategory === undefined || sCategory == "ALL" || sCategory == Debugger.asIns[trace.ins]) {
                        if (fEnable !== undefined) {
                            this.traceEnabled[prop] = fEnable;
                        }
                        this.println(Debugger.asIns[trace.ins] + trace.size + ": " + (this.traceEnabled[prop]? "on" : "off"));
                        fPrint = true;
                    }
                }
                if (!fPrint) this.println("no match");
            }
            return true;
        }
        return false;
    };

    /**
     * doInput(sPort)
     *
     * @this {Debugger}
     * @param {string|undefined} sPort
     */
    Debugger.prototype.doInput = function(sPort)
    {
        if (!sPort || sPort == "?") {
            this.println("\ninput commands:");
            this.println("\ti [p]\tread port [p]");
            /*
             * NOTE: Regarding this warning, it might be nice if we had an "unchecked" version of
             * bus.checkPortInputNotify(), since all Debugger memory accesses are unchecked, too.
             *
             * All port I/O handlers ARE aware when the Debugger is calling (addrFrom is undefined),
             * but changing them all to be non-destructive would take time, and situations where you
             * actually want to affect the hardware state are just as likely as not....
             */
            this.println("warning: port accesses can affect hardware state");
            return;
        }
        var port = this.parseValue(sPort);
        if (port !== undefined) {
            var data = this.bus.checkPortInputNotify(port);
            this.println(str.toHexWord(port) + ": " + str.toHexByte(data));
        }
    };

    /**
     * doList(sSymbol)
     *
     * @this {Debugger}
     * @param {string} sSymbol
     */
    Debugger.prototype.doList = function(sSymbol)
    {
        var aAddr = this.parseAddr(sSymbol, Debugger.ADDR_CODE);

        if (aAddr[0] == null && aAddr[2] == null) return;

        var addr = this.getAddr(aAddr);

        this.println(sSymbol + ": " + this.hexAddr(aAddr) + " (%" + str.toHex(addr, this.cchAddr) + ")");

        var aSymbol = this.findSymbolAtAddr(aAddr, true);
        if (aSymbol.length) {
            var nDelta, sDelta;
            if (aSymbol[0]) {
                sDelta = "";
                nDelta = aAddr[0] - aSymbol[1];
                if (nDelta) sDelta = " + " + str.toHexWord(nDelta);
                this.println(aSymbol[0] + " (" + str.toHexAddr(aSymbol[1], aAddr[1]) + ")" + sDelta);
            }
            if (aSymbol.length > 4 && aSymbol[4]) {
                sDelta = "";
                nDelta = aSymbol[5] - aAddr[0];
                if (nDelta) sDelta = " - " + str.toHexWord(nDelta);
                this.println(aSymbol[4] + " (" + str.toHexAddr(aSymbol[5], aAddr[1]) + ")" + sDelta);
            }
        } else {
            this.println("no symbols");
        }
    };

    /**
     * doLoad(asArgs)
     *
     * The format of this command mirrors the DOS DEBUG "L" command:
     *
     *      l [address] [drive #] [sector #] [# sectors]
     *
     * The only optional parameter is the last, which defaults to 1 sector if not specified.
     *
     * As a quick-and-dirty way of getting the current contents of a disk image as a JSON dump
     * (which you can then save as .json disk image file), I also allow this command format:
     *
     *      l json [drive #]
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     */
    Debugger.prototype.doLoad = function(asArgs)
    {
        if (asArgs[0] == 'l' && asArgs[1] === undefined || asArgs[1] == "?") {
            this.println("\nlist/load commands:");
            this.println("\tl [address] [drive #] [sector #] [# sectors]");
            this.println("\tln [address] lists symbol(s) nearest to address");
            return;
        }

        if (asArgs[0] == "ln") {
            this.doList(asArgs[1]);
            return;
        }

        var fJSON = (asArgs[1] == "json");
        var iDrive, iSector = 0, nSectors = 0;
        var aAddr = (fJSON? [] : this.parseAddr(asArgs[1], Debugger.ADDR_DATA));

        iDrive = this.parseValue(asArgs[2], "drive #");
        if (iDrive === undefined) return;
        if (!fJSON) {
            iSector = this.parseValue(asArgs[3], "sector #");
            if (iSector === undefined) return;
            nSectors = this.parseValue(asArgs[4], "# of sectors");
            if (nSectors === undefined) nSectors = 1;
        }

        /*
         * We choose the disk controller very simplistically: FDC for drives 0 or 1, and HDC for drives 2
         * and up, unless no HDC is present, in which case we assume FDC for all drive numbers.
         *
         * Both controllers must obviously support the same interfaces; ie, copyDrive(), seekDrive(),
         * and readByte().  We also rely on the disk property to determine whether the drive is "loaded".
         *
         * In the case of the HDC, if the drive is valid, then by definition it is also "loaded", since an HDC
         * drive and its disk are inseparable; it's certainly possible that its disk object may be empty at
         * this point, but that will only affect whether the read succeeds or not.
         */
        var dc = this.fdc;
        if (iDrive >= 2 && this.hdc) {
            iDrive -= 2;
            dc = this.hdc;
        }
        if (dc) {
            var drive = dc.copyDrive(iDrive);
            if (drive) {
                if (drive.disk) {
                    if (fJSON) {
                        /*
                         * This is an interim solution to dumping disk images in JSON.  It has many problems, the
                         * "biggest" being that the large disk images really need to be compressed first, because they
                         * get "inflated" with use.  See the dump() method in the Disk component for more details.
                         */
                        this.println(drive.disk.dump());
                        return;
                    }
                    if (dc.seekDrive(drive, iSector, nSectors)) {
                        var cb = 0;
                        var fAbort = false;
                        var sAddr = this.hexAddr(aAddr);
                        while (!fAbort && drive.nBytes-- > 0) {
                            (function(dbg, aAddrCur) {
                                dc.readByte(drive, function(b, fAsync) {
                                    if (b < 0) {
                                        dbg.println("out of data at address " + dbg.hexAddr(aAddrCur));
                                        fAbort = true;
                                        return;
                                    }
                                    dbg.setByte(aAddrCur, b, 1);
                                    cb++;
                                });
                            }(this, aAddr));
                        }
                        this.println(cb + " bytes read at " + sAddr);
                    } else {
                        this.println("sector " + iSector + " request out of range");
                    }
                } else {
                    this.println("drive " + iDrive + " not loaded");
                }
            } else {
                this.println("invalid drive: " + iDrive);
            }
        } else {
            this.println("disk controller not present");
        }
    };

    /**
     * doMessages(asArgs)
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     */
    Debugger.prototype.doMessages = function(asArgs)
    {
        var m;
        var fCriteria = null;
        var sCategory = asArgs[1];
        if (sCategory == "?") sCategory = undefined;

        if (sCategory !== undefined) {
            var bitsMessage = 0;
            if (sCategory == "all") {
                bitsMessage = 0xffffffff;
                sCategory = null;
            } else if (sCategory == "on") {
                fCriteria = true;
                sCategory = null;
            } else if (sCategory == "off") {
                fCriteria = false;
                sCategory = null;
            } else {
                for (m in Debugger.MESSAGES) {
                    if (sCategory == m) {
                        bitsMessage = Debugger.MESSAGES[m];
                        fCriteria = !!(this.bitsMessageEnabled & bitsMessage);
                        break;
                    }
                }
                if (!bitsMessage) {
                    this.println("unknown message category: " + sCategory);
                    return;
                }
            }
            if (bitsMessage) {
                if (asArgs[2] == "on") {
                    this.bitsMessageEnabled |= bitsMessage;
                    fCriteria = true;
                }
                else if (asArgs[2] == "off") {
                    this.bitsMessageEnabled &= ~bitsMessage;
                    fCriteria = false;
                }
            }
        }

        /*
         * Display those message categories that match the current criteria (on or off)
         */
        var n = 0;
        var sCategories = "";
        for (m in Debugger.MESSAGES) {
            if (!sCategory || sCategory == m) {
                var bitMessage = Debugger.MESSAGES[m];
                var fEnabled = !!(this.bitsMessageEnabled & bitMessage);
                if (fCriteria !== null && fCriteria != fEnabled) continue;
                if (sCategories) sCategories += ",";
                if (!(++n % 10)) sCategories += "\n\t";     // jshint ignore:line
                sCategories += m;
            }
        }

        if (sCategory === undefined) {
            this.println("\nmessage commands:\n\tm [category] [on|off]\tturn categories on/off");
        }

        this.println((fCriteria !== null? (fCriteria? "messages on:  " : "messages off: ") : "message categories:\n\t") + (sCategories || "none"));
    };

    /**
     * doExecOptions(asArgs)
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     */
    Debugger.prototype.doExecOptions = function(asArgs)
    {
        if (asArgs[1] === undefined || asArgs[1] == "?") {
            this.println("\nexecution options:");
            this.println("\tcs int #\tset checksum cycle interval to #");
            this.println("\tcs start #\tset checksum cycle start count to #");
            this.println("\tcs stop #\tset checksum cycle stop count to #");
            this.println("\tsp #\t\tset speed multiplier to #");
            return;
        }
        switch (asArgs[1]) {
            case "cs":
                var nCycles;
                if (asArgs[3] !== undefined) {
                    nCycles = parseInt(asArgs[3], 10);
                }
                switch (asArgs[2]) {
                    case "int":
                        this.cpu.aCounts.nCyclesChecksumInterval = nCycles;
                        break;
                    case "start":
                        this.cpu.aCounts.nCyclesChecksumStart = nCycles;
                        break;
                    case "stop":
                        this.cpu.aCounts.nCyclesChecksumStop = nCycles;
                        break;
                    default:
                        this.println("unknown cs option");
                        return;
                }
                if (nCycles !== undefined) {
                    this.cpu.resetChecksum();
                }
                this.println("checksums " + (this.cpu.aFlags.fChecksum? "enabled" : "disabled"));
                break;
            case "sp":
                if (asArgs[2] !== undefined) {
                    this.cpu.setSpeed(parseInt(asArgs[2], 10));
                }
                this.println("target speed: " + this.cpu.getSpeedTarget() + " (" + this.cpu.getSpeed() + "x)");
                break;
            default:
                this.println("unknown option: " + asArgs[1]);
                break;
        }
    };

    /**
     * doOutput(sPort, sData)
     *
     * @this {Debugger}
     * @param {string|undefined} sPort
     * @param {string|undefined} sData
     */
    Debugger.prototype.doOutput = function(sPort, sData)
    {
        if (!sPort || sPort == "?") {
            this.println("\noutput commands:");
            this.println("\to [p] [d]\twrite data [d] to port [p]");
            /*
             * NOTE: Regarding this warning, it might be nice if we had an "Unchecked" version of
             * bus.checkPortOutputNotify(), since all Debugger memory accesses are unchecked, too.
             *
             * All port I/O handlers ARE aware when the Debugger is calling (addrFrom is undefined),
             * but changing them all to be non-destructive would take time, and situations where you
             * actually want to affect the hardware state are just as likely as not....
             */
            this.println("warning: port accesses can affect hardware state");
            return;
        }
        var port = this.parseValue(sPort, "port #");
        var data = this.parseValue(sData);
        if (port !== undefined && data !== undefined) {
            this.bus.checkPortOutputNotify(port, data);
        }
    };

    /**
     * doRegisters(asArgs, fCompact)
     *
     * @this {Debugger}
     * @param {Array.<string>} [asArgs]
     * @param {boolean} [fCompact]
     */
    Debugger.prototype.doRegisters = function(asArgs, fCompact)
    {
        if (asArgs && asArgs[1] == "?") {
            this.println("\nregister commands:");
            this.println("\tr\t\tdisplay all registers");
            this.println("\tr [target=#]\tmodify target register");
            this.println("supported targets:");
            this.println("\tall registers and flags V,D,I,S,Z,A,P,C");
            return;
        }
        var fIns = true, fProt;
        if (asArgs != null && asArgs.length > 1) {
            var sReg = asArgs[1];
            if (sReg == 'p') {
                /*
                 * If the CPU has not defined addrGDT, then there are no protected-mode registers.
                 */
                fProt = (this.cpu.addrGDT !== undefined);
            } else {
             // fIns = false;
                var sValue = null;
                var i = sReg.indexOf("=");
                if (i > 0) {
                    sValue = sReg.substr(i + 1);
                    sReg = sReg.substr(0, i);
                }
                else if (asArgs.length > 2) {
                    sValue = asArgs[2];
                }
                else {
                    this.println("missing value for " + asArgs[1]);
                    return;
                }
                var w = parseInt(sValue, 16);
                if (!isNaN(w)) {
                    sReg = sReg.toUpperCase();
                    switch (sReg) {
                    case "AL":
                        this.cpu.regAX = (this.cpu.regAX & 0xff00) | (w & 0xff);
                        break;
                    case "AH":
                        this.cpu.regAX = (this.cpu.regAX & 0x00ff) | ((w << 8) & 0xff);
                        break;
                    case "AX":
                        this.cpu.regAX = (w & 0xffff);
                        break;
                    case "BL":
                        this.cpu.regBX = (this.cpu.regBX & 0xff00) | (w & 0xff);
                        break;
                    case "BH":
                        this.cpu.regBX = (this.cpu.regBX & 0x00ff) | ((w << 8) & 0xff);
                        break;
                    case "BX":
                        this.cpu.regBX = (w & 0xffff);
                        break;
                    case "CL":
                        this.cpu.regCX = (this.cpu.regCX & 0xff00) | (w & 0xff);
                        break;
                    case "CH":
                        this.cpu.regCX = (this.cpu.regCX & 0x00ff) | ((w << 8) & 0xff);
                        break;
                    case "CX":
                        this.cpu.regCX = (w & 0xffff);
                        break;
                    case "DL":
                        this.cpu.regDX = (this.cpu.regDX & 0xff00) | (w & 0xff);
                        break;
                    case "DH":
                        this.cpu.regDX = (this.cpu.regDX & 0x00ff) | ((w << 8) & 0xff);
                        break;
                    case "DX":
                        this.cpu.regDX = (w & 0xffff);
                        break;
                    case "SP":
                        this.cpu.regSP = (w & 0xffff);
                        break;
                    case "BP":
                        this.cpu.regBP = (w & 0xffff);
                        break;
                    case "SI":
                        this.cpu.regSI = (w & 0xffff);
                        break;
                    case "DI":
                        this.cpu.regDI = (w & 0xffff);
                        break;
                    case "DS":
                        this.cpu.setDS(w);
                        break;
                    case "ES":
                        this.cpu.setES(w);
                        break;
                    case "SS":
                        this.cpu.setSS(w);
                        break;
                    case "CS":
                     // fIns = true;
                        this.cpu.setCS(w);
                        this.aAddrNextCode = this.newAddr(this.cpu.regIP, this.cpu.segCS.sel);
                        break;
                    case "IP":
                     // fIns = true;
                        this.cpu.setIP(w);
                        this.aAddrNextCode = this.newAddr(this.cpu.regIP, this.cpu.segCS.sel);
                        break;
                    /*
                     * I used to alias "PC" to "IP", until I discovered that early (perhaps ALL) versions of
                     * DEBUG.COM treat "PC" as an alias for the 16-bit flags register.  I, of course, prefer "PS".
                     */
                    case "PC":
                    case "PS":
                        this.cpu.setPS(w);
                        break;
                    case "C":
                        if (w) this.cpu.setCF(); else this.cpu.clearCF();
                        break;
                    case "P":
                        if (w) this.cpu.setPF(); else this.cpu.clearPF();
                        break;
                    case "A":
                        if (w) this.cpu.setAF(); else this.cpu.clearAF();
                        break;
                    case "Z":
                        if (w) this.cpu.setZF(); else this.cpu.clearZF();
                        break;
                    case "S":
                        if (w) this.cpu.setSF(); else this.cpu.clearSF();
                        break;
                    case "I":
                        if (w) this.cpu.setIF(); else this.cpu.clearIF();
                        break;
                    case "D":
                        if (w) this.cpu.setDF(); else this.cpu.clearDF();
                        break;
                    case "V":
                        if (w) this.cpu.setOF(); else this.cpu.clearOF();
                        break;
                    default:
                        var fUnknown = true;
                        if (this.cpu.model >= X86.MODEL_80286) {
                            fUnknown = false;
                            switch(sReg){
                            case "MS":
                                X86Help.opHelpLMSW.call(this.cpu, w);
                                break;
                            case "TR":
                                this.cpu.segTSS.load(w);
                                break;
                            /*
                             * TODO: Add support for GDTR (addr and limit), IDTR (addr and limit), and perhaps
                             * even the ability to edit descriptor information associated with each segment register.
                             */
                            default:
                                fUnknown = true;
                                break;
                            }
                        }
                        if (fUnknown) {
                            this.println("unknown register: " + sReg);
                            return;
                        }
                    }
                }
                else {
                    this.println("invalid value: " + sValue);
                    return;
                }
                this.cpu.updateCPU();
                this.println("\nupdated registers:");
                fCompact = true;
            }
        }

        this.println((fCompact? '' : '\n') + this.getRegStr(fProt));

        if (fIns) {
            this.aAddrNextCode = this.newAddr(this.cpu.regIP, this.cpu.segCS.sel);
            this.doUnassemble(this.hexAddr(this.aAddrNextCode));
        }
    };

    /**
     * doRun(sAddr)
     *
     * @this {Debugger}
     * @param {string} sAddr
     */
    Debugger.prototype.doRun = function(sAddr)
    {
        if (sAddr !== undefined) {
            var aAddr = this.parseAddr(sAddr, Debugger.ADDR_CODE);
            if (aAddr[0] == null) return;
            this.setTempBreakpoint(aAddr);
        }
        if (!this.runCPU(true)) {
            this.println('cpu not available, "g" command ignored');
        }
    };

    /**
     * doProcStep(sCmd)
     *
     * @this {Debugger}
     * @param {string} [sCmd] "p" or "pr"
     */
    Debugger.prototype.doProcStep = function(sCmd)
    {
        var fCallStep = true;
        var fRegs = (sCmd == "pr"? 1 : 0);
        /*
         * Set up the value for this.fProcStep (ie, 1 or 2) depending on whether the user wants
         * a subsequent register dump ("pr") or not ("p").
         */
        var fProcStep = 1 + fRegs;
        if (!this.fProcStep) {
            var fPrefix;
            var fRepeat = false;
            var aAddr = this.newAddr(this.cpu.regIP, this.cpu.segCS.sel);
            do {
                fPrefix = false;
                var bOpcode = this.getByte(aAddr);
                switch (bOpcode) {
                case X86.OPCODE.ES:
                case X86.OPCODE.CS:
                case X86.OPCODE.SS:
                case X86.OPCODE.DS:
                case X86.OPCODE.LOCK:
                    this.incAddr(aAddr, 1);
                    fPrefix = true;
                    break;
                case X86.OPCODE.INT3:
                case X86.OPCODE.INTO:
                    this.fProcStep = fProcStep;
                    this.incAddr(aAddr, 1);
                    break;
                case X86.OPCODE.INTn:
                case X86.OPCODE.LOOPNZ:
                case X86.OPCODE.LOOPZ:
                case X86.OPCODE.LOOP:
                    this.fProcStep = fProcStep;
                    this.incAddr(aAddr, 2);
                    break;
                case X86.OPCODE.CALL:
                    if (fCallStep) {
                        this.fProcStep = fProcStep;
                        this.incAddr(aAddr, 3);
                    }
                    break;
                case X86.OPCODE.CALLF:
                    if (fCallStep) {
                        this.fProcStep = fProcStep;
                        this.incAddr(aAddr, 5);
                    }
                    break;
                case X86.OPCODE.CALLW & 0xff:
                    if (fCallStep) {
                        var sIns = this.getInstruction(aAddr);
                        this.fProcStep = (sIns.indexOf("CALL") >= 0? fProcStep : 0);
                    }
                    break;
                case X86.OPCODE.REPZ:
                case X86.OPCODE.REPNZ:
                    this.incAddr(aAddr, 1);
                    fRepeat = fPrefix = true;
                    break;
                case X86.OPCODE.MOVSB:
                case X86.OPCODE.MOVSW:
                case X86.OPCODE.CMPSB:
                case X86.OPCODE.CMPSW:
                case X86.OPCODE.STOSB:
                case X86.OPCODE.STOSW:
                case X86.OPCODE.LODSB:
                case X86.OPCODE.LODSW:
                case X86.OPCODE.SCASB:
                case X86.OPCODE.SCASW:
                    if (fRepeat) {
                        this.fProcStep = fProcStep;
                        this.incAddr(aAddr, 1);
                    }
                    break;
                default:
                    break;
                }
            } while (fPrefix);
            if (this.fProcStep) {
                this.setTempBreakpoint(aAddr);
                if (!this.runCPU()) {
                    this.cpu.setFocus();
                    this.fProcStep = 0;
                }
                /*
                 * A successful run will ultimately call stop(), which will in turn call clearTempBreakpoint(),
                 * which will clear fProcStep, so there's your assurance that fProcStep will be reset.  Now we may
                 * have stopped for reasons unrelated to the temporary breakpoint, but that's OK.
                 */
            } else {
                this.doStep(fRegs? "tr" : "t");
            }
        } else {
            this.println("step in progress");
        }
    };

    /**
     * doStep(sCmd, sCount)
     *
     * @this {Debugger}
     * @param {string} [sCmd] "t" or "tr"
     * @param {string} [sCount] # of instructions to step
     */
    Debugger.prototype.doStep = function(sCmd, sCount)
    {
        var dbg = this;
        var fRegs = (sCmd == "tr");
        var count = (sCount != null? parseInt(sCount, 10) : 1);
        var nCycles = (count == 1? 0 : 1);
        web.onCountRepeat(
            count,
            function onCountStep() {
                return dbg.setBusy(true) && dbg.stepCPU(nCycles, fRegs, false);
            },
            function onCountStepComplete() {
                /*
                 * We explicitly called stepCPU() with fUpdateCPU === false, because repeatedly
                 * calling updateCPU() can be very slow, especially when fDisplayLiveRegs is true,
                 * so once the repeat count has been exhausted, we must perform a final updateCPU().
                 */
                dbg.cpu.updateCPU();
                dbg.setBusy(false);
            }
        );
    };

    /**
     * doUnassemble(sAddr, sAddrEnd, n)
     *
     * @this {Debugger}
     * @param {string} [sAddr]
     * @param {string} [sAddrEnd]
     * @param {number} [n]
     */
    Debugger.prototype.doUnassemble = function(sAddr, sAddrEnd, n)
    {
        var aAddr = this.parseAddr(sAddr, Debugger.ADDR_CODE);
        if (aAddr[0] == null)
            return;

        if (n === undefined) n = 1;
        var aAddrEnd = this.newAddr(0xffff, aAddr[1], this.bus.addrLimit);

        if (sAddrEnd !== undefined) {
            aAddrEnd = this.parseAddr(sAddrEnd, Debugger.ADDR_CODE);
            if (aAddrEnd[0] == null || aAddrEnd[0] < aAddr[0])
                return;
            if (!DEBUG && (aAddrEnd[0] - aAddr[0]) > 0x100) {
                /*
                 * Limiting the amount of disassembled code to 256 bytes in non-DEBUG builds is partly to
                 * prevent the user from wedging the browser by dumping too many lines, but also a recognition
                 * that, in non-DEBUG builds, this.println() keeps print output buffer truncated to 8Kb anyway.
                 */
                this.println("range too large");
                return;
            }
            aAddrEnd[0]++;
            n = -1;
        }

        var fBlank = (aAddr[0] != this.aAddrNextCode[0]);

        while (n && (aAddr[1] != null? (aAddr[0] < aAddrEnd[0]) : (aAddr[2] < aAddrEnd[2]))) {
            /*
             * I pass nCycles instead of cInstructions to getInstruction() now, to assist with visual
             * verification of the accuracy (or inaccuracy) of instruction cycle counts.
             */
            n--;
            var bOpcode = this.getByte(aAddr);
            /*
             * We don't want to leave the disassembly ending with a prefix, especially now that stepCPU(0) continues
             * executing until it reaches a non-prefix instruction.  So if a prefix is the last instruction, bump the
             * count and force one more instruction to be disassembled.
             */
            var nSequence = (this.isBusy(false) || this.fProcStep)? this.nCycles : null;
            if (bOpcode == X86.OPCODE.ES || bOpcode == X86.OPCODE.CS || bOpcode == X86.OPCODE.SS || bOpcode == X86.OPCODE.DS || bOpcode == X86.OPCODE.LOCK || bOpcode == X86.OPCODE.REPNZ || bOpcode == X86.OPCODE.REPZ) {
                nSequence = null;
                if (!n) n++;
            }
            var sComment = (nSequence != null? "cycles" : null);
            var aSymbol = this.findSymbolAtAddr(aAddr);
            if (aSymbol[0]) {
                var sLabel = aSymbol[0] + ":";
                fBlank = false;
                if (aSymbol[2]) sLabel += " " + aSymbol[2];
                this.println(sLabel);
            }
            if (fBlank) this.println();
            if (aSymbol[3]) {
                sComment = aSymbol[3];
                nSequence = null;
            }
            var sIns = this.getInstruction(aAddr, sComment, nSequence);
            this.println(sIns);
            this.aAddrNextCode = aAddr;
            fBlank = false;
        }
        if (n) this.println("end of memory");
    };

    /**
     * parseCommand(sCmd, fSave)
     *
     * @this {Debugger}
     * @param {string|undefined} sCmd
     * @param {boolean} [fSave] is true to save the command, false if not
     * @return {Array.<string>}
     */
    Debugger.prototype.parseCommand = function(sCmd, fSave)
    {
        if (fSave) {
            if (!sCmd) {
                sCmd = this.prevCmd;
            } else {
                this.prevCmd = sCmd;
            }
        }
        var a = (sCmd? sCmd.split(sCmd.indexOf('|') >= 0? '|' : ';') : ['']);
        for (var s in a) {
            a[s] = str.trim(a[s]);
        }
        return a;
    };

    /**
     * doCommand(sCmd, fQuiet)
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {boolean} [fQuiet]
     * @return {boolean} true if command processed, false if unrecognized
     */
    Debugger.prototype.doCommand = function(sCmd, fQuiet)
    {
        var result = true;

        try {
            if (!sCmd.length) {
                if (this.fAssemble) {
                    this.println("ended assemble @" + this.hexAddr(this.aAddrAssemble));
                    this.aAddrNextCode = this.aAddrAssemble;
                    this.fAssemble = false;
                } else {
                    sCmd = '?';
                }
            }

            sCmd = sCmd.toLowerCase();

            /*
             * I'm going to try relaxing the !isBusy() requirement for doCommand(), to maximize our
             * ability to issue Debugger commands externally.
             */
            if (this.isReady() /* && !this.isBusy(true) */ && sCmd.length > 0) {

                if (this.fAssemble) {
                    sCmd = "a " + this.hexAddr(this.aAddrAssemble) + " " + sCmd;
                }
                else {
                    /*
                     * Process any "whole" commands here first (eg, "debug", "nodebug", "reset", etc.)
                     *
                     * For all other commands, if they lack a space between the command and argument portions,
                     * insert a space before the first non-alpha character, so that split() will have the desired effect.
                     */

                    /*
                     * These commands work great, except that they won't compile, and in fact, I don't WANT them in the
                     * compiled version, but putting them inside (!COMPILED) doesn't help, so I must disable them for now.
                     *
                    if (!COMPILED) {
                        if (sCmd == "debug") {
                            DEBUG = true;
                            this.println("DEBUG checks on");
                            return true;
                        }
                        else if (sCmd == "nodebug") {
                            DEBUG = false;
                            this.println("DEBUG checks off");
                            return true;
                        }
                    }
                     */

                    var ch, ch0, i;
                    switch (sCmd) {
                    case "reset":
                        if (this.cmp) this.cmp.reset();
                        return true;
                    case "ver":
                        this.println((APPNAME || "PCjs") + " version " + APPVERSION + " (" + (COMPILED? "release" : (DEBUG? "debug" : "nodebug")) + (PREFETCH? ",prefetch" : ",noprefetch") + (EAFUNCS? "eafuncs" : ",eatests") + (TYPEDARRAYS? ",typedarrays" : (FATARRAYS? ",fatarrays" : ",dwordarrays")) + ")");
                        return true;
                    default:
                        ch0 = sCmd.charAt(0);
                        for (i = 1; i < sCmd.length; i++) {
                            ch = sCmd.charAt(i);
                            if (ch == " ") break;
                            if (ch0 == "r" || ch < "a" || ch > "z") {
                                sCmd = sCmd.substring(0, i) + " " + sCmd.substring(i);
                                break;
                            }
                        }
                        break;
                    }
                }

                var asArgs = sCmd.split(" ");
                switch (asArgs[0].charAt(0)) {
                case "a":
                    this.doAssemble(asArgs);
                    break;
                case "b":
                    this.doBreak(asArgs[0], asArgs[1]);
                    break;
                case "c":
                    this.doClear(asArgs[0]);
                    break;
                case "d":
                    this.doDump(asArgs[0], asArgs[1], asArgs[2]);
                    break;
                case "e":
                    this.doEdit(asArgs);
                    break;
                case "f":
                    this.doFreqs(asArgs[1]);
                    break;
                case "g":
                    this.doRun(asArgs[1]);
                    break;
                case "h":
                    this.doHalt(asArgs[1]);
                    break;
                case "i":
                    this.doInput(asArgs[1]);
                    break;
                case "l":
                    this.doLoad(asArgs);
                    break;
                case "m":
                    this.doMessages(asArgs);
                    break;
                case "o":
                    this.doOutput(asArgs[1], asArgs[2]);
                    break;
                case "p":
                case "pr":
                    this.doProcStep(asArgs[0]);
                    break;
                case "r":
                    this.doRegisters(asArgs);
                    break;
                case "t":
                case "tr":
                    this.doStep(asArgs[0], asArgs[1]);
                    break;
                case "u":
                    this.doUnassemble(asArgs[1], asArgs[2], 8);
                    break;
                case "x":
                    this.doExecOptions(asArgs);
                    break;
                case "?":
                    this.doHelp();
                    break;
                case "n":
                    if (this.doInfo(asArgs)) break;
                    /* falls through */
                default:
                    if (!fQuiet) this.println("unknown command: " + sCmd);
                    result = false;
                    break;
                }
            }
        } catch(e) {
            this.println("debugger sad: " + e.message);
            result = false;
        }
        return result;
    };

    /**
     * Debugger.init()
     *
     * This function operates on every element (e) of class "debugger", and initializes
     * all the necessary HTML to construct the Debugger module(s) as spec'ed.
     *
     * Note that each element (e) of class "debugger" is expected to have a "data-value"
     * attribute containing the same JSON-encoded parameters that the Debugger constructor
     * expects.
     */
    Debugger.init = function()
    {
        var aeDbg = Component.getElementsByClass(window.document, PCJSCLASS, "debugger");
        for (var iDbg = 0; iDbg < aeDbg.length; iDbg++) {
            var eDbg = aeDbg[iDbg];
            var parmsDbg = Component.getComponentParms(eDbg);
            var dbg = new Debugger(parmsDbg);
            Component.bindComponentControls(dbg, eDbg, PCJSCLASS);
        }
    };

    /*
     * Initialize every Debugger module on the page (as IF there's ever going to be more than one ;-))
     */
    web.onInit(Debugger.init);

    if (typeof APP_PCJS !== 'undefined') APP_PCJS.Debugger = Debugger;

}   // endif DEBUGGER

if (typeof module !== 'undefined') module.exports = Debugger;
