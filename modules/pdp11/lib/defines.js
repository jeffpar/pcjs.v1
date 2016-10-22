/**
 * @fileoverview PDP11-specific compile-time definitions.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.4 written by Paul Nankervis
 * (paulnank@hotmail.com) as of September 2016 at <http://skn.noip.me/pdp11/pdp11.html>.  This code
 * may be used freely provided the original authors are acknowledged in any modified source code.
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
 * <http://pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * @define {string}
 */
var APPCLASS = "pdp11";         // this @define is the default application class (eg, "pcx86", "c1pjs")

/**
 * APPNAME is used more for display purposes than anything else now.  APPCLASS is what matters in terms
 * of folder and file names, CSS styles, etc.
 *
 * @define {string}
 */
var APPNAME = "PDPjs";          // this @define is the default application name (eg, "PCx86", "C1Pjs")

/**
 * WARNING: DEBUGGER needs to accurately reflect whether or not the Debugger component is (or will be) loaded.
 * In the compiled case, we rely on the Closure Compiler to override DEBUGGER as appropriate.  When it's *false*,
 * nearly all of debugger.js will be conditionally removed by the compiler, reducing it to little more than a
 * "type skeleton", which also solves some type-related warnings we would otherwise have if we tried to remove
 * debugger.js from the compilation process altogether.
 *
 * However, when we're in "development mode" and running uncompiled code in debugger-less configurations,
 * I would like to skip loading debugger.js altogether.  When doing that, we must ALSO arrange for an additional file
 * (nodebugger.js) to be loaded immediately after this file, which *explicitly* overrides DEBUGGER with *false*.
 *
 * @define {boolean}
 */
var DEBUGGER = true;            // this @define is overridden by the Closure Compiler to remove Debugger-related support

/**
 * BYTEARRAYS is a Closure Compiler compile-time option that allocates an Array of numbers for every Memory block,
 * where each a number represents ONE byte; very wasteful, but potentially slightly faster.
 *
 * See the Memory component for details.
 *
 * @define {boolean}
 */
var BYTEARRAYS = false;

/**
 * TYPEDARRAYS enables use of typed arrays for Memory blocks.  This used to be a compile-time-only option, but I've
 * added Memory access functions for typed arrays (see MemoryPDP11.afnTypedArray), so support can be enabled dynamically now.
 *
 * See the Memory component for details.
 */
var TYPEDARRAYS = (typeof ArrayBuffer !== 'undefined');

/**
 * MEMFAULT forces the Memory interfaces to signal a CPU fault when a word is accessed using an odd (unaligned) address.
 *
 * Since PDPjs inherited its Bus component from PCx86, it included support for both aligned and unaligned word accesses
 * by default.  However, the PDP-11 adds a wrinkle: when an odd address is used to access a memory word, a BUS_ERROR trap
 * must be generated.  Note that odd IOPAGE word accesses are fine; this only affects the Memory component.
 *
 * When the MMU is enabled, these checks may also be performed at a higher level, eliminating the need for them at the
 * physical memory level.
 */
var MEMFAULT = true;

/**
 * WORDBUS turns off support for unaligned memory words.  Whereas MEMFAULT necessarily slows down memory word accesses
 * slightly, WORDBUS is able to speed them up slightly, by assuming that all word accesses (which didn't fault) must be
 * aligned.  This affects all word accesses, even IOPAGE accesses, because it also eliminates cross-block boundary checks.
 *
 * Don't worry that the source code looks MORE complicated rather than LESS with the additional MEMFAULT and WORDBUS checks,
 * because the Closure Compiler eliminates those checks and throws away the (unreachable) code blocks that deal with unaligned
 * accesses.
 */
var WORDBUS = true;

/*
 * Combine all the shared globals and machine-specific globals into one machine-specific global object,
 * which all machine components should start using; eg: "if (PDP11.DEBUG) ..." instead of "if (DEBUG) ...".
 */
