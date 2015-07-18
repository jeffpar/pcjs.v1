/**
 * @fileoverview PCjs-specific compile-time definitions.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-May-08
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

/**
 * @define {string}
 */
var PCJSCLASS = "pcjs";         // this @define is the default application class (formerly APPCLASS) to use for PCjs

/**
 * @define {boolean}
 *
 * WARNING: DEBUGGER needs to accurately reflect whether or not the Debugger component is (or will be) loaded.
 * In the compiled case, we rely on the Closure Compiler to override DEBUGGER as appropriate.  When it's *false*,
 * nearly all of debugger.js will be conditionally removed by the compiler, reducing it to little more than a
 * "type skeleton", which also solves some type-related warnings we would otherwise have if we tried to remove
 * debugger.js from the compilation process altogether.
 *
 * However, when we're in "development mode" and running uncompiled code in debugger-less configurations,
 * I would like to skip loading debugger.js altogether.  When doing that, we must ALSO arrange for an additional file
 * (nodebugger.js) to be loaded immediately after this file, which *explicitly* overrides DEBUGGER with *false*.
 */
var DEBUGGER = true;            // this @define is overridden by the Closure Compiler to remove Debugger-related support

/**
 * @define {boolean}
 *
 * PREFETCH enables the use of a prefetch queue.
 *
 * See the Bus component for details.
 */
var PREFETCH = false;

/**
 * @define {boolean}
 *
 * FATARRAYS is a Closure Compiler compile-time option that allocates an Array of numbers for every Memory block,
 * where each a number represents ONE byte; very wasteful, but potentially slightly faster.
 *
 * See the Memory component for details.
 */
var FATARRAYS = false;

/**
 * TYPEDARRAYS enables use of typed arrays for Memory blocks.  This used to be a compile-time-only option, but I've
 * added Memory access functions for typed arrays (see Memory.afnTypedArray), so support can be enabled dynamically.
 *
 * See the Memory component for details.
 */
var TYPEDARRAYS = (typeof ArrayBuffer !== 'undefined');

/**
 * @define {boolean}
 *
 * BACKTRACK enables backtracking: a mechanism that allows us to tag every byte of incoming data and follow the
 * flow of that data.
 *
 * This is set to !COMPILED, disabling backtracking in all compiled versions, but we may eventually set it to
 * match the DEBUGGER setting -- unless it slows down machines using the built-in Debugger too much, in which case
 * we'll have to rethink that choice OR provide a Debugger command that dynamically enables/disables as much of
 * the backtracking support as possible.
 */
var BACKTRACK = false; // !COMPILED;

/**
 * @define {boolean}
 *
 * SAMPLER enables instruction sampling (a work-in-progress).  This was used briefly as an internal debugging aid,
 * to periodically record LIP values in a fixed-length sampling buffer, halting execution once the sampling buffer
 * was full, and then compare those sampled LIP values to corresponding LIP values on subsequent runs, to look
 * for deviations.  In theory, every run is supposed to be absolutely identical, even if you interrupt execution
 * with the Debugger or enable/disable different sets of messages, but in practice, that's hard to guarantee.
 */
var SAMPLER = false;

/**
 * @define {boolean}
 *
 * BUGS_8086 enables support for known 8086 bugs.  It's turned off by default, because 1) it adds overhead, and
 * 2) it's hard to imagine any software actually being dependent on any of the bugs covered by this (eg, the failure
 * to properly restart string instructions with multiple prefixes, or the failure to inhibit hardware interrupts
 * following SS segment loads).
 */
var BUGS_8086 = false;

/**
 * @define {boolean}
 *
 * I386 enables 80386 support.  My preference continues to be one "binary" that supports all implemented CPUs, but
 * I'm providing this to enable a slimmed-down binary, at least until 80386 support is actually finished; at the
 * moment, there's just a lot of scaffolding that bloats the compiled version without adding any real functionality.
 */
var I386 = true;

/**
 * @define {boolean}
 *
 * COMPAQ386 enables Compaq DeskPro 386 support.
 */
var COMPAQ386 = true;

/**
 * @define {boolean}
 *
 * PAGEBLOCKS enables 80386 paging support with assistance from the Bus component.  This affects how the Bus component
 * defines physical memory parameters for a 32-bit bus.  With the 8086 and 80286 processors, the Bus component was free
 * to choose any block size for physical memory allocations that made sense for the bus width (eg, 4Kb blocks for a
 * 20-bit bus, or 16Kb blocks for 24-bit bus).
 *
 * However, for the 80386 processor, it makes more sense to choose a block size that matches the page size (ie, 4Kb),
 * because then we have the option of altering the address-to-memory mapping for any block to match whatever page table
 * mapping is in effect for that address, if any, without requiring another layer of address translation.
 */
var PAGEBLOCKS = I386;

if (typeof module !== 'undefined') {
    global.PCJSCLASS = PCJSCLASS;
    global.DEBUGGER = DEBUGGER;
    global.PREFETCH = PREFETCH;
    global.FATARRAYS = FATARRAYS;
    global.TYPEDARRAYS = TYPEDARRAYS;
    global.BACKTRACK = BACKTRACK;
    global.SAMPLER = SAMPLER;
    global.BUGS_8086 = BUGS_8086;
    global.I386 = I386;
    global.COMPAQ386 = COMPAQ386;
    global.PAGEBLOCKS = PAGEBLOCKS;
    /*
     * TODO: When we're "required" by Node, should we return anything via module.exports?
     */
}
