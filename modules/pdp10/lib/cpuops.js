/**
 * @fileoverview Implements PDP-10 opcode handlers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2017
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
 */

"use strict";

if (NODE) {
    var Str = require("../../shared/lib/strlib");
    var PDP10 = require("./defines");
}

/**
 * opKA10(op)
 *
 * Originally, we received the full opcode (36 bits), then only the upper half-word (18 bits),
 * and now we receive only the upper 13 bits.  However, the octal values shown in the table and
 * function comments below still include all 18 bits of the original upper half-word, so that
 * you don't have to mentally un-shift them 5 bits.
 *
 * @this {CPUStatePDP10}
 * @param {number} op (the top 13 bits of the original opcode, shifted right to bit 0)
 */
PDP10.opKA10 = function(op)
{
    /*
     * We shift op right 4 more bits, leaving only the 9 bits required for the table index.
     */
    PDP10.aOpXXX_KA10[op >> 4].call(this, op, op & PDP10.OPCODE.A_MASK);
};

/**
 * opUUO(0o0NN000): Unimplemented User Operation
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-64:
 *
 *      Store the instruction code, A and the effective address E in bits 0-8, 9-12 and 18-35 respectively of
 *      location 40; clear bits 13-17.  Execute the instruction contained in location 41.  The original contents
 *      of location 40 are lost.
 *
 *      All of these codes are equivalent when they occur in the Monitor or when time sharing is not in effect.
 *      But when a UUO appears in a user program, a code in the range 001-037 uses relocated locations 40 and 41
 *      (ie 40 and 41 in the user's block) and is thus entirely a part of and under control of the user program.
 *
 *      A code in the range 040-077 on the other hand uses unrelocated 40 and 41, and the instruction in the latter
 *      location is under control of the Monitor; these codes are thus specifically for user communication with
 *      the Monitor, which interprets them (refer to the Monitor manual for the meanings of the various codes).
 *
 *      The code 000 executes in the same way as 040-077 but is not a standard communication code: it is included
 *      so that control returns to the Monitor should a user program wipe itself out.
 *
 *      For a second processor connected to the same memory, the UUO trap is locations 140-141 instead of 40-41.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opUUO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opUFA(0o130000): Unnormalized Floating Add
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-37:
 *
 *      Floating add the contents of location E to AC.  If the double length fraction in the sum is zero, clear
 *      accumulator A+1.  Otherwise normalize the sum only if the magnitude of its fractional part is >= 1, and place
 *      the high order part of the result in AC A+1.  The original contents of AC and E are unaffected.
 *
 *      NOTE: The result is placed in accumulator A+1. T his is the only arithmetic instruction that stores the result
 *      in a second accumulator, leaving the original operands intact.
 *
 *      If the exponent of the sum following the one-step normalization is > 127, set Overflow and Floating Overflow;
 *      the result stored has an exponent 256 less than the correct one.
 *
 *      SIDEBAR: The exponent of the sum is equal to that of the larger summand unless addition of the fractions
 *      overflows, in which case it is greater by 1.  Exponent overflow can occur only in the latter case.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opUFA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opDFN(0o131000): Double Floating Negate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-37:
 *
 *      Negate the double length floating point number composed of the contents of AC and location E with AC on the left.
 *      Do this by taking the twos complement of the number whose sign is AC bit 0, whose exponent is in AC bits 1-8, and
 *      whose fraction is the 54-bit string in bits 9-35 of AC and location E.  Place the high order word of the result
 *      in AC; place the low order part of the fraction in bits 9-35 of location E without altering the original contents
 *      of bits 0-8 of that location.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDFN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSC(0o132000): Floating Scale
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-34:
 *
 *      If the fractional part of AC is zero, clear AC.  Otherwise add the scale factor given by E to the exponent part
 *      of AC (thus multiplying AC by 2^E), normalize the resulting word bringing 0s into bit positions vacated at the
 *      right, and place the result back in AC.
 *
 *      NOTE: A negative E is represented in standard twos complement notation, but the hardware compensates for this
 *      when scaling the exponent.
 *
 *      If the exponent after normalization is > 127, set Overflow and Floating Overflow; the result stored has an
 *      exponent 256 less than the correct one.  If < -128, set Overflow, Floating Overflow and Floating Underflow;
 *      the result stored has an exponent 256 greater than the correct one.
 *
 *      SIDEBAR: This instruction can be used to float a fixed number with 27 or fewer significant bits.  To float an
 *      integer contained within AC bits 9-35,
 *
 *          FSC AC,233
 *
 *      inserts the correct exponent to move the binary point from the right end to the left of bit 9 and then normalizes
 *      (233(base 8) = 155(base 10) = 128 + 27).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSC = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIBP(0o133000): Increment Byte Pointer
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-16:
 *
 *      Increment the byte pointer in location E as explained [below].
 *
 *      To facilitate processing a series of bytes, several of the byte instructions increment the
 *      pointer, ie, modify it so that it points to the next byte position in a set of memory locations.
 *      Bytes are processed from left to right in a word, so incrementing merely replaces the current value
 *      of P by P - S, unless there is insufficient space in the present location for another byte of the
 *      specified size (P - S < 0).  In this case Y is increased by one to point to the next consecutive
 *      location, and P is set to 36 - S to point to the first byte at the left in the new location.
 *
 *      CAUTION: Do not allow Y to reach maximum value.  The whole pointer is incremented, so if Y is 2^18 - 1
 *      it becomes zero and X is also incremented.  The address calculation for the pointer uses the original X,
 *      but if a priority interrupt should occur before the calculation is complete, the incremented X is used
 *      when the instruction is repeated.
 *
 *      SPECIAL CONSIDERATIONS: If S is greater than P and also greater than 36, incrementing produces a new
 *      P equal to 100 - S rather than 36 - S.  For S > 36 the byte is at most the entire word; for P >= 36 no
 *      byte is processed (loading merely clears AC).  If both P and S are less than 36 but P + S > 36,
 *      a byte of size 36 - P is loaded from position P, or the right 36 - P bits of the byte are deposited
 *      in position P.
 *
 * NOTE: Until I can conduct real-world testing, I'm assuming when they say "100 - S", DEC really meant "64 - S",
 * which is 100 (base 8), which makes much more sense, since P is limited to a range of 00-77 (base 8).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIBP = function(op, acc)
{
    var inc = 0;
    var w = this.readWord(this.regEA);
    var p = (w / PDP10.OPCODE.P_SCALE) & PDP10.OPCODE.P_MASK;
    var s = (w >> PDP10.OPCODE.S_SHIFT) & PDP10.OPCODE.S_MASK;
    p -= s;
    if (p < 0) {
        inc++;
        p = 36 - s;
        if (p < 0) p = 64 - s;      // see SPECIAL CONSIDERATIONS and NOTE above
    }
    /*
     * Since the documentation above makes clear that the effect of the increment (of w) extends past the Y
     * bits and into (at least) the X bits, we first re-assemble a new pointer with updated P bits (along with
     * the original S bits and the remaining bits covered by PTR_MASK) and then increment as needed.
     *
     * Yes, PTR_MASK could have included the S bits as well and made the following expression a TINY bit simpler,
     * but I would like to keep PTR_MASK distinct from both the P and S fields.
     */
    w = (p * PDP10.OPCODE.P_SCALE) + (s << PDP10.OPCODE.S_SHIFT) + (w & PDP10.OPCODE.PTR_MASK);
    if (inc) w = (w + inc) % PDP10.WORD_LIMIT;
    this.writeWord(this.regEA, w);
};

/**
 * opILDB(0o134000): Increment Pointer and Load Byte
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-16:
 *
 *      Increment the byte pointer in location E as explained above. Then retrieve a byte of S bits from the
 *      location and position specified by the newly incremented pointer, load it into the right end of AC,
 *      and clear the remaining AC bits.  The location containing the byte is unaffected, the original contents
 *      of AC are lost.
 *
 *      SPECIAL CONSIDERATIONS: If S is greater than P and also greater than 36, incrementing produces a new
 *      P equal to 100 - S rather than 36 - S.  For S > 36 the byte is at most the entire word; for P >= 36 no
 *      byte is processed (loading merely clears AC).  If both P and S are less than 36 but P + S > 36,
 *      a byte of size 36 - P is loaded from position P, or the right 36 - P bits of the byte are deposited
 *      in position P.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opILDB = function(op, acc)
{
    /*
     * We're called in two phases: phase 1 is with regEA containing the address of the pointer, and phase 2
     * is with regEA containing the address of the bits to be loaded.
     *
     * We can implement this as a simple combination of opIBP() and opLDB(), but taking care that we only call
     * opIBP() on phase 1.
     */
    if (this.regPS < 0) {
        //noinspection JSUnresolvedFunction
        PDP10.opIBP.call(this, op, acc);
    }

    //noinspection JSUnresolvedFunction
    PDP10.opLDB.call(this, op, acc);
};

/**
 * opLDB(0o135000): Load Byte
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-16:
 *
 *      Retrieve a byte of S bits from the location and position specified by the pointer contained in location E,
 *      load it into the right end of AC, and clear the remaining AC bits.  The location containing the byte is
 *      unaffected, the original contents of AC are lost.
 *
 *      SPECIAL CONSIDERATIONS: If S is greater than P and also greater than 36, incrementing produces a new
 *      P equal to 100 - S rather than 36 - S.  For S > 36 the byte is at most the entire word; for P >= 36 no
 *      byte is processed (loading merely clears AC).  If both P and S are less than 36 but P + S > 36,
 *      a byte of size 36 - P is loaded from position P, or the right 36 - P bits of the byte are deposited
 *      in position P.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opLDB = function(op, acc)
{
    /*
     * We're called in two phases: phase 1 is with regEA containing the address of the pointer, and phase 2
     * is with regEA containing the address of the bits to be loaded.
     */
    var w = this.readWord(this.regEA);
    if (this.regPS < 0) {
        this.regPS = w;
        this.regRA = this.regEA | PDP10.OPCODE.I_BIT;
        this.advancePC(-1);
        return;
    }
    var p = (this.regPS / PDP10.OPCODE.P_SCALE) & PDP10.OPCODE.P_MASK;
    var s = (this.regPS >> PDP10.OPCODE.S_SHIFT) & PDP10.OPCODE.S_MASK;
    if (p + s <= 32) {
        /*
         * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
         * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
         * positive.
         */
        w = ((w >> p) & ((1 << s) - 1)) >>> 0;
    } else {
        /*
         * Regarding the SPECIAL CONSIDERATIONS above, even if the P ("shift") and/or S ("mask") values are
         * over-large, that should be fine, because nothing but additional zero bits will be included (provided
         * our memory is working properly and didn't give us more than 36 bits).
         */
        w = Math.trunc(w / Math.pow(2, p)) % Math.pow(2, s);
    }
    this.writeWord(acc, w);
    this.regPS = -1;
};

/**
 * opIDPB(0o136000): Increment Pointer and Deposit Byte
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-16:
 *
 *      Increment the byte pointer in location E as explained above.  Then deposit the right S bits of AC into
 *      the location and position specified by the newly incremented pointer.  The original contents of the bits
 *      that receive the byte are lost, AC and the remaining bits of the deposit location are unaffected.
 *
 *      SPECIAL CONSIDERATIONS: If S is greater than P and also greater than 36, incrementing produces a new
 *      P equal to 100 - S rather than 36 - S.  For S > 36 the byte is at most the entire word; for P >= 36 no
 *      byte is processed (loading merely clears AC).  If both P and S are less than 36 but P + S > 36,
 *      a byte of size 36 - P is loaded from position P, or the right 36 - P bits of the byte are deposited
 *      in position P.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIDPB = function(op, acc)
{
    /*
     * We're called in two phases: phase 1 is with regEA containing the address of the pointer, and phase 2
     * is with regEA containing the address of the bits to be stored.
     *
     * We can implement this as a simple combination of opIBP() and opDDB(), but taking care that we only call
     * opIBP() on phase 1.
     */
    if (this.regPS < 0) {
        //noinspection JSUnresolvedFunction
        PDP10.opIBP.call(this, op, acc);
    }

    //noinspection JSUnresolvedFunction
    PDP10.opDPB.call(this, op, acc);
};

