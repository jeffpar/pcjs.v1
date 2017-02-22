/**
 * @fileoverview PDP10-specific compile-time definitions.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2017
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
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
var APPCLASS = "pdp10";         // this @define is the default application class (eg, "pcx86", "c1pjs")

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

/*
 * Combine all the shared globals and machine-specific globals into one machine-specific global object,
 * which all machine components should start using; eg: "if (PDP10.DEBUG) ..." instead of "if (DEBUG) ...".
 */
var PDP10 = {
    APPCLASS:   APPCLASS,
    APPNAME:    APPNAME,
    APPVERSION: APPVERSION,     // shared
    COMPILED:   COMPILED,       // shared
    CSSCLASS:   CSSCLASS,       // shared
    DEBUG:      DEBUG,          // shared
    DEBUGGER:   DEBUGGER,
    MAXDEBUG:   MAXDEBUG,       // shared
    PRIVATE:    PRIVATE,        // shared
    SITEHOST:   SITEHOST,       // shared
    XMLVERSION: XMLVERSION,     // shared

    /*
     * CPU model numbers (supported)
     *
     * The 11/20 includes the 11/10, which is not identified separately because there was
     * nothing functionally different about it.
     *
     * The 11/40 added the MODE bits to the PSW (but only KERNEL=00 and USER=11) and 18-bit
     * addressing via an MMU; there was still only one register set.
     *
     * The 11/45 added REGSET bit to the PSW (to support a second register set), SUPER=01
     * mode to the existing KERNEL=00 and USER=11 modes, separate I/D spaces, and other MMU
     * extensions (eg, MMR1 and MMR3).
     *
     * The 11/70 added 22-bit addressing and corresponding extensions to the MMU.
     */
    MODEL_KA10: 1001,

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
    ADDR_LIMIT:     Math.pow(2, 18),
    DATA_INVALID:   0,
    DATA_LIMIT:     Math.pow(2, 36),
    /*
     * Assorted common opcodes
     */
    OPCODE: {
        HALT:       0o000000000000,     // TODO: Resolve
        INVALID:    0o777777777777      // TODO: Resolve
    },
    /*
     * Internal operation state flags
     */
    OPFLAG: {
        IRQ_DELAY:  0x0001,             // incremented until it becomes IRQ
        IRQ:        0x0002,             // time to call checkInterrupts()
        IRQ_MASK:   0x0003,
        DEBUGGER:   0x0004,             // set if the Debugger wants to perform checks
        WAIT:       0x0008,             // WAIT operation in progress
        PRESERVE:   0x000F,             // OPFLAG bits to preserve prior to the next instruction
    }
};

/*
 * Combine all the shared globals and machine-specific globals into one machine-specific global object,
 * which all machine components should start using; eg: "if (PDP10.DEBUGGER)" instead of "if (DEBUGGER)".
 */
PDP10.APPCLASS          = APPCLASS;
PDP10.APPNAME           = APPNAME;
PDP10.DEBUGGER          = DEBUGGER;

if (NODE) {
    global.APPCLASS     = APPCLASS;
    global.APPNAME      = APPNAME;
    global.DEBUGGER     = DEBUGGER;
    global.PDP10        = PDP10;
    module.exports      = PDP10;
}
