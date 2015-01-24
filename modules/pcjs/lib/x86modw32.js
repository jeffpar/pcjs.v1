/**
 * @fileoverview Implements PCjs 8086 mode-byte decoding.
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

var X86ModW32 = {};

X86ModW32.aOpModReg = [
    /**
     * opMod32RegWord00(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord00(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEAX));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord01(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord01(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regECX));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord02(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord02(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEDX));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord03(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord03(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEBX));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord04(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord04(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord05(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord05(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord06(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord06(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regESI));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord07(fn): mod=00 (src:mem)  reg=000 (dst:AX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord07(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEDI));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord08(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord08(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEAX));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord09(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord09(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regECX));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord0A(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord0A(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEDX));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord0B(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord0B(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEBX));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord0C(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord0C(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord0D(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord0D(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord0E(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord0E(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regESI));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord0F(fn): mod=00 (src:mem)  reg=001 (dst:CX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord0F(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEDI));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord10(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord10(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEAX));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord11(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord11(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regECX));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord12(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord12(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEDX));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord13(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord13(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEBX));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord14(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord14(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord15(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord15(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord16(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord16(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regESI));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord17(fn): mod=00 (src:mem)  reg=010 (dst:DX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord17(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEDI));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord18(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord18(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEAX));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord19(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord19(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regECX));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord1A(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord1A(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEDX));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord1B(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord1B(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEBX));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord1C(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord1C(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord1D(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord1D(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord1E(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord1E(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regESI));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord1F(fn): mod=00 (src:mem)  reg=011 (dst:BX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord1F(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEDI));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord20(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord20(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEAX));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord21(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord21(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regECX));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord22(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord22(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEDX));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord23(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord23(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEBX));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord24(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord24(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord25(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord25(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord26(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord26(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regESI));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord27(fn): mod=00 (src:mem)  reg=100 (dst:SP)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord27(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEDI));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord28(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord28(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEAX));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord29(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord29(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regECX));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord2A(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord2A(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEDX));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord2B(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord2B(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEBX));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord2C(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord2C(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord2D(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord2D(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord2E(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord2E(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regESI));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord2F(fn): mod=00 (src:mem)  reg=101 (dst:BP)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord2F(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEDI));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord30(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord30(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEAX));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord31(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord31(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regECX));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord32(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord32(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEDX));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord33(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord33(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEBX));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord34(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord34(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord35(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord35(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord36(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord36(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regESI));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord37(fn): mod=00 (src:mem)  reg=110 (dst:SI)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord37(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEDI));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord38(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord38(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEAX));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord39(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord39(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regECX));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord3A(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord3A(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEDX));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord3B(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord3B(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEBX));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord3C(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord3C(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.getSIBAddr(0)));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord3D(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord3D(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32RegWord3E(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord3E(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regESI));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord3F(fn): mod=00 (src:mem)  reg=111 (dst:DI)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord3F(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEDI));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32RegWord40(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord40(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord41(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord41(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord42(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord42(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord43(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord43(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord44(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord44(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord45(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord45(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord46(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord46(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord47(fn): mod=01 (src:mem+d8)  reg=000 (dst:AX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord47(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord48(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord48(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord49(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord49(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord4A(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord4A(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord4B(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord4B(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord4C(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord4C(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord4D(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord4D(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord4E(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord4E(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord4F(fn): mod=01 (src:mem+d8)  reg=001 (dst:CX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord4F(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord50(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord50(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord51(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord51(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord52(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord52(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord53(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord53(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord54(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord54(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord55(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord55(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord56(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord56(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord57(fn): mod=01 (src:mem+d8)  reg=010 (dst:DX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord57(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord58(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord58(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord59(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord59(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord5A(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord5A(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord5B(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord5B(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord5C(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord5C(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord5D(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord5D(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord5E(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord5E(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord5F(fn): mod=01 (src:mem+d8)  reg=011 (dst:BX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord5F(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord60(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord60(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord61(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord61(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord62(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord62(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord63(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord63(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord64(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord64(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord65(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord65(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord66(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord66(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord67(fn): mod=01 (src:mem+d8)  reg=100 (dst:SP)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord67(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord68(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord68(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord69(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord69(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord6A(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord6A(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord6B(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord6B(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord6C(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord6C(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord6D(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord6D(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord6E(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord6E(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord6F(fn): mod=01 (src:mem+d8)  reg=101 (dst:BP)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord6F(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord70(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord70(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord71(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord71(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord72(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord72(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord73(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord73(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord74(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord74(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord75(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord75(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord76(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord76(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord77(fn): mod=01 (src:mem+d8)  reg=110 (dst:SI)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord77(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord78(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord78(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEAX + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord79(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord79(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regECX + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord7A(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord7A(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEDX + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord7B(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord7B(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEBX + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord7C(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord7C(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.getSIBAddr(1) + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord7D(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord7D(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordStack(this.regEBP + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord7E(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord7E(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regESI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord7F(fn): mod=01 (src:mem+d8)  reg=111 (dst:DI)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord7F(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEDI + this.getIPDisp()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord80(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord80(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord81(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord81(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord82(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord82(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord83(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord83(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord84(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord84(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord85(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord85(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord86(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord86(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord87(fn): mod=10 (src:mem+d16)  reg=000 (dst:AX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord87(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord88(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord88(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord89(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord89(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord8A(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord8A(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord8B(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord8B(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord8C(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord8C(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord8D(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord8D(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord8E(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord8E(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord8F(fn): mod=10 (src:mem+d16)  reg=001 (dst:CX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord8F(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord90(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord90(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord91(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord91(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord92(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord92(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord93(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord93(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord94(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord94(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord95(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord95(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord96(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord96(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord97(fn): mod=10 (src:mem+d16)  reg=010 (dst:DX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord97(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord98(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord98(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord99(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord99(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord9A(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord9A(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord9B(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord9B(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord9C(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord9C(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord9D(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord9D(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord9E(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord9E(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWord9F(fn): mod=10 (src:mem+d16)  reg=011 (dst:BX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWord9F(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA0(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA0(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA1(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA1(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA2(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA2(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA3(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA3(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA4(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA4(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA5(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA5(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA6(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA6(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA7(fn): mod=10 (src:mem+d16)  reg=100 (dst:SP)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA7(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regESP = (this.regESP & ~this.opMask) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA8(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA8(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordA9(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordA9(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordAA(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordAA(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordAB(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordAB(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordAC(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordAC(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordAD(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordAD(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordAE(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordAE(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordAF(fn): mod=10 (src:mem+d16)  reg=101 (dst:BP)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordAF(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB0(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB0(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB1(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB1(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB2(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB2(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB3(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB3(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB4(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB4(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB5(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB5(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB6(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB6(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB7(fn): mod=10 (src:mem+d16)  reg=110 (dst:SI)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB7(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB8(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB8(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEAX + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordB9(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordB9(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regECX + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordBA(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordBA(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEDX + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordBB(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordBB(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEBX + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordBC(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordBC(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.getSIBAddr(2) + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordBD(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordBD(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordStack(this.regEBP + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordBE(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordBE(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regESI + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordBF(fn): mod=10 (src:mem+d16)  reg=111 (dst:DI)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordBF(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWordData(this.regEDI + this.getIPWord()));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32RegWordC0(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC0(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEAX & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordC1(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC1(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regECX & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiCL; this.backTrack.btiAH = this.backTrack.btiCH;
        }
    },
    /**
     * opMod32RegWordC2(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC2(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEDX & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDL; this.backTrack.btiAH = this.backTrack.btiDH;
        }
    },
    /**
     * opMod32RegWordC3(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC3(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEBX & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBL; this.backTrack.btiAH = this.backTrack.btiBH;
        }
    },
    /**
     * opMod32RegWordC4(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC4(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regESP & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = X86.BACKTRACK.SP_LO; this.backTrack.btiAH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod32RegWordC5(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC5(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEBP & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiBPLo; this.backTrack.btiAH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod32RegWordC6(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC6(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regESI & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiSILo; this.backTrack.btiAH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod32RegWordC7(fn): mod=11 (src:reg)  reg=000 (dst:AX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC7(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEDI & this.opMask);
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiDILo; this.backTrack.btiAH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod32RegWordC8(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC8(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEAX & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiAL; this.backTrack.btiCH = this.backTrack.btiAH;
        }
    },
    /**
     * opMod32RegWordC9(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordC9(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regECX & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordCA(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordCA(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEDX & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDL; this.backTrack.btiCH = this.backTrack.btiDH;
        }
    },
    /**
     * opMod32RegWordCB(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordCB(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEBX & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBL; this.backTrack.btiCH = this.backTrack.btiBH;
        }
    },
    /**
     * opMod32RegWordCC(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordCC(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regESP & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = X86.BACKTRACK.SP_LO; this.backTrack.btiCH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod32RegWordCD(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordCD(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEBP & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiBPLo; this.backTrack.btiCH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod32RegWordCE(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordCE(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regESI & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiSILo; this.backTrack.btiCH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod32RegWordCF(fn): mod=11 (src:reg)  reg=001 (dst:CX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordCF(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEDI & this.opMask);
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiDILo; this.backTrack.btiCH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod32RegWordD0(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD0(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEAX & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiAL; this.backTrack.btiDH = this.backTrack.btiAH;
        }
    },
    /**
     * opMod32RegWordD1(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD1(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regECX & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiCL; this.backTrack.btiDH = this.backTrack.btiCH;
        }
    },
    /**
     * opMod32RegWordD2(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD2(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEDX & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordD3(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD3(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEBX & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBL; this.backTrack.btiDH = this.backTrack.btiBH;
        }
    },
    /**
     * opMod32RegWordD4(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD4(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regESP & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = X86.BACKTRACK.SP_LO; this.backTrack.btiDH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod32RegWordD5(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD5(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEBP & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiBPLo; this.backTrack.btiDH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod32RegWordD6(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD6(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regESI & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiSILo; this.backTrack.btiDH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod32RegWordD7(fn): mod=11 (src:reg)  reg=010 (dst:DX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD7(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEDI & this.opMask);
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiDILo; this.backTrack.btiDH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod32RegWordD8(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD8(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEAX & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiAL; this.backTrack.btiBH = this.backTrack.btiAH;
        }
    },
    /**
     * opMod32RegWordD9(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordD9(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regECX & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiCL; this.backTrack.btiBH = this.backTrack.btiCH;
        }
    },
    /**
     * opMod32RegWordDA(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordDA(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEDX & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDL; this.backTrack.btiBH = this.backTrack.btiDH;
        }
    },
    /**
     * opMod32RegWordDB(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordDB(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEBX & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordDC(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordDC(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regESP & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = X86.BACKTRACK.SP_LO; this.backTrack.btiBH = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod32RegWordDD(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordDD(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEBP & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiBPLo; this.backTrack.btiBH = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod32RegWordDE(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordDE(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regESI & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiSILo; this.backTrack.btiBH = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod32RegWordDF(fn): mod=11 (src:reg)  reg=011 (dst:BX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordDF(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEDI & this.opMask);
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiDILo; this.backTrack.btiBH = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod32RegWordE0(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE0(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEAX & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE1(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE1(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regECX & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE2(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE2(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEDX & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE3(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE3(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEBX & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE4(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE4(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regESP & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE5(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE5(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEBP & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE6(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE6(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regESI & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE7(fn): mod=11 (src:reg)  reg=100 (dst:SP)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE7(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEDI & this.opMask);
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordE8(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE8(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEAX & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiAL; this.backTrack.btiBPHi = this.backTrack.btiAH;
        }
    },
    /**
     * opMod32RegWordE9(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordE9(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regECX & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiCL; this.backTrack.btiBPHi = this.backTrack.btiCH;
        }
    },
    /**
     * opMod32RegWordEA(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordEA(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEDX & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDL; this.backTrack.btiBPHi = this.backTrack.btiDH;
        }
    },
    /**
     * opMod32RegWordEB(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordEB(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEBX & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiBL; this.backTrack.btiBPHi = this.backTrack.btiBH;
        }
    },
    /**
     * opMod32RegWordEC(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordEC(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regESP & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = X86.BACKTRACK.SP_LO; this.backTrack.btiBPHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod32RegWordED(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordED(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEBP & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordEE(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordEE(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regESI & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiSILo; this.backTrack.btiBPHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod32RegWordEF(fn): mod=11 (src:reg)  reg=101 (dst:BP)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordEF(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEDI & this.opMask);
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiDILo; this.backTrack.btiBPHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod32RegWordF0(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF0(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEAX & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiAL; this.backTrack.btiSIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opMod32RegWordF1(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF1(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regECX & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiCL; this.backTrack.btiSIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opMod32RegWordF2(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF2(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEDX & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDL; this.backTrack.btiSIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opMod32RegWordF3(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF3(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEBX & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBL; this.backTrack.btiSIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opMod32RegWordF4(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF4(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regESP & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = X86.BACKTRACK.SP_LO; this.backTrack.btiSIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod32RegWordF5(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF5(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEBP & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiBPLo; this.backTrack.btiSIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod32RegWordF6(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF6(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regESI & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
    },
    /**
     * opMod32RegWordF7(fn): mod=11 (src:reg)  reg=110 (dst:SI)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF7(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEDI & this.opMask);
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiDILo; this.backTrack.btiSIHi = this.backTrack.btiDIHi;
        }
    },
    /**
     * opMod32RegWordF8(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF8(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEAX & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiAL; this.backTrack.btiDIHi = this.backTrack.btiAH;
        }
    },
    /**
     * opMod32RegWordF9(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordF9(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regECX & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiCL; this.backTrack.btiDIHi = this.backTrack.btiCH;
        }
    },
    /**
     * opMod32RegWordFA(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordFA(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEDX & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiDL; this.backTrack.btiDIHi = this.backTrack.btiDH;
        }
    },
    /**
     * opMod32RegWordFB(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordFB(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEBX & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBL; this.backTrack.btiDIHi = this.backTrack.btiBH;
        }
    },
    /**
     * opMod32RegWordFC(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordFC(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regESP & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = X86.BACKTRACK.SP_LO; this.backTrack.btiDIHi = X86.BACKTRACK.SP_HI;
        }
    },
    /**
     * opMod32RegWordFD(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordFD(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEBP & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiBPLo; this.backTrack.btiDIHi = this.backTrack.btiBPHi;
        }
    },
    /**
     * opMod32RegWordFE(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordFE(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regESI & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiSILo; this.backTrack.btiDIHi = this.backTrack.btiSIHi;
        }
    },
    /**
     * opMod32RegWordFF(fn): mod=11 (src:reg)  reg=111 (dst:DI)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32RegWordFF(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEDI & this.opMask);
        this.regEDI = (this.regEDI & ~this.opMask) | w;
    }
];

X86ModW32.aOpModMem = [
    /**
     * opMod32MemWord00(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord00(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord01(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord01(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord02(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord02(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord03(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord03(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord04(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord04(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord05(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord05(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord06(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord06(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord07(fn): mod=00 (dst:mem)  reg=000 (src:AX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord07(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord08(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord08(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord09(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord09(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord0A(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord0A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord0B(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord0B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord0C(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord0C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord0D(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord0D(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord0E(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord0E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord0F(fn): mod=00 (dst:mem)  reg=001 (src:CX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord0F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord10(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord10(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord11(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord11(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord12(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord12(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord13(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord13(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord14(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord14(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord15(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord15(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord16(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord16(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord17(fn): mod=00 (dst:mem)  reg=010 (src:DX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord17(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord18(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord18(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord19(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord19(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord1A(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord1A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord1B(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord1B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord1C(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord1C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord1D(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord1D(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord1E(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord1E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord1F(fn): mod=00 (dst:mem)  reg=011 (src:BX)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord1F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord20(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord20(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord21(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord21(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord22(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord22(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord23(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord23(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord24(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord24(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord25(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord25(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord26(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord26(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord27(fn): mod=00 (dst:mem)  reg=100 (src:SP)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord27(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord28(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord28(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord29(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord29(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord2A(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord2A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord2B(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord2B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord2C(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord2C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord2D(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord2D(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord2E(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord2E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord2F(fn): mod=00 (dst:mem)  reg=101 (src:BP)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord2F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord30(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord30(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord31(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord31(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord32(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord32(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord33(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord33(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord34(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord34(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord35(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord35(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord36(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord36(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord37(fn): mod=00 (dst:mem)  reg=110 (src:SI)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord37(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord38(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord38(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord39(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord39(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord3A(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord3A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord3B(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord3B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord3C(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord3C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(0)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord3D(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord3D(fn) {
        var w = fn.call(this, this.modEAWordData(this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32MemWord3E(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord3E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord3F(fn): mod=00 (dst:mem)  reg=111 (src:DI)  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord3F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32MemWord40(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord40(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord41(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord41(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord42(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord42(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord43(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord43(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord44(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord44(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord45(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord45(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord46(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord46(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord47(fn): mod=01 (dst:mem+d8)  reg=000 (src:AX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord47(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord48(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord48(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord49(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord49(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord4A(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord4A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord4B(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord4B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord4C(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord4C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord4D(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord4D(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord4E(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord4E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord4F(fn): mod=01 (dst:mem+d8)  reg=001 (src:CX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord4F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord50(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord50(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord51(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord51(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord52(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord52(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord53(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord53(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord54(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord54(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord55(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord55(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord56(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord56(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord57(fn): mod=01 (dst:mem+d8)  reg=010 (src:DX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord57(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord58(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord58(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord59(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord59(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord5A(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord5A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord5B(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord5B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord5C(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord5C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord5D(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord5D(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord5E(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord5E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord5F(fn): mod=01 (dst:mem+d8)  reg=011 (src:BX)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord5F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord60(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord60(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord61(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord61(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord62(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord62(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord63(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord63(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord64(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord64(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord65(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord65(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord66(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord66(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord67(fn): mod=01 (dst:mem+d8)  reg=100 (src:SP)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord67(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord68(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord68(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord69(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord69(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord6A(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord6A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord6B(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord6B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord6C(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord6C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord6D(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord6D(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord6E(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord6E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord6F(fn): mod=01 (dst:mem+d8)  reg=101 (src:BP)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord6F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord70(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord70(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord71(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord71(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord72(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord72(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord73(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord73(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord74(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord74(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord75(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord75(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord76(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord76(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord77(fn): mod=01 (dst:mem+d8)  reg=110 (src:SI)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord77(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord78(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord78(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord79(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord79(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord7A(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord7A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord7B(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord7B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord7C(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord7C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord7D(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord7D(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord7E(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord7E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord7F(fn): mod=01 (dst:mem+d8)  reg=111 (src:DI)  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord7F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord80(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord80(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord81(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord81(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord82(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord82(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord83(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord83(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord84(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord84(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord85(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord85(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord86(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord86(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord87(fn): mod=10 (dst:mem+d16)  reg=000 (src:AX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord87(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord88(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord88(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord89(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord89(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord8A(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord8A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord8B(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord8B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord8C(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord8C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord8D(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord8D(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord8E(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord8E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord8F(fn): mod=10 (dst:mem+d16)  reg=001 (src:CX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord8F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord90(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord90(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord91(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord91(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord92(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord92(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord93(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord93(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord94(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord94(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord95(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord95(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord96(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord96(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord97(fn): mod=10 (dst:mem+d16)  reg=010 (src:DX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord97(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord98(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord98(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord99(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord99(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord9A(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord9A(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord9B(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord9B(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord9C(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord9C(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord9D(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord9D(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord9E(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord9E(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWord9F(fn): mod=10 (dst:mem+d16)  reg=011 (src:BX)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWord9F(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA0(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA0(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA1(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA1(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA2(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA2(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA3(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA3(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA4(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA4(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA5(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA5(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA6(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA6(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA7(fn): mod=10 (dst:mem+d16)  reg=100 (src:SP)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA7(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA8(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA8(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordA9(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordA9(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordAA(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordAA(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordAB(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordAB(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordAC(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordAC(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordAD(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordAD(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordAE(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordAE(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordAF(fn): mod=10 (dst:mem+d16)  reg=101 (src:BP)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordAF(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB0(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB0(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB1(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB1(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB2(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB2(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB3(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB3(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB4(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB4(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB5(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB5(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB6(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB6(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB7(fn): mod=10 (dst:mem+d16)  reg=110 (src:SI)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB7(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB8(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB8(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEAX + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordB9(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordB9(fn) {
        var w = fn.call(this, this.modEAWordData(this.regECX + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordBA(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordBA(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDX + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordBB(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordBB(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEBX + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordBC(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordBC(fn) {
        var w = fn.call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordBD(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordBD(fn) {
        var w = fn.call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordBE(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordBE(fn) {
        var w = fn.call(this, this.modEAWordData(this.regESI + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32MemWordBF(fn): mod=10 (dst:mem+d16)  reg=111 (src:DI)  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    function opMod32MemWordBF(fn) {
        var w = fn.call(this, this.modEAWordData(this.regEDI + this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    X86ModW32.aOpModReg[0xC0],    X86ModW32.aOpModReg[0xC8],    X86ModW32.aOpModReg[0xD0],    X86ModW32.aOpModReg[0xD8],
    X86ModW32.aOpModReg[0xE0],    X86ModW32.aOpModReg[0xE8],    X86ModW32.aOpModReg[0xF0],    X86ModW32.aOpModReg[0xF8],
    X86ModW32.aOpModReg[0xC1],    X86ModW32.aOpModReg[0xC9],    X86ModW32.aOpModReg[0xD1],    X86ModW32.aOpModReg[0xD9],
    X86ModW32.aOpModReg[0xE1],    X86ModW32.aOpModReg[0xE9],    X86ModW32.aOpModReg[0xF1],    X86ModW32.aOpModReg[0xF9],
    X86ModW32.aOpModReg[0xC2],    X86ModW32.aOpModReg[0xCA],    X86ModW32.aOpModReg[0xD2],    X86ModW32.aOpModReg[0xDA],
    X86ModW32.aOpModReg[0xE2],    X86ModW32.aOpModReg[0xEA],    X86ModW32.aOpModReg[0xF2],    X86ModW32.aOpModReg[0xFA],
    X86ModW32.aOpModReg[0xC3],    X86ModW32.aOpModReg[0xCB],    X86ModW32.aOpModReg[0xD3],    X86ModW32.aOpModReg[0xDB],
    X86ModW32.aOpModReg[0xE3],    X86ModW32.aOpModReg[0xEB],    X86ModW32.aOpModReg[0xF3],    X86ModW32.aOpModReg[0xFB],
    X86ModW32.aOpModReg[0xC4],    X86ModW32.aOpModReg[0xCC],    X86ModW32.aOpModReg[0xD4],    X86ModW32.aOpModReg[0xDC],
    X86ModW32.aOpModReg[0xE4],    X86ModW32.aOpModReg[0xEC],    X86ModW32.aOpModReg[0xF4],    X86ModW32.aOpModReg[0xFC],
    X86ModW32.aOpModReg[0xC5],    X86ModW32.aOpModReg[0xCD],    X86ModW32.aOpModReg[0xD5],    X86ModW32.aOpModReg[0xDD],
    X86ModW32.aOpModReg[0xE5],    X86ModW32.aOpModReg[0xED],    X86ModW32.aOpModReg[0xF5],    X86ModW32.aOpModReg[0xFD],
    X86ModW32.aOpModReg[0xC6],    X86ModW32.aOpModReg[0xCE],    X86ModW32.aOpModReg[0xD6],    X86ModW32.aOpModReg[0xDE],
    X86ModW32.aOpModReg[0xE6],    X86ModW32.aOpModReg[0xEE],    X86ModW32.aOpModReg[0xF6],    X86ModW32.aOpModReg[0xFE],
    X86ModW32.aOpModReg[0xC7],    X86ModW32.aOpModReg[0xCF],    X86ModW32.aOpModReg[0xD7],    X86ModW32.aOpModReg[0xDF],
    X86ModW32.aOpModReg[0xE7],    X86ModW32.aOpModReg[0xEF],    X86ModW32.aOpModReg[0xF7],    X86ModW32.aOpModReg[0xFF]
];

X86ModW32.aOpModGrp = [
    /**
     * opMod32GrpWord00(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord00(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord01(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord01(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord02(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord02(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord03(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord03(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord04(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord04(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord05(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord05(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord06(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord06(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord07(afnGrp, fnSrc): mod=00 (dst:mem)  reg=000 (afnGrp[0])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord07(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord08(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord08(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord09(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord09(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord0A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord0A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord0B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord0B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord0C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord0C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord0D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord0D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord0E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord0E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord0F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=001 (afnGrp[1])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord0F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord10(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord10(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord11(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord11(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord12(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord12(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord13(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord13(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord14(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord14(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord15(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord15(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord16(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord16(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord17(afnGrp, fnSrc): mod=00 (dst:mem)  reg=010 (afnGrp[2])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord17(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord18(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord18(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord19(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord19(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord1A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord1A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord1B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord1B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord1C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord1C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord1D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord1D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord1E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord1E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord1F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=011 (afnGrp[3])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord1F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord20(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord20(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord21(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord21(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord22(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord22(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord23(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord23(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord24(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord24(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord25(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord25(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord26(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord26(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord27(afnGrp, fnSrc): mod=00 (dst:mem)  reg=100 (afnGrp[4])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord27(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord28(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord28(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord29(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord29(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord2A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord2A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord2B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord2B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord2C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord2C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord2D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord2D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord2E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord2E(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord2F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=101 (afnGrp[5])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord2F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord30(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord30(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord31(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord31(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord32(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord32(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord33(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord33(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord34(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord34(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord35(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord35(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord36(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord36(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord37(afnGrp, fnSrc): mod=00 (dst:mem)  reg=110 (afnGrp[6])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord37(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord38(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord38(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEAX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord39(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord39(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regECX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord3A(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord3A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord3B(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord3B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord3C(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=100 (sib)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord3C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.getSIBAddr(0)), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord3D(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=101 (d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord3D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opMod32GrpWord3E(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord3E(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord3F(afnGrp, fnSrc): mod=00 (dst:mem)  reg=111 (afnGrp[7])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord3F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opMod32GrpWord40(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord40(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord41(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord41(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord42(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord42(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord43(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord43(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord44(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord44(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord45(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord45(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord46(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord46(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord47(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=000 (afnGrp[0])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord47(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord48(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord48(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord49(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord49(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord4A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord4A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord4B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord4B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord4C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord4C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord4D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord4D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord4E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord4E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord4F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=001 (afnGrp[1])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord4F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord50(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord50(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord51(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord51(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord52(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord52(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord53(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord53(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord54(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord54(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord55(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord55(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord56(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord56(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord57(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=010 (afnGrp[2])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord57(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord58(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord58(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord59(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord59(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord5A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord5A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord5B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord5B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord5C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord5C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord5D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord5D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord5E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord5E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord5F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=011 (afnGrp[3])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord5F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord60(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord60(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord61(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord61(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord62(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord62(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord63(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord63(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord64(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord64(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord65(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord65(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord66(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord66(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord67(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=100 (afnGrp[4])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord67(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord68(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord68(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord69(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord69(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord6A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord6A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord6B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord6B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord6C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord6C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord6D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord6D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord6E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord6E(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord6F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=101 (afnGrp[5])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord6F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord70(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord70(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord71(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord71(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord72(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord72(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord73(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord73(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord74(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord74(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord75(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord75(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord76(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord76(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord77(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=110 (afnGrp[6])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord77(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord78(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=000 (EAX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord78(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEAX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord79(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=001 (ECX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord79(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regECX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord7A(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=010 (EDX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord7A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord7B(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=011 (EBX+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord7B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord7C(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=100 (sib+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord7C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.getSIBAddr(1) + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord7D(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=101 (EBP+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord7D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord7E(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=110 (ESI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord7E(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord7F(afnGrp, fnSrc): mod=01 (dst:mem+d8)  reg=111 (afnGrp[7])  r/m=111 (EDI+d8)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord7F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI + this.getIPDisp()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord80(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord80(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord81(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord81(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord82(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord82(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord83(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord83(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord84(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord84(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord85(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord85(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord86(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord86(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord87(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=000 (afnGrp[0])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord87(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord88(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord88(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord89(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord89(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord8A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord8A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord8B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord8B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord8C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord8C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord8D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord8D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord8E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord8E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord8F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=001 (afnGrp[1])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord8F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord90(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord90(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord91(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord91(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord92(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord92(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord93(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord93(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord94(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord94(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord95(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord95(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord96(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord96(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord97(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=010 (afnGrp[2])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord97(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord98(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord98(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord99(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord99(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord9A(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord9A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord9B(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord9B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord9C(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord9C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord9D(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord9D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord9E(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord9E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWord9F(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=011 (afnGrp[3])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWord9F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA0(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA1(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA2(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA3(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA4(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA5(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA6(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=100 (afnGrp[4])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA7(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA8(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordA9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordA9(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordAA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordAA(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordAB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordAB(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordAC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordAC(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordAD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordAD(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordAE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordAE(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordAF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=101 (afnGrp[5])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordAF(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB0(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB0(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB1(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB1(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB2(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB2(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB3(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB3(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB4(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB4(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB5(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB5(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB6(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB6(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB7(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=110 (afnGrp[6])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB7(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB8(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=000 (EAX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB8(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEAX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordB9(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=001 (ECX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordB9(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regECX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordBA(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=010 (EDX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordBA(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordBB(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=011 (EBX+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordBB(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEBX + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordBC(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=100 (sib+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordBC(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.getSIBAddr(2) + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordBD(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=101 (EBP+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordBD(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordStack(this.regEBP + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordBE(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=110 (ESI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordBE(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regESI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordBF(afnGrp, fnSrc): mod=10 (dst:mem+d16)  reg=111 (afnGrp[7])  r/m=111 (EDI+d32)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordBF(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWordData(this.regEDI + this.getIPWord()), fnSrc.call(this));
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opMod32GrpWordC0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC0(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC1(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC2(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC3(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC4(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordC5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC5(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC6(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=000 (afnGrp[0])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC7(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC8(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordC9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordC9(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordCA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordCA(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordCB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordCB(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordCC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordCC(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordCD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordCD(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordCE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordCE(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordCF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=001 (afnGrp[1])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordCF(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD0(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD1(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD2(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD3(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD4(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordD5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD5(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD6(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=010 (afnGrp[2])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD7(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD8(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordD9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordD9(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordDA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordDA(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordDB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordDB(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordDC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordDC(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordDD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordDD(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordDE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordDE(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordDF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=011 (afnGrp[3])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordDF(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE0(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE1(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE2(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE3(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE4(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordE5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE5(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE6(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=100 (afnGrp[4])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE7(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE8(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordE9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordE9(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordEA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordEA(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordEB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordEB(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordEC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordEC(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordED(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordED(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordEE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordEE(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordEF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=101 (afnGrp[5])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordEF(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF0(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF0(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF1(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF1(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF2(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF2(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF3(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF3(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF4(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF4(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordF5(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF5(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF6(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF6(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF7(afnGrp, fnSrc): mod=11 (dst:reg)  reg=110 (afnGrp[6])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF7(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF8(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=000 (EAX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF8(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordF9(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=001 (ECX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordF9(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordFA(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=010 (EDX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordFA(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordFB(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=011 (EBX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordFB(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordFC(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=100 (ESP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordFC(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & ~this.opMask) | w;
    },
    /**
     * opMod32GrpWordFD(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=101 (EBP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordFD(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordFE(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=110 (ESI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordFE(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opMod32GrpWordFF(afnGrp, fnSrc): mod=11 (dst:reg)  reg=111 (afnGrp[7])  r/m=111 (EDI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    function opMod32GrpWordFF(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & ~this.opMask) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    }
];

if (typeof module !== 'undefined') module.exports = X86ModW32;
