/**
 * @fileoverview Implements PCjs 8087 FPU logic.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2015-Nov-09
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
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var State       = require("./state");
    var X86         = require("./x86");
    var X86Seg      = require("./x86seg");
}

/*
 * Operand Type Reference
 *
 *      ST                  stack top; the register currently at the top of the stack
 *      ST(i)               register in the stack i (0<=i<=7) stack elements from the top
 *      SR (short-real)     short real (32 bits) number in memory; exponent bias is 127 (0x7f)
 *      LR (long-real)      long real (64 bits) number in memory; exponent bias is 1023 (0x3ff)
 *      TR (temp-real)      temporary real (80 bits) number in memory; exponent bias is 16383 (0x3fff)
 *      PD (packed-decimal) packed decimal integer (18 digits, 10 bytes) in memory
 *      WI (word-integer)   word binary integer (16 bits) in memory
 *      SI (short-integer)  short binary integer (32 bits) in memory
 *      LI (long-integer)   long binary integer (64 bits) in memory
 *      NN (nn-bytes)       memory area nn bytes long
 */

/**
 * X86FPU(parmsFPU)
 *
 * The X86FPU class uses the following (parmsFPU) properties:
 *
 *      model: a number (eg, 8087) that should match one of the X86.FPU.MODEL values (default is 8087)
 *      stepping: a string (eg, "B1") that should match one of the X86.FPU.STEPPING values (default is "")
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsFPU
 */
function X86FPU(parmsFPU)
{
    Component.call(this, "FPU", parmsFPU, X86FPU);

    this.model = parmsFPU['model'] || X86.FPU.MODEL_8087;

    /*
     * We take the 'stepping' value, convert it to a hex value, and then add that to the model to provide
     * a single value that's unique for any given CPU stepping.  If no stepping is provided, then stepping
     * is equal to model.
     */
    var stepping = parmsFPU['stepping'];
    this.stepping = this.model + (stepping? str.parseInt(stepping, 16) : 0);

    /*
     * Perform a one-time allocation of all floating-point registers.
     * NOTE: The FPU's internal registers are supposed to be 80-bit, but JavaScript gives us only 64-bit floats.
     */
    this.regStack = new Float64Array(8);
    this.intStack = new Int32Array(this.regStack.buffer);

    /*
     * Used for "short-real" (SR) 32-bit floating-point operations.
     */
    this.regTmpSR = new Float32Array(1);
    this.intTmpSR = new Int32Array(this.regTmpSR.buffer);

    /*
     * Used for "long-real" (LR) 64-bit floating-point operations.
     */
    this.regTmpLR = new Float64Array(1);
    this.intTmpLR = new Int32Array(this.regTmpLR.buffer);

    /*
     * Used for conversion to/from the 80-bit "temp-real" (TR) format; used as three 32-bit integers,
     * where [0] contains TR bits 0-31, [1] contains TR bits 32-63, and [2] contains TR bits 64-79; the
     * upper 16 bits of [2] are not used and should remain zero.
     */
    this.regTmpTR = new Array(3);

    /*
     * Initialize other (non-floating-point) coprocessor registers that resetFPU() doesn't touch,
     * such as the "exception" registers: regCodeSel, regCodeOff, regDataSel, regDataOff, and regOpcode.
     *
     * Note that regCodeSel and regDataSel are NEVER set in real-mode and are ALWAYS set in protected-mode,
     * so we set them to -1 in their "unset" state; if those values ever show up in an exception block,
     * something may have gone amiss (it's not impossible though, because if an exception occurs before any
     * memory operands have been used, regDataSel may still be "unset").
     *
     * NOTE: iOperand is the low 3 bits of the bModRM byte, for instructions that have an explicit operand.
     */
    this.regCodeSel = this.regDataSel = -1;
    this.regCodeOff = this.regDataOff = this.regOpcode = this.iOperand = 0;

    /*
     * Initialize floating-point constants, as if they were internal read-only registers.
     */
    this.regIndefinite = new Float64Array(1);
    this.intIndefinite = new Int32Array(this.regIndefinite.buffer);
    this.intIndefinite[0] = 0x00000000; this.intIndefinite[1] = 0xFFF8000;

    this.regL2T = Math.log(10) / Math.LN2;      // log2(10) (use Math.log2() if we ever switch to ES6)
    this.regL2E = Math.LOG2E;                   // log2(e)
    this.regPI  = Math.PI;                      // pi
    this.regLG2 = Math.log(2) / Math.LN10;      // log10(2) (use Math.log10() if we ever switch to ES6)
    this.regLN2 = Math.LN2;                     // log(2)

    /*
     * Initialize all other coprocessor registers (control word, tag word, status word, etc) by resetting them.
     */
    this.resetFPU();
}

Component.subclass(X86FPU);

/**
 * F2XM1()
 *
 * @this {X86FPU}
 */
X86FPU.F2XM1 = function()
{
    this.opUnimplemented();
};

/**
 * FABS()
 *
 * @this {X86FPU}
 */
X86FPU.FABS = function()
{
    this.opUnimplemented();
};

/**
 * FADDlr()
 *
 * @this {X86FPU}
 */
X86FPU.FADDlr = function()
{
    this.opUnimplemented();
};

/**
 * FADDsr()
 *
 * @this {X86FPU}
 */
X86FPU.FADDsr = function()
{
    this.check(this.regStack[this.iST] += this.getSRFromEA());
};

/**
 * FADDst()
 *
 * @this {X86FPU}
 */
X86FPU.FADDst = function()
{
    this.check(this.regStack[this.iST] += this.regStack[this.iOperand]);
};

/**
 * FADDsti()
 *
 * @this {X86FPU}
 */
X86FPU.FADDsti = function()
{
    this.check(this.regStack[this.iOperand] += this.regStack[this.iST]);
};

/**
 * FADDPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FADDPsti = function()
{
    this.opUnimplemented();
};

/**
 * FBLDpd()
 *
 * @this {X86FPU}
 */
X86FPU.FBLDpd = function()
{
    this.opUnimplemented();
};

/**
 * FBSTPpd()
 *
 * @this {X86FPU}
 */
X86FPU.FBSTPpd = function()
{
    this.opUnimplemented();
};

/**
 * FCHS()
 *
 * @this {X86FPU}
 */
X86FPU.FCHS = function()
{
    this.opUnimplemented();
};

/**
 * FCLEX()
 *
 * @this {X86FPU}
 */
X86FPU.FCLEX = function()
{
    this.opUnimplemented();
};

