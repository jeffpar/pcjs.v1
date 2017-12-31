/**
 * @fileoverview Compile-time definitions used by C1Pjs and PCjs.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
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
var APPVERSION = "1.x.x";       // this @define is overridden by the Closure Compiler with the version in package.json

var XMLVERSION = null;          // this is set in non-COMPILED builds by embedMachine() if a version number was found in the machine XML

var COPYRIGHT = "Copyright © 2012-2018 Jeff Parsons <Jeff@pcjs.org>";

var LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

var CSSCLASS = "pcjs";

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
 * RS-232 DB-25 Pin Definitions, mapped to bits 1-25 in a 32-bit status value.
 *
 * SerialPorts in PCjs machines are considered DTE (Data Terminal Equipment), which means they should be "virtually"
 * connected to each other via a null-modem cable, which assumes the following cross-wiring:
 *
 *     G       1  <->  1        G       (Ground)
 *     TD      2  <->  3        RD      (Received Data)
 *     RD      3  <->  2        TD      (Transmitted Data)
 *     RTS     4  <->  5        CTS     (Clear To Send)
 *     CTS     5  <->  4        RTS     (Request To Send)
 *     DSR   6+8  <->  20       DTR     (Data Terminal Ready)
 *     SG      7  <->  7        SG      (Signal Ground)
 *     DTR    20  <->  6+8      DSR     (Data Set Ready + Carrier Detect)
 *     RI     22  <->  22       RI      (Ring Indicator)
 *
 * TODO: Move these definitions to a more appropriate shared file at some point.
 */
var RS232 = {
    RTS: {
        PIN:  4,
        MASK: 0x00000010
    },
    CTS: {
        PIN:  5,
        MASK: 0x00000020
    },
    DSR: {
        PIN:  6,
        MASK: 0x00000040
    },
    CD: {
        PIN:  8,
        MASK: 0x00000100
    },
    DTR: {
        PIN:  20,
        MASK: 0x00100000
    },
    RI: {
        PIN:  22,
        MASK: 0x00400000
    }
};

/*
 * NODE should be true if we're running under NodeJS (eg, command-line), false if not (eg, web browser)
 */
var NODE = false;
if (typeof module !== 'undefined') {
    NODE = true;
}

if (NODE) {
    global.window       = false;        // provides an alternative "if (typeof window === 'undefined')" (ie, "if (window) ...")
    global.APPVERSION   = APPVERSION;
    global.XMLVERSION   = XMLVERSION;
    global.COPYRIGHT    = COPYRIGHT;
    global.LICENSE      = LICENSE;
    global.CSSCLASS     = CSSCLASS;
    global.SITEHOST     = SITEHOST;
    global.COMPILED     = COMPILED;
    global.DEBUG        = DEBUG;
    global.MAXDEBUG     = MAXDEBUG;
    global.PRIVATE      = PRIVATE;
    global.RS232        = RS232;
    global.NODE         = NODE;
    /*
     * TODO: When we're "required" by Node, should we return anything via module.exports?
     */
}