/**
 * opDPB(0o137000): Deposit Byte
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-16:
 *
 *      Deposit the right S bits of AC into the location and position specified by the pointer contained
 *      in location E.  The original contents of the bits that receive the byte are lost, AC and the remaining
 *      bits of the deposit location are unaffected.
 *
 *      SPECIAL CONSIDERATIONS: If S is greater than P and also greater than 36, incrementing produces a new
 *      P equal to 100 - S rather than 36 - S.  For S > 36 the byte is at most the entire word; for P >= 36 no
 *      byte is processed (loading merely clears AC).  If both P and S are less than 36 but P + S > 36,
 *      a byte of size 36 - P is loaded from position P, or the right 36 - P bits of the byte are deposited
 *      in position P.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDPB = function(op, acc)
{
    /*
     * We're called in two phases: phase 1 is with regEA containing the address of the pointer, and phase 2
     * is with regEA containing the address of the bits to be stored.
     */
    var w = this.readWord(this.regEA);
    if (this.regPS < 0) {
        this.regPS = w;
        this.regRA = this.regEA | PDP10.OPCODE.I_BIT;
        this.advancePC(-1);
        return;
    }
    var p = (this.regPS / PDP10.OPCODE.P_SCALE) & PDP10.OPCODE.P_MASK;
    var s = (this.regPS >> PDP10.OPCODE.S_SHIFT) & PDP10.OPCODE.S_MASK;
    /*
     * Regarding the SPECIAL CONSIDERATIONS above, even if the P ("shift") and/or S ("mask") values are
     * over-large, we "mask" the resulting byte value (b) to 36 bits, so that when we re-assemble the final
     * result (w), there shouldn't be any overlap or overflow.
     */
    var b = ((this.readWord(acc) % Math.pow(2, s)) * Math.pow(2, p)) % PDP10.WORD_LIMIT;
    w = (w - (w % Math.pow(2, p + s))) + b + (w % Math.pow(2, p));
    this.writeWord(this.regEA, w);
    this.regPS = -1;
};

/**
 * opFAD(0o140000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFAD = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFADI(0o141000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFADI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFADM(0o142000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFADM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFADB(0o143000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFADB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFADR(0o144000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFADR = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFADRI(0o145000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFADRI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFADRM(0o146000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFADRM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFADRB(0o147000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFADRB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSB(0o150000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSBI(0o151000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSBI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSBM(0o152000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSBM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSBB(0o153000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSBB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSBR(0o154000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSBR = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSBRI(0o155000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSBRI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSBRM(0o156000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSBRM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFSBRB(0o157000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFSBRB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMP(0o160000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMP = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMPI(0o161000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMPI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMPM(0o162000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMPM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMPB(0o163000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMPB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMPR(0o164000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMPR = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMPRI(0o165000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMPRI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMPRM(0o166000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMPRM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFMPRB(0o167000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFMPRB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDV(0o170000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDV = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDVI(0o171000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDVI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDVM(0o172000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDVM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDVB(0o173000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDVB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDVR(0o174000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDVR = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDVRI(0o175000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDVRI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDVRM(0o176000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDVRM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opFDVRB(0o177000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opFDVRB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opMOVE(0o200000): Move
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Move one word from the source to the destination specified by M.  The source is unaffected,
 *      the original contents of the destination are lost.
 *
 * NOTE: This is a "Basic" mode instruction: the source is [E] and the destination is [A] (opposite of "Memory").
 *
 * Equivalents: opSETM(0o414000) and opSETMB(0o417000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVE = function(op, acc)
{
    this.writeWord(acc, this.readWord(this.regEA));
};

/**
 * opMOVEI(0o201000): Move Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Move one word from the source to the destination specified by M.  The source is unaffected,
 *      the original contents of the destination are lost.
 *
 *      SIDEBAR: MOVEI loads the word 0,E into AC and is thus equivalent to HRRZI.
 *
 * NOTE: This is an "Immediate" mode instruction: the source is the word 0,E and the destination is [A].
 *
 * Equivalents: opSETMI(0o415000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVEI = function(op, acc)
{
    this.writeWord(acc, this.regEA);
};

/**
 * opMOVEM(0o202000): Move to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Move one word from the source to the destination specified by M.  The source is unaffected,
 *      the original contents of the destination are lost.
 *
 * NOTE: This is a "Memory" mode instruction: the source is [A] and the destination is [E] (opposite of "Basic").
 *
 * Equivalents: opSETAM(0o426000) and opSETAB(0o427000).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVEM = function(op, acc)
{
    this.writeWord(this.regEA, this.readWord(acc));
};

/**
 * opMOVES(0o203000): Move to Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Move one word from the source to the destination specified by M.  The source is unaffected,
 *      the original contents of the destination are lost.
 *
 *      SIDEBAR: If A is zero, MOVES is a no-op; otherwise it is equivalent to MOVE.
 *
 * NOTE: This is a "Self" mode instruction: the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVES = function(op, acc)
{
    if (acc) this.writeWord(acc, this.readWord(this.regEA));
};

/**
 * opMOVS(0o204000): Move Swapped
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Interchange the left and right halves of the word from the source specified by M and move it to the
 *      specified destination.  The source is unaffected, the original contents of the destination are lost.
 *
 * NOTE: This is a "Basic" mode instruction: the source is [E] and the destination is [A] (opposite of "Memory").
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVS = function(op, acc)
{
    var src = this.readWord(this.regEA);
    src = ((src / PDP10.HALF_SHIFT)|0) + ((src % PDP10.HALF_SHIFT) * PDP10.HALF_SHIFT);
    this.writeWord(acc, src);
};

/**
 * opMOVSI(0o205000): Move Swapped Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Interchange the left and right halves of the word from the source specified by M and move it to the
 *      specified destination.  The source is unaffected, the original contents of the destination are lost.
 *
 *      SIDEBAR: Swapping halves in immediate mode loads the word E,0 into AC.  MOVSI is thus equivalent to HRLZI.
 *
 * NOTE: This is an "Immediate" mode instruction: the source is the word 0,E and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVSI = function(op, acc)
{
    this.writeWord(acc, this.regEA * PDP10.HALF_SHIFT);
};

/**
 * opMOVSM(0o206000): Move Swapped to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Interchange the left and right halves of the word from the source specified by M and move it to the
 *      specified destination.  The source is unaffected, the original contents of the destination are lost.
 *
 * NOTE: This is a "Memory" mode instruction: the source is [A] and the destination is [E] (opposite of "Basic").
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVSM = function(op, acc)
{
    var src = this.readWord(acc);
    src = ((src / PDP10.HALF_SHIFT)|0) + ((src % PDP10.HALF_SHIFT) * PDP10.HALF_SHIFT);
    this.writeWord(this.regEA, src);
};

/**
 * opMOVSS(0o207000): Move Swapped to Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Interchange the left and right halves of the word from the source specified by M and move it to the
 *      specified destination.  The source is unaffected, the original contents of the destination are lost.
 *
 * NOTE: This is a "Self" mode instruction: the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVSS = function(op, acc)
{
    var src = this.readWord(this.regEA);
    src = ((src / PDP10.HALF_SHIFT)|0) + ((src % PDP10.HALF_SHIFT) * PDP10.HALF_SHIFT);
    this.writeWord(this.regEA, src);
    if (acc) this.writeWord(acc, src)
};

/**
 * opMOVN(0o210000): Move Negative
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Negate the word from the source specified by M and move it to the specified destination.
 *      If the source word is fixed point -2^35 (400000 000000) set the Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^127 sets the flags, but this is not a normalized
 *      number).
 *
 *      If the source word is zero, set Carry 0 and Carry 1.  The source is unaffected, the original
 *      contents of the destination are lost.
 *
 * NOTE: This is a "Basic" mode instruction: the source is [E] and the destination is [A] (opposite of "Memory").
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVN = function(op, acc)
{
    this.writeWord(acc, this.negate(this.readWord(this.regEA)));
};

/**
 * opMOVNI(0o211000): Move Negative Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Negate the word from the source specified by M and move it to the specified destination.
 *      If the source word is fixed point -2^35 (400000 000000) set the Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^127 sets the flags, but this is not a normalized
 *      number).
 *
 *      If the source word is zero, set Carry 0 and Carry 1.  The source is unaffected, the original
 *      contents of the destination are lost.
 *
 *      SIDEBAR: MOVNI loads AC with the negative of the word 0,E and can set no flags.
 *
 * NOTE: This is an "Immediate" mode instruction: the source is the word 0,E and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVNI = function(op, acc)
{
    /*
     * We perform an in-line two's complement of regEA, since negate() updates the flags, and the documentation
     * above claims that this operation must "set no flags."  It's certainly true that regEA, being an 18-bit value,
     * could never be -2^35, but it COULD be zero -- and apparently this instruction treats zero differently from MOVN.
     *
     * TODO: Verify the "set no flags" assertion.
     */
    this.writeWord(acc, this.regEA? PDP10.TWO_POW36 - this.regEA : 0);
};

