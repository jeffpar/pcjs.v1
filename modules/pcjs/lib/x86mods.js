/**
 * @fileoverview Implements PCjs 8086 mode-byte decoding.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-05
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

if (typeof module !== 'undefined') {
    var X86         = require("./x86");
}

var X86Mods = {
    /**
     * opModMemByte00(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte00: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte01(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte01: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte02(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte02: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte03(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte03: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte04(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte04: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte05(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte05: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte06(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte06: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte07(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte07: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte08(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte08: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte09(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte09: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte0A(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte0A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte0B(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte0B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte0C(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte0C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte0D(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte0D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte0E(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte0E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte0F(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte0F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte10(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte10: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte11(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte11: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte12(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte12: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte13(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte13: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte14(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte14: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte15(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte15: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte16(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte16: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte17(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte17: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte18(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte18: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte19(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte19: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte1A(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte1A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte1B(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte1B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte1C(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte1C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte1D(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte1D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte1E(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte1E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte1F(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte1F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte20(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte20: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte21(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte21: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte22(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte22: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte23(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte23: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte24(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte24: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte25(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte25: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte26(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte26: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte27(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte27: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte28(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte28: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte29(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte29: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte2A(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte2A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte2B(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte2B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte2C(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte2C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte2D(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte2D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte2E(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte2E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte2F(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte2F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte30(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte30: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte31(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte31: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte32(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte32: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte33(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte33: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte34(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte34: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte35(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte35: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte36(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte36: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte37(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte37: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte38(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte38: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte39(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte39: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte3A(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte3A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte3B(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte3B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte3C(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte3C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regSI), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte3D(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte3D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regDI), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte3E(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte3E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte3F(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte3F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.regBX), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte40(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte40: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte41(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte41: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte42(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte42: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte43(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte43: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte44(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte44: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte45(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte45: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte46(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte46: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte47(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte47: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte48(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte48: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte49(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte49: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte4A(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte4A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte4B(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte4B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte4C(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte4C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4D(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte4D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4E(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte4E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4F(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte4F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte50(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte50: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte51(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte51: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte52(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte52: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte53(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte53: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte54(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte54: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte55(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte55: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte56(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte56: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte57(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte57: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte58(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte58: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte59(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte59: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte5A(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte5A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte5B(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte5B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte5C(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte5C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5D(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte5D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5E(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte5E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5F(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte5F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte60(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte60: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte61(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte61: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte62(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte62: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte63(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte63: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte64(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte64: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte65(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte65: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte66(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte66: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte67(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte67: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte68(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte68: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte69(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte69: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte6A(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte6A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte6B(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte6B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte6C(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte6C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6D(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte6D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6E(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte6E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6F(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte6F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte70(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte70: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte71(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte71: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte72(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte72: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte73(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte73: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte74(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte74: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte75(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte75: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte76(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte76: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte77(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte77: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte78(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte78: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte79(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte79: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte7A(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte7A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte7B(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte7B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte7C(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte7C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7D(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte7D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7E(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte7E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7F(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte7F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte80(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte80: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte81(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte81: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte82(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte82: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte83(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte83: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte84(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte84: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte85(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte85: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte86(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte86: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte87(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte87: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regAX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte88(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte88: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte89(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte89: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte8A(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte8A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte8B(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte8B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte8C(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte8C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8D(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte8D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8E(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte8E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8F(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte8F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regCX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte90(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte90: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte91(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte91: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte92(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte92: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte93(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte93: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte94(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte94: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte95(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte95: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte96(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte96: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte97(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte97: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte98(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte98: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte99(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte99: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte9A(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte9A: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte9B(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte9B: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte9C(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte9C: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9D(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte9D: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9E(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte9E: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9F(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByte9F: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBX & 0xff);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA0(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA0: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA1(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA1: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteA2(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA2: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteA3(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA3: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA4(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA4: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA5(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA5: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA6(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA6: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA7(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA7: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regAX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA8(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA8: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA9(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteA9: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteAA(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteAA: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteAB(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteAB: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteAC(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteAC: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAD(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteAD: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAE(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteAE: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAF(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteAF: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regCX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB0(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB0: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB1(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB1: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteB2(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB2: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteB3(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB3: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB4(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB4: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB5(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB5: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB6(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB6: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB7(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB7: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB8(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB8: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB9(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteB9: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteBA(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteBA: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteBB(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteBB: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteBC(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteBC: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBD(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteBD: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBE(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteBE: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBF(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemByteBF: function(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBX >> 8);
        if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord00(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord00: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord01(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord01: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord02(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord02: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord03(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord03: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord04(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord04: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord05(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord05: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord06(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord06: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord07(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord07: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord08(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord08: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord09(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord09: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord0A(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord0A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord0B(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord0B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord0C(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord0C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord0D(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord0D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord0E(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord0E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord0F(fn): mod=00 (mem:dst)  reg=001 (CX:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord0F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord10(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord10: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord11(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord11: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord12(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord12: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord13(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord13: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord14(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord14: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord15(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord15: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord16(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord16: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord17(fn): mod=00 (mem:dst)  reg=010 (DX:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord17: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord18(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord18: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord19(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord19: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord1A(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord1A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord1B(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord1B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord1C(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord1C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord1D(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord1D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord1E(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord1E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord1F(fn): mod=00 (mem:dst)  reg=011 (BX:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord1F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord20(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord20: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord21(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord21: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord22(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord22: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord23(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord23: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord24(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord24: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord25(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord25: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord26(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord26: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord27(fn): mod=00 (mem:dst)  reg=100 (SP:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord27: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord28(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord28: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord29(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord29: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord2A(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord2A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord2B(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord2B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord2C(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord2C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord2D(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord2D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord2E(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord2E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord2F(fn): mod=00 (mem:dst)  reg=101 (BP:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord2F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord30(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord30: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord31(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord31: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord32(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord32: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord33(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord33: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord34(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord34: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord35(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord35: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord36(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord36: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord37(fn): mod=00 (mem:dst)  reg=110 (SI:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord37: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord38(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord38: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord39(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord39: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord3A(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord3A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord3B(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord3B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord3C(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord3C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regSI), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord3D(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord3D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regDI), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord3E(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord3E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemWord3F(fn): mod=00 (mem:dst)  reg=111 (DI:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord3F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.regBX), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemWord40(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord40: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord41(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord41: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord42(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord42: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord43(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord43: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord44(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord44: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord45(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord45: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord46(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord46: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord47(fn): mod=01 (mem+d8:dst)  reg=000 (AX:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord47: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord48(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord48: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord49(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord49: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord4A(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord4A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord4B(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord4B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord4C(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord4C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord4D(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord4D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord4E(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord4E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord4F(fn): mod=01 (mem+d8:dst)  reg=001 (CX:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord4F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord50(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord50: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord51(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord51: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord52(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord52: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord53(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord53: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord54(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord54: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord55(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord55: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord56(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord56: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord57(fn): mod=01 (mem+d8:dst)  reg=010 (DX:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord57: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord58(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord58: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord59(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord59: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord5A(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord5A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord5B(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord5B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord5C(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord5C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord5D(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord5D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord5E(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord5E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord5F(fn): mod=01 (mem+d8:dst)  reg=011 (BX:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord5F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord60(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord60: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord61(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord61: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord62(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord62: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord63(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord63: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord64(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord64: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord65(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord65: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord66(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord66: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord67(fn): mod=01 (mem+d8:dst)  reg=100 (SP:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord67: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord68(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord68: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord69(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord69: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord6A(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord6A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord6B(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord6B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord6C(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord6C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord6D(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord6D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord6E(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord6E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord6F(fn): mod=01 (mem+d8:dst)  reg=101 (BP:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord6F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord70(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord70: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord71(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord71: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord72(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord72: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord73(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord73: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord74(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord74: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord75(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord75: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord76(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord76: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord77(fn): mod=01 (mem+d8:dst)  reg=110 (SI:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord77: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord78(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord78: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord79(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord79: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord7A(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord7A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord7B(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord7B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord7C(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord7C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord7D(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord7D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord7E(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord7E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord7F(fn): mod=01 (mem+d8:dst)  reg=111 (DI:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord7F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord80(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord80: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord81(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord81: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord82(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord82: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord83(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord83: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord84(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord84: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord85(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord85: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord86(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord86: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord87(fn): mod=10 (mem+d16:dst)  reg=000 (AX:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord87: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiAL; this.backTrack.btiMemHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord88(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord88: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord89(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord89: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord8A(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord8A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord8B(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord8B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord8C(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord8C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord8D(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord8D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord8E(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord8E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord8F(fn): mod=10 (mem+d16:dst)  reg=001 (CX:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord8F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiCL; this.backTrack.btiMemHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord90(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord90: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord91(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord91: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord92(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord92: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord93(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord93: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord94(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord94: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord95(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord95: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord96(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord96: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord97(fn): mod=10 (mem+d16:dst)  reg=010 (DX:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord97: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDL; this.backTrack.btiMemHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord98(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord98: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord99(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord99: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord9A(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord9A: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord9B(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord9B: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord9C(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord9C: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord9D(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord9D: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord9E(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord9E: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord9F(fn): mod=10 (mem+d16:dst)  reg=011 (BX:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWord9F: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBL; this.backTrack.btiMemHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA0(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA0: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordA1(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA1: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordA2(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA2: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordA3(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA3: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordA4(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA4: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA5(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA5: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA6(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA6: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA7(fn): mod=10 (mem+d16:dst)  reg=100 (SP:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA7: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = X86.BACKTRACK.SP_LO; this.backTrack.btiMemHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA8(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA8: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordA9(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordA9: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordAA(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordAA: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordAB(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordAB: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordAC(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordAC: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordAD(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordAD: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordAE(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordAE: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordAF(fn): mod=10 (mem+d16:dst)  reg=101 (BP:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordAF: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiBPLo; this.backTrack.btiMemHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB0(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB0: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordB1(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB1: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordB2(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB2: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordB3(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB3: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordB4(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB4: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB5(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB5: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB6(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB6: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB7(fn): mod=10 (mem+d16:dst)  reg=110 (SI:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB7: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiSILo; this.backTrack.btiMemHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB8(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB8: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordB9(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordB9: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordBA(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordBA: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordBB(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordBB: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordBC(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordBC: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordBD(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordBD: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordBE(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordBE: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordBF(fn): mod=10 (mem+d16:dst)  reg=111 (DI:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemWordBF: function(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiMemLo = this.backTrack.btiDILo; this.backTrack.btiMemHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte00(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte00: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte01(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte01: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte02(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte02: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte03(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte03: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte04(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte04: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte05(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte05: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte06(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte06: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte07(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte07: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte08(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte08: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte09(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte09: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte0A(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte0A: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte0B(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte0B: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte0C(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte0C: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte0D(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte0D: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte0E(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte0E: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte0F(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte0F: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte10(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte10: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte11(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte11: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte12(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte12: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte13(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte13: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte14(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte14: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte15(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte15: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte16(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte16: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte17(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte17: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte18(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte18: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte19(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte19: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte1A(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte1A: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte1B(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte1B: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte1C(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte1C: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.regSI));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte1D(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte1D: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.regDI));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte1E(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte1E: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte1F(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte1F: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, this.regBX));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte20(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte20: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte21(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte21: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte22(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte22: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte23(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte23: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte24(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte24: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte25(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte25: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte26(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte26: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte27(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte27: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte28(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte28: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte29(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte29: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte2A(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte2A: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte2B(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte2B: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte2C(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte2C: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte2D(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte2D: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte2E(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte2E: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte2F(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte2F: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte30(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte30: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte31(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte31: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte32(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte32: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte33(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte33: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte34(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte34: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte35(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte35: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte36(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte36: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte37(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte37: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte38(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte38: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte39(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte39: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte3A(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte3A: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte3B(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte3B: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte3C(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte3C: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.regSI));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte3D(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte3D: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.regDI));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte3E(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte3E: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.getIPWord()));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte3F(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte3F: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, this.regBX));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte40(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte40: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte41(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte41: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte42(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte42: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte43(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte43: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte44(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte44: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte45(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte45: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte46(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte46: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte47(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte47: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte48(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte48: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte49(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte49: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte4A(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte4A: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte4B(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte4B: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte4C(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte4C: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4D(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte4D: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4E(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte4E: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4F(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte4F: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte50(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte50: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte51(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte51: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte52(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte52: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte53(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte53: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte54(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte54: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte55(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte55: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte56(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte56: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte57(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte57: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte58(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte58: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte59(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte59: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte5A(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte5A: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte5B(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte5B: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte5C(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte5C: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5D(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte5D: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5E(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte5E: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5F(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte5F: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte60(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte60: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte61(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte61: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte62(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte62: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte63(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte63: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte64(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte64: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte65(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte65: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte66(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte66: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte67(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte67: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte68(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte68: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte69(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte69: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte6A(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte6A: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte6B(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte6B: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte6C(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte6C: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6D(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte6D: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6E(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte6E: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6F(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte6F: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte70(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte70: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte71(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte71: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte72(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte72: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte73(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte73: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte74(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte74: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte75(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte75: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte76(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte76: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte77(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte77: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte78(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte78: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte79(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte79: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte7A(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte7A: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte7B(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte7B: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte7C(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte7C: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7D(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte7D: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7E(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte7E: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7F(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte7F: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte80(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte80: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte81(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte81: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte82(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte82: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte83(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte83: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte84(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte84: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte85(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte85: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte86(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte86: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte87(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte87: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte88(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte88: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte89(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte89: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte8A(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte8A: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte8B(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte8B: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte8C(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte8C: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8D(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte8D: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8E(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte8E: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8F(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte8F: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte90(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte90: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte91(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte91: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte92(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte92: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte93(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte93: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte94(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte94: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte95(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte95: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte96(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte96: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte97(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte97: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte98(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte98: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte99(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte99: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte9A(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte9A: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte9B(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte9B: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte9C(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte9C: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9D(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte9D: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9E(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte9E: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9F(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByte9F: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA0(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA0: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA1(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA1: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteA2(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA2: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteA3(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA3: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA4(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA4: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA5(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA5: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA6(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA6: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA7(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA7: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA8(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA8: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA9(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteA9: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteAA(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteAA: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteAB(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteAB: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteAC(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteAC: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAD(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteAD: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAE(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteAE: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAF(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteAF: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB0(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB0: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB1(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB1: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteB2(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB2: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteB3(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB3: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB4(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB4: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB5(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB5: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB6(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB6: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB7(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB7: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB8(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB8: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB9(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteB9: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteBA(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteBA: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteBB(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteBB: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteBC(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteBC: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBD(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteBD: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBE(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteBE: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBF(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteBF: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.getEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteC0(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC0: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regAX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
    },
    /**
     * opModRegByteC1(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC1: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regCX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteC2(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC2: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regDX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteC3(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC3: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regBX & 0xff);
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteC4(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC4: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regAX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteC5(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC5: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regCX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteC6(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC6: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regDX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteC7(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC7: function(fn) {
        var b = fn.call(this, this.regAX & 0xff, this.regBX >> 8);
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteC8(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC8: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regAX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteC9(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteC9: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regCX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
    },
    /**
     * opModRegByteCA(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteCA: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regDX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteCB(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteCB: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regBX & 0xff);
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteCC(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteCC: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regAX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteCD(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteCD: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regCX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteCE(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteCE: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regDX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteCF(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteCF: function(fn) {
        var b = fn.call(this, this.regCX & 0xff, this.regBX >> 8);
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteD0(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD0: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regAX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteD1(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD1: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regCX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteD2(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD2: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regDX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
    },
    /**
     * opModRegByteD3(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD3: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regBX & 0xff);
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteD4(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD4: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regAX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteD5(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD5: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regCX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteD6(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD6: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regDX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteD7(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD7: function(fn) {
        var b = fn.call(this, this.regDX & 0xff, this.regBX >> 8);
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteD8(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD8: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regAX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteD9(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteD9: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regCX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteDA(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteDA: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regDX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteDB(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteDB: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regBX & 0xff);
        this.regBX = (this.regBX & ~0xff) | b;
    },
    /**
     * opModRegByteDC(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteDC: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regAX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteDD(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteDD: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regCX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteDE(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteDE: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regDX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteDF(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteDF: function(fn) {
        var b = fn.call(this, this.regBX & 0xff, this.regBX >> 8);
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteE0(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE0: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regAX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteE1(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE1: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regCX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteE2(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE2: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regDX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteE3(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE3: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regBX & 0xff);
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteE4(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE4: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regAX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
    },
    /**
     * opModRegByteE5(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE5: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regCX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteE6(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE6: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regDX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteE7(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE7: function(fn) {
        var b = fn.call(this, this.regAX >> 8, this.regBX >> 8);
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteE8(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE8: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regAX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteE9(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteE9: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regCX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteEA(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteEA: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regDX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteEB(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteEB: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regBX & 0xff);
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteEC(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteEC: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regAX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteED(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteED: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regCX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
    },
    /**
     * opModRegByteEE(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteEE: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regDX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteEF(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteEF: function(fn) {
        var b = fn.call(this, this.regCX >> 8, this.regBX >> 8);
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteF0(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF0: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regAX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteF1(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF1: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regCX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteF2(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF2: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regDX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteF3(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF3: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regBX & 0xff);
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteF4(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF4: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regAX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteF5(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF5: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regCX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteF6(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF6: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regDX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
    },
    /**
     * opModRegByteF7(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF7: function(fn) {
        var b = fn.call(this, this.regDX >> 8, this.regBX >> 8);
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteF8(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF8: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regAX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteF9(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteF9: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regCX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteFA(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteFA: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regDX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteFB(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteFB: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regBX & 0xff);
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteFC(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteFC: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regAX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteFD(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteFD: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regCX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteFE(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteFE: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regDX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteFF(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegByteFF: function(fn) {
        var b = fn.call(this, this.regBX >> 8, this.regBX >> 8);
        this.regBX = (this.regBX & 0xff) | (b << 8);
    },
    /**
     * opModRegWord00(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord00: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord01(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord01: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord02(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord02: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord03(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord03: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord04(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord04: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.regSI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord05(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord05: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.regDI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord06(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord06: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.getIPWord()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord07(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord07: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, this.regBX));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord08(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord08: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord09(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord09: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord0A(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord0A: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord0B(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord0B: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord0C(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord0C: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.regSI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord0D(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord0D: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.regDI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord0E(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord0E: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.getIPWord()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord0F(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord0F: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, this.regBX));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord10(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord10: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord11(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord11: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord12(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord12: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord13(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord13: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord14(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord14: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.regSI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord15(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord15: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.regDI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord16(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord16: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.getIPWord()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord17(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord17: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, this.regBX));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord18(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord18: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord19(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord19: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord1A(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord1A: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord1B(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord1B: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord1C(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord1C: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.regSI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord1D(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord1D: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.regDI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord1E(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord1E: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.getIPWord()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord1F(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord1F: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, this.regBX));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord20(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord20: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord21(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord21: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord22(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord22: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord23(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord23: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord24(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord24: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.regSI));
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord25(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord25: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.regDI));
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord26(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord26: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.getIPWord()));
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord27(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord27: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, this.regBX));
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord28(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord28: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord29(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord29: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord2A(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord2A: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord2B(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord2B: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord2C(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord2C: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.regSI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord2D(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord2D: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.regDI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord2E(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord2E: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.getIPWord()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord2F(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord2F: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, this.regBX));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord30(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord30: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord31(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord31: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord32(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord32: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord33(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord33: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord34(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord34: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.regSI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord35(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord35: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.regDI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord36(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord36: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.getIPWord()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord37(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord37: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, this.regBX));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord38(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord38: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord39(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord39: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord3A(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord3A: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord3B(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord3B: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord3C(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord3C: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.regSI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord3D(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord3D: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.regDI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord3E(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord3E: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.getIPWord()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord3F(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord3F: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, this.regBX));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord40(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord40: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord41(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord41: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord42(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord42: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord43(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord43: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord44(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord44: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord45(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord45: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord46(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord46: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord47(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord47: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord48(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord48: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord49(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord49: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord4A(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord4A: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord4B(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord4B: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord4C(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord4C: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4D(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord4D: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4E(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord4E: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4F(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord4F: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord50(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord50: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord51(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord51: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord52(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord52: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord53(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord53: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord54(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord54: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord55(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord55: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord56(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord56: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord57(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord57: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord58(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord58: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord59(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord59: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord5A(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord5A: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord5B(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord5B: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord5C(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord5C: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5D(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord5D: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5E(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord5E: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5F(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord5F: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord60(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord60: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord61(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord61: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord62(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord62: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord63(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord63: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord64(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord64: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord65(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord65: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord66(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord66: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord67(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord67: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord68(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord68: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord69(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord69: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord6A(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord6A: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord6B(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord6B: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord6C(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord6C: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6D(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord6D: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6E(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord6E: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6F(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord6F: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord70(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord70: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord71(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord71: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord72(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord72: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord73(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord73: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord74(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord74: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord75(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord75: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord76(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord76: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord77(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord77: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord78(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord78: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord79(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord79: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord7A(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord7A: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord7B(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord7B: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord7C(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord7C: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7D(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord7D: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7E(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord7E: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7F(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord7F: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord80(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord80: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord81(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord81: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord82(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord82: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord83(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord83: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord84(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord84: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord85(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord85: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord86(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord86: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord87(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord87: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord88(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord88: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord89(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord89: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord8A(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord8A: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord8B(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord8B: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord8C(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord8C: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8D(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord8D: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8E(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord8E: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8F(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord8F: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord90(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord90: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord91(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord91: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord92(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord92: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord93(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord93: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord94(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord94: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord95(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord95: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord96(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord96: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord97(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord97: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord98(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord98: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord99(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord99: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord9A(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord9A: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord9B(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord9B: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord9C(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord9C: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9D(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord9D: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9E(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord9E: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9F(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWord9F: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA0(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA0: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA1(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA1: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordA2(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA2: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordA3(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA3: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA4(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA4: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA5(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA5: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA6(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA6: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA7(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA7: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA8(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA8: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA9(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordA9: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordAA(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordAA: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordAB(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordAB: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordAC(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordAC: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAD(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordAD: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAE(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordAE: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAF(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordAF: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB0(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB0: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB1(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB1: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordB2(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB2: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordB3(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB3: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB4(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB4: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB5(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB5: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB6(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB6: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB7(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB7: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB8(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB8: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB9(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordB9: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordBA(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordBA: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordBB(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordBB: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordBC(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordBC: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBD(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordBD: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBE(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordBE: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBF(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordBF: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.getEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordC0(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC0: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regAX);
    },
    /**
     * opModRegWordC1(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC1: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiCL; this.backTrack.btiAH = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordC2(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC2: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDL; this.backTrack.btiAH = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordC3(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC3: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBL; this.backTrack.btiAH = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordC4(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC4: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiAL = X86.BACKTRACK.SP_LO; this.backTrack.btiAH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordC5(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC5: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBPLo; this.backTrack.btiAH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordC6(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC6: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiSILo; this.backTrack.btiAH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordC7(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC7: function(fn) {
        this.regAX = fn.call(this, this.regAX, this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDILo; this.backTrack.btiAH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordC8(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC8: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiAL; this.backTrack.btiCH = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordC9(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordC9: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regCX);
    },
    /**
     * opModRegWordCA(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordCA: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDL; this.backTrack.btiCH = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordCB(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordCB: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBL; this.backTrack.btiCH = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordCC(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordCC: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiCL = X86.BACKTRACK.SP_LO; this.backTrack.btiCH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordCD(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordCD: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBPLo; this.backTrack.btiCH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordCE(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordCE: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiSILo; this.backTrack.btiCH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordCF(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordCF: function(fn) {
        this.regCX = fn.call(this, this.regCX, this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDILo; this.backTrack.btiCH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordD0(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD0: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiAL; this.backTrack.btiDH = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordD1(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD1: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiCL; this.backTrack.btiDH = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordD2(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD2: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regDX);
    },
    /**
     * opModRegWordD3(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD3: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBL; this.backTrack.btiDH = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordD4(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD4: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiDL = X86.BACKTRACK.SP_LO; this.backTrack.btiDH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordD5(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD5: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBPLo; this.backTrack.btiDH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordD6(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD6: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiSILo; this.backTrack.btiDH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordD7(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD7: function(fn) {
        this.regDX = fn.call(this, this.regDX, this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiDILo; this.backTrack.btiDH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordD8(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD8: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiAL; this.backTrack.btiBH = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordD9(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordD9: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiCL; this.backTrack.btiBH = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordDA(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordDA: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDL; this.backTrack.btiBH = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordDB(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordDB: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regBX);
    },
    /**
     * opModRegWordDC(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordDC: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiBL = X86.BACKTRACK.SP_LO; this.backTrack.btiBH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordDD(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordDD: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiBPLo; this.backTrack.btiBH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordDE(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordDE: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiSILo; this.backTrack.btiBH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordDF(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordDF: function(fn) {
        this.regBX = fn.call(this, this.regBX, this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDILo; this.backTrack.btiBH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordE0(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE0: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regAX);
    },
    /**
     * opModRegWordE1(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE1: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regCX);
    },
    /**
     * opModRegWordE2(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE2: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regDX);
    },
    /**
     * opModRegWordE3(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE3: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regBX);
    },
    /**
     * opModRegWordE4(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE4: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regSP);
    },
    /**
     * opModRegWordE5(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE5: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regBP);
    },
    /**
     * opModRegWordE6(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE6: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regSI);
    },
    /**
     * opModRegWordE7(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE7: function(fn) {
        this.regSP = fn.call(this, this.regSP, this.regDI);
    },
    /**
     * opModRegWordE8(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE8: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiAL; this.backTrack.btiBPHi = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordE9(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordE9: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiCL; this.backTrack.btiBPHi = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordEA(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordEA: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDL; this.backTrack.btiBPHi = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordEB(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordEB: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiBL; this.backTrack.btiBPHi = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordEC(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordEC: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = X86.BACKTRACK.SP_LO; this.backTrack.btiBPHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordED(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordED: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regBP);
    },
    /**
     * opModRegWordEE(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordEE: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiSILo; this.backTrack.btiBPHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordEF(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordEF: function(fn) {
        this.regBP = fn.call(this, this.regBP, this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDILo; this.backTrack.btiBPHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordF0(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF0: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiAL; this.backTrack.btiSIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordF1(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF1: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiCL; this.backTrack.btiSIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordF2(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF2: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDL; this.backTrack.btiSIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordF3(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF3: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBL; this.backTrack.btiSIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordF4(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF4: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiSILo = X86.BACKTRACK.SP_LO; this.backTrack.btiSIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordF5(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF5: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBPLo; this.backTrack.btiSIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordF6(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF6: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regSI);
    },
    /**
     * opModRegWordF7(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF7: function(fn) {
        this.regSI = fn.call(this, this.regSI, this.regDI);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDILo; this.backTrack.btiSIHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordF8(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF8: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regAX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiAL; this.backTrack.btiDIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordF9(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordF9: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regCX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiCL; this.backTrack.btiDIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordFA(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordFA: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regDX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiDL; this.backTrack.btiDIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordFB(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordFB: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regBX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBL; this.backTrack.btiDIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordFC(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordFC: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regSP);
        if (BACKTRACK) {
            this.backTrack.btiDILo = X86.BACKTRACK.SP_LO; this.backTrack.btiDIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordFD(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordFD: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regBP);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBPLo; this.backTrack.btiDIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordFE(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordFE: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regSI);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiSILo; this.backTrack.btiDIHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordFF(fn): mod=11 (reg:src)  reg=111 (DI:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegWordFF: function(fn) {
        this.regDI = fn.call(this, this.regDI, this.regDI);
    },
    /**
     * opModGrpByte00(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte00: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte01(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte01: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte02(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte02: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte03(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte03: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte04(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte04: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte05(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte05: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte06(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte06: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte07(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte07: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte08(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte08: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte09(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte09: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte0A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte0A: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte0B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte0B: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte0C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte0C: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte0D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte0D: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte0E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte0E: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte0F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte0F: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte10(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte10: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte11(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte11: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte12(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte12: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte13(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte13: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte14(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte14: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte15(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte15: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte16(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte16: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte17(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte17: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte18(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte18: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte19(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte19: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte1A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte1A: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte1B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte1B: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte1C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte1C: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte1D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte1D: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte1E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte1E: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte1F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte1F: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte20(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte20: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte21(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte21: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte22(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte22: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte23(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte23: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte24(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte24: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte25(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte25: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte26(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte26: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte27(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte27: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte28(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte28: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte29(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte29: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte2A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte2A: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte2B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte2B: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte2C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte2C: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte2D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte2D: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte2E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte2E: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte2F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte2F: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte30(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte30: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte31(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte31: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte32(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte32: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte33(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte33: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte34(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte34: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte35(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte35: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte36(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte36: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte37(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte37: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte38(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte38: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte39(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte39: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte3A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte3A: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte3B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte3B: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte3C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte3C: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.regSI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte3D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte3D: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.regDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte3E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte3E: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte3F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte3F: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, this.regBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte40(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte40: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte41(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte41: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte42(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte42: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte43(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte43: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte44(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte44: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte45(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte45: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte46(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte46: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte47(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte47: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte48(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte48: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte49(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte49: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte4A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte4A: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte4B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte4B: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte4C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte4C: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte4D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte4D: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte4E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte4E: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte4F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte4F: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte50(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte50: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte51(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte51: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte52(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte52: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte53(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte53: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte54(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte54: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte55(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte55: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte56(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte56: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte57(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte57: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte58(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte58: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte59(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte59: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte5A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte5A: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte5B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte5B: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte5C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte5C: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte5D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte5D: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte5E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte5E: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte5F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte5F: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte60(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte60: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte61(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte61: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte62(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte62: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte63(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte63: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte64(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte64: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte65(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte65: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte66(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte66: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte67(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte67: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte68(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte68: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte69(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte69: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte6A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte6A: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte6B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte6B: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte6C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte6C: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte6D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte6D: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte6E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte6E: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte6F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte6F: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte70(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte70: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte71(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte71: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte72(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte72: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte73(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte73: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte74(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte74: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte75(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte75: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte76(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte76: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte77(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte77: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte78(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte78: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte79(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte79: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte7A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte7A: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte7B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte7B: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte7C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte7C: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte7D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte7D: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte7E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte7E: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte7F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte7F: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte80(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte80: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte81(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte81: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte82(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte82: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte83(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte83: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte84(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte84: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte85(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte85: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte86(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte86: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte87(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte87: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte88(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte88: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte89(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte89: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte8A(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte8A: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte8B(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte8B: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte8C(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte8C: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte8D(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte8D: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte8E(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte8E: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte8F(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte8F: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte90(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte90: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte91(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte91: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte92(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte92: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte93(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte93: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte94(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte94: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte95(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte95: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte96(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte96: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte97(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte97: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte98(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte98: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte99(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte99: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte9A(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte9A: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte9B(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte9B: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte9C(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte9C: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte9D(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte9D: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte9E(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte9E: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte9F(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByte9F: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA0(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA0: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteA1(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA1: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteA2(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA2: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteA3(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA3: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteA4(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA4: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA5(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA5: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA6(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA6: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA7(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA7: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA8(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA8: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteA9(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteA9: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteAA(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteAA: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteAB(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteAB: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteAC(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteAC: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteAD(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteAD: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteAE(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteAE: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteAF(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteAF: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB0(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB0: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteB1(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB1: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteB2(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB2: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteB3(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB3: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteB4(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB4: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB5(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB5: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB6(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB6: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB7(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB7: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB8(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB8: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteB9(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteB9: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteBA(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteBA: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteBB(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteBB: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteBC(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteBC: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteBD(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteBD: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteBE(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteBE: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteBF(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteBF: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteC0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC0: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC1: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC2: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC3: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC4: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC5: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC6: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC7: function(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC8: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteC9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteC9: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteCA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteCA: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteCB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteCB: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteCC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteCC: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteCD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteCD: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteCE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteCE: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteCF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteCF: function(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD0: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD1: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD2: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD3: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD4: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD5: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD6: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD7: function(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD8: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteD9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteD9: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteDA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteDA: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteDB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteDB: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteDC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteDC: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteDD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteDD: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteDE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteDE: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteDF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteDF: function(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE0: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE1: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE2: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE3: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE4: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE5: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE6: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE7: function(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE8: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteE9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteE9: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteEA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteEA: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteEB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteEB: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteEC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteEC: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteED(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteED: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteEE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteEE: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteEF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteEF: function(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF0: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF1: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF2: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF3: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF4: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF5: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF6: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF7: function(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF8: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regAX & 0xff, fnSrc.call(this));
        this.regAX = (this.regAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteF9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteF9: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regCX & 0xff, fnSrc.call(this));
        this.regCX = (this.regCX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteFA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteFA: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regDX & 0xff, fnSrc.call(this));
        this.regDX = (this.regDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteFB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteFB: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regBX & 0xff, fnSrc.call(this));
        this.regBX = (this.regBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteFC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteFC: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regAX >> 8, fnSrc.call(this));
        this.regAX = (this.regAX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteFD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteFD: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regCX >> 8, fnSrc.call(this));
        this.regCX = (this.regCX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteFE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteFE: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regDX >> 8, fnSrc.call(this));
        this.regDX = (this.regDX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpByteFF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpByteFF: function(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regBX >> 8, fnSrc.call(this));
        this.regBX = (this.regBX & 0xff) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiMemLo;
    },
    /**
     * opModGrpWord00(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord00: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord01(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord01: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord02(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord02: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord03(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord03: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord04(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord04: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord05(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord05: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord06(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord06: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord07(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord07: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord08(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord08: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord09(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord09: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord0A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord0A: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord0B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord0B: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord0C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord0C: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord0D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord0D: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord0E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord0E: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord0F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=001 (afnGrp[1])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord0F: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord10(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord10: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord11(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord11: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord12(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord12: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord13(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord13: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord14(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord14: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord15(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord15: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord16(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord16: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord17(afnGrp, fnSrc): mod=00 (mem:dst)  reg=010 (afnGrp[2])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord17: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord18(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord18: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord19(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord19: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord1A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord1A: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord1B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord1B: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord1C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord1C: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord1D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord1D: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord1E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord1E: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord1F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=011 (afnGrp[3])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord1F: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord20(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord20: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord21(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord21: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord22(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord22: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord23(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord23: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord24(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord24: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord25(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord25: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord26(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord26: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord27(afnGrp, fnSrc): mod=00 (mem:dst)  reg=100 (afnGrp[4])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord27: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord28(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord28: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord29(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord29: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord2A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord2A: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord2B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord2B: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord2C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord2C: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord2D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord2D: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord2E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord2E: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord2F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=101 (afnGrp[5])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord2F: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord30(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord30: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord31(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord31: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord32(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord32: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord33(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord33: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord34(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord34: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord35(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord35: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord36(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord36: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord37(afnGrp, fnSrc): mod=00 (mem:dst)  reg=110 (afnGrp[6])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord37: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord38(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord38: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord39(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord39: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord3A(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord3A: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord3B(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord3B: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord3C(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord3C: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.regSI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord3D(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord3D: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.regDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord3E(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord3E: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpWord3F(afnGrp, fnSrc): mod=00 (mem:dst)  reg=111 (afnGrp[7])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord3F: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, this.regBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpWord40(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord40: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord41(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord41: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord42(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord42: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord43(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord43: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord44(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord44: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord45(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord45: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord46(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord46: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord47(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord47: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord48(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord48: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord49(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord49: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord4A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord4A: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord4B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord4B: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord4C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord4C: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord4D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord4D: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord4E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord4E: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord4F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord4F: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord50(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord50: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord51(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord51: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord52(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord52: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord53(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord53: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord54(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord54: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord55(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord55: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord56(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord56: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord57(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord57: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord58(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord58: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord59(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord59: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord5A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord5A: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord5B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord5B: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord5C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord5C: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord5D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord5D: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord5E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord5E: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord5F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord5F: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord60(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord60: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord61(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord61: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord62(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord62: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord63(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord63: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord64(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord64: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord65(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord65: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord66(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord66: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord67(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord67: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord68(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord68: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord69(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord69: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord6A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord6A: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord6B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord6B: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord6C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord6C: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord6D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord6D: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord6E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord6E: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord6F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord6F: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord70(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord70: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord71(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord71: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord72(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord72: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord73(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord73: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord74(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord74: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord75(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord75: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord76(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord76: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord77(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord77: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord78(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord78: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord79(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord79: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord7A(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord7A: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord7B(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord7B: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord7C(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord7C: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord7D(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord7D: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord7E(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord7E: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord7F(afnGrp, fnSrc): mod=01 (mem+d8:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord7F: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord80(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord80: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord81(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord81: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord82(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord82: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord83(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord83: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord84(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord84: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord85(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord85: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord86(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord86: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord87(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord87: function(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord88(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord88: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord89(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord89: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord8A(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord8A: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord8B(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord8B: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord8C(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord8C: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord8D(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord8D: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord8E(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord8E: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord8F(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord8F: function(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord90(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord90: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord91(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord91: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord92(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord92: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord93(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord93: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord94(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord94: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord95(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord95: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord96(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord96: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord97(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord97: function(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord98(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord98: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord99(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord99: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord9A(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord9A: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord9B(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord9B: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord9C(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord9C: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord9D(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord9D: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord9E(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord9E: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord9F(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWord9F: function(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA0(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA0: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordA1(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA1: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordA2(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA2: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordA3(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA3: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordA4(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA4: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA5(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA5: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA6(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA6: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA7(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA7: function(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA8(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA8: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordA9(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordA9: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordAA(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordAA: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordAB(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordAB: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordAC(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordAC: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordAD(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordAD: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordAE(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordAE: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordAF(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordAF: function(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB0(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB0: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordB1(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB1: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordB2(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB2: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordB3(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB3: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordB4(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB4: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB5(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB5: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB6(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB6: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB7(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB7: function(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB8(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB8: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordB9(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordB9: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordBA(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordBA: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordBB(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordBB: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordBC(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordBC: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regSI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordBD(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordBD: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordBE(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordBE: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordBF(afnGrp, fnSrc): mod=10 (mem+d16:dst)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordBF: function(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordC0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[0].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[0].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[0].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[0].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC4: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[0].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[0].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[0].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[0].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[1].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordC9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordC9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[1].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordCA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordCA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[1].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordCB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordCB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[1].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordCC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordCC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[1].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordCD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordCD: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[1].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordCE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordCE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[1].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordCF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordCF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[1].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[2].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[2].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[2].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[2].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD4: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[2].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[2].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[2].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[2].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[3].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordD9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordD9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[3].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordDA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordDA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[3].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordDB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordDB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[3].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordDC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordDC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[3].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordDD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordDD: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[3].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordDE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordDE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[3].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordDF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordDF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[3].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[4].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[4].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[4].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[4].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE4: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[4].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[4].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[4].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[4].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[5].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordE9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordE9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[5].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordEA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordEA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[5].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordEB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordEB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[5].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordEC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordEC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[5].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordED(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordED: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[5].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordEE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordEE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[5].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordEF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordEF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[5].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF0: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[6].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF1: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[6].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF2: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[6].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF3: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[6].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF4: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[6].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF5: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[6].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF6: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[6].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF7: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[6].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF8: function(afnGrp, fnSrc) {
        this.regAX = afnGrp[7].call(this, this.regAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiMemLo; this.backTrack.btiAH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordF9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordF9: function(afnGrp, fnSrc) {
        this.regCX = afnGrp[7].call(this, this.regCX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiMemLo; this.backTrack.btiCH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordFA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordFA: function(afnGrp, fnSrc) {
        this.regDX = afnGrp[7].call(this, this.regDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiMemLo; this.backTrack.btiDH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordFB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordFB: function(afnGrp, fnSrc) {
        this.regBX = afnGrp[7].call(this, this.regBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiMemLo; this.backTrack.btiBH = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordFC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordFC: function(afnGrp, fnSrc) {
        this.regSP = afnGrp[7].call(this, this.regSP, fnSrc.call(this));
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiMemLo; X86.BACKTRACK.SP_HI = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordFD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordFD: function(afnGrp, fnSrc) {
        this.regBP = afnGrp[7].call(this, this.regBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiMemLo; this.backTrack.btiBPHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordFE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordFE: function(afnGrp, fnSrc) {
        this.regSI = afnGrp[7].call(this, this.regSI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiMemLo; this.backTrack.btiSIHi = this.backTrack.btiMemHi;
        }
    },
    /**
     * opModGrpWordFF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpWordFF: function(afnGrp, fnSrc) {
        this.regDI = afnGrp[7].call(this, this.regDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiMemLo; this.backTrack.btiDIHi = this.backTrack.btiMemHi;
        }
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
