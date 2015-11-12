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
     * Initialize the coprocessor to match the requested model.
     *
     * NOTE: Technically, the FPU's internal registers are 80-bit, but all JavaScript gives us are 64-bit floats.
     */
    this.aFPUEmpty = new Array(8);
    this.aFPURegs = new Float64Array(8);

    this.regFPUTmpSR = new Float32Array(1);
    this.intFPUTmpSR = new Int32Array(this.regFPUTmpSR.buffer);

    this.regFPUTmpLR = new Float64Array(1);
    this.intFPUTmpLR = new Int32Array(this.regFPUTmpLR.buffer);

    this.regFPUInsAddr = this.regFPUDataAddr = this.regFPUOpcode = 0;

    this.resetFPU();
}

Component.subclass(X86FPU);

/*
 * Operand types:
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
    this.setReady();
};

/**
 * resetFPU()
 *
 * @this {X86FPU}
 */
X86FPU.prototype.resetFPU = function()
{
    for (var i = 0; i < this.aFPUEmpty.length; i++) this.aFPUEmpty[i] = true;
    this.regFPUControl = X86.FPU.CONTROL.IM | X86.FPU.CONTROL.DM | X86.FPU.CONTROL.ZM | X86.FPU.CONTROL.OM | X86.FPU.CONTROL.UM | X86.FPU.CONTROL.PM | X86.FPU.CONTROL.IEM | X86.FPU.CONTROL.PC;
    this.regFPUStatus = 0;
    this.iFPUReg = 0;                   // copy of the ST bits in regFPUStatus
};

/**
 * setFPUTmpSRFromEA()
 *
 * Sets the internal regFPUTmpSR register to the (32-bit) short-real value located at regEA.
 *
 * @this {X86FPU}
 */
X86FPU.prototype.setFPUTmpSRFromEA = function()
{
    this.intFPUTmpSR[0] = this.cpu.getLong(this.cpu.regEA);
};

/**
 * fnFPU(bOpcode, bModRM, dst, src)
 *
 * @this {X86FPU}
 * @param {number} bOpcode (0xD8-0xDF)
 * @param {number} bModRM
 * @param {number} dst
 * @param {number} src
 */
X86FPU.prototype.fnFPU = function(bOpcode, bModRM, dst, src)
{
    this.regFPUOpcode = bOpcode;
    this.regFPUInsAddr = this.cpu.regLIP;
    this.regFPUDataAddr = this.cpu.regEA;

    this.println("FPU(" + str.toHexByte(bOpcode) + "," + str.toHexByte(bModRM) + ")");

    var mod = (bModRM >> 6) & 0x3;
    var reg = (bModRM >> 3) & 0x7;
    var r_m = (bModRM & 0x7);

    /*
     * Combine mod and reg into one decodable value: put mod in the high nibble
     * and reg in the low nibble, after first collapsing all mod values < 3 to zero.
     */
    var modReg = (mod < 3? 0 : 0x30) + reg;

    switch(bOpcode) {

    case X86.OPCODE.ESC0:
        switch(modReg) {
        case 0x00:
            this.fnFADDsr();                // ST=ST+[short-real]
            break;
        case 0x30:
            this.fnFADDi(r_m);              // ST=ST+ST(i)
            break;
        case 0x31:
            this.fnFMULi(r_m);              // ST=ST*ST(i)
            break;
        case 0x32:
         // this.fnFCOMi(r_m);
            break;
        case 0x33:
         // this.fnFCOMPi(r_m);
            break;
        case 0x34:
         // this.fnFSUBi(r_m);              // ST=ST-ST(i)
            break;
        case 0x35:
         // this.fnFSUBRi(r_m);             // ST=ST-ST(i)
            break;
        case 0x36:
         // this.fnFDIVi(r_m);              // ST=ST/ST(i)
            break;
        case 0x37:
         // this.fnFDIVRi(r_m);             // ST=ST/ST(i)
            break;
        }
        break;

    case X86.OPCODE.ESC3:
        switch(modReg) {
        case 0x34:
            switch(r_m) {
            case 0:
             // this.fnFENI();
                break;
            case 1:
             // this.fnFDISI;
                break;
            case 2:
             // this.fnFCLEX();
                break;
            case 3:
                this.fnFINIT();
                break;
            }
            break;
        }
        break;
    }
};

/**
 * fnFINIT()
 *
 * @this {X86FPU}
 */
X86FPU.prototype.fnFINIT = function()
{
    this.resetFPU();
};

/**
 * fnFADDi()
 *
 * @this {X86FPU}
 * @param {number} i
 */
X86FPU.prototype.fnFADDi = function(i)
{
    this.aFPURegs[this.iFPUReg] += this.aFPURegs[i];
};

/**
 * fnFMULi()
 *
 * @this {X86FPU}
 * @param {number} i
 */
X86FPU.prototype.fnFMULi = function(i)
{
    this.aFPURegs[this.iFPUReg] *= this.aFPURegs[i];
};

/**
 * fnFADDsr()
 *
 * @this {X86FPU}
 */
X86FPU.prototype.fnFADDsr = function()
{
    this.setFPUTmpSRFromEA();
    this.aFPURegs[this.iFPUReg] += this.regFPUTmpSR[0];
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