/**
 * opMOVNM(0o212000): Move Negative to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Negate the word from the source specified by M and move it to the specified destination.
 *      If the source word is fixed point -2^35 (400000 000000) set the Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^127 sets the flags, but this is not a normalized
 *      number).
 *
 *      If the source word is zero, set Carry 0 and Carry 1.  The source is unaffected, the original
 *      contents of the destination are lost.
 *
 * NOTE: This is a "Memory" mode instruction: the source is [A] and the destination is [E] (opposite of "Basic").
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVNM = function(op, acc)
{
    this.writeWord(this.regEA, this.negate(this.readWord(acc)));
};

/**
 * opMOVNS(0o213000): Move Negative to Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-11:
 *
 *      Negate the word from the source specified by M and move it to the specified destination.
 *      If the source word is fixed point -2^35 (400000 000000) set the Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^127 sets the flags, but this is not a normalized
 *      number).
 *
 *      If the source word is zero, set Carry 0 and Carry 1.  The source is unaffected, the original
 *      contents of the destination are lost.
 *
 * NOTE: This is a "Self" mode instruction: the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVNS = function(op, acc)
{
    var dst = this.negate(this.readWord(this.regEA));
    this.writeWord(this.regEA, dst);
    if (acc) this.writeWord(acc, dst);
};

/**
 * opMOVM(0o214000): Move Magnitude
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-12:
 *
 *      Take the magnitude of the word contained in the source specified by M and move it to the
 *      specified destination.  If the source word is fixed point -2^35 (400000 000000) set the
 *      Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^27 sets the flags, but this is not a normalized
 *      number).
 *
 *      The source is unaffected, the original contents of the destination are lost.
 *
 * NOTE: This is a "Basic" mode instruction: the source is [E] and the destination is [A] (opposite of "Memory").
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVM = function(op, acc)
{
    this.writeWord(acc, this.abs(this.readWord(this.regEA)));
};

/**
 * opMOVMI(0o215000): Move Magnitude Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-12:
 *
 *      Take the magnitude of the word contained in the source specified by M and move it to the
 *      specified destination.  If the source word is fixed point -2^35 (400000 000000) set the
 *      Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^27 sets the flags, but this is not a normalized
 *      number).
 *
 *      The source is unaffected, the original contents of the destination are lost.
 *
 *      SIDEBAR: The word 0,E is equivalent to its magnitude, so MOVMI is equivalent to MOVEI.
 *
 * NOTE: This is an "Immediate" mode instruction: the source is the word 0,E and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVMI = function(op, acc)
{
    this.writeWord(acc, this.regEA);
};

/**
 * opMOVMM(0o216000): Move Magnitude to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-12:
 *
 *      Take the magnitude of the word contained in the source specified by M and move it to the
 *      specified destination.  If the source word is fixed point -2^35 (400000 000000) set the
 *      Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^27 sets the flags, but this is not a normalized
 *      number).
 *
 *      The source is unaffected, the original contents of the destination are lost.
 *
 * NOTE: This is a "Memory" mode instruction: the source is [A] and the destination is [E] (opposite of "Basic").
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVMM = function(op, acc)
{
    this.writeWord(this.regEA, this.abs(this.readWord(acc)));
};

/**
 * opMOVMS(0o217000): Move Magnitude to Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-12:
 *
 *      Take the magnitude of the word contained in the source specified by M and move it to the
 *      specified destination.  If the source word is fixed point -2^35 (400000 000000) set the
 *      Overflow and Carry 1 flags.
 *
 *      (Negating the equivalent floating point -1 * 2^27 sets the flags, but this is not a normalized
 *      number).
 *
 *      The source is unaffected, the original contents of the destination are lost.
 *
 * NOTE: This is a "Self" mode instruction: the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMOVMS = function(op, acc)
{
    var dst = this.abs(this.readWord(this.regEA));
    this.writeWord(this.regEA, dst);
    if (acc) this.writeWord(acc, dst);
};

/**
 * opIMUL(0o220000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIMUL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIMULI(0o221000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIMULI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIMULM(0o222000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIMULM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIMULB(0o223000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIMULB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opMUL(0o224000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMUL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opMULI(0o225000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMULI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opMULM(0o226000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMULM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opMULB(0o227000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opMULB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIDIV(0o230000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIDIV = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIDIVI(0o231000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIDIVI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIDIVM(0o232000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIDIVM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIDIVB(0o233000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIDIVB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opDIV(0o234000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDIV = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opDIVI(0o235000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDIVI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opDIVM(0o236000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDIVM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opDIVB(0o237000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDIVB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opASH(0o240000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opASH = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opROT(0o241000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opROT = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opLSH(0o242000): Logical Shift
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-25:
 *
 *      Shift AC the number of places specified by E.  If E is positive, shift left bringing 0s into bit 35;
 *      data shifted out of bit 0 is lost.  If E is negative, shift right bringing 0s into bit 0; data shifted
 *      out of bit 35 is lost.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opLSH = function(op, acc)
{
    /*
     * Convert the unsigned 18-bit value in regEA to a signed 8-bit value.
     */
    var s = (this.regEA << 14) >> 24;
    if (s) {
        var w = this.readWord(acc);
        if (s > 0) {
            if (s >= 36) {
                w = 0;
            } else {
                w = (w * Math.pow(2, s)) % PDP10.WORD_LIMIT;
            }
        } else {
            if (s <= -36) {
                w = 0;
            } else {
                w = Math.trunc(w / Math.pow(2, -s));
            }
        }
        this.writeWord(acc, w);
    }
};

/**
 * opJFFO(0o243000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJFFO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opASHC(0o244000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opASHC = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opROTC(0o245000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opROTC = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opLSHC(0o246000): Logical Shift Combined
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-25:
 *
 *      Concatenate accumulators A and A+1 with A on the left, and shift the 72-bit combination the number
 *      of places specified by E.  If E is positive, shift left bringing 0s into bit 71 (bit 35 of AC A + 1);
 *      bit 36 is shifted into bit 35; data shifted out of bit 0 is lost.  If E is negative, shift right
 *      bringing 0s into bit 0; bit 35 is shifted into bit 36; data shifted out of bit 71 is lost.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opLSHC = function(op, acc)
{
    /*
     * Convert the unsigned 18-bit value in regEA to a signed 8-bit value.
     */
    var s = (this.regEA << 14) >> 24;
    if (s) {
        var wLeft = this.readWord(acc);
        var wRight = this.readWord((acc + 1) & 0o17);
        if (s > 0) {
            if (s >= 36) {
                wRight = 0;
                if (s >= 72) {
                    wLeft = 0;
                } else {
                    wLeft = (wRight * Math.pow(2, s - 36)) % PDP10.WORD_LIMIT;
                }
            } else {
                wLeft = ((wLeft * Math.pow(2, s)) % PDP10.WORD_LIMIT) + Math.trunc(wRight / Math.pow(2, 36 - s));
                wRight = (wRight * Math.pow(2, s)) % PDP10.WORD_LIMIT;
            }
        } else {
            if (s <= -36) {
                wLeft = 0;
                if (s <= -72) {
                    wRight = 0;
                } else {
                    wRight = Math.trunc(wLeft / Math.pow(2, -s - 36));
                }
            } else {
                wRight = Math.trunc(wRight / Math.pow(2, -s)) + ((wLeft * Math.pow(2, 36 + s)) % PDP10.WORD_LIMIT);
                wLeft = Math.trunc(wLeft / Math.pow(2, -s));
            }
        }
        this.writeWord(acc, wLeft);
        this.writeWord((acc + 1) & 0o17, wRight);
    }
};

/**
 * opEXCH(0o250000): Exchange
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-9:
 *
 *      Move the contents of location E to AC and move AC to location E.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opEXCH = function(op, acc)
{
    var tmp = this.readWord(acc);
    this.writeWord(acc, this.readWord(this.regEA));
    this.writeWord(this.regEA, tmp);
};

/**
 * opBLT(0o251000): Block Transfer
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-10:
 *
 *      Beginning at the location addressed by AC left, move words to another area of memory beginning at the
 *      location addressed by AC right.  Continue until a word is moved to location E.  The total number of words
 *      in the block is thus E - AC(right) + 1.
 *
 *      CAUTION: Priority interrupts are allowed during the execution of this instruction, following the processing
 *      of each word.  If an interrupt occurs, the BLT stores the source and destination addresses for the next word
 *      in AC, so when the processor restarts upon the return to the interrupted program, it actually resumes at
 *      the correct point within the BLT.  Therefore, unless the interrupt system is inactive, A and X must not address
 *      the same register as this would produce a different effective address calculation upon resumption should an
 *      interrupt occur; and the program must not attempt to load an accumulator addressed either by A or X unless it
 *      is the final location being loaded.  Furthermore, the program cannot assume that AC is the same after the BLT
 *      as it was before.
 *
 * TODO: Determine the logic behind SIMH's bizarre treatment of the AC register when it's part of the memory
 * being transferred.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opBLT = function(op, acc)
{
    var fDone = false;
    var addrDst = this.readWord(acc);
    var addrSrc = (addrDst / PDP10.HALF_SHIFT)|0;
    addrDst &= PDP10.HALF_MASK;
    while (!fDone) {
        this.writeWord(addrDst, this.readWord(addrSrc));
        if (addrDst == this.regEA) fDone = true;
        addrSrc = (addrSrc + 1) & PDP10.HALF_MASK;
        addrDst = (addrDst + 1) & PDP10.HALF_MASK;
        if (!this.isRunning()) {
            /*
             * Since the CPU isn't currently running, the CPU is presumably being stepped, so we'll treat that the
             * same as the "priority interrupt" condition described above, update the accumulator, rewind the PC, and leave.
             */
            this.writeWord(acc, addrSrc * PDP10.HALF_SHIFT + addrDst);
            if (!fDone) this.advancePC(-1);
            fDone = true;
        }
    }
};

/**
 * opAOBJP(0o252000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOBJP = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOBJN(0o253000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOBJN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJRST(0o254000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJRST = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJFCL(0o255000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJFCL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opXCT(0o256000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opXCT = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opPUSHJ(0o260000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opPUSHJ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opPUSH(0o261000): Push Down
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-13:
 *
 *      Add 000001 000001 to AC to increment both halves by one, then move the contents of location E to the
 *      location now addressed by AC right.  If the addition causes the count in AC left to reach zero, set the
 *      Pushdown Overflow flag.  The contents of E are unaffected, the original contents of the location added
 *      to the list are lost.
 *
 * If we trusted SIMH, then we could not literally interpret this instruction as adding 000001 000001 to AC,
 * because if AC contained 777777 777777, adding 000001 000001 would result in 000001 000000, not 000000 000000,
 * and yet 000000 000000 is EXACTLY what we get in SIMH.
 *
 * And yet, DEC's documentation clearly contradicts what SIMH is doing:
 *
 *      The incrementing and decrementing of both halves of AC simultaneously is effected by adding and subtracting
 *      000001 000001.  Hence a count of -2 in AC left is increased to zero if 2^18 - 1 is incremented in AC right,
 *      and conversely, 1 in AC left is decreased to -1 if zero is decremented in AC right.
 *
 * Perhaps SIMH is simply emulating the behavior of some later PDP-10 model, which performed independent increments?
 *
 * TODO: Investigate.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opPUSH = function(op, acc)
{
    var p = this.readWord(acc);
    if (!SIMH) {
        /*
         * This is the behavior that is clearly documented by DEC.
         */
        p += 0o000001000001;
        this.writeWord(p & PDP10.HALF_MASK, this.readWord(this.regEA));
        if (p >= PDP10.WORD_LIMIT) p -= PDP10.WORD_LIMIT;
        if (!((p / PDP10.HALF_SHIFT)|0)) this.fPDOverflow = true;
    } else {
        /*
         * This is the SIMH behavior, which appears to increment each half of AC independently.
         */
        var addr = (p + 1) & PDP10.HALF_MASK;
        this.writeWord(addr, this.readWord(this.regEA));
        p = (p + 0o000001000000) - (p & PDP10.HALF_MASK) + addr;
        if (p >= PDP10.WORD_LIMIT) {
            p -= PDP10.WORD_LIMIT;
            this.fPDOverflow = true;
        }
    }
    this.writeWord(acc, p);
};

