/**
 * @fileoverview PCjs-specific BIOS/DOS interrupt definitions.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-Dec-11
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

/*
 * Components that previously used Debugger interrupt definitions by including:
 *
 *     var Debugger = require("./debugger");
 *
 * and using:
 *
 *      Debugger.INT.FOO
 *
 * must now instead include:
 *
 *      var Interrupts = require("./interrupts");
 *
 * and then replace all occurrences of "Debugger.INT.FOO" with "Interrupts.FOO.VECTOR".
 */

var Interrupts = {
    VIDEO: {
        VECTOR: 0x10
    },
    DISK: {
        VECTOR: 0x13
    },
    CASSETTE: {
        VECTOR: 0x15
    },
    KBD: {
        VECTOR: 0x16
    },
    RTC: {
        VECTOR: 0x1a
    },
    TIMER_TICK: {
        VECTOR: 0x1c
    },
    DOS: {
        VECTOR: 0x21
    },
    MOUSE: {
        VECTOR: 0x33
    }
};

if (typeof module !== 'undefined') module.exports = Interrupts;
