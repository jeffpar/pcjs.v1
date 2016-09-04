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
    var CPUDefPDP11   = require("./CPUDef");
    var MessagesPDP11 = require("./messages");
}

/**
 * op=0x00 (NOP)
 *
 * @this {CPUStatePDP11}
 */
CPUDefPDP11.opNOP = function()
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
CPUDefPDP11.aOpsPDP1170 = [
    /* 0x00-0x03 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x04-0x07 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x08-0x0B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x0C-0x0F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x10-0x13 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x14-0x17 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x18-0x1B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x1C-0x1F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x20-0x23 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x24-0x27 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x28-0x2B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x2C-0x2F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x30-0x33 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x34-0x37 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x38-0x3B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x3C-0x3F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x40-0x43 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x44-0x47 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x48-0x4B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x4C-0x4F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x50-0x53 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x54-0x57 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x58-0x5B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x5C-0x5F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x60-0x63 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x64-0x67 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x68-0x6B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x6C-0x6F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x70-0x73 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x74-0x77 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x78-0x7B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x7C-0x7F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x80-0x83 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x84-0x87 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x88-0x8B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x8C-0x8F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x90-0x93 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x94-0x97 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x98-0x9B */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0x9C-0x9F */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xA0-0xA3 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xA4-0xA7 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xA8-0xAB */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xAC-0xAF */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xB0-0xB3 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xB4-0xB7 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xB8-0xBB */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xBC-0xBF */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xC0-0xC3 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xC4-0xC7 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xC8-0xCB */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xCC-0xCF */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xD0-0xD3 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xD4-0xD7 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xD8-0xDB */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xDC-0xDF */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xE0-0xE3 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xE4-0xE7 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xE8-0xEB */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xEC-0xEF */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xF0-0xF3 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xF4-0xF7 */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xF8-0xFB */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,
    /* 0xFC-0xFF */ CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP,  CPUDefPDP11.opNOP
];