/**
 * opPOP(0o262000): Pop Up
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-13:
 *
 *      Move the contents of the location addressed by AC right to location E, then subtract 000001 000001
 *      from AC to decrement both halves by one.  If the subtraction causes the count in AC left to reach -1,
 *      set the Pushdown Overflow flag.  The original contents of E are lost.
 *
 *      NOTE: Because of the order in which the operands are stored, the instruction POP AC,AC would load the
 *      contents of the location addressed by AC right into AC on top of the pushdown count, destroying it.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opPOP = function(op, acc)
{
    var p = this.readWord(acc);
    var src = this.readWord(p & PDP10.HALF_MASK);
    this.writeWord(this.regEA, src);
    if (this.regEA == acc) p = src;     // this avoids re-reading the accumulator if the write just overwrote it
    p -= 0o000001000001;
    if (p < 0) p += PDP10.WORD_LIMIT;
    if (((p / PDP10.HALF_SHIFT)|0) == PDP10.HALF_MASK) this.fPDOverflow = true;
    this.writeWord(acc, p);
};

/**
 * opPOPJ(0o263000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opPOPJ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJSR(0o264000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJSR = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJSP(0o265000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJSP = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJSA(0o266000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJSA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJRA(0o267000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJRA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opADD(0o270000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opADD = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opADDI(0o271000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opADDI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opADDM(0o272000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opADDM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opADDB(0o273000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opADDB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSUB(0o274000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSUB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSUBI(0o275000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSUBI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSUBM(0o276000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSUBM = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSUBB(0o277000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSUBB = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAI(0o300000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAIL(0o301000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAIL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAIE(0o302000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAIE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAILE(0o303000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAILE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAIA(0o304000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAIA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAIGE(0o305000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAIGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAIN(0o306000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAIN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAIG(0o307000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAIG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCA(0o310000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAL(0o311000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAE(0o312000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCALE(0o313000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCALE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAA(0o314000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAGE(0o315000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAN(0o316000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCAG(0o317000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCAG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMP(0o320000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMP = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMPL(0o321000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMPL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMPE(0o322000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMPE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMPLE(0o323000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMPLE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMPA(0o324000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMPA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMPGE(0o325000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMPGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMPN(0o326000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMPN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opJUMPG(0o327000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opJUMPG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIP(0o330000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIP = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIPL(0o331000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIPL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIPE(0o332000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIPE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIPLE(0o333000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIPLE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIPA(0o334000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIPA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIPGE(0o335000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIPGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIPN(0o336000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIPN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSKIPG(0o337000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSKIPG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJ(0o340000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJL(0o341000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJE(0o342000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJLE(0o343000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJLE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJA(0o344000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJGE(0o345000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJN(0o346000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOJG(0o347000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOJG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOS(0o350000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOS = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOSL(0o351000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOSL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOSE(0o352000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOSE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOSLE(0o353000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOSLE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOSA(0o354000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOSA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOSGE(0o355000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOSGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOSN(0o356000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOSN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opAOSG(0o357000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAOSG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJ(0o360000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJL(0o361000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJE(0o362000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJLE(0o363000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJLE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJA(0o364000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJGE(0o365000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJN(0o366000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOJG(0o367000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOJG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOS(0o370000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOS = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOSL(0o371000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOSL = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOSE(0o372000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOSE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOSLE(0o373000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOSLE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOSA(0o374000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOSA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOSGE(0o375000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOSGE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOSN(0o376000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOSN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSOSG(0o377000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSOSG = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opSETZ(0o400000): Set to Zeros
 * opSETZI(0o401000): Set to Zeros Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-18:
 *
 *      Change the contents of the destination specified by M to all 0s.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETZ = function(op, acc)
{
    this.writeWord(acc, 0);
};

/**
 * opSETZM(0o402000): Set to Zeros Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-18:
 *
 *      Change the contents of the destination specified by M to all 0s.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETZM = function(op, acc)
{
    this.writeWord(this.regEA, 0);
};

/**
 * opSETZB(0o403000): Set to Zeros Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-18:
 *
 *      Change the contents of the destination specified by M to all 0s.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETZB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, 0));
};

/**
 * opAND(0o404000): And with AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the specified operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opAND = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opANDI(0o405000): And with AC Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the specified operand (E) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDI = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(this.readWord(acc), this.regEA));
};

/**
 * opANDM(0o406000): And with AC to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([E]) to the AND function of the specified operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doAND(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opANDB(0o407000): And with AC to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the AND function of the specified operand ([E])
 *      and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doAND(this.readWord(acc), this.readWord(this.regEA))));
};

/**
 * opANDCA(0o410000): And with Complement of AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the specified operand ([E])
 *      and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCA = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opANDCAI(0o411000): And with Complement of AC Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the specified operand (E)
 *      and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCAI = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), this.regEA));
};

/**
 * opANDCAM(0o412000): And with Complement of AC to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([E]) to the AND function of the specified operand ([E])
 *      and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCAM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opANDCAB(0o413000): And with Complement of AC to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the AND function of the specified operand ([E])
 *      and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCAB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), this.readWord(this.regEA))));
};

/**
 * opANDCM(0o420000): And Complement of Memory with AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the complement of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCM = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opANDCMI(0o421000): And Complement of Memory Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the complement of the specified
 *      operand (E) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCMI = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(this.readWord(acc), PDP10.WORD_MASK - this.regEA));
};

/**
 * opANDCMM(0o422000): And Complement of Memory to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([E]) to the AND function of the complement of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCMM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doAND(this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opANDCMB(0o423000): And Complement of Memory to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-20:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the AND function of the complement of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCMB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doAND(this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA))));
};

/**
 * opXOR(0o430000): Exclusive Or with AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([AC]) to the exclusive OR function of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opXOR = function(op, acc)
{
    this.writeWord(acc, PDP10.doEOR(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opXORI(0o431000): Exclusive Or Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([AC]) to the exclusive OR function of the specified
 *      operand (E) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opXORI = function(op, acc)
{
    this.writeWord(acc, PDP10.doEOR(this.readWord(acc), this.regEA));
};

/**
 * opXORM(0o432000): Exclusive Or to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([E]) to the exclusive OR function of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opXORM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doEOR(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opXORB(0o433000): Exclusive Or to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the exclusive OR function of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opXORB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doEOR(this.readWord(acc), this.readWord(this.regEA))));
};

/**
 * opIOR(0o434000): Inclusive Or with AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIOR = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opIORI(0o435000): Inclusive Or with AC Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the specified
 *      operand (E) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIORI = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(this.readWord(acc), this.regEA));
};

/**
 * opIORM(0o436000): Inclusive Or with AC to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([E]) to the inclusive OR function of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIORM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doIOR(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opIORB(0o437000): Inclusive Or with AC to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the inclusive OR function of the specified
 *      operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIORB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doIOR(this.readWord(acc), this.readWord(this.regEA))));
};

/**
 * opANDCB(0o440000): And Complements of Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the complements of both
 *      the specified operand ([E]) and [AC].  The result is the NOR function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCB = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opANDCBI(0o441000): And Complements of Both Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([AC]) to the AND function of the complements of both
 *      the specified operand (E) and [AC].  The result is the NOR function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCBI = function(op, acc)
{
    this.writeWord(acc, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.regEA));
};

/**
 * opANDCBM(0o442000): And Complements of Both to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([E]) to the AND function of the complements of both
 *      the specified operand ([E]) and [AC].  The result is the NOR function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCBM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opANDCBB(0o443000): And Complements of Both to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the AND function of the complements of both
 *      the specified operand ([E]) and [AC].  The result is the NOR function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opANDCBB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doAND(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA))));
};

/**
 * opEQV(0o444000): Equivalence with AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-23:
 *
 *      Change the contents of the destination specified by M ([AC]) to the complement of the exclusive OR function of the
 *      specified operand ([E]) and [AC] (the result has 1s wherever the corresponding bits of the operands are the same).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opEQV = function(op, acc)
{
    this.writeWord(acc, PDP10.doEQV(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opEQVI(0o445000): Equivalence Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-23:
 *
 *      Change the contents of the destination specified by M ([AC]) to the complement of the exclusive OR function of the
 *      specified operand (E) and [AC] (the result has 1s wherever the corresponding bits of the operands are the same).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opEQVI = function(op, acc)
{
    this.writeWord(acc, PDP10.doEQV(this.readWord(acc), this.regEA));
};

/**
 * opEQVM(0o446000): Equivalence to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-23:
 *
 *      Change the contents of the destination specified by M ([E]) to the complement of the exclusive OR function of the
 *      specified operand ([E]) and [AC] (the result has 1s wherever the corresponding bits of the operands are the same).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opEQVM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doEQV(this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opEQVB(0o447000): Equivalence to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-23:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the complement of the exclusive OR function of the
 *      specified operand ([E]) and [AC] (the result has 1s wherever the corresponding bits of the operands are the same).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opEQVB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doEQV(this.readWord(acc), this.readWord(this.regEA))));
};

/**
 * opSETCA(0o450000): Set to Complement of AC
 * opSETCAI(0o451000): Set to Complement of AC Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-19:
 *
 *      Change the contents of the destination specified by M ([AC]) to the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETCA = function(op, acc)
{
    this.writeWord(acc, PDP10.WORD_MASK - this.readWord(acc));
};

/**
 * opSETCAM(0o452000): Set to Complement of AC Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-19:
 *
 *      Change the contents of the destination specified by M ([E]) to the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETCAM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.WORD_MASK - this.readWord(acc));
};

/**
 * opSETCAB(0o453000): Set to Complement of AC Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-19:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETCAB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.WORD_MASK - this.readWord(acc)));
};

/**
 * opORCA(0o454000): Inclusive Or with Complement of AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the specified
 *      operand ([E]) and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCA = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opORCAI(0o455000): Inclusive Or with Complement of AC Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the specified
 *      operand (E) and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCAI = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), this.regEA));
};

/**
 * opORCAM(0o456000): Inclusive Or with Complement of AC to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([E]) to the inclusive OR function of the specified
 *      operand ([E]) and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCAM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), this.readWord(this.regEA)));
};

/**
 * opORCAB(0o457000): Inclusive Or with Complement of AC to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-21:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the inclusive OR function of the specified
 *      operand ([E]) and the complement of [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCAB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), this.readWord(this.regEA))));
};

/**
 * opSETCM(0o460000): Set to Complement of Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-19:
 *
 *      Change the contents of the destination specified by M ([AC]) to the complement of the specified source
 *      operand ([E]).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETCM = function(op, acc)
{
    this.writeWord(acc, PDP10.WORD_MASK - this.readWord(this.regEA));
};

/**
 * opSETCMI(0o461000): Set to Complement of Memory Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-19:
 *
 *      Change the contents of the destination specified by M ([AC]) to the complement of the specified source
 *      operand (E).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETCMI = function(op, acc)
{
    this.writeWord(acc, PDP10.WORD_MASK - this.regEA);
};

/**
 * opSETCMM(0o462000): Set to Complement of Memory Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-19:
 *
 *      Change the contents of the destination specified by M ([E]) to the complement of the specified source
 *      operand ([E]).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETCMM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.WORD_MASK - this.readWord(this.regEA));
};

/**
 * opSETCMB(0o463000): Set to Complement of Memory Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-19:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the complement of the specified source
 *      operand ([E]).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETCMB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opORCM(0o464000): Inclusive Or Complement of Memory with AC
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the complement of the
 *      specified operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCM = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opORCMI(0o465000): Inclusive Or Complement of Memory Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the complement of the
 *      specified operand (E) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCMI = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(this.readWord(acc), PDP10.WORD_MASK - this.regEA));
};

/**
 * opORCMM(0o466000): Inclusive Or Complement of Memory to Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([E]) to the inclusive OR function of the complement of the
 *      specified operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCMM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doIOR(this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opORCMB(0o467000): Inclusive Or Complement of Memory to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the inclusive OR function of the complement of the
 *      specified operand ([E]) and [AC].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCMB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doIOR(this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA))));
};

/**
 * opORCB(0o470000): Inclusive Or Complements of Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the complements of both
 *      the specified operand ([E]) and [AC].  The result is the NAND function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCB = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opORCBI(0o471000): Inclusive Or Complements of Both Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([AC]) to the inclusive OR function of the complements of both
 *      the specified operand (E) and [AC].  The result is the NAND function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCBI = function(op, acc)
{
    this.writeWord(acc, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.regEA));
};

/**
 * opORCBM(0o472000): Inclusive Or Complements of Both To Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([E]) to the inclusive OR function of the complements of both
 *      the specified operand ([E]) and [AC].  The result is the NAND function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCBM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA)));
};

/**
 * opORCBB(0o473000): Inclusive Or Complements of Both to Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-22:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to the inclusive OR function of the complements of both
 *      the specified operand ([E]) and [AC].  The result is the NAND function of the operands.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opORCBB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.doIOR(PDP10.WORD_MASK - this.readWord(acc), PDP10.WORD_MASK - this.readWord(this.regEA))));
};

/**
 * opSETO(0o474000): Set to Ones
 * opSETOI(0o475000): Set to Ones Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-18:
 *
 *      Change the contents of the destination specified by M (AC) to all 1s.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETO = function(op, acc)
{
    this.writeWord(acc, PDP10.WORD_MASK);
};

/**
 * opSETOM(0o476000): Set to Ones Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-18:
 *
 *      Change the contents of the destination specified by M ([E]) to all 1s.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETOM = function(op, acc)
{
    this.writeWord(this.regEA, PDP10.WORD_MASK);
};

/**
 * opSETOB(0o477000): Set to Ones Both
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-18:
 *
 *      Change the contents of the destination specified by M ([E] and [AC]) to all 1s.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opSETOB = function(op, acc)
{
    this.writeWord(this.regEA, this.writeWord(acc, PDP10.WORD_MASK));
};

/**
 * opHLL(0o5N0000): Half Word Left to Left
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-3:
 *
 *      Move the left half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination are lost.
 *
 * For HLL, the source is [E] and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLL = function(op, acc)
{
    var src = this.readWord(this.regEA);
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHR(op, dst, src) + (src - (src & PDP10.HALF_MASK)));
};

/**
 * opHLLI(0o5N1000): Half Word Left to Left, Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-3:
 *
 *      Move the left half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination are lost.
 *
 *      SIDEBAR: HLLI merely clears AC left.
 *
 * For HLLI, the source is 0,E and the destination is [A].  But since this is a left-half-only operation, src is
 * effectively 0.
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLLI = function(op, acc)
{
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHR(op, dst, 0));
};

/**
 * opHLLM(0o5N2000): Half Word Left to Left, Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-3:
 *
 *      Move the left half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination are lost.
 *
 * For HLLM, the source is [A] and the destination is [E].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLLM = function(op, acc)
{
    var src = this.readWord(acc);
    var dst = this.readWord(this.regEA);
    this.writeWord(this.regEA, PDP10.getHR(op, dst, src) + (src - (src & PDP10.HALF_MASK)));
};

/**
 * opHLLS(0o5N3000): Half Word Left to Left, Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-3:
 *
 *      Move the left half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination are lost.
 *
 *      SIDEBAR: If A is zero, HLLS is a no-op, otherwise it is equivalent to HLL.
 *
 * For HLLS, the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLLS = function(op, acc)
{
    var dst = this.readWord(this.regEA);
    dst = PDP10.setHR(op, dst, dst);
    this.writeWord(this.regEA, dst);
    if (acc) this.writeWord(acc, dst);
};

/**
 * opHRL(0o504000): Half Word Right to Left
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-4:
 *
 *      Move the right half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination left
 *      half are lost.
 *
 * For HRL, the source is [E] and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRL = function(op, acc)
{
    var src = (this.readWord(this.regEA) & PDP10.HALF_MASK) * PDP10.HALF_SHIFT;
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHR(op, dst, src) + src);
};

/**
 * opHRLI(0o505000): Half Word Right to Left, Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-4:
 *
 *      Move the right half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination left
 *      half are lost.
 *
 * For HRLI, the source is 0,E and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRLI = function(op, acc)
{
    var src = this.regEA * PDP10.HALF_SHIFT;
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHR(op, dst, src) + src);
};

/**
 * opHRLM(0o506000): Half Word Right to Left, Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-4:
 *
 *      Move the right half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination left
 *      half are lost.
 *
 * For HRLM, the source is [A] and the destination is [E].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRLM = function(op, acc)
{
    var src = (this.readWord(acc) & PDP10.HALF_MASK) * PDP10.HALF_SHIFT;
    var dst = this.readWord(this.regEA);
    this.writeWord(this.regEA, PDP10.getHR(op, dst, src) + src);
};

/**
 * opHRLS(0o507000): Half Word Right to Left, Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-4:
 *
 *      Move the right half of the source word specified by M to the left half of the specified destination.
 *      The source and the destination right half are unaffected; the original contents of the destination left
 *      half are lost.
 *
 * For HRLS, the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRLS = function(op, acc)
{
    var dst = this.readWord(this.regEA);
    var src = (dst & PDP10.HALF_MASK) * PDP10.HALF_SHIFT;
    dst = PDP10.getHR(op, dst, src) + src;
    this.writeWord(this.regEA, dst);
    if (acc) this.writeWord(acc, dst);
};

/**
 * opHRR(0o540000): Half Word Right to Right
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-6:
 *
 *      Move the right half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right
 *      half are lost.
 *
 * For HRR, the source is [E] and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRR = function(op, acc)
{
    var src = this.readWord(this.regEA) & PDP10.HALF_MASK;
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHL(op, dst, src) + src);
};

/**
 * opHRRI(0o541000): Half Word Right to Right, Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-6:
 *
 *      Move the right half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right
 *      half are lost.
 *
 * For HRRI, the source is 0,E and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRRI = function(op, acc)
{
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHL(op, dst, this.regEA) + this.regEA);
};

/**
 * opHRRM(0o542000): Half Word Right to Right, Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-6:
 *
 *      Move the right half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right
 *      half are lost.
 *
 * For HRRM, the source is [A] and the destination is [E].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRRM = function(op, acc)
{
    var src = this.readWord(acc) & PDP10.HALF_MASK;
    var dst = this.readWord(this.regEA);
    this.writeWord(this.regEA, PDP10.getHL(op, dst, src) + src);
};

/**
 * opHRRS(0o543000): Half Word Right to Right, Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-6:
 *
 *      Move the right half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right
 *      half are lost.
 *
 *      SIDEBAR: If A is zero, HRRS is a no-op; otherwise it is equivalent to HRR.
 *
 * For HRRS, the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHRRS = function(op, acc)
{
    var dst = this.readWord(this.regEA);
    dst = PDP10.setHL(op, dst, dst);
    this.writeWord(this.regEA, dst);
    if (acc) this.writeWord(acc, dst);
};

/**
 * opHLR(0o544000): Half Word Left to Right
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-7:
 *
 *      Move the left half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right half are lost.
 *
 * For HLR, the source is [E] and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLR = function(op, acc)
{
    var src = (this.readWord(this.regEA) / PDP10.HALF_SHIFT)|0;
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHL(op, dst, src) + src);
};

/**
 * opHLRI(0o545000): Half Word Left to Right, Immediate
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-7:
 *
 *      Move the left half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right half are lost.
 *
 *      SIDEBAR: HLRI merely clears AC right.
 *
 * For HLRI, the source is 0,E and the destination is [A].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLRI = function(op, acc)
{
    var dst = this.readWord(acc);
    this.writeWord(acc, PDP10.getHL(op, dst, 0));
};

/**
 * opHLRM(0o546000): Half Word Left to Right, Memory
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-7:
 *
 *      Move the left half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right half are lost.
 *
 * For HLRM, the source is [A] and the destination is [E].
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLRM = function(op, acc)
{
    var src = (this.readWord(acc) / PDP10.HALF_SHIFT)|0;
    var dst = this.readWord(this.regEA);
    this.writeWord(this.regEA, PDP10.getHL(op, dst, src) + src);
};

/**
 * opHLRS(0o547000): Half Word Left to Right, Self
 *
 * From the DEC PDP-10 System Reference Manual (May 1968), p. 2-7:
 *
 *      Move the left half of the source word specified by M to the right half of the specified destination.
 *      The source and the destination left half are unaffected; the original contents of the destination right half are lost.
 *
 * For HLRS, the source AND destination is [E] (and also [A] if A is non-zero).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opHLRS = function(op, acc)
{
    var dst = this.readWord(this.regEA);
    var src = (dst / PDP10.HALF_SHIFT)|0;
    dst = PDP10.getHL(op, dst, src) + src;
    this.writeWord(this.regEA, dst);
    if (acc) this.writeWord(acc, dst);
};

/**
 * opTRN(0o600000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLN(0o601000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRNE(0o602000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRNE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLNE(0o603000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLNE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRNA(0o604000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRNA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLNA(0o605000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLNA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRNN(0o606000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRNN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLNN(0o607000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLNN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDN(0o610000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSN(0o611000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDNE(0o612000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDNE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSNE(0o613000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSNE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDNA(0o614000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDNA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSNA(0o615000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSNA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDNN(0o616000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDNN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSNN(0o617000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSNN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRZ(0o620000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRZ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLZ(0o621000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLZ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRZE(0o622000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRZE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLZE(0o623000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLZE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRZA(0o624000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRZA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLZA(0o625000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLZA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRZN(0o626000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRZN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLZN(0o627000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLZN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDZ(0o630000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDZ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSZ(0o631000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSZ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDZE(0o632000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDZE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSZE(0o633000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSZE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDZA(0o634000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDZA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSZA(0o635000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSZA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDZN(0o636000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDZN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSZN(0o637000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSZN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRC(0o640000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRC = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLC(0o641000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLC = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRCE(0o642000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRCE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLCE(0o643000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLCE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRCA(0o644000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRCA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLCA(0o645000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLCA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRCN(0o646000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRCN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLCN(0o647000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLCN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDC(0o650000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDC = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSC(0o651000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSC = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDCE(0o652000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDCE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSCE(0o653000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSCE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDCA(0o654000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDCA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSCA(0o655000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSCA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDCN(0o656000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDCN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSCN(0o657000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSCN = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRO(0o660000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLO(0o661000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTROE(0o662000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTROE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLOE(0o663000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLOE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTROA(0o664000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTROA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLOA(0o665000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLOA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTRON(0o666000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTRON = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTLON(0o667000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTLON = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDO(0o670000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSO(0o671000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDOE(0o672000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDOE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSOE(0o673000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSOE = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDOA(0o674000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDOA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSOA(0o675000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSOA = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTDON(0o676000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTDON = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opTSON(0o677000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opTSON = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opBLKI(0o700000)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opBLKI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opDATAI(0o700040)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDATAI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opBLKO(0o700100)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opBLKO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opDATAO(0o700140)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opDATAO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCONO(0o700200)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCONO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCONI(0o700240)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCONI = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCONSZ(0o700300)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCONSZ = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opCONSO(0o700340)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opCONSO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opIO(op, acc)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opIO = function(op, acc)
{
    this.opUndefined(op);
};

/**
 * opNOP(op, acc)
 *
 * Used for all "defined" operations that, in fact, do nothing (eg, SETA and SETAI).
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} acc
 */
