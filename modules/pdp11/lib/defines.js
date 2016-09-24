/**
 * @fileoverview PDP11-specific compile-time definitions.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Sep-03
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.3 written by Paul Nankervis
 * (paulnank@hotmail.com) as of August 2016 from http://skn.noip.me/pdp11/pdp11.html.  This code
 * may be used freely provided the original author name is acknowledged in any modified source code.
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
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
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
var APPNAME = "PDP11js";        // this @define is the default application name (eg, "PCx86", "C1Pjs")

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
    SITEHOST:   SITEHOST,       // shared
    XMLVERSION: XMLVERSION,     // shared

    /*
     * CPU model numbers (supported)
     */
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
        REGSET:     0x0800,     // bit  11: Register Set
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
     * Interrupt-related flags (stored in intFlags)
     */
    INTFLAG: {
        NONE:       0x0000,
        INTR:       0x00ff,     // mask for 8 bits, representing interrupt levels 0-7
        HALT:       0x0100      // halt requested; see opHLT()
    },
    /*
     * Internal operation state flags
     */
    OPFLAG: {
        TRAP_TF:    0x10,       // aka PDP11.PSW.TF
        TRAP_MMU:   0x20,
        TRAP_SP:    0x40,
        TRAP_MASK:  0x70,
        SKIP_FLAGS: 0x80        // when set, all updateXXXFlags() functions must leave flags unchanged
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
        POSTINC:    0x10,       // POST-INCREMENT           (register is address of operand, register incremented)
        POSTINCD:   0x18,       // POST-INCREMENT DEFERRED  (register is address of address of operand, register incremented)
        PREDEC:     0x20,       // PRE-DECREMENT            (register decremented, register is address of operand)
        PREDECD:    0x28,       // PRE-DECREMENT DEFERRED   (register decremented, register is address of address of operand)
        INDEX:      0x30,       // INDEX                    (register + next word is address of operand)
        INDEXD:     0x38,       // INDEX DEFERRED           (register + next word is address of address of operand)
        MASK:       0x38
    },
    DSTMODE: {
        MASK:       0x003F,
        SHIFT:      0
    },
    SRCMODE: {
        MASK:       0x0FC0,
        SHIFT:      6
    },
    /*
     * PDP-11 trap vectors
     */
    TRAP: {
        UNDEFINED:  0x00,       // 000  (reserved)
        BUS_ERROR:  0x04,       // 004  illegal instructions, bus errors, stack limit, illegal internal address, microbreak
        RESERVED:   0x08,       // 010  reserved instructions
        BREAKPOINT: 0x0C,       // 014  BPT, breakpoint trap (trace)
        IOT:        0x10,       // 020  IOT, input/output trap
        POWER_FAIL: 0x14,       // 024  power fail
        EMULATOR:   0x18,       // 030  EMT, emulator trap
        TRAP:       0x1C,       // 034  TRAP instruction
        PIRQ:       0xA0,       // 240  PIRQ, program interrupt request
        MMU_FAULT:  0xA8        // 250  MMU aborts and traps
    },
    /*
     * Internal memory access flags
     */
    ACCESS: {
        WORD:       0x0,
        BYTE:       0x1,
        READ:       0x2,
        WRITE:      0x4,
        UPDATE:     0x6
    },
    /*
     * Internal flags passed to writeByteByMode(), etc.
     */
    WRITE: {
        NORMAL:     0x0,        // write byte or word normally
        ZERO:       0x1,        // zero byte or word
        SIGNEXT:    0x2         // sign-extend a byte to a word
    },
    /*
     * Assorted special (UNIBUS) addresses
     *
     * ES6 ALERT: By using octal constants, this is the first place I'm dipping my toe into ECMAScript 6 waters.
     * If you're loading this raw source code into your browser, then by now (2016) you're almost certainly using
     * an ES6-aware browser.  Everyone else should be using code compiled by Google's Closure Compiler, which
     * automatically produces code that's backward-compatible with ES5.1 (for example, octal constants are converted
     * to decimal values).
     *
     * For more details: https://github.com/google/closure-compiler/wiki/ECMAScript6
     */
    UNIBUS: {       //  22-bit     18-bit   16-bit    22-bit    Description
        PSW:        0o17777776, // 777776   177776  0x3FFFFE    PSW
    }
};

PDP11.ACCESS.READ        = PDP11.ACCESS.WORD | PDP11.ACCESS.READ;       // formerly READ_MODE (2)
PDP11.ACCESS.READ_BYTE   = PDP11.ACCESS.BYTE | PDP11.ACCESS.READ;       // formerly READ_MODE (2) | BYTE_MODE (1)
PDP11.ACCESS.WRITE       = PDP11.ACCESS.WORD | PDP11.ACCESS.WRITE;      // formerly WRITE_MODE (4)
PDP11.ACCESS.WRITE_BYTE  = PDP11.ACCESS.BYTE | PDP11.ACCESS.WRITE;      // formerly WRITE_MODE (4) | BYTE_MODE (1)
PDP11.ACCESS.UPDATE      = PDP11.ACCESS.WORD | PDP11.ACCESS.UPDATE;     // formerly MODIFY_WORD (2 | 4)
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
