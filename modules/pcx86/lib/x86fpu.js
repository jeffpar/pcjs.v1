/**
 * @fileoverview Implements PCx86 8087 FPU logic.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
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
 * You are required to include the above copyright notice in every modified copy of this work
 * and to display that copyright notice when the software starts running; see COPYRIGHT in
 * <http://pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 *
 * FPU instruction description excerpts from the PC Magazine "Programmer's Technical Reference:
 * The Processor and Coprocessor," Copyright 1992 by Ziff-Davis Press (ISBN 1-56276-016-5).
 */

"use strict";

if (NODE) {
    var Str         = require("../../shared/lib/strlib");
    var Web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var State       = require("../../shared/lib/state");
    var PCX86       = require("./defines");
    var X86         = require("./x86");
}

/*
 * Operand Type Reference
 *
 *      ST(0), ST           stack top; the register currently at the top of the stack
 *      ST(i)               register in the stack i (0<=i<=7) stack elements from the top
 *      SR (short-real)     short real (32 bits) number in memory; exponent bias is 127 (0x7f)
 *      LR (long-real)      long real (64 bits) number in memory; exponent bias is 1023 (0x3ff)
 *      TR (temp-real)      temporary real (80 bits) number in memory; exponent bias is 16383 (0x3fff)
 *      PD (packed-decimal) packed decimal integer (18 digits, 10 bytes) in memory
 *      WI (word-integer)   word binary integer (16 bits) in memory
 *      SI (short-integer)  short binary integer (32 bits) in memory
 *      LI (long-integer)   long binary integer (64 bits) in memory
 *      NN (nn-bytes)       memory area nn bytes long
 *
 * FPU Coprocessor Trivia
 *
 *      Microsoft C 4.00 libraries executed software interrupts in the range 0x34-0x3B immediately after
 *      FPU operations, to assist with floating-point emulation when no coprocessor was present, since
 *      processors prior to the 80286 had no mechanism for generating a fault when an unsupported FPU
 *      instruction was executed.
 *
 *      In short, INT 0x34 through INT 0x3B was used after ESC opcodes 0xD8 through 0xDF, INT 0x3C was
 *      used for FPU instructions containing a segment override, and INT 0x3D was used for FWAIT.
 *
 *      A sample piece of code is available in x86ops.js, because it also highlights the Microsoft C 4.00
 *      library's dependency on the 8086/8088 behavior of "PUSH SP" (see the opPUSHSP_8086() function).
 */

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class X86FPU extends Component {
    /**
     * X86FPU(parmsFPU)
     *
     * The X86FPU class uses the following (parmsFPU) properties:
     *
     *      model: a number (eg, 8087) that should match one of the X86.FPU.MODEL values (default is 8087)
     *      stepping: a string (eg, "B1") that should match one of the X86.FPU.STEPPING values (default is "")
     *
     * @this {X86FPU}
     * @param {Object} parmsFPU
     */
    constructor(parmsFPU)
    {
        super("FPU", parmsFPU);

        this.model = parmsFPU['model'] || X86.FPU.MODEL_8087;

        /*
         * We take the 'stepping' value, convert it to a hex value, and then add that to the model to provide
         * a single value that's unique for any given CPU stepping.  If no stepping is provided, then stepping
         * is equal to model.
         */
        var stepping = parmsFPU['stepping'];
        this.stepping = this.model + (stepping? Str.parseInt(stepping, 16) : 0);

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
         * Used for "long-real" (LR) 64-bit floating-point operations.  We also use intTmpLR as temporary storage
         * for all "word-integer" (WI or INT16), "short-integer" (SI or INT32) and "long-integer" (LI or INT64) values,
         * since it's just large enough to accommodate all three integer sizes.
         */
        this.regTmpLR = new Float64Array(1);
        this.intTmpLR = new Int32Array(this.regTmpLR.buffer);

        /*
         * Used for conversion to/from the 80-bit "temp-real" (TR) format; used as three 32-bit integers,
         * where [0] contains TR bits 0-31, [1] contains TR bits 32-63, and [2] contains TR bits 64-79; the
         * upper 16 bits of [2] are not used and should remain zero.
         */
        this.intTmpTR = new Array(3);

        /*
         * Initialize other (non-floating-point) coprocessor registers that resetFPU() doesn't touch,
         * such as the "exception" registers: regCodeSel, regCodeOff, regDataSel, regDataOff, and regOpcode.
         *
         * Note that regCodeSel and regDataSel are NEVER set in real-mode and are ALWAYS set in protected-mode,
         * so we set them to -1 in their "unset" state; if those values ever show up in an exception block,
         * something may have gone amiss (it's not impossible though, because if an exception occurs before any
         * memory operands have been used, regDataSel may still be "unset").
         *
         * NOTE: iStack is the low 3 bits of the bModRM byte, for instructions that have an explicit stack operand.
         */
        this.regCodeSel = this.regDataSel = -1;
        this.regCodeOff = this.regDataOff = this.regOpcode = this.iStack = 0;

        /*
         * Initialize special floating-point constants, as if they were internal read-only registers;
         * all other simple (non-special) constants are "statically" initialized below, as class constants.
         */
        this.regIndefinite = new Float64Array(1);
        this.intIndefinite = new Int32Array(this.regIndefinite.buffer);
        this.intIndefinite[0] = 0x00000000; this.intIndefinite[1] = 0xFFF8000;

        /*
         * Initialize all other coprocessor registers (control word, tag word, status word, etc) by resetting them.
         */
        this.resetFPU();
        /**
         * setEAFromSR()
         *
         * Stores the (32-bit) "short-real" value in the internal regTmpSR register to the address in regEA.
         *
         * @this {X86FPU}
         */
        this.setEAFromSR = X86FPU.prototype.setEAFromSI;
        /**
         * setEAFromLR()
         *
         * Stores the (64-bit) "long-real" value in the internal regTmpLR register to the address in regEA.
         *
         * @this {X86FPU}
         */
        this.setEAFromLR = X86FPU.prototype.setEAFromLI;
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {X86FPU}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {X86CPU} cpu
     * @param {DebuggerX86} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.cpu = cpu;
        this.chipset = cmp.getMachineComponent("ChipSet");
        this.setReady();
    }

    /**
     * clearBusy()
     *
     * The ChipSet calls us whenever an I/O operation that clears the coprocessor's "busy" state is performed.
     *
     * @this {X86FPU}
     */
    clearBusy()
    {
        /*
         * We're never "busy" as far as other components are concerned, because we perform all FPU operations
         * synchronously, so there's nothing to do here.
         */
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {X86FPU}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {
            if (!data || !this.restore) {
                this.resetFPU();
            } else {
                if (!this.restore(data)) return false;
            }
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {X86FPU}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        return fSave? this.save() : true;
    }

    /**
     * save()
     *
     * This implements save support for the X86FPU component.
     *
     * @this {X86FPU}
     * @return {Object}
     */
    save()
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
    }

    /**
     * restore(data)
     *
     * This implements restore support for the X86FPU component.
     *
     * @this {X86FPU}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        var a = data[0], i = 0;
        this.setControl(a[i++]);
        this.setStatus(a[i++]);
        this.setTags(a[i++]);
        for (var iReg = 0; iReg < this.regStack.length; iReg++) {
            this.regStack[iReg] = a[i++];
        }
        return true;
    }

    /**
     * resetFPU()
     *
     * Aside from calling this internally (eg, during initialization and FINIT operations), the ChipSet may also call
     * us whenever an I/O operation that resets the coprocessor is performed.  Only 80487 coprocessors and higher will
     * also clear the "exception" registers, but the 80487 is currently beyond my planned level of support.
     *
     * TODO: Add support for X86.FPU.CONTROL.PC (Precision Control) and X86.FPU.CONTROL.IC (Infinity Control)
     *
     * @this {X86FPU}
     */
    resetFPU()
    {
        this.regUsed = 0;           // bits 0-7 are set as regs 0-7 are used
        this.regControl = X86.FPU.CONTROL.INIT;
        this.regStatus = 0;         // contains all status register bits EXCEPT for ST
        this.iST = 0;               // the ST bits for regStatus are actually stored here
        if (DEBUG) {
            /*
             * All the registers were tagged "unused" above, which is all that would normally happen, but debugging is
             * a little easier if we zero all the registers as well.
             */
            for (var iReg = 0; iReg < this.regStack.length; iReg++) {
                this.regStack[iReg] = 0.0;
            }
        }
        if (this.chipset) this.chipset.clearFPUInterrupt();
    }

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
    isModel(model)
    {
        return this.model == model;
    }

    /**
     * isAtLeastModel(model)
     *
     * If the current model is greater than or equal to the specified model, then it's assumed that the
     * current operation is supported, and we return true.
     *
     * @this {X86FPU}
     * @param {number} model
     * @return {boolean}
     */
    isAtLeastModel(model)
    {
        return this.model >= model;
    }

    /**
     * opStop(fError)
     *
     * Place this inside any opcode handler to stop the CPU from running the current instruction; eg:
     *
     *      if (this.opStop()) return;
     *
     * You can still use the Debugger to single-step over the instruction; opStop() will return false in that case.
     *
     * @this {X86FPU}
     * @param {boolean} [fError]
     * @return {boolean} (true if there was an error or the CPU was running, false if not)
     */
    opStop(fError)
    {
        if (DEBUG) {
            var cpu = this.cpu;
            if (fError || cpu.isRunning()) {
                cpu.setIP(cpu.opLIP - cpu.segCS.base);
                cpu.stopCPU();
                return true;
            }
        }
        return false;
    }

    /**
     * opNone()
     *
     * Used for any coprocessor opcode that has no known operation for the given model.
     *
     * @this {X86FPU}
     */
    opNone()
    {
        if (DEBUG) this.println(this.idComponent + ".opNone(" + Str.toHexByte(this.cpu.bOpcode) + "," + Str.toHexByte(this.cpu.bModRM) + ")");
        this.opStop(true);
    }

    /**
     * opObsolete()
     *
     * Used for any coprocessor opcodes that are redundant and potentially obsolete.
     *
     * @this {X86FPU}
     */
    opObsolete()
    {
        if (DEBUG) this.println(this.idComponent + ".opObsolete(" + Str.toHexByte(this.cpu.bOpcode) + "," + Str.toHexByte(this.cpu.bModRM) + ")");
        this.opStop(true);
    }

    /**
     * opUnimplemented()
     *
     * Used for any coprocessor opcode that DOES have a known operation, we just haven't implemented it yet.
     *
     * @this {X86FPU}
     */
    opUnimplemented()
    {
        if (DEBUG) this.println(this.idComponent + ".opUnimplemented(" + Str.toHexByte(this.cpu.bOpcode) + "," + Str.toHexByte(this.cpu.bModRM) + ")");
        this.opStop(true);
    }

    /**
     * checkException()
     *
     * @this {X86FPU}
     * @return {boolean} (true if unmasked exception exists, false if not)
     */
    checkException()
    {
        this.regStatus &= ~X86.FPU.STATUS.ES;
        /*
         * NOTE: The "Stack Fault" (SF) status bit wasn't introduced until the 80387, so it triggers the pre-existing
         * "Invalid Operation" (IE) exception; there is no corresponding "Stack Fault" (SE) exception, and the matching
         * control bit is still reserved.  Consequently, X86.FPU.CONTROL.EXC is a *subset* of X86.FPU.STATUS.EXC (0x3F
         * instead of 0x7F).
         *
         * However, we shouldn't have to do anything special when SF is set, because any setException() call that sets
         * SF should ALSO set IE.
         */
        if (this.regStatus & (~this.regControl & X86.FPU.CONTROL.EXC)) {
            this.regStatus |= X86.FPU.STATUS.ES;    // set ES whenever one or more unmasked EXC bits are set
        }
        if ((this.regStatus & X86.FPU.STATUS.ES) && !(this.regControl & X86.FPU.CONTROL.IEM)) {
            this.chipset.setFPUInterrupt();
            return true;
        }
        this.chipset.clearFPUInterrupt();
        return false;
    }

    /**
     * setException(n)
     *
     * Sets one or more of the FPU.STATUS.ECX bits; ie:
     *
     *      IE (0x0001 bit 0: Invalid Operation)
     *      DE (0x0002 bit 1: Denormalized Operand)
     *      ZE (0x0004 bit 2: Zero Divide)
     *      OE (0x0008 bit 3: Overflow)
     *      UE (0x0010 bit 4: Underflow)
     *      PE (0x0020 bit 5: Precision)
     *      SF (0x0040 bit 6: Stack Fault; 80387 and later)
     *
     * Also, as noted in checkException(), any time you set the SF bit, you should also set the IE bit, because
     * Stack Fault is a subset of Invalid Operation.  TODO: We should include a test for that in the assertion below.
     *
     * @this {X86FPU}
     * @param {number} n (one or more of the above error status bits)
     * @return {boolean} (true if unmasked exception exists, false if not)
     */
    setException(n)
    {
        if (DEBUG) this.println(this.idComponent + ".setException(" + Str.toHexWord(n) + ")");

        if (!this.isAtLeastModel(X86.FPU.MODEL_80387)) {
            n &= ~X86.FPU.STATUS.SF;                // the SF bit didn't exist on pre-80387 coprocessors
        }
        this.assert(!(n & ~X86.FPU.STATUS.EXC));    // make sure the caller isn't setting any non-EXC bits
        this.regStatus |= n;
        return this.checkException();
    }

    /**
     * getControl()
     *
     * @this {X86FPU}
     * @return {number}
     */
    getControl()
    {
        return this.regControl;
    }

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
    setControl(n)
    {
        this.regControl = n & ~X86.FPU.CONTROL.UNUSED;
    }

    /**
     * clearStatus(n)
     *
     * @this {X86FPU}
     * @param {number} n
     */
    clearStatus(n)
    {
        this.regStatus &= ~n;
        this.checkException();
    }

    /**
     * getStatus()
     *
     * @this {X86FPU}
     * @return {number} regStatus merged with iST
     */
    getStatus()
    {
        /*
         * As long as we never store any ST bits in regStatus, they should always be zero, so in
         * order to return the complete regStatus, all we need to do is shift and "or" the bits from iST.
         */
        return this.regStatus | (this.iST << X86.FPU.STATUS.ST_SHIFT);
    }

    /**
     * setStatus(n)
     *
     * NOTE: Be sure to use this function for all "wholesale" regStatus updates, because it ensures that
     * the ST bits get propagated to the internal iST register.  Setting individual EXC bits should be done
     * through the fault() interface, and clearing individual EXC or BUSY bits should be done through
     * clearStatus().  Both functions, including this function, call checkException() after updating regStatus.
     *
     * @this {X86FPU}
     * @param {number} n
     */
    setStatus(n)
    {
        this.regStatus = n & ~X86.FPU.STATUS.ST;
        this.iST = (n & X86.FPU.STATUS.ST) >> X86.FPU.STATUS.ST_SHIFT;
        this.checkException();
    }

    /**
     * checkOperand(v)
     *
     * @this {X86FPU}
     * @param {number|null} v
     * @return {boolean} (true if no exception, false otherwise)
     */
    checkOperand(v)
    {
        return isNaN(v)? !this.setException(X86.FPU.STATUS.IE) : true;
    }

    /**
     * checkResult(v)
     *
     * @this {X86FPU}
     * @param {number} v
     * @return {boolean} (true if no exception, false otherwise)
     */
    checkResult(v)
    {
        return !isFinite(v)? !this.setException(v === Infinity? X86.FPU.STATUS.OE : X86.FPU.STATUS.UE) : true;
    }

    /**
     * doAdd(operand1, operand2)
     *
     * @this {X86FPU}
     * @param {number|null} operand1
     * @param {number|null} operand2
     * @return {number|null}
     */
    doAdd(operand1, operand2)
    {
        var result = null;
        if (operand1 != null && operand2 != null) {
            result = operand1 + operand2;
            if (!this.checkResult(result)) result = null;
        }
        return result;
    }

    /**
     * doSubtract(operand1, operand2)
     *
     * @this {X86FPU}
     * @param {number|null} operand1
     * @param {number|null} operand2
     * @return {number|null}
     */
    doSubtract(operand1, operand2)
    {
        var result = null;
        if (operand1 != null && operand2 != null) {
            result = operand1 - operand2;
            if (!this.checkResult(result)) result = null;
        }
        return result;
    }

    /**
     * doMultiply(operand1, operand2)
     *
     * @this {X86FPU}
     * @param {number|null} operand1
     * @param {number|null} operand2
     * @return {number|null}
     */
    doMultiply(operand1, operand2)
    {
        var result = null;
        if (operand1 != null && operand2 != null) {
            result = operand1 * operand2;
            if (!this.checkResult(result)) result = null;
        }
        return result;
    }

    /**
     * doDivide(dividend, divisor)
     *
     * TODO: IE exceptions: infinity / infinity, 0 / 0, 0 / pseudo-zero, or divisor is denormal or unnormal.
     *
     * @this {X86FPU}
     * @param {number|null} dividend
     * @param {number|null} divisor
     * @return {number|null}
     */
    doDivide(dividend, divisor)
    {
        var quotient = null;
        if (dividend != null && divisor != null) {
            if (divisor || !this.setException(X86.FPU.STATUS.DE)) {
                quotient = dividend / divisor;
                if (!this.checkResult(quotient)) quotient = null;
            }
        }
        return quotient;
    }

    /**
     * doCompare(operand1, operand2)
     *
     * @this {X86FPU}
     * @param {number|null} operand1
     * @param {number|null} operand2
     * @return {boolean}
     */
    doCompare(operand1, operand2)
    {
        if (operand1 != null && operand2 != null) {
            var cc = 0;             // default value used when result > 0
            if (!isNaN(operand1) && !isNaN(operand2)) {
                var result = operand1 - operand2;
                if (result < 0) {
                    cc = X86.FPU.STATUS.C0;
                } else if (result === 0) {
                    cc = X86.FPU.STATUS.C3;
                }
            } else {
                cc = X86.FPU.STATUS.C0 | X86.FPU.STATUS.C2 | X86.FPU.STATUS.C3;
            }
            this.regStatus = (this.regStatus & ~X86.FPU.STATUS.CC) | cc;
            return true;
        }
        return false;
    }

    /**
     * doSquareRoot(operand)
     *
     * @this {X86FPU}
     * @param {number|null} operand
     * @return {number|null}
     */
    doSquareRoot(operand)
    {
        var result = null;
        /*
         * Happily, -0 is ALSO >= 0.  Also happily, Math.sqrt(-0) returns -0.
         */
        if (operand >= 0 || !this.setException(X86.FPU.STATUS.IE)) {
            result = Math.sqrt(operand);
            if (!this.checkResult(result)) result = null;
        }
        return result;
    }

    /**
     * roundValue(operand, max)
     *
     * NOTE: The max parameter is EXCLUSIVE, not inclusive (ie, the maximum positive value is < max).
     *
     * Also, callers that expect intTmpLR[] to be loaded with the result *must* also specify a max parameter;
     * callers performing internal rounding and using just the return value may omit max to skip loading intTmpLR[].
     *
     * @this {X86FPU}
     * @param {number|null} operand
     * @param {number} [max] (ie, 0x8000, 0x80000000, or 0x8000000000000000)
     * @return {number|null} (rounded result, or null if there was an unmasked exception)
     */
    roundValue(operand, max)
    {
        if (operand == null) return null;

        var rc = (this.regControl & X86.FPU.CONTROL.RC.MASK), result;

        if (rc == X86.FPU.CONTROL.RC.NEAR) {
            result = Math.round(operand);
            if (result - operand === 0.5 && (result % 2)) result--;
        }
        else if (rc == X86.FPU.CONTROL.RC.DOWN || rc == X86.FPU.CONTROL.RC.CHOP && operand > 0) {
            result = Math.floor(operand);
        }
        else {  // X86.FPU.CONTROL.RC.UP or X86.FPU.CONTROL.RC.CHOP && operand <= 0
            result = Math.ceil(operand);
        }

        if (max) {
            if (result >= max) {
                if (this.setException(X86.FPU.STATUS.IE)) return null;
                result = -max;      // apparently, the masked response is to return the most negative integer (not max - 1)
            }
            else if (result < -max) {
                if (this.setException(X86.FPU.STATUS.IE)) return null;
                result = -max;
            }
            this.intTmpLR[0] = result|0;
            if (max > X86FPU.MAX_INT32) {
                this.intTmpLR[1] = (result / 0x100000000)|0;
                if (!this.intTmpLR[1] && result < 0) this.intTmpLR[1] = -1;
            }
        }
        return result;
    }

    /**
     * truncateValue(v)
     *
     * @this {X86FPU}
     * @param {number} v
     * @return {number}
     */
    truncateValue(v)
    {
        return v > 0? Math.floor(v) : Math.ceil(v);
    }

    /**
     * getTag(iReg)
     *
     * @this {X86FPU}
     * @param {number} iReg (register index)
     * @return {number} tag value for register
     */
    getTag(iReg)
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
    }

    /**
     * getTags()
     *
     * @this {X86FPU}
     * @return {number} tag values for all registers
     */
    getTags()
    {
        var tags = 0;
        for (var iReg = this.regStack.length - 1; iReg >= 0; iReg--) {
            tags <<= 2;
            tags |= this.getTag(iReg);
        }
        return tags;
    }

    /**
     * setTag(iReg, tag)
     *
     * @this {X86FPU}
     * @param {number} iReg (register index)
     * @param {number} tag value for register (EMPTY is the only supported value)
     */
    setTag(iReg, tag)
    {
        this.assert(!(iReg & ~0x7) && tag == X86.FPU.TAGS.EMPTY);
        this.regUsed &= ~(1 << iReg);
    }

    /**
     * setTags(n)
     *
     * All we need to update here are which physical registers are marked "empty"; the rest of the tags
     * are generated on the fly based on actual values in the registers.
     *
     * @this {X86FPU}
     * @param {number} n (16-bit tag word, containing 8 2-bit tags)
     */
    setTags(n)
    {
        this.regUsed = 0;
        for (var bitUsed = 0x1; bitUsed <= 0x80; bitUsed <<= 1) {
            var tag = n & X86.FPU.TAGS.MASK;
            if (tag != X86.FPU.TAGS.EMPTY) {
                this.regUsed |= bitUsed;
            }
            n >>= 2;
        }
    }

    /**
     * getWI(i)
     *
     * Gets a "word-integer" (WI aka INT16) from ST(i)
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @return {boolean} true if intTmpLR was loaded, false if not
     */
    getWI(i)
    {
        return this.roundValue(this.getST(i), X86FPU.MAX_INT16) != null;
    }

    /**
     * getSI(i)
     *
     * Gets a "short-integer" (SI aka INT32) from ST(i)
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @return {boolean} true if intTmpLR was loaded, false if not
     */
    getSI(i)
    {
        return this.roundValue(this.getST(i), X86FPU.MAX_INT32) != null;
    }

    /**
     * getLI(i)
     *
     * Gets a "long-integer" (LI aka INT64) from ST(i)
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @return {boolean} true if intTmpLR was loaded, false if not
     */
    getLI(i)
    {
        return this.roundValue(this.getST(i), X86FPU.MAX_INT64) != null;
    }

    /**
     * getSR(i)
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @return {boolean} true if regTmpSR was loaded, false if not
     */
    getSR(i)
    {
        var iReg = (this.iST + i) & 7;
        if (this.regUsed & (1 << iReg)) {
            this.regTmpSR[0] = this.regStack[iReg];
            return true;
        } else if (!this.setException(X86.FPU.STATUS.IE)) {
            this.regTmpSR[0] = this.regIndefinite[0];
            return true;
        }
        return false;
    }

    /**
     * getLR(i)
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @return {boolean} true if regTmpLR was loaded, false if not
     */
    getLR(i)
    {
        var iReg = (this.iST + i) & 7;
        if (this.regUsed & (1 << iReg)) {
            this.regTmpLR[0] = this.regStack[iReg];
            return true;
        } else if (!this.setException(X86.FPU.STATUS.IE)) {
            this.regTmpLR[0] = this.regIndefinite[0];
            return true;
        }
        return false;
    }

    /**
     * getST(i)
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @return {number|null} v
     */
    getST(i)
    {
        var v = null;
        var iReg = (this.iST + i) & 7;
        if (this.regUsed & (1 << iReg)) {
            v = this.regStack[iReg];
        } else if (!this.setException(X86.FPU.STATUS.IE)) {
            v = this.regIndefinite[0];
        }
        return v;
    }

    /**
     * getSTSign(i)
     *
     * Returns zero if sign bit clear, and non-zero (negative) if sign bit set.  This is safer
     * than comparing getST() to zero, because JavaScript comparisons involving NaNs are meaningless.
     *
     * For internal use only; ignores whether the register is empty, and performs no exception checks.
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @return {number}
     */
    getSTSign(i)
    {
        var iInt = ((this.iST + i) & 7) << 1;
        return this.intStack[iInt + 1] & (0x80000000|0);
    }

    /**
     * setST(i, v)
     *
     * @this {X86FPU}
     * @param {number} i (eg, 0 for top-of-stack)
     * @param {number|null} v
     * @return {boolean}
     */
    setST(i, v)
    {
        if (v != null && this.checkOperand(v)) {
            var iReg = (this.iST + i) & 7;
            this.regStack[iReg] = v;
            this.regUsed |= (1 << iReg);
            return true;
        }
        return false;
    }

    /**
     * getTR(i, fSafe)
     *
     * @this {X86FPU}
     * @param {number} i (stack index, 0-7)
     * @param {boolean} [fSafe] (true to ignore all exception criteria; used by FSAVE)
     * @return {Array.<number>|null} ("temp-real" aka TR, as an array of three 32-bit integers)
     */
    getTR(i, fSafe)
    {
        var a = null;
        var iReg = (this.iST + i) & 7;
        if (fSafe || this.regUsed & (1 << iReg) || !this.setException(X86.FPU.STATUS.IE)) {
            var iInt = iReg << 1;
            a = this.getTRFromLR(this.intStack[iInt], this.intStack[iInt + 1]);
        }
        return a;
    }

    /**
     * setTR(i, a)
     *
     * Sets ST(i) to the TR ("long-real") in a[].
     *
     * @this {X86FPU}
     * @param {number} i (stack index, 0-7)
     * @param {Array.<number>|null} a
     */
    setTR(i, a)
    {
        if (a) this.setST(i, this.getLRFromTR(a));
    }

    /**
     * getWIFromEA()
     *
     * Returns the (16-bit) "word-integer" value located at regEA.
     *
     * @this {X86FPU}
     * @return {number} v
     */
    getWIFromEA()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        return (this.cpu.getShort(this.cpu.regEA) << 16) >> 16;
    }

    /**
     * getSIFromEA()
     *
     * Returns the (32-bit) "short-integer" value located at regEA.
     *
     * @this {X86FPU}
     * @return {number} v
     */
    getSIFromEA()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        return this.cpu.getLong(this.cpu.regEA);
    }

    /**
     * getLIFromEA()
     *
     * Returns the (64-bit) "long-integer" value located at regEA.
     *
     * @this {X86FPU}
     * @return {number} v
     */
    getLIFromEA()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        var lo = this.cpu.getLong(this.cpu.regEA);
        var hi = this.cpu.getLong(this.cpu.regEA + 4);
        return (hi * 0x100000000) + (lo >>> 0);
    }

    /**
     * getSRFromEA()
     *
     * Sets the internal regTmpSR register to the (32-bit) "short-real" value located at regEA.
     *
     * @this {X86FPU}
     * @return {number} v
     */
    getSRFromEA()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.intTmpSR[0] = this.cpu.getLong(this.cpu.regEA);
        return this.regTmpSR[0];
    }

    /**
     * getLRFromEA()
     *
     * Sets the internal regTmpLR register to the (64-bit) "long-real" value located at regEA.
     *
     * @this {X86FPU}
     * @return {number} v
     */
    getLRFromEA()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.intTmpLR[0] = this.cpu.getLong(this.cpu.regEA);
        this.intTmpLR[1] = this.cpu.getLong(this.cpu.regEA + 4);
        return this.regTmpLR[0];
    }

    /**
     * getTRFromEA()
     *
     * Sets the internal intTmpTR register to the (80-bit) "temp-real" value located at regEA.
     *
     * @this {X86FPU}
     * @return {Array.<number>} intTmpTR
     */
    getTRFromEA()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.intTmpTR[0] = this.cpu.getLong(this.cpu.regEA);
        this.intTmpTR[1] = this.cpu.getLong(this.cpu.regEA + 4);
        this.intTmpTR[2] = this.cpu.getShort(this.cpu.regEA + 8);
        return this.intTmpTR;
    }

    /**
     * setEAFromWI()
     *
     * Stores the (16-bit) "word-integer" value in the internal intTmpLR register to the address in regEA.
     *
     * @this {X86FPU}
     */
    setEAFromWI()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.cpu.setShort(this.cpu.regEA, this.intTmpLR[0]);
    }

    /**
     * setEAFromSI()
     *
     * Stores the (32-bit) "short-integer" value in the internal intTmpLR register to the address in regEA.
     *
     * @this {X86FPU}
     */
    setEAFromSI()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.cpu.setLong(this.cpu.regEA, this.intTmpLR[0]);
    }

    /**
     * setEAFromLI()
     *
     * Stores the (64-bit) "long-integer" value in the internal intTmpLR register to the address in regEA.
     *
     * @this {X86FPU}
     */
    setEAFromLI()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.cpu.setLong(this.cpu.regEA, this.intTmpLR[0]);
        this.cpu.setLong(this.cpu.regEA + 4, this.intTmpLR[1]);
    }

    /**
     * setEAFromTR()
     *
     * Stores the (80-bit) "temp-real" value in the internal intTmpTR register to the address in regEA.
     *
     * @this {X86FPU}
     */
    setEAFromTR()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.cpu.setLong(this.cpu.regEA, this.intTmpTR[0]);
        this.cpu.setLong(this.cpu.regEA + 4, this.intTmpTR[1]);
        this.cpu.setShort(this.cpu.regEA + 8, this.intTmpTR[2]);
    }

    /**
     * getLRFromTR(a)
     *
     * Since we must use the "long-real" (64-bit) format internally, rather than the "temp-real" (80-bit) format,
     * this function converts a 64-bit value to an 80-bit value.  The major differences: 1) the former uses a 52-bit
     * fraction and 11-bit exponent, while the latter uses a 64-bit fraction and 15-bit exponent; 2) the former
     * does NOT store a leading 1 with the fraction, whereas the latter does.
     *
     * @this {X86FPU}
     * @param {Array.<number>} a (eg, intTmpTR)
     * @return {number} v
     */
    getLRFromTR(a)
    {
        var loTR = a[0], hiTR = a[1];
        var signLR = (a[2] & 0x8000) >> 4, expLR = a[2] & 0x7fff;
        /*
         * We have no choice but to chop off the bottom 11 TR bits in order to fit in an LR....
         */
        var loLR = (loTR >>> 11) | (hiTR << 21), hiLR = (hiTR >> 11) & 0xfffff;

        if (expLR == 0x7fff) {
            /*
             * Convert an TR NaN to a LR NaN.
             */
            expLR = 0x7ff;
        }
        else if (expLR) {
            /*
             * We have a normal (biased) TR exponent which we must now convert to a (biased) LR exponent;
             * subtract the TR bias (0x3fff) and add the LR bias (0x3ff); additionally, we have a problem
             * that getTRFromLR() did not: if the TR exponent is too large to fit in an LR exponent, then we
             * have convert the result to +/- infinity.
             */
            expLR += 0x3ff - 0x3fff;
            if (expLR <= 0) {
                expLR = 0x7ff;
                loLR = hiLR = 0;
            }
        }

        this.intTmpLR[0] = loLR;
        this.intTmpLR[1] = hiLR | ((signLR | expLR) << 20);
        return this.regTmpLR[0];
    }

    /**
     * getTRFromLR(loLR, hiLR)
     *
     * Since we must use the "long-real" (64-bit) format internally, rather than the "temp-real" (80-bit) format,
     * this function converts a 64-bit value to an 80-bit value.  The major differences: 1) the former uses a 52-bit
     * fraction and 11-bit exponent, while the latter uses a 64-bit fraction and 15-bit exponent; 2) the former
     * does NOT store a leading 1 with the fraction, whereas the latter does.
     *
     * @this {X86FPU}
     * @param {number} loLR
     * @param {number} hiLR
     * @return {Array.<number>} (intTmpTR)
     */
    getTRFromLR(loLR, hiLR)
    {
        var expTR = (hiLR >> 20) & 0x07ff;
        var signTR = (hiLR >> 16) & 0x8000;
        var loTR = loLR << 11, hiTR = 0x80000000 | ((hiLR & 0x000fffff) << 11) | (loLR >>> 21);

        if (expTR == 0x07ff) {
            /*
             * Convert an LR NaN to a TR NaN.  NaNs encompass +/- infinity, which in the LR
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

        this.intTmpTR[0] = loTR;
        this.intTmpTR[1] = hiTR;
        this.intTmpTR[2] = signTR | expTR;
        return this.intTmpTR;
    }

    /**
     * decodeBCD()
     *
     * @this {X86FPU}
     * @param {number} i (32-bit integer containing n BCD digits)
     * @param {number} n (number of BCD digits to decode)
     * @return {number} (binary value representing the specified number of BCD digits)
     */
    decodeBCD(i, n)
    {
        var v = 0, m = 1;
        this.assert(n > 0 && n <= 8);
        while (n--) {
            var d = i & 0xf;
            this.assert(d <= 9);
            v += d * m;
            m *= 10;
            i >>= 4;
        }
        return v;
    }

    /**
     * encodeBCD()
     *
     * @this {X86FPU}
     * @param {number} v (binary value from which to extract n BCD digits)
     * @param {number} n (number of BCD digits to extract)
     * @return {number} (integer containing the requested number of BCD digits)
     */
    encodeBCD(v, n)
    {
        var i = 0, s = 0;
        this.assert(n > 0 && n <= 8);
        while (n--) {
            i |= (v % 10) << s;
            v /= 10;
            s += 4;
        }
        return i;
    }

    /**
     * popValue()
     *
     * @this {X86FPU}
     * @return {number|null} v
     */
    popValue()
    {
        var v = null;
        var bitUsed = (1 << this.iST);
        if (!(this.regUsed & bitUsed)) {
            this.regStatus &= ~X86.FPU.STATUS.C1;       // clear C1 to indicate stack underflow (80287XL and up)
            if (this.setException(X86.FPU.STATUS.SF | X86.FPU.STATUS.IE)) return v;
        }
        this.regUsed &= ~bitUsed;
        v = this.regStack[this.iST];
        this.iST = (this.iST + 1) & 7;
        return v;
    }

    /**
     * pushValue(v)
     *
     * @this {X86FPU}
     * @param {number|null} v
     */
    pushValue(v)
    {
        if (v == null) return;
        var iReg = (this.iST - 1) & 7;
        var bitUsed = (1 << iReg);
        if (this.regUsed & bitUsed) {
            this.regStatus |= X86.FPU.STATUS.C1;        // set C1 to indicate stack overflow (80287XL and up)
            if (this.setException(X86.FPU.STATUS.SF | X86.FPU.STATUS.IE)) return;
        }
        if (!this.checkOperand(v)) {
            if (this.setException(X86.FPU.STATUS.IE)) return;
            v = NaN;
        }
        this.regStack[this.iST = iReg] = v;
        this.regUsed |= bitUsed;
    }

    /**
     * loadEnv(addr)
     *
     * @this {X86FPU}
     * @param {number} addr
     * @return {number} updated addr
     */
    loadEnv(addr)
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
    }

    /**
     * saveEnv(addr)
     *
     * @this {X86FPU}
     * @param {number} addr
     * @return {number} updated addr
     */
    saveEnv(addr)
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
    }

    /**
     * opFPU(bOpcode, bModRM, dst, src)
     *
     * This is called by the CPU's ESC opcode handlers, after each instruction has been fully decoded.
     *
     * @this {X86FPU}
     * @param {number} bOpcode (0xD8-0xDF)
     * @param {number} bModRM
     * @param {number} dst
     * @param {number} src
     */
    opFPU(bOpcode, bModRM, dst, src)
    {
        var mod = (bModRM >> 6) & 3;
        var reg = (bModRM >> 3) & 7;
        this.iStack = (bModRM & 7);

        /*
         * Combine mod and reg into one decodable value: put mod in the high nibble
         * and reg in the low nibble, after first collapsing all mod values < 3 to zero.
         */
        var modReg = (mod < 3? 0 : 0x30) + reg;

        /*
         * All values >= 0x34 imply mod == 3 and reg >= 4, so now we shift reg into the high
         * nibble and iStack into the low, yielding values >= 0x40.
         */
        if ((bOpcode == X86.OPCODE.ESC1 || bOpcode == X86.OPCODE.ESC3) && modReg >= 0x34) {
            modReg = (reg << 4) | this.iStack;
        }

        var fnOp = X86FPU.aaOps[bOpcode][modReg];
        if (fnOp) {
            /*
             * A handful of FPU instructions must preserve (at least some of) the "exception" registers,
             * so if the current function is NOT one of those, then update all the "exception" registers.
             */
            if (X86FPU.afnPreserveExceptions.indexOf(fnOp) < 0) {
                var cpu = this.cpu;
                var off = cpu.opLIP;
                /*
                 * WARNING: opLIP points to any prefixes preceding the ESC instruction, but the 8087 always
                 * points to the ESC instruction.  Technically, that's a bug, but it's also a reality, so we
                 * check for preceding prefixes and bump the instruction pointer accordingly.  This isn't a
                 * perfect solution, because it doesn't account for multiple (redundant) prefixes, but it
                 * should be adequate.
                 */
                if (this.isModel(X86.FPU.MODEL_8087)) {
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
    }

    /**
     * opWAIT()
     *
     * This is called by the CPU's WAIT opcode handler, giving us the opportunity to synchronize the FPU with the CPU,
     * charge an appropriate number of cycles, and return true.  In this context, it's considered an FWAIT instruction,
     * but technically, it's the same opcode.
     *
     * If we choose to do nothing, then we must return false, so that the CPU can charge a default number of cycles.
     *
     * @this {X86FPU}
     * @return {boolean} true if implemented, false if not
     */
    opWAIT()
    {
        return false;
    }

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
     * Used by the Debugger for its floating-point register ("rfp") command.  For other FPU registers,
     * the Debugger calls getStatus() and getControl() directly.
     *
     * NOTE: The "temp-real" values are fake; we manufacture them on demand from 64-bit "long-real" values
     * actually stored in the stack; see getTRFromLR().
     *
     * @this {X86FPU}
     * @param {number} i (stack index, relative to ST)
     * @return {Array.<number>|null} (an array of information as described above, or null if invalid element)
     */
    readFPUStack(i)
    {
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
            var aTR = this.getTRFromLR(a[3], a[4]);
            a[5] = aTR[0]; a[6] = aTR[1]; a[7] = aTR[2];
        }
        return a;
    }

    /**
     * getRandomInt(min, max)
     *
     * Used with old test code to verify that any randomly-constructed "long-real" (REAL64) could be converted
     * to a "temp-real" (REAL80) and back again losslessly, otherwise a bug in either getTRFromLR() or getLRFromTR()
     * might exist.  That test code can be resurrected from the repo; this code is being retained for future tests.
     *
     * NOTE: If either min or max is a value containing 32 or more significant bits AND bit 31 is set AND it has passed
     * through some bitwise operation(s), then that value may end up being negative, so you may end up with an inverted
     * range, or a range that's smaller or larger than intended.
     *
     * @this {X86FPU}
     * @param {number} min (inclusive)
     * @param {number} max (inclusive)
     * @return {number}
     *
     getRandomInt(min, max)
     {
         max -= min;
         if (max < 0) {      // compensate for inverted ranges (ie, where min > max)
             min += max;
             max = -max;
         }
         return Math.floor(Math.random() * (max + 1)) + min;
     }
     */

    /**
     * F2XM1()
     *
     * F2XM1 (2 to the x minus 1) calculates the function 2^x - 1 and returns the result to ST(0).
     *
     * On the 8087 and 80287, the value in ST(0) must satisfy the inequality 0 <= ST(0) <= 0.5.  On the 80287XL and
     * later coprocessors, the permissible range is greater, and ST(0) must satisfy the inequality -1 <= ST(0) <= 1.
     * If ST(0) is out of range, the result is undefined, even though no exception is raised.
     *
     * The F2XM1 instruction is designed to provide an accurate result even when x is close to zero. To obtain 2^x,
     * simply add 1.0 to the result returned by F2XM1.
     *
     * This instruction is useful in performing exponentiation of values other than 2 as shown in the following formulas:
     *
     *      10^x = 2^(x * log2(10))
     *      e^x = 2^(x * log2(e))
     *      y^x = 2^(x * log2(y))
     *
     * Note that the NPX has dedicated instructions for loading the constants log2(10) and log2(e).  The FYL2X instruction
     * may be used to calculate x * log2(y).
     *
     * See also: FYL2X, FLDL2T, FLDL2E.
     *
     * @this {X86FPU}
     */
    static F2XM1()
    {
        this.setST(0, Math.pow(2, this.getST(0)) - 1);
    }

    /**
     * FABS()
     *
     * @this {X86FPU}
     */
    static FABS()
    {
        /*
         * TODO: This could be implemented more efficiently by simply clearing the sign bit of ST(0).
         */
        this.setST(0, Math.abs(this.getST(0)));
    }

    /**
     * FADDlr()
     *
     * @this {X86FPU}
     */
    static FADDlr()
    {
        this.setST(0, this.doAdd(this.getST(0), this.getLRFromEA()));
    }

    /**
     * FADDsr()
     *
     * Encoding 0xD8,reg=0x00 ("FADD short-real"): ST(0) <- ST(0) + REAL32
     *
     * @this {X86FPU}
     */
    static FADDsr()
    {
        this.setST(0, this.doAdd(this.getST(0), this.getSRFromEA()));
    }

    /**
     * FADDst()
     *
     * @this {X86FPU}
     */
    static FADDst()
    {
        this.setST(0, this.doAdd(this.getST(0), this.getST(this.iStack)));
    }

    /**
     * FADDsti()
     *
     * @this {X86FPU}
     */
    static FADDsti()
    {
        this.setST(this.iStack, this.doAdd(this.getST(this.iStack), this.getST(0)));
    }

    /**
     * FADDPsti()
     *
     * @this {X86FPU}
     */
    static FADDPsti()
    {
        if (this.setST(this.iStack, this.doAdd(this.getST(this.iStack), this.getST(0)))) this.popValue();
    }

    /**
     * FBLDpd()
     *
     * @this {X86FPU}
     */
    static FBLDpd()
    {
        var a = this.getTRFromEA();
        /*
         * a[0] contains the 8 least-significant BCD digits, a[1] contains the next 8, and a[2] contains
         * the next 2 (bit 15 of a[2] is the sign bit, and bits 8-14 of a[2] are unused).
         */
        var v = this.decodeBCD(a[0], 8) + this.decodeBCD(a[1], 8) * 100000000 + this.decodeBCD(a[2], 2) * 10000000000000000;
        if (a[2] & 0x8000) v = -v;
        this.pushValue(v);
    }

    /**
     * FBSTPpd()
     *
     * @this {X86FPU}
     */
    static FBSTPpd()
    {
        /*
         * TODO: Verify the operation of FBSTP (eg, does it signal an exception if abs(value) >= 1000000000000000000?)
         */
        var v = this.roundValue(this.popValue());
        if (v != null) {
            /*
             * intTmpTR[0] will contain the 8 least-significant BCD digits, intTmpTR[1] will contain the next 8,
             * and intTmpTR[2] will contain the next 2 (bit 15 of intTmpTR[2] will be the sign bit, and bits 8-14 of
             * intTmpTR[2] will be unused).
             */
            this.intTmpTR[0] = this.encodeBCD(v, 8);
            this.intTmpTR[1] = this.encodeBCD(v / 100000000, 8);
            this.intTmpTR[2] = this.encodeBCD(v / 10000000000000000, 2);
            if (v < 0) this.intTmpTR[2] |= 0x8000;
            this.setEAFromTR();
        }
    }

    /**
     * FCHS()
     *
     * @this {X86FPU}
     */
    static FCHS()
    {
        /*
         * TODO: This could be implemented more efficiently by simply inverting the sign bit of ST(0).
         */
        this.setST(0, -this.getST(0));
    }

    /**
     * FCLEX()
     *
     * NOTE: Although we explicitly clear the BUSY bit, there shouldn't be any code setting it, because
     * we're never "busy" (all floating-point operations are performed synchronously).  Conversely, there's
     * no need to explicitly clear the ES bit, because clearStatus() will call checkException(), which
     * updates ES and clears/sets FPU interrupt status as appropriate.
     *
     * @this {X86FPU}
     */
    static FCLEX()
    {
        this.clearStatus(X86.FPU.STATUS.EXC | X86.FPU.STATUS.BUSY);
    }

    /**
     * FCOMlr()
     *
     * Encoding 0xDC,mod<3,reg=2 ("FCOM long-real"): Evaluate ST(0) - REAL64
     *
     * @this {X86FPU}
     */
    static FCOMlr()
    {
        this.doCompare(this.getST(0), this.getLRFromEA());
    }

    /**
     * FCOMsr()
     *
     * Encoding 0xD8,mod<3,reg=2 ("FCOM short-real"): Evaluate ST(0) - REAL32
     *
     * @this {X86FPU}
     */
    static FCOMsr()
    {
        this.doCompare(this.getST(0), this.getSRFromEA());
    }

    /**
     * FCOMst()
     *
     * Encoding 0xD8,mod=3,reg=2 ("FCOM ST(i)"): Evaluate ST(0) - ST(i)
     *
     * @this {X86FPU}
     */
    static FCOMst()
    {
        this.doCompare(this.getST(0), this.getST(this.iStack));
    }

    /**
     * FCOM8087()
     *
     * NOTE: This is used with encoding(s) (0xDC,0xD0-0xD7) that were valid for the 8087 and 80287
     * but may no longer be valid as of the 80387.
     *
     * TODO: Determine if this form subtracted the operands in the same order, or if it requires an FCOMsti(),
     * which, like the other *sti() functions, uses ST(0) as the second operand rather than the first.
     *
     * @this {X86FPU}
     */
    static FCOM8087()
    {
        this.opObsolete();
        X86FPU.FCOMst.call(this);
    }

    /**
     * FCOMPlr()
     *
     * Encoding 0xDC,mod<3,reg=3 ("FCOM long-real"): Evaluate ST(0) - REAL64, POP
     *
     * @this {X86FPU}
     */
    static FCOMPlr()
    {
        if (this.doCompare(this.getST(0), this.getLRFromEA())) this.popValue();
    }

    /**
     * FCOMPsr()
     *
     * Encoding 0xD8,mod<3,reg=3 ("FCOM short-real"): Evaluate ST(0) - REAL32, POP
     *
     * @this {X86FPU}
     */
    static FCOMPsr()
    {
        if (this.doCompare(this.getST(0), this.getSRFromEA())) this.popValue();
    }

    /**
     * FCOMPst()
     *
     * Encoding 0xD8,mod=3,reg=3 ("FCOMP ST(i)"): Evaluate ST(0) - ST(i), POP
     *
     * @this {X86FPU}
     */
    static FCOMPst()
    {
        if (this.doCompare(this.getST(0), this.getST(this.iStack))) this.popValue();
    }

    /**
     * FCOMP8087()
     *
     * NOTE: This is used with encodings (0xDC,0xD8-0xDF and 0xDE,0xD0-0xD7) that were valid for the 8087
     * and 80287 but may no longer be valid as of the 80387.
     *
     * TODO: Determine if this form subtracted the operands in the same order, or if it requires an FCOMPsti(),
     * which, like the other *sti() functions, uses ST(0) as the second operand rather than the first.
     *
     * @this {X86FPU}
     */
    static FCOMP8087()
    {
        this.opObsolete();
        X86FPU.FCOMPst.call(this);
    }

    /**
     * FCOMPP()
     *
     * @this {X86FPU}
     */
    static FCOMPP()
    {
        if (this.doCompare(this.getST(0), this.getST(1)) && this.popValue() != null) this.popValue();
    }

    /**
     * FDECSTP()
     *
     * @this {X86FPU}
     */
    static FDECSTP()
    {
        this.iST = (this.iST - 1) & 0x7;
        this.regStatus &= ~X86.FPU.STATUS.C1;
    }

    /**
     * FDISI8087()
     *
     * @this {X86FPU}
     */
    static FDISI8087()
    {
        if (this.isModel(X86.FPU.MODEL_8087)) {
            this.regControl |= X86.FPU.CONTROL.IEM;
        }
    }

    /**
     * FDIVlr()
     *
     * @this {X86FPU}
     */
    static FDIVlr()
    {
        this.setST(0, this.doDivide(this.getST(0), this.getLRFromEA()));
    }

    /**
     * FDIVsr()
     *
     * @this {X86FPU}
     */
    static FDIVsr()
    {
        this.setST(0, this.doDivide(this.getST(0), this.getSRFromEA()));
    }

    /**
     * FDIVst()
     *
     * Encoding 0xD8,0xF0-0xF7 ("FDIV ST,ST(i)"): ST(0) <- ST(0) / ST(i)
     *
     * @this {X86FPU}
     */
    static FDIVst()
    {
        this.setST(0, this.doDivide(this.getST(0), this.getST(this.iStack)));
    }

    /**
     * FDIVsti()
     *
     * Encoding 0xDC,0xF8-0xFF ("FDIV ST(i),ST"): ST(i) <- ST(i) / ST(0)
     *
     * @this {X86FPU}
     */
    static FDIVsti()
    {
        this.setST(this.iStack, this.doDivide(this.getST(this.iStack), this.getST(0)));
    }

    /**
     * FDIVPsti()
     *
     * Encoding 0xDE,0xF8-0xFF ("FDIVP ST(i),ST"): ST(i) <- ST(i) / ST(0), POP
     *
     * @this {X86FPU}
     */
    static FDIVPsti()
    {
        if (this.setST(this.iStack, this.doDivide(this.getST(this.iStack), this.getST(0)))) this.popValue();
    }

    /**
     * FDIVRlr()
     *
     * @this {X86FPU}
     */
    static FDIVRlr()
    {
        this.setST(0, this.doDivide(this.getLRFromEA(), this.getST(0)));
    }

    /**
     * FDIVRsr()
     *
     * @this {X86FPU}
     */
    static FDIVRsr()
    {
        this.setST(0, this.doDivide(this.getSRFromEA(), this.getST(0)));
    }

    /**
     * FDIVRst()
     *
     * Encoding 0xD8,0xF8-0xFF ("FDIVR ST,ST(i)"): ST(0) <- ST(i) / ST(0)
     *
     * @this {X86FPU}
     */
    static FDIVRst()
    {
        this.setST(0, this.doDivide(this.getST(this.iStack), this.getST(0)));
    }

    /**
     * FDIVRsti()
     *
     * Encoding 0xDC,0xF0-0xF7 ("FDIVR ST(i),ST"): ST(i) <- ST(0) / ST(i)
     *
     * @this {X86FPU}
     */
    static FDIVRsti()
    {
        this.setST(this.iStack, this.doDivide(this.getST(0), this.getST(this.iStack)));
    }

    /**
     * FDIVRPsti()
     *
     * Encoding 0xDE,0xF0-0xE7 ("FDIVRP ST(i),ST"): ST(i) <- ST(0) / ST(i), POP
     *
     * @this {X86FPU}
     */
    static FDIVRPsti()
    {
        if (this.setST(this.iStack, this.doDivide(this.getST(0), this.getST(this.iStack)))) this.popValue();
    }

    /**
     * FENI8087()
     *
     * @this {X86FPU}
     */
    static FENI8087()
    {
        if (this.isModel(X86.FPU.MODEL_8087)) {
            this.regControl &= ~X86.FPU.CONTROL.IEM;
        }
    }

    /**
     * FFREEsti()
     *
     * @this {X86FPU}
     */
    static FFREEsti()
    {
        this.setTag(this.iST, X86.FPU.TAGS.EMPTY);
    }

    /**
     * FFREEP8087()
     *
     * NOTE: This is used with an encoding (0xDF,0xC0-0xC7) that was valid for the 8087 and 80287
     * but may no longer be valid as of the 80387.  Also, if the older documentation is to be believed,
     * this instruction has no modern counterpart, as FFREE doesn't pop the stack.
     *
     * @this {X86FPU}
     */
    static FFREEP8087()
    {
        this.opObsolete();
        X86FPU.FFREEsti.call(this);
        this.popValue();
    }

    /**
     * FIADD16()
     *
     * @this {X86FPU}
     */
    static FIADD16()
    {
        this.setST(0, this.doAdd(this.getST(0), this.getWIFromEA()));
    }

    /**
     * FIADD32()
     *
     * @this {X86FPU}
     */
    static FIADD32()
    {
        this.setST(0, this.doAdd(this.getST(0), this.getSIFromEA()));
    }

    /**
     * FICOM16()
     *
     * @this {X86FPU}
     */
    static FICOM16()
    {
        this.doCompare(this.getST(0), this.getWIFromEA());
    }

    /**
     * FICOM32()
     *
     * @this {X86FPU}
     */
    static FICOM32()
    {
        this.doCompare(this.getST(0), this.getSIFromEA());
    }

    /**
     * FICOMP16()
     *
     * @this {X86FPU}
     */
    static FICOMP16()
    {
        if (this.doCompare(this.getST(0), this.getWIFromEA())) this.popValue();
    }

    /**
     * FICOMP32()
     *
     * @this {X86FPU}
     */
    static FICOMP32()
    {
        if (this.doCompare(this.getST(0), this.getSIFromEA())) this.popValue();
    }

    /**
     * FIDIV16()
     *
     * @this {X86FPU}
     */
    static FIDIV16()
    {
        this.setST(0, this.doDivide(this.getST(0), this.getWIFromEA()));
    }

    /**
     * FIDIV32()
     *
     * @this {X86FPU}
     */
    static FIDIV32()
    {
        this.setST(0, this.doDivide(this.getST(0), this.getSIFromEA()));
    }

    /**
     * FIDIVR16()
     *
     * @this {X86FPU}
     */
    static FIDIVR16()
    {
        this.setST(0, this.doDivide(this.getWIFromEA(), this.getST(0)));
    }

    /**
     * FIDIVR32()
     *
     * @this {X86FPU}
     */
    static FIDIVR32()
    {
        this.setST(0, this.doDivide(this.getSIFromEA(), this.getST(0)));
    }

    /**
     * FILD16()
     *
     * @this {X86FPU}
     */
    static FILD16()
    {
        this.pushValue(this.getWIFromEA());
    }

    /**
     * FILD32()
     *
     * @this {X86FPU}
     */
    static FILD32()
    {
        this.pushValue(this.getSIFromEA());
    }

    /**
     * FILD64()
     *
     * @this {X86FPU}
     */
    static FILD64()
    {
        this.pushValue(this.getLIFromEA());
    }

    /**
     * FIMUL16()
     *
     * @this {X86FPU}
     */
    static FIMUL16()
    {
        this.setST(0, this.doMultiply(this.getST(0), this.getWIFromEA()));
    }

    /**
     * FIMUL32()
     *
     * @this {X86FPU}
     */
    static FIMUL32()
    {
        this.setST(0, this.doMultiply(this.getST(0), this.getSIFromEA()));
    }

    /**
     * FINCSTP()
     *
     * @this {X86FPU}
     */
    static FINCSTP()
    {
        this.iST = (this.iST + 1) & 0x7;
        this.regStatus &= ~X86.FPU.STATUS.C1;
    }

    /**
     * FINIT()
     *
     * @this {X86FPU}
     */
    static FINIT()
    {
        this.resetFPU();
    }

    /**
     * FIST16()
     *
     * @this {X86FPU}
     */
    static FIST16()
    {
        if (this.getWI(0)) this.setEAFromWI();
    }

    /**
     * FIST32()
     *
     * @this {X86FPU}
     */
    static FIST32()
    {
        if (this.getSI(0)) this.setEAFromSI();
    }

    /**
     * FISTP16()
     *
     * @this {X86FPU}
     */
    static FISTP16()
    {
        if (this.getWI(0)) {
            this.setEAFromWI();
            this.popValue();
        }
    }

    /**
     * FISTP32()
     *
     * @this {X86FPU}
     */
    static FISTP32()
    {
        if (this.getSI(0)) {
            this.setEAFromSI();
            this.popValue();
        }
    }

    /**
     * FISTP64()
     *
     * @this {X86FPU}
     */
    static FISTP64()
    {
        if (this.getLI(0)) {
            this.setEAFromLI();
            this.popValue();
        }
    }

    /**
     * FISUB16()
     *
     * @this {X86FPU}
     */
    static FISUB16()
    {
        this.setST(0, this.doSubtract(this.getST(0), this.getWIFromEA()));
    }

    /**
     * FISUB32()
     *
     * @this {X86FPU}
     */
    static FISUB32()
    {
        this.setST(0, this.doSubtract(this.getST(0), this.getSIFromEA()));
    }

    /**
     * FISUBR16()
     *
     * @this {X86FPU}
     */
    static FISUBR16()
    {
        this.setST(0, this.doSubtract(this.getWIFromEA(), this.getST(0)));
    }

    /**
     * FISUBR32()
     *
     * @this {X86FPU}
     */
    static FISUBR32()
    {
        this.setST(0, this.doSubtract(this.getSIFromEA(), this.getST(0)));
    }

    /**
     * FLDlr()
     *
     * The FLD instruction loads the source operand, converts it to temporary real format (if required),
     * and pushes the resulting value onto the floating-point stack.
     *
     * The load operation is accomplished by decrementing the top-of-stack pointer (TOP) and copying the
     * source operand to the new stack top. If the source operand is a float ing-point register, the index of
     * the register is taken before TOP is changed. The source operand may also be a short real, long real,
     * or temporary real memory operand. Short real and long real operands are converted automatically.
     *
     * Note that coding the instruction FLD ST(0) duplicates the value at the stack top.
     *
     * On the 8087 and 80287, the FLD real80 instruction will raise the denormal exception if the memory
     * operand is a denormal. The 80287XL and later coprocessors will not, since the operation is not arithmetic.
     *
     * On the 8087 and 80287, a denormal will be converted to an unnormal by FLD; on the 80287XL and later
     * coprocessors, the number will be converted to temporary real. If the next instruction is an FXTRACT or FXAM,
     * the 8087/80827 and 80287XL/80387/ 80486 results will be different.
     *
     * On the 8087 and 80287, the FLD real32 and FLD real64 instructions will not raise an exception when loading
     * a signaling NaN; on the 80287XL and later coprocessors, loading a signaling NaN raises the invalid operation
     * exception.
     *
     * @this {X86FPU}
     */
    static FLDlr()
    {
        this.pushValue(this.getLRFromEA());
    }

    /**
     * FLDsr()
     *
     * @this {X86FPU}
     */
    static FLDsr()
    {
        this.pushValue(this.getSRFromEA());
    }

    /**
     * FLDsti()
     *
     * @this {X86FPU}
     */
    static FLDsti()
    {
        this.pushValue(this.getST(this.iStack));
    }

    /**
     * FLDtr()
     *
     * @this {X86FPU}
     */
    static FLDtr()
    {
        this.pushValue(this.getLRFromTR(this.getTRFromEA()));
    }

    /**
     * FLDCW()
     *
     * @this {X86FPU}
     */
    static FLDCW()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.setControl(this.cpu.getShort(this.cpu.regEA));
    }

    /**
     * FLDENV()
     *
     * @this {X86FPU}
     */
    static FLDENV()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.loadEnv(this.cpu.regEA);
    }

    /**
     * FLD1()
     *
     * The FLD1 instruction loads the constant +1.0 from the NPX's constant ROM and pushes the value onto the
     * floating-point stack.
     *
     * The constant is stored internally in temporary real format and is simply moved to the stack.
     *
     * See also: FLDLG2, FLDLN2, FLDL2E, FLDL2T, FLDPI, and FLD1.
     *
     * @this {X86FPU}
     */
    static FLD1()
    {
        this.pushValue(1.0);
    }

    /**
     * FLDL2T()
     *
     * The FLDL2T instruction loads the constant log2(10) from the NPX's constant ROM and pushes the value onto the
     * floating-point stack.
     *
     * The constant is stored internally in temporary real format and is simply moved to the stack.
     *
     * On the 8087 and 80287, rounding control is not in effect for the loading of this constant.  On the 80287XL and
     * later coprocessors, rounding control is in effect.  If RC is set for chop (round toward 0), round down (toward
     * -infinity), or round to nearest or even, the result will be the same as on the 8087 and 80287.  If RC is set for
     * round up (toward +infinity), the result will differ by one in the least significant bit of the mantissa.
     *
     * See also: FLDLG2, FLDLN2, FLDL2E, FLDPI, FLD1, and FLDZ.
     *
     * @this {X86FPU}
     */
    static FLDL2T()
    {
        this.pushValue(X86FPU.regL2T);
    }

    /**
     * FLDL2E()
     *
     * The FLDL2E instruction loads the constant log2(e) from the NPX's constant ROM and pushes the value onto the
     * floating-point stack.
     *
     * The constant is stored internally in temporary real format and is simply moved to the stack.
     *
     * On the 8087 and 80287, rounding control is not in effect for the loading of this constant.  On the 80287XL and
     * later coprocessors, rounding control is in effect.  If RC is set for chop (round toward 0) or round down (toward
     * -infinity), the result is the same as on the 8087 and 80827.  If RC is set for round to nearest or even, or round
     * up (toward +infinity), the result will differ by one in the least significant bit of the mantissa.
     *
     * See also: FLDLG2, FLDLN2, FLDL2T, FLDPI, FLD1, and FLDZ.
     *
     * @this {X86FPU}
     */
    static FLDL2E()
    {
        this.pushValue(X86FPU.regL2E);
    }

    /**
     * FLDPI()
     *
     * The FLDPI instruction loads the constant Pi from the NPX's constant ROM and pushes the value onto the
     * floating-point stack.
     *
     * The constant is stored internally in temporary real format and is simply moved to the stack.
     *
     * On the 8087 and 80287, rounding control is not in effect for the loading of these constants.  On the 80287XL and
     * later coprocessors, rounding control is in effect.  If RC is set for chop (round toward 0) or round down (toward
     * -infinity), the result is the same as on the 8087 and 80827.  If RC is set for round to nearest or even, or round
     * up (toward +infinity), the result will differ by one in the least significant bit of the mantissa.
     *
     * See also: FLDLG2, FLDLN2, FLDL2E, FLDL2T, FLD1, and FLDZ.
     *
     * @this {X86FPU}
     */
    static FLDPI()
    {
        this.pushValue(X86FPU.regPI);
    }

    /**
     * FLDLG2()
     *
     * The FLDLG2 instruction loads the constant log10(2) from the NPX's constant ROM and pushes the value onto the
     * floating-point stack.
     *
     * The constant is stored internally in temporary real format and is simply moved to the stack.
     *
     * On the 8087 and 80287, rounding control is not in effect for the loading of this constant.  On the 80287XL and
     * later coprocessors, rounding control is in effect.  If RC is set for chop (round toward 0) or round down (toward
     * -infinity), the result is the same as on the 8087 and 80827.  If RC is set for round to nearest or even, or round
     * up (toward +infinity), the result will differ by one in the least significant bit of the mantissa.
     *
     * See also: FLDLN2, FLDL2E, FLDL2T, FLDPI, FLD1, and FLDZ.
     *
     * @this {X86FPU}
     */
    static FLDLG2()
    {
        this.pushValue(X86FPU.regLG2);
    }

    /**
     * FLDLN2()
     *
     * The FLDLN2 instruction loads the constant loge(2) from the NPX's constant ROM and pushes the value onto the
     * floating-point stack.
     *
     * The constant is stored internally in temporary real format and is simply moved to the stack.
     *
     * On the 8087 and 80287, rounding control is not in effect for the loading of this constant.  On the 80287XL and
     * later coprocessors, rounding control is in effect.  If RC is set for chop (round toward 0) or round down (toward
     * -infinity), the result will be the same as on the 8087 and 80827.  If RC is set for round to nearest or even, or
     * round up (toward +infinity), the result will differ by one in the least significant bit of the mantissa.
     *
     * See also: FLDLG2, FLDL2E, FLDL2T, FLDPI, FLD1, and FLDZ.
     *
     * @this {X86FPU}
     */
    static FLDLN2()
    {
        this.pushValue(X86FPU.regLN2);
    }

    /**
     * FLDZ()
     *
     * The FLDZ instruction loads the constant +0.0 from the NPX's constant ROM and pushes the value onto the
     * floating-point stack.
     *
     * The constant is stored internally in temporary real format and is simply moved to the stack.
     *
     * See also: FLDLG2, FLDLN2, FLDL2E, FLDL2T, FLDPI, and FLD1.
     *
     * @this {X86FPU}
     */
    static FLDZ()
    {
        this.pushValue(0.0);
    }

    /**
     * FMULlr()
     *
     * @this {X86FPU}
     */
    static FMULlr()
    {
        this.setST(0, this.doMultiply(this.getST(0), this.getLRFromEA()));
    }

    /**
     * FMULsr()
     *
     * Encoding 0xD8,reg=0x01 ("FMUL short-real"): ST(0) <- ST(0) * REAL32
     *
     * @this {X86FPU}
     */
    static FMULsr()
    {
        this.setST(0, this.doMultiply(this.getST(0), this.getSRFromEA()));
    }

    /**
     * FMULst()
     *
     * @this {X86FPU}
     */
    static FMULst()
    {
        this.setST(0, this.doMultiply(this.getST(0), this.getST(this.iStack)));
    }

    /**
     * FMULsti()
     *
     * @this {X86FPU}
     */
    static FMULsti()
    {
        this.setST(this.iStack, this.doMultiply(this.getST(this.iStack), this.getST(0)));
    }

    /**
     * FMULPsti()
     *
     * @this {X86FPU}
     */
    static FMULPsti()
    {
        if (this.setST(this.iStack, this.doMultiply(this.getST(this.iStack), this.getST(0)))) this.popValue();
    }

    /**
     * FNOP()
     *
     * @this {X86FPU}
     */
    static FNOP()
    {
    }

    /**
     * FPATAN()
     *
     * FPATAN calculates the partial arctangent of ST(0) divided by ST(1):
     *
     *      ST(1) = tan^-1( ST(1) / ST(0) )
     *
     * On the 8087 and 80287, the arguments must satisfy the inequality 0 <= ST(1) < ST(0) < +infinity.
     * On the 80287XL and later coprocessors, the range of the operands is unrestricted.  The result is
     * returned to ST(1), and the stack is popped, destroying both operands and leaving the result in ST(0).
     *
     * @this {X86FPU}
     */
    static FPATAN()
    {
        if (this.setST(1, Math.atan2(this.getST(1), this.getST(0)))) this.popValue();
    }

    /**
     * FPTAN()
     *
     * FPTAN calculates the partial tangent of ST(0):
     *
     *      y / x = tan( ST(0) )
     *
     * The result of the operation is a ratio.  y replaces the argument on the stack, and x is pushed onto the stack,
     * where it becomes the new ST(0).
     *
     * On the 8087 and 80287, the FPTAN function assumes that its argument is valid and in-range.  No argument checking
     * is performed.  The value of ST(0) must satisfy the inequality -pi/4 <= ST(0) <= pi/4.  In the case of an invalid
     * argument, the result is undefined and no error is signaled.
     *
     * On the 80287XL and later coprocessors, if value of ST(0) satisfies the condition -2^63 < ST(0) < 2^63, it will
     * automatically be reduced to within range.  If the operand is outside this range, however, C2 is set to 1 to indicate
     * that the function is incomplete, and ST(0) is left unchanged.
     *
     * The 80287XL, 80387, and 80486 always push a value of +1.0 for x. The value of x pushed by the 8087 and 80287 may be
     * any real number.  In either case, the ratio is the same. The cotangent can be calculated by executing FDIVR immediately
     * after FPTAN.  The following code will leave the 8087 and 80287 in the same state as the later coprocessors:
     *
     *      FDIV
     *      FLD1
     *
     * ST(7) must be empty before this instruction is executed to avoid an invalid operation exception.  If the invalid
     * operation exception is masked, the 8087 and 80287 leave the original operand unchanged, but push it to ST(1).  On the
     * 80287XL and later coprocessors, both ST(0) and ST(1) will contain quiet NaNs.  On the 80287XL and later coprocessors,
     * if condition code bit C2 is 0 and the precision exception is raised, then C1=1 if the last bit was rounded up. C1 is
     * undefined for the 8087 and 80287.
     *
     * @this {X86FPU}
     */
    static FPTAN()
    {
        if (this.setST(0, Math.tan(this.getST(0)))) this.pushValue(1.0);
    }

    /**
     * FPREM()
     *
     * FPREM performs modulo division of ST(0) by ST(1) and returns the result to ST(0).
     *
     * The FPREM instruction is used to reduce the real operand in ST(0) to a value whose magnitude is less than the
     * magnitude of ST(1).  FPREM produces an exact result, so the precision exception is never raised and the rounding
     * control has no effect.  The sign of the remainder is the same as the sign of the original operand.
     *
     * The remaindering operation is performed by iterative scaled subtractions and can reduce the exponent of ST(0) by
     * no more than 63 in one execution.  If the remainder is less than ST(1) (the modulus), the function is complete and
     * C2 in the status word is cleared.
     *
     * If the modulo function is incomplete, C2 is set to 1, and the result in ST(0) is termed the partial remainder.
     * C2 can be inspected by storing the status word and re-executing the instruction until C2 is clear. Alternately,
     * ST(0) can be compared to ST(1).  If ST(0) > ST(1), then FPREM must be executed again.  If ST(0) = ST(1), then the
     * remainder is 0.
     *
     * FPREM is important for reducing arguments to the periodic transcendental functions such as FPTAN.  Because FPREM
     * produces an exact result, no round-off error is introduced into the calculation.
     *
     * When reduction is complete, the three least-significant bits of the quotient are stored in the condition code bits
     * C3, C1, and C0, respectively.  When arguments to the tangent function are reduced by pi/4, this result can be used
     * to identify the octant that contained the original angle.
     *
     * The FPREM function operates differently than specified by the IEEE 754 standard when rounding the quotient to form
     * a partial remainder (see the algorithm).  The FPREM1 function (80287XL and up) is provided for compatibility with
     * that standard.
     *
     * The FPREM instruction can also be used to normalize ST(0).  If ST(0) is unnormal and ST(1) is greater than ST(0),
     * FPREM will normalize ST(0).  On the 8087 and 80287, operation on a denormal operand raises the invalid operation
     * exception.  Underflow is not possible.  On the 80287XL and later coprocessors, operation on a denormal is supported
     * and an underflow exception can occur.
     *
     * ALGORITHM:
     *
     *      t = EXPONENT(ST) - EXPONENT(ST(1))
     *      IF (t < 64) THEN
     *          q = R0UND(ST(0) / ST(1), CHOP)
     *          ST(0) = ST(0) - (ST(1) * q)
     *          C2 = 0
     *          C0 = BIT 2 of q
     *          C1 = BIT 1 of q
     *          C3 = BIT 0 of q
     *      ELSE
     *          n = a number between 32 and 63
     *          q = ROUND((ST(0) / ST(1)) / 2^(t-n), CHOP)
     *          ST(0) = ST(0) - (ST(1) * q * 2^(t-n))
     *          C2 = 1
     *      ENDIF
     *
     * TODO: Determine the extent to which the JavaScript MOD operator differs from the above algorithm.
     *
     * ERRATA: On the 8087 and 80287, the condition code bits C3, C1, and C0 are incorrect when performing a reduction of
     * 64^n + m, where n >= 1, and m=1 or m=2.  A bug fix should be implemented in software.
     *
     * @this {X86FPU}
     */
    static FPREM()
    {
        this.setST(0, this.getST(0) % this.getST(1));
    }

    /**
     * FRSTOR()
     *
     * @this {X86FPU}
     */
    static FRSTOR()
    {
        var cpu = this.cpu;
        var addr = this.loadEnv(cpu.regEA);
        var a = this.intTmpTR;
        for (var i = 0; i < this.regStack.length; i++) {
            a[0] = cpu.getLong(addr);
            a[1] = cpu.getLong(addr += 4);
            a[2] = cpu.getShort(addr += 4);
            this.setTR(i, a);
            addr += 2;
        }
    }

    /**
     * FRNDINT()
     *
     * @this {X86FPU}
     */
    static FRNDINT()
    {
        this.setST(0, this.roundValue(this.getST(0), X86FPU.MAX_INT64));
    }

    /**
     * FSAVE()
     *
     * @this {X86FPU}
     */
    static FSAVE()
    {
        var cpu = this.cpu;
        var addr = this.saveEnv(cpu.regEA);
        for (var i = 0; i < this.regStack.length; i++) {
            var a = this.getTR(i, true);
            cpu.setLong(addr, a[0]);
            cpu.setLong(addr += 4, a[1]);
            cpu.setShort(addr += 4, a[2]);
            addr += 2;
        }
        this.resetFPU();
    }

    /**
     * FSCALE()
     *
     * FSCALE interprets the value in ST(1) as an integer and adds this number to the exponent of the number in ST(0).
     *
     * The FSCALE instruction provides a means of quickly performing multiplication or division by powers of two.
     * This operation is often required when scaling array indexes.
     *
     * On the 8087 and 80287, FSCALE assumes that the scale factor in ST(1) is an integer that satisfies the inequality
     * -2^15 <= ST(1) < +2^15.  If ST(1) is not an integer value, the value is chopped to the next smallest integer in
     * magnitude (chopped toward zero).  If the value is out of range or 0 < ST(1) < 1, FSCALE produces an undefined
     * result and doesn't signal an exception.  Typically, the value in ST(0) is unchanged but should not be depended on.
     *
     * On the 80287XL and later coprocessors, there is no limit on the range of the scale factor in ST(1). The value in
     * ST(1) is still chopped toward zero.  If ST(1) is 0, ST(0) is unchanged.
     *
     * @this {X86FPU}
     */
    static FSCALE()
    {
        var x = this.getST(0);
        var y = this.getST(1);
        if (x != null && y != null) this.setST(0, x * Math.pow(2, this.truncateValue(y)));
    }

    /**
     * FSETPM287()
     *
     * @this {X86FPU}
     */
    static FSETPM287()
    {
        if (this.isModel(X86.FPU.MODEL_80287)) {
            this.opUnimplemented();
        }
    }

    /**
     * FSINCOS387()
     *
     * @this {X86FPU}
     */
    static FSINCOS387()
    {
        if (this.isAtLeastModel(X86.FPU.MODEL_80287XL)) {
            this.opUnimplemented();
        }
    }

    /**
     * FSQRT()
     *
     * @this {X86FPU}
     */
    static FSQRT()
    {
        this.setST(0, this.doSquareRoot(this.getST(0)));
    }

    /**
     * FSTlr()
     *
     * @this {X86FPU}
     */
    static FSTlr()
    {
        if (this.getLR(0)) this.setEAFromLR();
    }

    /**
     * FSTsr()
     *
     * @this {X86FPU}
     */
    static FSTsr()
    {
        if (this.getSR(0)) this.setEAFromSR();
    }

    /**
     * FSTsti()
     *
     * @this {X86FPU}
     */
    static FSTsti()
    {
        this.setST(this.iStack, this.getST(0));
    }

    /**
     * FSTENV()
     *
     * @this {X86FPU}
     */
    static FSTENV()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.saveEnv(this.cpu.regEA);
        this.regControl |= X86.FPU.CONTROL.EXC;     // mask all exceptions (but do not set IEM)
    }

    /**
     * FSTPlr()
     *
     * @this {X86FPU}
     */
    static FSTPlr()
    {
        if (this.getLR(0)) {
            this.setEAFromLR();
            this.popValue();
        }
    }

    /**
     * FSTPsr()
     *
     * @this {X86FPU}
     */
    static FSTPsr()
    {
        if (this.getSR(0)) {
            this.setEAFromSR();
            this.popValue();
        }
    }

    /**
     * FSTPsti()
     *
     * @this {X86FPU}
     */
    static FSTPsti()
    {
        if (this.setST(this.iStack, this.getST(0))) this.popValue();
    }

    /**
     * FSTP8087()
     *
     * NOTE: This is used with encodings (0xD9,0xD8-0xDF and 0xDF,0xD0-0xDF) that were valid for the 8087 and 80287
     * but may no longer be valid as of the 80387.
     *
     * @this {X86FPU}
     */
    static FSTP8087()
    {
        this.opObsolete();
        X86FPU.FSTPsti.call(this);
    }

    /**
     * FSTPtr()
     *
     * @this {X86FPU}
     */
    static FSTPtr()
    {
        if (this.getTR(0)) {
            this.setEAFromTR();
            this.popValue();
        }
    }

    /**
     * FSTCW()
     *
     * @this {X86FPU}
     */
    static FSTCW()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.cpu.setShort(this.cpu.regEA, this.regControl);
    }

    /**
     * FSTSW()
     *
     * @this {X86FPU}
     */
    static FSTSW()
    {
        this.assert(this.cpu.regEA !== X86.ADDR_INVALID);
        this.cpu.setShort(this.cpu.regEA, this.getStatus());
    }

    /**
     * FSTSWAX287()
     *
     * @this {X86FPU}
     */
    static FSTSWAX287()
    {
        if (this.isAtLeastModel(X86.FPU.MODEL_80287)) {
            this.cpu.regEAX = (this.cpu.regEAX & ~0xffff) | this.getStatus();
        }
    }

    /**
     * FSUBlr()
     *
     * @this {X86FPU}
     */
    static FSUBlr()
    {
        this.setST(0, this.doSubtract(this.getST(0), this.getLRFromEA()));
    }

    /**
     * FSUBsr()
     *
     * @this {X86FPU}
     */
    static FSUBsr()
    {
        this.setST(0, this.doSubtract(this.getST(0), this.getSRFromEA()));
    }

    /**
     * FSUBst()
     *
     * Encoding 0xD8,0xE0-0xE7 ("FSUB ST,ST(i)"): ST(0) <- ST(0) - ST(i)
     *
     * @this {X86FPU}
     */
    static FSUBst()
    {
        this.setST(0, this.doSubtract(this.getST(0), this.getST(this.iStack)));
    }

    /**
     * FSUBsti()
     *
     * Encoding 0xDC,0xE8-0xEF ("FSUB ST(i),ST"): ST(i) <- ST(i) - ST(0)
     *
     * @this {X86FPU}
     */
    static FSUBsti()
    {
        this.setST(this.iStack, this.doSubtract(this.getST(this.iStack), this.getST(0)));
    }

    /**
     * FSUBPsti()
     *
     * Encoding 0xDE,0xE8-0xEF ("FSUBP ST(i),ST"): ST(i) <- ST(i) - ST(0), POP
     *
     * @this {X86FPU}
     */
    static FSUBPsti()
    {
        if (this.setST(this.iStack, this.doSubtract(this.getST(this.iStack), this.getST(0)))) this.popValue();
    }

    /**
     * FSUBRlr()
     *
     * @this {X86FPU}
     */
    static FSUBRlr()
    {
        this.setST(0, this.doSubtract(this.getLRFromEA(), this.getST(0)));
    }

    /**
     * FSUBRsr()
     *
     * @this {X86FPU}
     */
    static FSUBRsr()
    {
        this.setST(0, this.doSubtract(this.getSRFromEA(), this.getST(0)));
    }

    /**
     * FSUBRst()
     *
     * Encoding 0xD8,0xE8-0xEF ("FSUBR ST,ST(i)"): ST(0) <- ST(i) - ST(0)
     *
     * @this {X86FPU}
     */
    static FSUBRst()
    {
        this.setST(0, this.doSubtract(this.getST(this.iStack), this.getST(0)));
    }

    /**
     * FSUBRsti()
     *
     * Encoding 0xDC,0xE0-0xE7 ("FSUBR ST(i),ST"): ST(i) <- ST(0) - ST(i)
     *
     * @this {X86FPU}
     */
    static FSUBRsti()
    {
        this.setST(this.iStack, this.doSubtract(this.getST(0), this.getST(this.iStack)));
    }

    /**
     * FSUBRPsti()
     *
     * Encoding 0xDE,0xE0-0xE7 ("FSUBRP ST(i),ST"): ST(i) <- ST(0) - ST(i), POP
     *
     * @this {X86FPU}
     */
    static FSUBRPsti()
    {
        if (this.setST(this.iStack, this.doSubtract(this.getST(0), this.getST(this.iStack)))) this.popValue();
    }

    /**
     * FTST()
     *
     * @this {X86FPU}
     */
    static FTST()
    {
        this.doCompare(this.getST(0), 0);
    }

    /**
     * FXAM()
     *
     * @this {X86FPU}
     */
    static FXAM()
    {
        this.regStatus &= ~X86.FPU.STATUS.CC;

        if (this.getSTSign(0)) {
            this.regStatus |= X86.FPU.STATUS.C1;
        }
        if (this.getTag(this.iST) == X86.FPU.TAGS.EMPTY) {
            this.regStatus |= X86.FPU.STATUS.C0 | X86.FPU.STATUS.C3;
        }
        else {
            var v = this.getST(0);
            if (isNaN(v)) {
                this.regStatus |= X86.FPU.STATUS.C0;
            }
            else if (v === 0) {                                 // this equals -0, too (WTF, strict equality?)
                this.regStatus |= X86.FPU.STATUS.C3;
            }
            else if (v === Infinity || v === -Infinity) {       // these are so divergent that even non-strict equality doesn't consider them equal
                this.regStatus |= X86.FPU.STATUS.C0 | X86.FPU.STATUS.C2;
            }
            else {
                this.regStatus |= X86.FPU.STATUS.C2;
            }
        }
    }

    /**
     * FXCHsti()
     *
     * @this {X86FPU}
     */
    static FXCHsti()
    {
        var tmp = this.getST(0);
        this.setST(0, this.getST(this.iStack));
        this.setST(this.iStack, tmp);
    }

    /**
     * FXCH8087()
     *
     * NOTE: This is used with encodings (0xDD,0xC8-0xCF and 0xDF,0xC8-0xCF) that were valid for the 8087 and 80287
     * but may no longer be valid as of the 80387.
     *
     * @this {X86FPU}
     */
    static FXCH8087()
    {
        this.opObsolete();
        X86FPU.FXCHsti.call(this);
    }

    /**
     * FXTRACT()
     *
     * FXTRACT splits the value encoded in ST(0) into two separate numbers representing the actual value of the
     * fraction (mantissa) and exponent fields.
     *
     * The FXTRACT instruction is used to decompose the two fields of the temporary real number in ST(0).  The exponent
     * replaces the value in ST(0), then the fraction is pushed onto the stack.  When execution is complete, ST(0)
     * contains the original fraction, expressed as a real number with a true exponent of 0 (0x3FFF in biased form),
     * and ST(1) contains the value of the original operand's true (unbiased) exponent expressed as a real number.
     *
     * If ST(0) is 0, the 8087 and 80287 will leave zeros in both ST(0) and ST(1); both zeros will have the same sign as
     * the original operand.  If ST(0) is +infinity, the invalid operation exception is raised.
     *
     * On the 80287XL and later coprocessors, if ST(0) is 0, the zero-divide exception is reported and ST(1) is set to
     * -infinity.  If ST(0) is +infinity, no exception is reported.
     *
     * The FXTRACT instruction may be thought of as the complement to the FSCALE instruction, which combines a separate
     * fraction and exponent into a single value.
     *
     * ALGORITHM:
     *
     *      IF (ST(0) = 0) THEN
     *          DEC TOP
     *          ST(0) = ST(1)
     *      ELSE
     *          temp = ST(0)
     *          ST(0) = EXPONENT(ST(0))     ; stored as true exponent
     *          DEC TOP
     *          ST(0) = FRACTION(ST(0))
     *      ENDIF
     *
     * @this {X86FPU}
     */
    static FXTRACT()
    {
        var v = this.getST(0);
        if (v != null) {
            this.regTmpLR[0] = v;
            this.setST(0, ((this.intTmpLR[1] >> 20) & 0x7ff) - 0x3ff);
            this.intTmpLR[1] = (this.intTmpLR[1] | 0x3ff00000) & ~0x40000000;
            this.pushValue(this.regTmpLR[0]);
        }
    }

    /**
     * FYL2X()
     *
     * FYL2X (y log base 2 of x) calculates:
     *
     *      ST(1) = ST(1) * log2(ST(0))
     *
     * The operands must satisfy the inequalities 0 < ST(0) < +infinity and -infinity < ST(1) < +infinity.  FYL2X pops
     * the stack and returns the result to the new ST(0).  Both original operands are destroyed.
     *
     * The FYL2X function is designed to optimize the calculation of a log to a base, n, other than two.  In such a case,
     * the following multiplication is required; ie:
     *
     *      logn(x) = logn(2) * log2(x)
     *
     * @this {X86FPU}
     */
    static FYL2X()
    {
        if (this.setST(1, this.getST(1) * Math.log(this.getST(0)) / Math.LN2)) this.popValue();
    }

    /**
     * FYL2XP1()
     *
     * FYL2XP1 (y log base 2 of x plus 1) calculates:
     *
     *      ST(1) = ST(1) * log2(ST(0) + 1)
     *
     * The operands must satisfy the inequalities -(1-sqrt(2)/2) < ST(0) < (1-sqrt(2)/2) and -infinity < ST(1) < +infinity.
     * FYL2XP1 pops the stack and returns the result to the new ST(0).  Both original operands are destroyed.
     *
     * The FYL2XP1 function provides greater accuracy than FYL2X in computing the log of a number that is very close to 1.
     *
     * FYL2XP1 is typically used when computing compound interest, for example, which requires the calculation of a logarithm
     * of 1.0 + n where 0 < n < 0.29.  If 1.0 was added to n, significant digits might be lost.  By using FYL2XP1, the result
     * will be as accurate as n to within three units of temporary real precision.
     *
     * @this {X86FPU}
     */
    static FYL2XP1()
    {
        if (this.setST(1, this.getST(1) * Math.log(this.getST(0) + 1.0) / Math.LN2)) this.popValue();
    }

    /**
     * X86FPU.init()
     *
     * This function operates on every HTML element of class "fpu", extracting the
     * JSON-encoded parameters for the X86FPU constructor from the element's "data-value"
     * attribute, invoking the constructor to create an X86FPU component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeFPUs = Component.getElementsByClass(document, PCX86.APPCLASS, "fpu");
        for (var iFPU = 0; iFPU < aeFPUs.length; iFPU++) {
            var eFPU = aeFPUs[iFPU];
            var parmsFPU = Component.getComponentParms(eFPU);
            var fpu = new X86FPU(parmsFPU);
            Component.bindComponentControls(fpu, eFPU, PCX86.APPCLASS);
        }
    }
}

/*
 * Class constants
 *
 * TODO: When loading any of the following 5 constants, the 80287XL and newer coprocessors apply rounding control.
 */

