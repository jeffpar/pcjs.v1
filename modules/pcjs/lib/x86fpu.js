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
    var X86         = require("./x86");
}

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
     * NOTE: Technically, the FPU's internal registers are 80-bit, but JavaScript gives us only 64-bit floats.
     */
    this.aRegs = new Float64Array(8);

    this.regTmpSR = new Float32Array(1);
    this.intTmpSR = new Int32Array(this.regTmpSR.buffer);

    this.regTmpLR = new Float64Array(1);
    this.intTmpLR = new Int32Array(this.regTmpLR.buffer);

    /*
     * Initialize any other (non-floating-point) coprocessor registers that resetFPU() doesn't touch.
     * NOTE: iOperand is the low 3 bits of the bModRM byte, used by instructions that allow an explicit operand.
     */
    this.regInsAddr = this.regDataAddr = this.regOpcode = this.iOperand = 0;

    /*
     * Initialize floating-point constants, as if they were internal read-only registers.
     */
    this.regIndefinite = new Float64Array(1);
    this.intIndefinite = new Int32Array(this.regIndefinite.buffer);
    this.intIndefinite[0] = 0xFFF8000; this.intIndefinite[1] = 0x00000000;

    this.regL2T = Math.log(10) / Math.LN2;      // log2(10) (use Math.log2() if we ever switch to ES6)
    this.regL2E = Math.LOG2E;                   // log2(e)
    this.regPI  = Math.PI;                      // pi
    this.regLG2 = Math.log(2) / Math.LN10;      // log10(2) (use Math.log10() if we ever switch to ES6)
    this.regLN2 = Math.LN2;                     // log(2)

    /*
     * Reset all other coprocessor registers (control word, tag word, status word, etc).
     */
    this.resetFPU();
}

Component.subclass(X86FPU);

/*
 * Operand Type Reference
 *
 *      ST                  stack top; the register currently at the top of the stack
 *      ST(i)               register in the stack i (0<=i<=7) stack elements from the top; ST(1) is the next-on-stack register, ST(2) is below ST(1), etc
 *      SR (short-real)     short real (32 bits) number in memory
 *      LR (long-real)      long real (64 bits) number in memory
 *      TR (temp-real)      temporary real (80 bits) number in memory
 *      PD (packed-decimal) packed decimal integer (18 digits, 10 bytes) in memory
 *      WI (word-integer)   word binary integer (16 bits) in memory
 *      SI (short-integer)  short binary integer (32 bits) in memory
 *      LI (long-integer)   long binary integer (64 bits) in memory
 *      NN (nn-bytes)       memory area nn bytes long
 *
 */

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
    this.check(this.aRegs[this.iST] += this.getSRFromEA());
};

/**
 * FADDst()
 *
 * @this {X86FPU}
 */
X86FPU.FADDst = function()
{
    this.check(this.aRegs[this.iST] += this.aRegs[this.iOperand]);
};

/**
 * FADDsti()
 *
 * @this {X86FPU}
 */
X86FPU.FADDsti = function()
{
    this.check(this.aRegs[this.iOperand] += this.aRegs[this.iST]);
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
    this.opUnimplemented();
};

/**
 * FLDENV()
 *
 * @this {X86FPU}
 */
X86FPU.FLDENV = function()
{
    this.opUnimplemented();
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
    this.check(this.aRegs[this.iST] *= this.getSRFromEA());
};

/**
 * FMULst()
 *
 * @this {X86FPU}
 */
X86FPU.FMULst = function()
{
    this.check(this.aRegs[this.iST] *= this.aRegs[this.iOperand]);
};

/**
 * FMULsti()
 *
 * @this {X86FPU}
 */
