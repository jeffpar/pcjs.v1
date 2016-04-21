/**
 * @fileoverview Implements PC8080 opcode handlers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-20
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

if (NODE) {
    var str         = require("../../shared/lib/strlib");
    var Messages    = require("./messages");
    var CPUDef      = require("./CPUDef");
}

/**
 * op=0x00 (NOP)
 *
 * @this {CPUSim}
 */
CPUDef.opNOP = function()
{
    this.nStepCycles -= 4;
};

/**
 * op=0x01 (LXI B,d16)
 *
 * @this {CPUSim}
 */
CPUDef.opLXIB = function()
{
    this.regC = this.getPCByte();
    this.regB = this.getPCByte();
    this.nStepCycles -= 10;
};

/**
 * opTBD()
 *
 * @this {CPUSim}
 */
CPUDef.opTBD = function()
{
    this.setPC(this.getPC() - 1);
    this.printMessage("unimplemented opcode", true);
    this.stopCPU();
};

/*
 * This 256-entry array of opcode functions is at the heart of the CPU engine: stepCPU(n).
 *
 * It might be worth trying a switch() statement instead, to see how the performance compares,
 * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
 * money on array lookup.
 */
CPUDef.aOps = [
    /* 0x00-0x03 */ CPUDef.opNOP,   CPUDef.opLXIB,  CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x04-0x07 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x08-0x0B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x0C-0x0F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x10-0x13 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x14-0x17 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x18-0x1B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x1C-0x1F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x20-0x23 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x24-0x27 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x28-0x2B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x2C-0x2F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x30-0x33 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x34-0x37 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x38-0x3B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x3C-0x3F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x40-0x43 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x44-0x47 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x48-0x4B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x4C-0x4F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x50-0x53 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x54-0x57 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x58-0x5B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x5C-0x5F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x60-0x63 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x64-0x67 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x68-0x6B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x6C-0x6F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x70-0x73 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x74-0x77 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x78-0x7B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x7C-0x7F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x80-0x83 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x84-0x87 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x88-0x8B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x8C-0x8F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x90-0x93 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x94-0x97 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x98-0x9B */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0x9C-0x9F */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xA0-0xA3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xA4-0xA7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xA8-0xAB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xAC-0xAF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xB0-0xB3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xB4-0xB7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xB8-0xBB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xBC-0xBF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xC0-0xC3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xC4-0xC7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xC8-0xCB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xCC-0xCF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xD0-0xD3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xD4-0xD7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xD8-0xDB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xDC-0xDF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xE0-0xE3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xE4-0xE7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xE8-0xEB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xEC-0xEF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xF0-0xF3 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xF4-0xF7 */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xF8-0xFB */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,
    /* 0xFC-0xFF */ CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD,   CPUDef.opTBD
];