/**
 * FCOMlr()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMlr = function()
{
    this.opUnimplemented();
};

/**
 * FCOMsr()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMsr = function()
{
    this.opUnimplemented();
};

/**
 * FCOMst()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMst = function()
{
    this.opUnimplemented();
};

/**
 * FCOMsti()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMsti = function()
{
    this.opUnimplemented();
};

/**
 * FCOMPlr()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMPlr = function()
{
    this.opUnimplemented();
};

/**
 * FCOMPsr()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMPsr = function()
{
    this.opUnimplemented();
};

/**
 * FCOMPst()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMPst = function()
{
    this.opUnimplemented();
};

/**
 * FCOMPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMPsti = function()
{
    this.opUnimplemented();
};

/**
 * FCOMPPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FCOMPPsti = function()
{
    this.opUnimplemented();
};

/**
 * FDECSTP()
 *
 * @this {X86FPU}
 */
X86FPU.FDECSTP = function()
{
    this.opUnimplemented();
};

/**
 * FDISI()
 *
 * @this {X86FPU}
 */
X86FPU.FDISI = function()
{
    this.opUnimplemented();
};

/**
 * FDIVlr()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVlr = function()
{
    this.opUnimplemented();
};

/**
 * FDIVsr()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVsr = function()
{
    this.opUnimplemented();
};

/**
 * FDIVst()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVst = function()
{
    this.opUnimplemented();
};

/**
 * FDIVsti()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVsti = function()
{
    this.opUnimplemented();
};

/**
 * FDIVPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVPsti = function()
{
    this.opUnimplemented();
};

/**
 * FDIVRlr()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVRlr = function()
{
    this.opUnimplemented();
};

/**
 * FDIVRsr()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVRsr = function()
{
    this.opUnimplemented();
};

/**
 * FDIVRst()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVRst = function()
{
    this.opUnimplemented();
};

/**
 * FDIVRsti()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVRsti = function()
{
    this.opUnimplemented();
};

/**
 * FDIVRPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FDIVRPsti = function()
{
    this.opUnimplemented();
};

/**
 * FENI()
 *
 * @this {X86FPU}
 */
X86FPU.FENI = function()
{
    this.opUnimplemented();
};

/**
 * FFREEsti()
 *
 * @this {X86FPU}
 */
X86FPU.FFREEsti = function()
{
    this.opUnimplemented();
};

/**
 * FIADD16()
 *
 * @this {X86FPU}
 */
X86FPU.FIADD16 = function()
{
    this.opUnimplemented();
};

/**
 * FIADD32()
 *
 * @this {X86FPU}
 */
X86FPU.FIADD32 = function()
{
    this.opUnimplemented();
};

/**
 * FICOM16()
 *
 * @this {X86FPU}
 */
X86FPU.FICOM16 = function()
{
    this.opUnimplemented();
};

/**
 * FICOM32()
 *
 * @this {X86FPU}
 */
X86FPU.FICOM32 = function()
{
    this.opUnimplemented();
};

/**
 * FICOMP16()
 *
 * @this {X86FPU}
 */
X86FPU.FICOMP16 = function()
{
    this.opUnimplemented();
};

/**
 * FICOMP32()
 *
 * @this {X86FPU}
 */
X86FPU.FICOMP32 = function()
{
    this.opUnimplemented();
};

/**
 * FIDIV16()
 *
 * @this {X86FPU}
 */
X86FPU.FIDIV16 = function()
{
    this.opUnimplemented();
};

/**
 * FIDIV32()
 *
 * @this {X86FPU}
 */
X86FPU.FIDIV32 = function()
{
    this.opUnimplemented();
};

/**
 * FIDIVR16()
 *
 * @this {X86FPU}
 */
X86FPU.FIDIVR16 = function()
{
    this.opUnimplemented();
};

/**
 * FIDIVR32()
 *
 * @this {X86FPU}
 */
X86FPU.FIDIVR32 = function()
{
    this.opUnimplemented();
};

/**
 * FILD16()
 *
 * @this {X86FPU}
 */
X86FPU.FILD16 = function()
{
    this.opUnimplemented();
};

/**
 * FILD32()
 *
 * @this {X86FPU}
 */
X86FPU.FILD32 = function()
{
    this.opUnimplemented();
};

/**
 * FILD64()
 *
 * @this {X86FPU}
 */
X86FPU.FILD64 = function()
{
    this.opUnimplemented();
};

/**
 * FIMUL16()
 *
 * @this {X86FPU}
 */
X86FPU.FIMUL16 = function()
{
    this.opUnimplemented();
};

/**
 * FIMUL32()
 *
 * @this {X86FPU}
 */
X86FPU.FIMUL32 = function()
{
    this.opUnimplemented();
};

/**
 * FINCSTP()
 *
 * @this {X86FPU}
 */
X86FPU.FINCSTP = function()
{
    this.opUnimplemented();
};

/**
 * FINIT()
 *
 * @this {X86FPU}
 */
X86FPU.FINIT = function()
{
    this.resetFPU();
};

/**
 * FIST16()
 *
 * @this {X86FPU}
 */
X86FPU.FIST16 = function()
{
    this.opUnimplemented();
};

/**
 * FIST32()
 *
 * @this {X86FPU}
 */
X86FPU.FIST32 = function()
{
    this.opUnimplemented();
};

/**
 * FISTP16()
 *
 * @this {X86FPU}
 */
X86FPU.FISTP16 = function()
{
    this.opUnimplemented();
};

/**
 * FISTP32()
 *
 * @this {X86FPU}
 */
X86FPU.FISTP32 = function()
{
    this.opUnimplemented();
};

/**
 * FISTP64()
 *
 * @this {X86FPU}
 */
X86FPU.FISTP64 = function()
{
    this.opUnimplemented();
};

/**
 * FISUB16()
 *
 * @this {X86FPU}
 */
X86FPU.FISUB16 = function()
{
    this.opUnimplemented();
};

/**
 * FISUB32()
 *
 * @this {X86FPU}
 */
X86FPU.FISUB32 = function()
{
    this.opUnimplemented();
};

/**
 * FISUBR16()
 *
 * @this {X86FPU}
 */
X86FPU.FISUBR16 = function()
{
    this.opUnimplemented();
};

/**
 * FISUBR32()
 *
 * @this {X86FPU}
 */
X86FPU.FISUBR32 = function()
{
    this.opUnimplemented();
};

/**
 * FLDlr()
 *
 * @this {X86FPU}
 */
X86FPU.FLDlr = function()
{
    this.opUnimplemented();
};

/**
 * FLDsr()
 *
 * @this {X86FPU}
 */
X86FPU.FLDsr = function()
{
    this.opUnimplemented();
};

/**
 * FLDsti()
 *
 * @this {X86FPU}
 */
X86FPU.FLDsti = function()
{
    this.opUnimplemented();
};

/**
 * FLDtr()
 *
 * @this {X86FPU}
 */
X86FPU.FLDtr = function()
{
    this.opUnimplemented();
};

/**
 * FLDCW()
 *
 * @this {X86FPU}
 */
X86FPU.FLDCW = function()
{
    this.setControl(this.cpu.getShort(this.cpu.regEA));
};