PDP10.opNOP = function(op, acc)
{
};

/**
 * opUndefined(op, acc)
 *
 * @this {CPUStatePDP10}
 * @param {number} op
 * @param {number} [acc]
 */
PDP10.opUndefined = function(op, acc)
{
    this.println("undefined opcode: " + Str.toOct(op));
    this.advancePC(-1);
    this.stopCPU();
};

/**
 * getHL(op, dst, src)
 *
 * Used by callers to obtain HL (half-word left) with HR (half-word right) zeroed.
 *
 * @param {number} op
 * @param {number} dst (36-bit value whose 18-bit left half is either preserved or modified)
 * @param {number} src (18-bit value used to determine the sign extension, if any, for the left half of dst)
 * @return {number} (updated dst)
 */
PDP10.getHL = function(op, dst, src)
{
    switch(op & 0o600) {
    case 0o000:
        dst -= (dst & PDP10.HALF_MASK);
        break;
    case 0o200:
        dst = 0;
        break;
    case 0o400:
        dst = (PDP10.HALF_MASK * PDP10.HALF_SHIFT);
        break;
    case 0o600:
        dst = (src > PDP10.MAX_POS18? (PDP10.HALF_MASK * PDP10.HALF_SHIFT) : 0);
        break;
    }
    return dst;
};

/**
 * setHL(op, dst, src)
 *
 * Used by callers to obtain HL (half-word left) with HR (half-word right) preserved.
 *
 * @param {number} op
 * @param {number} dst (36-bit value whose 18-bit left half is either preserved or modified)
 * @param {number} src (18-bit value used to determine the sign extension, if any, for the left half of dst)
 * @return {number} (updated dst)
 */
PDP10.setHL = function(op, dst, src)
{
    if (op &= 0o600) {
        dst &= PDP10.HALF_MASK;
        switch(op) {
        case 0o400:
            dst += (PDP10.HALF_MASK * PDP10.HALF_SHIFT);
            break;
        case 0o600:
            dst += (src > PDP10.MAX_POS18? (PDP10.HALF_MASK * PDP10.HALF_SHIFT) : 0);
            break;
        }
    }
    return dst;
};

/**
 * getHR(op, dst, src)
 *
 * Used by callers to obtain HR (half-word right) with HL (half-word left) zeroed.
 *
 * @param {number} op
 * @param {number} dst (36-bit value whose 18-bit right half is either preserved or modified)
 * @param {number} src (36-bit value used to determine the sign extension, if any, for the right half of dst)
 * @return {number} (updated dst)
 */
