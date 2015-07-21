/**
 * @fileoverview Implements PCjs 8086-80286 ModRegRM word decoders.
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

var X86ModW = {};

X86ModW.aOpModReg = [
    /**
     * opModRegWord00(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord00(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord01(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord01(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord02(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord02(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord03(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord03(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord04(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord04(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord05(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord05(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord06(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord06(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord07(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord07(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord08(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord08(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord09(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord09(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord0A(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord0A(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord0B(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord0B(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord0C(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord0C(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord0D(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord0D(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord0E(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord0E(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord0F(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord0F(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord10(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord10(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord11(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord11(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord12(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord12(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord13(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord13(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord14(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord14(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord15(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord15(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord16(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord16(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord17(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord17(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord18(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord18(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord19(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord19(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord1A(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord1A(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord1B(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord1B(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord1C(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord1C(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord1D(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord1D(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord1E(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord1E(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord1F(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord1F(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord20(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord20(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.regESI)));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord21(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord21(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.regEDI)));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord22(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord22(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.regESI)));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord23(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord23(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.regEDI)));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord24(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord24(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regESI)));
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord25(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord25(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEDI)));
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord26(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord26(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord27(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord27(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX)));
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord28(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord28(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord29(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord29(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord2A(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord2A(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord2B(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord2B(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord2C(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord2C(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord2D(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord2D(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord2E(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord2E(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord2F(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord2F(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord30(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord30(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord31(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord31(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord32(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord32(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord33(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord33(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord34(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord34(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord35(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord35(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord36(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord36(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord37(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord37(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord38(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord38(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord39(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord39(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord3A(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord3A(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord3B(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord3B(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord3C(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord3C(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regESI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord3D(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord3D(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEDI));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord3E(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord3E(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModRegWord3F(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord3F(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModRegWord40(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord40(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord41(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord41(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord42(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord42(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord43(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord43(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord44(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord44(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord45(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord45(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord46(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord46(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord47(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord47(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord48(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord48(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord49(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord49(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord4A(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord4A(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord4B(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord4B(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord4C(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord4C(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4D(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord4D(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4E(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord4E(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4F(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord4F(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord50(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord50(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord51(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord51(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord52(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord52(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord53(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord53(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord54(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord54(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord55(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord55(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord56(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord56(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord57(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord57(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord58(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord58(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord59(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord59(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord5A(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord5A(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord5B(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord5B(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord5C(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord5C(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5D(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord5D(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5E(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord5E(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5F(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord5F(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord60(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord60(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord61(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord61(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord62(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord62(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord63(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord63(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord64(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord64(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regESI + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord65(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord65(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEDI + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord66(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord66(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord67(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord67(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.getIPDisp())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord68(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord68(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord69(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord69(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord6A(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord6A(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord6B(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord6B(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord6C(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord6C(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6D(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord6D(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6E(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord6E(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6F(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord6F(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord70(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord70(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord71(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord71(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord72(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord72(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord73(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord73(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord74(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord74(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord75(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord75(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord76(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord76(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord77(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord77(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord78(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord78(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord79(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord79(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord7A(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord7A(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord7B(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord7B(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord7C(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord7C(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regESI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7D(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord7D(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEDI + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7E(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord7E(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7F(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord7F(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.getIPDisp()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord80(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord80(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord81(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord81(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord82(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord82(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord83(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord83(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord84(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord84(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord85(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord85(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord86(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord86(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord87(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord87(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getEAWordData(this.regEBX + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord88(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord88(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord89(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord89(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord8A(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord8A(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord8B(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord8B(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord8C(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord8C(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8D(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord8D(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8E(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord8E(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8F(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord8F(fn) {
        this.regECX = fn.call(this, this.regECX, this.getEAWordData(this.regEBX + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord90(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord90(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord91(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord91(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord92(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord92(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord93(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord93(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord94(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord94(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord95(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord95(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord96(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord96(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord97(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord97(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getEAWordData(this.regEBX + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord98(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord98(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord99(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord99(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord9A(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord9A(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord9B(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord9B(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord9C(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord9C(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9D(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord9D(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9E(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord9E(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9F(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWord9F(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getEAWordData(this.regEBX + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA0(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA0(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA1(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA1(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordA2(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA2(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordA3(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA3(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA4(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA4(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regESI + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA5(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA5(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEDI + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA6(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA6(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordStack(this.regEBP + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA7(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA7(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getEAWordData(this.regEBX + this.getIPAddr())));
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA8(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA8(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA9(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordA9(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordAA(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordAA(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordAB(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordAB(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordAC(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordAC(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAD(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordAD(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAE(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordAE(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAF(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordAF(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getEAWordData(this.regEBX + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB0(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB0(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB1(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB1(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordB2(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB2(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordB3(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB3(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB4(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB4(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB5(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB5(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB6(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB6(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB7(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB7(fn) {
        this.regESI = fn.call(this, this.regESI, this.getEAWordData(this.regEBX + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB8(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB8(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB9(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordB9(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordBA(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordBA(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordBB(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordBB(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordBC(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordBC(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regESI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBD(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordBD(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEDI + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBE(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordBE(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordStack(this.regEBP + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBF(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordBF(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getEAWordData(this.regEBX + this.getIPAddr()));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordC0(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC0(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.regEAX);
    },
    /**
     * opModRegWordC1(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC1(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiCL; this.backTrack.btiAH = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordC2(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC2(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDL; this.backTrack.btiAH = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordC3(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC3(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBL; this.backTrack.btiAH = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordC4(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC4(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiAL = X86.BACKTRACK.SP_LO; this.backTrack.btiAH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordC5(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC5(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBPLo; this.backTrack.btiAH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordC6(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC6(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiSILo; this.backTrack.btiAH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordC7(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC7(fn) {
        this.regEAX = fn.call(this, this.regEAX, this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDILo; this.backTrack.btiAH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordC8(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC8(fn) {
        this.regECX = fn.call(this, this.regECX, this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiAL; this.backTrack.btiCH = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordC9(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordC9(fn) {
        this.regECX = fn.call(this, this.regECX, this.regECX);
    },
    /**
     * opModRegWordCA(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordCA(fn) {
        this.regECX = fn.call(this, this.regECX, this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDL; this.backTrack.btiCH = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordCB(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordCB(fn) {
        this.regECX = fn.call(this, this.regECX, this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBL; this.backTrack.btiCH = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordCC(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordCC(fn) {
        this.regECX = fn.call(this, this.regECX, this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiCL = X86.BACKTRACK.SP_LO; this.backTrack.btiCH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordCD(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordCD(fn) {
        this.regECX = fn.call(this, this.regECX, this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBPLo; this.backTrack.btiCH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordCE(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordCE(fn) {
        this.regECX = fn.call(this, this.regECX, this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiSILo; this.backTrack.btiCH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordCF(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordCF(fn) {
        this.regECX = fn.call(this, this.regECX, this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDILo; this.backTrack.btiCH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordD0(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD0(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiAL; this.backTrack.btiDH = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordD1(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD1(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiCL; this.backTrack.btiDH = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordD2(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD2(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.regEDX);
    },
    /**
     * opModRegWordD3(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD3(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBL; this.backTrack.btiDH = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordD4(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD4(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiDL = X86.BACKTRACK.SP_LO; this.backTrack.btiDH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordD5(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD5(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBPLo; this.backTrack.btiDH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordD6(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD6(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiSILo; this.backTrack.btiDH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordD7(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD7(fn) {
        this.regEDX = fn.call(this, this.regEDX, this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiDILo; this.backTrack.btiDH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordD8(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD8(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiAL; this.backTrack.btiBH = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordD9(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordD9(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiCL; this.backTrack.btiBH = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordDA(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordDA(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDL; this.backTrack.btiBH = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordDB(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordDB(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.regEBX);
    },
    /**
     * opModRegWordDC(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordDC(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiBL = X86.BACKTRACK.SP_LO; this.backTrack.btiBH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordDD(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordDD(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiBPLo; this.backTrack.btiBH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordDE(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordDE(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiSILo; this.backTrack.btiBH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordDF(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordDF(fn) {
        this.regEBX = fn.call(this, this.regEBX, this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDILo; this.backTrack.btiBH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordE0(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE0(fn) {
        this.setSP(fn.call(this, this.getSP(), this.regEAX));
    },
    /**
     * opModRegWordE1(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE1(fn) {
        this.setSP(fn.call(this, this.getSP(), this.regECX));
    },
    /**
     * opModRegWordE2(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE2(fn) {
        this.setSP(fn.call(this, this.getSP(), this.regEDX));
    },
    /**
     * opModRegWordE3(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE3(fn) {
        this.setSP(fn.call(this, this.getSP(), this.regEBX));
    },
    /**
     * opModRegWordE4(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE4(fn) {
        this.setSP(fn.call(this, this.getSP(), this.getSP()));
    },
    /**
     * opModRegWordE5(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE5(fn) {
        this.setSP(fn.call(this, this.getSP(), this.regEBP));
    },
    /**
     * opModRegWordE6(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE6(fn) {
        this.setSP(fn.call(this, this.getSP(), this.regESI));
    },
    /**
     * opModRegWordE7(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE7(fn) {
        this.setSP(fn.call(this, this.getSP(), this.regEDI));
    },
    /**
     * opModRegWordE8(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE8(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiAL; this.backTrack.btiBPHi = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordE9(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordE9(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiCL; this.backTrack.btiBPHi = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordEA(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordEA(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDL; this.backTrack.btiBPHi = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordEB(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordEB(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiBL; this.backTrack.btiBPHi = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordEC(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordEC(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiBPLo = X86.BACKTRACK.SP_LO; this.backTrack.btiBPHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordED(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordED(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.regEBP);
    },
    /**
     * opModRegWordEE(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordEE(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiSILo; this.backTrack.btiBPHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordEF(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordEF(fn) {
        this.regEBP = fn.call(this, this.regEBP, this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDILo; this.backTrack.btiBPHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordF0(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF0(fn) {
        this.regESI = fn.call(this, this.regESI, this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiAL; this.backTrack.btiSIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordF1(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF1(fn) {
        this.regESI = fn.call(this, this.regESI, this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiCL; this.backTrack.btiSIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordF2(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF2(fn) {
        this.regESI = fn.call(this, this.regESI, this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDL; this.backTrack.btiSIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordF3(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF3(fn) {
        this.regESI = fn.call(this, this.regESI, this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBL; this.backTrack.btiSIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordF4(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF4(fn) {
        this.regESI = fn.call(this, this.regESI, this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiSILo = X86.BACKTRACK.SP_LO; this.backTrack.btiSIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordF5(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF5(fn) {
        this.regESI = fn.call(this, this.regESI, this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBPLo; this.backTrack.btiSIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordF6(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF6(fn) {
        this.regESI = fn.call(this, this.regESI, this.regESI);
    },
    /**
     * opModRegWordF7(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF7(fn) {
        this.regESI = fn.call(this, this.regESI, this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDILo; this.backTrack.btiSIHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opModRegWordF8(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF8(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiAL; this.backTrack.btiDIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opModRegWordF9(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordF9(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiCL; this.backTrack.btiDIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opModRegWordFA(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordFA(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiDL; this.backTrack.btiDIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opModRegWordFB(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordFB(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBL; this.backTrack.btiDIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opModRegWordFC(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordFC(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiDILo = X86.BACKTRACK.SP_LO; this.backTrack.btiDIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opModRegWordFD(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordFD(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBPLo; this.backTrack.btiDIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opModRegWordFE(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordFE(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiSILo; this.backTrack.btiDIHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opModRegWordFF(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModRegWordFF(fn) {
        this.regEDI = fn.call(this, this.regEDI, this.regEDI);
    }
];

X86ModW.aOpModMem = [
    /**
     * opModMemWord00(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord00(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord01(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord01(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord02(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord02(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord03(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord03(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord04(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord04(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord05(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord05(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord06(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord06(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord07(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord07(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord08(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord08(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord09(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord09(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord0A(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord0A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord0B(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord0B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord0C(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord0C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord0D(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord0D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord0E(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord0E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord0F(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord0F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord10(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord10(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord11(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord11(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord12(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord12(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord13(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord13(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord14(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord14(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord15(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord15(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord16(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord16(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord17(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord17(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord18(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord18(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord19(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord19(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord1A(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord1A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord1B(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord1B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord1C(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord1C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord1D(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord1D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord1E(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord1E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord1F(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord1F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord20(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord20(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord21(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord21(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord22(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord22(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord23(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord23(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord24(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord24(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord25(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord25(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord26(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord26(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord27(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord27(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord28(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord28(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord29(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord29(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord2A(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord2A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord2B(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord2B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord2C(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord2C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord2D(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord2D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord2E(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord2E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord2F(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord2F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord30(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord30(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord31(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord31(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord32(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord32(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord33(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord33(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord34(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord34(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord35(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord35(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord36(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord36(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord37(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord37(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord38(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord38(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord39(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord39(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord3A(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord3A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModMemWord3B(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord3B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModMemWord3C(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord3C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord3D(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord3D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord3E(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord3E(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModMemWord3F(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord3F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModMemWord40(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord40(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord41(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord41(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord42(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord42(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord43(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord43(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord44(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord44(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord45(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord45(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord46(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord46(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord47(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord47(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord48(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord48(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord49(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord49(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord4A(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord4A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord4B(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord4B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord4C(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord4C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord4D(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord4D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord4E(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord4E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord4F(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord4F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord50(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord50(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord51(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord51(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord52(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord52(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord53(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord53(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord54(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord54(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord55(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord55(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord56(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord56(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord57(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord57(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord58(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord58(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord59(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord59(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord5A(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord5A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord5B(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord5B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord5C(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord5C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord5D(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord5D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord5E(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord5E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord5F(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord5F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord60(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord60(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord61(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord61(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord62(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord62(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord63(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord63(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord64(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord64(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord65(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord65(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord66(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord66(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord67(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord67(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord68(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord68(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord69(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord69(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord6A(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord6A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord6B(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord6B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord6C(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord6C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord6D(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord6D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord6E(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord6E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord6F(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord6F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord70(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord70(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord71(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord71(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord72(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord72(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord73(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord73(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord74(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord74(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord75(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord75(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord76(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord76(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord77(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord77(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord78(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord78(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord79(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord79(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord7A(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord7A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord7B(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord7B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord7C(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord7C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord7D(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord7D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord7E(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord7E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord7F(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord7F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord80(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord80(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord81(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord81(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord82(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord82(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord83(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord83(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord84(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord84(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord85(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord85(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord86(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord86(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord87(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord87(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEAX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord88(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord88(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord89(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord89(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord8A(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord8A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord8B(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord8B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord8C(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord8C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord8D(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord8D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord8E(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord8E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord8F(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord8F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regECX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord90(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord90(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord91(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord91(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord92(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord92(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord93(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord93(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord94(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord94(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord95(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord95(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord96(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord96(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord97(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord97(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEDX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord98(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord98(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord99(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord99(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord9A(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord9A(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWord9B(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord9B(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWord9C(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord9C(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord9D(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord9D(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord9E(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord9E(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWord9F(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWord9F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEBX);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA0(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA0(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordA1(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA1(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordA2(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA2(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordA3(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA3(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordA4(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA4(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA5(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA5(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA6(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA6(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA7(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA7(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.getSP());
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordA8(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA8(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordA9(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordA9(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordAA(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordAA(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordAB(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordAB(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordAC(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordAC(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordAD(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordAD(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordAE(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordAE(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordAF(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordAF(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEBP);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB0(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB0(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordB1(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB1(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordB2(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB2(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordB3(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB3(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordB4(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB4(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB5(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB5(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB6(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB6(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB7(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB7(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regESI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordB8(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB8(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordB9(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordB9(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordBA(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordBA(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModMemWordBB(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordBB(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModMemWordBC(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordBC(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordBD(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordBD(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordBE(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordBE(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModMemWordBF(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opModMemWordBF(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), this.regEDI);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    X86ModW.aOpModReg[0xC0],    X86ModW.aOpModReg[0xC8],    X86ModW.aOpModReg[0xD0],    X86ModW.aOpModReg[0xD8],
    X86ModW.aOpModReg[0xE0],    X86ModW.aOpModReg[0xE8],    X86ModW.aOpModReg[0xF0],    X86ModW.aOpModReg[0xF8],
    X86ModW.aOpModReg[0xC1],    X86ModW.aOpModReg[0xC9],    X86ModW.aOpModReg[0xD1],    X86ModW.aOpModReg[0xD9],
    X86ModW.aOpModReg[0xE1],    X86ModW.aOpModReg[0xE9],    X86ModW.aOpModReg[0xF1],    X86ModW.aOpModReg[0xF9],
    X86ModW.aOpModReg[0xC2],    X86ModW.aOpModReg[0xCA],    X86ModW.aOpModReg[0xD2],    X86ModW.aOpModReg[0xDA],
    X86ModW.aOpModReg[0xE2],    X86ModW.aOpModReg[0xEA],    X86ModW.aOpModReg[0xF2],    X86ModW.aOpModReg[0xFA],
    X86ModW.aOpModReg[0xC3],    X86ModW.aOpModReg[0xCB],    X86ModW.aOpModReg[0xD3],    X86ModW.aOpModReg[0xDB],
    X86ModW.aOpModReg[0xE3],    X86ModW.aOpModReg[0xEB],    X86ModW.aOpModReg[0xF3],    X86ModW.aOpModReg[0xFB],
    X86ModW.aOpModReg[0xC4],    X86ModW.aOpModReg[0xCC],    X86ModW.aOpModReg[0xD4],    X86ModW.aOpModReg[0xDC],
    X86ModW.aOpModReg[0xE4],    X86ModW.aOpModReg[0xEC],    X86ModW.aOpModReg[0xF4],    X86ModW.aOpModReg[0xFC],
    X86ModW.aOpModReg[0xC5],    X86ModW.aOpModReg[0xCD],    X86ModW.aOpModReg[0xD5],    X86ModW.aOpModReg[0xDD],
    X86ModW.aOpModReg[0xE5],    X86ModW.aOpModReg[0xED],    X86ModW.aOpModReg[0xF5],    X86ModW.aOpModReg[0xFD],
    X86ModW.aOpModReg[0xC6],    X86ModW.aOpModReg[0xCE],    X86ModW.aOpModReg[0xD6],    X86ModW.aOpModReg[0xDE],
    X86ModW.aOpModReg[0xE6],    X86ModW.aOpModReg[0xEE],    X86ModW.aOpModReg[0xF6],    X86ModW.aOpModReg[0xFE],
    X86ModW.aOpModReg[0xC7],    X86ModW.aOpModReg[0xCF],    X86ModW.aOpModReg[0xD7],    X86ModW.aOpModReg[0xDF],
    X86ModW.aOpModReg[0xE7],    X86ModW.aOpModReg[0xEF],    X86ModW.aOpModReg[0xF7],    X86ModW.aOpModReg[0xFF]
];

X86ModW.aOpModGrp = [
    /**
     * opModGrpWord00(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord00(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord01(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord01(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord02(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord02(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord03(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord03(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord04(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord04(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord05(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord05(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord06(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord06(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord07(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord07(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord08(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord08(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord09(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord09(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord0A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord0A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord0B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord0B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord0C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord0C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord0D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord0D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord0E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord0E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord0F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord0F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord10(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord10(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord11(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord11(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord12(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord12(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord13(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord13(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord14(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord14(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord15(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord15(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord16(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord16(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord17(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord17(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord18(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord18(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord19(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord19(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord1A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord1A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord1B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord1B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord1C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord1C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord1D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord1D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord1E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord1E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord1F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord1F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord20(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord20(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord21(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord21(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord22(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord22(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord23(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord23(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord24(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord24(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord25(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord25(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord26(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord26(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord27(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord27(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord28(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord28(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord29(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord29(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord2A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord2A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord2B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord2B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord2C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord2C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord2D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord2D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord2E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord2E(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord2F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord2F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord30(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord30(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord31(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord31(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord32(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord32(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord33(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord33(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord34(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord34(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord35(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord35(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord36(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord36(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord37(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord37(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord38(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord38(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord39(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord39(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord3A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord3A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexExtra;
    },
    /**
     * opModGrpWord3B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord3B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndex;
    },
    /**
     * opModGrpWord3C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord3C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord3D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord3D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord3E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord3E(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesDisp;
    },
    /**
     * opModGrpWord3F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord3F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBase;
    },
    /**
     * opModGrpWord40(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord40(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord41(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord41(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord42(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord42(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord43(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord43(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord44(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord44(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord45(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord45(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord46(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord46(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord47(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord47(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord48(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord48(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord49(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord49(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord4A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord4A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord4B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord4B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord4C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord4C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord4D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord4D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord4E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord4E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord4F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord4F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord50(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord50(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord51(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord51(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord52(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord52(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord53(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord53(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord54(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord54(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord55(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord55(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord56(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord56(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord57(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord57(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord58(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord58(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord59(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord59(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord5A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord5A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord5B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord5B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord5C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord5C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord5D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord5D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord5E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord5E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord5F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord5F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord60(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord60(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord61(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord61(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord62(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord62(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord63(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord63(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord64(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord64(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord65(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord65(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord66(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord66(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord67(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord67(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord68(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord68(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord69(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord69(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord6A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord6A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord6B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord6B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord6C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord6C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord6D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord6D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord6E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord6E(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord6F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord6F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord70(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord70(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord71(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord71(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord72(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord72(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord73(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord73(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord74(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord74(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord75(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord75(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord76(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord76(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord77(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord77(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord78(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord78(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord79(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord79(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord7A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord7A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord7B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord7B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord7C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord7C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord7D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord7D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord7E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord7E(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord7F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord7F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord80(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord80(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord81(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord81(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord82(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord82(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord83(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord83(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord84(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord84(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord85(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord85(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord86(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord86(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord87(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord87(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord88(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord88(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord89(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord89(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord8A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord8A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord8B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord8B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord8C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord8C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord8D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord8D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord8E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord8E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord8F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord8F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord90(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord90(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord91(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord91(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord92(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord92(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord93(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord93(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord94(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord94(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord95(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord95(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord96(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord96(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord97(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord97(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord98(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord98(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord99(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord99(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord9A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord9A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWord9B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord9B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWord9C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord9C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord9D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord9D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord9E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord9E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWord9F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWord9F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA0(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordA1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA1(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordA2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA2(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordA3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA3(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordA4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA4(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA5(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA6(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA7(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordA8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA8(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordA9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordA9(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordAA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordAA(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordAB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordAB(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordAC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordAC(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordAD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordAD(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordAE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordAE(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordAF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordAF(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB0(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordB1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB1(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordB2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB2(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordB3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB3(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordB4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB4(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB5(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB6(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB7(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordB8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB8(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordB9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordB9(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordBA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordBA(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModGrpWordBB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordBB(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseIndexDisp;
    },
    /**
     * opModGrpWordBC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordBC(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordBD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordBD(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordBE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordBE(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordBF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordBF(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.getIPAddr()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.cycleCounts.nEACyclesBaseDisp;
    },
    /**
     * opModGrpWordC0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC0(afnGrp, fnSrc) {
        this.regEAX = afnGrp[0].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC1(afnGrp, fnSrc) {
        this.regECX = afnGrp[0].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC2(afnGrp, fnSrc) {
        this.regEDX = afnGrp[0].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC3(afnGrp, fnSrc) {
        this.regEBX = afnGrp[0].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC4(afnGrp, fnSrc) {
        this.setSP(afnGrp[0].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordC5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC5(afnGrp, fnSrc) {
        this.regEBP = afnGrp[0].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC6(afnGrp, fnSrc) {
        this.regESI = afnGrp[0].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC7(afnGrp, fnSrc) {
        this.regEDI = afnGrp[0].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC8(afnGrp, fnSrc) {
        this.regEAX = afnGrp[1].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordC9(afnGrp, fnSrc) {
        this.regECX = afnGrp[1].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordCA(afnGrp, fnSrc) {
        this.regEDX = afnGrp[1].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordCB(afnGrp, fnSrc) {
        this.regEBX = afnGrp[1].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordCC(afnGrp, fnSrc) {
        this.setSP(afnGrp[1].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordCD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordCD(afnGrp, fnSrc) {
        this.regEBP = afnGrp[1].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordCE(afnGrp, fnSrc) {
        this.regESI = afnGrp[1].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordCF(afnGrp, fnSrc) {
        this.regEDI = afnGrp[1].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD0(afnGrp, fnSrc) {
        this.regEAX = afnGrp[2].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD1(afnGrp, fnSrc) {
        this.regECX = afnGrp[2].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD2(afnGrp, fnSrc) {
        this.regEDX = afnGrp[2].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD3(afnGrp, fnSrc) {
        this.regEBX = afnGrp[2].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD4(afnGrp, fnSrc) {
        this.setSP(afnGrp[2].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordD5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD5(afnGrp, fnSrc) {
        this.regEBP = afnGrp[2].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD6(afnGrp, fnSrc) {
        this.regESI = afnGrp[2].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD7(afnGrp, fnSrc) {
        this.regEDI = afnGrp[2].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD8(afnGrp, fnSrc) {
        this.regEAX = afnGrp[3].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordD9(afnGrp, fnSrc) {
        this.regECX = afnGrp[3].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordDA(afnGrp, fnSrc) {
        this.regEDX = afnGrp[3].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordDB(afnGrp, fnSrc) {
        this.regEBX = afnGrp[3].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordDC(afnGrp, fnSrc) {
        this.setSP(afnGrp[3].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordDD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordDD(afnGrp, fnSrc) {
        this.regEBP = afnGrp[3].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordDE(afnGrp, fnSrc) {
        this.regESI = afnGrp[3].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordDF(afnGrp, fnSrc) {
        this.regEDI = afnGrp[3].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE0(afnGrp, fnSrc) {
        this.regEAX = afnGrp[4].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE1(afnGrp, fnSrc) {
        this.regECX = afnGrp[4].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE2(afnGrp, fnSrc) {
        this.regEDX = afnGrp[4].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE3(afnGrp, fnSrc) {
        this.regEBX = afnGrp[4].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE4(afnGrp, fnSrc) {
        this.setSP(afnGrp[4].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordE5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE5(afnGrp, fnSrc) {
        this.regEBP = afnGrp[4].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE6(afnGrp, fnSrc) {
        this.regESI = afnGrp[4].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE7(afnGrp, fnSrc) {
        this.regEDI = afnGrp[4].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE8(afnGrp, fnSrc) {
        this.regEAX = afnGrp[5].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordE9(afnGrp, fnSrc) {
        this.regECX = afnGrp[5].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordEA(afnGrp, fnSrc) {
        this.regEDX = afnGrp[5].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordEB(afnGrp, fnSrc) {
        this.regEBX = afnGrp[5].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordEC(afnGrp, fnSrc) {
        this.setSP(afnGrp[5].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordED(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordED(afnGrp, fnSrc) {
        this.regEBP = afnGrp[5].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordEE(afnGrp, fnSrc) {
        this.regESI = afnGrp[5].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordEF(afnGrp, fnSrc) {
        this.regEDI = afnGrp[5].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF0(afnGrp, fnSrc) {
        this.regEAX = afnGrp[6].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF1(afnGrp, fnSrc) {
        this.regECX = afnGrp[6].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF2(afnGrp, fnSrc) {
        this.regEDX = afnGrp[6].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF3(afnGrp, fnSrc) {
        this.regEBX = afnGrp[6].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF4(afnGrp, fnSrc) {
        this.setSP(afnGrp[6].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordF5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF5(afnGrp, fnSrc) {
        this.regEBP = afnGrp[6].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF6(afnGrp, fnSrc) {
        this.regESI = afnGrp[6].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF7(afnGrp, fnSrc) {
        this.regEDI = afnGrp[6].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF8(afnGrp, fnSrc) {
        this.regEAX = afnGrp[7].call(this, this.regEAX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordF9(afnGrp, fnSrc) {
        this.regECX = afnGrp[7].call(this, this.regECX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordFA(afnGrp, fnSrc) {
        this.regEDX = afnGrp[7].call(this, this.regEDX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordFB(afnGrp, fnSrc) {
        this.regEBX = afnGrp[7].call(this, this.regEBX, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordFC(afnGrp, fnSrc) {
        this.setSP(afnGrp[7].call(this, this.getSP(), fnSrc.call(this)));
    },
    /**
     * opModGrpWordFD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordFD(afnGrp, fnSrc) {
        this.regEBP = afnGrp[7].call(this, this.regEBP, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordFE(afnGrp, fnSrc) {
        this.regESI = afnGrp[7].call(this, this.regESI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opModGrpWordFF(afnGrp, fnSrc) {
        this.regEDI = afnGrp[7].call(this, this.regEDI, fnSrc.call(this));
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    }
];

if (typeof module !== 'undefined') module.exports = X86ModW;