/**
 * FLDENV()
 *
 * @this {X86FPU}
 */
X86FPU.FLDENV = function()
{
    this.loadEnv(this.cpu.regEA);
};

/**
 * FLD1()
 *
 * @this {X86FPU}
 */
X86FPU.FLD1 = function()
{
    this.push(1.0);
};

/**
 * FLDL2T()
 *
 * @this {X86FPU}
 */
X86FPU.FLDL2T = function()
{
    this.push(this.regL2T);
};

/**
 * FLDL2E()
 *
 * @this {X86FPU}
 */
X86FPU.FLDL2E = function()
{
    this.push(this.regL2E);
};

/**
 * FLDPI()
 *
 * @this {X86FPU}
 */
X86FPU.FLDPI = function()
{
    this.push(Math.PI);
};

/**
 * FLDLG2()
 *
 * @this {X86FPU}
 */
X86FPU.FLDLG2 = function()
{
    this.push(this.regLG2);
};

/**
 * FLDLN2()
 *
 * @this {X86FPU}
 */
X86FPU.FLDLN2 = function()
{
    this.push(this.regLN2);
};

/**
 * FLDZ()
 *
 * @this {X86FPU}
 */
X86FPU.FLDZ = function()
{
    this.push(0.0);
};

/**
 * FMULlr()
 *
 * @this {X86FPU}
 */
X86FPU.FMULlr = function()
{
    this.opUnimplemented();
};

/**
 * FMULsr()
 *
 * @this {X86FPU}
 */
X86FPU.FMULsr = function()
{
    this.check(this.regStack[this.iST] *= this.getSRFromEA());
};

/**
 * FMULst()
 *
 * @this {X86FPU}
 */
X86FPU.FMULst = function()
{
    this.check(this.regStack[this.iST] *= this.regStack[this.iOperand]);
};

/**
 * FMULsti()
 *
 * @this {X86FPU}
 */
X86FPU.FMULsti = function()
{
    this.check(this.regStack[this.iOperand] *= this.regStack[this.iST]);
};

/**
 * FMULPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FMULPsti = function()
{
    this.opUnimplemented();
};

/**
 * FNOP()
 *
 * @this {X86FPU}
 */
X86FPU.FNOP = function()
{
};

/**
 * FPATAN()
 *
 * @this {X86FPU}
 */
X86FPU.FPATAN = function()
{
    this.opUnimplemented();
};

/**
 * FPTAN()
 *
 * @this {X86FPU}
 */
X86FPU.FPTAN = function()
{
    this.opUnimplemented();
};

/**
 * FPREM()
 *
 * @this {X86FPU}
 */
X86FPU.FPREM = function()
{
    this.opUnimplemented();
};

/**
 * FRSTOR()
 *
 * @this {X86FPU}
 */
X86FPU.FRSTOR = function()
{
    var cpu = this.cpu;
    var addr = this.loadEnv(cpu.regEA);
    var a = this.regTmpTR;
    for (var i = 0; i < this.regStack.length; i++) {
        a[0] = cpu.getLong(addr);
        a[1] = cpu.getLong(addr += 4);
        a[2] = cpu.getShort(addr += 4);
        this.setTR(i, a);
        addr += 2;
    }
};

/**
 * FRNDINT()
 *
 * @this {X86FPU}
 */
X86FPU.FRNDINT = function()
{
    this.opUnimplemented();
};

/**
 * FSAVE()
 *
 * @this {X86FPU}
 */
X86FPU.FSAVE = function()
{
    var cpu = this.cpu;
    var addr = this.saveEnv(cpu.regEA);
    for (var i = 0; i < this.regStack.length; i++) {
        var a = this.getTR(i);
        cpu.setLong(addr, a[0]);
        cpu.setLong(addr += 4, a[1]);
        cpu.setShort(addr += 4, a[2]);
        addr += 2;
    }
    this.resetFPU();
};

/**
 * FSCALE()
 *
 * @this {X86FPU}
 */
X86FPU.FSCALE = function()
{
    this.opUnimplemented();
};

/**
 * FSETPM()
 *
 * @this {X86FPU}
 */
X86FPU.FSETPM = function()
{
    if (this.isModel(X86.FPU.MODEL_80287)) {
        this.opUnimplemented();
    }
};

/**
 * FSINCOS()
 *
 * @this {X86FPU}
 */
X86FPU.FSINCOS = function()
{
    if (this.leastModel(X86.FPU.MODEL_80287XL)) {
        this.opUnimplemented();
    }
};

/**
 * FSQRT()
 *
 * @this {X86FPU}
 */
X86FPU.FSQRT = function()
{
    this.opUnimplemented();
};

/**
 * FSTlr()
 *
 * @this {X86FPU}
 */
X86FPU.FSTlr = function()
{
    this.opUnimplemented();
};

/**
 * FSTsr()
 *
 * @this {X86FPU}
 */
X86FPU.FSTsr = function()
{
    this.opUnimplemented();
};

/**
 * FSTsti()
 *
 * @this {X86FPU}
 */
X86FPU.FSTsti = function()
{
    this.opUnimplemented();
};

/**
 * FSTENV()
 *
 * @this {X86FPU}
 */
X86FPU.FSTENV = function()
{
    this.saveEnv(this.cpu.regEA);
    this.regControl |= X86.FPU.CONTROL.EXC;     // mask all exceptions (but do not set IEM)
};

/**
 * FSTPlr()
 *
 * @this {X86FPU}
 */
X86FPU.FSTPlr = function()
{
    this.opUnimplemented();
};

/**
 * FSTPsr()
 *
 * @this {X86FPU}
 */
X86FPU.FSTPsr = function()
{
    this.opUnimplemented();
};

/**
 * FSTPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FSTPsti = function()
{
    this.opUnimplemented();
};

/**
 * FSTPtr()
 *
 * @this {X86FPU}
 */
X86FPU.FSTPtr = function()
{
    this.opUnimplemented();
};

/**
 * FSTCW()
 *
 * @this {X86FPU}
 */
X86FPU.FSTCW = function()
{
    this.cpu.setShort(this.cpu.regEA, this.regControl);
};

/**
 * FSTSW()
 *
 * @this {X86FPU}
 */
X86FPU.FSTSW = function()
{
    this.cpu.setShort(this.cpu.regEA, this.getStatus());
};

/**
 * FSTSWAX()
 *
 * @this {X86FPU}
 */
X86FPU.FSTSWAX = function()
{
    if (this.leastModel(X86.FPU.MODEL_80287)) {
        this.cpu.regEAX = (this.cpu.regEAX & ~0xffff) | this.getStatus();
    }
};