X86FPU.FMULsti = function()
{
    this.check(this.aRegs[this.iOperand] *= this.aRegs[this.iST]);
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
    this.opUnimplemented();
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
    this.opUnimplemented();
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
    this.opUnimplemented();
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
    this.cpu.setShort(this.cpu.regEA, this.regControl);
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
 * The ChipSet calls us whenever an I/O operation to clear the coprocessor's "busy" state is performed.
 *
 * @this {X86FPU}
 */
X86FPU.prototype.clearBusy = function()
{
    /*
     * We're never "busy" because we perform all FPU operations synchronously, so there's nothing to do.
     */
};

/**
 * resetFPU()
 *
 * Aside from calling this internally (eg, during initialization and FINIT operations), the ChipSet may also call
 * us whenever an I/O operation to reset the coprocessor is performed.
 *
 * @this {X86FPU}
 */
X86FPU.prototype.resetFPU = function()
{
    this.regUsed = 0;           // bits 0-7 are set as regs 0-7 are used
    this.regTags = 0xffff;      // this updated only as needed by getTags()
    this.regControl = X86.FPU.CONTROL.INIT;
    this.regStatus = 0;
    this.iST = 0;               // copy of the ST bits in regStatus
    if (this.chipset) this.chipset.clearFPUInterrupt();
};

/**
 * opUnimplemented()
 *
 * @this {X86FPU}
 */
X86FPU.prototype.opUnimplemented = function()
{
    this.println(this.idComponent + ".opUnimplemented(" + str.toHexByte(this.cpu.bOpcode) + "," + str.toHexByte(this.cpu.bModRM) + ")");
    this.cpu.stopCPU();
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
        /*
         * TODO: Make sure that "unused" bit 6 of regControl can never be set, otherwise it could inadvertently
         * mask the SF error condition on 80387 and newer coprocessors.
         */
        if ((this.regStatus & X86.FPU.STATUS.EXC) & ~this.regControl) {
            this.chipset.setFPUInterrupt();
        }
    }
};

/**
 * push(f)
 *
 * @this {X86FPU}
 * @param {number} f
 */
X86FPU.prototype.push = function(f)
{
    this.iST = (this.iST-1) & 7;
    var bitUsed = (1 << this.iST);

    if (this.regUsed & bitUsed) {
        this.regStatus |= X86.FPU.STATUS.C1;        // C1 set indicates stack overflow
        this.aRegs[this.iST] = this.regIndefinite[0];
        this.fault(X86.FPU.STATUS.SF | X86.FPU.STATUS.IE);
    } else {
        this.aRegs[this.iST] = f;
        this.regUsed |= bitUsed;
    }
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
    this.regOpcode = bOpcode;
    this.regInsAddr = this.cpu.regLIP;
    this.regDataAddr = this.cpu.regEA;

    this.println(this.idComponent + ".opFPU(" + str.toHexByte(bOpcode) + "," + str.toHexByte(bModRM) + ")");

    var mod = (bModRM >> 6) & 0x3;
    var reg = (bModRM >> 3) & 0x7;
    this.iOperand = (bModRM & 0x7);

    /*
     * Combine mod and reg into one decodable value: put mod in the high nibble
     * and reg in the low nibble, after first collapsing all mod values < 3 to zero.
     */
    var modReg = (mod < 3? 0 : 0x30) + reg;

    /*
     * Use values >= 0x40 to indicate mod == 0x3, with reg in the high nibble and
     * iOperand in the low.
     */
    if ((bOpcode == X86.OPCODE.ESC1 || bOpcode == X86.OPCODE.ESC3) && modReg >= 0x34) {
        modReg = (reg << 4) | this.iOperand;
    }

    var fnOp = X86FPU.aaOps[bOpcode][modReg];
    if (fnOp) {
        fnOp.call(this);
    } else {
        this.opUnimplemented();
    }
};

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
        0x40: X86FPU.FENI,      0x41: X86FPU.FDISI,     0x42: X86FPU.FCLEX,     0x43: X86FPU.FINIT
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
        0x31: X86FPU.FXCHsti,   0x32: X86FPU.FSTPsti,   0x33: X86FPU.FSTPsti
    }
};

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
