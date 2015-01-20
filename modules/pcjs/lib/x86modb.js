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

var X86ModB = {
    /**
     * opModMemByte00(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem00: function opModMemByte00(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte01(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem01: function opModMemByte01(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte02(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem02: function opModMemByte02(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte03(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem03: function opModMemByte03(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte04(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem04: function opModMemByte04(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte05(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem05: function opModMemByte05(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte06(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem06: function opModMemByte06(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte07(fn): mod=00 (mem:dst)  reg=000 (AL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem07: function opModMemByte07(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte08(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem08: function opModMemByte08(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte09(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem09: function opModMemByte09(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte0A(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem0A: function opModMemByte0A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte0B(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem0B: function opModMemByte0B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte0C(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem0C: function opModMemByte0C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte0D(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem0D: function opModMemByte0D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte0E(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem0E: function opModMemByte0E(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte0F(fn): mod=00 (mem:dst)  reg=001 (CL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem0F: function opModMemByte0F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte10(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem10: function opModMemByte10(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte11(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem11: function opModMemByte11(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte12(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem12: function opModMemByte12(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte13(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem13: function opModMemByte13(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte14(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem14: function opModMemByte14(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte15(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem15: function opModMemByte15(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte16(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem16: function opModMemByte16(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte17(fn): mod=00 (mem:dst)  reg=010 (DL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem17: function opModMemByte17(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte18(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem18: function opModMemByte18(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte19(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem19: function opModMemByte19(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte1A(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem1A: function opModMemByte1A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte1B(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem1B: function opModMemByte1B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte1C(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem1C: function opModMemByte1C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte1D(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem1D: function opModMemByte1D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte1E(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem1E: function opModMemByte1E(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte1F(fn): mod=00 (mem:dst)  reg=011 (BL:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem1F: function opModMemByte1F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte20(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem20: function opModMemByte20(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte21(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem21: function opModMemByte21(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte22(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem22: function opModMemByte22(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte23(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem23: function opModMemByte23(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte24(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem24: function opModMemByte24(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte25(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem25: function opModMemByte25(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte26(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem26: function opModMemByte26(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte27(fn): mod=00 (mem:dst)  reg=100 (AH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem27: function opModMemByte27(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte28(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem28: function opModMemByte28(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte29(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem29: function opModMemByte29(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte2A(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem2A: function opModMemByte2A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte2B(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem2B: function opModMemByte2B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte2C(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem2C: function opModMemByte2C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte2D(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem2D: function opModMemByte2D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte2E(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem2E: function opModMemByte2E(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte2F(fn): mod=00 (mem:dst)  reg=101 (CH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem2F: function opModMemByte2F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte30(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem30: function opModMemByte30(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte31(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem31: function opModMemByte31(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte32(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem32: function opModMemByte32(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte33(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem33: function opModMemByte33(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte34(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem34: function opModMemByte34(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte35(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem35: function opModMemByte35(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte36(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem36: function opModMemByte36(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte37(fn): mod=00 (mem:dst)  reg=110 (DH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem37: function opModMemByte37(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte38(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem38: function opModMemByte38(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte39(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem39: function opModMemByte39(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte3A(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem3A: function opModMemByte3A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte3B(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem3B: function opModMemByte3B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte3C(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem3C: function opModMemByte3C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte3D(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem3D: function opModMemByte3D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte3E(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem3E: function opModMemByte3E(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte3F(fn): mod=00 (mem:dst)  reg=111 (BH:src)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem3F: function opModMemByte3F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte40(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem40: function opModMemByte40(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte41(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem41: function opModMemByte41(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte42(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem42: function opModMemByte42(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte43(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem43: function opModMemByte43(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte44(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem44: function opModMemByte44(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte45(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem45: function opModMemByte45(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte46(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem46: function opModMemByte46(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte47(fn): mod=01 (mem+d8:dst)  reg=000 (AL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem47: function opModMemByte47(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte48(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem48: function opModMemByte48(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte49(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem49: function opModMemByte49(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte4A(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem4A: function opModMemByte4A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte4B(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem4B: function opModMemByte4B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte4C(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem4C: function opModMemByte4C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4D(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem4D: function opModMemByte4D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4E(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem4E: function opModMemByte4E(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4F(fn): mod=01 (mem+d8:dst)  reg=001 (CL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem4F: function opModMemByte4F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte50(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem50: function opModMemByte50(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte51(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem51: function opModMemByte51(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte52(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem52: function opModMemByte52(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte53(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem53: function opModMemByte53(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte54(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem54: function opModMemByte54(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte55(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem55: function opModMemByte55(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte56(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem56: function opModMemByte56(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte57(fn): mod=01 (mem+d8:dst)  reg=010 (DL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem57: function opModMemByte57(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte58(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem58: function opModMemByte58(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte59(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem59: function opModMemByte59(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte5A(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem5A: function opModMemByte5A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte5B(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem5B: function opModMemByte5B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte5C(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem5C: function opModMemByte5C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5D(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem5D: function opModMemByte5D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5E(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem5E: function opModMemByte5E(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5F(fn): mod=01 (mem+d8:dst)  reg=011 (BL:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem5F: function opModMemByte5F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte60(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem60: function opModMemByte60(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte61(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem61: function opModMemByte61(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte62(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem62: function opModMemByte62(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte63(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem63: function opModMemByte63(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte64(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem64: function opModMemByte64(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte65(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem65: function opModMemByte65(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte66(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem66: function opModMemByte66(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte67(fn): mod=01 (mem+d8:dst)  reg=100 (AH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem67: function opModMemByte67(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte68(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem68: function opModMemByte68(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte69(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem69: function opModMemByte69(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte6A(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem6A: function opModMemByte6A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte6B(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem6B: function opModMemByte6B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte6C(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem6C: function opModMemByte6C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6D(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem6D: function opModMemByte6D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6E(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem6E: function opModMemByte6E(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6F(fn): mod=01 (mem+d8:dst)  reg=101 (CH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem6F: function opModMemByte6F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte70(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem70: function opModMemByte70(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte71(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem71: function opModMemByte71(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte72(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem72: function opModMemByte72(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte73(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem73: function opModMemByte73(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte74(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem74: function opModMemByte74(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte75(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem75: function opModMemByte75(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte76(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem76: function opModMemByte76(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte77(fn): mod=01 (mem+d8:dst)  reg=110 (DH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem77: function opModMemByte77(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte78(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem78: function opModMemByte78(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte79(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem79: function opModMemByte79(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte7A(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem7A: function opModMemByte7A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte7B(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem7B: function opModMemByte7B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte7C(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem7C: function opModMemByte7C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7D(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem7D: function opModMemByte7D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7E(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem7E: function opModMemByte7E(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7F(fn): mod=01 (mem+d8:dst)  reg=111 (BH:src)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem7F: function opModMemByte7F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte80(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem80: function opModMemByte80(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte81(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem81: function opModMemByte81(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte82(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem82: function opModMemByte82(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte83(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem83: function opModMemByte83(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte84(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem84: function opModMemByte84(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte85(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem85: function opModMemByte85(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte86(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem86: function opModMemByte86(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte87(fn): mod=10 (mem+d16:dst)  reg=000 (AL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem87: function opModMemByte87(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte88(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem88: function opModMemByte88(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte89(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem89: function opModMemByte89(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte8A(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem8A: function opModMemByte8A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte8B(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem8B: function opModMemByte8B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte8C(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem8C: function opModMemByte8C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8D(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem8D: function opModMemByte8D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8E(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem8E: function opModMemByte8E(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8F(fn): mod=10 (mem+d16:dst)  reg=001 (CL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem8F: function opModMemByte8F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte90(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem90: function opModMemByte90(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte91(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem91: function opModMemByte91(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte92(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem92: function opModMemByte92(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte93(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem93: function opModMemByte93(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte94(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem94: function opModMemByte94(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte95(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem95: function opModMemByte95(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte96(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem96: function opModMemByte96(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte97(fn): mod=10 (mem+d16:dst)  reg=010 (DL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem97: function opModMemByte97(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte98(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem98: function opModMemByte98(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte99(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem99: function opModMemByte99(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte9A(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem9A: function opModMemByte9A(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte9B(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem9B: function opModMemByte9B(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte9C(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem9C: function opModMemByte9C(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9D(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem9D: function opModMemByte9D(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9E(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem9E: function opModMemByte9E(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9F(fn): mod=10 (mem+d16:dst)  reg=011 (BL:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem9F: function opModMemByte9F(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA0(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA0: function opModMemByteA0(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA1(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA1: function opModMemByteA1(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteA2(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA2: function opModMemByteA2(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteA3(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA3: function opModMemByteA3(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA4(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA4: function opModMemByteA4(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA5(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA5: function opModMemByteA5(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA6(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA6: function opModMemByteA6(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA7(fn): mod=10 (mem+d16:dst)  reg=100 (AH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA7: function opModMemByteA7(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA8(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA8: function opModMemByteA8(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA9(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemA9: function opModMemByteA9(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteAA(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemAA: function opModMemByteAA(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteAB(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemAB: function opModMemByteAB(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteAC(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemAC: function opModMemByteAC(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAD(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemAD: function opModMemByteAD(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAE(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemAE: function opModMemByteAE(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAF(fn): mod=10 (mem+d16:dst)  reg=101 (CH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemAF: function opModMemByteAF(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB0(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB0: function opModMemByteB0(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB1(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB1: function opModMemByteB1(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteB2(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB2: function opModMemByteB2(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteB3(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB3: function opModMemByteB3(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB4(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB4: function opModMemByteB4(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB5(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB5: function opModMemByteB5(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB6(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB6: function opModMemByteB6(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB7(fn): mod=10 (mem+d16:dst)  reg=110 (DH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB7: function opModMemByteB7(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB8(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB8: function opModMemByteB8(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB9(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemB9: function opModMemByteB9(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteBA(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemBA: function opModMemByteBA(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteBB(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemBB: function opModMemByteBB(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteBC(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemBC: function opModMemByteBC(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBD(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemBD: function opModMemByteBD(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBE(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemBE: function opModMemByteBE(fn) {
        var b = fn.call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBF(fn): mod=10 (mem+d16:dst)  reg=111 (BH:src)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMemBF: function opModMemByteBF(fn) {
        var b = fn.call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte00(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg00: function opModRegByte00(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte01(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg01: function opModRegByte01(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte02(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg02: function opModRegByte02(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte03(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg03: function opModRegByte03(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte04(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg04: function opModRegByte04(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte05(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg05: function opModRegByte05(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte06(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg06: function opModRegByte06(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte07(fn): mod=00 (mem:src)  reg=000 (AL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg07: function opModRegByte07(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte08(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg08: function opModRegByte08(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte09(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg09: function opModRegByte09(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte0A(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0A: function opModRegByte0A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte0B(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0B: function opModRegByte0B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte0C(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0C: function opModRegByte0C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte0D(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0D: function opModRegByte0D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte0E(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0E: function opModRegByte0E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte0F(fn): mod=00 (mem:src)  reg=001 (CL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0F: function opModRegByte0F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte10(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg10: function opModRegByte10(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte11(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg11: function opModRegByte11(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte12(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg12: function opModRegByte12(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte13(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg13: function opModRegByte13(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte14(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg14: function opModRegByte14(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte15(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg15: function opModRegByte15(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte16(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg16: function opModRegByte16(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte17(fn): mod=00 (mem:src)  reg=010 (DL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg17: function opModRegByte17(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte18(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg18: function opModRegByte18(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte19(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg19: function opModRegByte19(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte1A(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1A: function opModRegByte1A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte1B(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1B: function opModRegByte1B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte1C(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1C: function opModRegByte1C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte1D(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1D: function opModRegByte1D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte1E(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1E: function opModRegByte1E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte1F(fn): mod=00 (mem:src)  reg=011 (BL:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1F: function opModRegByte1F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte20(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg20: function opModRegByte20(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte21(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg21: function opModRegByte21(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte22(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg22: function opModRegByte22(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte23(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg23: function opModRegByte23(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte24(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg24: function opModRegByte24(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte25(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg25: function opModRegByte25(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte26(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg26: function opModRegByte26(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte27(fn): mod=00 (mem:src)  reg=100 (AH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg27: function opModRegByte27(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte28(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg28: function opModRegByte28(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte29(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg29: function opModRegByte29(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte2A(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2A: function opModRegByte2A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte2B(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2B: function opModRegByte2B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte2C(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2C: function opModRegByte2C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte2D(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2D: function opModRegByte2D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte2E(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2E: function opModRegByte2E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte2F(fn): mod=00 (mem:src)  reg=101 (CH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2F: function opModRegByte2F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte30(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg30: function opModRegByte30(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte31(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg31: function opModRegByte31(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte32(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg32: function opModRegByte32(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte33(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg33: function opModRegByte33(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte34(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg34: function opModRegByte34(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte35(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg35: function opModRegByte35(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte36(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg36: function opModRegByte36(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte37(fn): mod=00 (mem:src)  reg=110 (DH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg37: function opModRegByte37(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte38(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg38: function opModRegByte38(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte39(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg39: function opModRegByte39(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte3A(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3A: function opModRegByte3A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte3B(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3B: function opModRegByte3B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte3C(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3C: function opModRegByte3C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, (this.regESI & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte3D(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3D: function opModRegByte3D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEDI & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte3E(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3E: function opModRegByte3E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte3F(fn): mod=00 (mem:src)  reg=111 (BH:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3F: function opModRegByte3F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, (this.regEBX & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte40(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg40: function opModRegByte40(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte41(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg41: function opModRegByte41(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte42(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg42: function opModRegByte42(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte43(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg43: function opModRegByte43(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte44(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg44: function opModRegByte44(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte45(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg45: function opModRegByte45(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte46(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg46: function opModRegByte46(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte47(fn): mod=01 (mem+d8:src)  reg=000 (AL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg47: function opModRegByte47(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte48(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg48: function opModRegByte48(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte49(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg49: function opModRegByte49(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte4A(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4A: function opModRegByte4A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte4B(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4B: function opModRegByte4B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte4C(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4C: function opModRegByte4C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4D(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4D: function opModRegByte4D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4E(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4E: function opModRegByte4E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4F(fn): mod=01 (mem+d8:src)  reg=001 (CL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4F: function opModRegByte4F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte50(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg50: function opModRegByte50(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte51(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg51: function opModRegByte51(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte52(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg52: function opModRegByte52(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte53(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg53: function opModRegByte53(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte54(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg54: function opModRegByte54(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte55(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg55: function opModRegByte55(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte56(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg56: function opModRegByte56(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte57(fn): mod=01 (mem+d8:src)  reg=010 (DL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg57: function opModRegByte57(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte58(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg58: function opModRegByte58(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte59(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg59: function opModRegByte59(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte5A(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5A: function opModRegByte5A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte5B(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5B: function opModRegByte5B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte5C(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5C: function opModRegByte5C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5D(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5D: function opModRegByte5D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5E(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5E: function opModRegByte5E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5F(fn): mod=01 (mem+d8:src)  reg=011 (BL:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5F: function opModRegByte5F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte60(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg60: function opModRegByte60(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte61(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg61: function opModRegByte61(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte62(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg62: function opModRegByte62(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte63(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg63: function opModRegByte63(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte64(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg64: function opModRegByte64(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte65(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg65: function opModRegByte65(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte66(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg66: function opModRegByte66(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte67(fn): mod=01 (mem+d8:src)  reg=100 (AH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg67: function opModRegByte67(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte68(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg68: function opModRegByte68(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte69(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg69: function opModRegByte69(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte6A(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6A: function opModRegByte6A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte6B(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6B: function opModRegByte6B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte6C(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6C: function opModRegByte6C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6D(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6D: function opModRegByte6D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6E(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6E: function opModRegByte6E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6F(fn): mod=01 (mem+d8:src)  reg=101 (CH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6F: function opModRegByte6F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte70(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg70: function opModRegByte70(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte71(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg71: function opModRegByte71(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte72(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg72: function opModRegByte72(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte73(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg73: function opModRegByte73(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte74(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg74: function opModRegByte74(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte75(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg75: function opModRegByte75(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte76(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg76: function opModRegByte76(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte77(fn): mod=01 (mem+d8:src)  reg=110 (DH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg77: function opModRegByte77(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte78(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg78: function opModRegByte78(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte79(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg79: function opModRegByte79(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte7A(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7A: function opModRegByte7A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte7B(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7B: function opModRegByte7B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte7C(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7C: function opModRegByte7C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7D(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7D: function opModRegByte7D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7E(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7E: function opModRegByte7E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7F(fn): mod=01 (mem+d8:src)  reg=111 (BH:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7F: function opModRegByte7F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte80(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg80: function opModRegByte80(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte81(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg81: function opModRegByte81(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte82(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg82: function opModRegByte82(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte83(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg83: function opModRegByte83(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte84(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg84: function opModRegByte84(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte85(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg85: function opModRegByte85(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte86(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg86: function opModRegByte86(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte87(fn): mod=10 (mem+d16:src)  reg=000 (AL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg87: function opModRegByte87(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte88(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg88: function opModRegByte88(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte89(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg89: function opModRegByte89(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte8A(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8A: function opModRegByte8A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte8B(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8B: function opModRegByte8B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte8C(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8C: function opModRegByte8C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8D(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8D: function opModRegByte8D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8E(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8E: function opModRegByte8E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8F(fn): mod=10 (mem+d16:src)  reg=001 (CL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8F: function opModRegByte8F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte90(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg90: function opModRegByte90(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte91(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg91: function opModRegByte91(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte92(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg92: function opModRegByte92(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte93(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg93: function opModRegByte93(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte94(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg94: function opModRegByte94(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte95(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg95: function opModRegByte95(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte96(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg96: function opModRegByte96(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte97(fn): mod=10 (mem+d16:src)  reg=010 (DL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg97: function opModRegByte97(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte98(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg98: function opModRegByte98(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte99(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg99: function opModRegByte99(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte9A(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9A: function opModRegByte9A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte9B(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9B: function opModRegByte9B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte9C(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9C: function opModRegByte9C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9D(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9D: function opModRegByte9D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9E(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9E: function opModRegByte9E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9F(fn): mod=10 (mem+d16:src)  reg=011 (BL:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9F: function opModRegByte9F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA0(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA0: function opModRegByteA0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA1(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA1: function opModRegByteA1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteA2(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA2: function opModRegByteA2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteA3(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA3: function opModRegByteA3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA4(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA4: function opModRegByteA4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA5(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA5: function opModRegByteA5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA6(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA6: function opModRegByteA6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA7(fn): mod=10 (mem+d16:src)  reg=100 (AH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA7: function opModRegByteA7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA8(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA8: function opModRegByteA8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA9(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA9: function opModRegByteA9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteAA(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAA: function opModRegByteAA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteAB(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAB: function opModRegByteAB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteAC(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAC: function opModRegByteAC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAD(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAD: function opModRegByteAD(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAE(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAE: function opModRegByteAE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAF(fn): mod=10 (mem+d16:src)  reg=101 (CH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAF: function opModRegByteAF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB0(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB0: function opModRegByteB0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB1(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB1: function opModRegByteB1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteB2(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB2: function opModRegByteB2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteB3(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB3: function opModRegByteB3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB4(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB4: function opModRegByteB4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB5(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB5: function opModRegByteB5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB6(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB6: function opModRegByteB6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB7(fn): mod=10 (mem+d16:src)  reg=110 (DH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB7: function opModRegByteB7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB8(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB8: function opModRegByteB8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB9(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB9: function opModRegByteB9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteBA(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBA: function opModRegByteBA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteBB(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBB: function opModRegByteBB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteBC(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBC: function opModRegByteBC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBD(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBD: function opModRegByteBD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBE(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBE: function opModRegByteBE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBF(fn): mod=10 (mem+d16:src)  reg=111 (BH:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBF: function opModRegByteBF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteC0(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC0: function opModRegByteC0(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
    },
    /**
     * opModRegByteC1(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC1: function opModRegByteC1(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteC2(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC2: function opModRegByteC2(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteC3(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC3: function opModRegByteC3(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteC4(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC4: function opModRegByteC4(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteC5(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC5: function opModRegByteC5(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteC6(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC6: function opModRegByteC6(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteC7(fn): mod=11 (reg:src)  reg=000 (AL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC7: function opModRegByteC7(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteC8(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC8: function opModRegByteC8(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteC9(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC9: function opModRegByteC9(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
    },
    /**
     * opModRegByteCA(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegCA: function opModRegByteCA(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteCB(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegCB: function opModRegByteCB(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteCC(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegCC: function opModRegByteCC(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteCD(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegCD: function opModRegByteCD(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteCE(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegCE: function opModRegByteCE(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteCF(fn): mod=11 (reg:src)  reg=001 (CL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegCF: function opModRegByteCF(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteD0(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD0: function opModRegByteD0(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteD1(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD1: function opModRegByteD1(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteD2(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD2: function opModRegByteD2(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
    },
    /**
     * opModRegByteD3(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD3: function opModRegByteD3(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteD4(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD4: function opModRegByteD4(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteD5(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD5: function opModRegByteD5(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteD6(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD6: function opModRegByteD6(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteD7(fn): mod=11 (reg:src)  reg=010 (DL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD7: function opModRegByteD7(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteD8(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD8: function opModRegByteD8(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteD9(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD9: function opModRegByteD9(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteDA(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegDA: function opModRegByteDA(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteDB(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegDB: function opModRegByteDB(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
    },
    /**
     * opModRegByteDC(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegDC: function opModRegByteDC(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteDD(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegDD: function opModRegByteDD(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteDE(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegDE: function opModRegByteDE(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteDF(fn): mod=11 (reg:src)  reg=011 (BL:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegDF: function opModRegByteDF(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteE0(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE0: function opModRegByteE0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteE1(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE1: function opModRegByteE1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteE2(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE2: function opModRegByteE2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteE3(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE3: function opModRegByteE3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteE4(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE4: function opModRegByteE4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
    },
    /**
     * opModRegByteE5(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE5: function opModRegByteE5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteE6(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE6: function opModRegByteE6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteE7(fn): mod=11 (reg:src)  reg=100 (AH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE7: function opModRegByteE7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteE8(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE8: function opModRegByteE8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteE9(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE9: function opModRegByteE9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteEA(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegEA: function opModRegByteEA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteEB(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegEB: function opModRegByteEB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteEC(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegEC: function opModRegByteEC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteED(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegED: function opModRegByteED(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
    },
    /**
     * opModRegByteEE(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegEE: function opModRegByteEE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteEF(fn): mod=11 (reg:src)  reg=101 (CH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegEF: function opModRegByteEF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteF0(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF0: function opModRegByteF0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteF1(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF1: function opModRegByteF1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteF2(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF2: function opModRegByteF2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteF3(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF3: function opModRegByteF3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteF4(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF4: function opModRegByteF4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteF5(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF5: function opModRegByteF5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteF6(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF6: function opModRegByteF6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
    },
    /**
     * opModRegByteF7(fn): mod=11 (reg:src)  reg=110 (DH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF7: function opModRegByteF7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteF8(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF8: function opModRegByteF8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteF9(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF9: function opModRegByteF9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteFA(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegFA: function opModRegByteFA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteFB(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegFB: function opModRegByteFB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteFC(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegFC: function opModRegByteFC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteFD(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegFD: function opModRegByteFD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteFE(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegFE: function opModRegByteFE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteFF(fn): mod=11 (reg:src)  reg=111 (BH:dst)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegFF: function opModRegByteFF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
    },
    /**
     * opModGrpByte00(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrp00: function opModGrpByte00(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp01: function opModGrpByte01(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp02: function opModGrpByte02(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp03: function opModGrpByte03(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp04: function opModGrpByte04(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp05: function opModGrpByte05(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp06: function opModGrpByte06(afnGrp, fnSrc) {
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
    opModGrp07: function opModGrpByte07(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp08: function opModGrpByte08(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp09: function opModGrpByte09(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp0A: function opModGrpByte0A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp0B: function opModGrpByte0B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp0C: function opModGrpByte0C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp0D: function opModGrpByte0D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp0E: function opModGrpByte0E(afnGrp, fnSrc) {
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
    opModGrp0F: function opModGrpByte0F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp10: function opModGrpByte10(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp11: function opModGrpByte11(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp12: function opModGrpByte12(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp13: function opModGrpByte13(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp14: function opModGrpByte14(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp15: function opModGrpByte15(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp16: function opModGrpByte16(afnGrp, fnSrc) {
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
    opModGrp17: function opModGrpByte17(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp18: function opModGrpByte18(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp19: function opModGrpByte19(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp1A: function opModGrpByte1A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp1B: function opModGrpByte1B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp1C: function opModGrpByte1C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp1D: function opModGrpByte1D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp1E: function opModGrpByte1E(afnGrp, fnSrc) {
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
    opModGrp1F: function opModGrpByte1F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp20: function opModGrpByte20(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp21: function opModGrpByte21(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp22: function opModGrpByte22(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp23: function opModGrpByte23(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp24: function opModGrpByte24(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp25: function opModGrpByte25(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp26: function opModGrpByte26(afnGrp, fnSrc) {
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
    opModGrp27: function opModGrpByte27(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp28: function opModGrpByte28(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp29: function opModGrpByte29(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp2A: function opModGrpByte2A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp2B: function opModGrpByte2B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp2C: function opModGrpByte2C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp2D: function opModGrpByte2D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp2E: function opModGrpByte2E(afnGrp, fnSrc) {
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
    opModGrp2F: function opModGrpByte2F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp30: function opModGrpByte30(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp31: function opModGrpByte31(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp32: function opModGrpByte32(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp33: function opModGrpByte33(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp34: function opModGrpByte34(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp35: function opModGrpByte35(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp36: function opModGrpByte36(afnGrp, fnSrc) {
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
    opModGrp37: function opModGrpByte37(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp38: function opModGrpByte38(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp39: function opModGrpByte39(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp3A: function opModGrpByte3A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp3B: function opModGrpByte3B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp3C: function opModGrpByte3C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp3D: function opModGrpByte3D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp3E: function opModGrpByte3E(afnGrp, fnSrc) {
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
    opModGrp3F: function opModGrpByte3F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp40: function opModGrpByte40(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp41: function opModGrpByte41(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp42: function opModGrpByte42(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp43: function opModGrpByte43(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp44: function opModGrpByte44(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp45: function opModGrpByte45(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp46: function opModGrpByte46(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp47: function opModGrpByte47(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp48: function opModGrpByte48(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp49: function opModGrpByte49(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4A: function opModGrpByte4A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4B: function opModGrpByte4B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4C: function opModGrpByte4C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4D: function opModGrpByte4D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4E: function opModGrpByte4E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4F: function opModGrpByte4F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp50: function opModGrpByte50(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp51: function opModGrpByte51(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp52: function opModGrpByte52(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp53: function opModGrpByte53(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp54: function opModGrpByte54(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp55: function opModGrpByte55(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp56: function opModGrpByte56(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp57: function opModGrpByte57(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp58: function opModGrpByte58(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp59: function opModGrpByte59(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5A: function opModGrpByte5A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5B: function opModGrpByte5B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5C: function opModGrpByte5C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5D: function opModGrpByte5D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5E: function opModGrpByte5E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5F: function opModGrpByte5F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp60: function opModGrpByte60(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp61: function opModGrpByte61(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp62: function opModGrpByte62(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp63: function opModGrpByte63(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp64: function opModGrpByte64(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp65: function opModGrpByte65(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp66: function opModGrpByte66(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp67: function opModGrpByte67(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp68: function opModGrpByte68(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp69: function opModGrpByte69(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6A: function opModGrpByte6A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6B: function opModGrpByte6B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6C: function opModGrpByte6C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6D: function opModGrpByte6D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6E: function opModGrpByte6E(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6F: function opModGrpByte6F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp70: function opModGrpByte70(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp71: function opModGrpByte71(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp72: function opModGrpByte72(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp73: function opModGrpByte73(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp74: function opModGrpByte74(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp75: function opModGrpByte75(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp76: function opModGrpByte76(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp77: function opModGrpByte77(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp78: function opModGrpByte78(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp79: function opModGrpByte79(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7A: function opModGrpByte7A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7B: function opModGrpByte7B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7C: function opModGrpByte7C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7D: function opModGrpByte7D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7E: function opModGrpByte7E(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7F: function opModGrpByte7F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp80: function opModGrpByte80(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp81: function opModGrpByte81(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp82: function opModGrpByte82(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp83: function opModGrpByte83(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp84: function opModGrpByte84(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp85: function opModGrpByte85(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp86: function opModGrpByte86(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp87: function opModGrpByte87(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp88: function opModGrpByte88(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp89: function opModGrpByte89(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8A: function opModGrpByte8A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8B: function opModGrpByte8B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8C: function opModGrpByte8C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8D: function opModGrpByte8D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8E: function opModGrpByte8E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8F: function opModGrpByte8F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp90: function opModGrpByte90(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp91: function opModGrpByte91(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp92: function opModGrpByte92(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp93: function opModGrpByte93(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp94: function opModGrpByte94(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp95: function opModGrpByte95(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp96: function opModGrpByte96(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp97: function opModGrpByte97(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp98: function opModGrpByte98(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp99: function opModGrpByte99(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9A: function opModGrpByte9A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9B: function opModGrpByte9B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9C: function opModGrpByte9C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9D: function opModGrpByte9D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9E: function opModGrpByte9E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9F: function opModGrpByte9F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA0: function opModGrpByteA0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA1: function opModGrpByteA1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA2: function opModGrpByteA2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA3: function opModGrpByteA3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA4: function opModGrpByteA4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA5: function opModGrpByteA5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA6: function opModGrpByteA6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA7: function opModGrpByteA7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA8: function opModGrpByteA8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA9: function opModGrpByteA9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAA: function opModGrpByteAA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAB: function opModGrpByteAB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAC: function opModGrpByteAC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAD: function opModGrpByteAD(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAE: function opModGrpByteAE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAF: function opModGrpByteAF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB0: function opModGrpByteB0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB1: function opModGrpByteB1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB2: function opModGrpByteB2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB3: function opModGrpByteB3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB4: function opModGrpByteB4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB5: function opModGrpByteB5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB6: function opModGrpByteB6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB7: function opModGrpByteB7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB8: function opModGrpByteB8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB9: function opModGrpByteB9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBA: function opModGrpByteBA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBB: function opModGrpByteBB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBC: function opModGrpByteBC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBD: function opModGrpByteBD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBE: function opModGrpByteBE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBF: function opModGrpByteBF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByte(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpC0: function opModGrpByteC0(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC1: function opModGrpByteC1(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC2: function opModGrpByteC2(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC3: function opModGrpByteC3(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC4: function opModGrpByteC4(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC5: function opModGrpByteC5(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC6: function opModGrpByteC6(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC7: function opModGrpByteC7(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC8: function opModGrpByteC8(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC9: function opModGrpByteC9(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCA: function opModGrpByteCA(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCB: function opModGrpByteCB(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCC: function opModGrpByteCC(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCD: function opModGrpByteCD(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCE: function opModGrpByteCE(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCF: function opModGrpByteCF(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD0: function opModGrpByteD0(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD1: function opModGrpByteD1(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD2: function opModGrpByteD2(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD3: function opModGrpByteD3(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD4: function opModGrpByteD4(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD5: function opModGrpByteD5(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD6: function opModGrpByteD6(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD7: function opModGrpByteD7(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD8: function opModGrpByteD8(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD9: function opModGrpByteD9(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDA: function opModGrpByteDA(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDB: function opModGrpByteDB(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDC: function opModGrpByteDC(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDD: function opModGrpByteDD(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDE: function opModGrpByteDE(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDF: function opModGrpByteDF(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE0: function opModGrpByteE0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE1: function opModGrpByteE1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE2: function opModGrpByteE2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE3: function opModGrpByteE3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE4: function opModGrpByteE4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE5: function opModGrpByteE5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE6: function opModGrpByteE6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE7: function opModGrpByteE7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE8: function opModGrpByteE8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE9: function opModGrpByteE9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEA: function opModGrpByteEA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEB: function opModGrpByteEB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEC: function opModGrpByteEC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteED(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpED: function opModGrpByteED(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEE: function opModGrpByteEE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEF: function opModGrpByteEF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF0: function opModGrpByteF0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF1: function opModGrpByteF1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF2: function opModGrpByteF2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF3: function opModGrpByteF3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF4: function opModGrpByteF4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF5: function opModGrpByteF5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF6: function opModGrpByteF6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF7: function opModGrpByteF7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF8: function opModGrpByteF8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF9: function opModGrpByteF9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFA: function opModGrpByteFA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFB: function opModGrpByteFB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFC: function opModGrpByteFC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFD: function opModGrpByteFD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFE: function opModGrpByteFE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFF: function opModGrpByteFF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    }
};

X86ModB.aOpModMem = [
    X86ModB.opModMem00,     X86ModB.opModMem01,     X86ModB.opModMem02,     X86ModB.opModMem03,
    X86ModB.opModMem04,     X86ModB.opModMem05,     X86ModB.opModMem06,     X86ModB.opModMem07,
    X86ModB.opModMem08,     X86ModB.opModMem09,     X86ModB.opModMem0A,     X86ModB.opModMem0B,
    X86ModB.opModMem0C,     X86ModB.opModMem0D,     X86ModB.opModMem0E,     X86ModB.opModMem0F,
    X86ModB.opModMem10,     X86ModB.opModMem11,     X86ModB.opModMem12,     X86ModB.opModMem13,
    X86ModB.opModMem14,     X86ModB.opModMem15,     X86ModB.opModMem16,     X86ModB.opModMem17,
    X86ModB.opModMem18,     X86ModB.opModMem19,     X86ModB.opModMem1A,     X86ModB.opModMem1B,
    X86ModB.opModMem1C,     X86ModB.opModMem1D,     X86ModB.opModMem1E,     X86ModB.opModMem1F,
    X86ModB.opModMem20,     X86ModB.opModMem21,     X86ModB.opModMem22,     X86ModB.opModMem23,
    X86ModB.opModMem24,     X86ModB.opModMem25,     X86ModB.opModMem26,     X86ModB.opModMem27,
    X86ModB.opModMem28,     X86ModB.opModMem29,     X86ModB.opModMem2A,     X86ModB.opModMem2B,
    X86ModB.opModMem2C,     X86ModB.opModMem2D,     X86ModB.opModMem2E,     X86ModB.opModMem2F,
    X86ModB.opModMem30,     X86ModB.opModMem31,     X86ModB.opModMem32,     X86ModB.opModMem33,
    X86ModB.opModMem34,     X86ModB.opModMem35,     X86ModB.opModMem36,     X86ModB.opModMem37,
    X86ModB.opModMem38,     X86ModB.opModMem39,     X86ModB.opModMem3A,     X86ModB.opModMem3B,
    X86ModB.opModMem3C,     X86ModB.opModMem3D,     X86ModB.opModMem3E,     X86ModB.opModMem3F,
    X86ModB.opModMem40,     X86ModB.opModMem41,     X86ModB.opModMem42,     X86ModB.opModMem43,
    X86ModB.opModMem44,     X86ModB.opModMem45,     X86ModB.opModMem46,     X86ModB.opModMem47,
    X86ModB.opModMem48,     X86ModB.opModMem49,     X86ModB.opModMem4A,     X86ModB.opModMem4B,
    X86ModB.opModMem4C,     X86ModB.opModMem4D,     X86ModB.opModMem4E,     X86ModB.opModMem4F,
    X86ModB.opModMem50,     X86ModB.opModMem51,     X86ModB.opModMem52,     X86ModB.opModMem53,
    X86ModB.opModMem54,     X86ModB.opModMem55,     X86ModB.opModMem56,     X86ModB.opModMem57,
    X86ModB.opModMem58,     X86ModB.opModMem59,     X86ModB.opModMem5A,     X86ModB.opModMem5B,
    X86ModB.opModMem5C,     X86ModB.opModMem5D,     X86ModB.opModMem5E,     X86ModB.opModMem5F,
    X86ModB.opModMem60,     X86ModB.opModMem61,     X86ModB.opModMem62,     X86ModB.opModMem63,
    X86ModB.opModMem64,     X86ModB.opModMem65,     X86ModB.opModMem66,     X86ModB.opModMem67,
    X86ModB.opModMem68,     X86ModB.opModMem69,     X86ModB.opModMem6A,     X86ModB.opModMem6B,
    X86ModB.opModMem6C,     X86ModB.opModMem6D,     X86ModB.opModMem6E,     X86ModB.opModMem6F,
    X86ModB.opModMem70,     X86ModB.opModMem71,     X86ModB.opModMem72,     X86ModB.opModMem73,
    X86ModB.opModMem74,     X86ModB.opModMem75,     X86ModB.opModMem76,     X86ModB.opModMem77,
    X86ModB.opModMem78,     X86ModB.opModMem79,     X86ModB.opModMem7A,     X86ModB.opModMem7B,
    X86ModB.opModMem7C,     X86ModB.opModMem7D,     X86ModB.opModMem7E,     X86ModB.opModMem7F,
    X86ModB.opModMem80,     X86ModB.opModMem81,     X86ModB.opModMem82,     X86ModB.opModMem83,
    X86ModB.opModMem84,     X86ModB.opModMem85,     X86ModB.opModMem86,     X86ModB.opModMem87,
    X86ModB.opModMem88,     X86ModB.opModMem89,     X86ModB.opModMem8A,     X86ModB.opModMem8B,
    X86ModB.opModMem8C,     X86ModB.opModMem8D,     X86ModB.opModMem8E,     X86ModB.opModMem8F,
    X86ModB.opModMem90,     X86ModB.opModMem91,     X86ModB.opModMem92,     X86ModB.opModMem93,
    X86ModB.opModMem94,     X86ModB.opModMem95,     X86ModB.opModMem96,     X86ModB.opModMem97,
    X86ModB.opModMem98,     X86ModB.opModMem99,     X86ModB.opModMem9A,     X86ModB.opModMem9B,
    X86ModB.opModMem9C,     X86ModB.opModMem9D,     X86ModB.opModMem9E,     X86ModB.opModMem9F,
    X86ModB.opModMemA0,     X86ModB.opModMemA1,     X86ModB.opModMemA2,     X86ModB.opModMemA3,
    X86ModB.opModMemA4,     X86ModB.opModMemA5,     X86ModB.opModMemA6,     X86ModB.opModMemA7,
    X86ModB.opModMemA8,     X86ModB.opModMemA9,     X86ModB.opModMemAA,     X86ModB.opModMemAB,
    X86ModB.opModMemAC,     X86ModB.opModMemAD,     X86ModB.opModMemAE,     X86ModB.opModMemAF,
    X86ModB.opModMemB0,     X86ModB.opModMemB1,     X86ModB.opModMemB2,     X86ModB.opModMemB3,
    X86ModB.opModMemB4,     X86ModB.opModMemB5,     X86ModB.opModMemB6,     X86ModB.opModMemB7,
    X86ModB.opModMemB8,     X86ModB.opModMemB9,     X86ModB.opModMemBA,     X86ModB.opModMemBB,
    X86ModB.opModMemBC,     X86ModB.opModMemBD,     X86ModB.opModMemBE,     X86ModB.opModMemBF,
    X86ModB.opModRegC0,     X86ModB.opModRegC8,     X86ModB.opModRegD0,     X86ModB.opModRegD8,
    X86ModB.opModRegE0,     X86ModB.opModRegE8,     X86ModB.opModRegF0,     X86ModB.opModRegF8,
    X86ModB.opModRegC1,     X86ModB.opModRegC9,     X86ModB.opModRegD1,     X86ModB.opModRegD9,
    X86ModB.opModRegE1,     X86ModB.opModRegE9,     X86ModB.opModRegF1,     X86ModB.opModRegF9,
    X86ModB.opModRegC2,     X86ModB.opModRegCA,     X86ModB.opModRegD2,     X86ModB.opModRegDA,
    X86ModB.opModRegE2,     X86ModB.opModRegEA,     X86ModB.opModRegF2,     X86ModB.opModRegFA,
    X86ModB.opModRegC3,     X86ModB.opModRegCB,     X86ModB.opModRegD3,     X86ModB.opModRegDB,
    X86ModB.opModRegE3,     X86ModB.opModRegEB,     X86ModB.opModRegF3,     X86ModB.opModRegFB,
    X86ModB.opModRegC4,     X86ModB.opModRegCC,     X86ModB.opModRegD4,     X86ModB.opModRegDC,
    X86ModB.opModRegE4,     X86ModB.opModRegEC,     X86ModB.opModRegF4,     X86ModB.opModRegFC,
    X86ModB.opModRegC5,     X86ModB.opModRegCD,     X86ModB.opModRegD5,     X86ModB.opModRegDD,
    X86ModB.opModRegE5,     X86ModB.opModRegED,     X86ModB.opModRegF5,     X86ModB.opModRegFD,
    X86ModB.opModRegC6,     X86ModB.opModRegCE,     X86ModB.opModRegD6,     X86ModB.opModRegDE,
    X86ModB.opModRegE6,     X86ModB.opModRegEE,     X86ModB.opModRegF6,     X86ModB.opModRegFE,
    X86ModB.opModRegC7,     X86ModB.opModRegCF,     X86ModB.opModRegD7,     X86ModB.opModRegDF,
    X86ModB.opModRegE7,     X86ModB.opModRegEF,     X86ModB.opModRegF7,     X86ModB.opModRegFF
];

X86ModB.aOpModReg = [
    X86ModB.opModReg00,     X86ModB.opModReg01,     X86ModB.opModReg02,     X86ModB.opModReg03,
    X86ModB.opModReg04,     X86ModB.opModReg05,     X86ModB.opModReg06,     X86ModB.opModReg07,
    X86ModB.opModReg08,     X86ModB.opModReg09,     X86ModB.opModReg0A,     X86ModB.opModReg0B,
    X86ModB.opModReg0C,     X86ModB.opModReg0D,     X86ModB.opModReg0E,     X86ModB.opModReg0F,
    X86ModB.opModReg10,     X86ModB.opModReg11,     X86ModB.opModReg12,     X86ModB.opModReg13,
    X86ModB.opModReg14,     X86ModB.opModReg15,     X86ModB.opModReg16,     X86ModB.opModReg17,
    X86ModB.opModReg18,     X86ModB.opModReg19,     X86ModB.opModReg1A,     X86ModB.opModReg1B,
    X86ModB.opModReg1C,     X86ModB.opModReg1D,     X86ModB.opModReg1E,     X86ModB.opModReg1F,
    X86ModB.opModReg20,     X86ModB.opModReg21,     X86ModB.opModReg22,     X86ModB.opModReg23,
    X86ModB.opModReg24,     X86ModB.opModReg25,     X86ModB.opModReg26,     X86ModB.opModReg27,
    X86ModB.opModReg28,     X86ModB.opModReg29,     X86ModB.opModReg2A,     X86ModB.opModReg2B,
    X86ModB.opModReg2C,     X86ModB.opModReg2D,     X86ModB.opModReg2E,     X86ModB.opModReg2F,
    X86ModB.opModReg30,     X86ModB.opModReg31,     X86ModB.opModReg32,     X86ModB.opModReg33,
    X86ModB.opModReg34,     X86ModB.opModReg35,     X86ModB.opModReg36,     X86ModB.opModReg37,
    X86ModB.opModReg38,     X86ModB.opModReg39,     X86ModB.opModReg3A,     X86ModB.opModReg3B,
    X86ModB.opModReg3C,     X86ModB.opModReg3D,     X86ModB.opModReg3E,     X86ModB.opModReg3F,
    X86ModB.opModReg40,     X86ModB.opModReg41,     X86ModB.opModReg42,     X86ModB.opModReg43,
    X86ModB.opModReg44,     X86ModB.opModReg45,     X86ModB.opModReg46,     X86ModB.opModReg47,
    X86ModB.opModReg48,     X86ModB.opModReg49,     X86ModB.opModReg4A,     X86ModB.opModReg4B,
    X86ModB.opModReg4C,     X86ModB.opModReg4D,     X86ModB.opModReg4E,     X86ModB.opModReg4F,
    X86ModB.opModReg50,     X86ModB.opModReg51,     X86ModB.opModReg52,     X86ModB.opModReg53,
    X86ModB.opModReg54,     X86ModB.opModReg55,     X86ModB.opModReg56,     X86ModB.opModReg57,
    X86ModB.opModReg58,     X86ModB.opModReg59,     X86ModB.opModReg5A,     X86ModB.opModReg5B,
    X86ModB.opModReg5C,     X86ModB.opModReg5D,     X86ModB.opModReg5E,     X86ModB.opModReg5F,
    X86ModB.opModReg60,     X86ModB.opModReg61,     X86ModB.opModReg62,     X86ModB.opModReg63,
    X86ModB.opModReg64,     X86ModB.opModReg65,     X86ModB.opModReg66,     X86ModB.opModReg67,
    X86ModB.opModReg68,     X86ModB.opModReg69,     X86ModB.opModReg6A,     X86ModB.opModReg6B,
    X86ModB.opModReg6C,     X86ModB.opModReg6D,     X86ModB.opModReg6E,     X86ModB.opModReg6F,
    X86ModB.opModReg70,     X86ModB.opModReg71,     X86ModB.opModReg72,     X86ModB.opModReg73,
    X86ModB.opModReg74,     X86ModB.opModReg75,     X86ModB.opModReg76,     X86ModB.opModReg77,
    X86ModB.opModReg78,     X86ModB.opModReg79,     X86ModB.opModReg7A,     X86ModB.opModReg7B,
    X86ModB.opModReg7C,     X86ModB.opModReg7D,     X86ModB.opModReg7E,     X86ModB.opModReg7F,
    X86ModB.opModReg80,     X86ModB.opModReg81,     X86ModB.opModReg82,     X86ModB.opModReg83,
    X86ModB.opModReg84,     X86ModB.opModReg85,     X86ModB.opModReg86,     X86ModB.opModReg87,
    X86ModB.opModReg88,     X86ModB.opModReg89,     X86ModB.opModReg8A,     X86ModB.opModReg8B,
    X86ModB.opModReg8C,     X86ModB.opModReg8D,     X86ModB.opModReg8E,     X86ModB.opModReg8F,
    X86ModB.opModReg90,     X86ModB.opModReg91,     X86ModB.opModReg92,     X86ModB.opModReg93,
    X86ModB.opModReg94,     X86ModB.opModReg95,     X86ModB.opModReg96,     X86ModB.opModReg97,
    X86ModB.opModReg98,     X86ModB.opModReg99,     X86ModB.opModReg9A,     X86ModB.opModReg9B,
    X86ModB.opModReg9C,     X86ModB.opModReg9D,     X86ModB.opModReg9E,     X86ModB.opModReg9F,
    X86ModB.opModRegA0,     X86ModB.opModRegA1,     X86ModB.opModRegA2,     X86ModB.opModRegA3,
    X86ModB.opModRegA4,     X86ModB.opModRegA5,     X86ModB.opModRegA6,     X86ModB.opModRegA7,
    X86ModB.opModRegA8,     X86ModB.opModRegA9,     X86ModB.opModRegAA,     X86ModB.opModRegAB,
    X86ModB.opModRegAC,     X86ModB.opModRegAD,     X86ModB.opModRegAE,     X86ModB.opModRegAF,
    X86ModB.opModRegB0,     X86ModB.opModRegB1,     X86ModB.opModRegB2,     X86ModB.opModRegB3,
    X86ModB.opModRegB4,     X86ModB.opModRegB5,     X86ModB.opModRegB6,     X86ModB.opModRegB7,
    X86ModB.opModRegB8,     X86ModB.opModRegB9,     X86ModB.opModRegBA,     X86ModB.opModRegBB,
    X86ModB.opModRegBC,     X86ModB.opModRegBD,     X86ModB.opModRegBE,     X86ModB.opModRegBF,
    X86ModB.opModRegC0,     X86ModB.opModRegC1,     X86ModB.opModRegC2,     X86ModB.opModRegC3,
    X86ModB.opModRegC4,     X86ModB.opModRegC5,     X86ModB.opModRegC6,     X86ModB.opModRegC7,
    X86ModB.opModRegC8,     X86ModB.opModRegC9,     X86ModB.opModRegCA,     X86ModB.opModRegCB,
    X86ModB.opModRegCC,     X86ModB.opModRegCD,     X86ModB.opModRegCE,     X86ModB.opModRegCF,
    X86ModB.opModRegD0,     X86ModB.opModRegD1,     X86ModB.opModRegD2,     X86ModB.opModRegD3,
    X86ModB.opModRegD4,     X86ModB.opModRegD5,     X86ModB.opModRegD6,     X86ModB.opModRegD7,
    X86ModB.opModRegD8,     X86ModB.opModRegD9,     X86ModB.opModRegDA,     X86ModB.opModRegDB,
    X86ModB.opModRegDC,     X86ModB.opModRegDD,     X86ModB.opModRegDE,     X86ModB.opModRegDF,
    X86ModB.opModRegE0,     X86ModB.opModRegE1,     X86ModB.opModRegE2,     X86ModB.opModRegE3,
    X86ModB.opModRegE4,     X86ModB.opModRegE5,     X86ModB.opModRegE6,     X86ModB.opModRegE7,
    X86ModB.opModRegE8,     X86ModB.opModRegE9,     X86ModB.opModRegEA,     X86ModB.opModRegEB,
    X86ModB.opModRegEC,     X86ModB.opModRegED,     X86ModB.opModRegEE,     X86ModB.opModRegEF,
    X86ModB.opModRegF0,     X86ModB.opModRegF1,     X86ModB.opModRegF2,     X86ModB.opModRegF3,
    X86ModB.opModRegF4,     X86ModB.opModRegF5,     X86ModB.opModRegF6,     X86ModB.opModRegF7,
    X86ModB.opModRegF8,     X86ModB.opModRegF9,     X86ModB.opModRegFA,     X86ModB.opModRegFB,
    X86ModB.opModRegFC,     X86ModB.opModRegFD,     X86ModB.opModRegFE,     X86ModB.opModRegFF
];

X86ModB.aOpModGrp = [
    X86ModB.opModGrp00,     X86ModB.opModGrp01,     X86ModB.opModGrp02,     X86ModB.opModGrp03,
    X86ModB.opModGrp04,     X86ModB.opModGrp05,     X86ModB.opModGrp06,     X86ModB.opModGrp07,
    X86ModB.opModGrp08,     X86ModB.opModGrp09,     X86ModB.opModGrp0A,     X86ModB.opModGrp0B,
    X86ModB.opModGrp0C,     X86ModB.opModGrp0D,     X86ModB.opModGrp0E,     X86ModB.opModGrp0F,
    X86ModB.opModGrp10,     X86ModB.opModGrp11,     X86ModB.opModGrp12,     X86ModB.opModGrp13,
    X86ModB.opModGrp14,     X86ModB.opModGrp15,     X86ModB.opModGrp16,     X86ModB.opModGrp17,
    X86ModB.opModGrp18,     X86ModB.opModGrp19,     X86ModB.opModGrp1A,     X86ModB.opModGrp1B,
    X86ModB.opModGrp1C,     X86ModB.opModGrp1D,     X86ModB.opModGrp1E,     X86ModB.opModGrp1F,
    X86ModB.opModGrp20,     X86ModB.opModGrp21,     X86ModB.opModGrp22,     X86ModB.opModGrp23,
    X86ModB.opModGrp24,     X86ModB.opModGrp25,     X86ModB.opModGrp26,     X86ModB.opModGrp27,
    X86ModB.opModGrp28,     X86ModB.opModGrp29,     X86ModB.opModGrp2A,     X86ModB.opModGrp2B,
    X86ModB.opModGrp2C,     X86ModB.opModGrp2D,     X86ModB.opModGrp2E,     X86ModB.opModGrp2F,
    X86ModB.opModGrp30,     X86ModB.opModGrp31,     X86ModB.opModGrp32,     X86ModB.opModGrp33,
    X86ModB.opModGrp34,     X86ModB.opModGrp35,     X86ModB.opModGrp36,     X86ModB.opModGrp37,
    X86ModB.opModGrp38,     X86ModB.opModGrp39,     X86ModB.opModGrp3A,     X86ModB.opModGrp3B,
    X86ModB.opModGrp3C,     X86ModB.opModGrp3D,     X86ModB.opModGrp3E,     X86ModB.opModGrp3F,
    X86ModB.opModGrp40,     X86ModB.opModGrp41,     X86ModB.opModGrp42,     X86ModB.opModGrp43,
    X86ModB.opModGrp44,     X86ModB.opModGrp45,     X86ModB.opModGrp46,     X86ModB.opModGrp47,
    X86ModB.opModGrp48,     X86ModB.opModGrp49,     X86ModB.opModGrp4A,     X86ModB.opModGrp4B,
    X86ModB.opModGrp4C,     X86ModB.opModGrp4D,     X86ModB.opModGrp4E,     X86ModB.opModGrp4F,
    X86ModB.opModGrp50,     X86ModB.opModGrp51,     X86ModB.opModGrp52,     X86ModB.opModGrp53,
    X86ModB.opModGrp54,     X86ModB.opModGrp55,     X86ModB.opModGrp56,     X86ModB.opModGrp57,
    X86ModB.opModGrp58,     X86ModB.opModGrp59,     X86ModB.opModGrp5A,     X86ModB.opModGrp5B,
    X86ModB.opModGrp5C,     X86ModB.opModGrp5D,     X86ModB.opModGrp5E,     X86ModB.opModGrp5F,
    X86ModB.opModGrp60,     X86ModB.opModGrp61,     X86ModB.opModGrp62,     X86ModB.opModGrp63,
    X86ModB.opModGrp64,     X86ModB.opModGrp65,     X86ModB.opModGrp66,     X86ModB.opModGrp67,
    X86ModB.opModGrp68,     X86ModB.opModGrp69,     X86ModB.opModGrp6A,     X86ModB.opModGrp6B,
    X86ModB.opModGrp6C,     X86ModB.opModGrp6D,     X86ModB.opModGrp6E,     X86ModB.opModGrp6F,
    X86ModB.opModGrp70,     X86ModB.opModGrp71,     X86ModB.opModGrp72,     X86ModB.opModGrp73,
    X86ModB.opModGrp74,     X86ModB.opModGrp75,     X86ModB.opModGrp76,     X86ModB.opModGrp77,
    X86ModB.opModGrp78,     X86ModB.opModGrp79,     X86ModB.opModGrp7A,     X86ModB.opModGrp7B,
    X86ModB.opModGrp7C,     X86ModB.opModGrp7D,     X86ModB.opModGrp7E,     X86ModB.opModGrp7F,
    X86ModB.opModGrp80,     X86ModB.opModGrp81,     X86ModB.opModGrp82,     X86ModB.opModGrp83,
    X86ModB.opModGrp84,     X86ModB.opModGrp85,     X86ModB.opModGrp86,     X86ModB.opModGrp87,
    X86ModB.opModGrp88,     X86ModB.opModGrp89,     X86ModB.opModGrp8A,     X86ModB.opModGrp8B,
    X86ModB.opModGrp8C,     X86ModB.opModGrp8D,     X86ModB.opModGrp8E,     X86ModB.opModGrp8F,
    X86ModB.opModGrp90,     X86ModB.opModGrp91,     X86ModB.opModGrp92,     X86ModB.opModGrp93,
    X86ModB.opModGrp94,     X86ModB.opModGrp95,     X86ModB.opModGrp96,     X86ModB.opModGrp97,
    X86ModB.opModGrp98,     X86ModB.opModGrp99,     X86ModB.opModGrp9A,     X86ModB.opModGrp9B,
    X86ModB.opModGrp9C,     X86ModB.opModGrp9D,     X86ModB.opModGrp9E,     X86ModB.opModGrp9F,
    X86ModB.opModGrpA0,     X86ModB.opModGrpA1,     X86ModB.opModGrpA2,     X86ModB.opModGrpA3,
    X86ModB.opModGrpA4,     X86ModB.opModGrpA5,     X86ModB.opModGrpA6,     X86ModB.opModGrpA7,
    X86ModB.opModGrpA8,     X86ModB.opModGrpA9,     X86ModB.opModGrpAA,     X86ModB.opModGrpAB,
    X86ModB.opModGrpAC,     X86ModB.opModGrpAD,     X86ModB.opModGrpAE,     X86ModB.opModGrpAF,
    X86ModB.opModGrpB0,     X86ModB.opModGrpB1,     X86ModB.opModGrpB2,     X86ModB.opModGrpB3,
    X86ModB.opModGrpB4,     X86ModB.opModGrpB5,     X86ModB.opModGrpB6,     X86ModB.opModGrpB7,
    X86ModB.opModGrpB8,     X86ModB.opModGrpB9,     X86ModB.opModGrpBA,     X86ModB.opModGrpBB,
    X86ModB.opModGrpBC,     X86ModB.opModGrpBD,     X86ModB.opModGrpBE,     X86ModB.opModGrpBF,
    X86ModB.opModGrpC0,     X86ModB.opModGrpC1,     X86ModB.opModGrpC2,     X86ModB.opModGrpC3,
    X86ModB.opModGrpC4,     X86ModB.opModGrpC5,     X86ModB.opModGrpC6,     X86ModB.opModGrpC7,
    X86ModB.opModGrpC8,     X86ModB.opModGrpC9,     X86ModB.opModGrpCA,     X86ModB.opModGrpCB,
    X86ModB.opModGrpCC,     X86ModB.opModGrpCD,     X86ModB.opModGrpCE,     X86ModB.opModGrpCF,
    X86ModB.opModGrpD0,     X86ModB.opModGrpD1,     X86ModB.opModGrpD2,     X86ModB.opModGrpD3,
    X86ModB.opModGrpD4,     X86ModB.opModGrpD5,     X86ModB.opModGrpD6,     X86ModB.opModGrpD7,
    X86ModB.opModGrpD8,     X86ModB.opModGrpD9,     X86ModB.opModGrpDA,     X86ModB.opModGrpDB,
    X86ModB.opModGrpDC,     X86ModB.opModGrpDD,     X86ModB.opModGrpDE,     X86ModB.opModGrpDF,
    X86ModB.opModGrpE0,     X86ModB.opModGrpE1,     X86ModB.opModGrpE2,     X86ModB.opModGrpE3,
    X86ModB.opModGrpE4,     X86ModB.opModGrpE5,     X86ModB.opModGrpE6,     X86ModB.opModGrpE7,
    X86ModB.opModGrpE8,     X86ModB.opModGrpE9,     X86ModB.opModGrpEA,     X86ModB.opModGrpEB,
    X86ModB.opModGrpEC,     X86ModB.opModGrpED,     X86ModB.opModGrpEE,     X86ModB.opModGrpEF,
    X86ModB.opModGrpF0,     X86ModB.opModGrpF1,     X86ModB.opModGrpF2,     X86ModB.opModGrpF3,
    X86ModB.opModGrpF4,     X86ModB.opModGrpF5,     X86ModB.opModGrpF6,     X86ModB.opModGrpF7,
    X86ModB.opModGrpF8,     X86ModB.opModGrpF9,     X86ModB.opModGrpFA,     X86ModB.opModGrpFB,
    X86ModB.opModGrpFC,     X86ModB.opModGrpFD,     X86ModB.opModGrpFE,     X86ModB.opModGrpFF
];

if (typeof module !== 'undefined') module.exports = X86ModB;