/**
 * FSUBlr()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBlr = function()
{
    this.opUnimplemented();
};

/**
 * FSUBsr()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBsr = function()
{
    this.opUnimplemented();
};

/**
 * FSUBst()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBst = function()
{
    this.opUnimplemented();
};

/**
 * FSUBsti()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBsti = function()
{
    this.opUnimplemented();
};

/**
 * FSUBPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBPsti = function()
{
    this.opUnimplemented();
};

/**
 * FSUBRlr()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBRlr = function()
{
    this.opUnimplemented();
};

/**
 * FSUBRsr()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBRsr = function()
{
    this.opUnimplemented();
};

/**
 * FSUBRst()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBRst = function()
{
    this.opUnimplemented();
};

/**
 * FSUBRsti()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBRsti = function()
{
    this.opUnimplemented();
};

/**
 * FSUBRPsti()
 *
 * @this {X86FPU}
 */
X86FPU.FSUBRPsti = function()
{
    this.opUnimplemented();
};

/**
 * FTST()
 *
 * @this {X86FPU}
 */
X86FPU.FTST = function()
{
    this.opUnimplemented();
};

/**
 * FXAM()
 *
 * @this {X86FPU}
 */
X86FPU.FXAM = function()
{
    this.opUnimplemented();
};

/**
 * FXCHsti()
 *
 * @this {X86FPU}
 */
X86FPU.FXCHsti = function()
{
    this.opUnimplemented();
};

/**
 * FXTRACT()
 *
 * @this {X86FPU}
 */
X86FPU.FXTRACT = function()
{
    this.opUnimplemented();
};

/**
 * FYL2X()
 *
 * @this {X86FPU}
 */
X86FPU.FYL2X = function()
{
    this.opUnimplemented();
};

/**
 * FYL2XP1()
 *
 * @this {X86FPU}
 */
X86FPU.FYL2XP1 = function()
{
    this.opUnimplemented();
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {X86FPU}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
X86FPU.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cpu = cpu;
    this.chipset = cmp.getMachineComponent("ChipSet");
    this.setReady();
};

/**
 * clearBusy()
 *
 * The ChipSet calls us whenever an I/O operation that clears the coprocessor's "busy" state is performed.
 *
 * @this {X86FPU}
 */
X86FPU.prototype.clearBusy = function()
{
    /*
     * We're never "busy" as far as other components are concerned, because we perform all FPU operations
     * synchronously, so there's nothing to do here.
     */
};

/**
 * powerUp(data, fRepower)
 *
 * @this {X86FPU}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
X86FPU.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.resetFPU();
        } else {
            if (!this.restore(data)) return false;
        }
    }
    if (DEBUG) {
        /*
         * Test loading all 7 constants.
         */
        X86FPU.FLD1.call(this);
        X86FPU.FLDZ.call(this);
        X86FPU.FLDL2T.call(this);
        X86FPU.FLDL2E.call(this);
        X86FPU.FLDPI.call(this);
        X86FPU.FLDLG2.call(this);
        X86FPU.FLDLN2.call(this);
        /*
         * Test the ability of getTR() to convert any LR to a TR, and then verify that getLR() can always obtain
         * the original LR from that TR.  TR->LR can be a lossy operation, but LR->TR->LR should never be.
         *
         * We'll start by taking the value PI, which should located at ST(2) after the above pushes, converting it
         * to a TR, and then setting ST(7), which should still be empty after the above pushes, with the same TR value.
         *
         * If that simple test passes, then we'll proceed to more aggressive testing, using randomly-generated floats.
         */
        var a = this.getTR(2);
        this.setTR(7, a);
        this.assert(this.getST(2) === this.getST(7));

        var nTests = 10000;
        while (nTests--) {
            var lo = this.getRandomInt(0, 0xffffffff);
            var hi = this.getRandomInt(0, 0xffffffff);
            this.setST64(6, lo, hi);
            a = this.getTR(6);
            this.setTR(7, a);
            if (this.getST(6) !== this.getST(7)) {
                /*
                 * In JavaScript, NaN values are never equal to any other value, even another identical NaN (sigh)
                 */
                if (!isNaN(this.getST(6)) || !isNaN(this.getST(7))) {
                    this.println("test failure");
                    break;
                }
            }
        }
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {X86FPU}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
X86FPU.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * save()
 *
 * This implements save support for the X86FPU component.
 *
 * @this {X86FPU}
 * @return {Object}
 */
