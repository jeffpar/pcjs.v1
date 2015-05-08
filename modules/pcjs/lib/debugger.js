/**
 * @fileoverview Implements the PCjs Debugger component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-21
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

if (DEBUGGER) {
    if (typeof module !== 'undefined') {
        var str         = require("../../shared/lib/strlib");
        var usr         = require("../../shared/lib/usrlib");
        var web         = require("../../shared/lib/weblib");
        var Component   = require("../../shared/lib/component");
        var Interrupts  = require("./interrupts");
        var Messages    = require("./messages");
        var Bus         = require("./bus");
        var Memory      = require("./memory");
        var Keyboard    = require("./keyboard");
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
 *      multiple categories must be separated by '|' or ';'.  Parsed by messageInit().
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
         * Default number of hex chars in a register and a linear address (ie, for real-mode);
         * updated by initBus().
         */
        this.cchReg = 4;
        this.maskReg = 0xffff;
        this.cchAddr = 5;
        this.maskAddr = 0xfffff;

        /*
         * Most commands that require an address call parseAddr(), which defaults to aAddrNextCode
         * or aAddrNextData when no address has been given.  doDump() and doUnassemble(), in turn,
         * update aAddrNextData and aAddrNextCode, respectively, when they're done.
         *
         * The format of all aAddr variables is [off, seg, addr], where seg:off is the segmented
         * address and addr is the corresponding linear address (if known).  For certain segmented
         * addresses (eg, breakpoint addresses), we pre-compute the linear address and save that
         * in aAddr[2], so that the breakpoint will still operate as intended even if the mode changes
         * later (eg, from real-mode to protected-mode).
         *
         * Finally, for TEMPORARY breakpoint addresses, we set aAddr[3] to true, so that they can be
         * automatically cleared when they're hit.
         */
        this.aAddrNextCode = [0, 0];
        this.aAddrNextData = [0, 0];

        /*
         * This maintains command history.  New commands are inserted at index 0 of the array.
         * When Enter is pressed on an empty input buffer, we default to the command at aPrevCmds[0].
         */
        this.iPrevCmd = -1;
        this.aPrevCmds = [];

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
         * Execution history is allocated by historyInit() whenever checksEnabled() conditions change.
         * Execution history is updated whenever the CPU calls checkInstruction(), which will happen
         * only when checksEnabled() returns true (eg, whenever one or more breakpoints have been set).
         * This ensures that, by default, the CPU runs as fast as possible.
         */
        this.historyInit();

        /*
         * Initialize Debugger message support
         */
        this.messageInit(parmsDbg['messages']);

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
         *      $('dw 0:0')
         *      $('h')
         *      ...
         */
        var dbg = this;
        if (window) {
            if (window['$'] === undefined) {
                window['$'] = function(s) { return dbg.doCommand(s); };
            }
        } else {
            if (global['$'] === undefined) {
                global['$'] = function(s) { return dbg.doCommand(s); };
            }
        }

    }   // endif DEBUGGER
}

