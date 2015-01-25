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
 * APP_PCJS collects all PCjs application globals in one convenient place
 */
if (DEBUG) {
    var APP_PCJS = {Component: null};
    if (typeof Component === 'function') APP_PCJS.Component = Component;
}

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
 * @define {boolean}
 *
 * TYPEDARRAYS enables use of typed arrays for Memory blocks.  This used to be a compile-time-only option, but I've
 * added Memory access functions for typed arrays (see Memory.afnTypedArray), so support can be enabled dynamically.
 *
 * However, TYPEDARRAYS has always been slightly slower than the original LONGARRAYS implementation (which uses an
 * Array of numbers that stores 32 bits -- 4 consecutive bytes -- per number), so TYPEDARRAYS is completely disabled.
 *
 * See the Memory component for details.
 */
var TYPEDARRAYS = false; // (typeof ArrayBuffer !== 'undefined');

/**
 * @define {boolean}
 *
 * Enables backtracking (disabled in compiled versions).  Backtracking is a mechanism that allows us to tag
 * every byte of incoming data and follow the flow of that data.
 */
var BACKTRACK = true;

/**
 * @define {boolean}
 *
 * Enables instruction sampling (a work-in-progress).  This was used briefly as an internal debugging aid, to
 * periodically record LIP values in a fixed-length sampling buffer, halting execution once the sampling buffer
 * was full, and then compare those sampled LIP values to corresponding LIP values on subsequent runs, to look
 * for deviations.  In theory, every run is supposed to be absolutely identical, even if you interrupt execution
 * with the Debugger or enable/disable different sets of messages, but in practice, that's hard to guarantee.
 */
var SAMPLER = false;

/**
 * @define {boolean}
 *
 * Enables 80386 support.  My preference continues to be one "binary" that supports all implemented CPUs, but
 * I'm providing this to enable a slimmed-down binary, at least until 80386 support is actually finished; at the
 * moment, there's just a lot of scaffolding that bloats the compiled version without adding real functionality.
 */
var I386 = true;

if (typeof module !== 'undefined') {
    global.PCJSCLASS = PCJSCLASS;
    global.DEBUGGER = DEBUGGER;
    global.PREFETCH = PREFETCH;
    global.FATARRAYS = FATARRAYS;
    global.TYPEDARRAYS = TYPEDARRAYS;
    global.BACKTRACK = BACKTRACK;
    global.SAMPLER = SAMPLER;
    global.I386 = I386;
    /*
     * TODO: When we're "required" by Node, should we return anything via module.exports?
     */
}
