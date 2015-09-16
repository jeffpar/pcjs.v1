/**
 * @fileoverview Implements PCjs 80386 Scale-Index-Base (SIB) decoders.
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

if (NODE) {
    var X86         = require("./x86");
}

var X86ModSIB = {};

/*
 * TODO: Factor out the SIB (scale=1) decoders that are functionally equivalent to one another,
 * just as I've already done for all the ModRM (register-to-register) decoders.  For example:
 *
 *      opModSIB01():   this.regECX + this.regEAX
 *
 * is functionally equivalent to:
 *
 *      opModSIB08():   this.regEAX + this.regECX
 *
 * This isn't super critical, since the SIB decoders are much smaller/simpler than the ModRM decoders,
 * but still, it's wasteful.
 */

X86ModSIB.aOpModSIB = [
    /**
     * opModSIB00(): scale=00 (1)  index=000 (EAX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB00(mod) {
        return this.regEAX + this.regEAX;
    },
    /**
     * opModSIB01(): scale=00 (1)  index=000 (EAX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB01(mod) {
        return this.regECX + this.regEAX;
    },
    /**
     * opModSIB02(): scale=00 (1)  index=000 (EAX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB02(mod) {
        return this.regEDX + this.regEAX;
    },
    /**
     * opModSIB03(): scale=00 (1)  index=000 (EAX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB03(mod) {
        return this.regEBX + this.regEAX;
    },
    /**
     * opModSIB04(): scale=00 (1)  index=000 (EAX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB04(mod) {
        this.segData = this.segStack;
        return this.getSP() + this.regEAX;
    },
    /**
     * opModSIB05(): scale=00 (1)  index=000 (EAX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB05(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + this.regEAX;
    },
    /**
     * opModSIB06(): scale=00 (1)  index=000 (EAX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB06(mod) {
        return this.regESI + this.regEAX;
    },
    /**
     * opModSIB07(): scale=00 (1)  index=000 (EAX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB07(mod) {
        return this.regEDI + this.regEAX;
    },
    /**
     * opModSIB08(): scale=00 (1)  index=001 (ECX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB08(mod) {
        return this.regEAX + this.regECX;
    },
    /**
     * opModSIB09(): scale=00 (1)  index=001 (ECX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB09(mod) {
        return this.regECX + this.regECX;
    },
    /**
     * opModSIB0A(): scale=00 (1)  index=001 (ECX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB0A(mod) {
        return this.regEDX + this.regECX;
    },
    /**
     * opModSIB0B(): scale=00 (1)  index=001 (ECX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB0B(mod) {
        return this.regEBX + this.regECX;
    },
    /**
     * opModSIB0C(): scale=00 (1)  index=001 (ECX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB0C(mod) {
        this.segData = this.segStack;
        return this.getSP() + this.regECX;
    },
    /**
     * opModSIB0D(): scale=00 (1)  index=001 (ECX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB0D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + this.regECX;
    },
    /**
     * opModSIB0E(): scale=00 (1)  index=001 (ECX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB0E(mod) {
        return this.regESI + this.regECX;
    },
    /**
     * opModSIB0F(): scale=00 (1)  index=001 (ECX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB0F(mod) {
        return this.regEDI + this.regECX;
    },
    /**
     * opModSIB10(): scale=00 (1)  index=010 (EDX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB10(mod) {
        return this.regEAX + this.regEDX;
    },
    /**
     * opModSIB11(): scale=00 (1)  index=010 (EDX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB11(mod) {
        return this.regECX + this.regEDX;
    },
    /**
     * opModSIB12(): scale=00 (1)  index=010 (EDX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB12(mod) {
        return this.regEDX + this.regEDX;
    },
    /**
     * opModSIB13(): scale=00 (1)  index=010 (EDX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB13(mod) {
        return this.regEBX + this.regEDX;
    },
    /**
     * opModSIB14(): scale=00 (1)  index=010 (EDX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB14(mod) {
        this.segData = this.segStack;
        return this.getSP() + this.regEDX;
    },
    /**
     * opModSIB15(): scale=00 (1)  index=010 (EDX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB15(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + this.regEDX;
    },
    /**
     * opModSIB16(): scale=00 (1)  index=010 (EDX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB16(mod) {
        return this.regESI + this.regEDX;
    },
    /**
     * opModSIB17(): scale=00 (1)  index=010 (EDX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB17(mod) {
        return this.regEDI + this.regEDX;
    },
    /**
     * opModSIB18(): scale=00 (1)  index=011 (EBX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB18(mod) {
        return this.regEAX + this.regEBX;
    },
    /**
     * opModSIB19(): scale=00 (1)  index=011 (EBX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB19(mod) {
        return this.regECX + this.regEBX;
    },
    /**
     * opModSIB1A(): scale=00 (1)  index=011 (EBX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB1A(mod) {
        return this.regEDX + this.regEBX;
    },
    /**
     * opModSIB1B(): scale=00 (1)  index=011 (EBX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB1B(mod) {
        return this.regEBX + this.regEBX;
    },
    /**
     * opModSIB1C(): scale=00 (1)  index=011 (EBX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB1C(mod) {
        this.segData = this.segStack;
        return this.getSP() + this.regEBX;
    },
    /**
     * opModSIB1D(): scale=00 (1)  index=011 (EBX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB1D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + this.regEBX;
    },
    /**
     * opModSIB1E(): scale=00 (1)  index=011 (EBX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB1E(mod) {
        return this.regESI + this.regEBX;
    },
    /**
     * opModSIB1F(): scale=00 (1)  index=011 (EBX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB1F(mod) {
        return this.regEDI + this.regEBX;
    },
    /**
     * opModSIB20(): scale=00 (1)  index=100 (none)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB20(mod) {
        return this.regEAX;
    },
    /**
     * opModSIB21(): scale=00 (1)  index=100 (none)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB21(mod) {
        return this.regECX;
    },
    /**
     * opModSIB22(): scale=00 (1)  index=100 (none)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB22(mod) {
        return this.regEDX;
    },
    /**
     * opModSIB23(): scale=00 (1)  index=100 (none)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB23(mod) {
        return this.regEBX;
    },
    /**
     * opModSIB24(): scale=00 (1)  index=100 (none)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB24(mod) {
        this.segData = this.segStack;
        return this.getSP();
    },
    /**
     * opModSIB25(): scale=00 (1)  index=100 (none)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB25(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr());
    },
    /**
     * opModSIB26(): scale=00 (1)  index=100 (none)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB26(mod) {
        return this.regESI;
    },
    /**
     * opModSIB27(): scale=00 (1)  index=100 (none)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB27(mod) {
        return this.regEDI;
    },
    /**
     * opModSIB28(): scale=00 (1)  index=101 (EBP)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB28(mod) {
        return this.regEAX + this.regEBP;
    },
    /**
     * opModSIB29(): scale=00 (1)  index=101 (EBP)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB29(mod) {
        return this.regECX + this.regEBP;
    },
    /**
     * opModSIB2A(): scale=00 (1)  index=101 (EBP)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB2A(mod) {
        return this.regEDX + this.regEBP;
    },
    /**
     * opModSIB2B(): scale=00 (1)  index=101 (EBP)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB2B(mod) {
        return this.regEBX + this.regEBP;
    },
    /**
     * opModSIB2C(): scale=00 (1)  index=101 (EBP)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB2C(mod) {
        this.segData = this.segStack;
        return this.getSP() + this.regEBP;
    },
    /**
     * opModSIB2D(): scale=00 (1)  index=101 (EBP)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB2D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + this.regEBP;
    },
    /**
     * opModSIB2E(): scale=00 (1)  index=101 (EBP)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB2E(mod) {
        return this.regESI + this.regEBP;
    },
    /**
     * opModSIB2F(): scale=00 (1)  index=101 (EBP)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB2F(mod) {
        return this.regEDI + this.regEBP;
    },
    /**
     * opModSIB30(): scale=00 (1)  index=110 (ESI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB30(mod) {
        return this.regEAX + this.regESI;
    },
    /**
     * opModSIB31(): scale=00 (1)  index=110 (ESI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB31(mod) {
        return this.regECX + this.regESI;
    },
    /**
     * opModSIB32(): scale=00 (1)  index=110 (ESI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB32(mod) {
        return this.regEDX + this.regESI;
    },
    /**
     * opModSIB33(): scale=00 (1)  index=110 (ESI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB33(mod) {
        return this.regEBX + this.regESI;
    },
    /**
     * opModSIB34(): scale=00 (1)  index=110 (ESI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB34(mod) {
        this.segData = this.segStack;
        return this.getSP() + this.regESI;
    },
    /**
     * opModSIB35(): scale=00 (1)  index=110 (ESI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB35(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + this.regESI;
    },
    /**
     * opModSIB36(): scale=00 (1)  index=110 (ESI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB36(mod) {
        return this.regESI + this.regESI;
    },
    /**
     * opModSIB37(): scale=00 (1)  index=110 (ESI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB37(mod) {
        return this.regEDI + this.regESI;
    },
    /**
     * opModSIB38(): scale=00 (1)  index=111 (EDI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB38(mod) {
        return this.regEAX + this.regEDI;
    },
    /**
     * opModSIB39(): scale=00 (1)  index=111 (EDI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB39(mod) {
        return this.regECX + this.regEDI;
    },
    /**
     * opModSIB3A(): scale=00 (1)  index=111 (EDI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB3A(mod) {
        return this.regEDX + this.regEDI;
    },
    /**
     * opModSIB3B(): scale=00 (1)  index=111 (EDI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB3B(mod) {
        return this.regEBX + this.regEDI;
    },
    /**
     * opModSIB3C(): scale=00 (1)  index=111 (EDI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB3C(mod) {
        this.segData = this.segStack;
        return this.getSP() + this.regEDI;
    },
    /**
     * opModSIB3D(): scale=00 (1)  index=111 (EDI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB3D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + this.regEDI;
    },
    /**
     * opModSIB3E(): scale=00 (1)  index=111 (EDI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB3E(mod) {
        return this.regESI + this.regEDI;
    },
    /**
     * opModSIB3F(): scale=00 (1)  index=111 (EDI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB3F(mod) {
        return this.regEDI + this.regEDI;
    },
    /**
     * opModSIB40(): scale=01 (2)  index=000 (EAX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB40(mod) {
        return this.regEAX + (this.regEAX << 1);
    },
    /**
     * opModSIB41(): scale=01 (2)  index=000 (EAX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB41(mod) {
        return this.regECX + (this.regEAX << 1);
    },
    /**
     * opModSIB42(): scale=01 (2)  index=000 (EAX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB42(mod) {
        return this.regEDX + (this.regEAX << 1);
    },
    /**
     * opModSIB43(): scale=01 (2)  index=000 (EAX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB43(mod) {
        return this.regEBX + (this.regEAX << 1);
    },
    /**
     * opModSIB44(): scale=01 (2)  index=000 (EAX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB44(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEAX << 1);
    },
    /**
     * opModSIB45(): scale=01 (2)  index=000 (EAX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB45(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEAX << 1);
    },
    /**
     * opModSIB46(): scale=01 (2)  index=000 (EAX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB46(mod) {
        return this.regESI + (this.regEAX << 1);
    },
    /**
     * opModSIB47(): scale=01 (2)  index=000 (EAX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB47(mod) {
        return this.regEDI + (this.regEAX << 1);
    },
    /**
     * opModSIB48(): scale=01 (2)  index=001 (ECX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB48(mod) {
        return this.regEAX + (this.regECX << 1);
    },
    /**
     * opModSIB49(): scale=01 (2)  index=001 (ECX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB49(mod) {
        return this.regECX + (this.regECX << 1);
    },
    /**
     * opModSIB4A(): scale=01 (2)  index=001 (ECX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB4A(mod) {
        return this.regEDX + (this.regECX << 1);
    },
    /**
     * opModSIB4B(): scale=01 (2)  index=001 (ECX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB4B(mod) {
        return this.regEBX + (this.regECX << 1);
    },
    /**
     * opModSIB4C(): scale=01 (2)  index=001 (ECX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB4C(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regECX << 1);
    },
    /**
     * opModSIB4D(): scale=01 (2)  index=001 (ECX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB4D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regECX << 1);
    },
    /**
     * opModSIB4E(): scale=01 (2)  index=001 (ECX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB4E(mod) {
        return this.regESI + (this.regECX << 1);
    },
    /**
     * opModSIB4F(): scale=01 (2)  index=001 (ECX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB4F(mod) {
        return this.regEDI + (this.regECX << 1);
    },
    /**
     * opModSIB50(): scale=01 (2)  index=010 (EDX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB50(mod) {
        return this.regEAX + (this.regEDX << 1);
    },
    /**
     * opModSIB51(): scale=01 (2)  index=010 (EDX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB51(mod) {
        return this.regECX + (this.regEDX << 1);
    },
    /**
     * opModSIB52(): scale=01 (2)  index=010 (EDX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB52(mod) {
        return this.regEDX + (this.regEDX << 1);
    },
    /**
     * opModSIB53(): scale=01 (2)  index=010 (EDX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB53(mod) {
        return this.regEBX + (this.regEDX << 1);
    },
    /**
     * opModSIB54(): scale=01 (2)  index=010 (EDX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB54(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEDX << 1);
    },
    /**
     * opModSIB55(): scale=01 (2)  index=010 (EDX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB55(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEDX << 1);
    },
    /**
     * opModSIB56(): scale=01 (2)  index=010 (EDX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB56(mod) {
        return this.regESI + (this.regEDX << 1);
    },
    /**
     * opModSIB57(): scale=01 (2)  index=010 (EDX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB57(mod) {
        return this.regEDI + (this.regEDX << 1);
    },
    /**
     * opModSIB58(): scale=01 (2)  index=011 (EBX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB58(mod) {
        return this.regEAX + (this.regEBX << 1);
    },
    /**
     * opModSIB59(): scale=01 (2)  index=011 (EBX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB59(mod) {
        return this.regECX + (this.regEBX << 1);
    },
    /**
     * opModSIB5A(): scale=01 (2)  index=011 (EBX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB5A(mod) {
        return this.regEDX + (this.regEBX << 1);
    },
    /**
     * opModSIB5B(): scale=01 (2)  index=011 (EBX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB5B(mod) {
        return this.regEBX + (this.regEBX << 1);
    },
    /**
     * opModSIB5C(): scale=01 (2)  index=011 (EBX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB5C(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEBX << 1);
    },
    /**
     * opModSIB5D(): scale=01 (2)  index=011 (EBX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB5D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEBX << 1);
    },
    /**
     * opModSIB5E(): scale=01 (2)  index=011 (EBX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB5E(mod) {
        return this.regESI + (this.regEBX << 1);
    },
    /**
     * opModSIB5F(): scale=01 (2)  index=011 (EBX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB5F(mod) {
        return this.regEDI + (this.regEBX << 1);
    },
    /**
     * opModSIB60(): scale=01 (2)  index=100 (none)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB60(mod) {
        return this.regEAX;
    },
    /**
     * opModSIB61(): scale=01 (2)  index=100 (none)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB61(mod) {
        return this.regECX;
    },
    /**
     * opModSIB62(): scale=01 (2)  index=100 (none)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB62(mod) {
        return this.regEDX;
    },
    /**
     * opModSIB63(): scale=01 (2)  index=100 (none)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB63(mod) {
        return this.regEBX;
    },
    /**
     * opModSIB64(): scale=01 (2)  index=100 (none)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB64(mod) {
        this.segData = this.segStack;
        return this.getSP();
    },
    /**
     * opModSIB65(): scale=01 (2)  index=100 (none)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB65(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr());
    },
    /**
     * opModSIB66(): scale=01 (2)  index=100 (none)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB66(mod) {
        return this.regESI;
    },
    /**
     * opModSIB67(): scale=01 (2)  index=100 (none)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB67(mod) {
        return this.regEDI;
    },
    /**
     * opModSIB68(): scale=01 (2)  index=101 (EBP)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB68(mod) {
        return this.regEAX + (this.regEBP << 1);
    },
    /**
     * opModSIB69(): scale=01 (2)  index=101 (EBP)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB69(mod) {
        return this.regECX + (this.regEBP << 1);
    },
    /**
     * opModSIB6A(): scale=01 (2)  index=101 (EBP)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB6A(mod) {
        return this.regEDX + (this.regEBP << 1);
    },
    /**
     * opModSIB6B(): scale=01 (2)  index=101 (EBP)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB6B(mod) {
        return this.regEBX + (this.regEBP << 1);
    },
    /**
     * opModSIB6C(): scale=01 (2)  index=101 (EBP)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB6C(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEBP << 1);
    },
    /**
     * opModSIB6D(): scale=01 (2)  index=101 (EBP)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB6D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEBP << 1);
    },
    /**
     * opModSIB6E(): scale=01 (2)  index=101 (EBP)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB6E(mod) {
        return this.regESI + (this.regEBP << 1);
    },
    /**
     * opModSIB6F(): scale=01 (2)  index=101 (EBP)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB6F(mod) {
        return this.regEDI + (this.regEBP << 1);
    },
    /**
     * opModSIB70(): scale=01 (2)  index=110 (ESI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB70(mod) {
        return this.regEAX + (this.regESI << 1);
    },
    /**
     * opModSIB71(): scale=01 (2)  index=110 (ESI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB71(mod) {
        return this.regECX + (this.regESI << 1);
    },
    /**
     * opModSIB72(): scale=01 (2)  index=110 (ESI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB72(mod) {
        return this.regEDX + (this.regESI << 1);
    },
    /**
     * opModSIB73(): scale=01 (2)  index=110 (ESI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB73(mod) {
        return this.regEBX + (this.regESI << 1);
    },
    /**
     * opModSIB74(): scale=01 (2)  index=110 (ESI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB74(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regESI << 1);
    },
    /**
     * opModSIB75(): scale=01 (2)  index=110 (ESI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB75(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regESI << 1);
    },
    /**
     * opModSIB76(): scale=01 (2)  index=110 (ESI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB76(mod) {
        return this.regESI + (this.regESI << 1);
    },
    /**
     * opModSIB77(): scale=01 (2)  index=110 (ESI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB77(mod) {
        return this.regEDI + (this.regESI << 1);
    },
    /**
     * opModSIB78(): scale=01 (2)  index=111 (EDI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB78(mod) {
        return this.regEAX + (this.regEDI << 1);
    },
    /**
     * opModSIB79(): scale=01 (2)  index=111 (EDI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB79(mod) {
        return this.regECX + (this.regEDI << 1);
    },
    /**
     * opModSIB7A(): scale=01 (2)  index=111 (EDI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB7A(mod) {
        return this.regEDX + (this.regEDI << 1);
    },
    /**
     * opModSIB7B(): scale=01 (2)  index=111 (EDI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB7B(mod) {
        return this.regEBX + (this.regEDI << 1);
    },
    /**
     * opModSIB7C(): scale=01 (2)  index=111 (EDI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB7C(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEDI << 1);
    },
    /**
     * opModSIB7D(): scale=01 (2)  index=111 (EDI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB7D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEDI << 1);
    },
    /**
     * opModSIB7E(): scale=01 (2)  index=111 (EDI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB7E(mod) {
        return this.regESI + (this.regEDI << 1);
    },
    /**
     * opModSIB7F(): scale=01 (2)  index=111 (EDI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB7F(mod) {
        return this.regEDI + (this.regEDI << 1);
    },
    /**
     * opModSIB80(): scale=10 (4)  index=000 (EAX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB80(mod) {
        return this.regEAX + (this.regEAX << 2);
    },
    /**
     * opModSIB81(): scale=10 (4)  index=000 (EAX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB81(mod) {
        return this.regECX + (this.regEAX << 2);
    },
    /**
     * opModSIB82(): scale=10 (4)  index=000 (EAX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB82(mod) {
        return this.regEDX + (this.regEAX << 2);
    },
    /**
     * opModSIB83(): scale=10 (4)  index=000 (EAX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB83(mod) {
        return this.regEBX + (this.regEAX << 2);
    },
    /**
     * opModSIB84(): scale=10 (4)  index=000 (EAX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB84(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEAX << 2);
    },
    /**
     * opModSIB85(): scale=10 (4)  index=000 (EAX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB85(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEAX << 2);
    },
    /**
     * opModSIB86(): scale=10 (4)  index=000 (EAX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB86(mod) {
        return this.regESI + (this.regEAX << 2);
    },
    /**
     * opModSIB87(): scale=10 (4)  index=000 (EAX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB87(mod) {
        return this.regEDI + (this.regEAX << 2);
    },
    /**
     * opModSIB88(): scale=10 (4)  index=001 (ECX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB88(mod) {
        return this.regEAX + (this.regECX << 2);
    },
    /**
     * opModSIB89(): scale=10 (4)  index=001 (ECX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB89(mod) {
        return this.regECX + (this.regECX << 2);
    },
    /**
     * opModSIB8A(): scale=10 (4)  index=001 (ECX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB8A(mod) {
        return this.regEDX + (this.regECX << 2);
    },
    /**
     * opModSIB8B(): scale=10 (4)  index=001 (ECX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB8B(mod) {
        return this.regEBX + (this.regECX << 2);
    },
    /**
     * opModSIB8C(): scale=10 (4)  index=001 (ECX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB8C(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regECX << 2);
    },
    /**
     * opModSIB8D(): scale=10 (4)  index=001 (ECX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB8D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regECX << 2);
    },
    /**
     * opModSIB8E(): scale=10 (4)  index=001 (ECX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB8E(mod) {
        return this.regESI + (this.regECX << 2);
    },
    /**
     * opModSIB8F(): scale=10 (4)  index=001 (ECX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB8F(mod) {
        return this.regEDI + (this.regECX << 2);
    },
    /**
     * opModSIB90(): scale=10 (4)  index=010 (EDX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB90(mod) {
        return this.regEAX + (this.regEDX << 2);
    },
    /**
     * opModSIB91(): scale=10 (4)  index=010 (EDX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB91(mod) {
        return this.regECX + (this.regEDX << 2);
    },
    /**
     * opModSIB92(): scale=10 (4)  index=010 (EDX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB92(mod) {
        return this.regEDX + (this.regEDX << 2);
    },
    /**
     * opModSIB93(): scale=10 (4)  index=010 (EDX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB93(mod) {
        return this.regEBX + (this.regEDX << 2);
    },
    /**
     * opModSIB94(): scale=10 (4)  index=010 (EDX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB94(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEDX << 2);
    },
    /**
     * opModSIB95(): scale=10 (4)  index=010 (EDX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB95(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEDX << 2);
    },
    /**
     * opModSIB96(): scale=10 (4)  index=010 (EDX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB96(mod) {
        return this.regESI + (this.regEDX << 2);
    },
    /**
     * opModSIB97(): scale=10 (4)  index=010 (EDX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB97(mod) {
        return this.regEDI + (this.regEDX << 2);
    },
    /**
     * opModSIB98(): scale=10 (4)  index=011 (EBX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB98(mod) {
        return this.regEAX + (this.regEBX << 2);
    },
    /**
     * opModSIB99(): scale=10 (4)  index=011 (EBX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB99(mod) {
        return this.regECX + (this.regEBX << 2);
    },
    /**
     * opModSIB9A(): scale=10 (4)  index=011 (EBX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB9A(mod) {
        return this.regEDX + (this.regEBX << 2);
    },
    /**
     * opModSIB9B(): scale=10 (4)  index=011 (EBX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB9B(mod) {
        return this.regEBX + (this.regEBX << 2);
    },
    /**
     * opModSIB9C(): scale=10 (4)  index=011 (EBX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB9C(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEBX << 2);
    },
    /**
     * opModSIB9D(): scale=10 (4)  index=011 (EBX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB9D(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEBX << 2);
    },
    /**
     * opModSIB9E(): scale=10 (4)  index=011 (EBX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB9E(mod) {
        return this.regESI + (this.regEBX << 2);
    },
    /**
     * opModSIB9F(): scale=10 (4)  index=011 (EBX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIB9F(mod) {
        return this.regEDI + (this.regEBX << 2);
    },
    /**
     * opModSIBA0(): scale=10 (4)  index=100 (none)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA0(mod) {
        return this.regEAX;
    },
    /**
     * opModSIBA1(): scale=10 (4)  index=100 (none)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA1(mod) {
        return this.regECX;
    },
    /**
     * opModSIBA2(): scale=10 (4)  index=100 (none)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA2(mod) {
        return this.regEDX;
    },
    /**
     * opModSIBA3(): scale=10 (4)  index=100 (none)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA3(mod) {
        return this.regEBX;
    },
    /**
     * opModSIBA4(): scale=10 (4)  index=100 (none)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA4(mod) {
        this.segData = this.segStack;
        return this.getSP();
    },
    /**
     * opModSIBA5(): scale=10 (4)  index=100 (none)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA5(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr());
    },
    /**
     * opModSIBA6(): scale=10 (4)  index=100 (none)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA6(mod) {
        return this.regESI;
    },
    /**
     * opModSIBA7(): scale=10 (4)  index=100 (none)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA7(mod) {
        return this.regEDI;
    },
    /**
     * opModSIBA8(): scale=10 (4)  index=101 (EBP)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA8(mod) {
        return this.regEAX + (this.regEBP << 2);
    },
    /**
     * opModSIBA9(): scale=10 (4)  index=101 (EBP)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBA9(mod) {
        return this.regECX + (this.regEBP << 2);
    },
    /**
     * opModSIBAA(): scale=10 (4)  index=101 (EBP)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBAA(mod) {
        return this.regEDX + (this.regEBP << 2);
    },
    /**
     * opModSIBAB(): scale=10 (4)  index=101 (EBP)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBAB(mod) {
        return this.regEBX + (this.regEBP << 2);
    },
    /**
     * opModSIBAC(): scale=10 (4)  index=101 (EBP)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBAC(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEBP << 2);
    },
    /**
     * opModSIBAD(): scale=10 (4)  index=101 (EBP)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBAD(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEBP << 2);
    },
    /**
     * opModSIBAE(): scale=10 (4)  index=101 (EBP)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBAE(mod) {
        return this.regESI + (this.regEBP << 2);
    },
    /**
     * opModSIBAF(): scale=10 (4)  index=101 (EBP)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBAF(mod) {
        return this.regEDI + (this.regEBP << 2);
    },
    /**
     * opModSIBB0(): scale=10 (4)  index=110 (ESI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB0(mod) {
        return this.regEAX + (this.regESI << 2);
    },
    /**
     * opModSIBB1(): scale=10 (4)  index=110 (ESI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB1(mod) {
        return this.regECX + (this.regESI << 2);
    },
    /**
     * opModSIBB2(): scale=10 (4)  index=110 (ESI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB2(mod) {
        return this.regEDX + (this.regESI << 2);
    },
    /**
     * opModSIBB3(): scale=10 (4)  index=110 (ESI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB3(mod) {
        return this.regEBX + (this.regESI << 2);
    },
    /**
     * opModSIBB4(): scale=10 (4)  index=110 (ESI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB4(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regESI << 2);
    },
    /**
     * opModSIBB5(): scale=10 (4)  index=110 (ESI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB5(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regESI << 2);
    },
    /**
     * opModSIBB6(): scale=10 (4)  index=110 (ESI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB6(mod) {
        return this.regESI + (this.regESI << 2);
    },
    /**
     * opModSIBB7(): scale=10 (4)  index=110 (ESI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB7(mod) {
        return this.regEDI + (this.regESI << 2);
    },
    /**
     * opModSIBB8(): scale=10 (4)  index=111 (EDI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB8(mod) {
        return this.regEAX + (this.regEDI << 2);
    },
    /**
     * opModSIBB9(): scale=10 (4)  index=111 (EDI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBB9(mod) {
        return this.regECX + (this.regEDI << 2);
    },
    /**
     * opModSIBBA(): scale=10 (4)  index=111 (EDI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBBA(mod) {
        return this.regEDX + (this.regEDI << 2);
    },
    /**
     * opModSIBBB(): scale=10 (4)  index=111 (EDI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBBB(mod) {
        return this.regEBX + (this.regEDI << 2);
    },
    /**
     * opModSIBBC(): scale=10 (4)  index=111 (EDI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBBC(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEDI << 2);
    },
    /**
     * opModSIBBD(): scale=10 (4)  index=111 (EDI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBBD(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEDI << 2);
    },
    /**
     * opModSIBBE(): scale=10 (4)  index=111 (EDI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBBE(mod) {
        return this.regESI + (this.regEDI << 2);
    },
    /**
     * opModSIBBF(): scale=10 (4)  index=111 (EDI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBBF(mod) {
        return this.regEDI + (this.regEDI << 2);
    },
    /**
     * opModSIBC0(): scale=11 (8)  index=000 (EAX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC0(mod) {
        return this.regEAX + (this.regEAX << 3);
    },
    /**
     * opModSIBC1(): scale=11 (8)  index=000 (EAX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC1(mod) {
        return this.regECX + (this.regEAX << 3);
    },
    /**
     * opModSIBC2(): scale=11 (8)  index=000 (EAX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC2(mod) {
        return this.regEDX + (this.regEAX << 3);
    },
    /**
     * opModSIBC3(): scale=11 (8)  index=000 (EAX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC3(mod) {
        return this.regEBX + (this.regEAX << 3);
    },
    /**
     * opModSIBC4(): scale=11 (8)  index=000 (EAX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC4(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEAX << 3);
    },
    /**
     * opModSIBC5(): scale=11 (8)  index=000 (EAX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC5(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEAX << 3);
    },
    /**
     * opModSIBC6(): scale=11 (8)  index=000 (EAX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC6(mod) {
        return this.regESI + (this.regEAX << 3);
    },
    /**
     * opModSIBC7(): scale=11 (8)  index=000 (EAX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC7(mod) {
        return this.regEDI + (this.regEAX << 3);
    },
    /**
     * opModSIBC8(): scale=11 (8)  index=001 (ECX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC8(mod) {
        return this.regEAX + (this.regECX << 3);
    },
    /**
     * opModSIBC9(): scale=11 (8)  index=001 (ECX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBC9(mod) {
        return this.regECX + (this.regECX << 3);
    },
    /**
     * opModSIBCA(): scale=11 (8)  index=001 (ECX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBCA(mod) {
        return this.regEDX + (this.regECX << 3);
    },
    /**
     * opModSIBCB(): scale=11 (8)  index=001 (ECX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBCB(mod) {
        return this.regEBX + (this.regECX << 3);
    },
    /**
     * opModSIBCC(): scale=11 (8)  index=001 (ECX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBCC(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regECX << 3);
    },
    /**
     * opModSIBCD(): scale=11 (8)  index=001 (ECX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBCD(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regECX << 3);
    },
    /**
     * opModSIBCE(): scale=11 (8)  index=001 (ECX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBCE(mod) {
        return this.regESI + (this.regECX << 3);
    },
    /**
     * opModSIBCF(): scale=11 (8)  index=001 (ECX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBCF(mod) {
        return this.regEDI + (this.regECX << 3);
    },
    /**
     * opModSIBD0(): scale=11 (8)  index=010 (EDX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD0(mod) {
        return this.regEAX + (this.regEDX << 3);
    },
    /**
     * opModSIBD1(): scale=11 (8)  index=010 (EDX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD1(mod) {
        return this.regECX + (this.regEDX << 3);
    },
    /**
     * opModSIBD2(): scale=11 (8)  index=010 (EDX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD2(mod) {
        return this.regEDX + (this.regEDX << 3);
    },
    /**
     * opModSIBD3(): scale=11 (8)  index=010 (EDX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD3(mod) {
        return this.regEBX + (this.regEDX << 3);
    },
    /**
     * opModSIBD4(): scale=11 (8)  index=010 (EDX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD4(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEDX << 3);
    },
    /**
     * opModSIBD5(): scale=11 (8)  index=010 (EDX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD5(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEDX << 3);
    },
    /**
     * opModSIBD6(): scale=11 (8)  index=010 (EDX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD6(mod) {
        return this.regESI + (this.regEDX << 3);
    },
    /**
     * opModSIBD7(): scale=11 (8)  index=010 (EDX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD7(mod) {
        return this.regEDI + (this.regEDX << 3);
    },
    /**
     * opModSIBD8(): scale=11 (8)  index=011 (EBX)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD8(mod) {
        return this.regEAX + (this.regEBX << 3);
    },
    /**
     * opModSIBD9(): scale=11 (8)  index=011 (EBX)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBD9(mod) {
        return this.regECX + (this.regEBX << 3);
    },
    /**
     * opModSIBDA(): scale=11 (8)  index=011 (EBX)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBDA(mod) {
        return this.regEDX + (this.regEBX << 3);
    },
    /**
     * opModSIBDB(): scale=11 (8)  index=011 (EBX)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBDB(mod) {
        return this.regEBX + (this.regEBX << 3);
    },
    /**
     * opModSIBDC(): scale=11 (8)  index=011 (EBX)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBDC(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEBX << 3);
    },
    /**
     * opModSIBDD(): scale=11 (8)  index=011 (EBX)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBDD(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEBX << 3);
    },
    /**
     * opModSIBDE(): scale=11 (8)  index=011 (EBX)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBDE(mod) {
        return this.regESI + (this.regEBX << 3);
    },
    /**
     * opModSIBDF(): scale=11 (8)  index=011 (EBX)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBDF(mod) {
        return this.regEDI + (this.regEBX << 3);
    },
    /**
     * opModSIBE0(): scale=11 (8)  index=100 (none)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE0(mod) {
        return this.regEAX;
    },
    /**
     * opModSIBE1(): scale=11 (8)  index=100 (none)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE1(mod) {
        return this.regECX;
    },
    /**
     * opModSIBE2(): scale=11 (8)  index=100 (none)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE2(mod) {
        return this.regEDX;
    },
    /**
     * opModSIBE3(): scale=11 (8)  index=100 (none)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE3(mod) {
        return this.regEBX;
    },
    /**
     * opModSIBE4(): scale=11 (8)  index=100 (none)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE4(mod) {
        this.segData = this.segStack;
        return this.getSP();
    },
    /**
     * opModSIBE5(): scale=11 (8)  index=100 (none)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE5(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr());
    },
    /**
     * opModSIBE6(): scale=11 (8)  index=100 (none)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE6(mod) {
        return this.regESI;
    },
    /**
     * opModSIBE7(): scale=11 (8)  index=100 (none)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE7(mod) {
        return this.regEDI;
    },
    /**
     * opModSIBE8(): scale=11 (8)  index=101 (EBP)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE8(mod) {
        return this.regEAX + (this.regEBP << 3);
    },
    /**
     * opModSIBE9(): scale=11 (8)  index=101 (EBP)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBE9(mod) {
        return this.regECX + (this.regEBP << 3);
    },
    /**
     * opModSIBEA(): scale=11 (8)  index=101 (EBP)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBEA(mod) {
        return this.regEDX + (this.regEBP << 3);
    },
    /**
     * opModSIBEB(): scale=11 (8)  index=101 (EBP)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBEB(mod) {
        return this.regEBX + (this.regEBP << 3);
    },
    /**
     * opModSIBEC(): scale=11 (8)  index=101 (EBP)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBEC(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEBP << 3);
    },
    /**
     * opModSIBED(): scale=11 (8)  index=101 (EBP)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBED(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEBP << 3);
    },
    /**
     * opModSIBEE(): scale=11 (8)  index=101 (EBP)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBEE(mod) {
        return this.regESI + (this.regEBP << 3);
    },
    /**
     * opModSIBEF(): scale=11 (8)  index=101 (EBP)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBEF(mod) {
        return this.regEDI + (this.regEBP << 3);
    },
    /**
     * opModSIBF0(): scale=11 (8)  index=110 (ESI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF0(mod) {
        return this.regEAX + (this.regESI << 3);
    },
    /**
     * opModSIBF1(): scale=11 (8)  index=110 (ESI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF1(mod) {
        return this.regECX + (this.regESI << 3);
    },
    /**
     * opModSIBF2(): scale=11 (8)  index=110 (ESI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF2(mod) {
        return this.regEDX + (this.regESI << 3);
    },
    /**
     * opModSIBF3(): scale=11 (8)  index=110 (ESI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF3(mod) {
        return this.regEBX + (this.regESI << 3);
    },
    /**
     * opModSIBF4(): scale=11 (8)  index=110 (ESI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF4(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regESI << 3);
    },
    /**
     * opModSIBF5(): scale=11 (8)  index=110 (ESI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF5(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regESI << 3);
    },
    /**
     * opModSIBF6(): scale=11 (8)  index=110 (ESI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF6(mod) {
        return this.regESI + (this.regESI << 3);
    },
    /**
     * opModSIBF7(): scale=11 (8)  index=110 (ESI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF7(mod) {
        return this.regEDI + (this.regESI << 3);
    },
    /**
     * opModSIBF8(): scale=11 (8)  index=111 (EDI)  base=000 (EAX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF8(mod) {
        return this.regEAX + (this.regEDI << 3);
    },
    /**
     * opModSIBF9(): scale=11 (8)  index=111 (EDI)  base=001 (ECX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBF9(mod) {
        return this.regECX + (this.regEDI << 3);
    },
    /**
     * opModSIBFA(): scale=11 (8)  index=111 (EDI)  base=010 (EDX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBFA(mod) {
        return this.regEDX + (this.regEDI << 3);
    },
    /**
     * opModSIBFB(): scale=11 (8)  index=111 (EDI)  base=011 (EBX)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBFB(mod) {
        return this.regEBX + (this.regEDI << 3);
    },
    /**
     * opModSIBFC(): scale=11 (8)  index=111 (EDI)  base=100 (ESP)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBFC(mod) {
        this.segData = this.segStack;
        return this.getSP() + (this.regEDI << 3);
    },
    /**
     * opModSIBFD(): scale=11 (8)  index=111 (EDI)  base=101 (mod? EBP : disp32)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBFD(mod) {
        return (mod? ((this.segData = this.segStack), this.regEBP) : this.getIPAddr()) + (this.regEDI << 3);
    },
    /**
     * opModSIBFE(): scale=11 (8)  index=111 (EDI)  base=110 (ESI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBFE(mod) {
        return this.regESI + (this.regEDI << 3);
    },
    /**
     * opModSIBFF(): scale=11 (8)  index=111 (EDI)  base=111 (EDI)
     *
     * @this {X86CPU}
     * @param {number} mod
     */
    function opModSIBFF(mod) {
        return this.regEDI + (this.regEDI << 3);
    }
];

if (NODE) module.exports = X86ModSIB;
