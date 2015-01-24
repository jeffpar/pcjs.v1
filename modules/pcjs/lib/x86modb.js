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

var X86ModB = {};

X86ModB.aOpModReg = [
    /**
     * opModRegByte00(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte00(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte01(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte01(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte02(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte02(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte03(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte03(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte04(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte04(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte05(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte05(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte06(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte06(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte07(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte07(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte08(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte08(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte09(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte09(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte0A(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte0A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte0B(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte0B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte0C(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte0C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte0D(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte0D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte0E(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte0E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte0F(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte0F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte10(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte10(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte11(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte11(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte12(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte12(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte13(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte13(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte14(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte14(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte15(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte15(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte16(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte16(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte17(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte17(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte18(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte18(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte19(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte19(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte1A(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte1A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte1B(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte1B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte1C(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte1C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte1D(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte1D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte1E(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte1E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte1F(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte1F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte20(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte20(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte21(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte21(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte22(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte22(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte23(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte23(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte24(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte24(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte25(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte25(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte26(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte26(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte27(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte27(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte28(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte28(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte29(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte29(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte2A(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte2A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte2B(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte2B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte2C(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte2C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte2D(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte2D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte2E(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte2E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte2F(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte2F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte30(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte30(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte31(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte31(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte32(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte32(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte33(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte33(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte34(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte34(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte35(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte35(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte36(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte36(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte37(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte37(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte38(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte38(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte39(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte39(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte3A(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte3A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegByte3B(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte3B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegByte3C(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte3C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte3D(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte3D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte3E(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte3E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegByte3F(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte3F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegByte40(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte40(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte41(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte41(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte42(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte42(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte43(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte43(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte44(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte44(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte45(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte45(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte46(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte46(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte47(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte47(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte48(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte48(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte49(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte49(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte4A(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte4A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte4B(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte4B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte4C(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte4C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4D(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte4D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4E(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte4E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte4F(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte4F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte50(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte50(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte51(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte51(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte52(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte52(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte53(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte53(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte54(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte54(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte55(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte55(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte56(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte56(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte57(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte57(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte58(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte58(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte59(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte59(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte5A(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte5A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte5B(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte5B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte5C(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte5C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5D(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte5D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5E(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte5E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte5F(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte5F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte60(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte60(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte61(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte61(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte62(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte62(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte63(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte63(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte64(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte64(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte65(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte65(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte66(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte66(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte67(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte67(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte68(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte68(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte69(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte69(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte6A(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte6A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte6B(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte6B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte6C(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte6C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6D(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte6D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6E(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte6E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte6F(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte6F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte70(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte70(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte71(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte71(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte72(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte72(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte73(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte73(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte74(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte74(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte75(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte75(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte76(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte76(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte77(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte77(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte78(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte78(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte79(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte79(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte7A(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte7A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte7B(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte7B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte7C(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte7C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7D(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte7D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7E(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte7E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte7F(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte7F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte80(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte80(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte81(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte81(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte82(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte82(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte83(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte83(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte84(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte84(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte85(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte85(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte86(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte86(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte87(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte87(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte88(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte88(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte89(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte89(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte8A(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte8A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte8B(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte8B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte8C(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte8C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8D(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte8D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8E(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte8E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte8F(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte8F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte90(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte90(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte91(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte91(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte92(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte92(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte93(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte93(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte94(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte94(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte95(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte95(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte96(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte96(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte97(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte97(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte98(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte98(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte99(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte99(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte9A(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte9A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByte9B(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte9B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByte9C(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte9C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9D(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte9D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9E(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte9E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByte9F(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByte9F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA0(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA1(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteA2(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteA3(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA4(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA5(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA6(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA7(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteA8(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteA9(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteA9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteAA(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteAA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteAB(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteAB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteAC(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteAC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAD(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteAD(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAE(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteAE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteAF(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteAF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB0(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB1(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteB2(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteB3(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB4(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB5(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB6(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB7(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteB8(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteB9(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteB9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteBA(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteBA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegByteBB(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteBB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegByteBC(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteBC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBD(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteBD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBE(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteBE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteBF(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteBF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegByteC0(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC0(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
    },
    /**
     * opModRegByteC1(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC1(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteC2(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC2(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteC3(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC3(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteC4(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC4(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteC5(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC5(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteC6(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC6(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteC7(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC7(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteC8(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC8(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteC9(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteC9(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
    },
    /**
     * opModRegByteCA(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteCA(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteCB(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteCB(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteCC(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteCC(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteCD(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteCD(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteCE(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteCE(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteCF(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteCF(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteD0(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD0(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteD1(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD1(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteD2(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD2(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
    },
    /**
     * opModRegByteD3(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD3(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBL;
    },
    /**
     * opModRegByteD4(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD4(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteD5(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD5(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteD6(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD6(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteD7(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD7(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteD8(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD8(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAL;
    },
    /**
     * opModRegByteD9(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteD9(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCL;
    },
    /**
     * opModRegByteDA(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteDA(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDL;
    },
    /**
     * opModRegByteDB(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteDB(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
    },
    /**
     * opModRegByteDC(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteDC(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAH;
    },
    /**
     * opModRegByteDD(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteDD(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCH;
    },
    /**
     * opModRegByteDE(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteDE(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDH;
    },
    /**
     * opModRegByteDF(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteDF(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiBH;
    },
    /**
     * opModRegByteE0(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteE1(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteE2(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteE3(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteE4(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
    },
    /**
     * opModRegByteE5(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteE6(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteE7(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteE8(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteE9(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteE9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteEA(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteEA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteEB(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteEB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteEC(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteEC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteED(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteED(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
    },
    /**
     * opModRegByteEE(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteEE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteEF(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteEF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteF0(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteF1(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteF2(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteF3(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteF4(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteF5(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteF6(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
    },
    /**
     * opModRegByteF7(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBH;
    },
    /**
     * opModRegByteF8(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAL;
    },
    /**
     * opModRegByteF9(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteF9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCL;
    },
    /**
     * opModRegByteFA(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteFA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDL;
    },
    /**
     * opModRegByteFB(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteFB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiBL;
    },
    /**
     * opModRegByteFC(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteFC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAH;
    },
    /**
     * opModRegByteFD(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteFD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCH;
    },
    /**
     * opModRegByteFE(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteFE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDH;
    },
    /**
     * opModRegByteFF(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegByteFF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
    }
];

X86ModB.aOpModMem = [
    /**
     * opModMemByte00(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte00(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte01(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte01(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte02(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte02(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte03(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte03(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte04(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte04(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte05(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte05(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte06(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte06(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte07(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte07(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte08(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte08(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte09(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte09(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte0A(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte0A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte0B(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte0B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte0C(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte0C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte0D(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte0D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte0E(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte0E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte0F(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte0F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte10(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte10(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte11(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte11(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte12(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte12(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte13(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte13(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte14(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte14(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte15(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte15(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte16(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte16(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte17(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte17(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte18(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte18(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte19(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte19(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte1A(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte1A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte1B(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte1B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte1C(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte1C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte1D(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte1D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte1E(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte1E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte1F(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte1F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte20(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte20(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte21(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte21(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte22(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte22(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte23(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte23(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte24(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte24(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte25(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte25(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte26(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte26(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte27(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte27(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte28(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte28(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte29(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte29(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte2A(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte2A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte2B(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte2B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte2C(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte2C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte2D(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte2D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte2E(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte2E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte2F(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte2F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte30(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte30(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte31(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte31(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte32(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte32(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte33(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte33(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte34(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte34(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte35(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte35(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte36(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte36(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte37(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte37(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte38(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte38(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte39(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte39(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte3A(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte3A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemByte3B(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte3B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModMemByte3C(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte3C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte3D(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte3D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte3E(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte3E(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModMemByte3F(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte3F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModMemByte40(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte40(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte41(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte41(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte42(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte42(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte43(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte43(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte44(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte44(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte45(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte45(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte46(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte46(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte47(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte47(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte48(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte48(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte49(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte49(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte4A(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte4A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte4B(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte4B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte4C(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte4C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4D(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte4D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4E(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte4E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte4F(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte4F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte50(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte50(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte51(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte51(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte52(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte52(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte53(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte53(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte54(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte54(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte55(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte55(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte56(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte56(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte57(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte57(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte58(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte58(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte59(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte59(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte5A(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte5A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte5B(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte5B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte5C(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte5C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5D(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte5D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5E(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte5E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte5F(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte5F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte60(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte60(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte61(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte61(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte62(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte62(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte63(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte63(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte64(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte64(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte65(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte65(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte66(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte66(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte67(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte67(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte68(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte68(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte69(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte69(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte6A(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte6A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte6B(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte6B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte6C(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte6C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6D(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte6D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6E(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte6E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte6F(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte6F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte70(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte70(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte71(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte71(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte72(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte72(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte73(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte73(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte74(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte74(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte75(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte75(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte76(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte76(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte77(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte77(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte78(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte78(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte79(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte79(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte7A(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte7A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte7B(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte7B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte7C(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte7C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7D(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte7D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7E(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte7E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte7F(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte7F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte80(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte80(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte81(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte81(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte82(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte82(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte83(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte83(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte84(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte84(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte85(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte85(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte86(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte86(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte87(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte87(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte88(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte88(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte89(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte89(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte8A(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte8A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte8B(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte8B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte8C(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte8C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8D(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte8D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8E(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte8E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte8F(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte8F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte90(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte90(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte91(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte91(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte92(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte92(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte93(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte93(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte94(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte94(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte95(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte95(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte96(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte96(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte97(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte97(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte98(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte98(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte99(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte99(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte9A(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte9A(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByte9B(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte9B(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByte9C(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte9C(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9D(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte9D(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9E(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte9E(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByte9F(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByte9F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA0(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA0(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA1(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA1(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteA2(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA2(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteA3(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA3(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA4(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA4(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA5(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA5(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA6(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA6(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA7(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA7(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteA8(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA8(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteA9(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteA9(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteAA(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteAA(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteAB(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteAB(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteAC(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteAC(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAD(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteAD(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAE(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteAE(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteAF(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteAF(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB0(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB0(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB1(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB1(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteB2(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB2(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteB3(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB3(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB4(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB4(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB5(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB5(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB6(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB6(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB7(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB7(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteB8(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB8(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteB9(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteB9(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteBA(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteBA(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemByteBB(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteBB(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemByteBC(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteBC(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBD(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteBD(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBE(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteBE(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModMemByteBF(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemByteBF(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPWord()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    X86ModB.aOpModReg[0xC0],    X86ModB.aOpModReg[0xC8],    X86ModB.aOpModReg[0xD0],    X86ModB.aOpModReg[0xD8],
    X86ModB.aOpModReg[0xE0],    X86ModB.aOpModReg[0xE8],    X86ModB.aOpModReg[0xF0],    X86ModB.aOpModReg[0xF8],
    X86ModB.aOpModReg[0xC1],    X86ModB.aOpModReg[0xC9],    X86ModB.aOpModReg[0xD1],    X86ModB.aOpModReg[0xD9],
    X86ModB.aOpModReg[0xE1],    X86ModB.aOpModReg[0xE9],    X86ModB.aOpModReg[0xF1],    X86ModB.aOpModReg[0xF9],
    X86ModB.aOpModReg[0xC2],    X86ModB.aOpModReg[0xCA],    X86ModB.aOpModReg[0xD2],    X86ModB.aOpModReg[0xDA],
    X86ModB.aOpModReg[0xE2],    X86ModB.aOpModReg[0xEA],    X86ModB.aOpModReg[0xF2],    X86ModB.aOpModReg[0xFA],
    X86ModB.aOpModReg[0xC3],    X86ModB.aOpModReg[0xCB],    X86ModB.aOpModReg[0xD3],    X86ModB.aOpModReg[0xDB],
    X86ModB.aOpModReg[0xE3],    X86ModB.aOpModReg[0xEB],    X86ModB.aOpModReg[0xF3],    X86ModB.aOpModReg[0xFB],
    X86ModB.aOpModReg[0xC4],    X86ModB.aOpModReg[0xCC],    X86ModB.aOpModReg[0xD4],    X86ModB.aOpModReg[0xDC],
    X86ModB.aOpModReg[0xE4],    X86ModB.aOpModReg[0xEC],    X86ModB.aOpModReg[0xF4],    X86ModB.aOpModReg[0xFC],
    X86ModB.aOpModReg[0xC5],    X86ModB.aOpModReg[0xCD],    X86ModB.aOpModReg[0xD5],    X86ModB.aOpModReg[0xDD],
    X86ModB.aOpModReg[0xE5],    X86ModB.aOpModReg[0xED],    X86ModB.aOpModReg[0xF5],    X86ModB.aOpModReg[0xFD],
    X86ModB.aOpModReg[0xC6],    X86ModB.aOpModReg[0xCE],    X86ModB.aOpModReg[0xD6],    X86ModB.aOpModReg[0xDE],
    X86ModB.aOpModReg[0xE6],    X86ModB.aOpModReg[0xEE],    X86ModB.aOpModReg[0xF6],    X86ModB.aOpModReg[0xFE],
    X86ModB.aOpModReg[0xC7],    X86ModB.aOpModReg[0xCF],    X86ModB.aOpModReg[0xD7],    X86ModB.aOpModReg[0xDF],
    X86ModB.aOpModReg[0xE7],    X86ModB.aOpModReg[0xEF],    X86ModB.aOpModReg[0xF7],    X86ModB.aOpModReg[0xFF]
];

X86ModB.aOpModGrp = [
    /**
     * opModGrpByte00(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte00(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte01(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte01(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte02(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte02(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte03(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte03(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte04(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte04(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte05(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte05(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte06(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte06(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte07(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte07(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte08(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte08(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte09(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte09(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte0A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte0A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte0B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte0B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte0C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte0C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte0D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte0D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte0E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte0E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte0F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte0F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte10(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte10(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte11(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte11(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte12(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte12(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte13(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte13(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte14(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte14(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte15(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte15(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte16(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte16(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte17(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte17(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte18(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte18(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte19(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte19(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte1A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte1A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte1B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte1B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte1C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte1C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte1D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte1D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte1E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte1E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte1F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte1F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte20(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte20(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte21(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte21(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte22(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte22(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte23(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte23(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte24(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte24(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte25(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte25(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte26(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte26(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte27(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte27(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte28(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte28(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte29(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte29(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte2A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte2A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte2B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte2B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte2C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte2C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte2D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte2D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte2E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte2E(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte2F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte2F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte30(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte30(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte31(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte31(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte32(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte32(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte33(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte33(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte34(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte34(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte35(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte35(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte36(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte36(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte37(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte37(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte38(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte38(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte39(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte39(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte3A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte3A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpByte3B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte3B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModGrpByte3C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte3C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte3D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte3D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte3E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte3E(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModGrpByte3F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte3F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModGrpByte40(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte40(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte41(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte41(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte42(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte42(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte43(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte43(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte44(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte44(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte45(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte45(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte46(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte46(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte47(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte47(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte48(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte48(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte49(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte49(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte4A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte4A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte4B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte4B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte4C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte4C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte4D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte4D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte4E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte4E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte4F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte4F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte50(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte50(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte51(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte51(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte52(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte52(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte53(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte53(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte54(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte54(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte55(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte55(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte56(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte56(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte57(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte57(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte58(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte58(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte59(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte59(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte5A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte5A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte5B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte5B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte5C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte5C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte5D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte5D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte5E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte5E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte5F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte5F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte60(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte60(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte61(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte61(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte62(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte62(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte63(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte63(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte64(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte64(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte65(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte65(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte66(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte66(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte67(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte67(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte68(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte68(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte69(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte69(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte6A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte6A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte6B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte6B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte6C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte6C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte6D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte6D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte6E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte6E(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte6F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte6F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte70(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte70(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte71(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte71(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte72(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte72(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte73(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte73(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte74(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte74(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte75(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte75(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte76(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte76(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte77(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte77(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte78(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte78(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte79(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte79(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte7A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte7A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte7B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte7B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte7C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte7C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte7D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte7D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte7E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte7E(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte7F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte7F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte80(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte80(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte81(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte81(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte82(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte82(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte83(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte83(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte84(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte84(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte85(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte85(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte86(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte86(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte87(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte87(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte88(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte88(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte89(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte89(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte8A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte8A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte8B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte8B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte8C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte8C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte8D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte8D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte8E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte8E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte8F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte8F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte90(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte90(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte91(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte91(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte92(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte92(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte93(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte93(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte94(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte94(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte95(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte95(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte96(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte96(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte97(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte97(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte98(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte98(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte99(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte99(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte9A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte9A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByte9B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte9B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByte9C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte9C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte9D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte9D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte9E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte9E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByte9F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByte9F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteA1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteA2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteA3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteA4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteA8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteA9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteA9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteAA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteAA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteAB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteAB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteAC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteAC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteAD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteAD(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteAE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteAE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteAF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteAF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteB1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteB2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteB3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteB4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteB8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteB9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteB9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteBA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteBA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpByteBB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteBB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpByteBC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteBC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteBD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteBD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteBE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteBE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteBF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteBF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModGrpByteC0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC0(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC1(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC2(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC3(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC4(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC5(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC6(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC7(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC8(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteC9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteC9(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteCA(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteCB(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteCC(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteCD(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteCE(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteCF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteCF(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD0(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD1(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD2(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD3(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD4(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD5(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD6(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD7(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD8(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteD9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteD9(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteDA(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteDB(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteDC(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteDD(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteDE(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteDF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteDF(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteE9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteE9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteEA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteEB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteEC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteED(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteED(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteEE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteEF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteEF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteF9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteF9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteFA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteFB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteFC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteFD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteFE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opModGrpByteFF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpByteFF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    }
];

if (typeof module !== 'undefined') module.exports = X86ModB;