if (DEBUGGER) {

    Component.subclass(Debugger);

    /*
     * Information regarding interrupts of interest (used by messageInt() and others)
     */
    Debugger.INT_MESSAGES = {
        0x10:       Messages.VIDEO,
        0x13:       Messages.FDC,
        0x15:       Messages.CHIPSET,
        0x16:       Messages.KEYBOARD,
     // 0x1a:       Messages.RTC,       // ChipSet contains its own specialized messageInt() handler for the RTC
        0x1c:       Messages.TIMER,
        0x21:       Messages.DOS,
        0x33:       Messages.MOUSE
    };

    Debugger.COMMANDS = {
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
     * Instruction ordinals
     */
    Debugger.INS = {
        NONE:   0,   AAA:    1,   AAD:    2,   AAM:    3,   AAS:    4,   ADC:    5,   ADD:    6,   AND:    7,
        ARPL:   8,   AS:     9,   BOUND:  10,  BSF:    11,  BSR:    12,  BT:     13,  BTC:    14,  BTR:    15,
        BTS:    16,  CALL:   17,  CBW:    18,  CLC:    19,  CLD:    20,  CLI:    21,  CLTS:   22,  CMC:    23,
        CMP:    24,  CMPSB:  25,  CMPSW:  26,  CS:     27,  CWD:    28,  DAA:    29,  DAS:    30,  DEC:    31,
        DIV:    32,  DS:     33,  ENTER:  34,  ES:     35,  ESC:    36,  FADD:   37,  FBLD:   38,  FBSTP:  39,
        FCOM:   40,  FCOMP:  41,  FDIV:   42,  FDIVR:  43,  FIADD:  44,  FICOM:  45,  FICOMP: 46,  FIDIV:  47,
        FIDIVR: 48,  FILD:   49,  FIMUL:  50,  FIST:   51,  FISTP:  52,  FISUB:  53,  FISUBR: 54,  FLD:    55,
        FLDCW:  56,  FLDENV: 57,  FMUL:   58,  FNSAVE: 59,  FNSTCW: 60,  FNSTENV:61,  FNSTSW: 62,  FRSTOR: 63,
        FS:     64,  FST:    65,  FSTP:   66,  FSUB:   67,  FSUBR:  68,  GS:     69,  HLT:    70,  IDIV:   71,
        IMUL:   72,  IN:     73,  INC:    74,  INS:    75,  INT:    76,  INT3:   77,  INTO:   78,  IRET:   79,
        JBE:    80,  JC:     81,  JCXZ:   82,  JG:     83,  JGE:    84,  JL:     85,  JLE:    86,  JMP:    87,
        JNBE:   88,  JNC:    89,  JNO:    90,  JNP:    91,  JNS:    92,  JNZ:    93,  JO:     94,  JP:     95,
        JS:     96,  JZ:     97,  LAHF:   98,  LAR:    99,  LDS:    100, LEA:    101, LEAVE:  102, LES:    103,
        LFS:    104, LGDT:   105, LGS:    106, LIDT:   107, LLDT:   108, LMSW:   109, LOADALL:110, LOCK:   111,
        LODSB:  112, LODSW:  113, LOOP:   114, LOOPNZ: 115, LOOPZ:  116, LSL:    117, LSS:    118, LTR:    119,
        MOV:    120, MOVSB:  121, MOVSW:  122, MOVSX:  123, MOVZX:  124, MUL:    125, NEG:    126, NOP:    127,
        NOT:    128, OR:     129, OS:     130, OUT:    131, OUTS:   132, POP:    133, POPA:   134, POPF:   135,
        PUSH:   136, PUSHA:  137, PUSHF:  138, RCL:    139, RCR:    140, REPNZ:  141, REPZ:   142, RET:    143,
        RETF:   144, ROL:    145, ROR:    146, SAHF:   147, SALC:   148, SAR:    149, SBB:    150, SCASB:  151,
        SCASW:  152, SETBE:  153, SETC:   154, SETG:   155, SETGE:  156, SETL:   157, SETLE:  158, SETNBE: 159,
        SETNC:  160, SETNO:  161, SETNP:  162, SETNS:  163, SETNZ:  164, SETO:   165, SETP:   166, SETS:   167,
        SETZ:   168, SGDT:   169, SHL:    170, SHLD:   171, SHR:    172, SHRD:   173, SIDT:   174, SLDT:   175,
        SMSW:   176, SS:     177, STC:    178, STD:    179, STI:    180, STOSB:  181, STOSW:  182, STR:    183,
        SUB:    184, TEST:   185, VERR:   186, VERW:   187, WAIT:   188, XCHG:   189, XLAT:   190, XOR:    191,
        GRP1B:  192, GRP1W:  193, GRP1SW: 194, GRP2B:  195, GRP2W:  196, GRP2B1: 197, GRP2W1: 198, GRP2BC: 199,
        GRP2WC: 200, GRP3B:  201, GRP3W:  202, GRP4B:  203, GRP4W:  204, OP0F:   205, GRP6:   206, GRP7:   207
    };

    /*
     * Instruction names (mnemonics), indexed by instruction ordinal (above)
     */
    Debugger.INS_NAMES = [
        "INVALID","AAA",    "AAD",    "AAM",    "AAS",    "ADC",    "ADD",    "AND",
        "ARPL",   "AS:",    "BOUND",  "BSF",    "BSR",    "BT",     "BTC",    "BTR",
        "BTS",    "CALL",   "CBW",    "CLC",    "CLD",    "CLI",    "CLTS",   "CMC",
        "CMP",    "CMPSB",  "CMPSW",  "CS:",    "CWD",    "DAA",    "DAS",    "DEC",
        "DIV",    "DS:",    "ENTER",  "ES:",    "ESC",    "FADD",   "FBLD",   "FBSTP",
        "FCOM",   "FCOMP",  "FDIV",   "FDIVR",  "FIADD",  "FICOM",  "FICOMP", "FIDIV",
        "FIDIVR", "FILD",   "FIMUL",  "FIST",   "FISTP",  "FISUB",  "FISUBR", "FLD",
        "FLDCW",  "FLDENV", "FMUL",   "FNSAVE", "FNSTCW", "FNSTENV","FNSTSW", "FRSTOR",
        "FS:",    "FST",    "FSTP",   "FSUB",   "FSUBR",  "GS:",    "HLT",    "IDIV",
        "IMUL",   "IN",     "INC",    "INS",    "INT",    "INT3",   "INTO",   "IRET",
        "JBE",    "JC",     "JCXZ",   "JG",     "JGE",    "JL",     "JLE",    "JMP",
        "JNBE",   "JNC",    "JNO",    "JNP",    "JNS",    "JNZ",    "JO",     "JP",
        "JS",     "JZ",     "LAHF",   "LAR",    "LDS",    "LEA",    "LEAVE",  "LES",
        "LFS",    "LGDT",   "LGS",    "LIDT",   "LLDT",   "LMSW",   "LOADALL","LOCK",
        "LODSB",  "LODSW",  "LOOP",   "LOOPNZ", "LOOPZ",  "LSL",    "LSS",    "LTR",
        "MOV",    "MOVSB",  "MOVSW",  "MOVSX",  "MOVZX",  "MUL",    "NEG",    "NOP",
        "NOT",    "OR",     "OS:",    "OUT",    "OUTS",   "POP",    "POPA",   "POPF",
        "PUSH",   "PUSHA",  "PUSHF",  "RCL",    "RCR",    "REPNZ",  "REPZ",   "RET",
        "RETF",   "ROL",    "ROR",    "SAHF",   "SALC",   "SAR",    "SBB",    "SCASB",
        "SCASW",  "SETBE",  "SETC",   "SETG",   "SETGE",  "SETL",   "SETLE",  "SETNBE",
        "SETNC",  "SETNO",  "SETNP",  "SETNS",  "SETNZ",  "SETO",   "SETP",   "SETS",
        "SETZ",   "SGDT",   "SHL",    "SHLD",   "SHR",    "SHRD",   "SIDT",   "SLDT",
        "SMSW",   "SS:",    "STC",    "STD",    "STI",    "STOSB",  "STOSW",  "STR",
        "SUB",    "TEST",   "VERR",   "VERW",   "WAIT",   "XCHG",   "XLAT",   "XOR"
    ];

    Debugger.CPU_8086  = 0;
    Debugger.CPU_80186 = 1;
    Debugger.CPU_80286 = 2;
    Debugger.CPU_80386 = 3;
    Debugger.CPUS = [8086, 80186, 80286, 80386];

    /*
     * ModRM masks and definitions
     */
    Debugger.REG_AL  = 0x00;             // bits 0-2 are standard Reg encodings
    Debugger.REG_CL  = 0x01;
    Debugger.REG_DL  = 0x02;
    Debugger.REG_BL  = 0x03;
    Debugger.REG_AH  = 0x04;
    Debugger.REG_CH  = 0x05;
    Debugger.REG_DH  = 0x06;
    Debugger.REG_BH  = 0x07;
    Debugger.REG_AX  = 0x08;
    Debugger.REG_CX  = 0x09;
    Debugger.REG_DX  = 0x0A;
    Debugger.REG_BX  = 0x0B;
    Debugger.REG_SP  = 0x0C;
    Debugger.REG_BP  = 0x0D;
    Debugger.REG_SI  = 0x0E;
    Debugger.REG_DI  = 0x0F;
    Debugger.REG_SEG = 0x10;
    Debugger.REG_IP  = 0x16;
    Debugger.REG_PS  = 0x17;
    Debugger.REG_EAX = 0x18;
    Debugger.REG_ECX = 0x19;
    Debugger.REG_EDX = 0x1A;
    Debugger.REG_EBX = 0x1B;
    Debugger.REG_ESP = 0x1C;
    Debugger.REG_EBP = 0x1D;
    Debugger.REG_ESI = 0x1E;
    Debugger.REG_EDI = 0x1F;
    Debugger.REG_CR0 = 0x20;
    Debugger.REG_CR1 = 0x21;
    Debugger.REG_CR2 = 0x22;
    Debugger.REG_CR3 = 0x23;

    Debugger.REGS = [
        "AL",  "CL",  "DL",  "BL",  "AH",  "CH",  "DH",  "BH",
        "AX",  "CX",  "DX",  "BX",  "SP",  "BP",  "SI",  "DI",
        "ES",  "CS",  "SS",  "DS",  "FS",  "GS",  "IP",  "PS",
        "EAX", "ECX", "EDX", "EBX", "ESP", "EBP", "ESI", "EDI",
        "CR0", "CR1", "CR2", "CR3"
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

    Debugger.RMS = [
        "BX+SI", "BX+DI", "BP+SI", "BP+DI", "SI",    "DI",    "BP",    "BX",
        "EAX",   "ECX",   "EDX",   "EBX",   "ESP",   "EBP",   "ESI",   "EDI"
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
    Debugger.TYPE_2WORD     = 0x0007;   // (a) two memory operands (BOUND only)
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
    Debugger.TYPE_AX = (Debugger.REG_AX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
    Debugger.TYPE_CX = (Debugger.REG_CX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
    Debugger.TYPE_DX = (Debugger.REG_DX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
    Debugger.TYPE_BX = (Debugger.REG_BX << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
    Debugger.TYPE_SP = (Debugger.REG_SP << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
    Debugger.TYPE_BP = (Debugger.REG_BP << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
    Debugger.TYPE_SI = (Debugger.REG_SI << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
    Debugger.TYPE_DI = (Debugger.REG_DI << 8 | Debugger.TYPE_IMPREG | Debugger.TYPE_VWORD);
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
    Debugger.TYPE_8086  = (Debugger.CPU_8086 << 14);
    Debugger.TYPE_80186 = (Debugger.CPU_80186 << 14);
    Debugger.TYPE_80286 = (Debugger.CPU_80286 << 14);
    Debugger.TYPE_80386 = (Debugger.CPU_80386 << 14);
    Debugger.TYPE_CPU_SHIFT = 14;

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
        "cpu":      Messages.CPU,
        "seg":      Messages.SEG,
        "desc":     Messages.DESC,
        "tss":      Messages.TSS,
        "int":      Messages.INT,
        "fault":    Messages.FAULT,
        "bus":      Messages.BUS,
        "mem":      Messages.MEM,
        "port":     Messages.PORT,
        "dma":      Messages.DMA,
        "pic":      Messages.PIC,
        "timer":    Messages.TIMER,
        "cmos":     Messages.CMOS,
        "rtc":      Messages.RTC,
        "8042":     Messages.C8042,
        "chipset":  Messages.CHIPSET,   // ie, anything else in ChipSet besides DMA, PIC, TIMER, CMOS, RTC and 8042
        "keyboard": Messages.KEYBOARD,
        "key":      Messages.KEYS,      // using "keys" instead of "key" causes an unfortunate JavaScript property collision
        "video":    Messages.VIDEO,
        "fdc":      Messages.FDC,
        "hdc":      Messages.HDC,
        "disk":     Messages.DISK,
        "serial":   Messages.SERIAL,
        "speaker":  Messages.SPEAKER,
        "state":    Messages.STATE,
        "mouse":    Messages.MOUSE,
        "computer": Messages.COMPUTER,
        "dos":      Messages.DOS,
        "data":     Messages.DATA,
        "log":      Messages.LOG,
        "warn":     Messages.WARN,
        /*
         * Now we turn to message actions rather than message types; for example, setting "halt"
         * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
         */
        "halt":     Messages.HALT
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
     *      On the 80186, it generated an Invalid Opcode (UD_FAULT) exception
     *      On the 80286, it introduced a new (and growing) series of two-byte opcodes
     *
     * Based on the active CPU model, we make every effort to execute and disassemble this (and every other)
     * opcode appropriately, by setting the opcode's entry in aaOpDescs accordingly.  0x0F in aaOpDescs points
     * to the 8086 table: aOpDescPopCS.
     *
     * Note that we must NOT modify aaOpDescs directly.  this.aaOpDescs will point to Debugger.aaOpDescs
     * if the processor is an 8086, because that's the processor that the hard-coded contents of the table
     * represent; for all other processors, this.aaOpDescs will contain a copy of the table that we can modify.
     */
    Debugger.aOpDescPopCS     = [Debugger.INS.POP,  Debugger.TYPE_CS   | Debugger.TYPE_OUT];
    Debugger.aOpDescUndefined = [Debugger.INS.NONE, Debugger.TYPE_NONE];
    Debugger.aOpDesc0F        = [Debugger.INS.OP0F, Debugger.TYPE_WORD | Debugger.TYPE_BOTH];

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

    /* 0x60 */ [Debugger.INS.PUSHA, Debugger.TYPE_NONE   | Debugger.TYPE_80286],
    /* 0x61 */ [Debugger.INS.POPA,  Debugger.TYPE_NONE   | Debugger.TYPE_80286],
    /* 0x62 */ [Debugger.INS.BOUND, Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80286, Debugger.TYPE_MODRM | Debugger.TYPE_2WORD | Debugger.TYPE_IN],
    /* 0x63 */ [Debugger.INS.ARPL,  Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  | Debugger.TYPE_OUT,                        Debugger.TYPE_REG   | Debugger.TYPE_WORD  | Debugger.TYPE_IN],
    /* 0x64 */ [Debugger.INS.FS,    Debugger.TYPE_PREFIX | Debugger.TYPE_80386],
    /* 0x65 */ [Debugger.INS.GS,    Debugger.TYPE_PREFIX | Debugger.TYPE_80386],
    /* 0x66 */ [Debugger.INS.OS,    Debugger.TYPE_PREFIX | Debugger.TYPE_80386],
    /* 0x67 */ [Debugger.INS.AS,    Debugger.TYPE_PREFIX | Debugger.TYPE_80386],

    /* 0x68 */ [Debugger.INS.PUSH,  Debugger.TYPE_IMM    | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80286],
    /* 0x69 */ [Debugger.INS.IMUL,  Debugger.TYPE_REG    | Debugger.TYPE_WORD  | Debugger.TYPE_BOTH | Debugger.TYPE_80286,   Debugger.TYPE_MODRM | Debugger.TYPE_WORDIW | Debugger.TYPE_IN],
    /* 0x6A */ [Debugger.INS.PUSH,  Debugger.TYPE_IMM    | Debugger.TYPE_SBYTE | Debugger.TYPE_IN   | Debugger.TYPE_80286],
    /* 0x6B */ [Debugger.INS.IMUL,  Debugger.TYPE_REG    | Debugger.TYPE_WORD  | Debugger.TYPE_BOTH | Debugger.TYPE_80286,   Debugger.TYPE_MODRM | Debugger.TYPE_WORDIB | Debugger.TYPE_IN],
    /* 0x6C */ [Debugger.INS.INS,   Debugger.TYPE_ESDI   | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT  | Debugger.TYPE_80286,   Debugger.TYPE_DX    | Debugger.TYPE_IN],
    /* 0x6D */ [Debugger.INS.INS,   Debugger.TYPE_ESDI   | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80286,   Debugger.TYPE_DX    | Debugger.TYPE_IN],
    /* 0x6E */ [Debugger.INS.OUTS,  Debugger.TYPE_DX     | Debugger.TYPE_IN    | Debugger.TYPE_80286,   Debugger.TYPE_DSSI | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0x6F */ [Debugger.INS.OUTS,  Debugger.TYPE_DX     | Debugger.TYPE_IN    | Debugger.TYPE_80286,   Debugger.TYPE_DSSI | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

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
    /* 0x8C */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,  Debugger.TYPE_SEGREG | Debugger.TYPE_WORD  | Debugger.TYPE_IN],
    /* 0x8D */ [Debugger.INS.LEA,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT,  Debugger.TYPE_MEM    | Debugger.TYPE_VWORD],
    /* 0x8E */ [Debugger.INS.MOV,   Debugger.TYPE_SEGREG | Debugger.TYPE_WORD  | Debugger.TYPE_OUT,  Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_IN],
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

    /* 0xC0 */ [Debugger.INS.GRP2B, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_BOTH | Debugger.TYPE_80186, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xC1 */ [Debugger.INS.GRP2W, Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80186, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xC2 */ [Debugger.INS.RET,   Debugger.TYPE_IMM    | Debugger.TYPE_WORD  | Debugger.TYPE_IN],
    /* 0xC3 */ [Debugger.INS.RET],
    /* 0xC4 */ [Debugger.INS.LES,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT, Debugger.TYPE_MEM | Debugger.TYPE_FARP  | Debugger.TYPE_IN],
    /* 0xC5 */ [Debugger.INS.LDS,   Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT, Debugger.TYPE_MEM | Debugger.TYPE_FARP  | Debugger.TYPE_IN],
    /* 0xC6 */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE  | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE  | Debugger.TYPE_IN],
    /* 0xC7 */ [Debugger.INS.MOV,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT, Debugger.TYPE_IMM | Debugger.TYPE_VWORD | Debugger.TYPE_IN],

    /* 0xC8 */ [Debugger.INS.ENTER, Debugger.TYPE_IMM    | Debugger.TYPE_WORD  | Debugger.TYPE_IN | Debugger.TYPE_80286,  Debugger.TYPE_IMM   | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
    /* 0xC9 */ [Debugger.INS.LEAVE, Debugger.TYPE_NONE   | Debugger.TYPE_80286],
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
    /* 0xD6 */ [Debugger.INS.SALC],
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
        0x00: [Debugger.INS.GRP6,   Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  | Debugger.TYPE_BOTH],
        0x01: [Debugger.INS.GRP7,   Debugger.TYPE_MODRM  | Debugger.TYPE_WORD  | Debugger.TYPE_BOTH],
        0x02: [Debugger.INS.LAR,    Debugger.TYPE_REG    | Debugger.TYPE_WORD  | Debugger.TYPE_OUT  | Debugger.TYPE_80286, Debugger.TYPE_MEM    | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        0x03: [Debugger.INS.LSL,    Debugger.TYPE_REG    | Debugger.TYPE_WORD  | Debugger.TYPE_OUT  | Debugger.TYPE_80286, Debugger.TYPE_MEM    | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        0x05: [Debugger.INS.LOADALL,Debugger.TYPE_80286],
        0x06: [Debugger.INS.CLTS,   Debugger.TYPE_80286],
        0x20: [Debugger.INS.MOV,    Debugger.TYPE_MODRM  | Debugger.TYPE_DWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_CTLREG | Debugger.TYPE_DWORD | Debugger.TYPE_IN],
        0x22: [Debugger.INS.MOV,    Debugger.TYPE_CTLREG | Debugger.TYPE_DWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_MODRM  | Debugger.TYPE_DWORD | Debugger.TYPE_IN],
        0x80: [Debugger.INS.JO,     Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x81: [Debugger.INS.JNO,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x82: [Debugger.INS.JC,     Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x83: [Debugger.INS.JNC,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x84: [Debugger.INS.JZ,     Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x85: [Debugger.INS.JNZ,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x86: [Debugger.INS.JBE,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x87: [Debugger.INS.JNBE,   Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x88: [Debugger.INS.JS,     Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x89: [Debugger.INS.JNS,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x8A: [Debugger.INS.JP,     Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x8B: [Debugger.INS.JNP,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x8C: [Debugger.INS.JL,     Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x8D: [Debugger.INS.JGE,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x8E: [Debugger.INS.JLE,    Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0x8F: [Debugger.INS.JG,     Debugger.TYPE_IMMREL | Debugger.TYPE_VWORD | Debugger.TYPE_IN   | Debugger.TYPE_80386],
        0xA0: [Debugger.INS.PUSH,   Debugger.TYPE_FS     | Debugger.TYPE_IN    | Debugger.TYPE_80386],
        0xA1: [Debugger.INS.POP,    Debugger.TYPE_FS     | Debugger.TYPE_OUT   | Debugger.TYPE_80386],
        0xA4: [Debugger.INS.SHLD,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN, Debugger.TYPE_IMM    | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        0xA5: [Debugger.INS.SHLD,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN, Debugger.TYPE_IMPREG | Debugger.TYPE_CL   | Debugger.TYPE_IN],
        0xA8: [Debugger.INS.PUSH,   Debugger.TYPE_GS     | Debugger.TYPE_IN    | Debugger.TYPE_80386],
        0xA9: [Debugger.INS.POP,    Debugger.TYPE_GS     | Debugger.TYPE_OUT   | Debugger.TYPE_80386],
        0xAC: [Debugger.INS.SHRD,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN, Debugger.TYPE_IMM    | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        0xAD: [Debugger.INS.SHRD,   Debugger.TYPE_MODRM  | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_IN, Debugger.TYPE_IMPREG | Debugger.TYPE_CL   | Debugger.TYPE_IN],
        0xB6: [Debugger.INS.MOVZX,  Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        0xB7: [Debugger.INS.MOVZX,  Debugger.TYPE_REG    | Debugger.TYPE_DWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_MODRM  | Debugger.TYPE_WORD | Debugger.TYPE_IN],
        0xBE: [Debugger.INS.MOVSX,  Debugger.TYPE_REG    | Debugger.TYPE_VWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_MODRM  | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        0xBF: [Debugger.INS.MOVSX,  Debugger.TYPE_REG    | Debugger.TYPE_DWORD | Debugger.TYPE_OUT  | Debugger.TYPE_80386, Debugger.TYPE_MODRM  | Debugger.TYPE_WORD | Debugger.TYPE_IN]
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
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_BYTE | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN]
      ],
      [
        /* GRP2W */
        [Debugger.INS.ROL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.ROR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.RCR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHL,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
        [Debugger.INS.SHR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN],
         Debugger.aOpDescUndefined,
        [Debugger.INS.SAR,  Debugger.TYPE_MODRM | Debugger.TYPE_VWORD | Debugger.TYPE_BOTH | Debugger.TYPE_80286, Debugger.TYPE_IMM | Debugger.TYPE_BYTE | Debugger.TYPE_IN]
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
            0x02: "read drive DL (CH:DH:CL,AL) into ES:BX",
            0x03: "write drive DL (CH:DH:CL,AL) from ES:BX",
            0x04: "verify drive DL (CH:DH:CL,AL)",
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
        this.maskAddr = bus.busLimit;

        this.aaOpDescs = Debugger.aaOpDescs;
        if (this.cpu.model >= X86.MODEL_80186) {
            this.aaOpDescs = Debugger.aaOpDescs.slice();
            this.aaOpDescs[0x0F] = Debugger.aOpDescUndefined;
            if (this.cpu.model >= X86.MODEL_80286) {
                this.aaOpDescs[0x0F] = Debugger.aOpDesc0F;
                if (I386 && this.cpu.model >= X86.MODEL_80386) {
                    this.cchReg = 8;
                    this.maskReg = 0xffffffff|0;
                }
            }
        }

        this.messageDump(Messages.BUS,  function onDumpBus(s)  { dbg.dumpBus(s); });
        this.messageDump(Messages.DESC, function onDumpDesc(s) { dbg.dumpDesc(s); });
        this.messageDump(Messages.TSS,  function onDumpTSS(s)  { dbg.dumpTSS(s); });
        this.messageDump(Messages.DOS,  function onDumpDOS(s)  { dbg.dumpDOS(s); });

        this.setReady();
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
             *      control.focus();
             */
            control.onkeydown = function onKeyDownDebugInput(event) {
                var sInput;
                if (event.keyCode == Keyboard.KEYCODE.CR) {
                    sInput = control.value;
                    control.value = "";
                    var a = dbg.parseCommand(sInput, true);
                    for (var s in a) dbg.doCommand(a[s]);
                }
                else if (event.keyCode == Keyboard.KEYCODE.ESC) {
                    control.value = sInput = "";
                }
                else {
                    if (event.keyCode == Keyboard.KEYCODE.UP) {
                        if (dbg.iPrevCmd < dbg.aPrevCmds.length - 1) {
                            sInput = dbg.aPrevCmds[++dbg.iPrevCmd];
                        }
                    }
                    else if (event.keyCode == Keyboard.KEYCODE.DOWN) {
                        if (dbg.iPrevCmd > 0) {
                            sInput = dbg.aPrevCmds[--dbg.iPrevCmd];
                        } else {
                            sInput = "";
                            dbg.iPrevCmd = -1;
                        }
                    }
                    if (sInput != null) {
                        var cch = sInput.length;
                        control.value = sInput;
                        control.setSelectionRange(cch, cch);
                    }
                }
                if (sInput != null && event.preventDefault) event.preventDefault();
            };
            return true;

        case "debugEnter":
            this.bindings[sBinding] = control;
            web.onClickRepeat(
                control,
                500, 100,
                function onClickDebugEnter(fRepeat) {
                    if (dbg.controlDebug) {
                        var sInput = dbg.controlDebug.value;
                        dbg.controlDebug.value = "";
                        var a = dbg.parseCommand(sInput, true);
                        for (var s in a) dbg.doCommand(a[s]);
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
        if (sel == this.cpu.getCS()) return this.cpu.segCS;
        if (sel == this.cpu.getDS()) return this.cpu.segDS;
        if (sel == this.cpu.getES()) return this.cpu.segES;
        if (sel == this.cpu.getSS()) return this.cpu.segSS;
        if (I386 && this.cpu.model >= X86.MODEL_80386) {
            if (sel == this.cpu.getFS()) return this.cpu.segFS;
            if (sel == this.cpu.getGS()) return this.cpu.segGS;
        }
        var seg = new X86Seg(this.cpu, X86Seg.ID.DEBUG, "DBG");
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
     * @param {number} [cb] is number of bytes to check (1, 2 or 4); default is 1
     * @return {number} is the corresponding linear address, or X86.ADDR_INVALID
     */
    Debugger.prototype.getAddr = function(aAddr, fWrite, cb)
    {
        /*
         * Some addresses (eg, breakpoint addresses) save their original linear address in aAddr[2],
         * so we want to use that if it's there, but otherwise, aAddr is assumed to be a virtual address
         * ([off, seg]) whose linear address must be calculated based on current machine state
         * (mode, active descriptor tables, etc).
         */
        var addr = aAddr[2];
        if (addr == null) {
            var seg = this.getSegment(aAddr[1]);
            if (!fWrite) {
                addr = seg.checkRead(aAddr[0], cb || 1, true);
            } else {
                addr = seg.checkWrite(aAddr[0], cb || 1, true);
            }
            aAddr[2] = addr;
        }
        return addr;
    };

    /**
     * getByte(aAddr, inc)
     *
     * We must route all our memory requests through the CPU now, in case paging is enabled.
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} [inc]
     * @return {number}
     */
    Debugger.prototype.getByte = function(aAddr, inc)
    {
        var b = 0xff;
        var addr = this.getAddr(aAddr, false, 1);
        if (addr !== X86.ADDR_INVALID) {
            this.nSuppress++;
            b = this.cpu.getByte(addr);
            this.nSuppress--;
            if (inc) this.incAddr(aAddr, inc);
        }
        return b;
    };

    /**
     * getWord(aAddr, fAdvance)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {boolean} [fAdvance]
     * @return {number}
     */
    Debugger.prototype.getWord = function(aAddr, fAdvance)
    {
        if (!aAddr[4]) {
            return this.getShort(aAddr, fAdvance? 2 : 0);
        }
        return this.getLong(aAddr, fAdvance? 4 : 0);
    };

    /**
     * getShort(aAddr, inc)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} [inc]
     * @return {number}
     */
    Debugger.prototype.getShort = function(aAddr, inc)
    {
        var w = 0xffff;
        var addr = this.getAddr(aAddr, false, 2);
        if (addr !== X86.ADDR_INVALID) {
            this.nSuppress++;
            w = this.cpu.getShort(addr);
            this.nSuppress--;
            if (inc) this.incAddr(aAddr, inc);
        }
        return w;
    };

    /**
     * getLong(aAddr, inc)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} [inc]
     * @return {number}
     */
    Debugger.prototype.getLong = function(aAddr, inc)
    {
        var l = -1;
        var addr = this.getAddr(aAddr, false, 4);
        if (addr !== X86.ADDR_INVALID) {
            this.nSuppress++;
            l = this.cpu.getLong(addr);
            this.nSuppress--;
            if (inc) this.incAddr(aAddr, inc);
        }
        return l;
    };

    /**
     * setByte(aAddr, b, inc)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} b
     * @param {number} [inc]
     */
    Debugger.prototype.setByte = function(aAddr, b, inc)
    {
        var addr = this.getAddr(aAddr, true, 1);
        if (addr !== X86.ADDR_INVALID) {
            this.nSuppress++;
            this.cpu.setByte(addr, b);
            this.nSuppress--;
            if (inc) this.incAddr(aAddr, inc);
            this.cpu.updateCPU();
        }
    };

    /**
     * setShort(aAddr, w, inc)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {number} w
     * @param {number} [inc]
     */
    Debugger.prototype.setShort = function(aAddr, w, inc)
    {
        var addr = this.getAddr(aAddr, true, 2);
        if (addr !== X86.ADDR_INVALID) {
            this.nSuppress++;
            this.cpu.setShort(addr, w);
            this.nSuppress--;
            if (inc) this.incAddr(aAddr, inc);
            this.cpu.updateCPU();
        }
    };

    /**
     * newAddr(off, seg, addr, fData32, fAddr32)
     *
     * @this {Debugger}
     * @param {number} off
     * @param {number} seg
     * @param {number|null} [addr]
     * @param {boolean} [fData32]
     * @param {boolean} [fAddr32]
     * @return {Array} containing [off, seg, addr]
     */
    Debugger.prototype.newAddr = function(off, seg, addr, fData32, fAddr32)
    {
        if (fData32 === undefined) fData32 = (this.cpu.segCS.dataSize == 4);
        if (fAddr32 === undefined) fAddr32 = (this.cpu.segCS.addrSize == 4);
        return [off, seg, addr, false, fData32, fAddr32];
    };

    /**
     * checkLimit(aAddr)
     *
     * @this {Debugger}
     * @param {Array} aAddr containing [off, seg, addr]
     */
    Debugger.prototype.checkLimit = function(aAddr)
    {
        if (aAddr[1] != null) {
            var limit = this.getSegment(aAddr[1]).limit;
            if (aAddr[0] > limit) {
                aAddr[0] = 0;
                aAddr[2] = null;
            }
        }
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
            this.checkLimit(aAddr);
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
        return aAddr[1] == null? ("%" + str.toHex(aAddr[2])) : this.hexOffset(aAddr[0], aAddr[1], aAddr[5]);
    };

    /**
     * hexOffset(off, sel, fAddr32)
     *
     * @this {Debugger}
     * @param {number} off
     * @param {number} [sel]
     * @param {boolean} [fAddr32] is true to force 32-bit ADDRESS size
     * @return {string} the hex representation of off (or sel:off)
     */
    Debugger.prototype.hexOffset = function(off, sel, fAddr32)
    {
        if (sel !== undefined) {
            return str.toHex(sel, 4) + ":" + str.toHex(off, (off & (0xffff0000|0)) || fAddr32? 8 : 4);
        }
        return str.toHex(off);
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
        if (!s) {
            this.println("no MCB");
            return;
        }

        this.println("dumpDOS(" + s + ")");

        /*
         * If s is provided and str.parseInt(s) succeeds, then we assume it represents a starting
         * MCB (Memory Control Block) segment, and we dump the corresponding blocks.
         */
        var seg = this.parseValue(s);
        while (seg) {
            var aAddr = this.newAddr(0, seg);
            var bSig = this.getByte(aAddr, 1);
            var wPID = this.getShort(aAddr, 2);
            var wParas = this.getShort(aAddr, 5);
            if (bSig != 0x4D && bSig != 0x5A) break;
            this.println(this.hexOffset(0, seg) + ": '" + String.fromCharCode(bSig) + "' PID=" + str.toHexWord(wPID) + " LEN=" + str.toHexWord(wParas) + ' "' + this.dumpSZ(aAddr, 8) + '"');
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
     * dumpBus(s)
     *
     * This dumps Bus allocations.
     *
     * @this {Debugger}
     * @param {string} [s]
     */
    Debugger.prototype.dumpBus = function(s)
    {
        this.println("id       physaddr   blkaddr   used    size    type");
        this.println("-------- ---------  --------  ------  ------  ----");
        for (var i = 0; i < this.cpu.aMemBlocks.length; i++) {
            var block = this.cpu.aBusBlocks[i];
            if (block.type === Memory.TYPE.NONE) continue;
            this.println(str.toHex(block.id) + " %" + str.toHex(i << this.cpu.blockShift) + ": " + str.toHex(block.addr) + "  " + str.toHexWord(block.used) + "  " + str.toHexWord(block.size) + "  " + Memory.TYPE.NAMES[block.type]);
        }
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
        var fGate = false;
        if (seg.type & X86.DESC.ACC.TYPE.SEG) {
            if (seg.type & X86.DESC.ACC.TYPE.CODE) {
                sType = "code";
                sType += (seg.type & X86.DESC.ACC.TYPE.READABLE)? ",readable" : ",execonly";
                if (seg.type & X86.DESC.ACC.TYPE.CONFORMING) sType += ",conforming";
            }
            else {
                sType = "data";
                sType += (seg.type & X86.DESC.ACC.TYPE.WRITABLE)? ",writable" : ",readonly";
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
                fGate = true;
                break;
            case X86.DESC.ACC.TYPE.GATE_TASK:
                sType = "task gate";
                fGate = true;
                break;
            case X86.DESC.ACC.TYPE.GATE_INT:
                sType = "int gate";
                fGate = true;
                break;
            case X86.DESC.ACC.TYPE.GATE_TRAP:
                sType = "trap gate";
                fGate = true;
                break;
            default:
                break;
            }
        }

        if (sType && !(seg.acc & X86.DESC.ACC.PRESENT)) sType += ",not present";

        var sDump;
        if (fGate) {
            sDump = "seg=" + str.toHexWord(seg.base & 0xffff) + " off=" + str.toHexWord(seg.limit);
        } else {
            sDump = "base=" + str.toHex(seg.base, this.cchAddr) + " limit=" + str.toHex(seg.limit, (seg.limit & ~0xffff)? 8 : 4);
        }
        /*
         * When we dump the EXT word, we mask off the LIMIT1619 and BASE2431 bits, because those have already
         * been incorporated into the limit and base properties of the segment register; all we care about here
         * are whether EXT contains any of the AVAIL (0x10), BIG (0x40) or LIMITPAGES (0x80) bits.
         */
        this.println(sDump + " dpl=" + str.toHexByte(seg.dpl) + " type=" + str.toHexByte(seg.type >> 8) + " (" + sType + ")" + " ext=" + str.toHexWord(seg.ext & ~(X86.DESC.EXT.LIMIT1619 | X86.DESC.EXT.BASE2431)));
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
            var w = this.cpu.getShort(seg.base + off);
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
     * messageInit(sEnable)
     *
     * @this {Debugger}
     * @param {string|undefined} sEnable contains zero or more message categories to enable, separated by '|' or ';'
     */
    Debugger.prototype.messageInit = function(sEnable)
    {
        this.dbg = this;
        this.bitsMessage = this.bitsWarning = Messages.WARN;
        this.sMessagePrev = null;
        this.afnDumpers = [];
        var aEnable = this.parseCommand(sEnable.replace("keys","key").replace("kbd","keyboard"));
        if (aEnable.length) {
            for (var m in Debugger.MESSAGES) {
                if (usr.indexOf(aEnable, m) >= 0) {
                    this.bitsMessage |= Debugger.MESSAGES[m];
                    this.println(m + " messages enabled");
                }
            }
        }
    };

    /**
     * messageDump(bitMessage, fnDumper)
     *
     * @this {Debugger}
     * @param {number} bitMessage is one Messages category flag
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
     * getRegIndex(sReg)
     *
     * @this {Debugger}
     * @param {string} sReg
     * @return {number}
     */
    Debugger.prototype.getRegIndex = function(sReg) {
        return usr.indexOf(Debugger.REGS, sReg.toUpperCase());
    };

    /**
     * getRegValue(iReg)
     *
     * @this {Debugger}
     * @param {number} iReg
     * @return {string}
     */
    Debugger.prototype.getRegValue = function(iReg) {
        var s = "??";
        if (iReg >= 0) {
            var n, cch;
            var cpu = this.cpu;
            switch(iReg) {
            case Debugger.REG_AL:
                n = cpu.regEAX;  cch = 2;
                break;
            case Debugger.REG_CL:
                n = cpu.regECX;  cch = 2;
                break;
            case Debugger.REG_DL:
                n = cpu.regEDX;  cch = 2;
                break;
            case Debugger.REG_BL:
                n = cpu.regEBX;  cch = 2;
                break;
            case Debugger.REG_AH:
                n = cpu.regEAX >> 8; cch = 2;
                break;
            case Debugger.REG_CH:
                n = cpu.regECX >> 8; cch = 2;
                break;
            case Debugger.REG_DH:
                n = cpu.regEDX >> 8; cch = 2;
                break;
            case Debugger.REG_BH:
                n = cpu.regEBX >> 8; cch = 2;
                break;
            case Debugger.REG_AX:
                n = cpu.regEAX;  cch = 4;
                break;
            case Debugger.REG_CX:
                n = cpu.regECX;  cch = 4;
                break;
            case Debugger.REG_DX:
                n = cpu.regEDX;  cch = 4;
                break;
            case Debugger.REG_BX:
                n = cpu.regEBX;  cch = 4;
                break;
            case Debugger.REG_SP:
                n = cpu.getSP(); cch = 4;
                break;
            case Debugger.REG_BP:
                n = cpu.regEBP;  cch = 4;
                break;
            case Debugger.REG_SI:
                n = cpu.regESI;  cch = 4;
                break;
            case Debugger.REG_DI:
                n = cpu.regEDI;  cch = 4;
                break;
            case Debugger.REG_IP:
                n = cpu.getIP(); cch = this.cchReg;
                break;
            case Debugger.REG_PS:
                n = cpu.getPS(); cch = this.cchReg;
                break;
            case Debugger.REG_SEG + Debugger.REG_ES:
                n = cpu.getES(); cch = 4;
                break;
            case Debugger.REG_SEG + Debugger.REG_CS:
                n = cpu.getCS(); cch = 4;
                break;
            case Debugger.REG_SEG + Debugger.REG_SS:
                n = cpu.getSS(); cch = 4;
                break;
            case Debugger.REG_SEG + Debugger.REG_DS:
                n = cpu.getDS(); cch = 4;
                break;
            }
            if (I386 && this.cpu.model >= X86.MODEL_80386 && !cch) {
                switch(iReg) {
                case Debugger.REG_EAX:
                    n = cpu.regEAX;  cch = 8;
                    break;
                case Debugger.REG_ECX:
                    n = cpu.regECX;  cch = 8;
                    break;
                case Debugger.REG_EDX:
                    n = cpu.regEDX;  cch = 8;
                    break;
                case Debugger.REG_EBX:
                    n = cpu.regEBX;  cch = 8;
                    break;
                case Debugger.REG_ESP:
                    n = cpu.getSP(); cch = 8;
                    break;
                case Debugger.REG_EBP:
                    n = cpu.regEBP;  cch = 8;
                    break;
                case Debugger.REG_ESI:
                    n = cpu.regESI;  cch = 8;
                    break;
                case Debugger.REG_EDI:
                    n = cpu.regEDI;  cch = 8;
                    break;
                case Debugger.REG_CR0:
                    n = cpu.regCR0;  cch = 8;
                    break;
                case Debugger.REG_CR1:
                    n = cpu.regCR1;  cch = 8;
                    break;
                case Debugger.REG_CR2:
                    n = cpu.regCR2;  cch = 8;
                    break;
                case Debugger.REG_CR3:
                    n = cpu.regCR3;  cch = 8;
                    break;
                case Debugger.REG_SEG + Debugger.REG_FS:
                    n = cpu.getFS(); cch = 4;
                    break;
                case Debugger.REG_SEG + Debugger.REG_GS:
                    n = cpu.getGS(); cch = 4;
                    break;
                }
            }
            if (cch) s = str.toHex(n, cch);
        }
        return s;
    };

    /**
     * replaceRegs()
     *
     * @this {Debugger}
     * @param {string} s
     * @return {string}
     */
    Debugger.prototype.replaceRegs = function(s) {
        for (var iReg = 0; iReg < Debugger.REGS.length; iReg++) {
            var sReg = Debugger.REGS[iReg];
            if (s.indexOf(sReg) >= 0) {
                s = str.replaceAll(sReg, this.getRegValue(iReg), s);
            }
        }
        return s;
    };

    /**
     * message(sMessage, fAddress)
     *
     * @this {Debugger}
     * @param {string} sMessage is any caller-defined message string
     * @param {boolean} [fAddress] is true to display the current CS:IP
     */
    Debugger.prototype.message = function(sMessage, fAddress)
    {
        if (fAddress) {
            sMessage += " @" + this.hexOffset(this.cpu.getIP(), this.cpu.getCS());
        }

        if (this.sMessagePrev && sMessage == this.sMessagePrev) return;

        if (!SAMPLER) this.println(sMessage);   // + " (" + this.cpu.getCycles() + " cycles)"

        this.sMessagePrev = sMessage;

        if (this.cpu) {
            if (this.bitsMessage & Messages.HALT) {
                this.stopCPU();
            }
            /*
             * We have no idea what the frequency of println() calls might be; all we know is that they easily
             * screw up the CPU's careful assumptions about cycles per burst.  So we call yieldCPU() after every
             * message, to effectively end the current burst and start fresh.
             *
             * TODO: See CPU.calcStartTime() for a discussion of why we might want to call yieldCPU() *before*
             * we display the message.
             */
            this.cpu.yieldCPU();
        }
    };

    /**
     * messageInt(nInt, addr)
     *
     * @this {Debugger}
     * @param {number} nInt
     * @param {number} addr (LIP after the "INT n" instruction has been fetched but not dispatched)
     * @return {boolean} true if message generated (which in turn triggers addIntReturn() inside checkIntNotify()), false if not
     */
    Debugger.prototype.messageInt = function(nInt, addr)
    {
        var AH;
        var fMessage = false;
        var nCategory = Debugger.INT_MESSAGES[nInt];
        if (nCategory) {
            AH = this.cpu.regEAX >> 8;
            if (this.messageEnabled(nCategory)) {
                fMessage = true;
            } else {
                fMessage = (nCategory == Messages.FDC && this.messageEnabled(nCategory = Messages.HDC));
            }
        }
        if (fMessage) {
            var DL = this.cpu.regEDX & 0xff;
            if (nInt == Interrupts.DOS.VECTOR && AH == 0x0b ||
                nCategory == Messages.FDC && DL >= 0x80 || nCategory == Messages.HDC && DL < 0x80) {
                fMessage = false;
            }
        }
        if (fMessage) {
            var aFuncs = Debugger.INT_FUNCS[nInt];
            var sFunc = (aFuncs && aFuncs[AH]) || "";
            if (sFunc) sFunc = ' ' + this.replaceRegs(sFunc);
            /*
             * For purposes of display only, rewind addr to the address of the responsible "INT n" instruction; we
             * know it's the two-byte "INT n" instruction because that's the only opcode handler that calls checkIntNotify()
             * at the moment.  If that changes, then this will have to change as well.
             */
            addr -= 2;
            this.message("INT " + str.toHexByte(nInt) + ": AH=" + str.toHexByte(AH) + " @" + this.hexOffset(addr - this.cpu.segCS.base, this.cpu.getCS()) + sFunc);
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
        this.message("INT " + str.toHexByte(nInt) + ": C=" + (this.cpu.getCF()? 1 : 0) + (sResult || "") + " (cycles=" + nCycles + (nLevel? ",level=" + (nLevel+1) : "") + ")");
    };

    /**
     * messageIO(component, port, bOut, addrFrom, name, bIn, bitsMessage)
     *
     * @this {Debugger}
     * @param {Component} component
     * @param {number} port
     * @param {number|null} bOut if an output operation
     * @param {number|null} [addrFrom]
     * @param {string|null} [name] of the port, if any
     * @param {number|null} [bIn] is the input value, if known, on an input operation
     * @param {number} [bitsMessage] is one or more Messages category flag(s)
     */
    Debugger.prototype.messageIO = function(component, port, bOut, addrFrom, name, bIn, bitsMessage)
    {
        bitsMessage |= Messages.PORT;
        if (addrFrom == null || (this.bitsMessage & bitsMessage) == bitsMessage) {
            var segFrom = null;
            if (addrFrom != null) {
                segFrom = this.cpu.getCS();
                addrFrom -= this.cpu.segCS.base;
            }
            this.message(component.idComponent + "." + (bOut != null? "outPort" : "inPort") + '(' + str.toHexWord(port) + ',' + (name? name : "unknown") + (bOut != null? ',' + str.toHexByte(bOut) : "") + ")" + (bIn != null? (": " + str.toHexByte(bIn)) : "") + (addrFrom != null? (" @" + this.hexOffset(addrFrom, segFrom)) : ""));
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
     * traceLog(prop, dst, src, flagsIn, flagsOut, resultLo, resultHi)
     *
     * @this {Debugger}
     * @param {string} prop
     * @param {number} dst
     * @param {number} src
     * @param {number|null} flagsIn
     * @param {number|null} flagsOut
     * @param {number} resultLo
     * @param {number} [resultHi]
     */
    Debugger.prototype.traceLog = function(prop, dst, src, flagsIn, flagsOut, resultLo, resultHi)
    {
        if (DEBUG) {
            if (this.traceEnabled !== undefined && this.traceEnabled[prop]) {
                var trace = Debugger.TRACE[prop];
                var len = (trace.size >> 2);
                var s = this.hexOffset(this.cpu.opLIP - this.cpu.segCS.base, this.cpu.getCS()) + " " + Debugger.INS_NAMES[trace.ins] + "(" + str.toHex(dst, len) + "," + str.toHex(src, len) + "," + (flagsIn === null? "-" : str.toHexWord(flagsIn)) + ") " + str.toHex(resultLo, len) + "," + (flagsOut === null? "-" : str.toHexWord(flagsOut));
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
        this.updateStatus();
        if (this.sInitCommands) {
            var a = this.parseCommand(this.sInitCommands);
            delete this.sInitCommands;
            for (var s in a) this.doCommand(a[s]);
        }
    };

    /**
     * historyInit()
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
    Debugger.prototype.historyInit = function()
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
                 * Preallocate dummy Addr (Array) objects in every history slot, so that
                 * checkInstruction() doesn't need to call newAddr() on every slot update.
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
                 * When single-stepping, the CPU won't call checkInstruction(), which is good for
                 * avoiding breakpoints, but bad for instruction data collection if checks are enabled.
                 * So we call checkInstruction() ourselves.
                 */
                if (this.checksEnabled()) this.checkInstruction(this.cpu.regLIP, 0);
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
                this.cpu.setError(e.stack || e.message);
            }
        } while (this.cpu.opFlags & X86.OPFLAG_PREFIXES);

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
     * stopCPU()
     *
     * @this {Debugger}
     * @param {boolean} [fComplete]
     */
    Debugger.prototype.stopCPU = function(fComplete)
    {
        if (this.cpu) this.cpu.stopCPU(fComplete);
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

        this.aAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
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

            // this.println(data? "resuming" : "powering up");

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
        this.historyInit();
        this.cInstructions = 0;
        this.sMessagePrev = null;
        this.nCycles = 0;
        this.aAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
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
        state.set(2, [this.aPrevCmds, this.fAssemble, this.bitsMessage]);
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
            this.aPrevCmds = data[i][0];
            if (typeof this.aPrevCmds == "string") this.aPrevCmds = [this.aPrevCmds];
            this.fAssemble = data[i][1];
            if (!this.bitsMessage) {
                /*
                 * It's actually kind of annoying that a restored (or predefined) state will trump my initial state,
                 * at least in situations where I've changed the initial state, if I want to diagnose something.
                 * Perhaps I should save/restore both the initial and current bitsMessageEnabled, and if the initial
                 * values don't agree, then leave the current value alone.
                 *
                 * But, it's much easier to just leave bitsMessageEnabled alone whenever it already contains set bits.
                 */
                this.bitsMessage = data[i][2];
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
                    if (this.checksEnabled()) {
                        sStopped += this.cInstructions + " ops, ";
                        this.cInstructions = 0;     // remove this line if you want to maintain a longer total
                    }
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
            this.clearTempBreakpoint(this.cpu.regLIP);
        }
    };

    /**
     * checksEnabled(fRelease)
     *
     * This "check" function is called by the CPU; we indicate whether or not every instruction needs to be checked.
     *
     * Originally, this returned true even when there were only read and/or write breakpoints, but those breakpoints
     * no longer require the intervention of checkInstruction(); the Bus component automatically swaps in/out appropriate
     * functions to deal with those breakpoints in the appropriate memory blocks.  So I've simplified the test below.
     *
     * @this {Debugger}
     * @param {boolean} [fRelease] is true for release criteria only; default is false (any criteria)
     * @return {boolean} true if every instruction needs to pass through checkInstruction(), false if not
     */
    Debugger.prototype.checksEnabled = function(fRelease)
    {
        return ((DEBUG && !fRelease)? true : (this.aBreakExec.length > 1 || this.messageEnabled(Messages.INT) /* || this.aBreakRead.length > 1 || this.aBreakWrite.length > 1 */));
    };

    /**
     * checkInstruction(addr, nState)
     *
     * This "check" function is called by the CPU to inform us about the next instruction to be executed,
     * giving us an opportunity to look for "exec" breakpoints and update opcode frequencies and instruction history.
     *
     * @this {Debugger}
     * @param {number} addr
     * @param {number} nState is < 0 if stepping, 0 if starting, or > 0 if running
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkInstruction = function(addr, nState)
    {
        if (nState > 0) {
            if (this.checkBreakpoint(addr, this.aBreakExec)) {
                return true;
            }
            /*
             * Halt whenever ring 3 code is running with interrupts disabled, because that's likely an
             * error (TODO: we should also check the IOPL, too, because if IOPL is 3, then this is OK).
             */
            if (this.cpu.segCS.cpl == 3 && !(this.cpu.regPS & X86.PS.IF)) {
                return true;
            }
        }

        /*
         * The rest of the instruction tracking logic can only be performed if historyInit() has allocated the
         * necessary data structures.  Note that there is no explicit UI for enabling/disabling history, other than
         * adding/removing breakpoints, simply because it's breakpoints that trigger the call to checkInstruction();
         * well, OK, and a few other things now, like enabling Messages.INT messages.
         */
        if (nState >= 0 && this.aaOpcodeCounts.length) {
            this.cInstructions++;
            var bOpcode = this.cpu.getByte(addr);
            this.aaOpcodeCounts[bOpcode][1]++;
            var a = this.aOpcodeHistory[this.iOpcodeHistory];
            a[0] = this.cpu.getIP();
            a[1] = this.cpu.getCS();
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
            this.stopCPU(true);
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
            this.stopCPU(true);
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
        this.stopCPU(true);
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
        this.stopCPU(true);
        return true;
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
                this.bus.removeMemBreak(this.getAddr(this.aBreakRead[i]), false);
            }
        }
        this.aBreakRead = ["read"];
        if (this.aBreakWrite !== undefined) {
            for (i = 1; i < this.aBreakWrite.length; i++) {
                this.bus.removeMemBreak(this.getAddr(this.aBreakWrite[i]), true);
            }
        }
        this.aBreakWrite = ["write"];
        this.nSuppress = 0;
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
            aAddr[3] = fTemp;
            aBreak.push(aAddr);
            if (aBreak != this.aBreakExec) {
                this.bus.addMemBreak(this.getAddr(aAddr), aBreak == this.aBreakWrite);
            }
            if (fTemp) {
                /*
                 * Force temporary breakpoints to be interpreted as linear breakpoints
                 * (hence the assertion that there IS a linear address stored in aAddr);
                 * this allows us to step over calls or interrupts that change the processor mode
                 */
                aAddr[0] = -1;
                this.assert(aAddr[2]);
            } else {
                this.println("breakpoint enabled: " + this.hexAddr(aAddr) + " (" + aBreak[0] + ")");
            }
            this.historyInit();
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
        var addr = this.mapBreakpoint(this.getAddr(aAddr));
        for (var i = 1; i < aBreak.length; i++) {
            var aAddrBreak = aBreak[i];
            if (addr == this.mapBreakpoint(this.getAddr(aAddrBreak))) {
                fFound = true;
                if (fRemove) {
                    aBreak.splice(i, 1);
                    if (aBreak != this.aBreakExec) {
                        this.bus.removeMemBreak(addr, aBreak == this.aBreakWrite);
                    }
                    if (!aAddrBreak[3]) this.println("breakpoint cleared: " + this.hexAddr(aAddrBreak) + " (" + aBreak[0] + ")");
                    this.historyInit();
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
     * TODO: We may need to start listing the linear addresses of breakpoints, because
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
     * the block's setDebugger() method, which clears the memory block's breakpoint counts.  setDebugger(),
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
                this.bus.addMemBreak(addrBreak, aBreak == this.aBreakWrite);
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
     * mapBreakpoint(addr)
     *
     * @this {Debugger}
     * @param {number} addr
     * @return {number}
     */
    Debugger.prototype.mapBreakpoint = function(addr)
    {
        /*
         * Map addresses in the top 64Kb at the top of the address space (assuming either a 16Mb or 4Gb
         * address space) to the top of the 1Mb range.
         *
         * The fact that those two 64Kb regions are aliases of each other on an 80286 is a pain in the BUTT,
         * because any CS-based breakpoint you set immediately after a CPU reset will have a physical address
         * in the top 16Mb, yet after the first inter-segment JMP, you will be running in the first 1Mb.
         */
        var mask = (this.maskAddr & ~0xffff);
        if ((addr & mask) == mask) addr &= 0x000fffff;
        return addr;
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
        if (this.nSuppress) return false;

        /*
         * Time to check for execution breakpoints; note that this should be done BEFORE updating frequency
         * or history data (see checkInstruction), since we might not actually execute the current instruction.
         */
        var fBreak = false;
        addr = this.mapBreakpoint(addr);
        for (var i = 1; i < aBreak.length; i++) {

            var aAddrBreak = aBreak[i];

            /*
             * We need to zap the linear address field of the breakpoint address before
             * calling getAddr(), to force it to recalculate the linear address every time,
             * unless this is a breakpoint on a linear address (as indicated by a -1 offset).
             */
            if (aAddrBreak[0] != -1) aAddrBreak[2] = null;

            /*
             * We used to calculate the linear address of the breakpoint at the time the
             * breakpoint was added, so that a breakpoint set in one mode (eg, in real-mode)
             * would still work as intended if the mode changed later (eg, to protected-mode).
             *
             * However, that created difficulties setting protected-mode breakpoints in segments
             * that might not be defined yet, or that could move in physical memory.
             *
             * If you want to create a real-mode breakpoint that will break regardless of mode,
             * use the physical address of the real-mode memory location instead.
             */
            if (addr == this.mapBreakpoint(this.getAddr(aAddrBreak))) {
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
     * @param {Array} aAddr (aAddr[4] is true if 32-bit operands, aAddr[5] is true if 32-bit addresses)
     * @param {string} [sComment] is an associated comment
     * @param {number} [nSequence] is an associated sequence number, undefined if none
     * @return {string} (and aAddr is updated to the next instruction)
     */
    Debugger.prototype.getInstruction = function(aAddr, sComment, nSequence)
    {
        var aAddrIns = this.newAddr(aAddr[0], aAddr[1], aAddr[2]);

        var bOpcode = this.getByte(aAddr, 1);

        /*
         * Incorporate the following prefixes into the current instruction byte stream.
         * TODO: Determine the actual effect of multiple OS (and/or multiple AS) prefixes.
         */
        var cMax = 2;           // let's make sure unfortunate memory contents don't screw us
        while ((bOpcode == X86.OPCODE.OS || bOpcode == X86.OPCODE.AS) && cMax--) {
            if (bOpcode == X86.OPCODE.OS) {
                aAddr[4] = !aAddr[4];
            } else {
                aAddr[5] = !aAddr[5];
            }
            bOpcode = this.getByte(aAddr, 1);
        }

        var aOpDesc = this.aaOpDescs[bOpcode];
        var iIns = aOpDesc[0];
        var bModRM = -1;

        if (iIns == Debugger.INS.OP0F) {
            var b = this.getByte(aAddr, 1);
            aOpDesc = Debugger.aaOp0FDescs[b] || Debugger.aOpDescUndefined;
            bOpcode |= (b << 8);
            iIns = aOpDesc[0];
        }

        if (iIns >= Debugger.INS_NAMES.length) {
            bModRM = this.getByte(aAddr, 1);
            aOpDesc = Debugger.aaGrpDescs[iIns - Debugger.INS_NAMES.length][(bModRM >> 3) & 0x7];
        }

        var sOpcode = Debugger.INS_NAMES[aOpDesc[0]];
        var cOperands = aOpDesc.length - 1;
        var sOperands = "";
        if (this.isStringIns(bOpcode)) {
            cOperands = 0;              // suppress display of operands for string instructions
            if (aAddr[4] && sOpcode.slice(-1) == 'W') sOpcode = sOpcode.slice(0, -1) + 'D';
        }

        var typeCPU = null;
        var fNonPrefix = true;

        for (var iOperand = 1; iOperand <= cOperands; iOperand++) {

            var disp, offset, cch;
            var sOperand = "";
            var type = aOpDesc[iOperand];
            if (type === undefined) continue;

            if (typeCPU == null) typeCPU = type >> Debugger.TYPE_CPU_SHIFT;

            var typeSize = type & Debugger.TYPE_SIZE;
            if (typeSize == Debugger.TYPE_NONE) {
                continue;
            }
            if (typeSize == Debugger.TYPE_PREFIX) {
                fNonPrefix = false;
                continue;
            }
            var typeMode = type & Debugger.TYPE_MODE;
            if (typeMode >= Debugger.TYPE_MODRM) {
                if (bModRM < 0) {
                    bModRM = this.getByte(aAddr, 1);
                }
                if (typeMode >= Debugger.TYPE_REG) {
                    sOperand = this.getRegOperand((bModRM >> 3) & 0x7, type, aAddr);
                }
                else {
                    sOperand = this.getModRMOperand(bModRM, type, aAddr);
                }
            }
            else if (typeMode == Debugger.TYPE_ONE) {
                sOperand = "1";
            }
            else if (typeMode == Debugger.TYPE_IMM) {
                sOperand = this.getImmOperand(type, aAddr);
            }
            else if (typeMode == Debugger.TYPE_IMMOFF) {
                if (!aAddr[5]) {
                    cch = 4;
                    offset = this.getShort(aAddr, 2);
                } else {
                    cch = 8;
                    offset = this.getLong(aAddr, 4);
                }
                sOperand = "[" + str.toHex(offset, cch) + "]";
            }
            else if (typeMode == Debugger.TYPE_IMMREL) {
                if (typeSize == Debugger.TYPE_BYTE) {
                    disp = ((this.getByte(aAddr, 1) << 24) >> 24);
                }
                else {
                    disp = this.getWord(aAddr, true);
                }
                offset = (aAddr[0] + disp) & (aAddr[4]? -1 : 0xffff);
                var aSymbol = this.findSymbolAtAddr(this.newAddr(offset, aAddr[1]));
                sOperand = aSymbol[0] || str.toHex(offset, aAddr[4]? 8: 4);
            }
            else if (typeMode == Debugger.TYPE_IMPREG) {
                sOperand = this.getRegOperand((type & Debugger.TYPE_IREG) >> 8, type, aAddr);
            }
            else if (typeMode == Debugger.TYPE_IMPSEG) {
                sOperand = this.getRegOperand((type & Debugger.TYPE_IREG) >> 8, Debugger.TYPE_SEGREG, aAddr);
            }
            else if (typeMode == Debugger.TYPE_DSSI) {
                sOperand = "DS:[SI]";
            }
            else if (typeMode == Debugger.TYPE_ESDI) {
                sOperand = "ES:[DI]";
            }
            if (!sOperand || !sOperand.length) {
                sOperands = "INVALID";
                break;
            }
            if (sOperands.length > 0) sOperands += ",";
            sOperands += sOperand;
        }

        var sLine = this.hexAddr(aAddrIns) + " ";
        var sBytes = "";
        do {
            sBytes += str.toHex(this.getByte(aAddrIns, 1), 2);
        } while (aAddrIns[2] != aAddr[2]);

        sLine += str.pad(sBytes, 16);
        sLine += str.pad(sOpcode, 8);
        if (sOperands) sLine += " " + sOperands;

        if (this.cpu.model < Debugger.CPUS[typeCPU]) {
            sComment = Debugger.CPUS[typeCPU] + " CPU only";
        }

        if (sComment && fNonPrefix) {
            sLine = str.pad(sLine, 56) + ';' + sComment;
            if (!this.cpu.aFlags.fChecksum) {
                sLine += (nSequence != null? '=' + nSequence.toString() : "");
            } else {
                var nCycles = this.cpu.getCycles();
                sLine += "cycles=" + nCycles.toString() + " cs=" + str.toHex(this.cpu.aCounts.nChecksum);
            }
        }

        this.initAddrSize(aAddr, fNonPrefix);
        return sLine;
    };

    /**
     * getImmOperand(type, aAddr)
     *
     * @this {Debugger}
     * @param {number} type
     * @param {Array} aAddr (aAddr[4] is true if 32-bit operands, aAddr[5] is true if 32-bit addresses)
     * @return {string} operand
     */
    Debugger.prototype.getImmOperand = function(type, aAddr)
    {
        var sOperand = " ";
        var typeSize = type & Debugger.TYPE_SIZE;
        switch (typeSize) {
        case Debugger.TYPE_BYTE:
            /*
             * There's the occasional immediate byte we don't need to display (eg, the 0x0A
             * following an AAM or AAD instruction), so we suppress the byte if it lacks a TYPE_IN
             * or TYPE_OUT designation (and TYPE_BOTH, as the name implies, includes both).
             */
            if (type & Debugger.TYPE_BOTH) {
                sOperand = str.toHex(this.getByte(aAddr, 1), 2);
            }
            break;
        case Debugger.TYPE_SBYTE:
            sOperand = str.toHex((this.getByte(aAddr, 1) << 24) >> 24, 4);
            break;
        case Debugger.TYPE_VWORD:
        case Debugger.TYPE_2WORD:
            if (aAddr[4]) {
                sOperand = str.toHex(this.getLong(aAddr, 4));
                break;
            }
            /* falls through */
        case Debugger.TYPE_WORD:
            sOperand = str.toHex(this.getShort(aAddr, 2), 4);
            break;
        case Debugger.TYPE_FARP:
            sOperand = this.hexAddr(this.newAddr(this.getWord(aAddr, true), this.getShort(aAddr, 2), null, aAddr[4], aAddr[5]));
            break;
        default:
            sOperand = "imm(" + str.toHexWord(type) + ")";
            break;
        }
        return sOperand;
    };

    /**
     * getRegOperand(bReg, type, aAddr)
     *
     * @this {Debugger}
     * @param {number} bReg
     * @param {number} type
     * @param {Array} aAddr (aAddr[4] is true if 32-bit operands, aAddr[5] is true if 32-bit addresses)
     * @return {string} operand
     */
    Debugger.prototype.getRegOperand = function(bReg, type, aAddr)
    {
        var typeMode = type & Debugger.TYPE_MODE;
        if (typeMode == Debugger.TYPE_SEGREG) {
            if (bReg > Debugger.REG_GS ||
                bReg >= Debugger.REG_FS && this.cpu.model < X86.MODEL_80386) return "??";
            bReg += Debugger.REG_SEG;
        }
        else if (typeMode == Debugger.TYPE_CTLREG) {
            bReg += Debugger.REG_CR0;
        }
        else {
            var typeSize = type & Debugger.TYPE_SIZE;
            if (typeSize >= Debugger.TYPE_WORD) {
                if (bReg < Debugger.REG_AX) {
                    bReg += Debugger.REG_AX - Debugger.REG_AL;
                }
                if (typeSize == Debugger.TYPE_DWORD || typeSize == Debugger.TYPE_VWORD && aAddr[4]) {
                    bReg += Debugger.REG_EAX - Debugger.REG_AX;
                }
            }
        }
        return Debugger.REGS[bReg];
    };

    /**
     * getSIBOperand(bMod, aAddr)
     *
     * @this {Debugger}
     * @param {number} bMod
     * @param {Array} aAddr (aAddr[4] is true if 32-bit operands, aAddr[5] is true if 32-bit addresses)
     * @return {string} operand
     */
    Debugger.prototype.getSIBOperand = function(bMod, aAddr)
    {
        var bSIB = this.getByte(aAddr, 1);
        var bScale = bSIB >> 6;
        var bIndex = (bSIB >> 3) & 0x7;
        var bBase = bSIB & 0x7;
        var sOperand = "";
        if (bMod || bBase != 5) {
            sOperand = Debugger.RMS[bBase + 8];
        }
        if (bIndex != 4) {
            if (sOperand) sOperand += '+';
            sOperand += Debugger.RMS[bIndex + 8];
            if (bScale) sOperand += '*' + (0x1 << bScale);
        }
        return sOperand;
    };

    /**
     * getModRMOperand(bModRM, type, aAddr)
     *
     * @this {Debugger}
     * @param {number} bModRM
     * @param {number} type
     * @param {Array} aAddr (aAddr[4] is true if 32-bit operands, aAddr[5] is true if 32-bit addresses)
     * @return {string} operand
     */
    Debugger.prototype.getModRMOperand = function(bModRM, type, aAddr)
    {
        var sOperand = "";
        var bMod = bModRM >> 6;
        var bRM = bModRM & 0x7;
        if (bMod < 3) {
            var disp;
            if (!bMod && (!aAddr[5] && bRM == 6 || aAddr[5] && bRM == 5)) {
                bMod = 2;
            } else {
                if (aAddr[5]) {
                    if (bRM != 4) {
                        bRM += 8;
                    } else {
                        sOperand = this.getSIBOperand(bMod, aAddr);
                    }
                }
                if (!sOperand) sOperand = Debugger.RMS[bRM];
            }
            if (bMod == 1) {
                disp = this.getByte(aAddr, 1);
                if (!(disp & 0x80)) {
                    sOperand += "+" + str.toHex(disp, 2);
                }
                else {
                    disp = ((disp << 24) >> 24);
                    sOperand += "-" + str.toHex(-disp, 2);
                }
            }
            else if (bMod == 2) {
                if (sOperand) sOperand += '+';
                if (!aAddr[5]) {
                    disp = this.getShort(aAddr, 2);
                    sOperand += str.toHex(disp, 4);
                } else {
                    disp = this.getLong(aAddr, 4);
                    sOperand += str.toHex(disp);
                }
            }
            sOperand = "[" + sOperand + "]";
        }
        else {
            sOperand = this.getRegOperand(bRM, type, aAddr);
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
        return sFlag + (b? '1' : '0') + ' ';
    };

    /**
     * getRegString(iReg)
     *
     * @this {Debugger}
     * @param {number} iReg
     * @return {string}
     */
    Debugger.prototype.getRegString = function(iReg)
    {
        if (iReg >= Debugger.REG_AX && iReg <= Debugger.REG_DI && this.cchReg > 4) iReg += Debugger.REG_EAX - Debugger.REG_AX;
        return Debugger.REGS[iReg] + '=' + this.getRegValue(iReg) + ' ';
    };

    /**
     * getSegString(seg)
     *
     * @this {Debugger}
     * @param {X86Seg} seg
     * @param {boolean} [fProt]
     * @return {string}
     */
    Debugger.prototype.getSegString = function(seg, fProt)
    {
        return seg.sName + '=' + str.toHex(seg.sel, 4) + (fProt? '[' + str.toHex(seg.base, this.cchAddr) + ',' + str.toHex(seg.limit, (seg.limit & ~0xffff)? 8 : 4) + ']' : "");
    };

    /**
     * getDTRString(seg)
     *
     * @this {Debugger}
     * @param {string} sName
     * @param {number|null} sel
     * @param {number} addr
     * @param {number} addrLimit
     * @return {string}
     */
    Debugger.prototype.getDTRString = function(sName, sel, addr, addrLimit)
    {
        return sName + '=' + (sel != null? str.toHex(sel, 4) : "") + '[' + str.toHex(addr, this.cchAddr) + ',' + str.toHex(addrLimit - addr, 4) + ']';
    };

    /**
     * getRegDump(fProt)
     *
     * Sample 8086 and 80286 real-mode register dump:
     *
     *      AX=0000 BX=0000 CX=0000 DX=0000 SP=0000 BP=0000 SI=0000 DI=0000
     *      SS=0000 DS=0000 ES=0000 PS=0002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:FFF0 EA5BE000F0    JMP      F000:E05B
     *
     * Sample 80386 real-mode register dump:
     *
     *      EAX=00000000 EBX=00000000 ECX=00000000 EDX=00000000
     *      ESP=00000000 EBP=00000000 ESI=00000000 EDI=00000000
     *      SS=0000 DS=0000 ES=0000 FS=0000 GS=0000 PS=00000002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:FFF0 EA05F900F0    JMP      F000:F905
     *
     * Sample 80286 protected-mode register dump:
     *
     *      AX=0000 BX=0000 CX=0000 DX=0000 SP=0000 BP=0000 SI=0000 DI=0000
     *      SS=0000[000000,FFFF] DS=0000[000000,FFFF] ES=0000[000000,FFFF] A20=ON
     *      CS=F000[FF0000,FFFF] LD=0000[000000,FFFF] GD=[000000,FFFF] ID=[000000,03FF]
     *      TR=0000 MS=FFF0 PS=0002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:FFF0 EA5BE000F0    JMP      F000:E05B
     *
     * Sample 80386 protected-mode register dump:
     *
     *      EAX=00000000 EBX=00000000 ECX=00000000 EDX=00000000
     *      ESP=00000000 EBP=00000000 ESI=00000000 EDI=00000000
     *      SS=0000[00000000,FFFF] DS=0000[00000000,FFFF] ES=0000[00000000,FFFF]
     *      CS=F000[FFFF0000,FFFF] FS=0000[00000000,FFFF] GS=0000[00000000,FFFF]
     *      LD=0000[00000000,FFFF] GD=[00000000,FFFF] ID=[00000000,03FF] TR=0000 A20=ON
     *      CR0=00000010 CR2=00000000 CR3=00000000 PS=00000002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:0000FFF0 EA05F900F0    JMP      F000:0000F905
     *
     * This no longer includes CS in real-mode (or EIP in any mode), because that information can be obtained from the
     * first line of disassembly, which an "r" or "rp" command will also display.
     *
     * Note that even when the processor is in real mode, you can always use the "rp" command to force a protected-mode
     * dump, in case you need to verify any selector base or limit values, since those do affect real-mode operation.
     *
     * @this {Debugger}
     * @param {boolean} [fProt]
     * @return {string}
     */
    Debugger.prototype.getRegDump = function(fProt)
    {
        var s;
        if (fProt === undefined) {
            fProt = !!(this.cpu.regCR0 & X86.CR0.MSW.PE);
        }
        s = this.getRegString(Debugger.REG_AX) +
            this.getRegString(Debugger.REG_BX) +
            this.getRegString(Debugger.REG_CX) +
            this.getRegString(Debugger.REG_DX) + (this.cchReg > 4? '\n' : '') +
            this.getRegString(Debugger.REG_SP) +
            this.getRegString(Debugger.REG_BP) +
            this.getRegString(Debugger.REG_SI) +
            this.getRegString(Debugger.REG_DI) + '\n' +
            this.getSegString(this.cpu.segSS, fProt) + ' ' +
            this.getSegString(this.cpu.segDS, fProt) + ' ' +
            this.getSegString(this.cpu.segES, fProt) + ' ';
        if (fProt) {
            var sTR = "TR=" + str.toHex(this.cpu.segTSS.sel, 4);
            var sA20 = "A20=" + (this.bus.getA20()? "ON " : "OFF ");
            if (this.cpu.model < X86.MODEL_80386) {
                sTR = '\n' + sTR;
                s += sA20; sA20 = '';
            }
            s += '\n' + this.getSegString(this.cpu.segCS, fProt) + ' ';
            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                sA20 += '\n';
                s += this.getSegString(this.cpu.segFS, fProt) + ' ' +
                     this.getSegString(this.cpu.segGS, fProt) + '\n';
            }
            s += this.getDTRString("LD", this.cpu.segLDT.sel, this.cpu.segLDT.base, this.cpu.segLDT.base + this.cpu.segLDT.limit) + ' ' +
                 this.getDTRString("GD", null, this.cpu.addrGDT, this.cpu.addrGDTLimit) + ' ' +
                 this.getDTRString("ID", null, this.cpu.addrIDT, this.cpu.addrIDTLimit) + ' ';
            s += sTR + ' ' + sA20;
            s += this.getRegString(Debugger.REG_CR0);
            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                s += this.getRegString(Debugger.REG_CR2) + this.getRegString(Debugger.REG_CR3);
            }
        } else {
            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                s += this.getSegString(this.cpu.segFS, fProt) + ' ' +
                     this.getSegString(this.cpu.segGS, fProt) + ' ';
            }
        }
        s += this.getRegString(Debugger.REG_PS) +
             this.getFlagStr("V") + this.getFlagStr("D") + this.getFlagStr("I") + this.getFlagStr("T") +
             this.getFlagStr("S") + this.getFlagStr("Z") + this.getFlagStr("A") + this.getFlagStr("P") + this.getFlagStr("C");
        return s;
    };

    /**
     * parseAddr(sAddr, type)
     *
     * As discussed above, the format of aAddr variables is [off, seg, addr]; they represent a segmented
     * address (seg:off) when seg is defined or a linear address (addr) when seg is undefined (or null).
     *
     * To create a segmented address, specify two values separated by ":"; for a linear address, use
     * a "%" prefix.  We check for ":" after "%", so if for some strange reason you specify both, the
     * address will be treated as segmented, not linear.
     *
     * The "%" syntax is similar to that used by the Windows 80386 kernel debugger (wdeb386) for linear
     * addresses.  If/when we add support for processors with page tables, we will likely adopt the same
     * convention for linear addresses and provide a different syntax (eg, "%%") physical memory references.
     *
     * Address evaluation and validation (eg, range checks) are no longer performed at this stage.  That's
     * done later, by getAddr(), which returns X86.ADDR_INVALID for invalid segments, out-of-range offsets,
     * etc.  The Debugger's low-level get/set memory functions verify all getAddr() results, but even if an
     * invalid address is passed through to the Bus memory interfaces, the address will simply be masked with
     * Bus.busLimit; in the case of X86.ADDR_INVALID, that will generally refer to the top of the physical
     * address space.
     *
     * @this {Debugger}
     * @param {string|undefined} sAddr
     * @param {number|undefined} type is the address segment type, in case sAddr doesn't specify a segment
     * @return {Array} aAddr
     */
    Debugger.prototype.parseAddr = function(sAddr, type)
    {
        var aAddr;
        var aAddrNext = (type == Debugger.ADDR_DATA? this.aAddrNextData : this.aAddrNextCode);
        var off = aAddrNext[0], seg = aAddrNext[1], addr = aAddrNext[2];

        if (sAddr !== undefined) {

            if (sAddr.charAt(0) == '%') {
                sAddr = sAddr.substr(1);
                off = -1;
                seg = null;
                addr = 0;
            }

            aAddr = this.findSymbolAddr(sAddr);
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

        aAddr = [off, seg, addr];
        this.checkLimit(aAddr);
        return aAddr;
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
            var iReg = this.getRegIndex(sValue);
            if (iReg >= 0) sValue = this.getRegValue(iReg);
            value = str.parseInt(sValue);
            if (value === undefined) this.println("invalid " + (sName? sName : "value") + ": " + sValue);
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
                    aAddr[2] = null;
                    /*
                     * getAddr() computes the corresponding physical address and saves it in aAddr[2].
                     */
                    this.getAddr(aAddr);
                    /*
                     * The physical address for any symbol located in the top 64Kb of the machine's address space
                     * should be relocated to the top 64Kb of the first 1Mb, so that we're immune from any changes
                     * to the A20 line.
                     */
                    if ((aAddr[2] & ~0xffff) == (this.bus.busLimit & ~0xffff)) {
                        aAddr[2] &= 0x000fffff;
                    }
                    symbol['p'] = aAddr[2];
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
                this.println(this.hexOffset(off, seg) + " " + sSymbol);
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
        for (var sCommand in Debugger.COMMANDS) {
            s += '\n' + str.pad(sCommand, 7) + Debugger.COMMANDS[sCommand];
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
        if (aAddr[0] == null) return;

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
                this.setByte(aAddr, aOpBytes[i], 1);
            }
            /*
             * Since getInstruction() also updates the specified address, aAddrAssemble is automatically advanced.
             */
            this.println(this.getInstruction(this.aAddrAssemble));
        }
    };

    /**
     * doBreak(sCmd, sAddr)
     *
     * As the "help" output below indicates, the following breakpoint commands are supported:
     *
     *      bp [a]  set exec breakpoint on linear addr [a]
     *      br [a]  set read breakpoint on linear addr [a]
     *      bw [a]  set write breakpoint on linear addr [a]
     *      bc [a]  clear breakpoint on linear addr [a] (use "*" for all breakpoints)
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
     * While sLen is interpreted as a number of bytes or words, it's converted to the appropriate number of lines,
     * because we always display whole lines.  If sLen is omitted/undefined, then we default to 8 lines, regardless
     * whether dumping bytes or words.
     *
     * Also, unlike sAddr, sLen is interpreted as a decimal number, unless a radix specifier is included (eg, "0x100");
     * sLen also supports the DEBUG.COM-style syntax of a preceding "l" (eg, "l16").
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {string|undefined} sAddr
     * @param {string|undefined} sLen (if present, it can be preceded by an "l", which we simply ignore)
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
            this.println("\tdb [a] [#]    dump # bytes at address a");
            if (BACKTRACK) this.println("\tdi [a]        dump backtrack info at address a");
            this.println("\tdw [a] [#]    dump # words at address a");
            this.println("\tdd [a] [#]    dump # dwords at address a");
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
        if (sCmd == "ds") {     // transform a "ds" command into a "d desc" command
            sCmd = 'd';
            sLen = sAddr;
            sAddr = "desc";
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
        if (aAddr[0] == null || aAddr[0] == -1 && aAddr[2] == null) return;

        var sDump = "";
        if (BACKTRACK && sCmd == "di") {
            var addr = this.getAddr(aAddr);
            sDump += '%' + str.toHex(addr) + ": ";
            var sInfo = this.bus.getBackTrackInfoFromAddr(addr);
            sDump += sInfo || "no information";
        }
        else {
            var cLines = 0;
            var cBytes = (sCmd == "dd"? 4 : (sCmd == "dw"? 2 : 1));
            var cNumbers = (16 / cBytes)|0;
            if (sLen) {
                if (sLen.charAt(0) == "l") sLen = sLen.substr(1);
                cLines = +sLen;
                if (cLines) cLines = ((cLines + cNumbers - 1) / cNumbers)|0;
            }
            if (!cLines) cLines = 8;
            for (var iLine = 0; iLine < cLines; iLine++) {
                var data = 0, iByte = 0;
                var sData = "", sChars = "";
                sAddr = this.hexAddr(aAddr);
                for (var i = 0; i < 16; i++) {
                    var b = this.getByte(aAddr, 1);
                    data |= (b << (iByte++ << 3));
                    if (iByte == cBytes) {
                        sData += str.toHex(data, cBytes * 2);
                        sData += (cBytes == 1? (i == 7? '-' : ' ') : "  ");
                        data = iByte = 0;
                    }
                    sChars += (b >= 32 && b < 128? String.fromCharCode(b) : ".");
                }
                if (sDump) sDump += "\n";
                sDump += sAddr + "  " + sData + " " + sChars;
            }
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
            var b = str.parseInt(asArgs[i], 16);
            if (b === undefined) {
                this.println("unrecognized value: " + str.toHexByte(b));
                break;
            }
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
                        this.println((Debugger.INS_NAMES[this.aaOpDescs[bOpcode][0]] + "  ").substr(0, 5) + " (" + str.toHexByte(bOpcode) + "): " + cFreq + " times");
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
            this.println("halting");
            this.stopCPU();
            return;
        }
        var sMore = "";
        var cLines = 10;
        var iHistory = this.iOpcodeHistory;
        var aHistory = this.aOpcodeHistory;
        if (aHistory.length) {
            var n = (sCount === undefined? this.nextHistory : +sCount);
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
                var aAddr = aHistory[iHistory++];
                if (aAddr[1] == null) break;
                /*
                 * We must create a new aAddr from the address we obtained from aHistory, because aAddr
                 * was a reference, not a copy, and we don't want getInstruction() modifying the original.
                 */
                aAddr = this.newAddr(aAddr[0], aAddr[1], aAddr[2]);
                this.println(this.getInstruction(aAddr, "history", n--));
                /*
                 * If there was an OPERAND or ADDRESS override on the previous instruction, getInstruction()
                 * will have automatically disassembled the next instruction, so skip one more history entry.
                 */
                if (aAddr[6]) {
                    iHistory++; n--;
                }
                if (iHistory >= aHistory.length) iHistory = 0;
                this.nextHistory = n;
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
                var cLines = (sEnable === undefined? -1 : +sEnable);
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
                    if (sCategory === undefined || sCategory == "ALL" || sCategory == Debugger.INS_NAMES[trace.ins]) {
                        if (fEnable !== undefined) {
                            this.traceEnabled[prop] = fEnable;
                        }
                        this.println(Debugger.INS_NAMES[trace.ins] + trace.size + ": " + (this.traceEnabled[prop]? "on" : "off"));
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
        sSymbol = sSymbol? (sSymbol + ": ") : "";
        this.println(sSymbol + this.hexAddr(aAddr) + " (%" + str.toHex(addr, this.cchAddr) + ")");

        var aSymbol = this.findSymbolAtAddr(aAddr, true);
        if (aSymbol.length) {
            var nDelta, sDelta;
            if (aSymbol[0]) {
                sDelta = "";
                nDelta = aAddr[0] - aSymbol[1];
                if (nDelta) sDelta = " + " + str.toHexWord(nDelta);
                this.println(aSymbol[0] + " (" + this.hexOffset(aSymbol[1], aAddr[1]) + ")" + sDelta);
            }
            if (aSymbol.length > 4 && aSymbol[4]) {
                sDelta = "";
                nDelta = aSymbol[5] - aAddr[0];
                if (nDelta) sDelta = " - " + str.toHexWord(nDelta);
                this.println(aSymbol[4] + " (" + this.hexOffset(aSymbol[5], aAddr[1]) + ")" + sDelta);
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
                        this.println(drive.disk.toJSON());
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
                bitsMessage = (0xffffffff|0) & ~(Messages.HALT | Messages.KEYS | Messages.LOG);
                sCategory = null;
            } else if (sCategory == "on") {
                fCriteria = true;
                sCategory = null;
            } else if (sCategory == "off") {
                fCriteria = false;
                sCategory = null;
            } else {
                if (sCategory == "keys") sCategory = "key";
                if (sCategory == "kbd") sCategory = "keyboard";
                for (m in Debugger.MESSAGES) {
                    if (sCategory == m) {
                        bitsMessage = Debugger.MESSAGES[m];
                        fCriteria = !!(this.bitsMessage & bitsMessage);
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
                    this.bitsMessage |= bitsMessage;
                    fCriteria = true;
                }
                else if (asArgs[2] == "off") {
                    this.bitsMessage &= ~bitsMessage;
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
                var fEnabled = !!(this.bitsMessage & bitMessage);
                if (fCriteria !== null && fCriteria != fEnabled) continue;
                if (sCategories) sCategories += ",";
                if (!(++n % 10)) sCategories += "\n\t";     // jshint ignore:line
                if (m == "key") m = "keys";
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
                if (asArgs[3] !== undefined) nCycles = +asArgs[3];
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
                    this.cpu.setSpeed(+asArgs[2]);
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
                fProt = (this.cpu.model >= X86.MODEL_80286);
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
                var w = str.parseInt(sValue, 16);
                if (!isNaN(w)) {
                    var sRegMatch = sReg.toUpperCase();
                    if (sRegMatch.charAt(0) == 'E' && this.cchReg <= 4) {
                        sRegMatch = null;
                    }
                    switch (sRegMatch) {
                    case "AL":
                        this.cpu.regEAX = (this.cpu.regEAX & ~0xff) | (w & 0xff);
                        break;
                    case "AH":
                        this.cpu.regEAX = (this.cpu.regEAX & ~0xff00) | ((w << 8) & 0xff);
                        break;
                    case "AX":
                        this.cpu.regEAX = (this.cpu.regEAX & ~0xffff) | (w & 0xffff);
                        break;
                    case "BL":
                        this.cpu.regEBX = (this.cpu.regEBX & ~0xff) | (w & 0xff);
                        break;
                    case "BH":
                        this.cpu.regEBX = (this.cpu.regEBX & ~0xff00) | ((w << 8) & 0xff);
                        break;
                    case "BX":
                        this.cpu.regEBX = (this.cpu.regEBX & ~0xffff) | (w & 0xffff);
                        break;
                    case "CL":
                        this.cpu.regECX = (this.cpu.regECX & ~0xff) | (w & 0xff);
                        break;
                    case "CH":
                        this.cpu.regECX = (this.cpu.regECX & ~0xff00) | ((w << 8) & 0xff);
                        break;
                    case "CX":
                        this.cpu.regECX = (this.cpu.regECX & ~0xffff) | (w & 0xffff);
                        break;
                    case "DL":
                        this.cpu.regEDX = (this.cpu.regEDX & ~0xff) | (w & 0xff);
                        break;
                    case "DH":
                        this.cpu.regEDX = (this.cpu.regEDX & ~0xff00) | ((w << 8) & 0xff);
                        break;
                    case "DX":
                        this.cpu.regEDX = (this.cpu.regEDX & ~0xffff) | (w & 0xffff);
                        break;
                    case "SP":
                        this.cpu.setSP((this.cpu.getSP() & ~0xffff) | (w & 0xffff));
                        break;
                    case "BP":
                        this.cpu.regEBP = (this.cpu.regEBP & ~0xffff) | (w & 0xffff);
                        break;
                    case "SI":
                        this.cpu.regESI = (this.cpu.regESI & ~0xffff) | (w & 0xffff);
                        break;
                    case "DI":
                        this.cpu.regEDI = (this.cpu.regEDI & ~0xffff) | (w & 0xffff);
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
                        this.aAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
                        break;
                    case "IP":
                     // fIns = true;
                        this.cpu.setIP(w);
                        this.aAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
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
                            switch(sRegMatch){
                            case "MS":
                                this.cpu.setMSW(w);
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
                                if (I386 && this.cpu.model >= X86.MODEL_80386) {
                                    fUnknown = false;
                                    switch(sRegMatch){
                                    case "EAX":
                                        this.cpu.regEAX = w;
                                        break;
                                    case "EBX":
                                        this.cpu.regEBX = w;
                                        break;
                                    case "ECX":
                                        this.cpu.regECX = w;
                                        break;
                                    case "EDX":
                                        this.cpu.regEDX = w;
                                        break;
                                    case "ESP":
                                        this.cpu.setSP(w);
                                        break;
                                    case "EBP":
                                        this.cpu.regEBP = w;
                                        break;
                                    case "ESI":
                                        this.cpu.regESI = w;
                                        break;
                                    case "EDI":
                                        this.cpu.regEDI = w;
                                        break;
                                    case "FS":
                                        this.cpu.setFS(w);
                                        break;
                                    case "GS":
                                        this.cpu.setGS(w);
                                        break;
                                    /*
                                     * TODO: Add support for CR0-CR3, DR0-DR7, and TR6-TR7.
                                     */
                                    default:
                                        fUnknown = true;
                                        break;
                                    }
                                }
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

        this.println((fCompact? '' : '\n') + this.getRegDump(fProt));

        if (fIns) {
            this.aAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
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
            var aAddr = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
            do {
                fPrefix = false;
                var bOpcode = this.getByte(aAddr);
                switch (bOpcode) {
                case X86.OPCODE.ES:
                case X86.OPCODE.CS:
                case X86.OPCODE.SS:
                case X86.OPCODE.DS:
                case X86.OPCODE.FS:     // I386 only
                case X86.OPCODE.GS:     // I386 only
                case X86.OPCODE.OS:     // I386 only
                case X86.OPCODE.AS:     // I386 only
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
                case X86.OPCODE.GRP4W:
                    if (fCallStep) {
                        var w = this.getWord(aAddr) & X86.OPCODE.CALLMASK;
                        this.fProcStep = ((w == X86.OPCODE.CALLW || w == X86.OPCODE.CALLFDW)? fProcStep : 0);
                    }
                    break;
                case X86.OPCODE.REPZ:
                case X86.OPCODE.REPNZ:
                    this.incAddr(aAddr, 1);
                    fRepeat = fPrefix = true;
                    break;
                case X86.OPCODE.INSB:
                case X86.OPCODE.INSW:
                case X86.OPCODE.OUTSB:
                case X86.OPCODE.OUTSW:
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
        var count = (sCount != null? +sCount : 1);
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
     * initAddrSize(aAddr, fNonPrefix)
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @param {boolean} fNonPrefix
     */
    Debugger.prototype.initAddrSize = function(aAddr, fNonPrefix)
    {
        /*
         * Use aAddr[6] to record whether we previously processed any OPERAND or ADDRESS overrides.
         */
        aAddr[6] = (aAddr[4] || aAddr[5]);
        /*
         * For proper disassembly of instructions preceded by an OPERAND (0x66) size prefix, we set aAddr[4]
         * to true whenever the operand size is 32-bit; similarly, for an ADDRESS (0x67) size prefix, we set
         * aAddr[5] to true whenever the address size is 32-bit.  Initially, both fields must be set to match
         * the size of the current code segment.
         */
        if (fNonPrefix) {
            aAddr[4] = (this.cpu.segCS.dataSize == 4);
            aAddr[5] = (this.cpu.segCS.addrSize == 4);
        }
        /*
         * We also use aAddr[7] to record whether the caller (ie, getInstruction()) is reporting that it
         * processed a complete instruction (ie, a non-prefix) or not.
         */
        aAddr[7] = fNonPrefix;
    };

    /**
     * isStringIns(bOpcode)
     *
     * @this {Debugger}
     * @param {number} bOpcode
     * @return {boolean} true if string instruction, false if not
     */
    Debugger.prototype.isStringIns = function(bOpcode)
    {
        return (bOpcode >= X86.OPCODE.MOVSB && bOpcode <= X86.OPCODE.CMPSW || bOpcode >= X86.OPCODE.STOSB && bOpcode <= X86.OPCODE.SCASW);
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
        if (aAddr[0] == null) return;

        if (n === undefined) n = 1;
        var aAddrEnd = this.newAddr(this.maskReg, aAddr[1], this.bus.busLimit);

        var cb = 0x100;
        if (sAddrEnd !== undefined) {

            aAddrEnd = this.parseAddr(sAddrEnd, Debugger.ADDR_CODE);
            if (aAddrEnd[0] == null || aAddrEnd[0] < aAddr[0]) return;

            cb = aAddrEnd[0] - aAddr[0];
            if (!DEBUG && cb > 0x100) {
                /*
                 * Limiting the amount of disassembled code to 256 bytes in non-DEBUG builds is partly to
                 * prevent the user from wedging the browser by dumping too many lines, but also a recognition
                 * that, in non-DEBUG builds, this.println() keeps print output buffer truncated to 8Kb anyway.
                 */
                this.println("range too large");
                return;
            }
            n = -1;
        }

        var fBlank = (aAddr[0] != this.aAddrNextCode[0]);

        var cLines = 0;
        this.initAddrSize(aAddr, true);

        while (cb > 0 && n--) {

            var bOpcode = this.getByte(aAddr);
            var addr = aAddr[2];
            var nSequence = (this.isBusy(false) || this.fProcStep)? this.nCycles : null;
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

            /*
             * If getInstruction() reported that it did not yet process a complete instruction (via aAddr[7]),
             * then bump the instruction count by one, so that we display one more line (and hopefully the complete
             * instruction).
             */
            if (!aAddr[7] && !n) n++;

            this.println(sIns);
            this.aAddrNextCode = aAddr;
            cb -= aAddr[2] - addr;
            fBlank = false;
            cLines++;
        }
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
                sCmd = this.aPrevCmds[this.iPrevCmd+1];
            } else {
                if (this.iPrevCmd < 0 && this.aPrevCmds.length) {
                    this.iPrevCmd = 0;
                }
                if (this.iPrevCmd < 0 || sCmd != this.aPrevCmds[this.iPrevCmd]) {
                    this.aPrevCmds.splice(0, 0, sCmd);
                    this.iPrevCmd = 0;
                }
                this.iPrevCmd--;
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
                    if (!COMPILED) {
                        if (sCmd == "debug") {
                            window.DEBUG = true;
                            this.println("DEBUG checks on");
                            return true;
                        }
                        else if (sCmd == "nodebug") {
                            window.DEBUG = false;
                            this.println("DEBUG checks off");
                            return true;
                        }
                    }

                    var ch, ch0, i;
                    switch (sCmd) {
                    case "reset":
                        if (this.cmp) this.cmp.reset();
                        return true;
                    case "ver":
                        this.println((APPNAME || "PCjs") + " version " + APPVERSION + " (" + this.cpu.model + (COMPILED? ",RELEASE" : (DEBUG? ",DEBUG" : ",NODEBUG")) + (PREFETCH? ",PREFETCH" : ",NOPREFETCH") + (TYPEDARRAYS? ",TYPEDARRAYS" : (FATARRAYS? ",FATARRAYS" : ",LONGARRAYS")) + (BACKTRACK? ",BACKTRACK" : ",NOBACKTRACK") + ")");
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
            this.println("debugger error: " + (e.stack || e.message));
            result = false;
        }
        return result;
    };

    /**
     * Debugger.init()
     *
     * This function operates on every HTML element of class "debugger", extracting the
     * JSON-encoded parameters for the Debugger constructor from the element's "data-value"
     * attribute, invoking the constructor to create a Debugger component, and then binding
     * any associated HTML controls to the new component.
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

}   // endif DEBUGGER

if (typeof module !== 'undefined') module.exports = Debugger;
