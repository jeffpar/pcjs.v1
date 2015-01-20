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

var X86ModW = {
    /**
     * opModMemWord00(fn): mod=00 (mem:dst)  reg=000 (AX:src)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModMem00: function opModMemWord00(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem01: function opModMemWord01(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem02: function opModMemWord02(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem03: function opModMemWord03(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem04: function opModMemWord04(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem05: function opModMemWord05(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem06: function opModMemWord06(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem07: function opModMemWord07(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem08: function opModMemWord08(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem09: function opModMemWord09(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem0A: function opModMemWord0A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem0B: function opModMemWord0B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem0C: function opModMemWord0C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem0D: function opModMemWord0D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem0E: function opModMemWord0E(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem0F: function opModMemWord0F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem10: function opModMemWord10(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem11: function opModMemWord11(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem12: function opModMemWord12(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem13: function opModMemWord13(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem14: function opModMemWord14(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem15: function opModMemWord15(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem16: function opModMemWord16(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem17: function opModMemWord17(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem18: function opModMemWord18(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem19: function opModMemWord19(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem1A: function opModMemWord1A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem1B: function opModMemWord1B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem1C: function opModMemWord1C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem1D: function opModMemWord1D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem1E: function opModMemWord1E(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem1F: function opModMemWord1F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem20: function opModMemWord20(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem21: function opModMemWord21(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem22: function opModMemWord22(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem23: function opModMemWord23(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem24: function opModMemWord24(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem25: function opModMemWord25(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem26: function opModMemWord26(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem27: function opModMemWord27(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem28: function opModMemWord28(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem29: function opModMemWord29(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem2A: function opModMemWord2A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem2B: function opModMemWord2B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem2C: function opModMemWord2C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem2D: function opModMemWord2D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem2E: function opModMemWord2E(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem2F: function opModMemWord2F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem30: function opModMemWord30(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem31: function opModMemWord31(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem32: function opModMemWord32(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem33: function opModMemWord33(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem34: function opModMemWord34(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem35: function opModMemWord35(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem36: function opModMemWord36(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem37: function opModMemWord37(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem38: function opModMemWord38(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem39: function opModMemWord39(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem3A: function opModMemWord3A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem3B: function opModMemWord3B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem3C: function opModMemWord3C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem3D: function opModMemWord3D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem3E: function opModMemWord3E(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, this.getIPWord()), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem3F: function opModMemWord3F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem40: function opModMemWord40(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem41: function opModMemWord41(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem42: function opModMemWord42(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem43: function opModMemWord43(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem44: function opModMemWord44(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem45: function opModMemWord45(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem46: function opModMemWord46(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem47: function opModMemWord47(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem48: function opModMemWord48(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem49: function opModMemWord49(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem4A: function opModMemWord4A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem4B: function opModMemWord4B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem4C: function opModMemWord4C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem4D: function opModMemWord4D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem4E: function opModMemWord4E(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem4F: function opModMemWord4F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem50: function opModMemWord50(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem51: function opModMemWord51(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem52: function opModMemWord52(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem53: function opModMemWord53(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem54: function opModMemWord54(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem55: function opModMemWord55(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem56: function opModMemWord56(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem57: function opModMemWord57(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem58: function opModMemWord58(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem59: function opModMemWord59(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem5A: function opModMemWord5A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem5B: function opModMemWord5B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem5C: function opModMemWord5C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem5D: function opModMemWord5D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem5E: function opModMemWord5E(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem5F: function opModMemWord5F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem60: function opModMemWord60(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem61: function opModMemWord61(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem62: function opModMemWord62(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem63: function opModMemWord63(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem64: function opModMemWord64(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem65: function opModMemWord65(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem66: function opModMemWord66(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem67: function opModMemWord67(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMem68: function opModMemWord68(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem69: function opModMemWord69(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem6A: function opModMemWord6A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem6B: function opModMemWord6B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem6C: function opModMemWord6C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem6D: function opModMemWord6D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem6E: function opModMemWord6E(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem6F: function opModMemWord6F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMem70: function opModMemWord70(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem71: function opModMemWord71(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem72: function opModMemWord72(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem73: function opModMemWord73(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem74: function opModMemWord74(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem75: function opModMemWord75(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem76: function opModMemWord76(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem77: function opModMemWord77(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMem78: function opModMemWord78(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem79: function opModMemWord79(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem7A: function opModMemWord7A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem7B: function opModMemWord7B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem7C: function opModMemWord7C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem7D: function opModMemWord7D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem7E: function opModMemWord7E(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem7F: function opModMemWord7F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMem80: function opModMemWord80(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem81: function opModMemWord81(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem82: function opModMemWord82(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem83: function opModMemWord83(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem84: function opModMemWord84(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem85: function opModMemWord85(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem86: function opModMemWord86(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem87: function opModMemWord87(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEAX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiAL; this.backTrack.btiEAHi = this.backTrack.btiAH;
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
    opModMem88: function opModMemWord88(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem89: function opModMemWord89(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem8A: function opModMemWord8A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem8B: function opModMemWord8B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem8C: function opModMemWord8C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem8D: function opModMemWord8D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem8E: function opModMemWord8E(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem8F: function opModMemWord8F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regECX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiCL; this.backTrack.btiEAHi = this.backTrack.btiCH;
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
    opModMem90: function opModMemWord90(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem91: function opModMemWord91(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem92: function opModMemWord92(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem93: function opModMemWord93(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem94: function opModMemWord94(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem95: function opModMemWord95(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem96: function opModMemWord96(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem97: function opModMemWord97(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEDX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDL; this.backTrack.btiEAHi = this.backTrack.btiDH;
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
    opModMem98: function opModMemWord98(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem99: function opModMemWord99(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem9A: function opModMemWord9A(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem9B: function opModMemWord9B(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem9C: function opModMemWord9C(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem9D: function opModMemWord9D(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem9E: function opModMemWord9E(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMem9F: function opModMemWord9F(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEBX & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBL; this.backTrack.btiEAHi = this.backTrack.btiBH;
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
    opModMemA0: function opModMemWordA0(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA1: function opModMemWordA1(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA2: function opModMemWordA2(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA3: function opModMemWordA3(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA4: function opModMemWordA4(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA5: function opModMemWordA5(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA6: function opModMemWordA6(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA7: function opModMemWordA7(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regESP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = X86.BACKTRACK.SP_LO; this.backTrack.btiEAHi = X86.BACKTRACK.SP_HI;
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
    opModMemA8: function opModMemWordA8(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemA9: function opModMemWordA9(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemAA: function opModMemWordAA(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemAB: function opModMemWordAB(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemAC: function opModMemWordAC(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemAD: function opModMemWordAD(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemAE: function opModMemWordAE(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemAF: function opModMemWordAF(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEBP & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiBPLo; this.backTrack.btiEAHi = this.backTrack.btiBPHi;
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
    opModMemB0: function opModMemWordB0(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB1: function opModMemWordB1(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB2: function opModMemWordB2(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB3: function opModMemWordB3(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB4: function opModMemWordB4(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB5: function opModMemWordB5(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB6: function opModMemWordB6(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB7: function opModMemWordB7(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regESI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiSILo; this.backTrack.btiEAHi = this.backTrack.btiSIHi;
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
    opModMemB8: function opModMemWordB8(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMemB9: function opModMemWordB9(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMemBA: function opModMemWordBA(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMemBB: function opModMemWordBB(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMemBC: function opModMemWordBC(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMemBD: function opModMemWordBD(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMemBE: function opModMemWordBE(fn) {
        var w = fn.call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
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
    opModMemBF: function opModMemWordBF(fn) {
        var w = fn.call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), this.regEDI & this.opMask);
        if (BACKTRACK) {
            this.backTrack.btiEALo = this.backTrack.btiDILo; this.backTrack.btiEAHi = this.backTrack.btiDIHi;
        }
        this.setEAWord(w);
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord00(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg00: function opModRegWord00(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord01(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg01: function opModRegWord01(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord02(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg02: function opModRegWord02(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord03(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg03: function opModRegWord03(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord04(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg04: function opModRegWord04(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord05(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg05: function opModRegWord05(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord06(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg06: function opModRegWord06(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord07(fn): mod=00 (mem:src)  reg=000 (AX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg07: function opModRegWord07(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord08(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg08: function opModRegWord08(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord09(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg09: function opModRegWord09(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord0A(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0A: function opModRegWord0A(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord0B(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0B: function opModRegWord0B(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord0C(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0C: function opModRegWord0C(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord0D(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0D: function opModRegWord0D(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord0E(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0E: function opModRegWord0E(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord0F(fn): mod=00 (mem:src)  reg=001 (CX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg0F: function opModRegWord0F(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord10(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg10: function opModRegWord10(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord11(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg11: function opModRegWord11(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord12(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg12: function opModRegWord12(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord13(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg13: function opModRegWord13(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord14(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg14: function opModRegWord14(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord15(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg15: function opModRegWord15(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord16(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg16: function opModRegWord16(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord17(fn): mod=00 (mem:src)  reg=010 (DX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg17: function opModRegWord17(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord18(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg18: function opModRegWord18(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord19(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg19: function opModRegWord19(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord1A(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1A: function opModRegWord1A(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord1B(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1B: function opModRegWord1B(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord1C(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1C: function opModRegWord1C(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord1D(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1D: function opModRegWord1D(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord1E(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1E: function opModRegWord1E(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord1F(fn): mod=00 (mem:src)  reg=011 (BX:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg1F: function opModRegWord1F(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord20(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg20: function opModRegWord20(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord21(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg21: function opModRegWord21(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord22(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg22: function opModRegWord22(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord23(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg23: function opModRegWord23(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord24(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg24: function opModRegWord24(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord25(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg25: function opModRegWord25(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord26(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg26: function opModRegWord26(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord27(fn): mod=00 (mem:src)  reg=100 (SP:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg27: function opModRegWord27(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord28(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg28: function opModRegWord28(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord29(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg29: function opModRegWord29(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord2A(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2A: function opModRegWord2A(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord2B(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2B: function opModRegWord2B(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord2C(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2C: function opModRegWord2C(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord2D(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2D: function opModRegWord2D(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord2E(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2E: function opModRegWord2E(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord2F(fn): mod=00 (mem:src)  reg=101 (BP:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg2F: function opModRegWord2F(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord30(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg30: function opModRegWord30(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord31(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg31: function opModRegWord31(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord32(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg32: function opModRegWord32(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord33(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg33: function opModRegWord33(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord34(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg34: function opModRegWord34(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord35(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg35: function opModRegWord35(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord36(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg36: function opModRegWord36(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord37(fn): mod=00 (mem:src)  reg=110 (SI:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg37: function opModRegWord37(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord38(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg38: function opModRegWord38(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord39(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=001 (BX+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg39: function opModRegWord39(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord3A(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=010 (BP+SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3A: function opModRegWord3A(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexExtra;
    },
    /**
     * opModRegWord3B(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=011 (BP+DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3B: function opModRegWord3B(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndex;
    },
    /**
     * opModRegWord3C(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=100 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3C: function opModRegWord3C(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, (this.regESI & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord3D(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=101 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3D: function opModRegWord3D(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, (this.regEDI & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord3E(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=110 (d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3E: function opModRegWord3E(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, this.getIPWord()));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesDisp;
    },
    /**
     * opModRegWord3F(fn): mod=00 (mem:src)  reg=111 (DI:dst)  r/m=111 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg3F: function opModRegWord3F(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, (this.regEBX & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBase;
    },
    /**
     * opModRegWord40(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg40: function opModRegWord40(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord41(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg41: function opModRegWord41(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord42(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg42: function opModRegWord42(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord43(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg43: function opModRegWord43(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord44(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg44: function opModRegWord44(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord45(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg45: function opModRegWord45(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord46(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg46: function opModRegWord46(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord47(fn): mod=01 (mem+d8:src)  reg=000 (AX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg47: function opModRegWord47(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord48(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg48: function opModRegWord48(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord49(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg49: function opModRegWord49(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord4A(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4A: function opModRegWord4A(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord4B(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4B: function opModRegWord4B(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord4C(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4C: function opModRegWord4C(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4D(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4D: function opModRegWord4D(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4E(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4E: function opModRegWord4E(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord4F(fn): mod=01 (mem+d8:src)  reg=001 (CX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg4F: function opModRegWord4F(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord50(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg50: function opModRegWord50(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord51(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg51: function opModRegWord51(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord52(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg52: function opModRegWord52(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord53(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg53: function opModRegWord53(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord54(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg54: function opModRegWord54(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord55(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg55: function opModRegWord55(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord56(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg56: function opModRegWord56(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord57(fn): mod=01 (mem+d8:src)  reg=010 (DX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg57: function opModRegWord57(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord58(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg58: function opModRegWord58(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord59(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg59: function opModRegWord59(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord5A(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5A: function opModRegWord5A(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord5B(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5B: function opModRegWord5B(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord5C(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5C: function opModRegWord5C(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5D(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5D: function opModRegWord5D(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5E(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5E: function opModRegWord5E(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord5F(fn): mod=01 (mem+d8:src)  reg=011 (BX:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg5F: function opModRegWord5F(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord60(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg60: function opModRegWord60(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord61(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg61: function opModRegWord61(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord62(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg62: function opModRegWord62(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord63(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg63: function opModRegWord63(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord64(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg64: function opModRegWord64(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord65(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg65: function opModRegWord65(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord66(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg66: function opModRegWord66(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord67(fn): mod=01 (mem+d8:src)  reg=100 (SP:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg67: function opModRegWord67(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord68(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg68: function opModRegWord68(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord69(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg69: function opModRegWord69(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord6A(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6A: function opModRegWord6A(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord6B(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6B: function opModRegWord6B(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord6C(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6C: function opModRegWord6C(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6D(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6D: function opModRegWord6D(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6E(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6E: function opModRegWord6E(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord6F(fn): mod=01 (mem+d8:src)  reg=101 (BP:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg6F: function opModRegWord6F(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord70(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg70: function opModRegWord70(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord71(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg71: function opModRegWord71(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord72(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg72: function opModRegWord72(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord73(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg73: function opModRegWord73(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord74(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg74: function opModRegWord74(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord75(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg75: function opModRegWord75(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord76(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg76: function opModRegWord76(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord77(fn): mod=01 (mem+d8:src)  reg=110 (SI:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg77: function opModRegWord77(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord78(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=000 (BX+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg78: function opModRegWord78(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord79(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=001 (BX+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg79: function opModRegWord79(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord7A(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=010 (BP+SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7A: function opModRegWord7A(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord7B(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=011 (BP+DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7B: function opModRegWord7B(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord7C(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=100 (SI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7C: function opModRegWord7C(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7D(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=101 (DI+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7D: function opModRegWord7D(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7E(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=110 (BP+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7E: function opModRegWord7E(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord7F(fn): mod=01 (mem+d8:src)  reg=111 (DI:dst)  r/m=111 (BX+d8)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg7F: function opModRegWord7F(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord80(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg80: function opModRegWord80(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord81(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg81: function opModRegWord81(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord82(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg82: function opModRegWord82(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord83(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg83: function opModRegWord83(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord84(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg84: function opModRegWord84(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord85(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg85: function opModRegWord85(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord86(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg86: function opModRegWord86(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord87(fn): mod=10 (mem+d16:src)  reg=000 (AX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg87: function opModRegWord87(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord88(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg88: function opModRegWord88(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord89(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg89: function opModRegWord89(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord8A(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8A: function opModRegWord8A(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord8B(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8B: function opModRegWord8B(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord8C(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8C: function opModRegWord8C(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8D(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8D: function opModRegWord8D(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8E(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8E: function opModRegWord8E(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord8F(fn): mod=10 (mem+d16:src)  reg=001 (CX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg8F: function opModRegWord8F(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord90(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg90: function opModRegWord90(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord91(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg91: function opModRegWord91(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord92(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg92: function opModRegWord92(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord93(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg93: function opModRegWord93(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord94(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg94: function opModRegWord94(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord95(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg95: function opModRegWord95(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord96(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg96: function opModRegWord96(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord97(fn): mod=10 (mem+d16:src)  reg=010 (DX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg97: function opModRegWord97(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord98(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg98: function opModRegWord98(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord99(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg99: function opModRegWord99(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord9A(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9A: function opModRegWord9A(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWord9B(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9B: function opModRegWord9B(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWord9C(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9C: function opModRegWord9C(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9D(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9D: function opModRegWord9D(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9E(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9E: function opModRegWord9E(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWord9F(fn): mod=10 (mem+d16:src)  reg=011 (BX:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModReg9F: function opModRegWord9F(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA0(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA0: function opModRegWordA0(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA1(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA1: function opModRegWordA1(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordA2(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA2: function opModRegWordA2(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordA3(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA3: function opModRegWordA3(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA4(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA4: function opModRegWordA4(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA5(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA5: function opModRegWordA5(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA6(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA6: function opModRegWordA6(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA7(fn): mod=10 (mem+d16:src)  reg=100 (SP:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA7: function opModRegWordA7(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordA8(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA8: function opModRegWordA8(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordA9(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegA9: function opModRegWordA9(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordAA(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAA: function opModRegWordAA(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordAB(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAB: function opModRegWordAB(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordAC(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAC: function opModRegWordAC(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAD(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAD: function opModRegWordAD(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAE(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAE: function opModRegWordAE(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordAF(fn): mod=10 (mem+d16:src)  reg=101 (BP:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegAF: function opModRegWordAF(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB0(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB0: function opModRegWordB0(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB1(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB1: function opModRegWordB1(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordB2(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB2: function opModRegWordB2(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordB3(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB3: function opModRegWordB3(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB4(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB4: function opModRegWordB4(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB5(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB5: function opModRegWordB5(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB6(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB6: function opModRegWordB6(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB7(fn): mod=10 (mem+d16:src)  reg=110 (SI:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB7: function opModRegWordB7(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordB8(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=000 (BX+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB8: function opModRegWordB8(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordB9(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=001 (BX+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegB9: function opModRegWordB9(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordBA(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=010 (BP+SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBA: function opModRegWordBA(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDispExtra;
    },
    /**
     * opModRegWordBB(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=011 (BP+DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBB: function opModRegWordBB(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseIndexDisp;
    },
    /**
     * opModRegWordBC(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=100 (SI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBC: function opModRegWordBC(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBD(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=101 (DI+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBD: function opModRegWordBD(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBE(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=110 (BP+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBE: function opModRegWordBE(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordBF(fn): mod=10 (mem+d16:src)  reg=111 (DI:dst)  r/m=111 (BX+d16)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegBF: function opModRegWordBF(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.getEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
        this.nStepCycles -= this.CYCLES.nEACyclesBaseDisp;
    },
    /**
     * opModRegWordC0(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC0: function opModRegWordC0(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEAX & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
    },
    /**
     * opModRegWordC1(fn): mod=11 (reg:src)  reg=000 (AX:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegC1: function opModRegWordC1(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regECX & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
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
    opModRegC2: function opModRegWordC2(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEDX & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
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
    opModRegC3: function opModRegWordC3(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEBX & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
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
    opModRegC4: function opModRegWordC4(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regESP & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
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
    opModRegC5: function opModRegWordC5(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEBP & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
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
    opModRegC6: function opModRegWordC6(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regESI & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
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
    opModRegC7: function opModRegWordC7(fn) {
        var w = fn.call(this, this.regEAX & this.opMask, this.regEDI & this.opMask);
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
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
    opModRegC8: function opModRegWordC8(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEAX & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
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
    opModRegC9: function opModRegWordC9(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regECX & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
    },
    /**
     * opModRegWordCA(fn): mod=11 (reg:src)  reg=001 (CX:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegCA: function opModRegWordCA(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEDX & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
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
    opModRegCB: function opModRegWordCB(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEBX & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
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
    opModRegCC: function opModRegWordCC(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regESP & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
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
    opModRegCD: function opModRegWordCD(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEBP & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
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
    opModRegCE: function opModRegWordCE(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regESI & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
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
    opModRegCF: function opModRegWordCF(fn) {
        var w = fn.call(this, this.regECX & this.opMask, this.regEDI & this.opMask);
        this.regECX = (this.regECX & this.opMaskClear) | w;
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
    opModRegD0: function opModRegWordD0(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEAX & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
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
    opModRegD1: function opModRegWordD1(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regECX & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
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
    opModRegD2: function opModRegWordD2(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEDX & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
    },
    /**
     * opModRegWordD3(fn): mod=11 (reg:src)  reg=010 (DX:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegD3: function opModRegWordD3(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEBX & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
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
    opModRegD4: function opModRegWordD4(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regESP & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
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
    opModRegD5: function opModRegWordD5(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEBP & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
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
    opModRegD6: function opModRegWordD6(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regESI & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
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
    opModRegD7: function opModRegWordD7(fn) {
        var w = fn.call(this, this.regEDX & this.opMask, this.regEDI & this.opMask);
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
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
    opModRegD8: function opModRegWordD8(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEAX & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
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
    opModRegD9: function opModRegWordD9(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regECX & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
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
    opModRegDA: function opModRegWordDA(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEDX & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
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
    opModRegDB: function opModRegWordDB(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEBX & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
    },
    /**
     * opModRegWordDC(fn): mod=11 (reg:src)  reg=011 (BX:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegDC: function opModRegWordDC(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regESP & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
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
    opModRegDD: function opModRegWordDD(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEBP & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
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
    opModRegDE: function opModRegWordDE(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regESI & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
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
    opModRegDF: function opModRegWordDF(fn) {
        var w = fn.call(this, this.regEBX & this.opMask, this.regEDI & this.opMask);
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
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
    opModRegE0: function opModRegWordE0(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEAX & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE1(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE1: function opModRegWordE1(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regECX & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE2(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE2: function opModRegWordE2(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEDX & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE3(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE3: function opModRegWordE3(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEBX & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE4(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE4: function opModRegWordE4(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regESP & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE5(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE5: function opModRegWordE5(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEBP & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE6(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE6: function opModRegWordE6(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regESI & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE7(fn): mod=11 (reg:src)  reg=100 (SP:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE7: function opModRegWordE7(fn) {
        var w = fn.call(this, this.regESP & this.opMask, this.regEDI & this.opMask);
        this.regESP = (this.regESP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordE8(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegE8: function opModRegWordE8(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEAX & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
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
    opModRegE9: function opModRegWordE9(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regECX & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
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
    opModRegEA: function opModRegWordEA(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEDX & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
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
    opModRegEB: function opModRegWordEB(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEBX & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
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
    opModRegEC: function opModRegWordEC(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regESP & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
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
    opModRegED: function opModRegWordED(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEBP & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
    },
    /**
     * opModRegWordEE(fn): mod=11 (reg:src)  reg=101 (BP:dst)  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegEE: function opModRegWordEE(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regESI & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
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
    opModRegEF: function opModRegWordEF(fn) {
        var w = fn.call(this, this.regEBP & this.opMask, this.regEDI & this.opMask);
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
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
    opModRegF0: function opModRegWordF0(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEAX & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
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
    opModRegF1: function opModRegWordF1(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regECX & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
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
    opModRegF2: function opModRegWordF2(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEDX & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
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
    opModRegF3: function opModRegWordF3(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEBX & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
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
    opModRegF4: function opModRegWordF4(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regESP & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
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
    opModRegF5: function opModRegWordF5(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEBP & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
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
    opModRegF6: function opModRegWordF6(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regESI & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
    },
    /**
     * opModRegWordF7(fn): mod=11 (reg:src)  reg=110 (SI:dst)  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {function(number,number)} fn (dst,src)
     */
    opModRegF7: function opModRegWordF7(fn) {
        var w = fn.call(this, this.regESI & this.opMask, this.regEDI & this.opMask);
        this.regESI = (this.regESI & this.opMaskClear) | w;
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
    opModRegF8: function opModRegWordF8(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEAX & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
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
    opModRegF9: function opModRegWordF9(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regECX & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
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
    opModRegFA: function opModRegWordFA(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEDX & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
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
    opModRegFB: function opModRegWordFB(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEBX & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
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
    opModRegFC: function opModRegWordFC(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regESP & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
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
    opModRegFD: function opModRegWordFD(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEBP & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
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
    opModRegFE: function opModRegWordFE(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regESI & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
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
    opModRegFF: function opModRegWordFF(fn) {
        var w = fn.call(this, this.regEDI & this.opMask, this.regEDI & this.opMask);
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
    },
    /**
     * opModGrpWord00(afnGrp, fnSrc): mod=00 (mem:dst)  reg=000 (afnGrp[0])  r/m=000 (BX+SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrp00: function opModGrpWord00(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp01: function opModGrpWord01(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp02: function opModGrpWord02(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp03: function opModGrpWord03(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp04: function opModGrpWord04(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp05: function opModGrpWord05(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp06: function opModGrpWord06(afnGrp, fnSrc) {
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
    opModGrp07: function opModGrpWord07(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp08: function opModGrpWord08(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp09: function opModGrpWord09(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp0A: function opModGrpWord0A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp0B: function opModGrpWord0B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp0C: function opModGrpWord0C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp0D: function opModGrpWord0D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp0E: function opModGrpWord0E(afnGrp, fnSrc) {
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
    opModGrp0F: function opModGrpWord0F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp10: function opModGrpWord10(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp11: function opModGrpWord11(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp12: function opModGrpWord12(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp13: function opModGrpWord13(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp14: function opModGrpWord14(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp15: function opModGrpWord15(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp16: function opModGrpWord16(afnGrp, fnSrc) {
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
    opModGrp17: function opModGrpWord17(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp18: function opModGrpWord18(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp19: function opModGrpWord19(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp1A: function opModGrpWord1A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp1B: function opModGrpWord1B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp1C: function opModGrpWord1C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp1D: function opModGrpWord1D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp1E: function opModGrpWord1E(afnGrp, fnSrc) {
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
    opModGrp1F: function opModGrpWord1F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp20: function opModGrpWord20(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp21: function opModGrpWord21(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp22: function opModGrpWord22(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp23: function opModGrpWord23(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp24: function opModGrpWord24(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp25: function opModGrpWord25(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp26: function opModGrpWord26(afnGrp, fnSrc) {
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
    opModGrp27: function opModGrpWord27(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp28: function opModGrpWord28(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp29: function opModGrpWord29(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp2A: function opModGrpWord2A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp2B: function opModGrpWord2B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp2C: function opModGrpWord2C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp2D: function opModGrpWord2D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp2E: function opModGrpWord2E(afnGrp, fnSrc) {
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
    opModGrp2F: function opModGrpWord2F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp30: function opModGrpWord30(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp31: function opModGrpWord31(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp32: function opModGrpWord32(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp33: function opModGrpWord33(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp34: function opModGrpWord34(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp35: function opModGrpWord35(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp36: function opModGrpWord36(afnGrp, fnSrc) {
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
    opModGrp37: function opModGrpWord37(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp38: function opModGrpWord38(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp39: function opModGrpWord39(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp3A: function opModGrpWord3A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI) & 0xffff)), fnSrc.call(this));
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
    opModGrp3B: function opModGrpWord3B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI) & 0xffff)), fnSrc.call(this));
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
    opModGrp3C: function opModGrpWord3C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, (this.regESI & 0xffff)), fnSrc.call(this));
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
    opModGrp3D: function opModGrpWord3D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, (this.regEDI & 0xffff)), fnSrc.call(this));
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
    opModGrp3E: function opModGrpWord3E(afnGrp, fnSrc) {
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
    opModGrp3F: function opModGrpWord3F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, (this.regEBX & 0xffff)), fnSrc.call(this));
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
    opModGrp40: function opModGrpWord40(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp41: function opModGrpWord41(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp42: function opModGrpWord42(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp43: function opModGrpWord43(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp44: function opModGrpWord44(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp45: function opModGrpWord45(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp46: function opModGrpWord46(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp47: function opModGrpWord47(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp48: function opModGrpWord48(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp49: function opModGrpWord49(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4A: function opModGrpWord4A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4B: function opModGrpWord4B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4C: function opModGrpWord4C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4D: function opModGrpWord4D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4E: function opModGrpWord4E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp4F: function opModGrpWord4F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp50: function opModGrpWord50(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp51: function opModGrpWord51(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp52: function opModGrpWord52(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp53: function opModGrpWord53(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp54: function opModGrpWord54(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp55: function opModGrpWord55(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp56: function opModGrpWord56(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp57: function opModGrpWord57(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp58: function opModGrpWord58(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp59: function opModGrpWord59(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5A: function opModGrpWord5A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5B: function opModGrpWord5B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5C: function opModGrpWord5C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5D: function opModGrpWord5D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5E: function opModGrpWord5E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp5F: function opModGrpWord5F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp60: function opModGrpWord60(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp61: function opModGrpWord61(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp62: function opModGrpWord62(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp63: function opModGrpWord63(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp64: function opModGrpWord64(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp65: function opModGrpWord65(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp66: function opModGrpWord66(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp67: function opModGrpWord67(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp68: function opModGrpWord68(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp69: function opModGrpWord69(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6A: function opModGrpWord6A(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6B: function opModGrpWord6B(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6C: function opModGrpWord6C(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6D: function opModGrpWord6D(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6E: function opModGrpWord6E(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp6F: function opModGrpWord6F(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp70: function opModGrpWord70(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp71: function opModGrpWord71(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp72: function opModGrpWord72(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp73: function opModGrpWord73(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp74: function opModGrpWord74(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp75: function opModGrpWord75(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp76: function opModGrpWord76(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp77: function opModGrpWord77(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp78: function opModGrpWord78(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp79: function opModGrpWord79(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7A: function opModGrpWord7A(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7B: function opModGrpWord7B(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7C: function opModGrpWord7C(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7D: function opModGrpWord7D(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7E: function opModGrpWord7E(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp7F: function opModGrpWord7F(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPDisp()) & 0xffff)), fnSrc.call(this));
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
    opModGrp80: function opModGrpWord80(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp81: function opModGrpWord81(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp82: function opModGrpWord82(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp83: function opModGrpWord83(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp84: function opModGrpWord84(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp85: function opModGrpWord85(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp86: function opModGrpWord86(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp87: function opModGrpWord87(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp88: function opModGrpWord88(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp89: function opModGrpWord89(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8A: function opModGrpWord8A(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8B: function opModGrpWord8B(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8C: function opModGrpWord8C(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8D: function opModGrpWord8D(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8E: function opModGrpWord8E(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp8F: function opModGrpWord8F(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp90: function opModGrpWord90(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp91: function opModGrpWord91(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp92: function opModGrpWord92(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp93: function opModGrpWord93(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp94: function opModGrpWord94(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp95: function opModGrpWord95(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp96: function opModGrpWord96(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp97: function opModGrpWord97(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp98: function opModGrpWord98(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp99: function opModGrpWord99(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9A: function opModGrpWord9A(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9B: function opModGrpWord9B(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9C: function opModGrpWord9C(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9D: function opModGrpWord9D(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9E: function opModGrpWord9E(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrp9F: function opModGrpWord9F(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA0: function opModGrpWordA0(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA1: function opModGrpWordA1(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA2: function opModGrpWordA2(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA3: function opModGrpWordA3(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA4: function opModGrpWordA4(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA5: function opModGrpWordA5(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA6: function opModGrpWordA6(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA7: function opModGrpWordA7(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA8: function opModGrpWordA8(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpA9: function opModGrpWordA9(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAA: function opModGrpWordAA(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAB: function opModGrpWordAB(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAC: function opModGrpWordAC(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAD: function opModGrpWordAD(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAE: function opModGrpWordAE(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpAF: function opModGrpWordAF(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB0: function opModGrpWordB0(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB1: function opModGrpWordB1(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB2: function opModGrpWordB2(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB3: function opModGrpWordB3(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB4: function opModGrpWordB4(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB5: function opModGrpWordB5(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB6: function opModGrpWordB6(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB7: function opModGrpWordB7(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB8: function opModGrpWordB8(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpB9: function opModGrpWordB9(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBA: function opModGrpWordBA(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBB: function opModGrpWordBB(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBC: function opModGrpWordBC(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regESI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBD: function opModGrpWordBD(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEDI + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBE: function opModGrpWordBE(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segStack, ((this.regEBP + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpBF: function opModGrpWordBF(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.modEAWord(this.segData, ((this.regEBX + this.getIPWord()) & 0xffff)), fnSrc.call(this));
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
    opModGrpC0: function opModGrpWordC0(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC1: function opModGrpWordC1(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC2: function opModGrpWordC2(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC3: function opModGrpWordC3(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC4: function opModGrpWordC4(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC5: function opModGrpWordC5(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC6: function opModGrpWordC6(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=000 (afnGrp[0])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC7: function opModGrpWordC7(afnGrp, fnSrc) {
        var w = afnGrp[0].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC8: function opModGrpWordC8(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordC9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpC9: function opModGrpWordC9(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCA: function opModGrpWordCA(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCB: function opModGrpWordCB(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCC: function opModGrpWordCC(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCD: function opModGrpWordCD(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCE: function opModGrpWordCE(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordCF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=001 (afnGrp[1])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpCF: function opModGrpWordCF(afnGrp, fnSrc) {
        var w = afnGrp[1].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD0: function opModGrpWordD0(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD1: function opModGrpWordD1(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD2: function opModGrpWordD2(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD3: function opModGrpWordD3(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD4: function opModGrpWordD4(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD5: function opModGrpWordD5(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD6: function opModGrpWordD6(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=010 (afnGrp[2])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD7: function opModGrpWordD7(afnGrp, fnSrc) {
        var w = afnGrp[2].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD8: function opModGrpWordD8(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordD9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpD9: function opModGrpWordD9(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDA: function opModGrpWordDA(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDB: function opModGrpWordDB(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDC: function opModGrpWordDC(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDD: function opModGrpWordDD(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDE: function opModGrpWordDE(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordDF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=011 (afnGrp[3])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpDF: function opModGrpWordDF(afnGrp, fnSrc) {
        var w = afnGrp[3].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE0: function opModGrpWordE0(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE1: function opModGrpWordE1(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE2: function opModGrpWordE2(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE3: function opModGrpWordE3(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE4: function opModGrpWordE4(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE5: function opModGrpWordE5(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE6: function opModGrpWordE6(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=100 (afnGrp[4])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE7: function opModGrpWordE7(afnGrp, fnSrc) {
        var w = afnGrp[4].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE8: function opModGrpWordE8(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordE9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpE9: function opModGrpWordE9(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEA: function opModGrpWordEA(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEB: function opModGrpWordEB(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEC: function opModGrpWordEC(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordED(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpED: function opModGrpWordED(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEE: function opModGrpWordEE(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordEF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=101 (afnGrp[5])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpEF: function opModGrpWordEF(afnGrp, fnSrc) {
        var w = afnGrp[5].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF0(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF0: function opModGrpWordF0(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF1(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF1: function opModGrpWordF1(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF2(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF2: function opModGrpWordF2(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF3(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF3: function opModGrpWordF3(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF4(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF4: function opModGrpWordF4(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF5(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF5: function opModGrpWordF5(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF6(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF6: function opModGrpWordF6(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF7(afnGrp, fnSrc): mod=11 (reg:dst)  reg=110 (afnGrp[6])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF7: function opModGrpWordF7(afnGrp, fnSrc) {
        var w = afnGrp[6].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF8(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=000 (AX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF8: function opModGrpWordF8(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEAX & this.opMask, fnSrc.call(this));
        this.regEAX = (this.regEAX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiAL = this.backTrack.btiEALo; this.backTrack.btiAH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordF9(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=001 (CX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpF9: function opModGrpWordF9(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regECX & this.opMask, fnSrc.call(this));
        this.regECX = (this.regECX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiCL = this.backTrack.btiEALo; this.backTrack.btiCH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFA(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=010 (DX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFA: function opModGrpWordFA(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEDX & this.opMask, fnSrc.call(this));
        this.regEDX = (this.regEDX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDL = this.backTrack.btiEALo; this.backTrack.btiDH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFB(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=011 (BX)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFB: function opModGrpWordFB(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEBX & this.opMask, fnSrc.call(this));
        this.regEBX = (this.regEBX & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBL = this.backTrack.btiEALo; this.backTrack.btiBH = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFC(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=100 (SP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFC: function opModGrpWordFC(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regESP & this.opMask, fnSrc.call(this));
        this.regESP = (this.regESP & this.opMaskClear) | w;
        if (BACKTRACK) {
            X86.BACKTRACK.SP_LO = this.backTrack.btiEALo; X86.BACKTRACK.SP_HI = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFD(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=101 (BP)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFD: function opModGrpWordFD(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEBP & this.opMask, fnSrc.call(this));
        this.regEBP = (this.regEBP & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiBPLo = this.backTrack.btiEALo; this.backTrack.btiBPHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFE(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=110 (SI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFE: function opModGrpWordFE(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regESI & this.opMask, fnSrc.call(this));
        this.regESI = (this.regESI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiSILo = this.backTrack.btiEALo; this.backTrack.btiSIHi = this.backTrack.btiEAHi;
        }
    },
    /**
     * opModGrpWordFF(afnGrp, fnSrc): mod=11 (reg:dst)  reg=111 (afnGrp[7])  r/m=111 (DI)
     *
     * @this {X86CPU}
     * @param {Array.<function(number,number)>} afnGrp
     * @param {function()} fnSrc
     */
    opModGrpFF: function opModGrpWordFF(afnGrp, fnSrc) {
        var w = afnGrp[7].call(this, this.regEDI & this.opMask, fnSrc.call(this));
        this.regEDI = (this.regEDI & this.opMaskClear) | w;
        if (BACKTRACK) {
            this.backTrack.btiDILo = this.backTrack.btiEALo; this.backTrack.btiDIHi = this.backTrack.btiEAHi;
        }
    }
};

X86ModW.aOpModMem = [
    X86ModW.opModMem00,     X86ModW.opModMem01,     X86ModW.opModMem02,     X86ModW.opModMem03,
    X86ModW.opModMem04,     X86ModW.opModMem05,     X86ModW.opModMem06,     X86ModW.opModMem07,
    X86ModW.opModMem08,     X86ModW.opModMem09,     X86ModW.opModMem0A,     X86ModW.opModMem0B,
    X86ModW.opModMem0C,     X86ModW.opModMem0D,     X86ModW.opModMem0E,     X86ModW.opModMem0F,
    X86ModW.opModMem10,     X86ModW.opModMem11,     X86ModW.opModMem12,     X86ModW.opModMem13,
    X86ModW.opModMem14,     X86ModW.opModMem15,     X86ModW.opModMem16,     X86ModW.opModMem17,
    X86ModW.opModMem18,     X86ModW.opModMem19,     X86ModW.opModMem1A,     X86ModW.opModMem1B,
    X86ModW.opModMem1C,     X86ModW.opModMem1D,     X86ModW.opModMem1E,     X86ModW.opModMem1F,
    X86ModW.opModMem20,     X86ModW.opModMem21,     X86ModW.opModMem22,     X86ModW.opModMem23,
    X86ModW.opModMem24,     X86ModW.opModMem25,     X86ModW.opModMem26,     X86ModW.opModMem27,
    X86ModW.opModMem28,     X86ModW.opModMem29,     X86ModW.opModMem2A,     X86ModW.opModMem2B,
    X86ModW.opModMem2C,     X86ModW.opModMem2D,     X86ModW.opModMem2E,     X86ModW.opModMem2F,
    X86ModW.opModMem30,     X86ModW.opModMem31,     X86ModW.opModMem32,     X86ModW.opModMem33,
    X86ModW.opModMem34,     X86ModW.opModMem35,     X86ModW.opModMem36,     X86ModW.opModMem37,
    X86ModW.opModMem38,     X86ModW.opModMem39,     X86ModW.opModMem3A,     X86ModW.opModMem3B,
    X86ModW.opModMem3C,     X86ModW.opModMem3D,     X86ModW.opModMem3E,     X86ModW.opModMem3F,
    X86ModW.opModMem40,     X86ModW.opModMem41,     X86ModW.opModMem42,     X86ModW.opModMem43,
    X86ModW.opModMem44,     X86ModW.opModMem45,     X86ModW.opModMem46,     X86ModW.opModMem47,
    X86ModW.opModMem48,     X86ModW.opModMem49,     X86ModW.opModMem4A,     X86ModW.opModMem4B,
    X86ModW.opModMem4C,     X86ModW.opModMem4D,     X86ModW.opModMem4E,     X86ModW.opModMem4F,
    X86ModW.opModMem50,     X86ModW.opModMem51,     X86ModW.opModMem52,     X86ModW.opModMem53,
    X86ModW.opModMem54,     X86ModW.opModMem55,     X86ModW.opModMem56,     X86ModW.opModMem57,
    X86ModW.opModMem58,     X86ModW.opModMem59,     X86ModW.opModMem5A,     X86ModW.opModMem5B,
    X86ModW.opModMem5C,     X86ModW.opModMem5D,     X86ModW.opModMem5E,     X86ModW.opModMem5F,
    X86ModW.opModMem60,     X86ModW.opModMem61,     X86ModW.opModMem62,     X86ModW.opModMem63,
    X86ModW.opModMem64,     X86ModW.opModMem65,     X86ModW.opModMem66,     X86ModW.opModMem67,
    X86ModW.opModMem68,     X86ModW.opModMem69,     X86ModW.opModMem6A,     X86ModW.opModMem6B,
    X86ModW.opModMem6C,     X86ModW.opModMem6D,     X86ModW.opModMem6E,     X86ModW.opModMem6F,
    X86ModW.opModMem70,     X86ModW.opModMem71,     X86ModW.opModMem72,     X86ModW.opModMem73,
    X86ModW.opModMem74,     X86ModW.opModMem75,     X86ModW.opModMem76,     X86ModW.opModMem77,
    X86ModW.opModMem78,     X86ModW.opModMem79,     X86ModW.opModMem7A,     X86ModW.opModMem7B,
    X86ModW.opModMem7C,     X86ModW.opModMem7D,     X86ModW.opModMem7E,     X86ModW.opModMem7F,
    X86ModW.opModMem80,     X86ModW.opModMem81,     X86ModW.opModMem82,     X86ModW.opModMem83,
    X86ModW.opModMem84,     X86ModW.opModMem85,     X86ModW.opModMem86,     X86ModW.opModMem87,
    X86ModW.opModMem88,     X86ModW.opModMem89,     X86ModW.opModMem8A,     X86ModW.opModMem8B,
    X86ModW.opModMem8C,     X86ModW.opModMem8D,     X86ModW.opModMem8E,     X86ModW.opModMem8F,
    X86ModW.opModMem90,     X86ModW.opModMem91,     X86ModW.opModMem92,     X86ModW.opModMem93,
    X86ModW.opModMem94,     X86ModW.opModMem95,     X86ModW.opModMem96,     X86ModW.opModMem97,
    X86ModW.opModMem98,     X86ModW.opModMem99,     X86ModW.opModMem9A,     X86ModW.opModMem9B,
    X86ModW.opModMem9C,     X86ModW.opModMem9D,     X86ModW.opModMem9E,     X86ModW.opModMem9F,
    X86ModW.opModMemA0,     X86ModW.opModMemA1,     X86ModW.opModMemA2,     X86ModW.opModMemA3,
    X86ModW.opModMemA4,     X86ModW.opModMemA5,     X86ModW.opModMemA6,     X86ModW.opModMemA7,
    X86ModW.opModMemA8,     X86ModW.opModMemA9,     X86ModW.opModMemAA,     X86ModW.opModMemAB,
    X86ModW.opModMemAC,     X86ModW.opModMemAD,     X86ModW.opModMemAE,     X86ModW.opModMemAF,
    X86ModW.opModMemB0,     X86ModW.opModMemB1,     X86ModW.opModMemB2,     X86ModW.opModMemB3,
    X86ModW.opModMemB4,     X86ModW.opModMemB5,     X86ModW.opModMemB6,     X86ModW.opModMemB7,
    X86ModW.opModMemB8,     X86ModW.opModMemB9,     X86ModW.opModMemBA,     X86ModW.opModMemBB,
    X86ModW.opModMemBC,     X86ModW.opModMemBD,     X86ModW.opModMemBE,     X86ModW.opModMemBF,
    X86ModW.opModRegC0,     X86ModW.opModRegC8,     X86ModW.opModRegD0,     X86ModW.opModRegD8,
    X86ModW.opModRegE0,     X86ModW.opModRegE8,     X86ModW.opModRegF0,     X86ModW.opModRegF8,
    X86ModW.opModRegC1,     X86ModW.opModRegC9,     X86ModW.opModRegD1,     X86ModW.opModRegD9,
    X86ModW.opModRegE1,     X86ModW.opModRegE9,     X86ModW.opModRegF1,     X86ModW.opModRegF9,
    X86ModW.opModRegC2,     X86ModW.opModRegCA,     X86ModW.opModRegD2,     X86ModW.opModRegDA,
    X86ModW.opModRegE2,     X86ModW.opModRegEA,     X86ModW.opModRegF2,     X86ModW.opModRegFA,
    X86ModW.opModRegC3,     X86ModW.opModRegCB,     X86ModW.opModRegD3,     X86ModW.opModRegDB,
    X86ModW.opModRegE3,     X86ModW.opModRegEB,     X86ModW.opModRegF3,     X86ModW.opModRegFB,
    X86ModW.opModRegC4,     X86ModW.opModRegCC,     X86ModW.opModRegD4,     X86ModW.opModRegDC,
    X86ModW.opModRegE4,     X86ModW.opModRegEC,     X86ModW.opModRegF4,     X86ModW.opModRegFC,
    X86ModW.opModRegC5,     X86ModW.opModRegCD,     X86ModW.opModRegD5,     X86ModW.opModRegDD,
    X86ModW.opModRegE5,     X86ModW.opModRegED,     X86ModW.opModRegF5,     X86ModW.opModRegFD,
    X86ModW.opModRegC6,     X86ModW.opModRegCE,     X86ModW.opModRegD6,     X86ModW.opModRegDE,
    X86ModW.opModRegE6,     X86ModW.opModRegEE,     X86ModW.opModRegF6,     X86ModW.opModRegFE,
    X86ModW.opModRegC7,     X86ModW.opModRegCF,     X86ModW.opModRegD7,     X86ModW.opModRegDF,
    X86ModW.opModRegE7,     X86ModW.opModRegEF,     X86ModW.opModRegF7,     X86ModW.opModRegFF
];

X86ModW.aOpModReg = [
    X86ModW.opModReg00,     X86ModW.opModReg01,     X86ModW.opModReg02,     X86ModW.opModReg03,
    X86ModW.opModReg04,     X86ModW.opModReg05,     X86ModW.opModReg06,     X86ModW.opModReg07,
    X86ModW.opModReg08,     X86ModW.opModReg09,     X86ModW.opModReg0A,     X86ModW.opModReg0B,
    X86ModW.opModReg0C,     X86ModW.opModReg0D,     X86ModW.opModReg0E,     X86ModW.opModReg0F,
    X86ModW.opModReg10,     X86ModW.opModReg11,     X86ModW.opModReg12,     X86ModW.opModReg13,
    X86ModW.opModReg14,     X86ModW.opModReg15,     X86ModW.opModReg16,     X86ModW.opModReg17,
    X86ModW.opModReg18,     X86ModW.opModReg19,     X86ModW.opModReg1A,     X86ModW.opModReg1B,
    X86ModW.opModReg1C,     X86ModW.opModReg1D,     X86ModW.opModReg1E,     X86ModW.opModReg1F,
    X86ModW.opModReg20,     X86ModW.opModReg21,     X86ModW.opModReg22,     X86ModW.opModReg23,
    X86ModW.opModReg24,     X86ModW.opModReg25,     X86ModW.opModReg26,     X86ModW.opModReg27,
    X86ModW.opModReg28,     X86ModW.opModReg29,     X86ModW.opModReg2A,     X86ModW.opModReg2B,
    X86ModW.opModReg2C,     X86ModW.opModReg2D,     X86ModW.opModReg2E,     X86ModW.opModReg2F,
    X86ModW.opModReg30,     X86ModW.opModReg31,     X86ModW.opModReg32,     X86ModW.opModReg33,
    X86ModW.opModReg34,     X86ModW.opModReg35,     X86ModW.opModReg36,     X86ModW.opModReg37,
    X86ModW.opModReg38,     X86ModW.opModReg39,     X86ModW.opModReg3A,     X86ModW.opModReg3B,
    X86ModW.opModReg3C,     X86ModW.opModReg3D,     X86ModW.opModReg3E,     X86ModW.opModReg3F,
    X86ModW.opModReg40,     X86ModW.opModReg41,     X86ModW.opModReg42,     X86ModW.opModReg43,
    X86ModW.opModReg44,     X86ModW.opModReg45,     X86ModW.opModReg46,     X86ModW.opModReg47,
    X86ModW.opModReg48,     X86ModW.opModReg49,     X86ModW.opModReg4A,     X86ModW.opModReg4B,
    X86ModW.opModReg4C,     X86ModW.opModReg4D,     X86ModW.opModReg4E,     X86ModW.opModReg4F,
    X86ModW.opModReg50,     X86ModW.opModReg51,     X86ModW.opModReg52,     X86ModW.opModReg53,
    X86ModW.opModReg54,     X86ModW.opModReg55,     X86ModW.opModReg56,     X86ModW.opModReg57,
    X86ModW.opModReg58,     X86ModW.opModReg59,     X86ModW.opModReg5A,     X86ModW.opModReg5B,
    X86ModW.opModReg5C,     X86ModW.opModReg5D,     X86ModW.opModReg5E,     X86ModW.opModReg5F,
    X86ModW.opModReg60,     X86ModW.opModReg61,     X86ModW.opModReg62,     X86ModW.opModReg63,
    X86ModW.opModReg64,     X86ModW.opModReg65,     X86ModW.opModReg66,     X86ModW.opModReg67,
    X86ModW.opModReg68,     X86ModW.opModReg69,     X86ModW.opModReg6A,     X86ModW.opModReg6B,
    X86ModW.opModReg6C,     X86ModW.opModReg6D,     X86ModW.opModReg6E,     X86ModW.opModReg6F,
    X86ModW.opModReg70,     X86ModW.opModReg71,     X86ModW.opModReg72,     X86ModW.opModReg73,
    X86ModW.opModReg74,     X86ModW.opModReg75,     X86ModW.opModReg76,     X86ModW.opModReg77,
    X86ModW.opModReg78,     X86ModW.opModReg79,     X86ModW.opModReg7A,     X86ModW.opModReg7B,
    X86ModW.opModReg7C,     X86ModW.opModReg7D,     X86ModW.opModReg7E,     X86ModW.opModReg7F,
    X86ModW.opModReg80,     X86ModW.opModReg81,     X86ModW.opModReg82,     X86ModW.opModReg83,
    X86ModW.opModReg84,     X86ModW.opModReg85,     X86ModW.opModReg86,     X86ModW.opModReg87,
    X86ModW.opModReg88,     X86ModW.opModReg89,     X86ModW.opModReg8A,     X86ModW.opModReg8B,
    X86ModW.opModReg8C,     X86ModW.opModReg8D,     X86ModW.opModReg8E,     X86ModW.opModReg8F,
    X86ModW.opModReg90,     X86ModW.opModReg91,     X86ModW.opModReg92,     X86ModW.opModReg93,
    X86ModW.opModReg94,     X86ModW.opModReg95,     X86ModW.opModReg96,     X86ModW.opModReg97,
    X86ModW.opModReg98,     X86ModW.opModReg99,     X86ModW.opModReg9A,     X86ModW.opModReg9B,
    X86ModW.opModReg9C,     X86ModW.opModReg9D,     X86ModW.opModReg9E,     X86ModW.opModReg9F,
    X86ModW.opModRegA0,     X86ModW.opModRegA1,     X86ModW.opModRegA2,     X86ModW.opModRegA3,
    X86ModW.opModRegA4,     X86ModW.opModRegA5,     X86ModW.opModRegA6,     X86ModW.opModRegA7,
    X86ModW.opModRegA8,     X86ModW.opModRegA9,     X86ModW.opModRegAA,     X86ModW.opModRegAB,
    X86ModW.opModRegAC,     X86ModW.opModRegAD,     X86ModW.opModRegAE,     X86ModW.opModRegAF,
    X86ModW.opModRegB0,     X86ModW.opModRegB1,     X86ModW.opModRegB2,     X86ModW.opModRegB3,
    X86ModW.opModRegB4,     X86ModW.opModRegB5,     X86ModW.opModRegB6,     X86ModW.opModRegB7,
    X86ModW.opModRegB8,     X86ModW.opModRegB9,     X86ModW.opModRegBA,     X86ModW.opModRegBB,
    X86ModW.opModRegBC,     X86ModW.opModRegBD,     X86ModW.opModRegBE,     X86ModW.opModRegBF,
    X86ModW.opModRegC0,     X86ModW.opModRegC1,     X86ModW.opModRegC2,     X86ModW.opModRegC3,
    X86ModW.opModRegC4,     X86ModW.opModRegC5,     X86ModW.opModRegC6,     X86ModW.opModRegC7,
    X86ModW.opModRegC8,     X86ModW.opModRegC9,     X86ModW.opModRegCA,     X86ModW.opModRegCB,
    X86ModW.opModRegCC,     X86ModW.opModRegCD,     X86ModW.opModRegCE,     X86ModW.opModRegCF,
    X86ModW.opModRegD0,     X86ModW.opModRegD1,     X86ModW.opModRegD2,     X86ModW.opModRegD3,
    X86ModW.opModRegD4,     X86ModW.opModRegD5,     X86ModW.opModRegD6,     X86ModW.opModRegD7,
    X86ModW.opModRegD8,     X86ModW.opModRegD9,     X86ModW.opModRegDA,     X86ModW.opModRegDB,
    X86ModW.opModRegDC,     X86ModW.opModRegDD,     X86ModW.opModRegDE,     X86ModW.opModRegDF,
    X86ModW.opModRegE0,     X86ModW.opModRegE1,     X86ModW.opModRegE2,     X86ModW.opModRegE3,
    X86ModW.opModRegE4,     X86ModW.opModRegE5,     X86ModW.opModRegE6,     X86ModW.opModRegE7,
    X86ModW.opModRegE8,     X86ModW.opModRegE9,     X86ModW.opModRegEA,     X86ModW.opModRegEB,
    X86ModW.opModRegEC,     X86ModW.opModRegED,     X86ModW.opModRegEE,     X86ModW.opModRegEF,
    X86ModW.opModRegF0,     X86ModW.opModRegF1,     X86ModW.opModRegF2,     X86ModW.opModRegF3,
    X86ModW.opModRegF4,     X86ModW.opModRegF5,     X86ModW.opModRegF6,     X86ModW.opModRegF7,
    X86ModW.opModRegF8,     X86ModW.opModRegF9,     X86ModW.opModRegFA,     X86ModW.opModRegFB,
    X86ModW.opModRegFC,     X86ModW.opModRegFD,     X86ModW.opModRegFE,     X86ModW.opModRegFF
];

X86ModW.aOpModGrp = [
    X86ModW.opModGrp00,     X86ModW.opModGrp01,     X86ModW.opModGrp02,     X86ModW.opModGrp03,
    X86ModW.opModGrp04,     X86ModW.opModGrp05,     X86ModW.opModGrp06,     X86ModW.opModGrp07,
    X86ModW.opModGrp08,     X86ModW.opModGrp09,     X86ModW.opModGrp0A,     X86ModW.opModGrp0B,
    X86ModW.opModGrp0C,     X86ModW.opModGrp0D,     X86ModW.opModGrp0E,     X86ModW.opModGrp0F,
    X86ModW.opModGrp10,     X86ModW.opModGrp11,     X86ModW.opModGrp12,     X86ModW.opModGrp13,
    X86ModW.opModGrp14,     X86ModW.opModGrp15,     X86ModW.opModGrp16,     X86ModW.opModGrp17,
    X86ModW.opModGrp18,     X86ModW.opModGrp19,     X86ModW.opModGrp1A,     X86ModW.opModGrp1B,
    X86ModW.opModGrp1C,     X86ModW.opModGrp1D,     X86ModW.opModGrp1E,     X86ModW.opModGrp1F,
    X86ModW.opModGrp20,     X86ModW.opModGrp21,     X86ModW.opModGrp22,     X86ModW.opModGrp23,
    X86ModW.opModGrp24,     X86ModW.opModGrp25,     X86ModW.opModGrp26,     X86ModW.opModGrp27,
    X86ModW.opModGrp28,     X86ModW.opModGrp29,     X86ModW.opModGrp2A,     X86ModW.opModGrp2B,
    X86ModW.opModGrp2C,     X86ModW.opModGrp2D,     X86ModW.opModGrp2E,     X86ModW.opModGrp2F,
    X86ModW.opModGrp30,     X86ModW.opModGrp31,     X86ModW.opModGrp32,     X86ModW.opModGrp33,
    X86ModW.opModGrp34,     X86ModW.opModGrp35,     X86ModW.opModGrp36,     X86ModW.opModGrp37,
    X86ModW.opModGrp38,     X86ModW.opModGrp39,     X86ModW.opModGrp3A,     X86ModW.opModGrp3B,
    X86ModW.opModGrp3C,     X86ModW.opModGrp3D,     X86ModW.opModGrp3E,     X86ModW.opModGrp3F,
    X86ModW.opModGrp40,     X86ModW.opModGrp41,     X86ModW.opModGrp42,     X86ModW.opModGrp43,
    X86ModW.opModGrp44,     X86ModW.opModGrp45,     X86ModW.opModGrp46,     X86ModW.opModGrp47,
    X86ModW.opModGrp48,     X86ModW.opModGrp49,     X86ModW.opModGrp4A,     X86ModW.opModGrp4B,
    X86ModW.opModGrp4C,     X86ModW.opModGrp4D,     X86ModW.opModGrp4E,     X86ModW.opModGrp4F,
    X86ModW.opModGrp50,     X86ModW.opModGrp51,     X86ModW.opModGrp52,     X86ModW.opModGrp53,
    X86ModW.opModGrp54,     X86ModW.opModGrp55,     X86ModW.opModGrp56,     X86ModW.opModGrp57,
    X86ModW.opModGrp58,     X86ModW.opModGrp59,     X86ModW.opModGrp5A,     X86ModW.opModGrp5B,
    X86ModW.opModGrp5C,     X86ModW.opModGrp5D,     X86ModW.opModGrp5E,     X86ModW.opModGrp5F,
    X86ModW.opModGrp60,     X86ModW.opModGrp61,     X86ModW.opModGrp62,     X86ModW.opModGrp63,
    X86ModW.opModGrp64,     X86ModW.opModGrp65,     X86ModW.opModGrp66,     X86ModW.opModGrp67,
    X86ModW.opModGrp68,     X86ModW.opModGrp69,     X86ModW.opModGrp6A,     X86ModW.opModGrp6B,
    X86ModW.opModGrp6C,     X86ModW.opModGrp6D,     X86ModW.opModGrp6E,     X86ModW.opModGrp6F,
    X86ModW.opModGrp70,     X86ModW.opModGrp71,     X86ModW.opModGrp72,     X86ModW.opModGrp73,
    X86ModW.opModGrp74,     X86ModW.opModGrp75,     X86ModW.opModGrp76,     X86ModW.opModGrp77,
    X86ModW.opModGrp78,     X86ModW.opModGrp79,     X86ModW.opModGrp7A,     X86ModW.opModGrp7B,
    X86ModW.opModGrp7C,     X86ModW.opModGrp7D,     X86ModW.opModGrp7E,     X86ModW.opModGrp7F,
    X86ModW.opModGrp80,     X86ModW.opModGrp81,     X86ModW.opModGrp82,     X86ModW.opModGrp83,
    X86ModW.opModGrp84,     X86ModW.opModGrp85,     X86ModW.opModGrp86,     X86ModW.opModGrp87,
    X86ModW.opModGrp88,     X86ModW.opModGrp89,     X86ModW.opModGrp8A,     X86ModW.opModGrp8B,
    X86ModW.opModGrp8C,     X86ModW.opModGrp8D,     X86ModW.opModGrp8E,     X86ModW.opModGrp8F,
    X86ModW.opModGrp90,     X86ModW.opModGrp91,     X86ModW.opModGrp92,     X86ModW.opModGrp93,
    X86ModW.opModGrp94,     X86ModW.opModGrp95,     X86ModW.opModGrp96,     X86ModW.opModGrp97,
    X86ModW.opModGrp98,     X86ModW.opModGrp99,     X86ModW.opModGrp9A,     X86ModW.opModGrp9B,
    X86ModW.opModGrp9C,     X86ModW.opModGrp9D,     X86ModW.opModGrp9E,     X86ModW.opModGrp9F,
    X86ModW.opModGrpA0,     X86ModW.opModGrpA1,     X86ModW.opModGrpA2,     X86ModW.opModGrpA3,
    X86ModW.opModGrpA4,     X86ModW.opModGrpA5,     X86ModW.opModGrpA6,     X86ModW.opModGrpA7,
    X86ModW.opModGrpA8,     X86ModW.opModGrpA9,     X86ModW.opModGrpAA,     X86ModW.opModGrpAB,
    X86ModW.opModGrpAC,     X86ModW.opModGrpAD,     X86ModW.opModGrpAE,     X86ModW.opModGrpAF,
    X86ModW.opModGrpB0,     X86ModW.opModGrpB1,     X86ModW.opModGrpB2,     X86ModW.opModGrpB3,
    X86ModW.opModGrpB4,     X86ModW.opModGrpB5,     X86ModW.opModGrpB6,     X86ModW.opModGrpB7,
    X86ModW.opModGrpB8,     X86ModW.opModGrpB9,     X86ModW.opModGrpBA,     X86ModW.opModGrpBB,
    X86ModW.opModGrpBC,     X86ModW.opModGrpBD,     X86ModW.opModGrpBE,     X86ModW.opModGrpBF,
    X86ModW.opModGrpC0,     X86ModW.opModGrpC1,     X86ModW.opModGrpC2,     X86ModW.opModGrpC3,
    X86ModW.opModGrpC4,     X86ModW.opModGrpC5,     X86ModW.opModGrpC6,     X86ModW.opModGrpC7,
    X86ModW.opModGrpC8,     X86ModW.opModGrpC9,     X86ModW.opModGrpCA,     X86ModW.opModGrpCB,
    X86ModW.opModGrpCC,     X86ModW.opModGrpCD,     X86ModW.opModGrpCE,     X86ModW.opModGrpCF,
    X86ModW.opModGrpD0,     X86ModW.opModGrpD1,     X86ModW.opModGrpD2,     X86ModW.opModGrpD3,
    X86ModW.opModGrpD4,     X86ModW.opModGrpD5,     X86ModW.opModGrpD6,     X86ModW.opModGrpD7,
    X86ModW.opModGrpD8,     X86ModW.opModGrpD9,     X86ModW.opModGrpDA,     X86ModW.opModGrpDB,
    X86ModW.opModGrpDC,     X86ModW.opModGrpDD,     X86ModW.opModGrpDE,     X86ModW.opModGrpDF,
    X86ModW.opModGrpE0,     X86ModW.opModGrpE1,     X86ModW.opModGrpE2,     X86ModW.opModGrpE3,
    X86ModW.opModGrpE4,     X86ModW.opModGrpE5,     X86ModW.opModGrpE6,     X86ModW.opModGrpE7,
    X86ModW.opModGrpE8,     X86ModW.opModGrpE9,     X86ModW.opModGrpEA,     X86ModW.opModGrpEB,
    X86ModW.opModGrpEC,     X86ModW.opModGrpED,     X86ModW.opModGrpEE,     X86ModW.opModGrpEF,
    X86ModW.opModGrpF0,     X86ModW.opModGrpF1,     X86ModW.opModGrpF2,     X86ModW.opModGrpF3,
    X86ModW.opModGrpF4,     X86ModW.opModGrpF5,     X86ModW.opModGrpF6,     X86ModW.opModGrpF7,
    X86ModW.opModGrpF8,     X86ModW.opModGrpF9,     X86ModW.opModGrpFA,     X86ModW.opModGrpFB,
    X86ModW.opModGrpFC,     X86ModW.opModGrpFD,     X86ModW.opModGrpFE,     X86ModW.opModGrpFF
];

if (typeof module !== 'undefined') module.exports = X86ModW;
