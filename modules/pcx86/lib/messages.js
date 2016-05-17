/**
 * @fileoverview Defines message categories.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-Dec-11
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see Computer.COPYRIGHT).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

/*
 * Components that previously used Debugger messages definitions by including:
 *
 *     var Debugger = require("./debugger");
 *
 * and using:
 *
 *      Debugger.MESSAGE.FOO
 *
 * must now instead include:
 *
 *      var Messages = require("./messages");
 *
 * and then replace all occurrences of "Debugger.MESSAGE.FOO" with "Messages.FOO".
 */

var Messages = {
    CPU:        0x00000001,
    SEG:        0x00000002,
    DESC:       0x00000004,
    TSS:        0x00000008,
    INT:        0x00000010,
    FAULT:      0x00000020,
    BUS:        0x00000040,
    MEM:        0x00000080,
    PORT:       0x00000100,
    DMA:        0x00000200,
    PIC:        0x00000400,
    TIMER:      0x00000800,
    CMOS:       0x00001000,
    RTC:        0x00002000,
    C8042:      0x00004000,
    CHIPSET:    0x00008000,
    KEYBOARD:   0x00010000,
    KEYS:       0x00020000,
    VIDEO:      0x00040000,
    FDC:        0x00080000,
    HDC:        0x00100000,
    DISK:       0x00200000,
    PARALLEL:   0x00400000,
    SERIAL:     0x00800000,
    MOUSE:      0x01000000,
    SPEAKER:    0x02000000,
    COMPUTER:   0x04000000,
    DOS:        0x08000000,
    DATA:       0x10000000,
    LOG:        0x20000000,
    WARN:       0x40000000,
    HALT:       0x80000000|0
};

if (NODE) module.exports = Messages;
