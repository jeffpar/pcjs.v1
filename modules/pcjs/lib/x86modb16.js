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

var X86ModB16 = {};

X86ModB16.aOpModReg = [
    /**
     * opMod16RegByte00(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte00(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte01(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte01(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte02(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte02(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte03(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte03(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte04(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte04(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte05(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte05(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte06(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte06(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte07(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte07(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte08(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte08(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte09(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte09(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte0A(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte0A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte0B(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte0B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte0C(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte0C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte0D(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte0D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte0E(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte0E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte0F(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte0F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte10(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte10(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte11(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte11(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte12(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte12(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte13(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte13(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte14(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte14(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte15(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte15(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte16(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte16(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte17(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte17(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte18(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte18(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte19(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte19(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte1A(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte1A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte1B(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte1B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte1C(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte1C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte1D(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte1D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte1E(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte1E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte1F(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte1F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte20(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte20(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte21(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte21(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte22(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte22(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte23(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte23(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte24(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte24(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte25(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte25(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte26(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte26(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte27(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte27(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte28(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte28(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte29(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte29(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte2A(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte2A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte2B(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte2B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte2C(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte2C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte2D(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte2D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte2E(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte2E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte2F(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte2F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte30(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte30(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte31(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte31(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte32(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte32(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte33(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte33(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte34(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte34(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte35(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte35(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte36(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte36(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte37(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte37(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte38(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte38(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte39(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte39(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte3A(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte3A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegByte3B(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte3B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegByte3C(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte3C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte3D(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte3D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte3E(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte3E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16RegByte3F(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte3F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16RegByte40(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte40(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte41(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte41(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte42(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte42(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte43(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte43(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte44(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte44(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte45(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte45(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte46(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte46(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte47(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte47(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte48(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte48(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte49(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte49(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte4A(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte4A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte4B(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte4B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte4C(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte4C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte4D(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte4D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte4E(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte4E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte4F(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte4F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte50(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte50(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte51(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte51(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte52(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte52(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte53(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte53(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte54(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte54(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte55(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte55(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte56(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte56(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte57(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte57(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte58(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte58(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte59(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte59(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte5A(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte5A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte5B(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte5B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte5C(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte5C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte5D(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte5D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte5E(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte5E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte5F(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte5F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte60(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte60(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte61(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte61(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte62(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte62(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte63(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte63(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte64(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte64(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte65(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte65(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte66(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte66(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte67(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte67(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte68(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte68(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte69(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte69(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte6A(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte6A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte6B(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte6B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte6C(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte6C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte6D(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte6D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte6E(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte6E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte6F(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte6F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte70(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte70(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte71(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte71(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte72(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte72(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte73(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte73(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte74(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte74(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte75(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte75(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte76(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte76(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte77(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte77(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte78(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte78(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte79(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte79(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte7A(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte7A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte7B(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte7B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte7C(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte7C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte7D(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte7D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte7E(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte7E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte7F(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte7F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte80(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte80(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte81(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte81(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte82(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte82(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte83(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte83(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte84(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte84(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte85(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte85(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte86(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte86(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte87(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte87(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte88(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte88(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte89(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte89(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte8A(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte8A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte8B(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte8B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte8C(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte8C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte8D(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte8D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte8E(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte8E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte8F(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte8F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte90(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte90(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte91(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte91(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte92(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte92(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte93(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte93(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte94(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte94(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte95(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte95(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte96(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte96(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte97(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte97(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte98(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte98(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte99(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte99(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte9A(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte9A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByte9B(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte9B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByte9C(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte9C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte9D(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte9D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte9E(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte9E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByte9F(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByte9F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteA0(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteA1(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteA2(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteA3(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteA4(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteA5(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteA6(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteA7(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteA8(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteA9(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteA9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteAA(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteAA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteAB(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteAB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteAC(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteAC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteAD(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteAD(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteAE(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteAE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteAF(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteAF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteB0(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteB1(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteB2(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteB3(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteB4(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteB5(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteB6(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteB7(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteB8(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteB9(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteB9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteBA(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteBA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegByteBB(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteBB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegByteBC(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteBC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteBD(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteBD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteBE(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteBE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteBF(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteBF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegByteC0(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC0(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
    },
    /**
     * opMod16RegByteC1(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC1(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCL;
    },
    /**
     * opMod16RegByteC2(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC2(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDL;
    },
    /**
     * opMod16RegByteC3(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC3(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBL;
    },
    /**
     * opMod16RegByteC4(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC4(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiAH;
    },
    /**
     * opMod16RegByteC5(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC5(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCH;
    },
    /**
     * opMod16RegByteC6(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC6(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDH;
    },
    /**
     * opMod16RegByteC7(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC7(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBH;
    },
    /**
     * opMod16RegByteC8(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC8(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAL;
    },
    /**
     * opMod16RegByteC9(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteC9(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
    },
    /**
     * opMod16RegByteCA(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteCA(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDL;
    },
    /**
     * opMod16RegByteCB(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteCB(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBL;
    },
    /**
     * opMod16RegByteCC(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteCC(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAH;
    },
    /**
     * opMod16RegByteCD(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteCD(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiCH;
    },
    /**
     * opMod16RegByteCE(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteCE(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDH;
    },
    /**
     * opMod16RegByteCF(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteCF(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBH;
    },
    /**
     * opMod16RegByteD0(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD0(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAL;
    },
    /**
     * opMod16RegByteD1(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD1(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCL;
    },
    /**
     * opMod16RegByteD2(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD2(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
    },
    /**
     * opMod16RegByteD3(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD3(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBL;
    },
    /**
     * opMod16RegByteD4(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD4(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAH;
    },
    /**
     * opMod16RegByteD5(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD5(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCH;
    },
    /**
     * opMod16RegByteD6(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD6(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiDH;
    },
    /**
     * opMod16RegByteD7(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD7(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBH;
    },
    /**
     * opMod16RegByteD8(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD8(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAL;
    },
    /**
     * opMod16RegByteD9(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteD9(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCL;
    },
    /**
     * opMod16RegByteDA(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteDA(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDL;
    },
    /**
     * opMod16RegByteDB(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteDB(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
    },
    /**
     * opMod16RegByteDC(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteDC(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAH;
    },
    /**
     * opMod16RegByteDD(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteDD(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCH;
    },
    /**
     * opMod16RegByteDE(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteDE(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDH;
    },
    /**
     * opMod16RegByteDF(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteDF(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiBH;
    },
    /**
     * opMod16RegByteE0(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiAL;
    },
    /**
     * opMod16RegByteE1(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCL;
    },
    /**
     * opMod16RegByteE2(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDL;
    },
    /**
     * opMod16RegByteE3(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBL;
    },
    /**
     * opMod16RegByteE4(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
    },
    /**
     * opMod16RegByteE5(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCH;
    },
    /**
     * opMod16RegByteE6(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDH;
    },
    /**
     * opMod16RegByteE7(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBH;
    },
    /**
     * opMod16RegByteE8(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAL;
    },
    /**
     * opMod16RegByteE9(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteE9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiCL;
    },
    /**
     * opMod16RegByteEA(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteEA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDL;
    },
    /**
     * opMod16RegByteEB(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteEB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBL;
    },
    /**
     * opMod16RegByteEC(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteEC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAH;
    },
    /**
     * opMod16RegByteED(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteED(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
    },
    /**
     * opMod16RegByteEE(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteEE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDH;
    },
    /**
     * opMod16RegByteEF(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteEF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBH;
    },
    /**
     * opMod16RegByteF0(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAL;
    },
    /**
     * opMod16RegByteF1(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCL;
    },
    /**
     * opMod16RegByteF2(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiDL;
    },
    /**
     * opMod16RegByteF3(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBL;
    },
    /**
     * opMod16RegByteF4(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAH;
    },
    /**
     * opMod16RegByteF5(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCH;
    },
    /**
     * opMod16RegByteF6(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
    },
    /**
     * opMod16RegByteF7(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBH;
    },
    /**
     * opMod16RegByteF8(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAL;
    },
    /**
     * opMod16RegByteF9(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteF9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCL;
    },
    /**
     * opMod16RegByteFA(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteFA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDL;
    },
    /**
     * opMod16RegByteFB(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteFB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiBL;
    },
    /**
     * opMod16RegByteFC(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteFC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAH;
    },
    /**
     * opMod16RegByteFD(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteFD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCH;
    },
    /**
     * opMod16RegByteFE(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteFE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDH;
    },
    /**
     * opMod16RegByteFF(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegByteFF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
    }
];

X86ModB16.aOpModMem = [
    /**
     * opMod16MemByte00(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte00(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte01(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte01(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte02(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte02(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte03(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte03(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte04(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte04(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte05(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte05(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte06(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte06(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte07(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte07(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte08(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte08(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte09(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte09(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte0A(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte0A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte0B(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte0B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte0C(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte0C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte0D(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte0D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte0E(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte0E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte0F(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte0F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte10(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte10(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte11(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte11(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte12(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte12(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte13(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte13(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte14(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte14(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte15(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte15(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte16(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte16(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte17(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte17(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte18(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte18(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte19(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte19(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte1A(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte1A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte1B(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte1B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte1C(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte1C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte1D(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte1D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte1E(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte1E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte1F(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte1F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte20(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte20(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte21(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte21(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte22(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte22(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte23(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte23(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte24(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte24(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte25(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte25(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte26(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte26(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte27(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte27(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte28(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte28(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte29(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte29(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte2A(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte2A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte2B(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte2B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte2C(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte2C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte2D(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte2D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte2E(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte2E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte2F(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte2F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte30(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte30(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte31(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte31(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte32(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte32(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte33(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte33(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte34(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte34(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte35(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte35(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte36(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte36(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte37(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte37(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte38(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte38(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte39(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte39(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte3A(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte3A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemByte3B(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte3B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemByte3C(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte3C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte3D(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte3D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte3E(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte3E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16MemByte3F(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte3F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16MemByte40(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte40(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte41(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte41(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte42(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte42(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte43(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte43(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte44(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte44(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte45(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte45(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte46(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte46(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte47(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte47(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte48(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte48(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte49(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte49(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte4A(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte4A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte4B(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte4B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte4C(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte4C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte4D(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte4D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte4E(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte4E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte4F(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte4F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte50(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte50(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte51(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte51(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte52(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte52(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte53(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte53(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte54(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte54(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte55(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte55(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte56(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte56(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte57(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte57(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte58(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte58(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte59(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte59(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte5A(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte5A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte5B(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte5B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte5C(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte5C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte5D(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte5D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte5E(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte5E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte5F(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte5F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte60(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte60(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte61(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte61(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte62(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte62(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte63(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte63(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte64(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte64(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte65(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte65(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte66(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte66(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte67(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte67(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte68(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte68(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte69(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte69(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte6A(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte6A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte6B(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte6B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte6C(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte6C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte6D(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte6D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte6E(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte6E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte6F(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte6F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte70(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte70(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte71(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte71(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte72(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte72(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte73(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte73(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte74(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte74(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte75(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte75(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte76(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte76(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte77(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte77(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte78(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte78(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte79(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte79(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte7A(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte7A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte7B(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte7B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte7C(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte7C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte7D(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte7D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte7E(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte7E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte7F(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte7F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte80(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte80(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte81(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte81(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte82(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte82(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte83(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte83(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte84(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte84(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte85(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte85(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte86(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte86(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte87(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte87(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte88(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte88(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte89(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte89(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte8A(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte8A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte8B(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte8B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte8C(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte8C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte8D(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte8D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte8E(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte8E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte8F(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte8F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte90(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte90(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte91(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte91(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte92(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte92(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte93(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte93(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte94(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte94(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte95(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte95(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte96(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte96(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte97(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte97(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte98(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte98(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte99(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte99(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte9A(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte9A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByte9B(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte9B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByte9C(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte9C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte9D(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte9D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte9E(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte9E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByte9F(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByte9F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteA0(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA0(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteA1(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA1(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteA2(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA2(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteA3(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA3(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteA4(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA4(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteA5(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA5(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteA6(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA6(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteA7(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA7(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteA8(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA8(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteA9(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteA9(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteAA(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteAA(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteAB(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteAB(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteAC(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteAC(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteAD(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteAD(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteAE(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteAE(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteAF(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteAF(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteB0(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB0(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteB1(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB1(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteB2(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB2(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteB3(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB3(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteB4(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB4(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteB5(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB5(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteB6(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB6(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteB7(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB7(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteB8(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB8(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteB9(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteB9(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteBA(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteBA(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemByteBB(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteBB(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemByteBC(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteBC(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteBD(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteBD(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteBE(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteBE(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemByteBF(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemByteBF(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    X86ModB16.aOpModReg[0xC0],  X86ModB16.aOpModReg[0xC8],  X86ModB16.aOpModReg[0xD0],  X86ModB16.aOpModReg[0xD8],
    X86ModB16.aOpModReg[0xE0],  X86ModB16.aOpModReg[0xE8],  X86ModB16.aOpModReg[0xF0],  X86ModB16.aOpModReg[0xF8],
    X86ModB16.aOpModReg[0xC1],  X86ModB16.aOpModReg[0xC9],  X86ModB16.aOpModReg[0xD1],  X86ModB16.aOpModReg[0xD9],
    X86ModB16.aOpModReg[0xE1],  X86ModB16.aOpModReg[0xE9],  X86ModB16.aOpModReg[0xF1],  X86ModB16.aOpModReg[0xF9],
    X86ModB16.aOpModReg[0xC2],  X86ModB16.aOpModReg[0xCA],  X86ModB16.aOpModReg[0xD2],  X86ModB16.aOpModReg[0xDA],
    X86ModB16.aOpModReg[0xE2],  X86ModB16.aOpModReg[0xEA],  X86ModB16.aOpModReg[0xF2],  X86ModB16.aOpModReg[0xFA],
    X86ModB16.aOpModReg[0xC3],  X86ModB16.aOpModReg[0xCB],  X86ModB16.aOpModReg[0xD3],  X86ModB16.aOpModReg[0xDB],
    X86ModB16.aOpModReg[0xE3],  X86ModB16.aOpModReg[0xEB],  X86ModB16.aOpModReg[0xF3],  X86ModB16.aOpModReg[0xFB],
    X86ModB16.aOpModReg[0xC4],  X86ModB16.aOpModReg[0xCC],  X86ModB16.aOpModReg[0xD4],  X86ModB16.aOpModReg[0xDC],
    X86ModB16.aOpModReg[0xE4],  X86ModB16.aOpModReg[0xEC],  X86ModB16.aOpModReg[0xF4],  X86ModB16.aOpModReg[0xFC],
    X86ModB16.aOpModReg[0xC5],  X86ModB16.aOpModReg[0xCD],  X86ModB16.aOpModReg[0xD5],  X86ModB16.aOpModReg[0xDD],
    X86ModB16.aOpModReg[0xE5],  X86ModB16.aOpModReg[0xED],  X86ModB16.aOpModReg[0xF5],  X86ModB16.aOpModReg[0xFD],
    X86ModB16.aOpModReg[0xC6],  X86ModB16.aOpModReg[0xCE],  X86ModB16.aOpModReg[0xD6],  X86ModB16.aOpModReg[0xDE],
    X86ModB16.aOpModReg[0xE6],  X86ModB16.aOpModReg[0xEE],  X86ModB16.aOpModReg[0xF6],  X86ModB16.aOpModReg[0xFE],
    X86ModB16.aOpModReg[0xC7],  X86ModB16.aOpModReg[0xCF],  X86ModB16.aOpModReg[0xD7],  X86ModB16.aOpModReg[0xDF],
    X86ModB16.aOpModReg[0xE7],  X86ModB16.aOpModReg[0xEF],  X86ModB16.aOpModReg[0xF7],  X86ModB16.aOpModReg[0xFF]
];

X86ModB16.aOpModGrp = [
    /**
     * opMod16GrpByte00(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte00(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte01(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte01(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte02(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte02(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte03(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte03(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte04(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte04(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte05(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte05(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte06(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte06(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte07(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte07(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte08(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte08(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte09(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte09(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte0A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte0A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte0B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte0B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte0C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte0C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte0D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte0D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte0E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte0E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte0F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte0F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte10(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte10(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte11(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte11(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte12(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte12(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte13(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte13(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte14(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte14(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte15(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte15(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte16(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte16(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte17(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte17(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte18(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte18(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte19(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte19(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte1A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte1A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte1B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte1B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte1C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte1C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte1D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte1D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte1E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte1E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte1F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte1F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte20(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte20(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte21(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte21(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte22(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte22(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte23(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte23(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte24(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte24(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte25(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte25(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte26(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte26(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte27(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte27(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte28(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte28(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte29(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte29(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte2A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte2A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte2B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte2B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte2C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte2C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte2D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte2D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte2E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte2E(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte2F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte2F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte30(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte30(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte31(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte31(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte32(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte32(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte33(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte33(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte34(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte34(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte35(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte35(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte36(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte36(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte37(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte37(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte38(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte38(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte39(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte39(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte3A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte3A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpByte3B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte3B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpByte3C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte3C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte3D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte3D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte3E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte3E(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod16GrpByte3F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte3F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod16GrpByte40(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte40(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte41(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte41(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte42(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte42(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte43(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte43(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte44(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte44(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte45(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte45(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte46(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte46(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte47(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte47(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte48(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte48(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte49(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte49(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte4A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte4A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte4B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte4B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte4C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte4C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte4D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte4D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte4E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte4E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte4F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte4F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte50(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte50(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte51(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte51(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte52(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte52(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte53(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte53(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte54(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte54(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte55(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte55(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte56(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte56(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte57(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte57(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte58(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte58(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte59(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte59(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte5A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte5A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte5B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte5B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte5C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte5C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte5D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte5D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte5E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte5E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte5F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte5F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte60(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte60(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte61(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte61(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte62(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte62(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte63(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte63(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte64(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte64(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte65(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte65(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte66(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte66(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte67(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte67(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte68(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte68(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte69(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte69(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte6A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte6A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte6B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte6B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte6C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte6C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte6D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte6D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte6E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte6E(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte6F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte6F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte70(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte70(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte71(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte71(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte72(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte72(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte73(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte73(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte74(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte74(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte75(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte75(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte76(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte76(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte77(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte77(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte78(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte78(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte79(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte79(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte7A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte7A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte7B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte7B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte7C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte7C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte7D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte7D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte7E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte7E(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte7F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte7F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte80(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte80(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte81(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte81(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte82(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte82(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte83(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte83(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte84(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte84(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte85(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte85(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte86(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte86(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte87(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte87(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte88(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte88(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte89(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte89(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte8A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte8A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte8B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte8B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte8C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte8C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte8D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte8D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte8E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte8E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte8F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte8F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte90(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte90(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte91(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte91(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte92(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte92(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte93(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte93(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte94(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte94(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte95(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte95(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte96(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte96(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte97(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte97(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte98(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte98(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte99(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte99(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte9A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte9A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByte9B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte9B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByte9C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte9C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte9D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte9D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte9E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte9E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByte9F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByte9F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteA0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteA1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteA2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteA3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteA4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteA5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteA6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteA7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteA8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteA9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteA9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteAA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteAA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteAB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteAB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteAC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteAC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteAD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteAD(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteAE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteAE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteAF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteAF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteB0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteB1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteB2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteB3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteB4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteB5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteB6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteB7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteB8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteB9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteB9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteBA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteBA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpByteBB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteBB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpByteBC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteBC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteBD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteBD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteBE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteBE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteBF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteBF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpByteC0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC0(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC1(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC2(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC3(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC4(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC5(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC6(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC7(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC8(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteC9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteC9(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteCA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteCA(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteCB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteCB(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteCC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteCC(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteCD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteCD(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteCE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteCE(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteCF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteCF(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD0(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD1(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD2(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD3(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD4(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD5(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD6(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD7(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD8(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteD9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteD9(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteDA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteDA(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteDB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteDB(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteDC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteDC(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteDD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteDD(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteDE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteDE(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteDF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteDF(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteE9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteE9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteEA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteEA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteEB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteEB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteEC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteEC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteED(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteED(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteEE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteEE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteEF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteEF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteF9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteF9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteFA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteFA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteFB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteFB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteFC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteFC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteFD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteFD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteFE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteFE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod16GrpByteFF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpByteFF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    }
];

if (typeof module !== 'undefined') module.exports = X86ModB16;
