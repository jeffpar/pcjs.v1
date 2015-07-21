/**
 * @fileoverview Implements PCjs 80386 ModRegRM byte decoders with 32-bit addressing.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2015-Jan-20
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

var X86ModB32 = {};

X86ModB32.aOpModReg = [
    /**
     * opMod32RegByte00(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte00(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEAX));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte01(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte01(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regECX));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte02(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte02(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDX));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte03(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte03(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte04(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte04(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte05(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte05(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte06(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte06(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte07(fn): mod=00 (src:mem)  reg=000 (dst:AL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte07(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte08(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte08(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEAX));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte09(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte09(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regECX));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte0A(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte0A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDX));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte0B(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte0B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte0C(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte0C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte0D(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte0D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte0E(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte0E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte0F(fn): mod=00 (src:mem)  reg=001 (dst:CL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte0F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte10(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte10(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEAX));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte11(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte11(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regECX));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte12(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte12(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDX));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte13(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte13(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte14(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte14(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte15(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte15(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte16(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte16(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte17(fn): mod=00 (src:mem)  reg=010 (dst:DL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte17(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte18(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte18(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEAX));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte19(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte19(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regECX));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte1A(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte1A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDX));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte1B(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte1B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte1C(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte1C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte1D(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte1D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte1E(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte1E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte1F(fn): mod=00 (src:mem)  reg=011 (dst:BL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte1F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte20(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte20(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEAX));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte21(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte21(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regECX));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte22(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte22(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDX));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte23(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte23(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte24(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte24(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte25(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte25(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte26(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte26(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte27(fn): mod=00 (src:mem)  reg=100 (dst:AH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte27(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte28(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte28(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEAX));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte29(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte29(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regECX));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte2A(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte2A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDX));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte2B(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte2B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte2C(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte2C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte2D(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte2D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte2E(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte2E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte2F(fn): mod=00 (src:mem)  reg=101 (dst:CH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte2F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte30(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte30(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEAX));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte31(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte31(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regECX));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte32(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte32(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDX));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte33(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte33(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte34(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte34(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte35(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte35(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte36(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte36(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte37(fn): mod=00 (src:mem)  reg=110 (dst:DH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte37(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte38(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte38(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEAX));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte39(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte39(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regECX));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte3A(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte3A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDX));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte3B(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte3B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte3C(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte3C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(0)));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte3D(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte3D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32RegByte3E(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte3E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte3F(fn): mod=00 (src:mem)  reg=111 (dst:BH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte3F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32RegByte40(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte40(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte41(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte41(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte42(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte42(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte43(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte43(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte44(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte44(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte45(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte45(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte46(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte46(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte47(fn): mod=01 (src:mem+d8)  reg=000 (dst:AL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte47(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte48(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte48(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte49(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte49(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte4A(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte4A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte4B(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte4B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte4C(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte4C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte4D(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte4D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte4E(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte4E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte4F(fn): mod=01 (src:mem+d8)  reg=001 (dst:CL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte4F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte50(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte50(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte51(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte51(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte52(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte52(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte53(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte53(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte54(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte54(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte55(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte55(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte56(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte56(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte57(fn): mod=01 (src:mem+d8)  reg=010 (dst:DL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte57(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte58(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte58(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte59(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte59(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte5A(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte5A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte5B(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte5B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte5C(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte5C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte5D(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte5D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte5E(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte5E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte5F(fn): mod=01 (src:mem+d8)  reg=011 (dst:BL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte5F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte60(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte60(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte61(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte61(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte62(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte62(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte63(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte63(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte64(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte64(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte65(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte65(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte66(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte66(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte67(fn): mod=01 (src:mem+d8)  reg=100 (dst:AH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte67(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte68(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte68(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte69(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte69(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte6A(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte6A(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte6B(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte6B(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte6C(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte6C(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte6D(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte6D(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte6E(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte6E(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte6F(fn): mod=01 (src:mem+d8)  reg=101 (dst:CH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte6F(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte70(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte70(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte71(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte71(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte72(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte72(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte73(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte73(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte74(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte74(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte75(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte75(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte76(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte76(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte77(fn): mod=01 (src:mem+d8)  reg=110 (dst:DH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte77(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte78(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte78(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte79(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte79(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte7A(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte7A(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte7B(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte7B(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte7C(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte7C(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte7D(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte7D(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte7E(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte7E(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte7F(fn): mod=01 (src:mem+d8)  reg=111 (dst:BH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte7F(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte80(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte80(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte81(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte81(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte82(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte82(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte83(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte83(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte84(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte84(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte85(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte85(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte86(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte86(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte87(fn): mod=10 (src:mem+d16)  reg=000 (dst:AL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte87(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte88(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte88(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte89(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte89(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte8A(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte8A(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte8B(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte8B(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte8C(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte8C(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte8D(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte8D(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte8E(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte8E(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte8F(fn): mod=10 (src:mem+d16)  reg=001 (dst:CL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte8F(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte90(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte90(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte91(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte91(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte92(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte92(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte93(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte93(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte94(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte94(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte95(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte95(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte96(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte96(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte97(fn): mod=10 (src:mem+d16)  reg=010 (dst:DL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte97(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte98(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte98(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte99(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte99(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte9A(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte9A(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte9B(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte9B(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte9C(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte9C(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte9D(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte9D(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte9E(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte9E(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByte9F(fn): mod=10 (src:mem+d16)  reg=011 (dst:BL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByte9F(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA0(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA1(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA2(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA3(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA4(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA5(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA6(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA7(fn): mod=10 (src:mem+d16)  reg=100 (dst:AH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA8(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteA9(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteA9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteAA(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteAA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteAB(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteAB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteAC(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteAC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteAD(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteAD(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteAE(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteAE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteAF(fn): mod=10 (src:mem+d16)  reg=101 (dst:CH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteAF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB0(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB1(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB2(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB3(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB4(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB5(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB6(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB7(fn): mod=10 (src:mem+d16)  reg=110 (dst:DH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB8(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEAX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteB9(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteB9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regECX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteBA(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteBA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteBB(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteBB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEBX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteBC(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteBC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.getSIBAddr(2) + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteBD(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteBD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteStack(this.regEBP + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteBE(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteBE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regESI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteBF(fn): mod=10 (src:mem+d16)  reg=111 (dst:BH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteBF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.getEAByteData(this.regEDI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegByteC0(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC0(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
    },
    /**
     * opMod32RegByteC1(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC1(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCL;
    },
    /**
     * opMod32RegByteC2(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC2(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDL;
    },
    /**
     * opMod32RegByteC3(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC3(fn) {
        var b = fn.call(this, this.regEAX & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBL;
    },
    /**
     * opMod32RegByteC4(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC4(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiAH;
    },
    /**
     * opMod32RegByteC5(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC5(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiCH;
    },
    /**
     * opMod32RegByteC6(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC6(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiDH;
    },
    /**
     * opMod32RegByteC7(fn): mod=11 (src:reg)  reg=000 (dst:AL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC7(fn) {
        var b = fn.call(this, this.regEAX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiBH;
    },
    /**
     * opMod32RegByteC8(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC8(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAL;
    },
    /**
     * opMod32RegByteC9(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteC9(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
    },
    /**
     * opMod32RegByteCA(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteCA(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDL;
    },
    /**
     * opMod32RegByteCB(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteCB(fn) {
        var b = fn.call(this, this.regECX & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBL;
    },
    /**
     * opMod32RegByteCC(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteCC(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiAH;
    },
    /**
     * opMod32RegByteCD(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteCD(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiCH;
    },
    /**
     * opMod32RegByteCE(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteCE(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiDH;
    },
    /**
     * opMod32RegByteCF(fn): mod=11 (src:reg)  reg=001 (dst:CL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteCF(fn) {
        var b = fn.call(this, this.regECX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiBH;
    },
    /**
     * opMod32RegByteD0(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD0(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAL;
    },
    /**
     * opMod32RegByteD1(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD1(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCL;
    },
    /**
     * opMod32RegByteD2(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD2(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
    },
    /**
     * opMod32RegByteD3(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD3(fn) {
        var b = fn.call(this, this.regEDX & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBL;
    },
    /**
     * opMod32RegByteD4(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD4(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiAH;
    },
    /**
     * opMod32RegByteD5(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD5(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiCH;
    },
    /**
     * opMod32RegByteD6(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD6(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiDH;
    },
    /**
     * opMod32RegByteD7(fn): mod=11 (src:reg)  reg=010 (dst:DL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD7(fn) {
        var b = fn.call(this, this.regEDX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiBH;
    },
    /**
     * opMod32RegByteD8(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD8(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAL;
    },
    /**
     * opMod32RegByteD9(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteD9(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCL;
    },
    /**
     * opMod32RegByteDA(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteDA(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDL;
    },
    /**
     * opMod32RegByteDB(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteDB(fn) {
        var b = fn.call(this, this.regEBX & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
    },
    /**
     * opMod32RegByteDC(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteDC(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiAH;
    },
    /**
     * opMod32RegByteDD(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteDD(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiCH;
    },
    /**
     * opMod32RegByteDE(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteDE(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiDH;
    },
    /**
     * opMod32RegByteDF(fn): mod=11 (src:reg)  reg=011 (dst:BL)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteDF(fn) {
        var b = fn.call(this, this.regEBX & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiBH;
    },
    /**
     * opMod32RegByteE0(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE0(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiAL;
    },
    /**
     * opMod32RegByteE1(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE1(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regECX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCL;
    },
    /**
     * opMod32RegByteE2(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE2(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDL;
    },
    /**
     * opMod32RegByteE3(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE3(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBL;
    },
    /**
     * opMod32RegByteE4(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE4(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
    },
    /**
     * opMod32RegByteE5(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE5(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiCH;
    },
    /**
     * opMod32RegByteE6(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE6(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiDH;
    },
    /**
     * opMod32RegByteE7(fn): mod=11 (src:reg)  reg=100 (dst:AH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE7(fn) {
        var b = fn.call(this, (this.regEAX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiBH;
    },
    /**
     * opMod32RegByteE8(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE8(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEAX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAL;
    },
    /**
     * opMod32RegByteE9(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteE9(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regECX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiCL;
    },
    /**
     * opMod32RegByteEA(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteEA(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEDX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDL;
    },
    /**
     * opMod32RegByteEB(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteEB(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, this.regEBX & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBL;
    },
    /**
     * opMod32RegByteEC(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteEC(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiAH;
    },
    /**
     * opMod32RegByteED(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteED(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
    },
    /**
     * opMod32RegByteEE(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteEE(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiDH;
    },
    /**
     * opMod32RegByteEF(fn): mod=11 (src:reg)  reg=101 (dst:CH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteEF(fn) {
        var b = fn.call(this, (this.regECX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiBH;
    },
    /**
     * opMod32RegByteF0(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF0(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAL;
    },
    /**
     * opMod32RegByteF1(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF1(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regECX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCL;
    },
    /**
     * opMod32RegByteF2(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF2(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiDL;
    },
    /**
     * opMod32RegByteF3(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF3(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBL;
    },
    /**
     * opMod32RegByteF4(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF4(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiAH;
    },
    /**
     * opMod32RegByteF5(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF5(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiCH;
    },
    /**
     * opMod32RegByteF6(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF6(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
    },
    /**
     * opMod32RegByteF7(fn): mod=11 (src:reg)  reg=110 (dst:DH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF7(fn) {
        var b = fn.call(this, (this.regEDX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiBH;
    },
    /**
     * opMod32RegByteF8(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF8(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEAX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAL;
    },
    /**
     * opMod32RegByteF9(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteF9(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regECX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCL;
    },
    /**
     * opMod32RegByteFA(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteFA(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEDX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDL;
    },
    /**
     * opMod32RegByteFB(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteFB(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, this.regEBX & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiBL;
    },
    /**
     * opMod32RegByteFC(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteFC(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEAX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiAH;
    },
    /**
     * opMod32RegByteFD(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteFD(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regECX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiCH;
    },
    /**
     * opMod32RegByteFE(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteFE(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEDX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiDH;
    },
    /**
     * opMod32RegByteFF(fn): mod=11 (src:reg)  reg=111 (dst:BH)  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegByteFF(fn) {
        var b = fn.call(this, (this.regEBX >> 8) & 0xff, (this.regEBX >> 8) & 0xff);
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
    }
];

X86ModB32.aOpModMem = [
    /**
     * opMod32MemByte00(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte00(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte01(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte01(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte02(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte02(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte03(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte03(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte04(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte04(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte05(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte05(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte06(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte06(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte07(fn): mod=00 (dst:mem)  reg=000 (src:AL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte07(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte08(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte08(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte09(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte09(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte0A(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte0A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte0B(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte0B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte0C(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte0C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte0D(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte0D(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte0E(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte0E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte0F(fn): mod=00 (dst:mem)  reg=001 (src:CL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte0F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte10(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte10(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte11(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte11(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte12(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte12(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte13(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte13(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte14(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte14(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte15(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte15(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte16(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte16(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte17(fn): mod=00 (dst:mem)  reg=010 (src:DL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte17(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte18(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte18(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte19(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte19(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte1A(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte1A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte1B(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte1B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte1C(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte1C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte1D(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte1D(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte1E(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte1E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte1F(fn): mod=00 (dst:mem)  reg=011 (src:BL)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte1F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte20(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte20(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte21(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte21(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte22(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte22(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte23(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte23(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte24(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte24(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte25(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte25(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte26(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte26(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte27(fn): mod=00 (dst:mem)  reg=100 (src:AH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte27(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte28(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte28(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte29(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte29(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte2A(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte2A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte2B(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte2B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte2C(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte2C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte2D(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte2D(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte2E(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte2E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte2F(fn): mod=00 (dst:mem)  reg=101 (src:CH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte2F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte30(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte30(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte31(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte31(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte32(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte32(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte33(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte33(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte34(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte34(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte35(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte35(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte36(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte36(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte37(fn): mod=00 (dst:mem)  reg=110 (src:DH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte37(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte38(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte38(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte39(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte39(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte3A(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte3A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte3B(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte3B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte3C(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte3C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(0)), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte3D(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte3D(fn) {
        var b = fn.call(this, this.modEAByteData(this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32MemByte3E(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte3E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte3F(fn): mod=00 (dst:mem)  reg=111 (src:BH)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte3F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32MemByte40(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte40(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte41(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte41(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte42(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte42(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte43(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte43(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte44(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte44(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte45(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte45(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte46(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte46(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte47(fn): mod=01 (dst:mem+d8)  reg=000 (src:AL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte47(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte48(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte48(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte49(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte49(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte4A(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte4A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte4B(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte4B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte4C(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte4C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte4D(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte4D(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte4E(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte4E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte4F(fn): mod=01 (dst:mem+d8)  reg=001 (src:CL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte4F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte50(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte50(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte51(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte51(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte52(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte52(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte53(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte53(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte54(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte54(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte55(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte55(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte56(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte56(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte57(fn): mod=01 (dst:mem+d8)  reg=010 (src:DL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte57(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte58(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte58(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte59(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte59(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte5A(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte5A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte5B(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte5B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte5C(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte5C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte5D(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte5D(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte5E(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte5E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte5F(fn): mod=01 (dst:mem+d8)  reg=011 (src:BL)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte5F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte60(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte60(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte61(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte61(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte62(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte62(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte63(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte63(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte64(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte64(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte65(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte65(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte66(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte66(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte67(fn): mod=01 (dst:mem+d8)  reg=100 (src:AH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte67(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte68(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte68(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte69(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte69(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte6A(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte6A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte6B(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte6B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte6C(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte6C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte6D(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte6D(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte6E(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte6E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte6F(fn): mod=01 (dst:mem+d8)  reg=101 (src:CH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte6F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte70(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte70(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte71(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte71(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte72(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte72(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte73(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte73(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte74(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte74(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte75(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte75(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte76(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte76(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte77(fn): mod=01 (dst:mem+d8)  reg=110 (src:DH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte77(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte78(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte78(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte79(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte79(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte7A(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte7A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte7B(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte7B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte7C(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte7C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte7D(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte7D(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte7E(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte7E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte7F(fn): mod=01 (dst:mem+d8)  reg=111 (src:BH)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte7F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte80(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte80(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte81(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte81(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte82(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte82(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte83(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte83(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte84(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte84(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte85(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte85(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte86(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte86(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte87(fn): mod=10 (dst:mem+d16)  reg=000 (src:AL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte87(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), this.regEAX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte88(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte88(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte89(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte89(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte8A(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte8A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte8B(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte8B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte8C(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte8C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte8D(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte8D(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte8E(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte8E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte8F(fn): mod=10 (dst:mem+d16)  reg=001 (src:CL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte8F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), this.regECX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte90(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte90(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte91(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte91(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte92(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte92(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte93(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte93(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte94(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte94(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte95(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte95(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte96(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte96(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte97(fn): mod=10 (dst:mem+d16)  reg=010 (src:DL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte97(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), this.regEDX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte98(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte98(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte99(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte99(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte9A(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte9A(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte9B(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte9B(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte9C(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte9C(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte9D(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte9D(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte9E(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte9E(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByte9F(fn): mod=10 (dst:mem+d16)  reg=011 (src:BL)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByte9F(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), this.regEBX & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBL;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA0(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA0(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA1(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA1(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA2(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA2(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA3(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA3(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA4(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA4(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA5(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA5(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA6(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA6(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA7(fn): mod=10 (dst:mem+d16)  reg=100 (src:AH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA7(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), (this.regEAX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiAH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA8(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA8(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteA9(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteA9(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteAA(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteAA(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteAB(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteAB(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteAC(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteAC(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteAD(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteAD(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteAE(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteAE(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteAF(fn): mod=10 (dst:mem+d16)  reg=101 (src:CH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteAF(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), (this.regECX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiCH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB0(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB0(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB1(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB1(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB2(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB2(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB3(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB3(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB4(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB4(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB5(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB5(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB6(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB6(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB7(fn): mod=10 (dst:mem+d16)  reg=110 (src:DH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB7(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), (this.regEDX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiDH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB8(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB8(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteB9(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteB9(fn) {
        var b = fn.call(this, this.modEAByteData(this.regECX + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteBA(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteBA(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteBB(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteBB(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteBC(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteBC(fn) {
        var b = fn.call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteBD(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteBD(fn) {
        var b = fn.call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteBE(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteBE(fn) {
        var b = fn.call(this, this.modEAByteData(this.regESI + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemByteBF(fn): mod=10 (dst:mem+d16)  reg=111 (src:BH)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemByteBF(fn) {
        var b = fn.call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), (this.regEBX >> 8) & 0xff);
        if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiBH;
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    X86ModB32.aOpModReg[0xC0],    X86ModB32.aOpModReg[0xC8],    X86ModB32.aOpModReg[0xD0],    X86ModB32.aOpModReg[0xD8],
    X86ModB32.aOpModReg[0xE0],    X86ModB32.aOpModReg[0xE8],    X86ModB32.aOpModReg[0xF0],    X86ModB32.aOpModReg[0xF8],
    X86ModB32.aOpModReg[0xC1],    X86ModB32.aOpModReg[0xC9],    X86ModB32.aOpModReg[0xD1],    X86ModB32.aOpModReg[0xD9],
    X86ModB32.aOpModReg[0xE1],    X86ModB32.aOpModReg[0xE9],    X86ModB32.aOpModReg[0xF1],    X86ModB32.aOpModReg[0xF9],
    X86ModB32.aOpModReg[0xC2],    X86ModB32.aOpModReg[0xCA],    X86ModB32.aOpModReg[0xD2],    X86ModB32.aOpModReg[0xDA],
    X86ModB32.aOpModReg[0xE2],    X86ModB32.aOpModReg[0xEA],    X86ModB32.aOpModReg[0xF2],    X86ModB32.aOpModReg[0xFA],
    X86ModB32.aOpModReg[0xC3],    X86ModB32.aOpModReg[0xCB],    X86ModB32.aOpModReg[0xD3],    X86ModB32.aOpModReg[0xDB],
    X86ModB32.aOpModReg[0xE3],    X86ModB32.aOpModReg[0xEB],    X86ModB32.aOpModReg[0xF3],    X86ModB32.aOpModReg[0xFB],
    X86ModB32.aOpModReg[0xC4],    X86ModB32.aOpModReg[0xCC],    X86ModB32.aOpModReg[0xD4],    X86ModB32.aOpModReg[0xDC],
    X86ModB32.aOpModReg[0xE4],    X86ModB32.aOpModReg[0xEC],    X86ModB32.aOpModReg[0xF4],    X86ModB32.aOpModReg[0xFC],
    X86ModB32.aOpModReg[0xC5],    X86ModB32.aOpModReg[0xCD],    X86ModB32.aOpModReg[0xD5],    X86ModB32.aOpModReg[0xDD],
    X86ModB32.aOpModReg[0xE5],    X86ModB32.aOpModReg[0xED],    X86ModB32.aOpModReg[0xF5],    X86ModB32.aOpModReg[0xFD],
    X86ModB32.aOpModReg[0xC6],    X86ModB32.aOpModReg[0xCE],    X86ModB32.aOpModReg[0xD6],    X86ModB32.aOpModReg[0xDE],
    X86ModB32.aOpModReg[0xE6],    X86ModB32.aOpModReg[0xEE],    X86ModB32.aOpModReg[0xF6],    X86ModB32.aOpModReg[0xFE],
    X86ModB32.aOpModReg[0xC7],    X86ModB32.aOpModReg[0xCF],    X86ModB32.aOpModReg[0xD7],    X86ModB32.aOpModReg[0xDF],
    X86ModB32.aOpModReg[0xE7],    X86ModB32.aOpModReg[0xEF],    X86ModB32.aOpModReg[0xF7],    X86ModB32.aOpModReg[0xFF]
];

X86ModB32.aOpModGrp = [
    /**
     * opMod32GrpByte00(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte00(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte01(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte01(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte02(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte02(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte03(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte03(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte04(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte04(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte05(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte05(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte06(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte06(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte07(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte07(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte08(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte08(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte09(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte09(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte0A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte0A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte0B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte0B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte0C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte0C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte0D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte0D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte0E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte0E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte0F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte0F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte10(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte10(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte11(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte11(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte12(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte12(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte13(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte13(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte14(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte14(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte15(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte15(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte16(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte16(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte17(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte17(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte18(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte18(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte19(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte19(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte1A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte1A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte1B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte1B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte1C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte1C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte1D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte1D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte1E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte1E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte1F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte1F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte20(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte20(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte21(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte21(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte22(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte22(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte23(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte23(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte24(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte24(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte25(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte25(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte26(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte26(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte27(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte27(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte28(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte28(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte29(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte29(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte2A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte2A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte2B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte2B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte2C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte2C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte2D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte2D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte2E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte2E(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte2F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte2F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte30(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte30(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte31(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte31(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte32(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte32(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte33(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte33(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte34(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte34(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte35(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte35(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte36(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte36(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte37(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte37(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte38(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte38(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEAX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte39(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte39(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regECX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte3A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte3A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte3B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte3B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte3C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte3C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte3D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte3D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod32GrpByte3E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte3E(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte3F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte3F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod32GrpByte40(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte40(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte41(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte41(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte42(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte42(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte43(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte43(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte44(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte44(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte45(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte45(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte46(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte46(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte47(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte47(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte48(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte48(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte49(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte49(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte4A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte4A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte4B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte4B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte4C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte4C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte4D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte4D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte4E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte4E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte4F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte4F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte50(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte50(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte51(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte51(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte52(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte52(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte53(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte53(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte54(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte54(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte55(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte55(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte56(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte56(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte57(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte57(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte58(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte58(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte59(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte59(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte5A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte5A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte5B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte5B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte5C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte5C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte5D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte5D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte5E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte5E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte5F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte5F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte60(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte60(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte61(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte61(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte62(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte62(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte63(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte63(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte64(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte64(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte65(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte65(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte66(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte66(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte67(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte67(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte68(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte68(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte69(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte69(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte6A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte6A(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte6B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte6B(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte6C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte6C(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte6D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte6D(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte6E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte6E(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte6F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte6F(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte70(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte70(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte71(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte71(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte72(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte72(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte73(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte73(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte74(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte74(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte75(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte75(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte76(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte76(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte77(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte77(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte78(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte78(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte79(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte79(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte7A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte7A(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte7B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte7B(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte7C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte7C(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte7D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte7D(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte7E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte7E(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte7F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte7F(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte80(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte80(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte81(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte81(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte82(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte82(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte83(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte83(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte84(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte84(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte85(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte85(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte86(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte86(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte87(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte87(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte88(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte88(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte89(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte89(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte8A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte8A(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte8B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte8B(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte8C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte8C(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte8D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte8D(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte8E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte8E(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte8F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte8F(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte90(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte90(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte91(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte91(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte92(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte92(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte93(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte93(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte94(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte94(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte95(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte95(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte96(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte96(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte97(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte97(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte98(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte98(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte99(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte99(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte9A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte9A(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte9B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte9B(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte9C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte9C(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte9D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte9D(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte9E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte9E(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByte9F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByte9F(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteA9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteA9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteAA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteAA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteAB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteAB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteAC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteAC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteAD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteAD(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteAE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteAE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteAF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteAF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEAX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteB9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteB9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regECX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteBA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteBA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteBB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteBB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteBC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteBC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.getSIBAddr(2) + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteBD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteBD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteBE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteBE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteBF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteBF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.modEAByteData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAByte(b);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpByteC0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC0(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC1(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC2(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC3(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC4(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC5(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC6(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC7(afnGrp, fnSrc) {
        var b = afnGrp[0].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC8(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteC9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteC9(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteCA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteCA(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteCB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteCB(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteCC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteCC(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteCD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteCD(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteCE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteCE(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteCF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteCF(afnGrp, fnSrc) {
        var b = afnGrp[1].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD0(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD1(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD2(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD3(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD4(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD5(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD6(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD7(afnGrp, fnSrc) {
        var b = afnGrp[2].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD8(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteD9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteD9(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteDA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteDA(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteDB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteDB(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteDC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteDC(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteDD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteDD(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteDE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteDE(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteDF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteDF(afnGrp, fnSrc) {
        var b = afnGrp[3].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE0(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE1(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE2(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE3(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE4(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE5(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE6(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE7(afnGrp, fnSrc) {
        var b = afnGrp[4].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE8(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteE9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteE9(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteEA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteEA(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteEB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteEB(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteEC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteEC(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteED(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteED(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteEE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteEE(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteEF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteEF(afnGrp, fnSrc) {
        var b = afnGrp[5].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF0(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF1(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF2(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF3(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF4(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF5(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF6(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF7(afnGrp, fnSrc) {
        var b = afnGrp[6].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=000 (AL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF8(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEAX & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiAL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteF9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=001 (CL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteF9(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regECX & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiCL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteFA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=010 (DL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteFA(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEDX & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiDL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteFB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=011 (BL)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteFB(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, this.regEBX & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff) | b;
        if (BACKTRACK) this.backTrack.btiBL = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteFC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=100 (AH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteFC(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEAX >> 8) & 0xff, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiAH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteFD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=101 (CH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteFD(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regECX >> 8) & 0xff, fnSrc.call(this));
        this.regECX = (this.regECX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiCH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteFE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=110 (DH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteFE(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEDX >> 8) & 0xff, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiDH = this.backTrack.btiEALo;
    },
    /**
     * opMod32GrpByteFF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=111 (BH)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpByteFF(afnGrp, fnSrc) {
        var b = afnGrp[7].call(this, (this.regEBX >> 8) & 0xff, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~0xff00) | (b << 8);
        if (BACKTRACK) this.backTrack.btiBH = this.backTrack.btiEALo;
    }
];

if (typeof module !== 'undefined') module.exports = X86ModB32;