PDP10.getHR = function(op, dst, src)
{
    switch(op & 0o600) {
    case 0o000:
        dst = (dst & PDP10.HALF_MASK);
        break;
    case 0o200:
        dst = 0;
        break;
    case 0o400:
        dst = PDP10.HALF_MASK;
        break;
    case 0o600:
        dst = (src > PDP10.MAX_POS36? PDP10.HALF_MASK : 0);
        break;
    }
    return dst;
};

/**
 * setHR(op, dst, src)
 *
 * Used by callers to obtain HR (half-word right) with HL (half-word left) preserved.
 *
 * @param {number} op
 * @param {number} dst (36-bit value whose 18-bit right half is either preserved or modified)
 * @param {number} src (36-bit value used to determine the sign extension, if any, for the right half of dst)
 * @return {number} (updated dst)
 */
PDP10.setHR = function(op, dst, src)
{
    if (op &= 0o600) {
        dst -= (dst & PDP10.HALF_MASK);
        switch(op) {
        case 0o400:
            dst += PDP10.HALF_MASK;
            break;
        case 0o600:
            dst += (src > PDP10.MAX_POS36? PDP10.HALF_MASK : 0);
            break;
        }
    }
    return dst;
};

/**
 * doAND(dst, src)
 *
 * Used by callers to perform the logical "and" (AND) of two 36-bit operands.
 *
 * @param {number} dst (36-bit value)
 * @param {number} src (36-bit value)
 * @return {number} (dst & src)
 */
PDP10.doAND = function(dst, src)
{
    /*
     * Since dst and src are 36-bit values, we must AND the low 32 bits separately from the higher bits,
     * and then combine them with addition.  Since all bits above 36 will be zero, and since 0 AND 0 is 0,
     * no special masking for the higher bits is required.
     *
     * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
     * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
     * positive.
     */
    return ((((dst / PDP10.TWO_POW32)|0) & ((src / PDP10.TWO_POW32)|0)) * PDP10.TWO_POW32) + ((dst & src) >>> 0);
};

/**
 * doEOR(dst, src)
 *
 * Used by callers to perform the logical "exclusive-or" (XOR) of two 36-bit operands.
 *
 * @param {number} dst (36-bit value)
 * @param {number} src (36-bit value)
 * @return {number} (dst ^ src)
 */
PDP10.doEOR = function(dst, src)
{
    /*
     * Since dst and src are 36-bit values, we must XOR the low 32 bits separately from the higher bits,
     * and then combine them with addition.  Since all bits above 36 will be zero, and since 0 XOR 0 is 0,
     * no special masking for the higher bits is required.
     *
     * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
     * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
     * positive.
     */
    return ((((dst / PDP10.TWO_POW32)|0) ^ ((src / PDP10.TWO_POW32)|0)) * PDP10.TWO_POW32) + ((dst ^ src) >>> 0);
};

/**
 * doEQV(dst, src)
 *
 * Used by callers to perform the logical "equivalence" (EQV) of two 36-bit operands.
 *
 * @param {number} dst (36-bit value)
 * @param {number} src (36-bit value)
 * @return {number} (~(dst ^ src))
 */
PDP10.doEQV = function(dst, src)
{
    /*
     * Since dst and src are 36-bit values, we must EQV the low 32 bits separately from the higher bits,
     * and then combine them with addition.  Since all bits above 36 will be zero, and since 0 EQV 0 is 1,
     * we must mask the higher 4 bits with 0o17.
     *
     * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
     * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
     * positive.
     */
    return ((~(((dst / PDP10.TWO_POW32)|0) ^ ((src / PDP10.TWO_POW32)|0)) & 0o17) * PDP10.TWO_POW32) + (~(dst ^ src) >>> 0);
};

/**
 * doIOR(dst, src)
 *
 * Used by callers to perform the logical "inclusive-or" (OR) of two 36-bit operands.
 *
 * @param {number} dst (36-bit value)
 * @param {number} src (36-bit value)
 * @return {number} (dst | src)
 */
PDP10.doIOR = function(dst, src)
{
    /*
     * Since dst and src are 36-bit values, we must OR the low 32 bits separately from the higher bits,
     * and then combine them with addition.  Since all bits above 36 will be zero, and since 0 OR 0 is 0,
     * no special masking for the higher bits is required.
     *
     * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
     * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
     * positive.
     */
    return ((((dst / PDP10.TWO_POW32)|0) | ((src / PDP10.TWO_POW32)|0)) * PDP10.TWO_POW32) + ((dst | src) >>> 0);
};

/*
 * If we want the basic half-word operations to handle all the sub-operations; ie:
 *
 *      None
 *      Zero-extend
 *      One-extend
 *      Sign-extend
 *
 * then we need to alias all the sub-functions to the corresponding primary functions.
 */
PDP10.opHLLZ    = PDP10.opHLL;
PDP10.opHLLZI   = PDP10.opHLLI;
PDP10.opHLLZM   = PDP10.opHLLM;
PDP10.opHLLZS   = PDP10.opHLLS;
PDP10.opHLLO    = PDP10.opHLL;
PDP10.opHLLOI   = PDP10.opHLLI;
PDP10.opHLLOM   = PDP10.opHLLM;
PDP10.opHLLOS   = PDP10.opHLLS;
PDP10.opHLLE    = PDP10.opHLL;
PDP10.opHLLEI   = PDP10.opHLLI;
PDP10.opHLLEM   = PDP10.opHLLM;
PDP10.opHLLES   = PDP10.opHLLS;
PDP10.opHRLZ    = PDP10.opHRL;
PDP10.opHRLZI   = PDP10.opHRLI;
PDP10.opHRLZM   = PDP10.opHRLM;
PDP10.opHRLZS   = PDP10.opHRLS;
PDP10.opHRLO    = PDP10.opHRL;
PDP10.opHRLOI   = PDP10.opHRLI;
PDP10.opHRLOM   = PDP10.opHRLM;
PDP10.opHRLOS   = PDP10.opHRLS;
PDP10.opHRLE    = PDP10.opHRL;
PDP10.opHRLEI   = PDP10.opHRLI;
PDP10.opHRLEM   = PDP10.opHRLM;
PDP10.opHRLES   = PDP10.opHRLS;
PDP10.opHRRZ    = PDP10.opHRR;
PDP10.opHRRZI   = PDP10.opHRRI;
PDP10.opHRRZM   = PDP10.opHRRM;
PDP10.opHRRZS   = PDP10.opHRRS;
PDP10.opHRRO    = PDP10.opHRR;
PDP10.opHRROI   = PDP10.opHRRI;
PDP10.opHRROM   = PDP10.opHRRM;
PDP10.opHRROS   = PDP10.opHRRS;
PDP10.opHRRE    = PDP10.opHRR;
PDP10.opHRREI   = PDP10.opHRRI;
PDP10.opHRREM   = PDP10.opHRRM;
PDP10.opHRRES   = PDP10.opHRRS;
PDP10.opHLRZ    = PDP10.opHLR;
PDP10.opHLRZI   = PDP10.opHLRI;
PDP10.opHLRZM   = PDP10.opHLRM;
PDP10.opHLRZS   = PDP10.opHLRS;
PDP10.opHLRO    = PDP10.opHLR;
PDP10.opHLROI   = PDP10.opHLRI;
PDP10.opHLROM   = PDP10.opHLRM;
PDP10.opHLROS   = PDP10.opHLRS;
PDP10.opHLRE    = PDP10.opHLR;
PDP10.opHLREI   = PDP10.opHLRI;
PDP10.opHLREM   = PDP10.opHLRM;
PDP10.opHLRES   = PDP10.opHLRS;

PDP10.opSETZI   = PDP10.opSETZ;
PDP10.opSETOI   = PDP10.opSETO;
PDP10.opSETCAI  = PDP10.opSETCA;
PDP10.opSETA    = PDP10.opNOP;
PDP10.opSETAI   = PDP10.opNOP;
PDP10.opSETAM   = PDP10.opMOVEM;
PDP10.opSETAB   = PDP10.opMOVEM;
PDP10.opSETM    = PDP10.opMOVE;
PDP10.opSETMI   = PDP10.opMOVEI;
PDP10.opSETMM   = PDP10.opNOP;
PDP10.opSETMB   = PDP10.opMOVE;

