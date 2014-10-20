/**
 * @fileoverview Implements PCjs 8086 mode-byte decoding.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Sep-05
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

if (typeof module !== 'undefined') {
    var X86         = require("./x86");
}

var X86Mods = {
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=000 (BX+SI)
     */
    opModMemByte00: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=001 (BX+DI)
     */
    opModMemByte01: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=010 (BP+SI)
     */
    opModMemByte02: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=011 (BP+DI)
     */
    opModMemByte03: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=100 (SI)
     */
    opModMemByte04: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=101 (DI)
     */
    opModMemByte05: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=110 (d16)
     */
    opModMemByte06: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AL:src)  r/m=111 (BX)
     */
    opModMemByte07: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=000 (BX+SI)
     */
    opModMemByte08: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=001 (BX+DI)
     */
    opModMemByte09: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=010 (BP+SI)
     */
    opModMemByte0A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=011 (BP+DI)
     */
    opModMemByte0B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=100 (SI)
     */
    opModMemByte0C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=101 (DI)
     */
    opModMemByte0D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=110 (d16)
     */
    opModMemByte0E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CL:src)  r/m=111 (BX)
     */
    opModMemByte0F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=000 (BX+SI)
     */
    opModMemByte10: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=001 (BX+DI)
     */
    opModMemByte11: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=010 (BP+SI)
     */
    opModMemByte12: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=011 (BP+DI)
     */
    opModMemByte13: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=100 (SI)
     */
    opModMemByte14: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=101 (DI)
     */
    opModMemByte15: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=110 (d16)
     */
    opModMemByte16: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DL:src)  r/m=111 (BX)
     */
    opModMemByte17: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=000 (BX+SI)
     */
    opModMemByte18: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=001 (BX+DI)
     */
    opModMemByte19: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=010 (BP+SI)
     */
    opModMemByte1A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=011 (BP+DI)
     */
    opModMemByte1B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=100 (SI)
     */
    opModMemByte1C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=101 (DI)
     */
    opModMemByte1D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=110 (d16)
     */
    opModMemByte1E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BL:src)  r/m=111 (BX)
     */
    opModMemByte1F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=000 (BX+SI)
     */
    opModMemByte20: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=001 (BX+DI)
     */
    opModMemByte21: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=010 (BP+SI)
     */
    opModMemByte22: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=011 (BP+DI)
     */
    opModMemByte23: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=100 (SI)
     */
    opModMemByte24: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=101 (DI)
     */
    opModMemByte25: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=110 (d16)
     */
    opModMemByte26: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (AH:src)  r/m=111 (BX)
     */
    opModMemByte27: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=000 (BX+SI)
     */
    opModMemByte28: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=001 (BX+DI)
     */
    opModMemByte29: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=010 (BP+SI)
     */
    opModMemByte2A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=011 (BP+DI)
     */
    opModMemByte2B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=100 (SI)
     */
    opModMemByte2C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=101 (DI)
     */
    opModMemByte2D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=110 (d16)
     */
    opModMemByte2E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (CH:src)  r/m=111 (BX)
     */
    opModMemByte2F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=000 (BX+SI)
     */
    opModMemByte30: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=001 (BX+DI)
     */
    opModMemByte31: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=010 (BP+SI)
     */
    opModMemByte32: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=011 (BP+DI)
     */
    opModMemByte33: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=100 (SI)
     */
    opModMemByte34: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=101 (DI)
     */
    opModMemByte35: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=110 (d16)
     */
    opModMemByte36: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (DH:src)  r/m=111 (BX)
     */
    opModMemByte37: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=000 (BX+SI)
     */
    opModMemByte38: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=001 (BX+DI)
     */
    opModMemByte39: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=010 (BP+SI)
     */
    opModMemByte3A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=011 (BP+DI)
     */
    opModMemByte3B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=100 (SI)
     */
    opModMemByte3C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=101 (DI)
     */
    opModMemByte3D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=110 (d16)
     */
    opModMemByte3E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (BH:src)  r/m=111 (BX)
     */
    opModMemByte3F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte40: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte41: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte42: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte43: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=100 (SI+d8)
     */
    opModMemByte44: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=101 (DI+d8)
     */
    opModMemByte45: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=110 (BP+d8)
     */
    opModMemByte46: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=111 (BX+d8)
     */
    opModMemByte47: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte48: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte49: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte4A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte4B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=100 (SI+d8)
     */
    opModMemByte4C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=101 (DI+d8)
     */
    opModMemByte4D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=110 (BP+d8)
     */
    opModMemByte4E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=111 (BX+d8)
     */
    opModMemByte4F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte50: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte51: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte52: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte53: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=100 (SI+d8)
     */
    opModMemByte54: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=101 (DI+d8)
     */
    opModMemByte55: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=110 (BP+d8)
     */
    opModMemByte56: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=111 (BX+d8)
     */
    opModMemByte57: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte58: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte59: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte5A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte5B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=100 (SI+d8)
     */
    opModMemByte5C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=101 (DI+d8)
     */
    opModMemByte5D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=110 (BP+d8)
     */
    opModMemByte5E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=111 (BX+d8)
     */
    opModMemByte5F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte60: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte61: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte62: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte63: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=100 (SI+d8)
     */
    opModMemByte64: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=101 (DI+d8)
     */
    opModMemByte65: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=110 (BP+d8)
     */
    opModMemByte66: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=111 (BX+d8)
     */
    opModMemByte67: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte68: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte69: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte6A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte6B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=100 (SI+d8)
     */
    opModMemByte6C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=101 (DI+d8)
     */
    opModMemByte6D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=110 (BP+d8)
     */
    opModMemByte6E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=111 (BX+d8)
     */
    opModMemByte6F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte70: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte71: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte72: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte73: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=100 (SI+d8)
     */
    opModMemByte74: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=101 (DI+d8)
     */
    opModMemByte75: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=110 (BP+d8)
     */
    opModMemByte76: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=111 (BX+d8)
     */
    opModMemByte77: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=000 (BX+SI+d8)
     */
    opModMemByte78: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=001 (BX+DI+d8)
     */
    opModMemByte79: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=010 (BP+SI+d8)
     */
    opModMemByte7A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=011 (BP+DI+d8)
     */
    opModMemByte7B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=100 (SI+d8)
     */
    opModMemByte7C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=101 (DI+d8)
     */
    opModMemByte7D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=110 (BP+d8)
     */
    opModMemByte7E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=111 (BX+d8)
     */
    opModMemByte7F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByte80: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByte81: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByte82: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByte83: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=100 (SI+d16)
     */
    opModMemByte84: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=101 (DI+d16)
     */
    opModMemByte85: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=110 (BP+d16)
     */
    opModMemByte86: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=111 (BX+d16)
     */
    opModMemByte87: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByte88: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByte89: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByte8A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByte8B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=100 (SI+d16)
     */
    opModMemByte8C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=101 (DI+d16)
     */
    opModMemByte8D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=110 (BP+d16)
     */
    opModMemByte8E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=111 (BX+d16)
     */
    opModMemByte8F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByte90: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByte91: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByte92: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByte93: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=100 (SI+d16)
     */
    opModMemByte94: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=101 (DI+d16)
     */
    opModMemByte95: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=110 (BP+d16)
     */
    opModMemByte96: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=111 (BX+d16)
     */
    opModMemByte97: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByte98: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByte99: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByte9A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByte9B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=100 (SI+d16)
     */
    opModMemByte9C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=101 (DI+d16)
     */
    opModMemByte9D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=110 (BP+d16)
     */
    opModMemByte9E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=111 (BX+d16)
     */
    opModMemByte9F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByteA0: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByteA1: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByteA2: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByteA3: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=100 (SI+d16)
     */
    opModMemByteA4: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=101 (DI+d16)
     */
    opModMemByteA5: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=110 (BP+d16)
     */
    opModMemByteA6: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=111 (BX+d16)
     */
    opModMemByteA7: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByteA8: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByteA9: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByteAA: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByteAB: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=100 (SI+d16)
     */
    opModMemByteAC: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=101 (DI+d16)
     */
    opModMemByteAD: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=110 (BP+d16)
     */
    opModMemByteAE: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=111 (BX+d16)
     */
    opModMemByteAF: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByteB0: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByteB1: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByteB2: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByteB3: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=100 (SI+d16)
     */
    opModMemByteB4: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=101 (DI+d16)
     */
    opModMemByteB5: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=110 (BP+d16)
     */
    opModMemByteB6: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=111 (BX+d16)
     */
    opModMemByteB7: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=000 (BX+SI+d16)
     */
    opModMemByteB8: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=001 (BX+DI+d16)
     */
    opModMemByteB9: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=010 (BP+SI+d16)
     */
    opModMemByteBA: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=011 (BP+DI+d16)
     */
    opModMemByteBB: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=100 (SI+d16)
     */
    opModMemByteBC: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=101 (DI+d16)
     */
    opModMemByteBD: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=110 (BP+d16)
     */
    opModMemByteBE: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=111 (BX+d16)
     */
    opModMemByteBF: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=000 (BX+SI)
     */
    opModMemWord00: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=001 (BX+DI)
     */
    opModMemWord01: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=010 (BP+SI)
     */
    opModMemWord02: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=011 (BP+DI)
     */
    opModMemWord03: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=100 (SI)
     */
    opModMemWord04: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=101 (DI)
     */
    opModMemWord05: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=110 (d16)
     */
    opModMemWord06: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=000 (AX:src)  r/m=111 (BX)
     */
    opModMemWord07: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=000 (BX+SI)
     */
    opModMemWord08: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=001 (BX+DI)
     */
    opModMemWord09: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=010 (BP+SI)
     */
    opModMemWord0A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=011 (BP+DI)
     */
    opModMemWord0B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=100 (SI)
     */
    opModMemWord0C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=101 (DI)
     */
    opModMemWord0D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=110 (d16)
     */
    opModMemWord0E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=001 (CX:src)  r/m=111 (BX)
     */
    opModMemWord0F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=000 (BX+SI)
     */
    opModMemWord10: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=001 (BX+DI)
     */
    opModMemWord11: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=010 (BP+SI)
     */
    opModMemWord12: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=011 (BP+DI)
     */
    opModMemWord13: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=100 (SI)
     */
    opModMemWord14: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=101 (DI)
     */
    opModMemWord15: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=110 (d16)
     */
    opModMemWord16: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=010 (DX:src)  r/m=111 (BX)
     */
    opModMemWord17: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=000 (BX+SI)
     */
    opModMemWord18: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=001 (BX+DI)
     */
    opModMemWord19: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=010 (BP+SI)
     */
    opModMemWord1A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=011 (BP+DI)
     */
    opModMemWord1B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=100 (SI)
     */
    opModMemWord1C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=101 (DI)
     */
    opModMemWord1D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=110 (d16)
     */
    opModMemWord1E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=011 (BX:src)  r/m=111 (BX)
     */
    opModMemWord1F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=000 (BX+SI)
     */
    opModMemWord20: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=001 (BX+DI)
     */
    opModMemWord21: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=010 (BP+SI)
     */
    opModMemWord22: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=011 (BP+DI)
     */
    opModMemWord23: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=100 (SI)
     */
    opModMemWord24: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=101 (DI)
     */
    opModMemWord25: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=110 (d16)
     */
    opModMemWord26: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=100 (SP:src)  r/m=111 (BX)
     */
    opModMemWord27: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=000 (BX+SI)
     */
    opModMemWord28: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=001 (BX+DI)
     */
    opModMemWord29: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=010 (BP+SI)
     */
    opModMemWord2A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=011 (BP+DI)
     */
    opModMemWord2B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=100 (SI)
     */
    opModMemWord2C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=101 (DI)
     */
    opModMemWord2D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=110 (d16)
     */
    opModMemWord2E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=101 (BP:src)  r/m=111 (BX)
     */
    opModMemWord2F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=000 (BX+SI)
     */
    opModMemWord30: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=001 (BX+DI)
     */
    opModMemWord31: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=010 (BP+SI)
     */
    opModMemWord32: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=011 (BP+DI)
     */
    opModMemWord33: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=100 (SI)
     */
    opModMemWord34: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=101 (DI)
     */
    opModMemWord35: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=110 (d16)
     */
    opModMemWord36: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=110 (SI:src)  r/m=111 (BX)
     */
    opModMemWord37: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=000 (BX+SI)
     */
    opModMemWord38: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=001 (BX+DI)
     */
    opModMemWord39: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=010 (BP+SI)
     */
    opModMemWord3A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=011 (BP+DI)
     */
    opModMemWord3B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=100 (SI)
     */
    opModMemWord3C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=101 (DI)
     */
    opModMemWord3D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=110 (d16)
     */
    opModMemWord3E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:dst)  reg=111 (DI:src)  r/m=111 (BX)
     */
    opModMemWord3F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord40: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord41: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord42: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord43: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=100 (SI+d8)
     */
    opModMemWord44: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=101 (DI+d8)
     */
    opModMemWord45: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=110 (BP+d8)
     */
    opModMemWord46: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=111 (BX+d8)
     */
    opModMemWord47: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord48: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord49: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord4A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord4B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=100 (SI+d8)
     */
    opModMemWord4C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=101 (DI+d8)
     */
    opModMemWord4D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=110 (BP+d8)
     */
    opModMemWord4E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=111 (BX+d8)
     */
    opModMemWord4F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord50: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord51: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord52: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord53: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=100 (SI+d8)
     */
    opModMemWord54: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=101 (DI+d8)
     */
    opModMemWord55: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=110 (BP+d8)
     */
    opModMemWord56: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=111 (BX+d8)
     */
    opModMemWord57: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord58: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord59: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord5A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord5B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=100 (SI+d8)
     */
    opModMemWord5C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=101 (DI+d8)
     */
    opModMemWord5D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=110 (BP+d8)
     */
    opModMemWord5E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=111 (BX+d8)
     */
    opModMemWord5F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord60: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord61: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord62: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord63: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=100 (SI+d8)
     */
    opModMemWord64: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=101 (DI+d8)
     */
    opModMemWord65: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=110 (BP+d8)
     */
    opModMemWord66: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=111 (BX+d8)
     */
    opModMemWord67: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord68: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord69: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord6A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord6B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=100 (SI+d8)
     */
    opModMemWord6C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=101 (DI+d8)
     */
    opModMemWord6D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=110 (BP+d8)
     */
    opModMemWord6E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=111 (BX+d8)
     */
    opModMemWord6F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord70: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord71: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord72: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord73: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=100 (SI+d8)
     */
    opModMemWord74: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=101 (DI+d8)
     */
    opModMemWord75: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=110 (BP+d8)
     */
    opModMemWord76: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=111 (BX+d8)
     */
    opModMemWord77: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=000 (BX+SI+d8)
     */
    opModMemWord78: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=001 (BX+DI+d8)
     */
    opModMemWord79: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=010 (BP+SI+d8)
     */
    opModMemWord7A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=011 (BP+DI+d8)
     */
    opModMemWord7B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=100 (SI+d8)
     */
    opModMemWord7C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=101 (DI+d8)
     */
    opModMemWord7D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=110 (BP+d8)
     */
    opModMemWord7E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=111 (BX+d8)
     */
    opModMemWord7F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWord80: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWord81: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWord82: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWord83: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=100 (SI+d16)
     */
    opModMemWord84: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=101 (DI+d16)
     */
    opModMemWord85: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=110 (BP+d16)
     */
    opModMemWord86: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=111 (BX+d16)
     */
    opModMemWord87: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regAX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWord88: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWord89: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWord8A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWord8B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=100 (SI+d16)
     */
    opModMemWord8C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=101 (DI+d16)
     */
    opModMemWord8D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=110 (BP+d16)
     */
    opModMemWord8E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=111 (BX+d16)
     */
    opModMemWord8F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regCX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWord90: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWord91: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWord92: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWord93: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=100 (SI+d16)
     */
    opModMemWord94: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=101 (DI+d16)
     */
    opModMemWord95: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=110 (BP+d16)
     */
    opModMemWord96: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=111 (BX+d16)
     */
    opModMemWord97: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWord98: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWord99: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWord9A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWord9B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=100 (SI+d16)
     */
    opModMemWord9C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=101 (DI+d16)
     */
    opModMemWord9D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=110 (BP+d16)
     */
    opModMemWord9E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=111 (BX+d16)
     */
    opModMemWord9F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBX);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWordA0: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWordA1: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWordA2: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWordA3: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=100 (SI+d16)
     */
    opModMemWordA4: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=101 (DI+d16)
     */
    opModMemWordA5: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=110 (BP+d16)
     */
    opModMemWordA6: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=111 (BX+d16)
     */
    opModMemWordA7: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regSP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWordA8: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWordA9: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWordAA: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWordAB: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=100 (SI+d16)
     */
    opModMemWordAC: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=101 (DI+d16)
     */
    opModMemWordAD: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=110 (BP+d16)
     */
    opModMemWordAE: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=111 (BX+d16)
     */
    opModMemWordAF: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBP);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWordB0: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWordB1: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWordB2: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWordB3: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=100 (SI+d16)
     */
    opModMemWordB4: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=101 (DI+d16)
     */
    opModMemWordB5: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=110 (BP+d16)
     */
    opModMemWordB6: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=111 (BX+d16)
     */
    opModMemWordB7: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regSI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=000 (BX+SI+d16)
     */
    opModMemWordB8: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=001 (BX+DI+d16)
     */
    opModMemWordB9: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=010 (BP+SI+d16)
     */
    opModMemWordBA: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=011 (BP+DI+d16)
     */
    opModMemWordBB: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=100 (SI+d16)
     */
    opModMemWordBC: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=101 (DI+d16)
     */
    opModMemWordBD: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=110 (BP+d16)
     */
    opModMemWordBE: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=111 (BX+d16)
     */
    opModMemWordBF: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDI);
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=000 (BX+SI)
     */
    opModRegByte00: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=001 (BX+DI)
     */
    opModRegByte01: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=010 (BP+SI)
     */
    opModRegByte02: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=011 (BP+DI)
     */
    opModRegByte03: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=100 (SI)
     */
    opModRegByte04: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=101 (DI)
     */
    opModRegByte05: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=110 (d16)
     */
    opModRegByte06: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AL:dst)  r/m=111 (BX)
     */
    opModRegByte07: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=000 (BX+SI)
     */
    opModRegByte08: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=001 (BX+DI)
     */
    opModRegByte09: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=010 (BP+SI)
     */
    opModRegByte0A: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=011 (BP+DI)
     */
    opModRegByte0B: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=100 (SI)
     */
    opModRegByte0C: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=101 (DI)
     */
    opModRegByte0D: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=110 (d16)
     */
    opModRegByte0E: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CL:dst)  r/m=111 (BX)
     */
    opModRegByte0F: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=000 (BX+SI)
     */
    opModRegByte10: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=001 (BX+DI)
     */
    opModRegByte11: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=010 (BP+SI)
     */
    opModRegByte12: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=011 (BP+DI)
     */
    opModRegByte13: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=100 (SI)
     */
    opModRegByte14: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=101 (DI)
     */
    opModRegByte15: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=110 (d16)
     */
    opModRegByte16: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DL:dst)  r/m=111 (BX)
     */
    opModRegByte17: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=000 (BX+SI)
     */
    opModRegByte18: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=001 (BX+DI)
     */
    opModRegByte19: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=010 (BP+SI)
     */
    opModRegByte1A: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=011 (BP+DI)
     */
    opModRegByte1B: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=100 (SI)
     */
    opModRegByte1C: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=101 (DI)
     */
    opModRegByte1D: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=110 (d16)
     */
    opModRegByte1E: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BL:dst)  r/m=111 (BX)
     */
    opModRegByte1F: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=000 (BX+SI)
     */
    opModRegByte20: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=001 (BX+DI)
     */
    opModRegByte21: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=010 (BP+SI)
     */
    opModRegByte22: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=011 (BP+DI)
     */
    opModRegByte23: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=100 (SI)
     */
    opModRegByte24: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=101 (DI)
     */
    opModRegByte25: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=110 (d16)
     */
    opModRegByte26: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (AH:dst)  r/m=111 (BX)
     */
    opModRegByte27: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=000 (BX+SI)
     */
    opModRegByte28: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=001 (BX+DI)
     */
    opModRegByte29: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=010 (BP+SI)
     */
    opModRegByte2A: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=011 (BP+DI)
     */
    opModRegByte2B: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=100 (SI)
     */
    opModRegByte2C: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=101 (DI)
     */
    opModRegByte2D: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=110 (d16)
     */
    opModRegByte2E: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (CH:dst)  r/m=111 (BX)
     */
    opModRegByte2F: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=000 (BX+SI)
     */
    opModRegByte30: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=001 (BX+DI)
     */
    opModRegByte31: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=010 (BP+SI)
     */
    opModRegByte32: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=011 (BP+DI)
     */
    opModRegByte33: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=100 (SI)
     */
    opModRegByte34: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=101 (DI)
     */
    opModRegByte35: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=110 (d16)
     */
    opModRegByte36: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (DH:dst)  r/m=111 (BX)
     */
    opModRegByte37: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=000 (BX+SI)
     */
    opModRegByte38: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=001 (BX+DI)
     */
    opModRegByte39: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=010 (BP+SI)
     */
    opModRegByte3A: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=011 (BP+DI)
     */
    opModRegByte3B: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=100 (SI)
     */
    opModRegByte3C: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=101 (DI)
     */
    opModRegByte3D: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=110 (d16)
     */
    opModRegByte3E: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (BH:dst)  r/m=111 (BX)
     */
    opModRegByte3F: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte40: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte41: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte42: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte43: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=100 (SI+d8)
     */
    opModRegByte44: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=101 (DI+d8)
     */
    opModRegByte45: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=110 (BP+d8)
     */
    opModRegByte46: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=111 (BX+d8)
     */
    opModRegByte47: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte48: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte49: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte4A: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte4B: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=100 (SI+d8)
     */
    opModRegByte4C: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=101 (DI+d8)
     */
    opModRegByte4D: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=110 (BP+d8)
     */
    opModRegByte4E: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=111 (BX+d8)
     */
    opModRegByte4F: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte50: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte51: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte52: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte53: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=100 (SI+d8)
     */
    opModRegByte54: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=101 (DI+d8)
     */
    opModRegByte55: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=110 (BP+d8)
     */
    opModRegByte56: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=111 (BX+d8)
     */
    opModRegByte57: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte58: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte59: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte5A: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte5B: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=100 (SI+d8)
     */
    opModRegByte5C: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=101 (DI+d8)
     */
    opModRegByte5D: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=110 (BP+d8)
     */
    opModRegByte5E: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=111 (BX+d8)
     */
    opModRegByte5F: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte60: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte61: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte62: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte63: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=100 (SI+d8)
     */
    opModRegByte64: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=101 (DI+d8)
     */
    opModRegByte65: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=110 (BP+d8)
     */
    opModRegByte66: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=111 (BX+d8)
     */
    opModRegByte67: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte68: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte69: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte6A: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte6B: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=100 (SI+d8)
     */
    opModRegByte6C: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=101 (DI+d8)
     */
    opModRegByte6D: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=110 (BP+d8)
     */
    opModRegByte6E: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=111 (BX+d8)
     */
    opModRegByte6F: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte70: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte71: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte72: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte73: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=100 (SI+d8)
     */
    opModRegByte74: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=101 (DI+d8)
     */
    opModRegByte75: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=110 (BP+d8)
     */
    opModRegByte76: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=111 (BX+d8)
     */
    opModRegByte77: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegByte78: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegByte79: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegByte7A: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegByte7B: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=100 (SI+d8)
     */
    opModRegByte7C: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=101 (DI+d8)
     */
    opModRegByte7D: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=110 (BP+d8)
     */
    opModRegByte7E: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=111 (BX+d8)
     */
    opModRegByte7F: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByte80: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByte81: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByte82: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByte83: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=100 (SI+d16)
     */
    opModRegByte84: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=101 (DI+d16)
     */
    opModRegByte85: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=110 (BP+d16)
     */
    opModRegByte86: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=111 (BX+d16)
     */
    opModRegByte87: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByte88: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByte89: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByte8A: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByte8B: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=100 (SI+d16)
     */
    opModRegByte8C: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=101 (DI+d16)
     */
    opModRegByte8D: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=110 (BP+d16)
     */
    opModRegByte8E: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=111 (BX+d16)
     */
    opModRegByte8F: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByte90: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByte91: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByte92: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByte93: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=100 (SI+d16)
     */
    opModRegByte94: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=101 (DI+d16)
     */
    opModRegByte95: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=110 (BP+d16)
     */
    opModRegByte96: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=111 (BX+d16)
     */
    opModRegByte97: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByte98: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByte99: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByte9A: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByte9B: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=100 (SI+d16)
     */
    opModRegByte9C: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=101 (DI+d16)
     */
    opModRegByte9D: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=110 (BP+d16)
     */
    opModRegByte9E: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=111 (BX+d16)
     */
    opModRegByte9F: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByteA0: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByteA1: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByteA2: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByteA3: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=100 (SI+d16)
     */
    opModRegByteA4: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=101 (DI+d16)
     */
    opModRegByteA5: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=110 (BP+d16)
     */
    opModRegByteA6: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=111 (BX+d16)
     */
    opModRegByteA7: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByteA8: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByteA9: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByteAA: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByteAB: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=100 (SI+d16)
     */
    opModRegByteAC: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=101 (DI+d16)
     */
    opModRegByteAD: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=110 (BP+d16)
     */
    opModRegByteAE: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=111 (BX+d16)
     */
    opModRegByteAF: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByteB0: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByteB1: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByteB2: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByteB3: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=100 (SI+d16)
     */
    opModRegByteB4: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=101 (DI+d16)
     */
    opModRegByteB5: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=110 (BP+d16)
     */
    opModRegByteB6: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=111 (BX+d16)
     */
    opModRegByteB7: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegByteB8: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegByteB9: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegByteBA: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegByteBB: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=100 (SI+d16)
     */
    opModRegByteBC: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=101 (DI+d16)
     */
    opModRegByteBD: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=110 (BP+d16)
     */
    opModRegByteBE: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=111 (BX+d16)
     */
    opModRegByteBF: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=000 (AL)
     */
    opModRegByteC0: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regAX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=001 (CL)
     */
    opModRegByteC1: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regCX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=010 (DL)
     */
    opModRegByteC2: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regDX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=011 (BL)
     */
    opModRegByteC3: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regBX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=100 (AH)
     */
    opModRegByteC4: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regAX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=101 (CH)
     */
    opModRegByteC5: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regCX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=110 (DH)
     */
    opModRegByteC6: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regDX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AL:dst)  r/m=111 (BH)
     */
    opModRegByteC7: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regBX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=000 (AL)
     */
    opModRegByteC8: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regAX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=001 (CL)
     */
    opModRegByteC9: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regCX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=010 (DL)
     */
    opModRegByteCA: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regDX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=011 (BL)
     */
    opModRegByteCB: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regBX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=100 (AH)
     */
    opModRegByteCC: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regAX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=101 (CH)
     */
    opModRegByteCD: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regCX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=110 (DH)
     */
    opModRegByteCE: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regDX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CL:dst)  r/m=111 (BH)
     */
    opModRegByteCF: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regBX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=000 (AL)
     */
    opModRegByteD0: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regAX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=001 (CL)
     */
    opModRegByteD1: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regCX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=010 (DL)
     */
    opModRegByteD2: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regDX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=011 (BL)
     */
    opModRegByteD3: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regBX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=100 (AH)
     */
    opModRegByteD4: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regAX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=101 (CH)
     */
    opModRegByteD5: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regCX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=110 (DH)
     */
    opModRegByteD6: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regDX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DL:dst)  r/m=111 (BH)
     */
    opModRegByteD7: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regBX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=000 (AL)
     */
    opModRegByteD8: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regAX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=001 (CL)
     */
    opModRegByteD9: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regCX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=010 (DL)
     */
    opModRegByteDA: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regDX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=011 (BL)
     */
    opModRegByteDB: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regBX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=100 (AH)
     */
    opModRegByteDC: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regAX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=101 (CH)
     */
    opModRegByteDD: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regCX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=110 (DH)
     */
    opModRegByteDE: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regDX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BL:dst)  r/m=111 (BH)
     */
    opModRegByteDF: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regBX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=000 (AL)
     */
    opModRegByteE0: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regAX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=001 (CL)
     */
    opModRegByteE1: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regCX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=010 (DL)
     */
    opModRegByteE2: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regDX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=011 (BL)
     */
    opModRegByteE3: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regBX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=100 (AH)
     */
    opModRegByteE4: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regAX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=101 (CH)
     */
    opModRegByteE5: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regCX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=110 (DH)
     */
    opModRegByteE6: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regDX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (AH:dst)  r/m=111 (BH)
     */
    opModRegByteE7: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regBX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=000 (AL)
     */
    opModRegByteE8: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regAX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=001 (CL)
     */
    opModRegByteE9: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regCX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=010 (DL)
     */
    opModRegByteEA: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regDX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=011 (BL)
     */
    opModRegByteEB: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regBX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=100 (AH)
     */
    opModRegByteEC: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regAX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=101 (CH)
     */
    opModRegByteED: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regCX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=110 (DH)
     */
    opModRegByteEE: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regDX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (CH:dst)  r/m=111 (BH)
     */
    opModRegByteEF: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regBX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=000 (AL)
     */
    opModRegByteF0: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regAX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=001 (CL)
     */
    opModRegByteF1: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regCX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=010 (DL)
     */
    opModRegByteF2: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regDX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=011 (BL)
     */
    opModRegByteF3: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regBX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=100 (AH)
     */
    opModRegByteF4: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regAX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=101 (CH)
     */
    opModRegByteF5: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regCX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=110 (DH)
     */
    opModRegByteF6: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regDX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (DH:dst)  r/m=111 (BH)
     */
    opModRegByteF7: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regBX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=000 (AL)
     */
    opModRegByteF8: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regAX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=001 (CL)
     */
    opModRegByteF9: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regCX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=010 (DL)
     */
    opModRegByteFA: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regDX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=011 (BL)
     */
    opModRegByteFB: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regBX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=100 (AH)
     */
    opModRegByteFC: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regAX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=101 (CH)
     */
    opModRegByteFD: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regCX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=110 (DH)
     */
    opModRegByteFE: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regDX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (BH:dst)  r/m=111 (BH)
     */
    opModRegByteFF: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regBX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=000 (BX+SI)
     */
    opModRegWord00: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=001 (BX+DI)
     */
    opModRegWord01: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=010 (BP+SI)
     */
    opModRegWord02: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=011 (BP+DI)
     */
    opModRegWord03: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=100 (SI)
     */
    opModRegWord04: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=101 (DI)
     */
    opModRegWord05: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=110 (d16)
     */
    opModRegWord06: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=000 (AX:dst)  r/m=111 (BX)
     */
    opModRegWord07: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=000 (BX+SI)
     */
    opModRegWord08: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=001 (BX+DI)
     */
    opModRegWord09: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=010 (BP+SI)
     */
    opModRegWord0A: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=011 (BP+DI)
     */
    opModRegWord0B: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=100 (SI)
     */
    opModRegWord0C: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=101 (DI)
     */
    opModRegWord0D: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=110 (d16)
     */
    opModRegWord0E: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=001 (CX:dst)  r/m=111 (BX)
     */
    opModRegWord0F: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=000 (BX+SI)
     */
    opModRegWord10: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=001 (BX+DI)
     */
    opModRegWord11: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=010 (BP+SI)
     */
    opModRegWord12: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=011 (BP+DI)
     */
    opModRegWord13: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=100 (SI)
     */
    opModRegWord14: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=101 (DI)
     */
    opModRegWord15: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=110 (d16)
     */
    opModRegWord16: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=010 (DX:dst)  r/m=111 (BX)
     */
    opModRegWord17: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=000 (BX+SI)
     */
    opModRegWord18: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=001 (BX+DI)
     */
    opModRegWord19: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=010 (BP+SI)
     */
    opModRegWord1A: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=011 (BP+DI)
     */
    opModRegWord1B: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=100 (SI)
     */
    opModRegWord1C: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=101 (DI)
     */
    opModRegWord1D: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=110 (d16)
     */
    opModRegWord1E: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=011 (BX:dst)  r/m=111 (BX)
     */
    opModRegWord1F: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=000 (BX+SI)
     */
    opModRegWord20: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=001 (BX+DI)
     */
    opModRegWord21: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=010 (BP+SI)
     */
    opModRegWord22: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=011 (BP+DI)
     */
    opModRegWord23: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=100 (SI)
     */
    opModRegWord24: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=101 (DI)
     */
    opModRegWord25: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=110 (d16)
     */
    opModRegWord26: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=100 (SP:dst)  r/m=111 (BX)
     */
    opModRegWord27: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=000 (BX+SI)
     */
    opModRegWord28: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=001 (BX+DI)
     */
    opModRegWord29: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=010 (BP+SI)
     */
    opModRegWord2A: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=011 (BP+DI)
     */
    opModRegWord2B: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=100 (SI)
     */
    opModRegWord2C: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=101 (DI)
     */
    opModRegWord2D: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=110 (d16)
     */
    opModRegWord2E: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=101 (BP:dst)  r/m=111 (BX)
     */
    opModRegWord2F: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=000 (BX+SI)
     */
    opModRegWord30: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=001 (BX+DI)
     */
    opModRegWord31: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=010 (BP+SI)
     */
    opModRegWord32: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=011 (BP+DI)
     */
    opModRegWord33: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=100 (SI)
     */
    opModRegWord34: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=101 (DI)
     */
    opModRegWord35: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=110 (d16)
     */
    opModRegWord36: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=110 (SI:dst)  r/m=111 (BX)
     */
    opModRegWord37: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=000 (BX+SI)
     */
    opModRegWord38: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=001 (BX+DI)
     */
    opModRegWord39: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=010 (BP+SI)
     */
    opModRegWord3A: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=011 (BP+DI)
     */
    opModRegWord3B: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=100 (SI)
     */
    opModRegWord3C: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=101 (DI)
     */
    opModRegWord3D: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=110 (d16)
     */
    opModRegWord3E: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=00 (mem:src)  reg=111 (DI:dst)  r/m=111 (BX)
     */
    opModRegWord3F: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord40: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord41: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord42: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord43: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=100 (SI+d8)
     */
    opModRegWord44: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=101 (DI+d8)
     */
    opModRegWord45: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=110 (BP+d8)
     */
    opModRegWord46: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=111 (BX+d8)
     */
    opModRegWord47: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord48: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord49: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord4A: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord4B: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=100 (SI+d8)
     */
    opModRegWord4C: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=101 (DI+d8)
     */
    opModRegWord4D: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=110 (BP+d8)
     */
    opModRegWord4E: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=111 (BX+d8)
     */
    opModRegWord4F: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord50: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord51: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord52: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord53: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=100 (SI+d8)
     */
    opModRegWord54: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=101 (DI+d8)
     */
    opModRegWord55: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=110 (BP+d8)
     */
    opModRegWord56: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=111 (BX+d8)
     */
    opModRegWord57: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord58: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord59: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord5A: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord5B: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=100 (SI+d8)
     */
    opModRegWord5C: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=101 (DI+d8)
     */
    opModRegWord5D: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=110 (BP+d8)
     */
    opModRegWord5E: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=111 (BX+d8)
     */
    opModRegWord5F: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord60: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord61: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord62: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord63: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=100 (SI+d8)
     */
    opModRegWord64: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=101 (DI+d8)
     */
    opModRegWord65: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=110 (BP+d8)
     */
    opModRegWord66: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=111 (BX+d8)
     */
    opModRegWord67: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord68: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord69: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord6A: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord6B: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=100 (SI+d8)
     */
    opModRegWord6C: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=101 (DI+d8)
     */
    opModRegWord6D: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=110 (BP+d8)
     */
    opModRegWord6E: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=111 (BX+d8)
     */
    opModRegWord6F: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord70: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord71: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord72: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord73: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=100 (SI+d8)
     */
    opModRegWord74: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=101 (DI+d8)
     */
    opModRegWord75: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=110 (BP+d8)
     */
    opModRegWord76: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=111 (BX+d8)
     */
    opModRegWord77: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=000 (BX+SI+d8)
     */
    opModRegWord78: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=001 (BX+DI+d8)
     */
    opModRegWord79: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=010 (BP+SI+d8)
     */
    opModRegWord7A: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=011 (BP+DI+d8)
     */
    opModRegWord7B: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=100 (SI+d8)
     */
    opModRegWord7C: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=101 (DI+d8)
     */
    opModRegWord7D: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=110 (BP+d8)
     */
    opModRegWord7E: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=111 (BX+d8)
     */
    opModRegWord7F: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWord80: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWord81: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWord82: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWord83: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=100 (SI+d16)
     */
    opModRegWord84: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=101 (DI+d16)
     */
    opModRegWord85: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=110 (BP+d16)
     */
    opModRegWord86: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=111 (BX+d16)
     */
    opModRegWord87: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWord88: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWord89: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWord8A: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWord8B: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=100 (SI+d16)
     */
    opModRegWord8C: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=101 (DI+d16)
     */
    opModRegWord8D: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=110 (BP+d16)
     */
    opModRegWord8E: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=111 (BX+d16)
     */
    opModRegWord8F: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWord90: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWord91: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWord92: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWord93: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=100 (SI+d16)
     */
    opModRegWord94: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=101 (DI+d16)
     */
    opModRegWord95: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=110 (BP+d16)
     */
    opModRegWord96: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=111 (BX+d16)
     */
    opModRegWord97: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWord98: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWord99: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWord9A: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWord9B: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=100 (SI+d16)
     */
    opModRegWord9C: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=101 (DI+d16)
     */
    opModRegWord9D: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=110 (BP+d16)
     */
    opModRegWord9E: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=111 (BX+d16)
     */
    opModRegWord9F: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWordA0: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWordA1: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWordA2: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWordA3: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=100 (SI+d16)
     */
    opModRegWordA4: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=101 (DI+d16)
     */
    opModRegWordA5: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=110 (BP+d16)
     */
    opModRegWordA6: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=111 (BX+d16)
     */
    opModRegWordA7: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWordA8: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWordA9: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWordAA: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWordAB: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=100 (SI+d16)
     */
    opModRegWordAC: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=101 (DI+d16)
     */
    opModRegWordAD: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=110 (BP+d16)
     */
    opModRegWordAE: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=111 (BX+d16)
     */
    opModRegWordAF: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWordB0: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWordB1: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWordB2: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWordB3: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=100 (SI+d16)
     */
    opModRegWordB4: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=101 (DI+d16)
     */
    opModRegWordB5: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=110 (BP+d16)
     */
    opModRegWordB6: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=111 (BX+d16)
     */
    opModRegWordB7: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=000 (BX+SI+d16)
     */
    opModRegWordB8: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=001 (BX+DI+d16)
     */
    opModRegWordB9: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=010 (BP+SI+d16)
     */
    opModRegWordBA: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=011 (BP+DI+d16)
     */
    opModRegWordBB: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=100 (SI+d16)
     */
    opModRegWordBC: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=101 (DI+d16)
     */
    opModRegWordBD: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=110 (BP+d16)
     */
    opModRegWordBE: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=111 (BX+d16)
     */
    opModRegWordBF: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=000 (AX)
     */
    opModRegWordC0: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=001 (CX)
     */
    opModRegWordC1: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=010 (DX)
     */
    opModRegWordC2: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=011 (BX)
     */
    opModRegWordC3: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=100 (SP)
     */
    opModRegWordC4: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=101 (BP)
     */
    opModRegWordC5: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=110 (SI)
     */
    opModRegWordC6: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=000 (AX:dst)  r/m=111 (DI)
     */
    opModRegWordC7: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=000 (AX)
     */
    opModRegWordC8: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=001 (CX)
     */
    opModRegWordC9: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=010 (DX)
     */
    opModRegWordCA: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=011 (BX)
     */
    opModRegWordCB: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=100 (SP)
     */
    opModRegWordCC: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=101 (BP)
     */
    opModRegWordCD: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=110 (SI)
     */
    opModRegWordCE: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=001 (CX:dst)  r/m=111 (DI)
     */
    opModRegWordCF: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=000 (AX)
     */
    opModRegWordD0: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=001 (CX)
     */
    opModRegWordD1: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=010 (DX)
     */
    opModRegWordD2: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=011 (BX)
     */
    opModRegWordD3: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=100 (SP)
     */
    opModRegWordD4: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=101 (BP)
     */
    opModRegWordD5: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=110 (SI)
     */
    opModRegWordD6: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=010 (DX:dst)  r/m=111 (DI)
     */
    opModRegWordD7: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=000 (AX)
     */
    opModRegWordD8: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=001 (CX)
     */
    opModRegWordD9: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=010 (DX)
     */
    opModRegWordDA: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=011 (BX)
     */
    opModRegWordDB: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=100 (SP)
     */
    opModRegWordDC: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=101 (BP)
     */
    opModRegWordDD: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=110 (SI)
     */
    opModRegWordDE: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=011 (BX:dst)  r/m=111 (DI)
     */
    opModRegWordDF: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=000 (AX)
     */
    opModRegWordE0: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=001 (CX)
     */
    opModRegWordE1: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=010 (DX)
     */
    opModRegWordE2: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=011 (BX)
     */
    opModRegWordE3: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=100 (SP)
     */
    opModRegWordE4: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=101 (BP)
     */
    opModRegWordE5: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=110 (SI)
     */
    opModRegWordE6: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=100 (SP:dst)  r/m=111 (DI)
     */
    opModRegWordE7: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=000 (AX)
     */
    opModRegWordE8: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=001 (CX)
     */
    opModRegWordE9: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=010 (DX)
     */
    opModRegWordEA: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=011 (BX)
     */
    opModRegWordEB: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=100 (SP)
     */
    opModRegWordEC: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=101 (BP)
     */
    opModRegWordED: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=110 (SI)
     */
    opModRegWordEE: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=101 (BP:dst)  r/m=111 (DI)
     */
    opModRegWordEF: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=000 (AX)
     */
    opModRegWordF0: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=001 (CX)
     */
    opModRegWordF1: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=010 (DX)
     */
    opModRegWordF2: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=011 (BX)
     */
    opModRegWordF3: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=100 (SP)
     */
    opModRegWordF4: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=101 (BP)
     */
    opModRegWordF5: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=110 (SI)
     */
    opModRegWordF6: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=110 (SI:dst)  r/m=111 (DI)
     */
    opModRegWordF7: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=000 (AX)
     */
    opModRegWordF8: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regAX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=001 (CX)
     */
    opModRegWordF9: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regCX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=010 (DX)
     */
    opModRegWordFA: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regDX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=011 (BX)
     */
    opModRegWordFB: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regBX);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=100 (SP)
     */
    opModRegWordFC: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regSP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=101 (BP)
     */
    opModRegWordFD: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regBP);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=110 (SI)
     */
    opModRegWordFE: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regSI);
    },
    /**
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     *
     * mod=11 (reg:src)  reg=111 (DI:dst)  r/m=111 (DI)
     */
    opModRegWordFF: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regDI);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     */
    opModGrpByte00: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     */
    opModGrpByte01: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     */
    opModGrpByte02: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     */
    opModGrpByte03: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=100 (SI)
     */
    opModGrpByte04: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=101 (DI)
     */
    opModGrpByte05: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=110 (d16)
     */
    opModGrpByte06: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=111 (BX)
     */
    opModGrpByte07: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     */
    opModGrpByte08: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     */
    opModGrpByte09: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     */
    opModGrpByte0A: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     */
    opModGrpByte0B: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=100 (SI)
     */
    opModGrpByte0C: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=101 (DI)
     */
    opModGrpByte0D: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=110 (d16)
     */
    opModGrpByte0E: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=111 (BX)
     */
    opModGrpByte0F: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     */
    opModGrpByte10: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     */
    opModGrpByte11: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     */
    opModGrpByte12: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     */
    opModGrpByte13: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=100 (SI)
     */
    opModGrpByte14: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=101 (DI)
     */
    opModGrpByte15: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=110 (d16)
     */
    opModGrpByte16: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=111 (BX)
     */
    opModGrpByte17: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     */
    opModGrpByte18: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     */
    opModGrpByte19: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     */
    opModGrpByte1A: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     */
    opModGrpByte1B: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=100 (SI)
     */
    opModGrpByte1C: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=101 (DI)
     */
    opModGrpByte1D: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=110 (d16)
     */
    opModGrpByte1E: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=111 (BX)
     */
    opModGrpByte1F: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     */
    opModGrpByte20: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     */
    opModGrpByte21: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     */
    opModGrpByte22: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     */
    opModGrpByte23: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=100 (SI)
     */
    opModGrpByte24: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=101 (DI)
     */
    opModGrpByte25: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=110 (d16)
     */
    opModGrpByte26: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=111 (BX)
     */
    opModGrpByte27: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     */
    opModGrpByte28: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     */
    opModGrpByte29: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     */
    opModGrpByte2A: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     */
    opModGrpByte2B: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=100 (SI)
     */
    opModGrpByte2C: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=101 (DI)
     */
    opModGrpByte2D: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=110 (d16)
     */
    opModGrpByte2E: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=111 (BX)
     */
    opModGrpByte2F: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     */
    opModGrpByte30: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     */
    opModGrpByte31: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     */
    opModGrpByte32: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     */
    opModGrpByte33: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=100 (SI)
     */
    opModGrpByte34: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=101 (DI)
     */
    opModGrpByte35: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=110 (d16)
     */
    opModGrpByte36: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=111 (BX)
     */
    opModGrpByte37: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     */
    opModGrpByte38: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     */
    opModGrpByte39: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     */
    opModGrpByte3A: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     */
    opModGrpByte3B: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=100 (SI)
     */
    opModGrpByte3C: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=101 (DI)
     */
    opModGrpByte3D: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=110 (d16)
     */
    opModGrpByte3E: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=111 (BX)
     */
    opModGrpByte3F: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte40: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte41: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte42: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte43: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     */
    opModGrpByte44: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     */
    opModGrpByte45: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     */
    opModGrpByte46: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     */
    opModGrpByte47: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte48: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte49: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte4A: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte4B: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     */
    opModGrpByte4C: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     */
    opModGrpByte4D: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     */
    opModGrpByte4E: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     */
    opModGrpByte4F: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte50: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte51: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte52: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte53: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     */
    opModGrpByte54: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     */
    opModGrpByte55: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     */
    opModGrpByte56: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     */
    opModGrpByte57: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte58: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte59: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte5A: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte5B: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     */
    opModGrpByte5C: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     */
    opModGrpByte5D: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     */
    opModGrpByte5E: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     */
    opModGrpByte5F: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte60: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte61: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte62: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte63: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     */
    opModGrpByte64: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     */
    opModGrpByte65: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     */
    opModGrpByte66: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     */
    opModGrpByte67: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte68: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte69: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte6A: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte6B: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     */
    opModGrpByte6C: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     */
    opModGrpByte6D: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     */
    opModGrpByte6E: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     */
    opModGrpByte6F: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte70: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte71: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte72: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte73: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     */
    opModGrpByte74: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     */
    opModGrpByte75: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     */
    opModGrpByte76: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     */
    opModGrpByte77: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     */
    opModGrpByte78: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     */
    opModGrpByte79: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     */
    opModGrpByte7A: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     */
    opModGrpByte7B: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     */
    opModGrpByte7C: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     */
    opModGrpByte7D: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     */
    opModGrpByte7E: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     */
    opModGrpByte7F: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     */
    opModGrpByte80: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     */
    opModGrpByte81: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     */
    opModGrpByte82: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     */
    opModGrpByte83: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     */
    opModGrpByte84: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     */
    opModGrpByte85: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     */
    opModGrpByte86: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     */
    opModGrpByte87: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     */
    opModGrpByte88: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     */
    opModGrpByte89: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     */
    opModGrpByte8A: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     */
    opModGrpByte8B: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     */
    opModGrpByte8C: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     */
    opModGrpByte8D: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     */
    opModGrpByte8E: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     */
    opModGrpByte8F: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     */
    opModGrpByte90: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     */
    opModGrpByte91: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     */
    opModGrpByte92: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     */
    opModGrpByte93: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     */
    opModGrpByte94: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     */
    opModGrpByte95: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     */
    opModGrpByte96: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     */
    opModGrpByte97: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     */
    opModGrpByte98: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     */
    opModGrpByte99: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     */
    opModGrpByte9A: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     */
    opModGrpByte9B: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     */
    opModGrpByte9C: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     */
    opModGrpByte9D: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     */
    opModGrpByte9E: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     */
    opModGrpByte9F: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     */
    opModGrpByteA0: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     */
    opModGrpByteA1: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     */
    opModGrpByteA2: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     */
    opModGrpByteA3: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     */
    opModGrpByteA4: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     */
    opModGrpByteA5: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     */
    opModGrpByteA6: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     */
    opModGrpByteA7: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     */
    opModGrpByteA8: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     */
    opModGrpByteA9: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     */
    opModGrpByteAA: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     */
    opModGrpByteAB: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     */
    opModGrpByteAC: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     */
    opModGrpByteAD: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     */
    opModGrpByteAE: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     */
    opModGrpByteAF: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     */
    opModGrpByteB0: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     */
    opModGrpByteB1: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     */
    opModGrpByteB2: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     */
    opModGrpByteB3: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     */
    opModGrpByteB4: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     */
    opModGrpByteB5: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     */
    opModGrpByteB6: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     */
    opModGrpByteB7: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     */
    opModGrpByteB8: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     */
    opModGrpByteB9: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     */
    opModGrpByteBA: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     */
    opModGrpByteBB: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     */
    opModGrpByteBC: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     */
    opModGrpByteBD: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     */
    opModGrpByteBE: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     */
    opModGrpByteBF: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=000 (AL)
     */
    opModGrpByteC0: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=001 (CL)
     */
    opModGrpByteC1: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=010 (DL)
     */
    opModGrpByteC2: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=011 (BL)
     */
    opModGrpByteC3: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=100 (AH)
     */
    opModGrpByteC4: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=101 (CH)
     */
    opModGrpByteC5: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=110 (DH)
     */
    opModGrpByteC6: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=111 (BH)
     */
    opModGrpByteC7: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=000 (AL)
     */
    opModGrpByteC8: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=001 (CL)
     */
    opModGrpByteC9: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=010 (DL)
     */
    opModGrpByteCA: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=011 (BL)
     */
    opModGrpByteCB: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=100 (AH)
     */
    opModGrpByteCC: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=101 (CH)
     */
    opModGrpByteCD: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=110 (DH)
     */
    opModGrpByteCE: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=111 (BH)
     */
    opModGrpByteCF: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=000 (AL)
     */
    opModGrpByteD0: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=001 (CL)
     */
    opModGrpByteD1: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=010 (DL)
     */
    opModGrpByteD2: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=011 (BL)
     */
    opModGrpByteD3: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=100 (AH)
     */
    opModGrpByteD4: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=101 (CH)
     */
    opModGrpByteD5: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=110 (DH)
     */
    opModGrpByteD6: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=111 (BH)
     */
    opModGrpByteD7: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=000 (AL)
     */
    opModGrpByteD8: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=001 (CL)
     */
    opModGrpByteD9: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=010 (DL)
     */
    opModGrpByteDA: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=011 (BL)
     */
    opModGrpByteDB: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=100 (AH)
     */
    opModGrpByteDC: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=101 (CH)
     */
    opModGrpByteDD: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=110 (DH)
     */
    opModGrpByteDE: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=111 (BH)
     */
    opModGrpByteDF: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=000 (AL)
     */
    opModGrpByteE0: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=001 (CL)
     */
    opModGrpByteE1: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=010 (DL)
     */
    opModGrpByteE2: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=011 (BL)
     */
    opModGrpByteE3: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=100 (AH)
     */
    opModGrpByteE4: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=101 (CH)
     */
    opModGrpByteE5: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=110 (DH)
     */
    opModGrpByteE6: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=111 (BH)
     */
    opModGrpByteE7: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=000 (AL)
     */
    opModGrpByteE8: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=001 (CL)
     */
    opModGrpByteE9: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=010 (DL)
     */
    opModGrpByteEA: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=011 (BL)
     */
    opModGrpByteEB: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=100 (AH)
     */
    opModGrpByteEC: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=101 (CH)
     */
    opModGrpByteED: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=110 (DH)
     */
    opModGrpByteEE: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=111 (BH)
     */
    opModGrpByteEF: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=000 (AL)
     */
    opModGrpByteF0: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=001 (CL)
     */
    opModGrpByteF1: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=010 (DL)
     */
    opModGrpByteF2: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=011 (BL)
     */
    opModGrpByteF3: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=100 (AH)
     */
    opModGrpByteF4: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=101 (CH)
     */
    opModGrpByteF5: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=110 (DH)
     */
    opModGrpByteF6: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=111 (BH)
     */
    opModGrpByteF7: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=000 (AL)
     */
    opModGrpByteF8: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=001 (CL)
     */
    opModGrpByteF9: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=010 (DL)
     */
    opModGrpByteFA: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=011 (BL)
     */
    opModGrpByteFB: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=100 (AH)
     */
    opModGrpByteFC: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=101 (CH)
     */
    opModGrpByteFD: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=110 (DH)
     */
    opModGrpByteFE: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=111 (BH)
     */
    opModGrpByteFF: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     */
    opModGrpWord00: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     */
    opModGrpWord01: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     */
    opModGrpWord02: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     */
    opModGrpWord03: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=100 (SI)
     */
    opModGrpWord04: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=101 (DI)
     */
    opModGrpWord05: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=110 (d16)
     */
    opModGrpWord06: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=111 (BX)
     */
    opModGrpWord07: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     */
    opModGrpWord08: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     */
    opModGrpWord09: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     */
    opModGrpWord0A: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     */
    opModGrpWord0B: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=100 (SI)
     */
    opModGrpWord0C: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=101 (DI)
     */
    opModGrpWord0D: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=110 (d16)
     */
    opModGrpWord0E: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=111 (BX)
     */
    opModGrpWord0F: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     */
    opModGrpWord10: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     */
    opModGrpWord11: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     */
    opModGrpWord12: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     */
    opModGrpWord13: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=100 (SI)
     */
    opModGrpWord14: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=101 (DI)
     */
    opModGrpWord15: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=110 (d16)
     */
    opModGrpWord16: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=111 (BX)
     */
    opModGrpWord17: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     */
    opModGrpWord18: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     */
    opModGrpWord19: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     */
    opModGrpWord1A: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     */
    opModGrpWord1B: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=100 (SI)
     */
    opModGrpWord1C: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=101 (DI)
     */
    opModGrpWord1D: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=110 (d16)
     */
    opModGrpWord1E: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=111 (BX)
     */
    opModGrpWord1F: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     */
    opModGrpWord20: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     */
    opModGrpWord21: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     */
    opModGrpWord22: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     */
    opModGrpWord23: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=100 (SI)
     */
    opModGrpWord24: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=101 (DI)
     */
    opModGrpWord25: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=110 (d16)
     */
    opModGrpWord26: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=111 (BX)
     */
    opModGrpWord27: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     */
    opModGrpWord28: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     */
    opModGrpWord29: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     */
    opModGrpWord2A: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     */
    opModGrpWord2B: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=100 (SI)
     */
    opModGrpWord2C: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=101 (DI)
     */
    opModGrpWord2D: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=110 (d16)
     */
    opModGrpWord2E: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=111 (BX)
     */
    opModGrpWord2F: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     */
    opModGrpWord30: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     */
    opModGrpWord31: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     */
    opModGrpWord32: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     */
    opModGrpWord33: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=100 (SI)
     */
    opModGrpWord34: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=101 (DI)
     */
    opModGrpWord35: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=110 (d16)
     */
    opModGrpWord36: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=111 (BX)
     */
    opModGrpWord37: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     */
    opModGrpWord38: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     */
    opModGrpWord39: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     */
    opModGrpWord3A: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     */
    opModGrpWord3B: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndex;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=100 (SI)
     */
    opModGrpWord3C: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=101 (DI)
     */
    opModGrpWord3D: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=110 (d16)
     */
    opModGrpWord3E: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=111 (BX)
     */
    opModGrpWord3F: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBase;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord40: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord41: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord42: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord43: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     */
    opModGrpWord44: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     */
    opModGrpWord45: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     */
    opModGrpWord46: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     */
    opModGrpWord47: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord48: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord49: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord4A: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord4B: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     */
    opModGrpWord4C: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     */
    opModGrpWord4D: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     */
    opModGrpWord4E: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     */
    opModGrpWord4F: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord50: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord51: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord52: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord53: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     */
    opModGrpWord54: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     */
    opModGrpWord55: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     */
    opModGrpWord56: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     */
    opModGrpWord57: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord58: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord59: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord5A: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord5B: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     */
    opModGrpWord5C: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     */
    opModGrpWord5D: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     */
    opModGrpWord5E: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     */
    opModGrpWord5F: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord60: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord61: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord62: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord63: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     */
    opModGrpWord64: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     */
    opModGrpWord65: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     */
    opModGrpWord66: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     */
    opModGrpWord67: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord68: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord69: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord6A: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord6B: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     */
    opModGrpWord6C: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     */
    opModGrpWord6D: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     */
    opModGrpWord6E: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     */
    opModGrpWord6F: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord70: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord71: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord72: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord73: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     */
    opModGrpWord74: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     */
    opModGrpWord75: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     */
    opModGrpWord76: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     */
    opModGrpWord77: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     */
    opModGrpWord78: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     */
    opModGrpWord79: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     */
    opModGrpWord7A: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     */
    opModGrpWord7B: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     */
    opModGrpWord7C: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     */
    opModGrpWord7D: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     */
    opModGrpWord7E: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     */
    opModGrpWord7F: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     */
    opModGrpWord80: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     */
    opModGrpWord81: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     */
    opModGrpWord82: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     */
    opModGrpWord83: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     */
    opModGrpWord84: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     */
    opModGrpWord85: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     */
    opModGrpWord86: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     */
    opModGrpWord87: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     */
    opModGrpWord88: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     */
    opModGrpWord89: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     */
    opModGrpWord8A: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     */
    opModGrpWord8B: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     */
    opModGrpWord8C: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     */
    opModGrpWord8D: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     */
    opModGrpWord8E: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     */
    opModGrpWord8F: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     */
    opModGrpWord90: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     */
    opModGrpWord91: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     */
    opModGrpWord92: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     */
    opModGrpWord93: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     */
    opModGrpWord94: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     */
    opModGrpWord95: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     */
    opModGrpWord96: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     */
    opModGrpWord97: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     */
    opModGrpWord98: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     */
    opModGrpWord99: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     */
    opModGrpWord9A: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     */
    opModGrpWord9B: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     */
    opModGrpWord9C: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     */
    opModGrpWord9D: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     */
    opModGrpWord9E: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     */
    opModGrpWord9F: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     */
    opModGrpWordA0: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     */
    opModGrpWordA1: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     */
    opModGrpWordA2: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     */
    opModGrpWordA3: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     */
    opModGrpWordA4: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     */
    opModGrpWordA5: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     */
    opModGrpWordA6: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     */
    opModGrpWordA7: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     */
    opModGrpWordA8: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     */
    opModGrpWordA9: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     */
    opModGrpWordAA: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     */
    opModGrpWordAB: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     */
    opModGrpWordAC: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     */
    opModGrpWordAD: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     */
    opModGrpWordAE: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     */
    opModGrpWordAF: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     */
    opModGrpWordB0: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     */
    opModGrpWordB1: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     */
    opModGrpWordB2: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     */
    opModGrpWordB3: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     */
    opModGrpWordB4: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     */
    opModGrpWordB5: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     */
    opModGrpWordB6: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     */
    opModGrpWordB7: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     */
    opModGrpWordB8: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     */
    opModGrpWordB9: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     */
    opModGrpWordBA: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDispExtra;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     */
    opModGrpWordBB: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseIndexDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     */
    opModGrpWordBC: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     */
    opModGrpWordBD: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     */
    opModGrpWordBE: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     */
    opModGrpWordBF: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.nEACyclesBaseDisp;
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=000 (AX)
     */
    opModGrpWordC0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[0].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=001 (CX)
     */
    opModGrpWordC1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[0].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=010 (DX)
     */
    opModGrpWordC2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[0].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=011 (BX)
     */
    opModGrpWordC3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[0].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=100 (SP)
     */
    opModGrpWordC4: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[0].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=101 (BP)
     */
    opModGrpWordC5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[0].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=110 (SI)
     */
    opModGrpWordC6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[0].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=111 (DI)
     */
    opModGrpWordC7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[0].call(this, this.regDI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=000 (AX)
     */
    opModGrpWordC8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[1].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=001 (CX)
     */
    opModGrpWordC9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[1].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=010 (DX)
     */
    opModGrpWordCA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[1].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=011 (BX)
     */
    opModGrpWordCB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[1].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=100 (SP)
     */
    opModGrpWordCC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[1].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=101 (BP)
     */
    opModGrpWordCD: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[1].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=110 (SI)
     */
    opModGrpWordCE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[1].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=111 (DI)
     */
    opModGrpWordCF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[1].call(this, this.regDI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=000 (AX)
     */
    opModGrpWordD0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[2].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=001 (CX)
     */
    opModGrpWordD1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[2].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=010 (DX)
     */
    opModGrpWordD2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[2].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=011 (BX)
     */
    opModGrpWordD3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[2].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=100 (SP)
     */
    opModGrpWordD4: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[2].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=101 (BP)
     */
    opModGrpWordD5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[2].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=110 (SI)
     */
    opModGrpWordD6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[2].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=111 (DI)
     */
    opModGrpWordD7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[2].call(this, this.regDI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=000 (AX)
     */
    opModGrpWordD8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[3].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=001 (CX)
     */
    opModGrpWordD9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[3].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=010 (DX)
     */
    opModGrpWordDA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[3].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=011 (BX)
     */
    opModGrpWordDB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[3].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=100 (SP)
     */
    opModGrpWordDC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[3].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=101 (BP)
     */
    opModGrpWordDD: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[3].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=110 (SI)
     */
    opModGrpWordDE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[3].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=111 (DI)
     */
    opModGrpWordDF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[3].call(this, this.regDI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=000 (AX)
     */
    opModGrpWordE0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[4].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=001 (CX)
     */
    opModGrpWordE1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[4].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=010 (DX)
     */
    opModGrpWordE2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[4].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=011 (BX)
     */
    opModGrpWordE3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[4].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=100 (SP)
     */
    opModGrpWordE4: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[4].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=101 (BP)
     */
    opModGrpWordE5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[4].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=110 (SI)
     */
    opModGrpWordE6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[4].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=111 (DI)
     */
    opModGrpWordE7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[4].call(this, this.regDI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=000 (AX)
     */
    opModGrpWordE8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[5].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=001 (CX)
     */
    opModGrpWordE9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[5].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=010 (DX)
     */
    opModGrpWordEA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[5].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=011 (BX)
     */
    opModGrpWordEB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[5].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=100 (SP)
     */
    opModGrpWordEC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[5].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=101 (BP)
     */
    opModGrpWordED: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[5].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=110 (SI)
     */
    opModGrpWordEE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[5].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=111 (DI)
     */
    opModGrpWordEF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[5].call(this, this.regDI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=000 (AX)
     */
    opModGrpWordF0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[6].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=001 (CX)
     */
    opModGrpWordF1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[6].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=010 (DX)
     */
    opModGrpWordF2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[6].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=011 (BX)
     */
    opModGrpWordF3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[6].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=100 (SP)
     */
    opModGrpWordF4: function(afnGrp, fnSrc) {
        this.opFlags |= X86.OPFLAG.PUSHSP;  // we limit this hack to the only ModRM function that calls opGrpPUSHw() with SP
        this.regSP = afnGrp[6].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=101 (BP)
     */
    opModGrpWordF5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[6].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=110 (SI)
     */
    opModGrpWordF6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[6].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=111 (DI)
     */
    opModGrpWordF7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[6].call(this, this.regDI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=000 (AX)
     */
    opModGrpWordF8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[7].call(this, this.regAX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=001 (CX)
     */
    opModGrpWordF9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[7].call(this, this.regCX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=010 (DX)
     */
    opModGrpWordFA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[7].call(this, this.regDX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=011 (BX)
     */
    opModGrpWordFB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[7].call(this, this.regBX, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=100 (SP)
     */
    opModGrpWordFC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[7].call(this, this.regSP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=101 (BP)
     */
    opModGrpWordFD: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[7].call(this, this.regBP, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=110 (SI)
     */
    opModGrpWordFE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[7].call(this, this.regSI, fnSrc.call(this));
    },
    /**
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     *
     * mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=111 (DI)
     */
    opModGrpWordFF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[7].call(this, this.regDI, fnSrc.call(this));
    }
};

X86Mods.aOpModsMemByte = [
    X86Mods.opModMemByte00,     X86Mods.opModMemByte01,     X86Mods.opModMemByte02,     X86Mods.opModMemByte03,
    X86Mods.opModMemByte04,     X86Mods.opModMemByte05,     X86Mods.opModMemByte06,     X86Mods.opModMemByte07,
    X86Mods.opModMemByte08,     X86Mods.opModMemByte09,     X86Mods.opModMemByte0A,     X86Mods.opModMemByte0B,
    X86Mods.opModMemByte0C,     X86Mods.opModMemByte0D,     X86Mods.opModMemByte0E,     X86Mods.opModMemByte0F,
    X86Mods.opModMemByte10,     X86Mods.opModMemByte11,     X86Mods.opModMemByte12,     X86Mods.opModMemByte13,
    X86Mods.opModMemByte14,     X86Mods.opModMemByte15,     X86Mods.opModMemByte16,     X86Mods.opModMemByte17,
    X86Mods.opModMemByte18,     X86Mods.opModMemByte19,     X86Mods.opModMemByte1A,     X86Mods.opModMemByte1B,
    X86Mods.opModMemByte1C,     X86Mods.opModMemByte1D,     X86Mods.opModMemByte1E,     X86Mods.opModMemByte1F,
    X86Mods.opModMemByte20,     X86Mods.opModMemByte21,     X86Mods.opModMemByte22,     X86Mods.opModMemByte23,
    X86Mods.opModMemByte24,     X86Mods.opModMemByte25,     X86Mods.opModMemByte26,     X86Mods.opModMemByte27,
    X86Mods.opModMemByte28,     X86Mods.opModMemByte29,     X86Mods.opModMemByte2A,     X86Mods.opModMemByte2B,
    X86Mods.opModMemByte2C,     X86Mods.opModMemByte2D,     X86Mods.opModMemByte2E,     X86Mods.opModMemByte2F,
    X86Mods.opModMemByte30,     X86Mods.opModMemByte31,     X86Mods.opModMemByte32,     X86Mods.opModMemByte33,
    X86Mods.opModMemByte34,     X86Mods.opModMemByte35,     X86Mods.opModMemByte36,     X86Mods.opModMemByte37,
    X86Mods.opModMemByte38,     X86Mods.opModMemByte39,     X86Mods.opModMemByte3A,     X86Mods.opModMemByte3B,
    X86Mods.opModMemByte3C,     X86Mods.opModMemByte3D,     X86Mods.opModMemByte3E,     X86Mods.opModMemByte3F,
    X86Mods.opModMemByte40,     X86Mods.opModMemByte41,     X86Mods.opModMemByte42,     X86Mods.opModMemByte43,
    X86Mods.opModMemByte44,     X86Mods.opModMemByte45,     X86Mods.opModMemByte46,     X86Mods.opModMemByte47,
    X86Mods.opModMemByte48,     X86Mods.opModMemByte49,     X86Mods.opModMemByte4A,     X86Mods.opModMemByte4B,
    X86Mods.opModMemByte4C,     X86Mods.opModMemByte4D,     X86Mods.opModMemByte4E,     X86Mods.opModMemByte4F,
    X86Mods.opModMemByte50,     X86Mods.opModMemByte51,     X86Mods.opModMemByte52,     X86Mods.opModMemByte53,
    X86Mods.opModMemByte54,     X86Mods.opModMemByte55,     X86Mods.opModMemByte56,     X86Mods.opModMemByte57,
    X86Mods.opModMemByte58,     X86Mods.opModMemByte59,     X86Mods.opModMemByte5A,     X86Mods.opModMemByte5B,
    X86Mods.opModMemByte5C,     X86Mods.opModMemByte5D,     X86Mods.opModMemByte5E,     X86Mods.opModMemByte5F,
    X86Mods.opModMemByte60,     X86Mods.opModMemByte61,     X86Mods.opModMemByte62,     X86Mods.opModMemByte63,
    X86Mods.opModMemByte64,     X86Mods.opModMemByte65,     X86Mods.opModMemByte66,     X86Mods.opModMemByte67,
    X86Mods.opModMemByte68,     X86Mods.opModMemByte69,     X86Mods.opModMemByte6A,     X86Mods.opModMemByte6B,
    X86Mods.opModMemByte6C,     X86Mods.opModMemByte6D,     X86Mods.opModMemByte6E,     X86Mods.opModMemByte6F,
    X86Mods.opModMemByte70,     X86Mods.opModMemByte71,     X86Mods.opModMemByte72,     X86Mods.opModMemByte73,
    X86Mods.opModMemByte74,     X86Mods.opModMemByte75,     X86Mods.opModMemByte76,     X86Mods.opModMemByte77,
    X86Mods.opModMemByte78,     X86Mods.opModMemByte79,     X86Mods.opModMemByte7A,     X86Mods.opModMemByte7B,
    X86Mods.opModMemByte7C,     X86Mods.opModMemByte7D,     X86Mods.opModMemByte7E,     X86Mods.opModMemByte7F,
    X86Mods.opModMemByte80,     X86Mods.opModMemByte81,     X86Mods.opModMemByte82,     X86Mods.opModMemByte83,
    X86Mods.opModMemByte84,     X86Mods.opModMemByte85,     X86Mods.opModMemByte86,     X86Mods.opModMemByte87,
    X86Mods.opModMemByte88,     X86Mods.opModMemByte89,     X86Mods.opModMemByte8A,     X86Mods.opModMemByte8B,
    X86Mods.opModMemByte8C,     X86Mods.opModMemByte8D,     X86Mods.opModMemByte8E,     X86Mods.opModMemByte8F,
    X86Mods.opModMemByte90,     X86Mods.opModMemByte91,     X86Mods.opModMemByte92,     X86Mods.opModMemByte93,
    X86Mods.opModMemByte94,     X86Mods.opModMemByte95,     X86Mods.opModMemByte96,     X86Mods.opModMemByte97,
    X86Mods.opModMemByte98,     X86Mods.opModMemByte99,     X86Mods.opModMemByte9A,     X86Mods.opModMemByte9B,
    X86Mods.opModMemByte9C,     X86Mods.opModMemByte9D,     X86Mods.opModMemByte9E,     X86Mods.opModMemByte9F,
    X86Mods.opModMemByteA0,     X86Mods.opModMemByteA1,     X86Mods.opModMemByteA2,     X86Mods.opModMemByteA3,
    X86Mods.opModMemByteA4,     X86Mods.opModMemByteA5,     X86Mods.opModMemByteA6,     X86Mods.opModMemByteA7,
    X86Mods.opModMemByteA8,     X86Mods.opModMemByteA9,     X86Mods.opModMemByteAA,     X86Mods.opModMemByteAB,
    X86Mods.opModMemByteAC,     X86Mods.opModMemByteAD,     X86Mods.opModMemByteAE,     X86Mods.opModMemByteAF,
    X86Mods.opModMemByteB0,     X86Mods.opModMemByteB1,     X86Mods.opModMemByteB2,     X86Mods.opModMemByteB3,
    X86Mods.opModMemByteB4,     X86Mods.opModMemByteB5,     X86Mods.opModMemByteB6,     X86Mods.opModMemByteB7,
    X86Mods.opModMemByteB8,     X86Mods.opModMemByteB9,     X86Mods.opModMemByteBA,     X86Mods.opModMemByteBB,
    X86Mods.opModMemByteBC,     X86Mods.opModMemByteBD,     X86Mods.opModMemByteBE,     X86Mods.opModMemByteBF,
    X86Mods.opModRegByteC0,     X86Mods.opModRegByteC8,     X86Mods.opModRegByteD0,     X86Mods.opModRegByteD8,
    X86Mods.opModRegByteE0,     X86Mods.opModRegByteE8,     X86Mods.opModRegByteF0,     X86Mods.opModRegByteF8,
    X86Mods.opModRegByteC1,     X86Mods.opModRegByteC9,     X86Mods.opModRegByteD1,     X86Mods.opModRegByteD9,
    X86Mods.opModRegByteE1,     X86Mods.opModRegByteE9,     X86Mods.opModRegByteF1,     X86Mods.opModRegByteF9,
    X86Mods.opModRegByteC2,     X86Mods.opModRegByteCA,     X86Mods.opModRegByteD2,     X86Mods.opModRegByteDA,
    X86Mods.opModRegByteE2,     X86Mods.opModRegByteEA,     X86Mods.opModRegByteF2,     X86Mods.opModRegByteFA,
    X86Mods.opModRegByteC3,     X86Mods.opModRegByteCB,     X86Mods.opModRegByteD3,     X86Mods.opModRegByteDB,
    X86Mods.opModRegByteE3,     X86Mods.opModRegByteEB,     X86Mods.opModRegByteF3,     X86Mods.opModRegByteFB,
    X86Mods.opModRegByteC4,     X86Mods.opModRegByteCC,     X86Mods.opModRegByteD4,     X86Mods.opModRegByteDC,
    X86Mods.opModRegByteE4,     X86Mods.opModRegByteEC,     X86Mods.opModRegByteF4,     X86Mods.opModRegByteFC,
    X86Mods.opModRegByteC5,     X86Mods.opModRegByteCD,     X86Mods.opModRegByteD5,     X86Mods.opModRegByteDD,
    X86Mods.opModRegByteE5,     X86Mods.opModRegByteED,     X86Mods.opModRegByteF5,     X86Mods.opModRegByteFD,
    X86Mods.opModRegByteC6,     X86Mods.opModRegByteCE,     X86Mods.opModRegByteD6,     X86Mods.opModRegByteDE,
    X86Mods.opModRegByteE6,     X86Mods.opModRegByteEE,     X86Mods.opModRegByteF6,     X86Mods.opModRegByteFE,
    X86Mods.opModRegByteC7,     X86Mods.opModRegByteCF,     X86Mods.opModRegByteD7,     X86Mods.opModRegByteDF,
    X86Mods.opModRegByteE7,     X86Mods.opModRegByteEF,     X86Mods.opModRegByteF7,     X86Mods.opModRegByteFF
];

X86Mods.aOpModsMemWord = [
    X86Mods.opModMemWord00,     X86Mods.opModMemWord01,     X86Mods.opModMemWord02,     X86Mods.opModMemWord03,
    X86Mods.opModMemWord04,     X86Mods.opModMemWord05,     X86Mods.opModMemWord06,     X86Mods.opModMemWord07,
    X86Mods.opModMemWord08,     X86Mods.opModMemWord09,     X86Mods.opModMemWord0A,     X86Mods.opModMemWord0B,
    X86Mods.opModMemWord0C,     X86Mods.opModMemWord0D,     X86Mods.opModMemWord0E,     X86Mods.opModMemWord0F,
    X86Mods.opModMemWord10,     X86Mods.opModMemWord11,     X86Mods.opModMemWord12,     X86Mods.opModMemWord13,
    X86Mods.opModMemWord14,     X86Mods.opModMemWord15,     X86Mods.opModMemWord16,     X86Mods.opModMemWord17,
    X86Mods.opModMemWord18,     X86Mods.opModMemWord19,     X86Mods.opModMemWord1A,     X86Mods.opModMemWord1B,
    X86Mods.opModMemWord1C,     X86Mods.opModMemWord1D,     X86Mods.opModMemWord1E,     X86Mods.opModMemWord1F,
    X86Mods.opModMemWord20,     X86Mods.opModMemWord21,     X86Mods.opModMemWord22,     X86Mods.opModMemWord23,
    X86Mods.opModMemWord24,     X86Mods.opModMemWord25,     X86Mods.opModMemWord26,     X86Mods.opModMemWord27,
    X86Mods.opModMemWord28,     X86Mods.opModMemWord29,     X86Mods.opModMemWord2A,     X86Mods.opModMemWord2B,
    X86Mods.opModMemWord2C,     X86Mods.opModMemWord2D,     X86Mods.opModMemWord2E,     X86Mods.opModMemWord2F,
    X86Mods.opModMemWord30,     X86Mods.opModMemWord31,     X86Mods.opModMemWord32,     X86Mods.opModMemWord33,
    X86Mods.opModMemWord34,     X86Mods.opModMemWord35,     X86Mods.opModMemWord36,     X86Mods.opModMemWord37,
    X86Mods.opModMemWord38,     X86Mods.opModMemWord39,     X86Mods.opModMemWord3A,     X86Mods.opModMemWord3B,
    X86Mods.opModMemWord3C,     X86Mods.opModMemWord3D,     X86Mods.opModMemWord3E,     X86Mods.opModMemWord3F,
    X86Mods.opModMemWord40,     X86Mods.opModMemWord41,     X86Mods.opModMemWord42,     X86Mods.opModMemWord43,
    X86Mods.opModMemWord44,     X86Mods.opModMemWord45,     X86Mods.opModMemWord46,     X86Mods.opModMemWord47,
    X86Mods.opModMemWord48,     X86Mods.opModMemWord49,     X86Mods.opModMemWord4A,     X86Mods.opModMemWord4B,
    X86Mods.opModMemWord4C,     X86Mods.opModMemWord4D,     X86Mods.opModMemWord4E,     X86Mods.opModMemWord4F,
    X86Mods.opModMemWord50,     X86Mods.opModMemWord51,     X86Mods.opModMemWord52,     X86Mods.opModMemWord53,
    X86Mods.opModMemWord54,     X86Mods.opModMemWord55,     X86Mods.opModMemWord56,     X86Mods.opModMemWord57,
    X86Mods.opModMemWord58,     X86Mods.opModMemWord59,     X86Mods.opModMemWord5A,     X86Mods.opModMemWord5B,
    X86Mods.opModMemWord5C,     X86Mods.opModMemWord5D,     X86Mods.opModMemWord5E,     X86Mods.opModMemWord5F,
    X86Mods.opModMemWord60,     X86Mods.opModMemWord61,     X86Mods.opModMemWord62,     X86Mods.opModMemWord63,
    X86Mods.opModMemWord64,     X86Mods.opModMemWord65,     X86Mods.opModMemWord66,     X86Mods.opModMemWord67,
    X86Mods.opModMemWord68,     X86Mods.opModMemWord69,     X86Mods.opModMemWord6A,     X86Mods.opModMemWord6B,
    X86Mods.opModMemWord6C,     X86Mods.opModMemWord6D,     X86Mods.opModMemWord6E,     X86Mods.opModMemWord6F,
    X86Mods.opModMemWord70,     X86Mods.opModMemWord71,     X86Mods.opModMemWord72,     X86Mods.opModMemWord73,
    X86Mods.opModMemWord74,     X86Mods.opModMemWord75,     X86Mods.opModMemWord76,     X86Mods.opModMemWord77,
    X86Mods.opModMemWord78,     X86Mods.opModMemWord79,     X86Mods.opModMemWord7A,     X86Mods.opModMemWord7B,
    X86Mods.opModMemWord7C,     X86Mods.opModMemWord7D,     X86Mods.opModMemWord7E,     X86Mods.opModMemWord7F,
    X86Mods.opModMemWord80,     X86Mods.opModMemWord81,     X86Mods.opModMemWord82,     X86Mods.opModMemWord83,
    X86Mods.opModMemWord84,     X86Mods.opModMemWord85,     X86Mods.opModMemWord86,     X86Mods.opModMemWord87,
    X86Mods.opModMemWord88,     X86Mods.opModMemWord89,     X86Mods.opModMemWord8A,     X86Mods.opModMemWord8B,
    X86Mods.opModMemWord8C,     X86Mods.opModMemWord8D,     X86Mods.opModMemWord8E,     X86Mods.opModMemWord8F,
    X86Mods.opModMemWord90,     X86Mods.opModMemWord91,     X86Mods.opModMemWord92,     X86Mods.opModMemWord93,
    X86Mods.opModMemWord94,     X86Mods.opModMemWord95,     X86Mods.opModMemWord96,     X86Mods.opModMemWord97,
    X86Mods.opModMemWord98,     X86Mods.opModMemWord99,     X86Mods.opModMemWord9A,     X86Mods.opModMemWord9B,
    X86Mods.opModMemWord9C,     X86Mods.opModMemWord9D,     X86Mods.opModMemWord9E,     X86Mods.opModMemWord9F,
    X86Mods.opModMemWordA0,     X86Mods.opModMemWordA1,     X86Mods.opModMemWordA2,     X86Mods.opModMemWordA3,
    X86Mods.opModMemWordA4,     X86Mods.opModMemWordA5,     X86Mods.opModMemWordA6,     X86Mods.opModMemWordA7,
    X86Mods.opModMemWordA8,     X86Mods.opModMemWordA9,     X86Mods.opModMemWordAA,     X86Mods.opModMemWordAB,
    X86Mods.opModMemWordAC,     X86Mods.opModMemWordAD,     X86Mods.opModMemWordAE,     X86Mods.opModMemWordAF,
    X86Mods.opModMemWordB0,     X86Mods.opModMemWordB1,     X86Mods.opModMemWordB2,     X86Mods.opModMemWordB3,
    X86Mods.opModMemWordB4,     X86Mods.opModMemWordB5,     X86Mods.opModMemWordB6,     X86Mods.opModMemWordB7,
    X86Mods.opModMemWordB8,     X86Mods.opModMemWordB9,     X86Mods.opModMemWordBA,     X86Mods.opModMemWordBB,
    X86Mods.opModMemWordBC,     X86Mods.opModMemWordBD,     X86Mods.opModMemWordBE,     X86Mods.opModMemWordBF,
    X86Mods.opModRegWordC0,     X86Mods.opModRegWordC8,     X86Mods.opModRegWordD0,     X86Mods.opModRegWordD8,
    X86Mods.opModRegWordE0,     X86Mods.opModRegWordE8,     X86Mods.opModRegWordF0,     X86Mods.opModRegWordF8,
    X86Mods.opModRegWordC1,     X86Mods.opModRegWordC9,     X86Mods.opModRegWordD1,     X86Mods.opModRegWordD9,
    X86Mods.opModRegWordE1,     X86Mods.opModRegWordE9,     X86Mods.opModRegWordF1,     X86Mods.opModRegWordF9,
    X86Mods.opModRegWordC2,     X86Mods.opModRegWordCA,     X86Mods.opModRegWordD2,     X86Mods.opModRegWordDA,
    X86Mods.opModRegWordE2,     X86Mods.opModRegWordEA,     X86Mods.opModRegWordF2,     X86Mods.opModRegWordFA,
    X86Mods.opModRegWordC3,     X86Mods.opModRegWordCB,     X86Mods.opModRegWordD3,     X86Mods.opModRegWordDB,
    X86Mods.opModRegWordE3,     X86Mods.opModRegWordEB,     X86Mods.opModRegWordF3,     X86Mods.opModRegWordFB,
    X86Mods.opModRegWordC4,     X86Mods.opModRegWordCC,     X86Mods.opModRegWordD4,     X86Mods.opModRegWordDC,
    X86Mods.opModRegWordE4,     X86Mods.opModRegWordEC,     X86Mods.opModRegWordF4,     X86Mods.opModRegWordFC,
    X86Mods.opModRegWordC5,     X86Mods.opModRegWordCD,     X86Mods.opModRegWordD5,     X86Mods.opModRegWordDD,
    X86Mods.opModRegWordE5,     X86Mods.opModRegWordED,     X86Mods.opModRegWordF5,     X86Mods.opModRegWordFD,
    X86Mods.opModRegWordC6,     X86Mods.opModRegWordCE,     X86Mods.opModRegWordD6,     X86Mods.opModRegWordDE,
    X86Mods.opModRegWordE6,     X86Mods.opModRegWordEE,     X86Mods.opModRegWordF6,     X86Mods.opModRegWordFE,
    X86Mods.opModRegWordC7,     X86Mods.opModRegWordCF,     X86Mods.opModRegWordD7,     X86Mods.opModRegWordDF,
    X86Mods.opModRegWordE7,     X86Mods.opModRegWordEF,     X86Mods.opModRegWordF7,     X86Mods.opModRegWordFF
];

X86Mods.aOpModsRegByte = [
    X86Mods.opModRegByte00,     X86Mods.opModRegByte01,     X86Mods.opModRegByte02,     X86Mods.opModRegByte03,
    X86Mods.opModRegByte04,     X86Mods.opModRegByte05,     X86Mods.opModRegByte06,     X86Mods.opModRegByte07,
    X86Mods.opModRegByte08,     X86Mods.opModRegByte09,     X86Mods.opModRegByte0A,     X86Mods.opModRegByte0B,
    X86Mods.opModRegByte0C,     X86Mods.opModRegByte0D,     X86Mods.opModRegByte0E,     X86Mods.opModRegByte0F,
    X86Mods.opModRegByte10,     X86Mods.opModRegByte11,     X86Mods.opModRegByte12,     X86Mods.opModRegByte13,
    X86Mods.opModRegByte14,     X86Mods.opModRegByte15,     X86Mods.opModRegByte16,     X86Mods.opModRegByte17,
    X86Mods.opModRegByte18,     X86Mods.opModRegByte19,     X86Mods.opModRegByte1A,     X86Mods.opModRegByte1B,
    X86Mods.opModRegByte1C,     X86Mods.opModRegByte1D,     X86Mods.opModRegByte1E,     X86Mods.opModRegByte1F,
    X86Mods.opModRegByte20,     X86Mods.opModRegByte21,     X86Mods.opModRegByte22,     X86Mods.opModRegByte23,
    X86Mods.opModRegByte24,     X86Mods.opModRegByte25,     X86Mods.opModRegByte26,     X86Mods.opModRegByte27,
    X86Mods.opModRegByte28,     X86Mods.opModRegByte29,     X86Mods.opModRegByte2A,     X86Mods.opModRegByte2B,
    X86Mods.opModRegByte2C,     X86Mods.opModRegByte2D,     X86Mods.opModRegByte2E,     X86Mods.opModRegByte2F,
    X86Mods.opModRegByte30,     X86Mods.opModRegByte31,     X86Mods.opModRegByte32,     X86Mods.opModRegByte33,
    X86Mods.opModRegByte34,     X86Mods.opModRegByte35,     X86Mods.opModRegByte36,     X86Mods.opModRegByte37,
    X86Mods.opModRegByte38,     X86Mods.opModRegByte39,     X86Mods.opModRegByte3A,     X86Mods.opModRegByte3B,
    X86Mods.opModRegByte3C,     X86Mods.opModRegByte3D,     X86Mods.opModRegByte3E,     X86Mods.opModRegByte3F,
    X86Mods.opModRegByte40,     X86Mods.opModRegByte41,     X86Mods.opModRegByte42,     X86Mods.opModRegByte43,
    X86Mods.opModRegByte44,     X86Mods.opModRegByte45,     X86Mods.opModRegByte46,     X86Mods.opModRegByte47,
    X86Mods.opModRegByte48,     X86Mods.opModRegByte49,     X86Mods.opModRegByte4A,     X86Mods.opModRegByte4B,
    X86Mods.opModRegByte4C,     X86Mods.opModRegByte4D,     X86Mods.opModRegByte4E,     X86Mods.opModRegByte4F,
    X86Mods.opModRegByte50,     X86Mods.opModRegByte51,     X86Mods.opModRegByte52,     X86Mods.opModRegByte53,
    X86Mods.opModRegByte54,     X86Mods.opModRegByte55,     X86Mods.opModRegByte56,     X86Mods.opModRegByte57,
    X86Mods.opModRegByte58,     X86Mods.opModRegByte59,     X86Mods.opModRegByte5A,     X86Mods.opModRegByte5B,
    X86Mods.opModRegByte5C,     X86Mods.opModRegByte5D,     X86Mods.opModRegByte5E,     X86Mods.opModRegByte5F,
    X86Mods.opModRegByte60,     X86Mods.opModRegByte61,     X86Mods.opModRegByte62,     X86Mods.opModRegByte63,
    X86Mods.opModRegByte64,     X86Mods.opModRegByte65,     X86Mods.opModRegByte66,     X86Mods.opModRegByte67,
    X86Mods.opModRegByte68,     X86Mods.opModRegByte69,     X86Mods.opModRegByte6A,     X86Mods.opModRegByte6B,
    X86Mods.opModRegByte6C,     X86Mods.opModRegByte6D,     X86Mods.opModRegByte6E,     X86Mods.opModRegByte6F,
    X86Mods.opModRegByte70,     X86Mods.opModRegByte71,     X86Mods.opModRegByte72,     X86Mods.opModRegByte73,
    X86Mods.opModRegByte74,     X86Mods.opModRegByte75,     X86Mods.opModRegByte76,     X86Mods.opModRegByte77,
    X86Mods.opModRegByte78,     X86Mods.opModRegByte79,     X86Mods.opModRegByte7A,     X86Mods.opModRegByte7B,
    X86Mods.opModRegByte7C,     X86Mods.opModRegByte7D,     X86Mods.opModRegByte7E,     X86Mods.opModRegByte7F,
    X86Mods.opModRegByte80,     X86Mods.opModRegByte81,     X86Mods.opModRegByte82,     X86Mods.opModRegByte83,
    X86Mods.opModRegByte84,     X86Mods.opModRegByte85,     X86Mods.opModRegByte86,     X86Mods.opModRegByte87,
    X86Mods.opModRegByte88,     X86Mods.opModRegByte89,     X86Mods.opModRegByte8A,     X86Mods.opModRegByte8B,
    X86Mods.opModRegByte8C,     X86Mods.opModRegByte8D,     X86Mods.opModRegByte8E,     X86Mods.opModRegByte8F,
    X86Mods.opModRegByte90,     X86Mods.opModRegByte91,     X86Mods.opModRegByte92,     X86Mods.opModRegByte93,
    X86Mods.opModRegByte94,     X86Mods.opModRegByte95,     X86Mods.opModRegByte96,     X86Mods.opModRegByte97,
    X86Mods.opModRegByte98,     X86Mods.opModRegByte99,     X86Mods.opModRegByte9A,     X86Mods.opModRegByte9B,
    X86Mods.opModRegByte9C,     X86Mods.opModRegByte9D,     X86Mods.opModRegByte9E,     X86Mods.opModRegByte9F,
    X86Mods.opModRegByteA0,     X86Mods.opModRegByteA1,     X86Mods.opModRegByteA2,     X86Mods.opModRegByteA3,
    X86Mods.opModRegByteA4,     X86Mods.opModRegByteA5,     X86Mods.opModRegByteA6,     X86Mods.opModRegByteA7,
    X86Mods.opModRegByteA8,     X86Mods.opModRegByteA9,     X86Mods.opModRegByteAA,     X86Mods.opModRegByteAB,
    X86Mods.opModRegByteAC,     X86Mods.opModRegByteAD,     X86Mods.opModRegByteAE,     X86Mods.opModRegByteAF,
    X86Mods.opModRegByteB0,     X86Mods.opModRegByteB1,     X86Mods.opModRegByteB2,     X86Mods.opModRegByteB3,
    X86Mods.opModRegByteB4,     X86Mods.opModRegByteB5,     X86Mods.opModRegByteB6,     X86Mods.opModRegByteB7,
    X86Mods.opModRegByteB8,     X86Mods.opModRegByteB9,     X86Mods.opModRegByteBA,     X86Mods.opModRegByteBB,
    X86Mods.opModRegByteBC,     X86Mods.opModRegByteBD,     X86Mods.opModRegByteBE,     X86Mods.opModRegByteBF,
    X86Mods.opModRegByteC0,     X86Mods.opModRegByteC1,     X86Mods.opModRegByteC2,     X86Mods.opModRegByteC3,
    X86Mods.opModRegByteC4,     X86Mods.opModRegByteC5,     X86Mods.opModRegByteC6,     X86Mods.opModRegByteC7,
    X86Mods.opModRegByteC8,     X86Mods.opModRegByteC9,     X86Mods.opModRegByteCA,     X86Mods.opModRegByteCB,
    X86Mods.opModRegByteCC,     X86Mods.opModRegByteCD,     X86Mods.opModRegByteCE,     X86Mods.opModRegByteCF,
    X86Mods.opModRegByteD0,     X86Mods.opModRegByteD1,     X86Mods.opModRegByteD2,     X86Mods.opModRegByteD3,
    X86Mods.opModRegByteD4,     X86Mods.opModRegByteD5,     X86Mods.opModRegByteD6,     X86Mods.opModRegByteD7,
    X86Mods.opModRegByteD8,     X86Mods.opModRegByteD9,     X86Mods.opModRegByteDA,     X86Mods.opModRegByteDB,
    X86Mods.opModRegByteDC,     X86Mods.opModRegByteDD,     X86Mods.opModRegByteDE,     X86Mods.opModRegByteDF,
    X86Mods.opModRegByteE0,     X86Mods.opModRegByteE1,     X86Mods.opModRegByteE2,     X86Mods.opModRegByteE3,
    X86Mods.opModRegByteE4,     X86Mods.opModRegByteE5,     X86Mods.opModRegByteE6,     X86Mods.opModRegByteE7,
    X86Mods.opModRegByteE8,     X86Mods.opModRegByteE9,     X86Mods.opModRegByteEA,     X86Mods.opModRegByteEB,
    X86Mods.opModRegByteEC,     X86Mods.opModRegByteED,     X86Mods.opModRegByteEE,     X86Mods.opModRegByteEF,
    X86Mods.opModRegByteF0,     X86Mods.opModRegByteF1,     X86Mods.opModRegByteF2,     X86Mods.opModRegByteF3,
    X86Mods.opModRegByteF4,     X86Mods.opModRegByteF5,     X86Mods.opModRegByteF6,     X86Mods.opModRegByteF7,
    X86Mods.opModRegByteF8,     X86Mods.opModRegByteF9,     X86Mods.opModRegByteFA,     X86Mods.opModRegByteFB,
    X86Mods.opModRegByteFC,     X86Mods.opModRegByteFD,     X86Mods.opModRegByteFE,     X86Mods.opModRegByteFF
];

X86Mods.aOpModsRegWord = [
    X86Mods.opModRegWord00,     X86Mods.opModRegWord01,     X86Mods.opModRegWord02,     X86Mods.opModRegWord03,
    X86Mods.opModRegWord04,     X86Mods.opModRegWord05,     X86Mods.opModRegWord06,     X86Mods.opModRegWord07,
    X86Mods.opModRegWord08,     X86Mods.opModRegWord09,     X86Mods.opModRegWord0A,     X86Mods.opModRegWord0B,
    X86Mods.opModRegWord0C,     X86Mods.opModRegWord0D,     X86Mods.opModRegWord0E,     X86Mods.opModRegWord0F,
    X86Mods.opModRegWord10,     X86Mods.opModRegWord11,     X86Mods.opModRegWord12,     X86Mods.opModRegWord13,
    X86Mods.opModRegWord14,     X86Mods.opModRegWord15,     X86Mods.opModRegWord16,     X86Mods.opModRegWord17,
    X86Mods.opModRegWord18,     X86Mods.opModRegWord19,     X86Mods.opModRegWord1A,     X86Mods.opModRegWord1B,
    X86Mods.opModRegWord1C,     X86Mods.opModRegWord1D,     X86Mods.opModRegWord1E,     X86Mods.opModRegWord1F,
    X86Mods.opModRegWord20,     X86Mods.opModRegWord21,     X86Mods.opModRegWord22,     X86Mods.opModRegWord23,
    X86Mods.opModRegWord24,     X86Mods.opModRegWord25,     X86Mods.opModRegWord26,     X86Mods.opModRegWord27,
    X86Mods.opModRegWord28,     X86Mods.opModRegWord29,     X86Mods.opModRegWord2A,     X86Mods.opModRegWord2B,
    X86Mods.opModRegWord2C,     X86Mods.opModRegWord2D,     X86Mods.opModRegWord2E,     X86Mods.opModRegWord2F,
    X86Mods.opModRegWord30,     X86Mods.opModRegWord31,     X86Mods.opModRegWord32,     X86Mods.opModRegWord33,
    X86Mods.opModRegWord34,     X86Mods.opModRegWord35,     X86Mods.opModRegWord36,     X86Mods.opModRegWord37,
    X86Mods.opModRegWord38,     X86Mods.opModRegWord39,     X86Mods.opModRegWord3A,     X86Mods.opModRegWord3B,
    X86Mods.opModRegWord3C,     X86Mods.opModRegWord3D,     X86Mods.opModRegWord3E,     X86Mods.opModRegWord3F,
    X86Mods.opModRegWord40,     X86Mods.opModRegWord41,     X86Mods.opModRegWord42,     X86Mods.opModRegWord43,
    X86Mods.opModRegWord44,     X86Mods.opModRegWord45,     X86Mods.opModRegWord46,     X86Mods.opModRegWord47,
    X86Mods.opModRegWord48,     X86Mods.opModRegWord49,     X86Mods.opModRegWord4A,     X86Mods.opModRegWord4B,
    X86Mods.opModRegWord4C,     X86Mods.opModRegWord4D,     X86Mods.opModRegWord4E,     X86Mods.opModRegWord4F,
    X86Mods.opModRegWord50,     X86Mods.opModRegWord51,     X86Mods.opModRegWord52,     X86Mods.opModRegWord53,
    X86Mods.opModRegWord54,     X86Mods.opModRegWord55,     X86Mods.opModRegWord56,     X86Mods.opModRegWord57,
    X86Mods.opModRegWord58,     X86Mods.opModRegWord59,     X86Mods.opModRegWord5A,     X86Mods.opModRegWord5B,
    X86Mods.opModRegWord5C,     X86Mods.opModRegWord5D,     X86Mods.opModRegWord5E,     X86Mods.opModRegWord5F,
    X86Mods.opModRegWord60,     X86Mods.opModRegWord61,     X86Mods.opModRegWord62,     X86Mods.opModRegWord63,
    X86Mods.opModRegWord64,     X86Mods.opModRegWord65,     X86Mods.opModRegWord66,     X86Mods.opModRegWord67,
    X86Mods.opModRegWord68,     X86Mods.opModRegWord69,     X86Mods.opModRegWord6A,     X86Mods.opModRegWord6B,
    X86Mods.opModRegWord6C,     X86Mods.opModRegWord6D,     X86Mods.opModRegWord6E,     X86Mods.opModRegWord6F,
    X86Mods.opModRegWord70,     X86Mods.opModRegWord71,     X86Mods.opModRegWord72,     X86Mods.opModRegWord73,
    X86Mods.opModRegWord74,     X86Mods.opModRegWord75,     X86Mods.opModRegWord76,     X86Mods.opModRegWord77,
    X86Mods.opModRegWord78,     X86Mods.opModRegWord79,     X86Mods.opModRegWord7A,     X86Mods.opModRegWord7B,
    X86Mods.opModRegWord7C,     X86Mods.opModRegWord7D,     X86Mods.opModRegWord7E,     X86Mods.opModRegWord7F,
    X86Mods.opModRegWord80,     X86Mods.opModRegWord81,     X86Mods.opModRegWord82,     X86Mods.opModRegWord83,
    X86Mods.opModRegWord84,     X86Mods.opModRegWord85,     X86Mods.opModRegWord86,     X86Mods.opModRegWord87,
    X86Mods.opModRegWord88,     X86Mods.opModRegWord89,     X86Mods.opModRegWord8A,     X86Mods.opModRegWord8B,
    X86Mods.opModRegWord8C,     X86Mods.opModRegWord8D,     X86Mods.opModRegWord8E,     X86Mods.opModRegWord8F,
    X86Mods.opModRegWord90,     X86Mods.opModRegWord91,     X86Mods.opModRegWord92,     X86Mods.opModRegWord93,
    X86Mods.opModRegWord94,     X86Mods.opModRegWord95,     X86Mods.opModRegWord96,     X86Mods.opModRegWord97,
    X86Mods.opModRegWord98,     X86Mods.opModRegWord99,     X86Mods.opModRegWord9A,     X86Mods.opModRegWord9B,
    X86Mods.opModRegWord9C,     X86Mods.opModRegWord9D,     X86Mods.opModRegWord9E,     X86Mods.opModRegWord9F,
    X86Mods.opModRegWordA0,     X86Mods.opModRegWordA1,     X86Mods.opModRegWordA2,     X86Mods.opModRegWordA3,
    X86Mods.opModRegWordA4,     X86Mods.opModRegWordA5,     X86Mods.opModRegWordA6,     X86Mods.opModRegWordA7,
    X86Mods.opModRegWordA8,     X86Mods.opModRegWordA9,     X86Mods.opModRegWordAA,     X86Mods.opModRegWordAB,
    X86Mods.opModRegWordAC,     X86Mods.opModRegWordAD,     X86Mods.opModRegWordAE,     X86Mods.opModRegWordAF,
    X86Mods.opModRegWordB0,     X86Mods.opModRegWordB1,     X86Mods.opModRegWordB2,     X86Mods.opModRegWordB3,
    X86Mods.opModRegWordB4,     X86Mods.opModRegWordB5,     X86Mods.opModRegWordB6,     X86Mods.opModRegWordB7,
    X86Mods.opModRegWordB8,     X86Mods.opModRegWordB9,     X86Mods.opModRegWordBA,     X86Mods.opModRegWordBB,
    X86Mods.opModRegWordBC,     X86Mods.opModRegWordBD,     X86Mods.opModRegWordBE,     X86Mods.opModRegWordBF,
    X86Mods.opModRegWordC0,     X86Mods.opModRegWordC1,     X86Mods.opModRegWordC2,     X86Mods.opModRegWordC3,
    X86Mods.opModRegWordC4,     X86Mods.opModRegWordC5,     X86Mods.opModRegWordC6,     X86Mods.opModRegWordC7,
    X86Mods.opModRegWordC8,     X86Mods.opModRegWordC9,     X86Mods.opModRegWordCA,     X86Mods.opModRegWordCB,
    X86Mods.opModRegWordCC,     X86Mods.opModRegWordCD,     X86Mods.opModRegWordCE,     X86Mods.opModRegWordCF,
    X86Mods.opModRegWordD0,     X86Mods.opModRegWordD1,     X86Mods.opModRegWordD2,     X86Mods.opModRegWordD3,
    X86Mods.opModRegWordD4,     X86Mods.opModRegWordD5,     X86Mods.opModRegWordD6,     X86Mods.opModRegWordD7,
    X86Mods.opModRegWordD8,     X86Mods.opModRegWordD9,     X86Mods.opModRegWordDA,     X86Mods.opModRegWordDB,
    X86Mods.opModRegWordDC,     X86Mods.opModRegWordDD,     X86Mods.opModRegWordDE,     X86Mods.opModRegWordDF,
    X86Mods.opModRegWordE0,     X86Mods.opModRegWordE1,     X86Mods.opModRegWordE2,     X86Mods.opModRegWordE3,
    X86Mods.opModRegWordE4,     X86Mods.opModRegWordE5,     X86Mods.opModRegWordE6,     X86Mods.opModRegWordE7,
    X86Mods.opModRegWordE8,     X86Mods.opModRegWordE9,     X86Mods.opModRegWordEA,     X86Mods.opModRegWordEB,
    X86Mods.opModRegWordEC,     X86Mods.opModRegWordED,     X86Mods.opModRegWordEE,     X86Mods.opModRegWordEF,
    X86Mods.opModRegWordF0,     X86Mods.opModRegWordF1,     X86Mods.opModRegWordF2,     X86Mods.opModRegWordF3,
    X86Mods.opModRegWordF4,     X86Mods.opModRegWordF5,     X86Mods.opModRegWordF6,     X86Mods.opModRegWordF7,
    X86Mods.opModRegWordF8,     X86Mods.opModRegWordF9,     X86Mods.opModRegWordFA,     X86Mods.opModRegWordFB,
    X86Mods.opModRegWordFC,     X86Mods.opModRegWordFD,     X86Mods.opModRegWordFE,     X86Mods.opModRegWordFF
];

X86Mods.aOpModsGrpByte = [
    X86Mods.opModGrpByte00,     X86Mods.opModGrpByte01,     X86Mods.opModGrpByte02,     X86Mods.opModGrpByte03,
    X86Mods.opModGrpByte04,     X86Mods.opModGrpByte05,     X86Mods.opModGrpByte06,     X86Mods.opModGrpByte07,
    X86Mods.opModGrpByte08,     X86Mods.opModGrpByte09,     X86Mods.opModGrpByte0A,     X86Mods.opModGrpByte0B,
    X86Mods.opModGrpByte0C,     X86Mods.opModGrpByte0D,     X86Mods.opModGrpByte0E,     X86Mods.opModGrpByte0F,
    X86Mods.opModGrpByte10,     X86Mods.opModGrpByte11,     X86Mods.opModGrpByte12,     X86Mods.opModGrpByte13,
    X86Mods.opModGrpByte14,     X86Mods.opModGrpByte15,     X86Mods.opModGrpByte16,     X86Mods.opModGrpByte17,
    X86Mods.opModGrpByte18,     X86Mods.opModGrpByte19,     X86Mods.opModGrpByte1A,     X86Mods.opModGrpByte1B,
    X86Mods.opModGrpByte1C,     X86Mods.opModGrpByte1D,     X86Mods.opModGrpByte1E,     X86Mods.opModGrpByte1F,
    X86Mods.opModGrpByte20,     X86Mods.opModGrpByte21,     X86Mods.opModGrpByte22,     X86Mods.opModGrpByte23,
    X86Mods.opModGrpByte24,     X86Mods.opModGrpByte25,     X86Mods.opModGrpByte26,     X86Mods.opModGrpByte27,
    X86Mods.opModGrpByte28,     X86Mods.opModGrpByte29,     X86Mods.opModGrpByte2A,     X86Mods.opModGrpByte2B,
    X86Mods.opModGrpByte2C,     X86Mods.opModGrpByte2D,     X86Mods.opModGrpByte2E,     X86Mods.opModGrpByte2F,
    X86Mods.opModGrpByte30,     X86Mods.opModGrpByte31,     X86Mods.opModGrpByte32,     X86Mods.opModGrpByte33,
    X86Mods.opModGrpByte34,     X86Mods.opModGrpByte35,     X86Mods.opModGrpByte36,     X86Mods.opModGrpByte37,
    X86Mods.opModGrpByte38,     X86Mods.opModGrpByte39,     X86Mods.opModGrpByte3A,     X86Mods.opModGrpByte3B,
    X86Mods.opModGrpByte3C,     X86Mods.opModGrpByte3D,     X86Mods.opModGrpByte3E,     X86Mods.opModGrpByte3F,
    X86Mods.opModGrpByte40,     X86Mods.opModGrpByte41,     X86Mods.opModGrpByte42,     X86Mods.opModGrpByte43,
    X86Mods.opModGrpByte44,     X86Mods.opModGrpByte45,     X86Mods.opModGrpByte46,     X86Mods.opModGrpByte47,
    X86Mods.opModGrpByte48,     X86Mods.opModGrpByte49,     X86Mods.opModGrpByte4A,     X86Mods.opModGrpByte4B,
    X86Mods.opModGrpByte4C,     X86Mods.opModGrpByte4D,     X86Mods.opModGrpByte4E,     X86Mods.opModGrpByte4F,
    X86Mods.opModGrpByte50,     X86Mods.opModGrpByte51,     X86Mods.opModGrpByte52,     X86Mods.opModGrpByte53,
    X86Mods.opModGrpByte54,     X86Mods.opModGrpByte55,     X86Mods.opModGrpByte56,     X86Mods.opModGrpByte57,
    X86Mods.opModGrpByte58,     X86Mods.opModGrpByte59,     X86Mods.opModGrpByte5A,     X86Mods.opModGrpByte5B,
    X86Mods.opModGrpByte5C,     X86Mods.opModGrpByte5D,     X86Mods.opModGrpByte5E,     X86Mods.opModGrpByte5F,
    X86Mods.opModGrpByte60,     X86Mods.opModGrpByte61,     X86Mods.opModGrpByte62,     X86Mods.opModGrpByte63,
    X86Mods.opModGrpByte64,     X86Mods.opModGrpByte65,     X86Mods.opModGrpByte66,     X86Mods.opModGrpByte67,
    X86Mods.opModGrpByte68,     X86Mods.opModGrpByte69,     X86Mods.opModGrpByte6A,     X86Mods.opModGrpByte6B,
    X86Mods.opModGrpByte6C,     X86Mods.opModGrpByte6D,     X86Mods.opModGrpByte6E,     X86Mods.opModGrpByte6F,
    X86Mods.opModGrpByte70,     X86Mods.opModGrpByte71,     X86Mods.opModGrpByte72,     X86Mods.opModGrpByte73,
    X86Mods.opModGrpByte74,     X86Mods.opModGrpByte75,     X86Mods.opModGrpByte76,     X86Mods.opModGrpByte77,
    X86Mods.opModGrpByte78,     X86Mods.opModGrpByte79,     X86Mods.opModGrpByte7A,     X86Mods.opModGrpByte7B,
    X86Mods.opModGrpByte7C,     X86Mods.opModGrpByte7D,     X86Mods.opModGrpByte7E,     X86Mods.opModGrpByte7F,
    X86Mods.opModGrpByte80,     X86Mods.opModGrpByte81,     X86Mods.opModGrpByte82,     X86Mods.opModGrpByte83,
    X86Mods.opModGrpByte84,     X86Mods.opModGrpByte85,     X86Mods.opModGrpByte86,     X86Mods.opModGrpByte87,
    X86Mods.opModGrpByte88,     X86Mods.opModGrpByte89,     X86Mods.opModGrpByte8A,     X86Mods.opModGrpByte8B,
    X86Mods.opModGrpByte8C,     X86Mods.opModGrpByte8D,     X86Mods.opModGrpByte8E,     X86Mods.opModGrpByte8F,
    X86Mods.opModGrpByte90,     X86Mods.opModGrpByte91,     X86Mods.opModGrpByte92,     X86Mods.opModGrpByte93,
    X86Mods.opModGrpByte94,     X86Mods.opModGrpByte95,     X86Mods.opModGrpByte96,     X86Mods.opModGrpByte97,
    X86Mods.opModGrpByte98,     X86Mods.opModGrpByte99,     X86Mods.opModGrpByte9A,     X86Mods.opModGrpByte9B,
    X86Mods.opModGrpByte9C,     X86Mods.opModGrpByte9D,     X86Mods.opModGrpByte9E,     X86Mods.opModGrpByte9F,
    X86Mods.opModGrpByteA0,     X86Mods.opModGrpByteA1,     X86Mods.opModGrpByteA2,     X86Mods.opModGrpByteA3,
    X86Mods.opModGrpByteA4,     X86Mods.opModGrpByteA5,     X86Mods.opModGrpByteA6,     X86Mods.opModGrpByteA7,
    X86Mods.opModGrpByteA8,     X86Mods.opModGrpByteA9,     X86Mods.opModGrpByteAA,     X86Mods.opModGrpByteAB,
    X86Mods.opModGrpByteAC,     X86Mods.opModGrpByteAD,     X86Mods.opModGrpByteAE,     X86Mods.opModGrpByteAF,
    X86Mods.opModGrpByteB0,     X86Mods.opModGrpByteB1,     X86Mods.opModGrpByteB2,     X86Mods.opModGrpByteB3,
    X86Mods.opModGrpByteB4,     X86Mods.opModGrpByteB5,     X86Mods.opModGrpByteB6,     X86Mods.opModGrpByteB7,
    X86Mods.opModGrpByteB8,     X86Mods.opModGrpByteB9,     X86Mods.opModGrpByteBA,     X86Mods.opModGrpByteBB,
    X86Mods.opModGrpByteBC,     X86Mods.opModGrpByteBD,     X86Mods.opModGrpByteBE,     X86Mods.opModGrpByteBF,
    X86Mods.opModGrpByteC0,     X86Mods.opModGrpByteC1,     X86Mods.opModGrpByteC2,     X86Mods.opModGrpByteC3,
    X86Mods.opModGrpByteC4,     X86Mods.opModGrpByteC5,     X86Mods.opModGrpByteC6,     X86Mods.opModGrpByteC7,
    X86Mods.opModGrpByteC8,     X86Mods.opModGrpByteC9,     X86Mods.opModGrpByteCA,     X86Mods.opModGrpByteCB,
    X86Mods.opModGrpByteCC,     X86Mods.opModGrpByteCD,     X86Mods.opModGrpByteCE,     X86Mods.opModGrpByteCF,
    X86Mods.opModGrpByteD0,     X86Mods.opModGrpByteD1,     X86Mods.opModGrpByteD2,     X86Mods.opModGrpByteD3,
    X86Mods.opModGrpByteD4,     X86Mods.opModGrpByteD5,     X86Mods.opModGrpByteD6,     X86Mods.opModGrpByteD7,
    X86Mods.opModGrpByteD8,     X86Mods.opModGrpByteD9,     X86Mods.opModGrpByteDA,     X86Mods.opModGrpByteDB,
    X86Mods.opModGrpByteDC,     X86Mods.opModGrpByteDD,     X86Mods.opModGrpByteDE,     X86Mods.opModGrpByteDF,
    X86Mods.opModGrpByteE0,     X86Mods.opModGrpByteE1,     X86Mods.opModGrpByteE2,     X86Mods.opModGrpByteE3,
    X86Mods.opModGrpByteE4,     X86Mods.opModGrpByteE5,     X86Mods.opModGrpByteE6,     X86Mods.opModGrpByteE7,
    X86Mods.opModGrpByteE8,     X86Mods.opModGrpByteE9,     X86Mods.opModGrpByteEA,     X86Mods.opModGrpByteEB,
    X86Mods.opModGrpByteEC,     X86Mods.opModGrpByteED,     X86Mods.opModGrpByteEE,     X86Mods.opModGrpByteEF,
    X86Mods.opModGrpByteF0,     X86Mods.opModGrpByteF1,     X86Mods.opModGrpByteF2,     X86Mods.opModGrpByteF3,
    X86Mods.opModGrpByteF4,     X86Mods.opModGrpByteF5,     X86Mods.opModGrpByteF6,     X86Mods.opModGrpByteF7,
    X86Mods.opModGrpByteF8,     X86Mods.opModGrpByteF9,     X86Mods.opModGrpByteFA,     X86Mods.opModGrpByteFB,
    X86Mods.opModGrpByteFC,     X86Mods.opModGrpByteFD,     X86Mods.opModGrpByteFE,     X86Mods.opModGrpByteFF
];

X86Mods.aOpModsGrpWord = [
    X86Mods.opModGrpWord00,     X86Mods.opModGrpWord01,     X86Mods.opModGrpWord02,     X86Mods.opModGrpWord03,
    X86Mods.opModGrpWord04,     X86Mods.opModGrpWord05,     X86Mods.opModGrpWord06,     X86Mods.opModGrpWord07,
    X86Mods.opModGrpWord08,     X86Mods.opModGrpWord09,     X86Mods.opModGrpWord0A,     X86Mods.opModGrpWord0B,
    X86Mods.opModGrpWord0C,     X86Mods.opModGrpWord0D,     X86Mods.opModGrpWord0E,     X86Mods.opModGrpWord0F,
    X86Mods.opModGrpWord10,     X86Mods.opModGrpWord11,     X86Mods.opModGrpWord12,     X86Mods.opModGrpWord13,
    X86Mods.opModGrpWord14,     X86Mods.opModGrpWord15,     X86Mods.opModGrpWord16,     X86Mods.opModGrpWord17,
    X86Mods.opModGrpWord18,     X86Mods.opModGrpWord19,     X86Mods.opModGrpWord1A,     X86Mods.opModGrpWord1B,
    X86Mods.opModGrpWord1C,     X86Mods.opModGrpWord1D,     X86Mods.opModGrpWord1E,     X86Mods.opModGrpWord1F,
    X86Mods.opModGrpWord20,     X86Mods.opModGrpWord21,     X86Mods.opModGrpWord22,     X86Mods.opModGrpWord23,
    X86Mods.opModGrpWord24,     X86Mods.opModGrpWord25,     X86Mods.opModGrpWord26,     X86Mods.opModGrpWord27,
    X86Mods.opModGrpWord28,     X86Mods.opModGrpWord29,     X86Mods.opModGrpWord2A,     X86Mods.opModGrpWord2B,
    X86Mods.opModGrpWord2C,     X86Mods.opModGrpWord2D,     X86Mods.opModGrpWord2E,     X86Mods.opModGrpWord2F,
    X86Mods.opModGrpWord30,     X86Mods.opModGrpWord31,     X86Mods.opModGrpWord32,     X86Mods.opModGrpWord33,
    X86Mods.opModGrpWord34,     X86Mods.opModGrpWord35,     X86Mods.opModGrpWord36,     X86Mods.opModGrpWord37,
    X86Mods.opModGrpWord38,     X86Mods.opModGrpWord39,     X86Mods.opModGrpWord3A,     X86Mods.opModGrpWord3B,
    X86Mods.opModGrpWord3C,     X86Mods.opModGrpWord3D,     X86Mods.opModGrpWord3E,     X86Mods.opModGrpWord3F,
    X86Mods.opModGrpWord40,     X86Mods.opModGrpWord41,     X86Mods.opModGrpWord42,     X86Mods.opModGrpWord43,
    X86Mods.opModGrpWord44,     X86Mods.opModGrpWord45,     X86Mods.opModGrpWord46,     X86Mods.opModGrpWord47,
    X86Mods.opModGrpWord48,     X86Mods.opModGrpWord49,     X86Mods.opModGrpWord4A,     X86Mods.opModGrpWord4B,
    X86Mods.opModGrpWord4C,     X86Mods.opModGrpWord4D,     X86Mods.opModGrpWord4E,     X86Mods.opModGrpWord4F,
    X86Mods.opModGrpWord50,     X86Mods.opModGrpWord51,     X86Mods.opModGrpWord52,     X86Mods.opModGrpWord53,
    X86Mods.opModGrpWord54,     X86Mods.opModGrpWord55,     X86Mods.opModGrpWord56,     X86Mods.opModGrpWord57,
    X86Mods.opModGrpWord58,     X86Mods.opModGrpWord59,     X86Mods.opModGrpWord5A,     X86Mods.opModGrpWord5B,
    X86Mods.opModGrpWord5C,     X86Mods.opModGrpWord5D,     X86Mods.opModGrpWord5E,     X86Mods.opModGrpWord5F,
    X86Mods.opModGrpWord60,     X86Mods.opModGrpWord61,     X86Mods.opModGrpWord62,     X86Mods.opModGrpWord63,
    X86Mods.opModGrpWord64,     X86Mods.opModGrpWord65,     X86Mods.opModGrpWord66,     X86Mods.opModGrpWord67,
    X86Mods.opModGrpWord68,     X86Mods.opModGrpWord69,     X86Mods.opModGrpWord6A,     X86Mods.opModGrpWord6B,
    X86Mods.opModGrpWord6C,     X86Mods.opModGrpWord6D,     X86Mods.opModGrpWord6E,     X86Mods.opModGrpWord6F,
    X86Mods.opModGrpWord70,     X86Mods.opModGrpWord71,     X86Mods.opModGrpWord72,     X86Mods.opModGrpWord73,
    X86Mods.opModGrpWord74,     X86Mods.opModGrpWord75,     X86Mods.opModGrpWord76,     X86Mods.opModGrpWord77,
    X86Mods.opModGrpWord78,     X86Mods.opModGrpWord79,     X86Mods.opModGrpWord7A,     X86Mods.opModGrpWord7B,
    X86Mods.opModGrpWord7C,     X86Mods.opModGrpWord7D,     X86Mods.opModGrpWord7E,     X86Mods.opModGrpWord7F,
    X86Mods.opModGrpWord80,     X86Mods.opModGrpWord81,     X86Mods.opModGrpWord82,     X86Mods.opModGrpWord83,
    X86Mods.opModGrpWord84,     X86Mods.opModGrpWord85,     X86Mods.opModGrpWord86,     X86Mods.opModGrpWord87,
    X86Mods.opModGrpWord88,     X86Mods.opModGrpWord89,     X86Mods.opModGrpWord8A,     X86Mods.opModGrpWord8B,
    X86Mods.opModGrpWord8C,     X86Mods.opModGrpWord8D,     X86Mods.opModGrpWord8E,     X86Mods.opModGrpWord8F,
    X86Mods.opModGrpWord90,     X86Mods.opModGrpWord91,     X86Mods.opModGrpWord92,     X86Mods.opModGrpWord93,
    X86Mods.opModGrpWord94,     X86Mods.opModGrpWord95,     X86Mods.opModGrpWord96,     X86Mods.opModGrpWord97,
    X86Mods.opModGrpWord98,     X86Mods.opModGrpWord99,     X86Mods.opModGrpWord9A,     X86Mods.opModGrpWord9B,
    X86Mods.opModGrpWord9C,     X86Mods.opModGrpWord9D,     X86Mods.opModGrpWord9E,     X86Mods.opModGrpWord9F,
    X86Mods.opModGrpWordA0,     X86Mods.opModGrpWordA1,     X86Mods.opModGrpWordA2,     X86Mods.opModGrpWordA3,
    X86Mods.opModGrpWordA4,     X86Mods.opModGrpWordA5,     X86Mods.opModGrpWordA6,     X86Mods.opModGrpWordA7,
    X86Mods.opModGrpWordA8,     X86Mods.opModGrpWordA9,     X86Mods.opModGrpWordAA,     X86Mods.opModGrpWordAB,
    X86Mods.opModGrpWordAC,     X86Mods.opModGrpWordAD,     X86Mods.opModGrpWordAE,     X86Mods.opModGrpWordAF,
    X86Mods.opModGrpWordB0,     X86Mods.opModGrpWordB1,     X86Mods.opModGrpWordB2,     X86Mods.opModGrpWordB3,
    X86Mods.opModGrpWordB4,     X86Mods.opModGrpWordB5,     X86Mods.opModGrpWordB6,     X86Mods.opModGrpWordB7,
    X86Mods.opModGrpWordB8,     X86Mods.opModGrpWordB9,     X86Mods.opModGrpWordBA,     X86Mods.opModGrpWordBB,
    X86Mods.opModGrpWordBC,     X86Mods.opModGrpWordBD,     X86Mods.opModGrpWordBE,     X86Mods.opModGrpWordBF,
    X86Mods.opModGrpWordC0,     X86Mods.opModGrpWordC1,     X86Mods.opModGrpWordC2,     X86Mods.opModGrpWordC3,
    X86Mods.opModGrpWordC4,     X86Mods.opModGrpWordC5,     X86Mods.opModGrpWordC6,     X86Mods.opModGrpWordC7,
    X86Mods.opModGrpWordC8,     X86Mods.opModGrpWordC9,     X86Mods.opModGrpWordCA,     X86Mods.opModGrpWordCB,
    X86Mods.opModGrpWordCC,     X86Mods.opModGrpWordCD,     X86Mods.opModGrpWordCE,     X86Mods.opModGrpWordCF,
    X86Mods.opModGrpWordD0,     X86Mods.opModGrpWordD1,     X86Mods.opModGrpWordD2,     X86Mods.opModGrpWordD3,
    X86Mods.opModGrpWordD4,     X86Mods.opModGrpWordD5,     X86Mods.opModGrpWordD6,     X86Mods.opModGrpWordD7,
    X86Mods.opModGrpWordD8,     X86Mods.opModGrpWordD9,     X86Mods.opModGrpWordDA,     X86Mods.opModGrpWordDB,
    X86Mods.opModGrpWordDC,     X86Mods.opModGrpWordDD,     X86Mods.opModGrpWordDE,     X86Mods.opModGrpWordDF,
    X86Mods.opModGrpWordE0,     X86Mods.opModGrpWordE1,     X86Mods.opModGrpWordE2,     X86Mods.opModGrpWordE3,
    X86Mods.opModGrpWordE4,     X86Mods.opModGrpWordE5,     X86Mods.opModGrpWordE6,     X86Mods.opModGrpWordE7,
    X86Mods.opModGrpWordE8,     X86Mods.opModGrpWordE9,     X86Mods.opModGrpWordEA,     X86Mods.opModGrpWordEB,
    X86Mods.opModGrpWordEC,     X86Mods.opModGrpWordED,     X86Mods.opModGrpWordEE,     X86Mods.opModGrpWordEF,
    X86Mods.opModGrpWordF0,     X86Mods.opModGrpWordF1,     X86Mods.opModGrpWordF2,     X86Mods.opModGrpWordF3,
    X86Mods.opModGrpWordF4,     X86Mods.opModGrpWordF5,     X86Mods.opModGrpWordF6,     X86Mods.opModGrpWordF7,
    X86Mods.opModGrpWordF8,     X86Mods.opModGrpWordF9,     X86Mods.opModGrpWordFA,     X86Mods.opModGrpWordFB,
    X86Mods.opModGrpWordFC,     X86Mods.opModGrpWordFD,     X86Mods.opModGrpWordFE,     X86Mods.opModGrpWordFF
];

if (typeof module !== 'undefined') module.exports = X86Mods;
