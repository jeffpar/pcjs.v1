/**
 * @fileoverview Compile-time definitions used by C1Pjs and PCjs.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-May-08
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
var APPVERSION = "1.x.x";       // this @define is overridden by the Closure Compiler with the version in package.json

var XMLVERSION = null;          // this is set in non-COMPILED builds by embedMachine() if a version number was found in the machine XML

var COPYRIGHT = "Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>";

var LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

/**
 * @define {string}
 */
var SITEHOST = "localhost:8088";// this @define is overridden by the Closure Compiler with "www.pcjs.org"

/**
 * @define {boolean}
 */
var COMPILED = false;           // this @define is overridden by the Closure Compiler (to true)

/**
 * @define {boolean}
 */
var DEBUG = true;               // this @define is overridden by the Closure Compiler (to false) to remove DEBUG-only code

/**
 * @define {boolean}
 */
var MAXDEBUG = false;           // this @define is overridden by the Closure Compiler (to false) to remove MAXDEBUG-only code

/**
 * @define {boolean}
 */
var PRIVATE = false;            // this @define is overridden by the Closure Compiler (to false) to enable PRIVATE code

/*
 * NODE should be true if we're running under NodeJS (eg, command-line), false if not (eg, web browser)
 */
var NODE = false;
if (typeof module !== 'undefined') {
    NODE = true;
}

if (NODE) {
    global.window = false;      // provides an alternative "if (typeof window === 'undefined')" (ie, "if (window) ...")
    global.APPVERSION = APPVERSION;
    global.XMLVERSION = XMLVERSION;
    global.COPYRIGHT  = COPYRIGHT;
    global.SITEHOST   = SITEHOST;
    global.COMPILED   = COMPILED;
    global.DEBUG      = DEBUG;
    global.MAXDEBUG   = MAXDEBUG;
    global.PRIVATE    = PRIVATE;
    global.NODE       = NODE;
    /*
     * TODO: When we're "required" by Node, should we return anything via module.exports?
     */
}