PDP10.aOpXXX_KA10 = [
    PDP10.opUUO,                // 0o000xxx
    PDP10.opUUO,                // 0o001xxx
    PDP10.opUUO,                // 0o002xxx
    PDP10.opUUO,                // 0o003xxx
    PDP10.opUUO,                // 0o004xxx
    PDP10.opUUO,                // 0o005xxx
    PDP10.opUUO,                // 0o006xxx
    PDP10.opUUO,                // 0o007xxx
    PDP10.opUUO,                // 0o010xxx
    PDP10.opUUO,                // 0o011xxx
    PDP10.opUUO,                // 0o012xxx
    PDP10.opUUO,                // 0o013xxx
    PDP10.opUUO,                // 0o014xxx
    PDP10.opUUO,                // 0o015xxx
    PDP10.opUUO,                // 0o016xxx
    PDP10.opUUO,                // 0o017xxx
    PDP10.opUUO,                // 0o020xxx
    PDP10.opUUO,                // 0o021xxx
    PDP10.opUUO,                // 0o022xxx
    PDP10.opUUO,                // 0o023xxx
    PDP10.opUUO,                // 0o024xxx
    PDP10.opUUO,                // 0o025xxx
    PDP10.opUUO,                // 0o026xxx
    PDP10.opUUO,                // 0o027xxx
    PDP10.opUUO,                // 0o030xxx
    PDP10.opUUO,                // 0o031xxx
    PDP10.opUUO,                // 0o032xxx
    PDP10.opUUO,                // 0o033xxx
    PDP10.opUUO,                // 0o034xxx
    PDP10.opUUO,                // 0o035xxx
    PDP10.opUUO,                // 0o036xxx
    PDP10.opUUO,                // 0o037xxx
    PDP10.opUUO,                // 0o040xxx
    PDP10.opUUO,                // 0o041xxx
    PDP10.opUUO,                // 0o042xxx
    PDP10.opUUO,                // 0o043xxx
    PDP10.opUUO,                // 0o044xxx
    PDP10.opUUO,                // 0o045xxx
    PDP10.opUUO,                // 0o046xxx
    PDP10.opUUO,                // 0o047xxx
    PDP10.opUUO,                // 0o050xxx
    PDP10.opUUO,                // 0o051xxx
    PDP10.opUUO,                // 0o052xxx
    PDP10.opUUO,                // 0o053xxx
    PDP10.opUUO,                // 0o054xxx
    PDP10.opUUO,                // 0o055xxx
    PDP10.opUUO,                // 0o056xxx
    PDP10.opUUO,                // 0o057xxx
    PDP10.opUUO,                // 0o060xxx
    PDP10.opUUO,                // 0o061xxx
    PDP10.opUUO,                // 0o062xxx
    PDP10.opUUO,                // 0o063xxx
    PDP10.opUUO,                // 0o064xxx
    PDP10.opUUO,                // 0o065xxx
    PDP10.opUUO,                // 0o066xxx
    PDP10.opUUO,                // 0o067xxx
    PDP10.opUUO,                // 0o070xxx
    PDP10.opUUO,                // 0o071xxx
    PDP10.opUUO,                // 0o072xxx
    PDP10.opUUO,                // 0o073xxx
    PDP10.opUUO,                // 0o074xxx
    PDP10.opUUO,                // 0o075xxx
    PDP10.opUUO,                // 0o076xxx
    PDP10.opUUO,                // 0o077xxx
    PDP10.opUndefined,          // 0o100xxx
    PDP10.opUndefined,          // 0o101xxx
    PDP10.opUndefined,          // 0o102xxx
    PDP10.opUndefined,          // 0o103xxx
    PDP10.opUndefined,          // 0o104xxx
    PDP10.opUndefined,          // 0o105xxx
    PDP10.opUndefined,          // 0o106xxx
    PDP10.opUndefined,          // 0o107xxx
    PDP10.opUndefined,          // 0o110xxx
    PDP10.opUndefined,          // 0o111xxx
    PDP10.opUndefined,          // 0o112xxx
    PDP10.opUndefined,          // 0o113xxx
    PDP10.opUndefined,          // 0o114xxx
    PDP10.opUndefined,          // 0o115xxx
    PDP10.opUndefined,          // 0o116xxx
    PDP10.opUndefined,          // 0o117xxx
    PDP10.opUndefined,          // 0o120xxx
    PDP10.opUndefined,          // 0o121xxx
    PDP10.opUndefined,          // 0o122xxx
    PDP10.opUndefined,          // 0o123xxx
    PDP10.opUndefined,          // 0o124xxx
    PDP10.opUndefined,          // 0o125xxx
    PDP10.opUndefined,          // 0o126xxx
    PDP10.opUndefined,          // 0o127xxx
    PDP10.opUFA,                // 0o130xxx
    PDP10.opDFN,                // 0o131xxx
    PDP10.opFSC,                // 0o132xxx
    PDP10.opIBP,                // 0o133xxx
    PDP10.opILDB,               // 0o134xxx
    PDP10.opLDB,                // 0o135xxx
    PDP10.opIDPB,               // 0o136xxx
    PDP10.opDPB,                // 0o137xxx
    PDP10.opFAD,                // 0o140xxx
    PDP10.opFADI,               // 0o141xxx
    PDP10.opFADM,               // 0o142xxx
    PDP10.opFADB,               // 0o143xxx
    PDP10.opFADR,               // 0o144xxx
    PDP10.opFADRI,              // 0o145xxx
    PDP10.opFADRM,              // 0o146xxx
    PDP10.opFADRB,              // 0o147xxx
    PDP10.opFSB,                // 0o150xxx
    PDP10.opFSBI,               // 0o151xxx
    PDP10.opFSBM,               // 0o152xxx
    PDP10.opFSBB,               // 0o153xxx
    PDP10.opFSBR,               // 0o154xxx
    PDP10.opFSBRI,              // 0o155xxx
    PDP10.opFSBRM,              // 0o156xxx
    PDP10.opFSBRB,              // 0o157xxx
    PDP10.opFMP,                // 0o160xxx
    PDP10.opFMPI,               // 0o161xxx
    PDP10.opFMPM,               // 0o162xxx
    PDP10.opFMPB,               // 0o163xxx
    PDP10.opFMPR,               // 0o164xxx
    PDP10.opFMPRI,              // 0o165xxx
    PDP10.opFMPRM,              // 0o166xxx
    PDP10.opFMPRB,              // 0o167xxx
    PDP10.opFDV,                // 0o170xxx
    PDP10.opFDVI,               // 0o171xxx
    PDP10.opFDVM,               // 0o172xxx
    PDP10.opFDVB,               // 0o173xxx
    PDP10.opFDVR,               // 0o174xxx
    PDP10.opFDVRI,              // 0o175xxx
    PDP10.opFDVRM,              // 0o176xxx
    PDP10.opFDVRB,              // 0o177xxx
    PDP10.opMOVE,               // 0o200xxx
    PDP10.opMOVEI,              // 0o201xxx
    PDP10.opMOVEM,              // 0o202xxx
    PDP10.opMOVES,              // 0o203xxx
    PDP10.opMOVS,               // 0o204xxx
    PDP10.opMOVSI,              // 0o205xxx
    PDP10.opMOVSM,              // 0o206xxx
    PDP10.opMOVSS,              // 0o207xxx
    PDP10.opMOVN,               // 0o210xxx
    PDP10.opMOVNI,              // 0o211xxx
    PDP10.opMOVNM,              // 0o212xxx
    PDP10.opMOVNS,              // 0o213xxx
    PDP10.opMOVM,               // 0o214xxx
    PDP10.opMOVMI,              // 0o215xxx
    PDP10.opMOVMM,              // 0o216xxx
    PDP10.opMOVMS,              // 0o217xxx
    PDP10.opIMUL,               // 0o220xxx
    PDP10.opIMULI,              // 0o221xxx
    PDP10.opIMULM,              // 0o222xxx
    PDP10.opIMULB,              // 0o223xxx
    PDP10.opMUL,                // 0o224xxx
    PDP10.opMULI,               // 0o225xxx
    PDP10.opMULM,               // 0o226xxx
    PDP10.opMULB,               // 0o227xxx
    PDP10.opIDIV,               // 0o230xxx
    PDP10.opIDIVI,              // 0o231xxx
    PDP10.opIDIVM,              // 0o232xxx
    PDP10.opIDIVB,              // 0o233xxx
    PDP10.opDIV,                // 0o234xxx
    PDP10.opDIVI,               // 0o235xxx
    PDP10.opDIVM,               // 0o236xxx
    PDP10.opDIVB,               // 0o237xxx
    PDP10.opASH,                // 0o240xxx
    PDP10.opROT,                // 0o241xxx
    PDP10.opLSH,                // 0o242xxx
    PDP10.opJFFO,               // 0o243xxx
    PDP10.opASHC,               // 0o244xxx
    PDP10.opROTC,               // 0o245xxx
    PDP10.opLSHC,               // 0o246xxx
    PDP10.opUndefined,          // 0o247xxx
    PDP10.opEXCH,               // 0o250xxx
    PDP10.opBLT,                // 0o251xxx
    PDP10.opAOBJP,              // 0o252xxx
    PDP10.opAOBJN,              // 0o253xxx
    PDP10.opJRST,               // 0o254xxx
    PDP10.opJFCL,               // 0o255xxx
    PDP10.opXCT,                // 0o256xxx
    PDP10.opUndefined,          // 0o257xxx
    PDP10.opPUSHJ,              // 0o260xxx
    PDP10.opPUSH,               // 0o261xxx
    PDP10.opPOP,                // 0o262xxx
    PDP10.opPOPJ,               // 0o263xxx
    PDP10.opJSR,                // 0o264xxx
    PDP10.opJSP,                // 0o265xxx
    PDP10.opJSA,                // 0o266xxx
    PDP10.opJRA,                // 0o267xxx
    PDP10.opADD,                // 0o270xxx
    PDP10.opADDI,               // 0o271xxx
    PDP10.opADDM,               // 0o272xxx
    PDP10.opADDB,               // 0o273xxx
    PDP10.opSUB,                // 0o274xxx
    PDP10.opSUBI,               // 0o275xxx
    PDP10.opSUBM,               // 0o276xxx
    PDP10.opSUBB,               // 0o277xxx
    PDP10.opCAI,                // 0o300xxx
    PDP10.opCAIL,               // 0o301xxx
    PDP10.opCAIE,               // 0o302xxx
    PDP10.opCAILE,              // 0o303xxx
    PDP10.opCAIA,               // 0o304xxx
    PDP10.opCAIGE,              // 0o305xxx
    PDP10.opCAIN,               // 0o306xxx
    PDP10.opCAIG,               // 0o307xxx
    PDP10.opCA,                 // 0o310xxx
    PDP10.opCAL,                // 0o311xxx
    PDP10.opCAE,                // 0o312xxx
    PDP10.opCALE,               // 0o313xxx
    PDP10.opCAA,                // 0o314xxx
    PDP10.opCAGE,               // 0o315xxx
    PDP10.opCAN,                // 0o316xxx
    PDP10.opCAG,                // 0o317xxx
    PDP10.opJUMP,               // 0o320xxx
    PDP10.opJUMPL,              // 0o321xxx
    PDP10.opJUMPE,              // 0o322xxx
    PDP10.opJUMPLE,             // 0o323xxx
    PDP10.opJUMPA,              // 0o324xxx
    PDP10.opJUMPGE,             // 0o325xxx
    PDP10.opJUMPN,              // 0o326xxx
    PDP10.opJUMPG,              // 0o327xxx
    PDP10.opSKIP,               // 0o330xxx
    PDP10.opSKIPL,              // 0o331xxx
    PDP10.opSKIPE,              // 0o332xxx
    PDP10.opSKIPLE,             // 0o333xxx
    PDP10.opSKIPA,              // 0o334xxx
    PDP10.opSKIPGE,             // 0o335xxx
    PDP10.opSKIPN,              // 0o336xxx
    PDP10.opSKIPG,              // 0o337xxx
    PDP10.opAOJ,                // 0o340xxx
    PDP10.opAOJL,               // 0o341xxx
    PDP10.opAOJE,               // 0o342xxx
    PDP10.opAOJLE,              // 0o343xxx
    PDP10.opAOJA,               // 0o344xxx
    PDP10.opAOJGE,              // 0o345xxx
    PDP10.opAOJN,               // 0o346xxx
    PDP10.opAOJG,               // 0o347xxx
    PDP10.opAOS,                // 0o350xxx
    PDP10.opAOSL,               // 0o351xxx
    PDP10.opAOSE,               // 0o352xxx
    PDP10.opAOSLE,              // 0o353xxx
    PDP10.opAOSA,               // 0o354xxx
    PDP10.opAOSGE,              // 0o355xxx
    PDP10.opAOSN,               // 0o356xxx
    PDP10.opAOSG,               // 0o357xxx
    PDP10.opSOJ,                // 0o360xxx
    PDP10.opSOJL,               // 0o361xxx
    PDP10.opSOJE,               // 0o362xxx
    PDP10.opSOJLE,              // 0o363xxx
    PDP10.opSOJA,               // 0o364xxx
    PDP10.opSOJGE,              // 0o365xxx
    PDP10.opSOJN,               // 0o366xxx
    PDP10.opSOJG,               // 0o367xxx
    PDP10.opSOS,                // 0o370xxx
    PDP10.opSOSL,               // 0o371xxx
    PDP10.opSOSE,               // 0o372xxx
    PDP10.opSOSLE,              // 0o373xxx
    PDP10.opSOSA,               // 0o374xxx
    PDP10.opSOSGE,              // 0o375xxx
    PDP10.opSOSN,               // 0o376xxx
    PDP10.opSOSG,               // 0o377xxx
    PDP10.opSETZ,               // 0o400xxx
    PDP10.opSETZI,              // 0o401xxx
    PDP10.opSETZM,              // 0o402xxx
    PDP10.opSETZB,              // 0o403xxx
    PDP10.opAND,                // 0o404xxx
    PDP10.opANDI,               // 0o405xxx
    PDP10.opANDM,               // 0o406xxx
    PDP10.opANDB,               // 0o407xxx
    PDP10.opANDCA,              // 0o410xxx
    PDP10.opANDCAI,             // 0o411xxx
    PDP10.opANDCAM,             // 0o412xxx
    PDP10.opANDCAB,             // 0o413xxx
    PDP10.opSETM,               // 0o414xxx
    PDP10.opSETMI,              // 0o415xxx
    PDP10.opSETMM,              // 0o416xxx
    PDP10.opSETMB,              // 0o417xxx
    PDP10.opANDCM,              // 0o420xxx
    PDP10.opANDCMI,             // 0o421xxx
    PDP10.opANDCMM,             // 0o422xxx
    PDP10.opANDCMB,             // 0o423xxx
    PDP10.opSETA,               // 0o424xxx
    PDP10.opSETAI,              // 0o425xxx
    PDP10.opSETAM,              // 0o426xxx
    PDP10.opSETAB,              // 0o427xxx
    PDP10.opXOR,                // 0o430xxx
    PDP10.opXORI,               // 0o431xxx
    PDP10.opXORM,               // 0o432xxx
    PDP10.opXORB,               // 0o433xxx
    PDP10.opIOR,                // 0o434xxx
    PDP10.opIORI,               // 0o435xxx
    PDP10.opIORM,               // 0o436xxx
    PDP10.opIORB,               // 0o437xxx
    PDP10.opANDCB,              // 0o440xxx
    PDP10.opANDCBI,             // 0o441xxx
    PDP10.opANDCBM,             // 0o442xxx
    PDP10.opANDCBB,             // 0o443xxx
    PDP10.opEQV,                // 0o444xxx
    PDP10.opEQVI,               // 0o445xxx
    PDP10.opEQVM,               // 0o446xxx
    PDP10.opEQVB,               // 0o447xxx
    PDP10.opSETCA,              // 0o450xxx
    PDP10.opSETCAI,             // 0o451xxx
    PDP10.opSETCAM,             // 0o452xxx
    PDP10.opSETCAB,             // 0o453xxx
    PDP10.opORCA,               // 0o454xxx
    PDP10.opORCAI,              // 0o455xxx
    PDP10.opORCAM,              // 0o456xxx
    PDP10.opORCAB,              // 0o457xxx
    PDP10.opSETCM,              // 0o460xxx
    PDP10.opSETCMI,             // 0o461xxx
    PDP10.opSETCMM,             // 0o462xxx
    PDP10.opSETCMB,             // 0o463xxx
    PDP10.opORCM,               // 0o464xxx
    PDP10.opORCMI,              // 0o465xxx
    PDP10.opORCMM,              // 0o466xxx
    PDP10.opORCMB,              // 0o467xxx
    PDP10.opORCB,               // 0o470xxx
    PDP10.opORCBI,              // 0o471xxx
    PDP10.opORCBM,              // 0o472xxx
    PDP10.opORCBB,              // 0o473xxx
    PDP10.opSETO,               // 0o474xxx
    PDP10.opSETOI,              // 0o475xxx
    PDP10.opSETOM,              // 0o476xxx
    PDP10.opSETOB,              // 0o477xxx
    PDP10.opHLL,                // 0o500xxx
    PDP10.opHLLI,               // 0o501xxx
    PDP10.opHLLM,               // 0o502xxx
    PDP10.opHLLS,               // 0o503xxx
    PDP10.opHRL,                // 0o504xxx
    PDP10.opHRLI,               // 0o505xxx
    PDP10.opHRLM,               // 0o506xxx
    PDP10.opHRLS,               // 0o507xxx
    PDP10.opHLLZ,               // 0o510xxx
    PDP10.opHLLZI,              // 0o511xxx
    PDP10.opHLLZM,              // 0o512xxx
    PDP10.opHLLZS,              // 0o513xxx
    PDP10.opHRLZ,               // 0o514xxx
    PDP10.opHRLZI,              // 0o515xxx
    PDP10.opHRLZM,              // 0o516xxx
    PDP10.opHRLZS,              // 0o517xxx
    PDP10.opHLLO,               // 0o520xxx
    PDP10.opHLLOI,              // 0o521xxx
    PDP10.opHLLOM,              // 0o522xxx
    PDP10.opHLLOS,              // 0o523xxx
    PDP10.opHRLO,               // 0o524xxx
    PDP10.opHRLOI,              // 0o525xxx
    PDP10.opHRLOM,              // 0o526xxx
    PDP10.opHRLOS,              // 0o527xxx
    PDP10.opHLLE,               // 0o530xxx
    PDP10.opHLLEI,              // 0o531xxx
    PDP10.opHLLEM,              // 0o532xxx
    PDP10.opHLLES,              // 0o533xxx
    PDP10.opHRLE,               // 0o534xxx
    PDP10.opHRLEI,              // 0o535xxx
    PDP10.opHRLEM,              // 0o536xxx
    PDP10.opHRLES,              // 0o537xxx
    PDP10.opHRR,                // 0o540xxx
    PDP10.opHRRI,               // 0o541xxx
    PDP10.opHRRM,               // 0o542xxx
    PDP10.opHRRS,               // 0o543xxx
    PDP10.opHLR,                // 0o544xxx
    PDP10.opHLRI,               // 0o545xxx
    PDP10.opHLRM,               // 0o546xxx
    PDP10.opHLRS,               // 0o547xxx
    PDP10.opHRRZ,               // 0o550xxx
    PDP10.opHRRZI,              // 0o551xxx
    PDP10.opHRRZM,              // 0o552xxx
    PDP10.opHRRZS,              // 0o553xxx
    PDP10.opHLRZ,               // 0o554xxx
    PDP10.opHLRZI,              // 0o555xxx
    PDP10.opHLRZM,              // 0o556xxx
    PDP10.opHLRZS,              // 0o557xxx
    PDP10.opHRRO,               // 0o560xxx
    PDP10.opHRROI,              // 0o561xxx
    PDP10.opHRROM,              // 0o562xxx
    PDP10.opHRROS,              // 0o563xxx
    PDP10.opHLRO,               // 0o564xxx
    PDP10.opHLROI,              // 0o565xxx
    PDP10.opHLROM,              // 0o566xxx
    PDP10.opHLROS,              // 0o567xxx
    PDP10.opHRRE,               // 0o570xxx
    PDP10.opHRREI,              // 0o571xxx
    PDP10.opHRREM,              // 0o572xxx
    PDP10.opHRRES,              // 0o573xxx
    PDP10.opHLRE,               // 0o574xxx
    PDP10.opHLREI,              // 0o575xxx
    PDP10.opHLREM,              // 0o576xxx
    PDP10.opHLRES,              // 0o577xxx
    PDP10.opTRN,                // 0o600xxx
    PDP10.opTLN,                // 0o601xxx
    PDP10.opTRNE,               // 0o602xxx
    PDP10.opTLNE,               // 0o603xxx
    PDP10.opTRNA,               // 0o604xxx
    PDP10.opTLNA,               // 0o605xxx
    PDP10.opTRNN,               // 0o606xxx
    PDP10.opTLNN,               // 0o607xxx
    PDP10.opTDN,                // 0o610xxx
    PDP10.opTSN,                // 0o611xxx
    PDP10.opTDNE,               // 0o612xxx
    PDP10.opTSNE,               // 0o613xxx
    PDP10.opTDNA,               // 0o614xxx
    PDP10.opTSNA,               // 0o615xxx
    PDP10.opTDNN,               // 0o616xxx
    PDP10.opTSNN,               // 0o617xxx
    PDP10.opTRZ,                // 0o620xxx
    PDP10.opTLZ,                // 0o621xxx
    PDP10.opTRZE,               // 0o622xxx
    PDP10.opTLZE,               // 0o623xxx
    PDP10.opTRZA,               // 0o624xxx
    PDP10.opTLZA,               // 0o625xxx
    PDP10.opTRZN,               // 0o626xxx
    PDP10.opTLZN,               // 0o627xxx
    PDP10.opTDZ,                // 0o630xxx
    PDP10.opTSZ,                // 0o631xxx
    PDP10.opTDZE,               // 0o632xxx
    PDP10.opTSZE,               // 0o633xxx
    PDP10.opTDZA,               // 0o634xxx
    PDP10.opTSZA,               // 0o635xxx
    PDP10.opTDZN,               // 0o636xxx
    PDP10.opTSZN,               // 0o637xxx
    PDP10.opTRC,                // 0o640xxx
    PDP10.opTLC,                // 0o641xxx
    PDP10.opTRCE,               // 0o642xxx
    PDP10.opTLCE,               // 0o643xxx
    PDP10.opTRCA,               // 0o644xxx
    PDP10.opTLCA,               // 0o645xxx
    PDP10.opTRCN,               // 0o646xxx
    PDP10.opTLCN,               // 0o647xxx
    PDP10.opTDC,                // 0o650xxx
    PDP10.opTSC,                // 0o651xxx
    PDP10.opTDCE,               // 0o652xxx
    PDP10.opTSCE,               // 0o653xxx
    PDP10.opTDCA,               // 0o654xxx
    PDP10.opTSCA,               // 0o655xxx
    PDP10.opTDCN,               // 0o656xxx
    PDP10.opTSCN,               // 0o657xxx
    PDP10.opTRO,                // 0o660xxx
    PDP10.opTLO,                // 0o661xxx
    PDP10.opTROE,               // 0o662xxx
    PDP10.opTLOE,               // 0o663xxx
    PDP10.opTROA,               // 0o664xxx
    PDP10.opTLOA,               // 0o665xxx
    PDP10.opTRON,               // 0o666xxx
    PDP10.opTLON,               // 0o667xxx
    PDP10.opTDO,                // 0o670xxx
    PDP10.opTSO,                // 0o671xxx
    PDP10.opTDOE,               // 0o672xxx
    PDP10.opTSOE,               // 0o673xxx
    PDP10.opTDOA,               // 0o674xxx
    PDP10.opTSOA,               // 0o675xxx
    PDP10.opTDON,               // 0o676xxx
    PDP10.opTSON,               // 0o677xxx
    PDP10.opIO,                 // 0o700xx
    PDP10.opIO,                 // 0o701xxx
    PDP10.opIO,                 // 0o702xxx
    PDP10.opIO,                 // 0o703xxx
    PDP10.opIO,                 // 0o704xxx
    PDP10.opIO,                 // 0o705xxx
    PDP10.opIO,                 // 0o706xxx
    PDP10.opIO,                 // 0o707xxx
    PDP10.opIO,                 // 0o710xxx
    PDP10.opIO,                 // 0o711xxx
    PDP10.opIO,                 // 0o712xxx
    PDP10.opIO,                 // 0o713xxx
    PDP10.opIO,                 // 0o714xxx
    PDP10.opIO,                 // 0o715xxx
    PDP10.opIO,                 // 0o716xxx
    PDP10.opIO,                 // 0o717xxx
    PDP10.opIO,                 // 0o720xxx
    PDP10.opIO,                 // 0o721xxx
    PDP10.opIO,                 // 0o722xxx
    PDP10.opIO,                 // 0o723xxx
    PDP10.opIO,                 // 0o724xxx
    PDP10.opIO,                 // 0o725xxx
    PDP10.opIO,                 // 0o726xxx
    PDP10.opIO,                 // 0o727xxx
    PDP10.opIO,                 // 0o730xxx
    PDP10.opIO,                 // 0o731xxx
    PDP10.opIO,                 // 0o732xxx
    PDP10.opIO,                 // 0o733xxx
    PDP10.opIO,                 // 0o734xxx
    PDP10.opIO,                 // 0o735xxx
    PDP10.opIO,                 // 0o736xxx
    PDP10.opIO,                 // 0o737xxx
    PDP10.opIO,                 // 0o740xxx
    PDP10.opIO,                 // 0o741xxx
    PDP10.opIO,                 // 0o742xxx
    PDP10.opIO,                 // 0o743xxx
    PDP10.opIO,                 // 0o744xxx
    PDP10.opIO,                 // 0o745xxx
    PDP10.opIO,                 // 0o746xxx
    PDP10.opIO,                 // 0o747xxx
    PDP10.opIO,                 // 0o750xxx
    PDP10.opIO,                 // 0o751xxx
    PDP10.opIO,                 // 0o752xxx
    PDP10.opIO,                 // 0o753xxx
    PDP10.opIO,                 // 0o754xxx
    PDP10.opIO,                 // 0o755xxx
    PDP10.opIO,                 // 0o756xxx
    PDP10.opIO,                 // 0o757xxx
    PDP10.opIO,                 // 0o760xxx
    PDP10.opIO,                 // 0o761xxx
    PDP10.opIO,                 // 0o762xxx
    PDP10.opIO,                 // 0o763xxx
    PDP10.opIO,                 // 0o764xxx
    PDP10.opIO,                 // 0o765xxx
    PDP10.opIO,                 // 0o766xxx
    PDP10.opIO,                 // 0o767xxx
    PDP10.opIO,                 // 0o770xxx
    PDP10.opIO,                 // 0o771xxx
    PDP10.opIO,                 // 0o772xxx
    PDP10.opIO,                 // 0o773xxx
    PDP10.opIO,                 // 0o774xxx
    PDP10.opIO,                 // 0o775xxx
    PDP10.opIO,                 // 0o776xxx
    PDP10.opIO                  // 0o777xxx
];
