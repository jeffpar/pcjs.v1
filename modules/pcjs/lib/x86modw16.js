/**
 * @fileoverview Implements PCjs 80386 ModRegRM word decoders with 16-bit addressing.
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

var X86ModW16 = {};

X86ModW16.aOpModReg = [
    /**
     * opMod16RegWord00(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord00(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord01(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord01(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord02(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord02(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord03(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord03(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord04(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord04(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regESI));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord05(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord05(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEDI));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord06(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord06(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord07(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord07(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord08(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord08(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord09(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord09(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord0A(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord0A(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord0B(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord0B(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord0C(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord0C(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regESI));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord0D(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord0D(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEDI));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord0E(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord0E(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord0F(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord0F(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord10(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord10(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord11(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord11(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord12(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord12(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord13(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord13(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord14(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord14(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regESI));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord15(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord15(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEDI));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord16(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord16(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord17(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord17(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord18(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord18(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord19(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord19(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord1A(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord1A(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord1B(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord1B(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord1C(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord1C(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regESI));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord1D(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord1D(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEDI));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord1E(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord1E(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord1F(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord1F(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord20(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord20(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord21(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord21(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord22(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord22(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord23(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord23(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord24(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord24(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regESI));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord25(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord25(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEDI));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord26(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord26(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord27(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord27(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord28(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord28(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord29(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord29(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord2A(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord2A(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord2B(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord2B(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord2C(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord2C(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regESI));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord2D(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord2D(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEDI));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord2E(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord2E(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord2F(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord2F(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord30(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord30(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord31(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord31(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord32(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord32(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord33(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord33(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord34(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord34(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regESI));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord35(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord35(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEDI));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord36(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord36(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord37(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord37(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord38(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord38(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.regESI));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord39(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord39(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord3A(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord3A(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16RegWord3B(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord3B(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16RegWord3C(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord3C(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regESI));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord3D(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord3D(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEDI));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord3E(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord3E(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16RegWord3F(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord3F(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16RegWord40(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord40(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord41(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord41(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord42(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord42(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord43(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord43(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord44(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord44(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord45(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord45(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord46(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord46(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord47(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord47(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord48(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord48(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord49(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord49(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord4A(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord4A(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord4B(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord4B(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord4C(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord4C(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord4D(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord4D(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord4E(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord4E(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord4F(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord4F(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord50(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord50(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord51(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord51(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord52(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord52(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord53(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord53(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord54(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord54(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord55(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord55(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord56(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord56(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord57(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord57(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord58(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord58(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord59(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord59(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord5A(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord5A(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord5B(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord5B(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord5C(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord5C(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord5D(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord5D(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord5E(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord5E(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord5F(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord5F(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord60(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord60(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord61(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord61(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord62(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord62(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord63(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord63(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord64(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord64(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord65(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord65(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord66(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord66(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord67(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord67(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord68(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord68(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord69(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord69(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord6A(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord6A(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord6B(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord6B(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord6C(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord6C(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord6D(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord6D(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord6E(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord6E(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord6F(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord6F(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord70(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord70(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord71(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord71(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord72(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord72(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord73(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord73(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord74(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord74(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord75(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord75(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord76(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord76(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord77(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord77(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord78(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord78(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord79(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord79(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord7A(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord7A(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord7B(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord7B(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord7C(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord7C(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord7D(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord7D(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord7E(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord7E(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord7F(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord7F(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord80(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord80(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord81(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord81(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord82(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord82(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord83(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord83(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord84(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord84(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord85(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord85(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord86(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord86(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord87(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord87(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord88(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord88(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord89(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord89(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord8A(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord8A(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord8B(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord8B(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord8C(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord8C(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord8D(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord8D(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord8E(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord8E(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord8F(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord8F(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord90(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord90(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord91(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord91(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord92(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord92(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord93(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord93(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord94(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord94(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord95(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord95(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord96(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord96(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord97(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord97(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord98(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord98(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord99(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord99(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord9A(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord9A(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWord9B(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord9B(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWord9C(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord9C(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord9D(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord9D(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord9E(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord9E(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWord9F(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWord9F(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordA0(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA0(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordA1(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA1(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordA2(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA2(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordA3(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA3(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordA4(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA4(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordA5(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA5(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordA6(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA6(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordA7(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA7(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.setSP((this.getSP() & ~this.dataMask) | w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordA8(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA8(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordA9(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordA9(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordAA(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordAA(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordAB(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordAB(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordAC(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordAC(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordAD(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordAD(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordAE(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordAE(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordAF(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordAF(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordB0(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB0(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordB1(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB1(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordB2(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB2(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordB3(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB3(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordB4(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB4(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordB5(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB5(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordB6(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB6(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordB7(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB7(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordB8(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB8(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordB9(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordB9(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordBA(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordBA(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16RegWordBB(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordBB(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16RegWordBC(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordBC(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regESI + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordBD(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordBD(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEDI + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordBE(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordBE(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordBF(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordBF(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getEAWordData(this.regEBX + this.getIPAddr()));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16RegWordC0(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC0(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.regEAX & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
    },
    /**
     * opMod16RegWordC1(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC1(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.regECX & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiCL; this.backTrack.btiAH = this.backTrack.btiCH;
        }
    },
    /**
     * opMod16RegWordC2(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC2(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.regEDX & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDL; this.backTrack.btiAH = this.backTrack.btiDH;
        }
    },
    /**
     * opMod16RegWordC3(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC3(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.regEBX & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBL; this.backTrack.btiAH = this.backTrack.btiBH;
        }
    },
    /**
     * opMod16RegWordC4(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC4(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.getSP() & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = X86.BACKTRACK.SP_LO; this.backTrack.btiAH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod16RegWordC5(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC5(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.regEBP & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBPLo; this.backTrack.btiAH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod16RegWordC6(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC6(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.regESI & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiSILo; this.backTrack.btiAH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod16RegWordC7(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC7(fn) {
        var w = fn.call(this, this.regEAX & this.dataMask, this.regEDI & this.dataMask);
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDILo; this.backTrack.btiAH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod16RegWordC8(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC8(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.regEAX & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiAL; this.backTrack.btiCH = this.backTrack.btiAH;
        }
    },
    /**
     * opMod16RegWordC9(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordC9(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.regECX & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
    },
    /**
     * opMod16RegWordCA(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordCA(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.regEDX & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDL; this.backTrack.btiCH = this.backTrack.btiDH;
        }
    },
    /**
     * opMod16RegWordCB(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordCB(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.regEBX & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBL; this.backTrack.btiCH = this.backTrack.btiBH;
        }
    },
    /**
     * opMod16RegWordCC(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordCC(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.getSP() & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = X86.BACKTRACK.SP_LO; this.backTrack.btiCH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod16RegWordCD(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordCD(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.regEBP & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBPLo; this.backTrack.btiCH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod16RegWordCE(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordCE(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.regESI & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiSILo; this.backTrack.btiCH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod16RegWordCF(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordCF(fn) {
        var w = fn.call(this, this.regECX & this.dataMask, this.regEDI & this.dataMask);
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDILo; this.backTrack.btiCH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod16RegWordD0(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD0(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.regEAX & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiAL; this.backTrack.btiDH = this.backTrack.btiAH;
        }
    },
    /**
     * opMod16RegWordD1(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD1(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.regECX & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiCL; this.backTrack.btiDH = this.backTrack.btiCH;
        }
    },
    /**
     * opMod16RegWordD2(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD2(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.regEDX & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
    },
    /**
     * opMod16RegWordD3(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD3(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.regEBX & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBL; this.backTrack.btiDH = this.backTrack.btiBH;
        }
    },
    /**
     * opMod16RegWordD4(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD4(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.getSP() & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = X86.BACKTRACK.SP_LO; this.backTrack.btiDH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod16RegWordD5(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD5(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.regEBP & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBPLo; this.backTrack.btiDH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod16RegWordD6(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD6(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.regESI & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiSILo; this.backTrack.btiDH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod16RegWordD7(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD7(fn) {
        var w = fn.call(this, this.regEDX & this.dataMask, this.regEDI & this.dataMask);
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiDILo; this.backTrack.btiDH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod16RegWordD8(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD8(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.regEAX & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiAL; this.backTrack.btiBH = this.backTrack.btiAH;
        }
    },
    /**
     * opMod16RegWordD9(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordD9(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.regECX & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiCL; this.backTrack.btiBH = this.backTrack.btiCH;
        }
    },
    /**
     * opMod16RegWordDA(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordDA(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.regEDX & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDL; this.backTrack.btiBH = this.backTrack.btiDH;
        }
    },
    /**
     * opMod16RegWordDB(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordDB(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.regEBX & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
    },
    /**
     * opMod16RegWordDC(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordDC(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.getSP() & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = X86.BACKTRACK.SP_LO; this.backTrack.btiBH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod16RegWordDD(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordDD(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.regEBP & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiBPLo; this.backTrack.btiBH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod16RegWordDE(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordDE(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.regESI & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiSILo; this.backTrack.btiBH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod16RegWordDF(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordDF(fn) {
        var w = fn.call(this, this.regEBX & this.dataMask, this.regEDI & this.dataMask);
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDILo; this.backTrack.btiBH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod16RegWordE0(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE0(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.regEAX & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE1(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE1(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.regECX & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE2(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE2(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.regEDX & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE3(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE3(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.regEBX & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE4(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE4(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.getSP() & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE5(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE5(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.regEBP & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE6(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE6(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.regESI & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE7(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE7(fn) {
        var w = fn.call(this, this.getSP() & this.dataMask, this.regEDI & this.dataMask);
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16RegWordE8(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE8(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.regEAX & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiAL; this.backTrack.btiBPHi = this.backTrack.btiAH;
        }
    },
    /**
     * opMod16RegWordE9(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordE9(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.regECX & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiCL; this.backTrack.btiBPHi = this.backTrack.btiCH;
        }
    },
    /**
     * opMod16RegWordEA(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordEA(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.regEDX & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDL; this.backTrack.btiBPHi = this.backTrack.btiDH;
        }
    },
    /**
     * opMod16RegWordEB(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordEB(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.regEBX & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiBL; this.backTrack.btiBPHi = this.backTrack.btiBH;
        }
    },
    /**
     * opMod16RegWordEC(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordEC(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.getSP() & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = X86.BACKTRACK.SP_LO; this.backTrack.btiBPHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod16RegWordED(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordED(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.regEBP & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
    },
    /**
     * opMod16RegWordEE(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordEE(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.regESI & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiSILo; this.backTrack.btiBPHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod16RegWordEF(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordEF(fn) {
        var w = fn.call(this, this.regEBP & this.dataMask, this.regEDI & this.dataMask);
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDILo; this.backTrack.btiBPHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod16RegWordF0(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF0(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.regEAX & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiAL; this.backTrack.btiSIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opMod16RegWordF1(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF1(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.regECX & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiCL; this.backTrack.btiSIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opMod16RegWordF2(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF2(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.regEDX & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDL; this.backTrack.btiSIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opMod16RegWordF3(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF3(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.regEBX & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBL; this.backTrack.btiSIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opMod16RegWordF4(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF4(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.getSP() & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = X86.BACKTRACK.SP_LO; this.backTrack.btiSIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod16RegWordF5(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF5(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.regEBP & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBPLo; this.backTrack.btiSIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod16RegWordF6(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF6(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.regESI & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
    },
    /**
     * opMod16RegWordF7(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF7(fn) {
        var w = fn.call(this, this.regESI & this.dataMask, this.regEDI & this.dataMask);
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDILo; this.backTrack.btiSIHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod16RegWordF8(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF8(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.regEAX & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiAL; this.backTrack.btiDIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opMod16RegWordF9(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordF9(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.regECX & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiCL; this.backTrack.btiDIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opMod16RegWordFA(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordFA(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.regEDX & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiDL; this.backTrack.btiDIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opMod16RegWordFB(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordFB(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.regEBX & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBL; this.backTrack.btiDIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opMod16RegWordFC(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordFC(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.getSP() & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = X86.BACKTRACK.SP_LO; this.backTrack.btiDIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod16RegWordFD(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordFD(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.regEBP & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBPLo; this.backTrack.btiDIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod16RegWordFE(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordFE(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.regESI & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiSILo; this.backTrack.btiDIHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod16RegWordFF(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16RegWordFF(fn) {
        var w = fn.call(this, this.regEDI & this.dataMask, this.regEDI & this.dataMask);
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
    }
];

X86ModW16.aOpModMem = [
    /**
     * opMod16MemWord00(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord00(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord01(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord01(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord02(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord02(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord03(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord03(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord04(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord04(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord05(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord05(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord06(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord06(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord07(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord07(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord08(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord08(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord09(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord09(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord0A(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord0A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord0B(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord0B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord0C(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord0C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord0D(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord0D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord0E(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord0E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord0F(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord0F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord10(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord10(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord11(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord11(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord12(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord12(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord13(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord13(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord14(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord14(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord15(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord15(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord16(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord16(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord17(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord17(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord18(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord18(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord19(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord19(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord1A(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord1A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord1B(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord1B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord1C(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord1C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord1D(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord1D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord1E(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord1E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord1F(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord1F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord20(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord20(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord21(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord21(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord22(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord22(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord23(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord23(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord24(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord24(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord25(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord25(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord26(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord26(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord27(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord27(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord28(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord28(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord29(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord29(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord2A(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord2A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord2B(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord2B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord2C(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord2C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord2D(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord2D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord2E(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord2E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord2F(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord2F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord30(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord30(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord31(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord31(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord32(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord32(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord33(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord33(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord34(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord34(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord35(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord35(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord36(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord36(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord37(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord37(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord38(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord38(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord39(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord39(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord3A(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord3A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16MemWord3B(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord3B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16MemWord3C(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord3C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord3D(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord3D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord3E(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord3E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16MemWord3F(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord3F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16MemWord40(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord40(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord41(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord41(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord42(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord42(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord43(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord43(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord44(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord44(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord45(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord45(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord46(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord46(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord47(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord47(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord48(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord48(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord49(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord49(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord4A(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord4A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord4B(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord4B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord4C(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord4C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord4D(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord4D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord4E(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord4E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord4F(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord4F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord50(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord50(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord51(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord51(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord52(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord52(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord53(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord53(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord54(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord54(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord55(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord55(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord56(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord56(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord57(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord57(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord58(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord58(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord59(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord59(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord5A(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord5A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord5B(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord5B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord5C(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord5C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord5D(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord5D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord5E(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord5E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord5F(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord5F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord60(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord60(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord61(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord61(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord62(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord62(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord63(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord63(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord64(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord64(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord65(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord65(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord66(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord66(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord67(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord67(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord68(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord68(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord69(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord69(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord6A(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord6A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord6B(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord6B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord6C(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord6C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord6D(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord6D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord6E(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord6E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord6F(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord6F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord70(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord70(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord71(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord71(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord72(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord72(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord73(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord73(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord74(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord74(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord75(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord75(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord76(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord76(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord77(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord77(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord78(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord78(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord79(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord79(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord7A(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord7A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord7B(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord7B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord7C(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord7C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord7D(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord7D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord7E(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord7E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord7F(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord7F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord80(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord80(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord81(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord81(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord82(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord82(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord83(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord83(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord84(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord84(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord85(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord85(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord86(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord86(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord87(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord87(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEAX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord88(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord88(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord89(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord89(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord8A(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord8A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord8B(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord8B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord8C(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord8C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord8D(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord8D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord8E(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord8E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord8F(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord8F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regECX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord90(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord90(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord91(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord91(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord92(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord92(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord93(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord93(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord94(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord94(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord95(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord95(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord96(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord96(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord97(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord97(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEDX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord98(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord98(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord99(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord99(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord9A(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord9A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWord9B(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord9B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWord9C(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord9C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord9D(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord9D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord9E(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord9E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWord9F(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWord9F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEBX & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordA0(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA0(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordA1(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA1(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordA2(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA2(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordA3(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA3(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordA4(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA4(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordA5(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA5(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordA6(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA6(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordA7(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA7(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.getSP() & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordA8(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA8(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordA9(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordA9(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordAA(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordAA(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordAB(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordAB(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordAC(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordAC(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordAD(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordAD(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordAE(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordAE(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordAF(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordAF(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEBP & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordB0(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB0(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordB1(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB1(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordB2(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB2(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordB3(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB3(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordB4(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB4(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordB5(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB5(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordB6(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB6(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordB7(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB7(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regESI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordB8(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB8(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordB9(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordB9(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordBA(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordBA(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16MemWordBB(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordBB(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16MemWordBC(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordBC(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordBD(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordBD(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordBE(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordBE(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16MemWordBF(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod16MemWordBF(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEDI & this.dataMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    X86ModW16.aOpModReg[0xC0],  X86ModW16.aOpModReg[0xC8],  X86ModW16.aOpModReg[0xD0],  X86ModW16.aOpModReg[0xD8],
    X86ModW16.aOpModReg[0xE0],  X86ModW16.aOpModReg[0xE8],  X86ModW16.aOpModReg[0xF0],  X86ModW16.aOpModReg[0xF8],
    X86ModW16.aOpModReg[0xC1],  X86ModW16.aOpModReg[0xC9],  X86ModW16.aOpModReg[0xD1],  X86ModW16.aOpModReg[0xD9],
    X86ModW16.aOpModReg[0xE1],  X86ModW16.aOpModReg[0xE9],  X86ModW16.aOpModReg[0xF1],  X86ModW16.aOpModReg[0xF9],
    X86ModW16.aOpModReg[0xC2],  X86ModW16.aOpModReg[0xCA],  X86ModW16.aOpModReg[0xD2],  X86ModW16.aOpModReg[0xDA],
    X86ModW16.aOpModReg[0xE2],  X86ModW16.aOpModReg[0xEA],  X86ModW16.aOpModReg[0xF2],  X86ModW16.aOpModReg[0xFA],
    X86ModW16.aOpModReg[0xC3],  X86ModW16.aOpModReg[0xCB],  X86ModW16.aOpModReg[0xD3],  X86ModW16.aOpModReg[0xDB],
    X86ModW16.aOpModReg[0xE3],  X86ModW16.aOpModReg[0xEB],  X86ModW16.aOpModReg[0xF3],  X86ModW16.aOpModReg[0xFB],
    X86ModW16.aOpModReg[0xC4],  X86ModW16.aOpModReg[0xCC],  X86ModW16.aOpModReg[0xD4],  X86ModW16.aOpModReg[0xDC],
    X86ModW16.aOpModReg[0xE4],  X86ModW16.aOpModReg[0xEC],  X86ModW16.aOpModReg[0xF4],  X86ModW16.aOpModReg[0xFC],
    X86ModW16.aOpModReg[0xC5],  X86ModW16.aOpModReg[0xCD],  X86ModW16.aOpModReg[0xD5],  X86ModW16.aOpModReg[0xDD],
    X86ModW16.aOpModReg[0xE5],  X86ModW16.aOpModReg[0xED],  X86ModW16.aOpModReg[0xF5],  X86ModW16.aOpModReg[0xFD],
    X86ModW16.aOpModReg[0xC6],  X86ModW16.aOpModReg[0xCE],  X86ModW16.aOpModReg[0xD6],  X86ModW16.aOpModReg[0xDE],
    X86ModW16.aOpModReg[0xE6],  X86ModW16.aOpModReg[0xEE],  X86ModW16.aOpModReg[0xF6],  X86ModW16.aOpModReg[0xFE],
    X86ModW16.aOpModReg[0xC7],  X86ModW16.aOpModReg[0xCF],  X86ModW16.aOpModReg[0xD7],  X86ModW16.aOpModReg[0xDF],
    X86ModW16.aOpModReg[0xE7],  X86ModW16.aOpModReg[0xEF],  X86ModW16.aOpModReg[0xF7],  X86ModW16.aOpModReg[0xFF]
];

X86ModW16.aOpModGrp = [
    /**
     * opMod16GrpWord00(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord00(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord01(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord01(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord02(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord02(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord03(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord03(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord04(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord04(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord05(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord05(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord06(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord06(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord07(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord07(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord08(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord08(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord09(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord09(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord0A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord0A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord0B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord0B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord0C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord0C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord0D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord0D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord0E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord0E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord0F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord0F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord10(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord10(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord11(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord11(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord12(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord12(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord13(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord13(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord14(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord14(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord15(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord15(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord16(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord16(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord17(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord17(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord18(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord18(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord19(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord19(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord1A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord1A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord1B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord1B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord1C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord1C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord1D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord1D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord1E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord1E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord1F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord1F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord20(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord20(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord21(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord21(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord22(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord22(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord23(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord23(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord24(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord24(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord25(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord25(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord26(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord26(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord27(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord27(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord28(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord28(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord29(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord29(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord2A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord2A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord2B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord2B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord2C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord2C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord2D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord2D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord2E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord2E(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord2F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord2F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord30(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord30(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord31(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord31(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord32(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord32(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord33(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord33(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord34(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord34(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord35(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord35(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord36(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord36(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord37(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord37(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord38(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord38(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord39(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord39(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord3A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord3A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opMod16GrpWord3B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord3B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opMod16GrpWord3C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord3C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord3D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord3D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord3E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord3E(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opMod16GrpWord3F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord3F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opMod16GrpWord40(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord40(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord41(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord41(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord42(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord42(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord43(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord43(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord44(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord44(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord45(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord45(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord46(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord46(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord47(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord47(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord48(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord48(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord49(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord49(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord4A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord4A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord4B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord4B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord4C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord4C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord4D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord4D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord4E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord4E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord4F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord4F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord50(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord50(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord51(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord51(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord52(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord52(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord53(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord53(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord54(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord54(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord55(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord55(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord56(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord56(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord57(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord57(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord58(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord58(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord59(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord59(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord5A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord5A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord5B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord5B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord5C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord5C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord5D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord5D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord5E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord5E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord5F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord5F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord60(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord60(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord61(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord61(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord62(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord62(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord63(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord63(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord64(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord64(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord65(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord65(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord66(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord66(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord67(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord67(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord68(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord68(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord69(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord69(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord6A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord6A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord6B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord6B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord6C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord6C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord6D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord6D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord6E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord6E(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord6F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord6F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord70(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord70(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord71(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord71(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord72(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord72(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord73(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord73(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord74(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord74(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord75(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord75(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord76(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord76(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord77(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord77(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord78(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord78(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord79(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord79(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord7A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord7A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord7B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord7B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord7C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord7C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord7D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord7D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord7E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord7E(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord7F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord7F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord80(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord80(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord81(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord81(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord82(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord82(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord83(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord83(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord84(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord84(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord85(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord85(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord86(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord86(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord87(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord87(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord88(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord88(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord89(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord89(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord8A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord8A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord8B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord8B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord8C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord8C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord8D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord8D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord8E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord8E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord8F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord8F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord90(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord90(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord91(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord91(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord92(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord92(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord93(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord93(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord94(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord94(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord95(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord95(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord96(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord96(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord97(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord97(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord98(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord98(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord99(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord99(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord9A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord9A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWord9B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord9B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWord9C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord9C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord9D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord9D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord9E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord9E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWord9F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWord9F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordA0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA0(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordA1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA1(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordA2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA2(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordA3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA3(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordA4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA4(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordA5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA5(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordA6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA6(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordA7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA7(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordA8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA8(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordA9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordA9(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordAA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordAA(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordAB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordAB(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordAC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordAC(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordAD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordAD(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordAE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordAE(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordAF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordAF(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordB0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB0(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordB1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB1(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordB2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB2(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordB3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB3(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordB4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB4(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordB5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB5(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordB6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB6(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordB7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB7(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordB8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB8(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordB9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordB9(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordBA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordBA(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opMod16GrpWordBB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordBB(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opMod16GrpWordBC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordBC(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordBD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordBD(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordBE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordBE(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordBF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordBF(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opMod16GrpWordC0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC0(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC1(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC2(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC3(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC4(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordC5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC5(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC6(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC7(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC8(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordC9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordC9(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordCA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordCA(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordCB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordCB(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordCC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordCC(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordCD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordCD(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordCE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordCE(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordCF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordCF(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD0(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD1(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD2(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD3(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD4(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordD5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD5(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD6(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD7(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD8(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordD9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordD9(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordDA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordDA(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordDB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordDB(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordDC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordDC(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordDD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordDD(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordDE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordDE(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordDF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordDF(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE0(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE1(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE2(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE3(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE4(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordE5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE5(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE6(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE7(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE8(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordE9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordE9(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordEA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordEA(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordEB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordEB(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordEC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordEC(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordED(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordED(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordEE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordEE(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordEF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordEF(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF0(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF1(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF2(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF3(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF4(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordF5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF5(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF6(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF7(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF8(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEAX & this.dataMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordF9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordF9(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regECX & this.dataMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordFA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordFA(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEDX & this.dataMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordFB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordFB(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEBX & this.dataMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordFC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordFC(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.getSP() & this.dataMask, fnSrc.call(this));
        this.setSP((this.getSP() & ~this.dataMask) | w);
    },
    /**
     * opMod16GrpWordFD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordFD(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEBP & this.dataMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordFE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordFE(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regESI & this.dataMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod16GrpWordFF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod16GrpWordFF(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEDI & this.dataMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.dataMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    }
];

if (typeof module !== 'undefined') module.exports = X86ModW16;