/** @const */
X86FPU.regL2T = Math.log(10) / Math.LN2;        // log2(10) (use Math.log2() if we ever switch to ES6)

/** @const */
X86FPU.regL2E = Math.LOG2E;                     // log2(e)

/** @const */
X86FPU.regPI  = Math.PI;                        // pi

/** @const */
X86FPU.regLG2 = Math.log(2) / Math.LN10;        // log10(2) (use Math.log10() if we ever switch to ES6)

/** @const */
X86FPU.regLN2 = Math.LN2;                       // log(2)

/** @const */
X86FPU.MAX_INT16 = 0x8000;

/** @const */
X86FPU.MAX_INT32 = 0x80000000;

/** @const */
X86FPU.MAX_INT64 = Math.pow(2, 63);


/*
 * FPU operation lookup table (be sure to keep the following table in sync with Debugger.aaaOpFPUDescs).
 *
 * The second lookup value corresponds to bits in the ModRegRM byte that follows the ESC byte (0xD8-0xDF).
 *
 * Here's a little cheat-sheet for how the 2nd lookup values relate to ModRegRM values; see opFPU() for details.
 *
 *      Lookup  ModRegRM value(s)
 *      ------  -------------------------------
 *      0x00:   0x00-0x07, 0x40-0x47, 0x80-0x87
 *      0x01:   0x08-0x0F, 0x48-0x4F, 0x88-0x8F
 *      0x02:   0x10-0x17, 0x50-0x57, 0x90-0x97
 *      0x03:   0x18-0x1F, 0x58-0x5F, 0x98-0x9F
 *      0x04:   0x20-0x27, 0x60-0x67, 0xA0-0xA7
 *      0x05:   0x28-0x2F, 0x68-0x6F, 0xA8-0xAF
 *      0x06:   0x30-0x37, 0x70-0x77, 0xB0-0xB7
 *      0x07:   0x38-0x3F, 0x78-0x7F, 0xB8-0xBF
 *      0x30:   0xC0-0xC7
 *      0x31:   0xC8-0xCF
 *      0x32:   0xD0-0xD7
 *      0x33:   0xD8-0xDF
 *      0x34:   0xE0-0xE7
 *      0x35:   0xE8-0xEF
 *      0x36:   0xF0-0xF7
 *      0x37:   0xF8-0xFF
 *
 * ESC bytes 0xD9 and 0xDB use the RM field to further describe the operation when the ModRegRM value >= 0xE0.
 * In those cases, we shift the Reg value into the high nibble and the RM value into the low nibble, resulting in
 * the following lookup values (which look a lot like hex-encoded octal):
 *
 *      0x40:   0xE0
 *      0x41:   0xE1
 *      ...     ...
 *      0x46:   0xE6
 *      0x47:   0xE7
 *
 *      0x50:   0xE8
 *      0x51:   0xE9
 *      ...     ...
 *      0x56:   0xEE
 *      0x57:   0xEF
 *
 *      0x60:   0xF0
 *      0x61:   0xF1
 *      ...     ...
 *      0x66:   0xF6
 *      0x67:   0xF7
 *
 *      0x70:   0xF8
 *      0x71:   0xF9
 *      ...     ...
 *      0x76:   0xFE
 *      0x77:   0xFF
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
        0x30: X86FPU.FLDsti,    0x31: X86FPU.FXCHsti,   0x32: X86FPU.FNOP,      0x33: X86FPU.FSTP8087,
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
        0x40: X86FPU.FENI8087,  0x41: X86FPU.FDISI8087, 0x42: X86FPU.FCLEX,     0x43: X86FPU.FINIT,
        0x44: X86FPU.FSETPM287,
        0x73: X86FPU.FSINCOS387
    },
    0xDC: {
        0x00: X86FPU.FADDlr,    0x01: X86FPU.FMULlr,    0x02: X86FPU.FCOMlr,    0x03: X86FPU.FCOMPlr,
        0x04: X86FPU.FSUBlr,    0x05: X86FPU.FSUBRlr,   0x06: X86FPU.FDIVlr,    0x07: X86FPU.FDIVRlr,
        0x30: X86FPU.FADDsti,   0x31: X86FPU.FMULsti,   0x32: X86FPU.FCOM8087,  0x33: X86FPU.FCOMP8087,
        /*
         * Intel's original 8087 datasheet had these forms of SUB and SUBR (and DIV and DIVR) swapped.
         */
        0x34: X86FPU.FSUBRsti,  0x35: X86FPU.FSUBsti,   0x36: X86FPU.FDIVRsti,  0x37: X86FPU.FDIVsti
    },
    0xDD: {
        0x00: X86FPU.FLDlr,                             0x02: X86FPU.FSTlr,     0x03: X86FPU.FSTPlr,
        0x04: X86FPU.FRSTOR,                            0x06: X86FPU.FSAVE,     0x07: X86FPU.FSTSW,
        0x30: X86FPU.FFREEsti,  0x31: X86FPU.FXCH8087,  0x32: X86FPU.FSTsti,    0x33: X86FPU.FSTPsti
    },
    0xDE: {
        0x00: X86FPU.FIADD16,   0x01: X86FPU.FIMUL16,   0x02: X86FPU.FICOM16,   0x03: X86FPU.FICOMP16,
        0x04: X86FPU.FISUB16,   0x05: X86FPU.FISUBR16,  0x06: X86FPU.FIDIV16,   0x07: X86FPU.FIDIVR16,
        0x30: X86FPU.FADDPsti,  0x31: X86FPU.FMULPsti,  0x32: X86FPU.FCOMP8087, 0x33: X86FPU.FCOMPP,
        /*
         * Intel's original 8087 datasheet had these forms of SUBP and SUBRP (and DIVP and DIVRP) swapped.
         */
        0x34: X86FPU.FSUBRPsti, 0x35: X86FPU.FSUBPsti,  0x36: X86FPU.FDIVRPsti, 0x37: X86FPU.FDIVPsti
    },
    0xDF: {
        0x00: X86FPU.FILD16,                            0x02: X86FPU.FIST16,    0x03: X86FPU.FISTP16,
        0x04: X86FPU.FBLDpd,    0x05: X86FPU.FILD64,    0x06: X86FPU.FBSTPpd,   0x07: X86FPU.FISTP64,
        0x30: X86FPU.FFREEP8087,0x31: X86FPU.FXCH8087,  0x32: X86FPU.FSTP8087,  0x33: X86FPU.FSTP8087,
        0x34: X86FPU.FSTSWAX287
    }
};

/*
 * An array of X86FPU functions documented as preserving the "exception" registers.
 */
X86FPU.afnPreserveExceptions = [
    X86FPU.FCLEX,   X86FPU.FINIT,   X86FPU.FLDCW,   X86FPU.FLDENV,  X86FPU.FRSTOR,
    X86FPU.FSAVE,   X86FPU.FSTCW,   X86FPU.FSTENV,  X86FPU.FSTSW,   X86FPU.FSTSWAX287
];

/*
 * Initialize every FPU module on the page
 */
Web.onInit(X86FPU.init);

if (NODE) module.exports = X86FPU;