X86FPU.prototype.save = function()
{
    var state = new State(this);
    var a = [], i = 0;
    a[i++] = this.regControl;
    a[i++] = this.getStatus();
    a[i++] = this.getTags();
    /*
     * Note that, unlike the FSAVE() and FRSTOR() operations, we save the registers in regStack in their physical
     * order (0-7) rather than their logical order (ST0-ST7).  Moreover, FSAVE() and FRSTOR() use the "temp-real" (TR)
     * format, whereas we use the current native format -- which, sadly, is only a 64-bit "long-real" (LR) format.
     */
    for (var iReg = 0; iReg < this.regStack.length; iReg++) {
        a[i++] = this.regStack[iReg];
    }
    state.set(0, a);
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the X86FPU component.
 *
 * @this {X86FPU}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
X86FPU.prototype.restore = function(data)
{
    var a = data[0], i = 0;
    this.setControl(a[i++]);
    this.setStatus(a[i++]);
    this.setTags(a[i++]);
    for (var iReg = 0; iReg < this.regStack.length; iReg++) {
        this.regStack[iReg] = a[i++];
    }
    return true;
};

/**
 * resetFPU()
 *
 * Aside from calling this internally (eg, during initialization and FINIT operations), the ChipSet may also call
 * us whenever an I/O operation that resets the coprocessor is performed.  Only 80487 coprocessors and higher will
 * also clear the "exception" registers, but the 80487 is currently beyond our planned level of support.
 *
 * @this {X86FPU}
 */
X86FPU.prototype.resetFPU = function()
{
    this.regUsed = 0;           // bits 0-7 are set as regs 0-7 are used
    this.regTags = 0xffff;      // this is updated only as needed by getTags()
    this.regControl = X86.FPU.CONTROL.INIT;
    this.regStatus = 0;         // contains all status register bits EXCEPT for ST
    this.iST = 0;               // the ST bits for regStatus are actually stored here
    if (this.chipset) this.chipset.clearFPUInterrupt();
};

/**
 * isModel(model)
 *
 * If the current model is equal to the specified model, then it's assumed the current operation
 * is supported, and we return true.
 *
 * @this {X86FPU}
 * @param {number} model
 * @return {boolean}
 */
X86FPU.prototype.isModel = function(model)
{
    if (this.model != model) {
        this.opNone();
        return false;
    }
    return true;
};

/**
 * leastModel(model)
 *
 * If the current model is greater than or equal to the specified model, then it's assumed the
 * current operation is supported, and we return true.
 *
 * @this {X86FPU}
 * @param {number} model
 * @return {boolean}
 */
X86FPU.prototype.leastModel = function(model)
{
    if (this.model < model) {
        this.opNone();
        return false;
    }
    return true;
};

/**
 * getRandomInt(min, max)
 *
 * NOTE: If either min or max is a 32-bit value with bit 31 set, and it has passed through some bit-wise operations,
 * then that value may end up being negative, and you may end up with an inverted (or empty) range.
 *
 * @this {X86FPU}
 * @param {number} min (inclusive)
 * @param {number} max (inclusive)
 * @return {number}
 */
X86FPU.prototype.getRandomInt = function(min, max)
{
    max -= min;
    if (max < 0) {      // compensate for inverted ranges (ie, where min > max)
        min += max;
        max = -max;
    }
    return Math.floor(Math.random() * (max + 1)) + min;
};

/**
 * opNone()
 *
 * Used for any coprocessor opcode that has no known operation, either for the current model or any model.
 *
 * @this {X86FPU}
 */
X86FPU.prototype.opNone = function()
{
    this.println(this.idComponent + ".opNone(" + str.toHexByte(this.cpu.bOpcode) + "," + str.toHexByte(this.cpu.bModRM) + ")");
    this.cpu.stopCPU();
};

/**
 * opUnimplemented()
 *
 * Used for any coprocessor opcode that DOES have a known operation, we just haven't implemented it yet.
 *
 * @this {X86FPU}
 */
X86FPU.prototype.opUnimplemented = function()
{
    this.println(this.idComponent + ".opUnimplemented(" + str.toHexByte(this.cpu.bOpcode) + "," + str.toHexByte(this.cpu.bModRM) + ")");
    this.cpu.stopCPU();
};

/**
 * check(f)
 *
 * @this {X86FPU}
 * @param {number} f
 */
X86FPU.prototype.check = function(f)
{
    if (!isFinite(f)) {
        this.fault(f === Infinity? X86.FPU.STATUS.OE : X86.FPU.STATUS.UE);
    }
};

/**
 * fault(n)
 *
 *      IE: 0x0001  bit 0: Invalid Operation
 *      DE: 0x0002  bit 1: Denormalized Operand
 *      ZE: 0x0004  bit 2: Zero Divide
 *      OE: 0x0008  bit 3: Overflow
 *      UE: 0x0010  bit 4: Underflow
 *      PE: 0x0020  bit 5: Precision
 *      SF: 0x0040  bit 6: Stack Fault (80387 and later)
 *
 * @this {X86FPU}
 * @param {number} n (one or more of the above error indicators)
 */
X86FPU.prototype.fault = function(n)
{
    if (this.model < X86.FPU.MODEL_80387) {
        n &= ~X86.FPU.STATUS.SF;        // this status bit didn't exist on pre-80387 coprocessors
    }

    this.regStatus |= n;

    if (!(this.regControl & X86.FPU.CONTROL.IEM)) {
        if ((this.regStatus & X86.FPU.STATUS.EXC) & ~this.regControl) {
            this.chipset.setFPUInterrupt();
        }
    }
};

/**
 * getSRFromEA()
 *
 * Sets the internal regTmpSR register to the (32-bit) short-real value located at regEA.
 *
 * @this {X86FPU}
 * @return {number}
 */
X86FPU.prototype.getSRFromEA = function()
{
    this.intTmpSR[0] = this.cpu.getLong(this.cpu.regEA);
    return this.regTmpSR[0];
};

/**
 * setControl(n)
 *
 * NOTE: Be sure to use this function for all "wholesale" regControl updates, because it ensures that
 * unused bits cannot be set -- including bit 6, which could otherwise inadvertently mask the SF error
 * condition on 80387 and newer coprocessors.
 *
 * @this {X86FPU}
 * @param {number} n
 */
X86FPU.prototype.setControl = function(n)
{
    this.regControl = n & ~X86.FPU.CONTROL.UNUSED;
};

/**
 * getStatus()
 *
 * @this {X86FPU}
 * @return {number} regStatus merged with iST
 */
X86FPU.prototype.getStatus = function()
{
    /*
     * As long as we never actually store any ST bit in regStatus, they should always be zero, so
     * in order to return the complete regStatus, all we need to do is shift and "or" the bits from iST.
     */
    return this.regStatus | (this.iST << X86.FPU.STATUS.ST_SHIFT);
};

/**
 * setStatus(n)
 *
 * @this {X86FPU}
 * @param {number} n
 */
X86FPU.prototype.setStatus = function(n)
{
    this.regStatus = n & ~X86.FPU.STATUS.ST;
    this.iST = (n & X86.FPU.STATUS.ST) >> X86.FPU.STATUS.ST_SHIFT;
};

/**
 * getTag(iReg)
 *
 * @this {X86FPU}
 * @param {number} iReg (register index)
 * @return {number} tag value for register
 */
X86FPU.prototype.getTag = function(iReg)
{
    var bitUsed = (1 << iReg);
    var tag = X86.FPU.TAGS.EMPTY;
    if (this.regUsed & bitUsed) {
        var f = this.regStack[iReg];
        tag = X86.FPU.TAGS.VALID;
        if (f === 0.0) {
            tag = X86.FPU.TAGS.ZERO;
        }
        else if (!isFinite(f)) {
            tag = X86.FPU.TAGS.SPECIAL;
        }
    }
    return tag;
};

/**
 * getTags()
 *
 * @this {X86FPU}
 * @return {number} tag values for all registers
 */
X86FPU.prototype.getTags = function()
{
    var tags = 0;
    for (var iReg = this.regStack.length - 1; iReg >= 0; iReg--) {
        tags <<= 2;
        tags |= this.getTag(iReg);
    }
    return tags;
};

/**
 * setTags(n)
 *
 * All we need to update here are which physical registers are marked "empty"; the rest of the tags
 * are generated on the fly based on actual values in the registers.
 *
 * @this {X86FPU}
 * @param {number} n (16-bit tag word, containing 8 2-bit tags)
 */
X86FPU.prototype.setTags = function(n)
{
    this.regUsed = 0;
    for (var bitUsed = 0x1; bitUsed <= 0x80; bitUsed <<= 1) {
        var tag = n & X86.FPU.TAGS.MASK;
        if (tag != X86.FPU.TAGS.EMPTY) {
            this.regUsed |= bitUsed;
        }
        n >>= 2;
    }
};

/**
 * getST(i)
 *
 * This is equivalent to getLR(i), since we return the top-relative stack register in its native format,
 * which is currently the 64-bit "long-real" (LR) format.
 *
 * @this {X86FPU}
 * @param {number} i
 * @return {number}
 */
X86FPU.prototype.getST = function(i)
{
    var iReg = (this.iST + i) & 7;
    this.assert(!!(this.regUsed & (1 << iReg)));
    return this.regStack[iReg];
};

/**
 * setST(i, v)
 *
 * This is equivalent to setLR(i, v), since we set the top-relative stack register using its native format,
 * which is currently the 64-bit "long-real" (LR) format.
 *
 * @this {X86FPU}
 * @param {number} i
 * @param {number} v
 */
X86FPU.prototype.setST = function(i, v)
{
    var iReg = (this.iST + i) & 7;
    this.regStack[iReg] = v;
    this.regUsed |= (1 << iReg);
};

/**
 * setST64(i, lo, hi)
 *
 * Use this instead of setST() if you want to set the two 32-bit portions of ST(i) directly.
 *
 * @this {X86FPU}
 * @param {number} i
 * @param {number} lo
 * @param {number} hi
 */
X86FPU.prototype.setST64 = function(i, lo, hi)
{
    var iReg = (this.iST + i) & 7;
    var iInt = iReg << 1;
    this.intStack[iInt] = lo;
    this.intStack[iInt + 1] = hi;
    this.regUsed |= (1 << iReg);
};

/**
 * getTR(i)
 *
 * Returns ST(i) as a TR ("long-real") in a[].
 *
 * Since we must use the "long-real" (64-bit) format internally, rather than the "temp-real" (80-bit) format,
 * this function converts a 64-bit value to an 80-bit value.  The major differences: 1) the former uses a 52-bit
 * fraction and 11-bit exponent, while the latter uses a 64-bit fraction and 15-bit exponent, 2) the former
 * does NOT store a leading 1 with the fraction, whereas the latter does.
 *
 * @this {X86FPU}
 * @param {number} i (stack index, 0-7)
 * @return {Array.<number>} ("temp-real" aka TR, as an array of three 32-bit integers)
 */
X86FPU.prototype.getTR = function(i)
{
    var iInt = ((this.iST + i) & 7) << 1;
    var loLR = this.intStack[iInt];
    var hiLR = this.intStack[iInt + 1];

    var expTR = (hiLR >> 20) & 0x07ff;
    var signTR = (hiLR >> 16) & 0x8000;
    var loTR = loLR << 11, hiTR = 0x80000000 | ((hiLR & 0x000fffff) << 11) | (loLR >>> 21);

    if (expTR == 0x07ff) {
        /*
         * Convert an LR NaN to a TR Nan.  NaNs encompass +/- infinity, which in the LR
         * world are fractions of all zeros.  NaNs also encompass indefinite, which in the LR
         * world are negative numbers with only the high fraction bit set.  So, in both cases,
         * our default TR value (ie, with zeros shifted into the bottom 11 bits) should be fine;
         * we simply need to change the exponent to the maximum TR value.
         */
        expTR = 0x7fff;
    }
    else if (!expTR) {
        /*
         * An LR with an exponent of zero could be an actual +/- zero, if the fraction is zero,
         * or it could be a denormal, if the fraction is non-zero.  In both cases, the only
         * change we need to make the TR form is clearing the leading 1 bit.
         */
        hiTR &= 0x7fffffff;
    }
    else {
        /*
         * We have a normal (biased) LR exponent which we must now convert to a (biased) TR exponent;
         * subtract the LR bias (0x3ff) and add the TR bias (0x3fff).
         */
        expTR += 0x3fff - 0x3ff;
    }

    this.regTmpTR[0] = loTR;
    this.regTmpTR[1] = hiTR;
    this.regTmpTR[2] = signTR | expTR;

    return this.regTmpTR;
};

/**
 * setTR(i, a)
 *
 * Sets ST(i) to the TR ("long-real") in a[].
 *
 * Since we must use the "long-real" (64-bit) format internally, rather than the "temp-real" (80-bit) format,
 * this function converts a 64-bit value to an 80-bit value.  The major differences: 1) the former uses a 52-bit
 * fraction and 11-bit exponent, while the latter uses a 64-bit fraction and 15-bit exponent, 2) the former
 * does NOT store a leading 1 with the fraction, whereas the latter does.
 *
 * @this {X86FPU}
 * @param {number} i (stack index, 0-7)
 * @param {Array.<number>} a
 */
X86FPU.prototype.setTR = function(i, a)
{
    var loTR = a[0], hiTR = a[1];
    var signLR = (a[2] & 0x8000) >> 4, expLR = a[2] & 0x7fff;
    /*
     * We have no choice but to chop off the bottom 11 TR bits in order to fit in an LR....
     */
    var loLR = (loTR >>> 11) | (hiTR << 21), hiLR = (hiTR >> 11) & 0xfffff;

    if (expLR == 0x7fff) {
        /*
         * Convert an TR NaN to a LR Nan.
         */
        expLR = 0x7ff;
    }
    else if (expLR) {
        /*
         * We have a normal (biased) TR exponent which we must now convert to a (biased) LR exponent;
         * subtract the TR bias (0x3fff) and add the LR bias (0x3ff); additionally, we have a problem
         * that getTR() did not: if the TR exponent is too large to fit in an LR exponent, then we
         * have convert the result to +/- infinity.
         */
        expLR += 0x3ff - 0x3fff;
        if (expLR <= 0) {
            expLR = 0x7ff;
            loLR = hiLR = 0;
        }
    }

    var iReg = (this.iST + i) & 7;
    var iInt = iReg << 1;
    this.intStack[iInt] = loLR;
    this.intStack[iInt + 1] = hiLR | ((signLR | expLR) << 20);
    this.regUsed |= (1 << iReg);
};

/**
 * push(f)
 *
 * @this {X86FPU}
 * @param {number} f
 */
X86FPU.prototype.push = function(f)
{
    var iReg = this.iST = (this.iST-1) & 7;
    var bitUsed = (1 << iReg);
    if (this.regUsed & bitUsed) {
        this.regStatus |= X86.FPU.STATUS.C1;        // C1 set indicates stack overflow
        this.regStack[iReg] = this.regIndefinite[0];
        this.fault(X86.FPU.STATUS.SF | X86.FPU.STATUS.IE);
    } else {
        this.regStack[iReg] = f;
        this.regUsed |= bitUsed;
    }
};

/**
 * loadEnv(addr)
 *
 * @this {X86FPU}
 * @param {number} addr
 * @return {number} updated addr
 */
X86FPU.prototype.loadEnv = function(addr)
{
    var w;
    var cpu = this.cpu;

    this.setControl(cpu.getWord(addr));
    this.setStatus(cpu.getWord(addr += cpu.sizeData));
    this.setTags(cpu.getWord(addr += cpu.sizeData));

    if (!(cpu.regCR0 & X86.CR0.MSW.PE) || (cpu.regPS & X86.PS.VM)) {
        this.regCodeOff = cpu.getWord(addr += cpu.sizeData);
        w = cpu.getWord(addr += cpu.sizeData);
        this.regOpcode = w & 0x7ff;
        this.regCodeOff |= (w & ~0xfff) << 4;
        this.regCodeSel = -1;
        this.regDataOff = cpu.getWord(addr += cpu.sizeData);
        this.regDataOff |= (cpu.getWord(addr += cpu.sizeData) & ~0xfff) << 4;
        this.regDataSel = -1;
    } else {
        this.regCodeOff = cpu.getWord(addr += cpu.sizeData);
        w = cpu.getWord(addr += cpu.sizeData);
        this.regCodeSel = w & 0xffff;
        this.regOpcode = (w >> 16) & 0x7ff;
        this.regDataOff = cpu.getWord(addr += cpu.sizeData);
        this.regDataSel = cpu.getWord(addr += cpu.sizeData) & 0xffff;
    }
    return addr + cpu.sizeData;
};

/**
 * saveEnv(addr)
 *
 * @this {X86FPU}
 * @param {number} addr
 * @return {number} updated addr
 */
X86FPU.prototype.saveEnv = function(addr)
{
    var cpu = this.cpu;

    cpu.setWord(addr, this.regControl);
    cpu.setWord(addr += cpu.sizeData, this.getStatus());
    cpu.setWord(addr += cpu.sizeData, this.getTags());

    if (!(cpu.regCR0 & X86.CR0.MSW.PE) || (cpu.regPS & X86.PS.VM)) {
        var off = (this.regCodeSel << 4) + this.regCodeOff;
        cpu.setWord(addr += cpu.sizeData, off);
        cpu.setWord(addr += cpu.sizeData, ((off >> 4) & ~0xfff) | this.regOpcode);
        off = (this.regDataSel << 4) + this.regDataOff;
        cpu.setWord(addr += cpu.sizeData, off);
        cpu.setWord(addr += cpu.sizeData, ((off >> 4) & ~0xfff));
    } else {
        cpu.setWord(addr += cpu.sizeData, this.regCodeOff);
        cpu.setWord(addr += cpu.sizeData, this.regCodeSel | (this.regOpcode << 16));
        cpu.setWord(addr += cpu.sizeData, this.regDataOff);
        cpu.setWord(addr += cpu.sizeData, this.regDataSel);
    }
    return addr + cpu.sizeData;
};

/**
 * opFPU(bOpcode, bModRM, dst, src)
 *
 * @this {X86FPU}
 * @param {number} bOpcode (0xD8-0xDF)
 * @param {number} bModRM
 * @param {number} dst
 * @param {number} src
 */
X86FPU.prototype.opFPU = function(bOpcode, bModRM, dst, src)
{
    this.println(this.idComponent + ".opFPU(" + str.toHexByte(bOpcode) + "," + str.toHexByte(bModRM) + ")");

    var mod = (bModRM >> 6) & 3;
    var reg = (bModRM >> 3) & 7;
    this.iOperand = (bModRM & 7);

    /*
     * Combine mod and reg into one decodable value: put mod in the high nibble
     * and reg in the low nibble, after first collapsing all mod values < 3 to zero.
     */
    var modReg = (mod < 3? 0 : 0x30) + reg;

    /*
     * All values >= 0x34 imply mod == 3 and reg >= 4, so now we shift reg into the high
     * nibble and iOperand into the low, yielding values >= 0x40.
     */
    if ((bOpcode == X86.OPCODE.ESC1 || bOpcode == X86.OPCODE.ESC3) && modReg >= 0x34) {
        modReg = (reg << 4) | this.iOperand;
    }

    var fnOp = X86FPU.aaOps[bOpcode][modReg];
    if (fnOp) {
        /*
         * A handful of FPU instructions must preserve (at least some of) the "exception" registers,
         * so if the current function is NOT one of those, then update all the "exception" registers.
         */
        if (X86FPU.afnPreserveExceptionRegs.indexOf(fnOp) < 0) {
            var cpu = this.cpu;
            var off = cpu.opLIP;
            /*
             * WARNING: opLIP points to any prefixes preceding the ESC instruction, but the 8087 always
             * points to the ESC instruction.  Technically, that's a bug, but it's also a reality, so we
             * have to check for preceding prefixes and bump the instruction pointer accordingly.  This
             * isn't a perfect solution, because it doesn't account for multiple (redundant) prefixes,
             * but it's the best we can do for now.
             */
            if (this.model == X86.FPU.MODEL_8087) {
                if (cpu.opPrefixes & X86.OPFLAG.SEG) off++;
                if (cpu.opPrefixes & X86.OPFLAG.LOCK) off++;
            }
            this.regCodeSel = cpu.segCS.sel;
            this.regCodeOff = off - cpu.segCS.base;
            if (cpu.regEA !== X86.ADDR_INVALID) {
                this.regDataSel = cpu.segEA.sel;
                this.regDataOff = cpu.regEA - cpu.segEA.base;
            }
            this.regOpcode = ((bOpcode & 7) << 8) | bModRM;
        }
        /*
         * Finally, perform the FPU operation.
         */
        fnOp.call(this);
    }
    else {
        /*
         * This is a gray area, at least until aaOps has been filled in for all supported coprocessors;
         * but for now, we'll treat all unrecognized operations as "no operation", as opposed to unimplemented.
         */
        this.opNone();
    }
};

if (DEBUGGER) {
    /**
     * readFPUStack(i)
     *
     * Returns the following information for the requested FPU stack element, relative to ST:
     *
     *      a[0]: physical stack position (0-7)
     *      a[1]: corresponding tag value
     *      a[2]: 64-bit "long-real" (LR) value
     *      a[3]: bits 0-31 of 64-bit "long-real" (LR)
     *      a[4]: bits 32-63 of 64-bit "long-real" (LR)
     *      a[5]: bits 0-31 of 80-bit "temp-real" (TR)
     *      a[6]: bits 32-63 of 80-bit "temp-real" (TR)
     *      a[7]: bits 64-79 of 80-bit "temp-real" (TR) (in bits 0-15)
     *
     * Used by the Debugger for its floating-point register ("rfp") command.
     *
     * @this {X86FPU}
     * @param {number} i (stack index, relative to ST)
     * @return {Array.<number>|null} (an array of information as described above, or null if invalid element)
     */
    X86FPU.prototype.readFPUStack = function(i) {
        var a = null;
        if (i < this.regStack.length) {
            a = [];
            var iReg = (this.iST + i) & 7;
            a[0] = iReg;
            a[1] = this.getTag(iReg);
            a[2] = this.regStack[iReg];
            var iInt = iReg << 1;
            a[3] = this.intStack[iInt];
            a[4] = this.intStack[iInt + 1];
            var aTR = this.getTR(i);
            a[5] = aTR[0]; a[6] = aTR[1]; a[7] = aTR[2];
        }
        return a;
    };
}

/*
 * Be sure to keep the following table in sync with Debugger.aaaOpFPUDescs
 */
X86FPU.aaOps = {
    0xD8: {
        0x00: X86FPU.FADDsr,    0x01: X86FPU.FMULsr,    0x02: X86FPU.FCOMsr,    0x03: X86FPU.FCOMPsr,
        0x04: X86FPU.FSUBsr,    0x05: X86FPU.FSUBRsr,   0x06: X86FPU.FDIVsr,    0x07: X86FPU.FDIVsr,
        0x30: X86FPU.FADDst,    0x31: X86FPU.FMULst,    0x32: X86FPU.FCOMst,    0x33: X86FPU.FCOMPst,
        0x34: X86FPU.FSUBst,    0x35: X86FPU.FSUBRst,   0x36: X86FPU.FDIVst,    0x37: X86FPU.FDIVRst
    },
    0xD9: {
        0x00: X86FPU.FLDsr,                             0x02: X86FPU.FSTsr,     0x03: X86FPU.FSTPsr,
        0x04: X86FPU.FLDENV,    0x05: X86FPU.FLDCW,     0x06: X86FPU.FSTENV,    0x07: X86FPU.FSTCW,
        0x30: X86FPU.FLDsti,    0x31: X86FPU.FXCHsti,   0x32: X86FPU.FNOP,      0x33: X86FPU.FSTPsti,
        0x40: X86FPU.FCHS,      0x41: X86FPU.FABS,
        0x44: X86FPU.FTST,      0x45: X86FPU.FXAM,
        0x50: X86FPU.FLD1,      0x51: X86FPU.FLDL2T,    0x52: X86FPU.FLDL2E,    0x53: X86FPU.FLDPI,
        0x54: X86FPU.FLDLG2,    0x55: X86FPU.FLDLN2,    0x56: X86FPU.FLDZ,
        0x60: X86FPU.F2XM1,     0x61: X86FPU.FYL2X,     0x62: X86FPU.FPTAN,     0x63: X86FPU.FPATAN,
        0x64: X86FPU.FXTRACT,                           0x66: X86FPU.FDECSTP,   0x67: X86FPU.FINCSTP,
        0x70: X86FPU.FPREM,     0x71: X86FPU.FYL2XP1,   0x72: X86FPU.FSQRT,
        0x74: X86FPU.FRNDINT,   0x75: X86FPU.FSCALE
    },
    0xDA: {
        0x00: X86FPU.FIADD32,   0x01: X86FPU.FIMUL32,   0x02: X86FPU.FICOM32,   0x03: X86FPU.FICOMP32,
        0x04: X86FPU.FISUB32,   0x05: X86FPU.FISUBR32,  0x06: X86FPU.FIDIV32,   0x07: X86FPU.FIDIVR32
    },
    0xDB: {
        0x00: X86FPU.FILD32,    0x02: X86FPU.FIST32,    0x03: X86FPU.FISTP32,
                                0x05: X86FPU.FLDtr,                             0x07: X86FPU.FSTPtr,
        0x40: X86FPU.FENI,      0x41: X86FPU.FDISI,     0x42: X86FPU.FCLEX,     0x43: X86FPU.FINIT,
        0x44: X86FPU.FSETPM,
        0X73: X86FPU.FSINCOS
    },
    0xDC: {
        0x00: X86FPU.FADDlr,    0x01: X86FPU.FMULlr,    0x02: X86FPU.FCOMlr,    0x03: X86FPU.FCOMPlr,
        0x04: X86FPU.FSUBlr,    0x05: X86FPU.FSUBRlr,   0x06: X86FPU.FDIVlr,    0x07: X86FPU.FDIVRlr,
        0x30: X86FPU.FADDsti,   0x31: X86FPU.FMULsti,   0x32: X86FPU.FCOMsti,   0x33: X86FPU.FCOMPsti,
        0x34: X86FPU.FSUBsti,   0x35: X86FPU.FSUBRsti,  0x36: X86FPU.FDIVsti,   0x37: X86FPU.FDIVRsti
    },
    0xDD: {
        0x00: X86FPU.FLDlr,                             0x02: X86FPU.FSTlr,     0x03: X86FPU.FSTPlr,
        0x04: X86FPU.FRSTOR,                            0x06: X86FPU.FSAVE,     0x07: X86FPU.FSTSW,
        0x30: X86FPU.FFREEsti,  0x31: X86FPU.FXCHsti,   0x32: X86FPU.FSTsti,    0x33: X86FPU.FSTPsti
    },
    0xDE: {
        0x00: X86FPU.FIADD16,   0x01: X86FPU.FIMUL16,   0x02: X86FPU.FICOM16,   0x03: X86FPU.FICOMP16,
        0x04: X86FPU.FISUB16,   0x05: X86FPU.FISUBR16,  0x06: X86FPU.FIDIV16,   0x07: X86FPU.FIDIVR16,
        0x30: X86FPU.FADDPsti,  0x31: X86FPU.FMULPsti,  0x32: X86FPU.FCOMPsti,  0x33: X86FPU.FCOMPPsti,
        0x34: X86FPU.FSUBPsti,  0x35: X86FPU.FSUBRPsti, 0x36: X86FPU.FDIVPsti,  0x37: X86FPU.FDIVRPsti
    },
    0xDF: {
        0x00: X86FPU.FILD16,    0x02: X86FPU.FIST16,    0x03: X86FPU.FISTP16,   0x04: X86FPU.FBLDpd,
        0x05: X86FPU.FILD64,    0x06: X86FPU.FBSTPpd,   0x07: X86FPU.FISTP64,   0x30: X86FPU.FFREEsti,
        0x31: X86FPU.FXCHsti,   0x32: X86FPU.FSTPsti,   0x33: X86FPU.FSTPsti,   0x34: X86FPU.FSTSWAX
    }
};

/*
 * An array of X86FPU functions documented as preserving the "exception" registers.
 */
X86FPU.afnPreserveExceptionRegs = [
    X86FPU.FCLEX,   X86FPU.FINIT,   X86FPU.FLDCW,   X86FPU.FLDENV,  X86FPU.FRSTOR,
    X86FPU.FSAVE,   X86FPU.FSTCW,   X86FPU.FSTENV,  X86FPU.FSTSW,   X86FPU.FSTSWAX
];

/**
 * X86FPU.init()
 *
 * This function operates on every HTML element of class "fpu", extracting the
 * JSON-encoded parameters for the X86FPU constructor from the element's "data-value"
 * attribute, invoking the constructor to create an X86FPU component, and then binding
 * any associated HTML controls to the new component.
 */
X86FPU.init = function()
{
    var aeFPUs = Component.getElementsByClass(window.document, PCJSCLASS, "fpu");
    for (var iFPU = 0; iFPU < aeFPUs.length; iFPU++) {
        var eFPU = aeFPUs[iFPU];
        var parmsFPU = Component.getComponentParms(eFPU);
        var fpu = new X86FPU(parmsFPU);
        Component.bindComponentControls(fpu, eFPU, PCJSCLASS);
    }
};

/*
 * Initialize every FPU module on the page
 */
web.onInit(X86FPU.init);

if (NODE) module.exports = X86FPU;