var PDP11 = {
    APPCLASS:   APPCLASS,
    APPNAME:    APPNAME,
    APPVERSION: APPVERSION,     // shared
    BYTEARRAYS: BYTEARRAYS,
    COMPILED:   COMPILED,       // shared
    CSSCLASS:   CSSCLASS,       // shared
    DEBUG:      DEBUG,          // shared
    DEBUGGER:   DEBUGGER,
    MAXDEBUG:   MAXDEBUG,       // shared
    PRIVATE:    PRIVATE,        // shared
    TYPEDARRAYS:TYPEDARRAYS,
    MEMFAULT:   MEMFAULT,
    WORDBUS:    WORDBUS,
    SITEHOST:   SITEHOST,       // shared
    XMLVERSION: XMLVERSION,     // shared

    /*
     * CPU model numbers (supported)
     */
    MODEL_1120: 1120,
    MODEL_1145: 1145,
    MODEL_1170: 1170,

    /*
     * This constant is used to mark points in the code where the physical address being returned
     * is invalid and should not be used.
     *
     * In a 32-bit CPU, -1 (ie, 0xffffffff) could actually be a valid address, so consider changing
     * ADDR_INVALID to NaN or null (which is also why all ADDR_INVALID tests should use strict equality
     * operators).
     *
     * The main reason I'm NOT using NaN or null now is my concern that, by mixing non-numbers
     * (specifically, values outside the range of signed 32-bit integers), performance may suffer.
     *
     * WARNING: Like many of the properties defined here, ADDR_INVALID is a common constant, which the
     * Closure Compiler will happily inline (with or without @const annotations; in fact, I've yet to
     * see a @const annotation EVER improve automatic inlining).  However, if you don't make ABSOLUTELY
     * certain that this file is included BEFORE the first reference to any of these properties, that
     * automatic inlining will no longer occur.
     */
    ADDR_INVALID:   -1,
    /*
     * Processor modes
     */
    MODE: {
        KERNEL:     0x0,
        SUPER:      0x1,
        UNUSED:     0x2,
        USER:       0x3,
        MASK:       0x3
    },
    /*
     * Processor Status flag definitions (stored in regPSW)
     */
    PSW: {
        CF:         0x0001,     // bit  0: Carry Flag
        VF:         0x0002,     // bit  1: Overflow Flag (aka OF on Intel processors)
        ZF:         0x0004,     // bit  2: Zero Flag
        NF:         0x0008,     // bit  3: Negative Flag (aka SF -- Sign Flag -- on Intel processors)
        TF:         0x0010,     // bit  4: Trap Flag
        PRI:        0x00E0,     // bits 5-7: Priority
        UNUSED:     0x0700,     // bits 8-10: unused
        /*
         * PSW bits above this point are unused on 11/20-class machines
         */
        REGSET:     0x0800,     // bit  11: Register Set                        (
        PMODE:      0x3000,     // bits 12-13: Prev Mode (see PDP11.MODE)
        CMODE:      0xC000,     // bits 14-15: Curr Mode (see PDP11.MODE)
        SHIFT: {
            CF:     0,
            VF:     1,
            ZF:     2,
            NF:     3,
            TF:     4,
            PRI:    5,
            PMODE:  12,
            CMODE:  14
        }
    },
    /*
     * Assorted common opcodes
     */
    OPCODE: {
        HALT:       0x0000,
        INVALID:    0xFFFF      // far from the only invalid opcode, just a KNOWN invalid opcode
    },
    /*
     * Internal operation state flags
     */
    OPFLAG: {
        INTQ_SPL:   0x01,       // INTQ triggered by SPL
        INTQ:       0x02,       // call checkInterrupts()
        WAIT:       0x04,       // WAIT operation in progress
        TRAP_TF:    0x10,       // aka PDP11.PSW.TF
        TRAP_MMU:   0x20,
        TRAP_SP:    0x40,
        TRAP_MASK:  0x70,
        NO_FLAGS:   0x80,       // set whenever the PSW is written directly, requiring all updateXXXFlags() functions to leave flags unchanged
        PRESERVE:   0x07        // OPFLAG bits to preserve prior to the next instruction
    },
    /*
     * Opcode reg (opcode bits 2-0)
     */
    OPREG: {
        MASK:       0x07
    },
    /*
     * Opcode modes (opcode bits 5-3)
     */
    OPMODE: {
        REG:        0x00,       // REGISTER                 (register is operand)
        REGD:       0x08,       // REGISTER DEFERRED        (register is address of operand)
        POSTINC:    0x10,       // AUTO-INCREMENT           (register is address of operand, register incremented)
        POSTINCD:   0x18,       // AUTO-INCREMENT DEFERRED  (register is address of address of operand, register incremented)
        PREDEC:     0x20,       // AUTO-DECREMENT           (register decremented, register is address of operand)
        PREDECD:    0x28,       // AUTO-DECREMENT DEFERRED  (register decremented, register is address of address of operand)
        INDEX:      0x30,       // INDEX                    (register + next word is address of operand)
        INDEXD:     0x38,       // INDEX DEFERRED           (register + next word is address of address of operand)
        MASK:       0x38,
        SHIFT:      3
    },
    DSTMODE: {
        REG:        0x0007,
        MODE:       0x0038,
        MASK:       0x003F,
        SHIFT:      0
    },
    SRCMODE: {
        REG:        0x01C0,
        MODE:       0x0E00,
        MASK:       0x0FC0,
        SHIFT:      6
    },
    REG: {
        SP:         6,
        PC:         7,
    },
    /*
     * PDP-11 trap vectors
     */
    TRAP: {
        UNDEFINED:  0x00,       // 000  (reserved)
        BUS_ERROR:  0x04,       // 004  illegal instruction, unaligned address, invalid memory, stack limit, microbreak
        RESERVED:   0x08,       // 010  reserved instructions
        BPT:        0x0C,       // 014  BPT: breakpoint trap (trace)
        IOT:        0x10,       // 020  IOT: input/output trap
        PF:         0x14,       // 024  power fail
        EMT:        0x18,       // 030  EMT: emulator trap
        TRAP:       0x1C,       // 034  TRAP instruction
        PIRQ:       0xA0,       // 240  PIRQ: program interrupt request
        MMU:        0xA8        // 250  MMU: aborts and traps
    },
    /*
     * PDP-11 trap reasons (for diagnostic purposes only)
     */
    REASON: {
        BPT:        1,
        EMT:        2,
        HALT:       3,
        IOT:        4,
        TRAP:       5,
        RESERVED:   6,
        ODDMEMADDR: 10,
        NOMEMORY:   12,
        ODDMMUADDR: 14,
        MAPERROR:   16,
        PUSHERROR:  18,
        NOREGADDR:  20,
        STACKMODE1: 22,
        STACKERROR: 24,
        INTERRUPT:  26,
        TRAPMMU:    28,
        TRAPSP:     30,
        TRAPTF:     32
    },
    /*
     * Internal memory access flags
     */
    ACCESS: {
        WORD:       0x00,
        BYTE:       0x01,
        READ:       0x02,
        WRITE:      0x04,
        UPDATE:     0x06,
        VIRT:       0x08,       // getVirtualByMode() leaves bit 17 clear if this is set (otherwise the caller would have to clear it again)
        ISPACE:     0x00000,
        DSPACE:     0x10000     // getVirtualByMode() sets bit 17 in any 16-bit virtual address that refers to D space (as opposed to I space)
    },
    /*
     * Internal flags passed to writeByteByMode(), etc.
     */
    WRITE: {
        NORMAL:     0x0,        // write byte or word normally
        SIGNEXT:    0x1         // sign-extend a byte to a word
    },
    CPUERR: {
        RED:        0x0004,     // red zone stack limit
        YELLOW:     0x0008,     // yellow zone stack limit
        TIMEOUT:    0x0010,     // UNIBUS timeout error
        NOMEMORY:   0x0020,     // non-existent memory error
        ODDADDR:    0x0040,     // odd word address error (as in non-even, not strange)
        BADHALT:    0x0080      // HALT attempted in USER or SUPER modes
    },
    MMR0: {
        ENABLED:    0x0001,     // address relocation enabled
        PAGE_NUM:   0x000E,     // page number of last fault
        PAGE_D:     0x0010,     // last fault occurred in D space
        PAGE_MODE:  0x0060,     // processor mode as of last fault
        COMPLETED:  0x0080,     // last instruction completed
        DSTMODE:    0x0100,     // only destination mode references will be relocated (for diagnostic use)
        MMU_TRAPS:  0x0200,     // enable MMU traps
        UNUSED:     0x0C00,
        TRAP_MMU:   0x1000,     // trap: MMU
        ABORT_RO:   0x2000,     // abort: read-only
        ABORT_PL:   0x4000,     // abort: page length
        ABORT_NR:   0x8000,     // abort: non-resident
        ABORT:      0xE000
    },
    MMR1: {                     // general purpose auto-inc/auto-dec register
        REG1_NUM:   0x0007,
        REG1_DELTA: 0x00F8,
        REG2_NUM:   0x0700,
        REG2_DELTA: 0xF800
    },
    MMR2: {                     // virtual program counter register
    },
    MMR3: {                     // mapping register
        USER_D:     0x0001,
        SUPER_D:    0x0002,
        KERNEL_D:   0x0004,
        MMU_22BIT:  0x0010,
        UNIBUS_MAP: 0x0020      // UNIBUS map relocation enabled
    },
    /*
     * Assorted special (UNIBUS) addresses
     *
     * Within the PDP-11/45's 18-bit address space, of the 0x40000 possible addresses (256Kb), the top 0x2000
     * (8Kb) is called the IOPAGE and is reserved for CPU and I/O registers.  The IOPAGE spans 0x3E000-0x3FFFF.
     *
     * Within the PDP-11/70's 22-bit address space, of the 0x400000 possible addresses (4Mb), the top 0x20000
     * (256Kb) is mapped to the UNIBUS (not physical memory), and as before, the top 0x2000 (8Kb) of that is
     * mapped to the IOPAGE.
     *
     * To map 18-bit UNIBUS addresses to 22-bit physical addresses, the 11/70 uses a UNIBUS relocation map.
     * It consists of 31 double-word registers that each hold a 22-bit base address.  When UNIBUS relocation
     * is enabled, the top 5 bits of an address select one of the 31 mapping registers, and the bottom 13 bits
     * are then added to the contents of the selected mapping register.
     *
     * ES6 ALERT: By using octal constants, this is the first place I'm dipping my toe into ECMAScript 6 waters.
     * If you're loading this raw source code into your browser, then by now (2016) you're almost certainly using
     * an ES6-aware browser.  Everyone else should be using code compiled by Google's Closure Compiler, which
     * we configure to produce code that's backward-compatible with ES5 (for example, octal constants are
     * converted to decimal values).
     *
     * For more details: https://github.com/google/closure-compiler/wiki/ECMAScript6
     */
    UNIBUS: {       //16-bit       18-bit     22-bit         Hex    Description
        SISDR0:     0o172200,   //                                  Supervisor I Space Descriptor Register 0
        SISDR1:     0o172202,   //                                  Supervisor I Space Descriptor Register 1
        SISDR2:     0o172204,   //                                  Supervisor I Space Descriptor Register 2
        SISDR3:     0o172206,   //                                  Supervisor I Space Descriptor Register 3
        SISDR4:     0o172210,   //                                  Supervisor I Space Descriptor Register 4
        SISDR5:     0o172212,   //                                  Supervisor I Space Descriptor Register 5
        SISDR6:     0o172214,   //                                  Supervisor I Space Descriptor Register 6
        SISDR7:     0o172216,   //                                  Supervisor I Space Descriptor Register 7
        SDSDR0:     0o172220,   //                                  Supervisor D Space Descriptor Register 0
        SDSDR1:     0o172222,   //                                  Supervisor D Space Descriptor Register 1
        SDSDR2:     0o172224,   //                                  Supervisor D Space Descriptor Register 2
        SDSDR3:     0o172226,   //                                  Supervisor D Space Descriptor Register 3
        SDSDR4:     0o172230,   //                                  Supervisor D Space Descriptor Register 4
        SDSDR5:     0o172232,   //                                  Supervisor D Space Descriptor Register 5
        SDSDR6:     0o172234,   //                                  Supervisor D Space Descriptor Register 6
        SDSDR7:     0o172236,   //                                  Supervisor D Space Descriptor Register 7
        SISAR0:     0o172240,   //                                  Supervisor I Space Address Register 0
        SISAR1:     0o172242,   //                                  Supervisor I Space Address Register 1
        SISAR2:     0o172244,   //                                  Supervisor I Space Address Register 2
        SISAR3:     0o172246,   //                                  Supervisor I Space Address Register 3
        SISAR4:     0o172250,   //                                  Supervisor I Space Address Register 4
        SISAR5:     0o172252,   //                                  Supervisor I Space Address Register 5
        SISAR6:     0o172254,   //                                  Supervisor I Space Address Register 6
        SISAR7:     0o172256,   //                                  Supervisor I Space Address Register 7
        SDSAR0:     0o172260,   //                                  Supervisor D Space Address Register 0
        SDSAR1:     0o172262,   //                                  Supervisor D Space Address Register 1
        SDSAR2:     0o172264,   //                                  Supervisor D Space Address Register 2
        SDSAR3:     0o172266,   //                                  Supervisor D Space Address Register 3
        SDSAR4:     0o172270,   //                                  Supervisor D Space Address Register 4
        SDSAR5:     0o172272,   //                                  Supervisor D Space Address Register 5
        SDSAR6:     0o172274,   //                                  Supervisor D Space Address Register 6
        SDSAR7:     0o172276,   //                                  Supervisor D Space Address Register 7
        KISDR0:     0o172300,   //                                  Kernel I Space Descriptor Register 0
        KISDR1:     0o172302,   //                                  Kernel I Space Descriptor Register 1
        KISDR2:     0o172304,   //                                  Kernel I Space Descriptor Register 2
        KISDR3:     0o172306,   //                                  Kernel I Space Descriptor Register 3
        KISDR4:     0o172310,   //                                  Kernel I Space Descriptor Register 4
        KISDR5:     0o172312,   //                                  Kernel I Space Descriptor Register 5
        KISDR6:     0o172314,   //                                  Kernel I Space Descriptor Register 6
        KISDR7:     0o172316,   //                                  Kernel I Space Descriptor Register 7
        KDSDR0:     0o172320,   //                                  Kernel D Space Descriptor Register 0
        KDSDR1:     0o172322,   //                                  Kernel D Space Descriptor Register 1
        KDSDR2:     0o172324,   //                                  Kernel D Space Descriptor Register 2
        KDSDR3:     0o172326,   //                                  Kernel D Space Descriptor Register 3
        KDSDR4:     0o172330,   //                                  Kernel D Space Descriptor Register 4
        KDSDR5:     0o172332,   //                                  Kernel D Space Descriptor Register 5
        KDSDR6:     0o172334,   //                                  Kernel D Space Descriptor Register 6
        KDSDR7:     0o172336,   //                                  Kernel D Space Descriptor Register 7
        KISAR0:     0o172340,   //                                  Kernel I Space Address Register 0
        KISAR1:     0o172342,   //                                  Kernel I Space Address Register 1
        KISAR2:     0o172344,   //                                  Kernel I Space Address Register 2
        KISAR3:     0o172346,   //                                  Kernel I Space Address Register 3
        KISAR4:     0o172350,   //                                  Kernel I Space Address Register 4
        KISAR5:     0o172352,   //                                  Kernel I Space Address Register 5
        KISAR6:     0o172354,   //                                  Kernel I Space Address Register 6
        KISAR7:     0o172356,   //                                  Kernel I Space Address Register 7
        KDSAR0:     0o172360,   //                                  Kernel D Space Address Register 0
        KDSAR1:     0o172362,   //                                  Kernel D Space Address Register 1
        KDSAR2:     0o172364,   //                                  Kernel D Space Address Register 2
        KDSAR3:     0o172366,   //                                  Kernel D Space Address Register 3
        KDSAR4:     0o172370,   //                                  Kernel D Space Address Register 4
        KDSAR5:     0o172372,   //                                  Kernel D Space Address Register 5
        KDSAR6:     0o172374,   //                                  Kernel D Space Address Register 6
        KDSAR7:     0o172376,   //                                  Kernel D Space Address Register 7

        MMR3:       0o172516,   // 772516   17772516

        LKS:        0o177546,   //                                  KW11-L Clock Status

        PRS:        0o177550,   //                                  PC11 (and PR11) Reader Status Register
        PRB:        0o177552,   //                                  PC11 (and PR11) Reader Buffer Register
        PPS:        0o177554,   //                                  PC11 Punch Status Register
        PPB:        0o177556,   //                                  PC11 Punch Buffer Register

        RCSR:       0o177560,   //                                  Display Terminal: Receiver Status Register
        RBUF:       0o177562,   //                                  Display Terminal: Receiver Data Buffer Register
        XCSR:       0o177564,   //                                  Display Terminal: Transmitter Status Register
        XBUF:       0o177566,   //                                  Display Terminal: Transmitter Data Buffer Register

        CNSL:       0o177570,   //                                  Console Switch and Front Panel Display

        MMR0:       0o177572,   // 777572   17777572
        MMR1:       0o177574,   // 777574   17777574
        MMR2:       0o177576,   // 777576   17777576

        UISDR0:     0o177600,   //                                  User I Space Descriptor Register 0
        UISDR1:     0o177602,   //                                  User I Space Descriptor Register 1
        UISDR2:     0o177604,   //                                  User I Space Descriptor Register 2
        UISDR3:     0o177606,   //                                  User I Space Descriptor Register 3
        UISDR4:     0o177610,   //                                  User I Space Descriptor Register 4
        UISDR5:     0o177612,   //                                  User I Space Descriptor Register 5
        UISDR6:     0o177614,   //                                  User I Space Descriptor Register 6
        UISDR7:     0o177616,   //                                  User I Space Descriptor Register 7
        UDSDR0:     0o177620,   //                                  User D Space Descriptor Register 0
        UDSDR1:     0o177622,   //                                  User D Space Descriptor Register 1
        UDSDR2:     0o177624,   //                                  User D Space Descriptor Register 2
        UDSDR3:     0o177626,   //                                  User D Space Descriptor Register 3
        UDSDR4:     0o177630,   //                                  User D Space Descriptor Register 4
        UDSDR5:     0o177632,   //                                  User D Space Descriptor Register 5
        UDSDR6:     0o177634,   //                                  User D Space Descriptor Register 6
        UDSDR7:     0o177636,   //                                  User D Space Descriptor Register 7
        UISAR0:     0o177640,   //                                  User I Space Address Register 0
        UISAR1:     0o177642,   //                                  User I Space Address Register 1
        UISAR2:     0o177644,   //                                  User I Space Address Register 2
        UISAR3:     0o177646,   //                                  User I Space Address Register 3
        UISAR4:     0o177650,   //                                  User I Space Address Register 4
        UISAR5:     0o177652,   //                                  User I Space Address Register 5
        UISAR6:     0o177654,   //                                  User I Space Address Register 6
        UISAR7:     0o177656,   //                                  User I Space Address Register 7
        UDSAR0:     0o177660,   //                                  User D Space Address Register 0
        UDSAR1:     0o177662,   //                                  User D Space Address Register 1
        UDSAR2:     0o177664,   //                                  User D Space Address Register 2
        UDSAR3:     0o177666,   //                                  User D Space Address Register 3
        UDSAR4:     0o177670,   //                                  User D Space Address Register 4
        UDSAR5:     0o177672,   //                                  User D Space Address Register 5
        UDSAR6:     0o177674,   //                                  User D Space Address Register 6
        UDSAR7:     0o177676,   //                                  User D Space Address Register 7

        R0SET0:     0o177700,
        R1SET0:     0o177701,
        R2SET0:     0o177702,
        R3SET0:     0o177703,
        R4SET0:     0o177704,
        R5SET0:     0o177705,
        R6KERNEL:   0o177706,
        R7KERNEL:   0o177707,
        R0SET1:     0o177710,
        R1SET1:     0o177711,
        R2SET1:     0o177712,
        R3SET1:     0o177713,
        R4SET1:     0o177714,
        R5SET1:     0o177715,
        R6SUPER:    0o177716,
        R6USER:     0o177717,

        /*
         * This next group of registers is largely ignored; all accesses are routed to regsControl[]
         */
        LAERR:      0o177740,   //                                  Low Address Error                           (11/70 only)
        HAERR:      0o177742,   //                                  High Address Error                          (11/70 only)
        MEMERR:     0o177744,   //                                  Memory System Error                         (11/70 only)
        CACHEC:     0o177746,   //                                  Cache Control                               (11/70 only)
        MAINT:      0o177750,   //                                  Maintenance                                 (11/70 only)
        HITMISS:    0o177752,   //                                  Hit/Miss                                    (11/70 only)
        UNDEF1:     0o177754,
        UNDEF2:     0o177756,

        LSIZE:      0o177760,   //                                  Lower Size Register (last 32-word block)    (11/70 only)
        HSIZE:      0o177762,   //                                  Upper Size Register (always zero)           (11/70 only)
        SYSID:      0o177764,   //                                  System ID Register                          (11/70 only)
        CPUERR:     0o177766,   //                                  CPU error                                   (11/70 only)
        MB:         0o177770,   //                                  Microprogram break                          (11/70 only)
        PIR:        0o177772,   //                                  Program Interrupt Request
        SL:         0o177774,   //                                  Stack Limit Register
        PSW:        0o177776    // 777776   17777776    0x3FFFFE    Processor Status Word
    },
    PC11: {                     // High Speed Reader & Punch (PR11 is a Reader-only unit)
        PRI:        4,          // NOTE: reader has precedence over punch
        RVEC:       0o70,       // reader vector
        PVEC:       0o74,       // punch vector
        PRS: {
            RE:     0x0001,     // Reader Enable (W/O)
            RIE:    0x0040,     // Reader Interrupt Enable (allows the DONE and ERROR bits to trigger an interrupt)
            DONE:   0x0080,     // Done (R/O)
            BUSY:   0x0800,     // Busy (R/O)
            ERROR:  0x8000,     // Error (R/O)
            CLEAR:  0x08C0,     // bits cleared on INIT
            RMASK:  0xFFFE,     // bits readable (TODO: All I know for sure is that bit 0 is NOT readable; see readPRS())
            WMASK:  0x0041,     // bits writable
            BAUD:   3600
        },
        PRB: {
            MASK:   0x00FF      // Data
        },
        PPS: {
            /*
             * TODO: Flesh this out if/when we add Paper Tape Punch support
             */
            BAUD:   600
        },
    },
    DL11: {                     // Serial Line Interface (program compatible with the KL11 for control of console teleprinters)
        PRI:        4,
        RVEC:       0o60,
        XVEC:       0o64,
        RCSR: {                 // 177560
            RE:     0x0001,     // Reader Enable (W/O)
            DTR:    0x0002,     // Data Terminal Ready (R/W)
            RTS:    0x0004,     // Request To Send (R/W)
            STD:    0x0008,     // Secondary Transmitted Data (R/W)
            DIE:    0x0020,     // Dataset Interrupt Enable (R/W)
            RIE:    0x0040,     // Receiver Interrupt Enable (R/W)
            RD:     0x0080,     // Receiver Done (R/O)
            SRD:    0x0400,     // Secondary Received Data (R/O)
            RA:     0x0800,     // Receiver Active (R/O)
            CD:     0x1000,     // Carrier Detect (R/O)
            CTS:    0x2000,     // Clear To Send (R/O)
            RI:     0x4000,     // Ring Indicator (R/O)
            DSC:    0x8000,     // Dataset Status Change (R/O)
            RMASK:  0xFFFE,     // bits readable (TODO: All I know for sure is that bit 0 is NOT readable; see readRCSR())
            WMASK:  0x006F,     // bits writable
            BAUD:   9600
        },
        RBUF: {                 // 177562
            DATA:   0x00ff,     // Received Data (R/O)
            PARITY: 0x1000,     // Received Data Parity (R/O)
            FE:     0x2000,     // Framing Error (R/O)
            OE:     0x4000,     // Overrun Error (R/O)
            ERROR:  0x8000      // Error (R/O)
        },
        XCSR: {                 // 177564
            BREAK:  0x0001,     // BREAK (R/W)
            MAINT:  0x0004,     // Maintenance (R/W)
            TIE:    0x0040,     // Transmitter Interrupt Enable (R/W)
            READY:  0x0080,     // Transmitter Ready (R/O)
            RMASK:  0x00C5,
            WMASK:  0x0045,
            BAUD:   9600
        },
        XBUF: {                 // 177566
            DATA:   0x00FF      // Transmitted Data (W/O)       TODO: Determine why pdp11.js effectively defined this as 0x7F
        }
    },
    KW11: {                     // KW11-L Line Time Clock
        PRI:        6,
        VEC:        0o100,
        DELAY:      0,
        LKS: {
            IE:     0x0040,     // Interrupt Enable
            MON:    0x0080      // Monitor
        }
    }
};

