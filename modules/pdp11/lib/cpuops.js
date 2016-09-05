/**
 * @fileoverview Implements PDP11 opcode handlers.
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

if (NODE) {
    var str           = require("../../shared/lib/strlib");
    var PDP11         = require("./defines");
    var MessagesPDP11 = require("./messages");
}

/**
 * op=0x00 (NOP)
 *
 * @this {CPUStatePDP11}
 */
PDP11.opNOP = function()
{
    this.nStepCycles -= 4;
};

/*
 * This 256-entry array of opcode functions is at the heart of the CPU engine: stepCPU(n).
 *
 * It might be worth trying a switch() statement instead, to see how the performance compares,
 * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
 * money on array lookup.
 */
PDP11.aOpsPDP1170 = [
    /* 0x00-0x03 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x04-0x07 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x08-0x0B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x0C-0x0F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x10-0x13 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x14-0x17 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x18-0x1B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x1C-0x1F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x20-0x23 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x24-0x27 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x28-0x2B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x2C-0x2F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x30-0x33 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x34-0x37 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x38-0x3B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x3C-0x3F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x40-0x43 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x44-0x47 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x48-0x4B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x4C-0x4F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x50-0x53 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x54-0x57 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x58-0x5B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x5C-0x5F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x60-0x63 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x64-0x67 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x68-0x6B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x6C-0x6F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x70-0x73 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x74-0x77 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x78-0x7B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x7C-0x7F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x80-0x83 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x84-0x87 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x88-0x8B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x8C-0x8F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x90-0x93 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x94-0x97 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x98-0x9B */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0x9C-0x9F */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xA0-0xA3 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xA4-0xA7 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xA8-0xAB */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xAC-0xAF */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xB0-0xB3 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xB4-0xB7 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xB8-0xBB */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xBC-0xBF */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xC0-0xC3 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xC4-0xC7 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xC8-0xCB */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xCC-0xCF */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xD0-0xD3 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xD4-0xD7 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xD8-0xDB */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xDC-0xDF */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xE0-0xE3 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xE4-0xE7 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xE8-0xEB */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xEC-0xEF */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xF0-0xF3 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xF4-0xF7 */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xF8-0xFB */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,
    /* 0xFC-0xFF */ PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP,  PDP11.opNOP
];