PDP11.ACCESS.READ_WORD   = PDP11.ACCESS.WORD | PDP11.ACCESS.READ;       // formerly READ_MODE (2)
PDP11.ACCESS.READ_BYTE   = PDP11.ACCESS.BYTE | PDP11.ACCESS.READ;       // formerly READ_MODE (2) | BYTE_MODE (1)
PDP11.ACCESS.WRITE_WORD  = PDP11.ACCESS.WORD | PDP11.ACCESS.WRITE;      // formerly WRITE_MODE (4)
PDP11.ACCESS.WRITE_BYTE  = PDP11.ACCESS.BYTE | PDP11.ACCESS.WRITE;      // formerly WRITE_MODE (4) | BYTE_MODE (1)
PDP11.ACCESS.UPDATE_WORD = PDP11.ACCESS.WORD | PDP11.ACCESS.UPDATE;     // formerly MODIFY_WORD (2 | 4)
PDP11.ACCESS.UPDATE_BYTE = PDP11.ACCESS.BYTE | PDP11.ACCESS.UPDATE;     // formerly MODIFY_BYTE (1 | 2 | 4)

/*
 * PSW arithmetic flags are NOT stored directly into the PSW register; they are maintained across separate
 * flag registers.
 */
PDP11.PSW.FLAGS         = (PDP11.PSW.NF | PDP11.PSW.ZF | PDP11.PSW.VF | PDP11.PSW.CF);

if (NODE) {
    global.APPCLASS     = APPCLASS;
    global.APPNAME      = APPNAME;
    global.DEBUGGER     = DEBUGGER;
    global.BYTEARRAYS   = BYTEARRAYS;
    global.TYPEDARRAYS  = TYPEDARRAYS;
    global.PDP11        = PDP11;

    module.exports = PDP11;
}
